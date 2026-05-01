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
function parsePostFields(block: string): Record<string, string> {
  const fields: Record<string, string> = {};

  // 匹配单行字符串字段: key: 'value'
  const singleLineFields = ['id', 'title', 'slug', 'excerpt', 'coverImage', 'createdAt', 'updatedAt'];
  for (const field of singleLineFields) {
    const m = block.match(new RegExp(`${field}:\\s*'([^']*)'`));
    if (m) fields[field] = m[1];
  }

  // 匹配模板字符串 content: `...`
  const contentMatch = block.match(/content:\s*`([\s\S]*?)`\s*(?:,|$)/);
  if (contentMatch) fields['content'] = contentMatch[1];

  // 匹配数字字段
  const readTimeMatch = block.match(/readTime:\s*(\d+)/);
  if (readTimeMatch) fields['readTime'] = readTimeMatch[1];

  // 匹配布尔字段
  const featuredMatch = block.match(/featured:\s*(true|false)/);
  if (featuredMatch) fields['featured'] = featuredMatch[1];

  return fields;
}

// 从 posts 数组中提取单个 post 块
function extractPostBlock(postsContent: string, slug: string): string | null {
  // 找到 slug 位置
  const slugIdx = postsContent.indexOf(`slug: '${slug}'`);
  if (slugIdx === -1) return null;

  // 从 slug 位置向前找最近的 {
  let start = slugIdx;
  while (start > 0 && postsContent[start] !== '{') start--;

  // 从 { 开始匹配完整的对象（处理嵌套大括号）
  let depth = 0;
  let end = start;
  for (let i = start; i < postsContent.length; i++) {
    if (postsContent[i] === '{') depth++;
    else if (postsContent[i] === '}') {
      depth--;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    }
  }

  return postsContent.slice(start, end);
}

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

  // 提取 posts 数组内容
  const postsMatch = content.match(/export const posts: Post\[\] = \[([\s\S]*?)\];\s*$/);
  if (!postsMatch) {
    throw new Error('Cannot parse posts data');
  }

  const postBlock = extractPostBlock(postsMatch[1], slug);
  if (!postBlock) return null;

  const fields = parsePostFields(postBlock);
  if (!fields['id'] || !fields['title']) return null;

  const post = {
    id: fields['id'],
    title: fields['title'],
    slug: fields['slug'] || slug,
    excerpt: fields['excerpt'] || '',
    content: fields['content'] || '',
    coverImage: fields['coverImage'] || null,
    createdAt: fields['createdAt'] || '',
    readTime: parseInt(fields['readTime'] || '1'),
    featured: fields['featured'] === 'true',
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
