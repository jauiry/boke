// Vercel Serverless Function - 博客文章详情接口
// 支持全文加载，按 slug 获取单篇文章

import type { VercelRequest, VercelResponse } from '@vercel/node';

const CONFIG = {
  githubToken: process.env.GITHUB_TOKEN || '',
  owner: 'jauiry',
  repo: 'boke',
  branch: 'master',
};

// 内存缓存
interface CacheEntry {
  data: any;
  timestamp: number;
}

const fullPostCache: Map<string, CacheEntry> = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5分钟缓存
const RATE_LIMIT_WINDOW = 3000;
const rateLimitMap: Map<string, number[]> = new Map();

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(key) || [];
  const validTimestamps = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW);

  if (validTimestamps.length >= 3) {
    return false;
  }

  validTimestamps.push(now);
  rateLimitMap.set(key, validTimestamps);
  return true;
}

function getCache(key: string): any | null {
  const entry = fullPostCache.get(key);
  if (!entry) return null;

  if (Date.now() - entry.timestamp > CACHE_TTL) {
    fullPostCache.delete(key);
    return null;
  }

  return entry.data;
}

function setCache(key: string, data: any): void {
  fullPostCache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

// 从 blogData.ts 解析单篇文章
async function fetchPostBySlug(slug: string): Promise<any> {
  const cacheKey = `post-${slug}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  if (!checkRateLimit('github-full')) {
    throw new Error('Rate limit exceeded');
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
  const postsMatch = content.match(/export const posts: Post\[\] = \[([\s\S]*?)\];\s*$/);
  if (!postsMatch) {
    throw new Error('Cannot parse posts data');
  }

  // 查找匹配 slug 的文章（简化解析）
  const postBlockMatch = content.match(
    new RegExp(`id: '([^']*)'[^}]*?title: '([^']*)'[^}]*?slug: '${slug}'[^}]*?excerpt: '([^']*)'[^}]*?content: \`([\s\S]*?)\`[^}]*?coverImage: '([^']*)'`, 'm'
  );

  if (!postBlockMatch) {
    return null;
  }

  const post = {
    id: postBlockMatch[1],
    title: postBlockMatch[2],
    slug: postBlockMatch[3],
    excerpt: postBlockMatch[4],
    content: postBlockMatch[5],
    coverImage: postBlockMatch[6],
  };

  setCache(cacheKey, post);
  return post;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { slug } = req.query;

  if (!slug || typeof slug !== 'string') {
    return res.status(400).json({ error: 'Slug is required' });
  }

  // 更长的缓存时间（详情页变动少）
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');

  try {
    const post = await fetchPostBySlug(slug);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error('Fetch post error:', error);

    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
