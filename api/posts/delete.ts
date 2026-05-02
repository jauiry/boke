// Vercel Serverless Function - 删除文章
import type { VercelRequest, VercelResponse } from '@vercel/node';

const CONFIG = {
  githubToken: process.env.GITHUB_TOKEN || '',
  owner: 'jauiry',
  repo: 'boke',
  path: 'src/data/blogData.ts',
  branch: 'master',
  secret: process.env.SECRET || '',
};

async function getFileContent(): Promise<{ content: string; sha: string } | null> {
  const url = `https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/contents/${CONFIG.path}`;
  const headers: HeadersInit = {
    'Authorization': `token ${CONFIG.githubToken}`,
    'Accept': 'application/vnd.github.v3+json',
  };
  const response = await fetch(url, { headers });
  if (!response.ok) return null;
  const data = await response.json();
  return { content: Buffer.from(data.content, 'base64').toString('utf-8'), sha: data.sha };
}

async function updateFile(content: string, sha: string, message: string): Promise<boolean> {
  const url = `https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/contents/${CONFIG.path}`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `token ${CONFIG.githubToken}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      content: Buffer.from(content).toString('base64'),
      sha,
    }),
  });
  return response.ok;
}

// 删除 slug 对应的文章块
function removePostBlock(fileContent: string, slug: string): string | null {
  const postsMatch = fileContent.match(/export const posts: Post\[\] = \[([\s\S]*?)\];\s*$/);
  if (!postsMatch) return null;
  const postsContent = postsMatch[1];

  // 定位 slug
  const slugIdx = postsContent.indexOf(`slug: '${slug}'`);
  if (slugIdx === -1) return null;

  // 向前找到块开始的 {
  let start = slugIdx;
  while (start > 0 && postsContent[start] !== '{') start--;

  // 匹配完整对象
  let depth = 0;
  let end = start;
  for (let i = start; i < postsContent.length; i++) {
    if (postsContent[i] === '{') depth++;
    else if (postsContent[i] === '}') {
      depth--;
      if (depth === 0) { end = i + 1; break; }
    }
  }

  // 删除块（包括后面的逗号和空白）
  let afterEnd = end;
  while (afterEnd < postsContent.length && (postsContent[afterEnd] === ',' || postsContent[afterEnd] === ' ' || postsContent[afterEnd] === '\n' || postsContent[afterEnd] === '\r')) {
    afterEnd++;
  }

  // 前面的空白/换行
  let beforeStart = start - 1;
  while (beforeStart > 0 && (postsContent[beforeStart] === ' ' || postsContent[beforeStart] === '\n' || postsContent[beforeStart] === '\r')) {
    beforeStart--;
  }

  const before = fileContent.slice(0, postsMatch.index! + postsMatch[0].indexOf('[') + 1 + beforeStart + 1);
  const after = fileContent.slice(postsMatch.index! + postsMatch[0].indexOf('[') + 1 + afterEnd);
  return before + after;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'DELETE') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { slug, secret } = req.body;

    if (secret !== CONFIG.secret) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    if (!slug) {
      return res.status(400).json({ success: false, error: 'slug required' });
    }

    const fileData = await getFileContent();
    if (!fileData) {
      return res.status(500).json({ success: false, error: 'Failed to fetch file' });
    }

    const newContent = removePostBlock(fileData.content, slug);
    if (!newContent) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    const success = await updateFile(newContent, fileData.sha, `Delete post: ${slug}`);
    if (!success) {
      return res.status(500).json({ success: false, error: 'Failed to commit' });
    }

    return res.status(200).json({
      success: true,
      message: '文章已删除',
    });
  } catch (error) {
    console.error('Delete error:', error);
    return res.status(500).json({ success: false, error: 'Delete failed' });
  }
}
