// Vercel Serverless Function - RSS Feed
import type { VercelRequest, VercelResponse } from '@vercel/node';

const CONFIG = {
  githubToken: process.env.GITHUB_TOKEN || '',
  owner: 'jauiry',
  repo: 'boke',
  branch: 'master',
  siteUrl: 'https://www.mxqys.xyz',
  title: '郏祥瑞的技术博客',
  description: '分享软件测试、性能测试、接口自动化等技术文章',
};

// 内存缓存
let cachedRss: { xml: string; timestamp: number } | null = null;
const RSS_CACHE_TTL = 30 * 60 * 1000; // 30 分钟

// 从 blogData.ts 解析文章列表
async function fetchPosts(): Promise<any[]> {
  const url = `https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/contents/src/data/blogData.ts?ref=${CONFIG.branch}`;

  const headers: HeadersInit = { 'Accept': 'application/vnd.github.v3+json' };
  if (CONFIG.githubToken) {
    headers['Authorization'] = `token ${CONFIG.githubToken}`;
  }

  const response = await fetch(url, { headers });
  if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);

  const data = await response.json();
  const content = Buffer.from(data.content, 'base64').toString('utf-8');

  const idMatches = content.matchAll(/id:\s*'([^']*)'/g);
  const titleMatches = content.matchAll(/title:\s*'([^']*)'/g);
  const slugMatches = content.matchAll(/slug:\s*'([^']*)'/g);
  const excerptMatches = content.matchAll(/excerpt:\s*'([^']*)'/g);
  const createdAtMatches = content.matchAll(/createdAt:\s*'([^']*)'/g);

  const ids = [...idMatches].map(m => m[1]);
  const titles = [...titleMatches].map(m => m[1]);
  const slugs = [...slugMatches].map(m => m[1]);
  const excerpts = [...excerptMatches].map(m => m[1]);
  const createdAts = [...createdAtMatches].map(m => m[1]);

  const count = Math.min(ids.length, titles.length, slugs.length, excerpts.length, createdAts.length);
  const posts: any[] = [];

  for (let i = 0; i < count; i++) {
    posts.push({
      id: ids[i],
      title: titles[i],
      slug: slugs[i],
      excerpt: excerpts[i] || '',
      createdAt: createdAts[i] || '',
    });
  }

  return posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function generateRss(posts: any[]): string {
  const items = posts.map(post => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${CONFIG.siteUrl}/${post.slug}</link>
      <guid isPermaLink="true">${CONFIG.siteUrl}/${post.slug}</guid>
      <description>${escapeXml(post.excerpt)}</description>
      <pubDate>${new Date(post.createdAt).toUTCString()}</pubDate>
      <author>1102684926@qq.com (郏祥瑞)</author>
    </item>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(CONFIG.title)}</title>
    <link>${CONFIG.siteUrl}</link>
    <description>${escapeXml(CONFIG.description)}</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${CONFIG.siteUrl}/api/rss.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 检查缓存
    if (cachedRss && Date.now() - cachedRss.timestamp < RSS_CACHE_TTL) {
      res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
      res.setHeader('Cache-Control', 'public, s-maxage=1800');
      return res.status(200).send(cachedRss.xml);
    }

    const posts = await fetchPosts();
    const xml = generateRss(posts);

    cachedRss = { xml, timestamp: Date.now() };

    res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=1800');
    return res.status(200).send(xml);
  } catch (error) {
    console.error('RSS error:', error);
    // 返回过期的缓存
    if (cachedRss) {
      res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
      return res.status(200).send(cachedRss.xml);
    }
    return res.status(500).json({ error: 'Failed to generate RSS' });
  }
}
