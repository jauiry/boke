// Vercel Serverless Function - 博客文章列表接口
// 带缓存的 SWR 策略，优化 GitHub API 响应慢问题

import type { VercelRequest, VercelResponse } from '@vercel/node';

// 配置
const CONFIG = {
  githubToken: process.env.GITHUB_TOKEN || '',
  owner: 'jauiry',
  repo: 'boke',
  branch: 'master',
};

// 内存缓存（防止高频调用 GitHub API）
interface CacheEntry {
  data: any;
  timestamp: number;
}

const memoryCache: Map<string, CacheEntry> = new Map();
const CACHE_TTL = 60 * 1000; // 1分钟内相同请求直接返回缓存
const RATE_LIMIT_WINDOW = 5000; // 5秒内最多5次请求
const rateLimitMap: Map<string, number[]> = new Map();

// 速率限制检查
function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(key) || [];

  // 清理过期时间戳
  const validTimestamps = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW);

  if (validTimestamps.length >= 5) {
    return false; // 触发限流
  }

  validTimestamps.push(now);
  rateLimitMap.set(key, validTimestamps);
  return true;
}

// 获取缓存
function getCache(key: string): any | null {
  const entry = memoryCache.get(key);
  if (!entry) return null;

  if (Date.now() - entry.timestamp > CACHE_TTL) {
    memoryCache.delete(key);
    return null;
  }

  return entry.data;
}

// 设置缓存
function setCache(key: string, data: any): void {
  memoryCache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

// 获取博客数据文件
async function fetchBlogData(): Promise<any> {
  // 先检查内存缓存
  const cached = getCache('blogData');
  if (cached) return cached;

  // 检查速率限制
  if (!checkRateLimit('github')) {
    const staleCache = memoryCache.get('blogDataStale');
    if (staleCache) return staleCache.data;
    throw new Error('Rate limit exceeded, please try again later');
  }

  const url = `https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/contents/src/data/blogData.ts?ref=${CONFIG.branch}`;

  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
  };

  if (CONFIG.githubToken) {
    headers['Authorization'] = `token ${CONFIG.githubToken}`;
  }

  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }

  const data = await response.json();
  const content = Buffer.from(data.content, 'base64').toString('utf-8');

  // 提取 posts 数组
  const postsMatch = content.match(/export const posts: Post\[\] = \[([\s\S]*?)\];/);
  if (!postsMatch) {
    throw new Error('Cannot parse posts data');
  }

  // 简单解析（实际项目中建议用更健壮的解析库）
  const postsContent = postsMatch[1];

  // 保存为缓存（包括 stale 版本用于降级）
  const result = parsePosts(postsContent);
  setCache('blogData', result);
  memoryCache.set('blogDataStale', {
    data: result,
    timestamp: Date.now() - CACHE_TTL - 1000, // 标记为已过期但可用
  });

  return result;
}

// 解析 posts 内容（轻量化版本 - 列表页使用）
function parsePosts(content: string): any[] {
  const posts: any[] = [];

  // 使用更简单的正则单独提取每个字段
  const idMatches = content.matchAll(/id:\s*'([^']*)'/g);
  const titleMatches = content.matchAll(/title:\s*'([^']*)'/g);
  const slugMatches = content.matchAll(/slug:\s*'([^']*)'/g);
  const excerptMatches = content.matchAll(/excerpt:\s*'([^']*)'/g);
  const createdAtMatches = content.matchAll(/createdAt:\s*'([^']*)'/g);
  const readTimeMatches = content.matchAll(/readTime:\s*(\d+)/g);
  const coverImageMatches = content.matchAll(/coverImage:\s*'([^']*)'/g);
  const featuredMatches = content.matchAll(/featured:\s*(true|false)/g);

  // 转换为数组
  const ids = [...idMatches].map(m => m[1]);
  const titles = [...titleMatches].map(m => m[1]);
  const slugs = [...slugMatches].map(m => m[1]);
  const excerpts = [...excerptMatches].map(m => m[1]);
  const createdAts = [...createdAtMatches].map(m => m[1]);
  const readTimes = [...readTimeMatches].map(m => parseInt(m[1]));
  const coverImages = [...coverImageMatches].map(m => m[1]);
  const featureds = [...featuredMatches].map(m => m[1] === 'true');

  // 组合成一个posts数组
  const count = Math.min(ids.length, titles.length, slugs.length);

  for (let i = 0; i < count; i++) {
    posts.push({
      id: ids[i],
      title: titles[i],
      slug: slugs[i],
      excerpt: excerpts[i] || '',
      createdAt: createdAts[i] || '',
      readTime: readTimes[i] || 1,
      coverImage: coverImages[i] || '',
      featured: featureds[i] || false,
    });
  }

  return posts;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 设置 CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // SWR 缓存策略：s-maxage=60, stale-while-revalidate=300
    // 用户先拿到缓存（秒开），后台静默更新
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');

    const data = await fetchBlogData();

    return res.status(200).json({
      success: true,
      data,
      source: 'cache',
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Fetch posts error:', error);

    // 尝试返回 stale 缓存
    const staleData = memoryCache.get('blogDataStale');
    if (staleData) {
      res.setHeader('X-Data-Stale', 'true');
      return res.status(200).json({
        success: true,
        data: staleData.data,
        source: 'stale-cache',
        timestamp: Date.now(),
      });
    }

    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
