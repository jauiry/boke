// Vercel Serverless Function - 搜索接口
// 支持 title 和 excerpt 关键词匹配

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

const searchCache: Map<string, CacheEntry> = new Map();
const CACHE_TTL = 60 * 1000; // 1分钟缓存

function getCache(key: string): any | null {
  const entry = searchCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    searchCache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key: string, data: any): void {
  searchCache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

// 简单的中文/英文分词
function tokenize(text: string): string[] {
  // 中文：按字符分词（简化版）
  // 英文：按空格和特殊符号分词
  const chinese = text.match(/[\u4e00-\u9fa5]+/g) || [];
  const english = text.toLowerCase().split(/[\s\W]+/).filter(w => w.length > 1);

  return [...new Set([...chinese.join('').split(''), ...english])];
}

// 检查查询词是否匹配
function matches(query: string, text: string): boolean {
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();

  // 精确包含
  if (lowerText.includes(lowerQuery)) return true;

  // 分词匹配（至少一个词匹配）
  const queryTokens = tokenize(query);
  const textTokens = tokenize(text);

  return queryTokens.some(qt =>
    textTokens.some(tt => tt.includes(qt) || qt.includes(tt))
  );
}

// 搜索文章
async function searchPosts(query: string): Promise<any[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const cacheKey = query.trim().toLowerCase();
  const cached = getCache(cacheKey);
  if (cached) return cached;

  // 获取博客数据
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

  // 解析文章数据
  const idMatches = content.matchAll(/id:\s*'([^']*)'/g);
  const titleMatches = content.matchAll(/title:\s*'([^']*)'/g);
  const slugMatches = content.matchAll(/slug:\s*'([^']*)'/g);
  const excerptMatches = content.matchAll(/excerpt:\s*'([^']*)'/g);
  const createdAtMatches = content.matchAll(/createdAt:\s*'([^']*)'/g);
  const readTimeMatches = content.matchAll(/readTime:\s*(\d+)/g);
  const coverImageMatches = content.matchAll(/coverImage:\s*'([^']*)'/g);
  const featuredMatches = content.matchAll(/featured:\s*(true|false)/g);

  const ids = [...idMatches].map(m => m[1]);
  const titles = [...titleMatches].map(m => m[1]);
  const slugs = [...slugMatches].map(m => m[1]);
  const excerpts = [...excerptMatches].map(m => m[1]);
  const createdAts = [...createdAtMatches].map(m => m[1]);
  const readTimes = [...readTimeMatches].map(m => parseInt(m[1]));
  const coverImages = [...coverImageMatches].map(m => m[1]);
  const featureds = [...featuredMatches].map(m => m[1] === 'true');

  const count = Math.min(ids.length, titles.length, slugs.length);
  const allPosts: any[] = [];

  for (let i = 0; i < count; i++) {
    allPosts.push({
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

  // 搜索匹配
  const queryLower = query.trim().toLowerCase();
  const results = allPosts.filter(post =>
    matches(queryLower, post.title) ||
    matches(queryLower, post.excerpt)
  );

  // 缓存结果
  setCache(cacheKey, results);

  return results;
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

  const { q } = req.query;

  if (!q || typeof q !== 'string' || q.trim().length < 2) {
    return res.status(200).json({
      success: true,
      data: [],
      query: q || '',
    });
  }

  // 缓存策略
  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');

  try {
    const results = await searchPosts(q);

    return res.status(200).json({
      success: true,
      data: results,
      query: q,
      count: results.length,
    });
  } catch (error) {
    console.error('Search error:', error);

    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Search failed',
    });
  }
}
