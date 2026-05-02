// Vercel Serverless Function - 编辑文章
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

// 找到并替换 slug 对应的文章块
function replacePostBlock(fileContent: string, slug: string, newBlock: string): string | null {
  const postsMatch = fileContent.match(/export const posts: Post\[\] = \[([\s\S]*?)\];\s*$/);
  if (!postsMatch) return null;
  const postsContent = postsMatch[1];

  // 定位 slug
  const slugIdx = postsContent.indexOf(`slug: '${slug}'`);
  if (slugIdx === -1) return null;

  // 向前找到块开始的 {
  let start = slugIdx;
  while (start > 0 && postsContent[start] !== '{') start--;

  // 匹配完整对象（处理嵌套）
  let depth = 0;
  let end = start;
  for (let i = start; i < postsContent.length; i++) {
    if (postsContent[i] === '{') depth++;
    else if (postsContent[i] === '}') {
      depth--;
      if (depth === 0) { end = i + 1; break; }
    }
  }

  // 替换
  const before = fileContent.slice(0, postsMatch.index! + postsMatch[0].indexOf('[') + 1 + start);
  const after = fileContent.slice(postsMatch.index! + postsMatch[0].indexOf('[') + 1 + end);
  return before + newBlock + after;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { slug, title, content, categoryId, tags, featured, secret } = req.body;

    if (secret !== CONFIG.secret) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    if (!slug || !title || !content) {
      return res.status(400).json({ success: false, error: 'slug, title, content required' });
    }

    const fileData = await getFileContent();
    if (!fileData) {
      return res.status(500).json({ success: false, error: 'Failed to fetch file' });
    }

    // 生成新的文章块（保留原 slug）
    const excerpt = content.slice(0, 150).replace(/[#*\[\]`]/g, '') + '...';
    const readTime = Math.max(1, Math.ceil(content.length / 300));
    const now = new Date().toISOString();
    const escapedContent = content.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');

    const tagsMap: Record<string, { name: string; color: string }> = {
      '1': { name: '测试', color: '#61DAFB' },
      '2': { name: '技术', color: '#3178C6' },
      '3': { name: '职场', color: '#339933' },
      '4': { name: 'JMeter', color: '#FF6B6B' },
      '5': { name: '性能测试', color: '#F39C12' },
    };

    const categoriesMap: Record<string, string> = {
      '1': `{ id: '1', name: '技术分享', description: '测试技术和经验分享', icon: 'Code' }`,
      '2': `{ id: '2', name: '职场感悟', description: '工作心得和职业发展', icon: 'Coffee' }`,
    };

    const tagStr = (tags || ['1']).map((t: string) => {
      const info = tagsMap[t] || { name: '其他', color: '#888888' };
      return `\n      { id: '${t}', name: '${info.name}', color: '${info.color}' }`;
    }).join(',');

    const categoryStr = categoriesMap[categoryId || '1'] || categoriesMap['1'];

    const newBlock = `{
    id: '${Date.now().toString(36)}',
    title: '${title.replace(/'/g, "\\'")}',
    slug: '${slug}',
    excerpt: '${excerpt.replace(/'/g, "\\'")}',
    content: \`${escapedContent}\`,
    author: {
      id: '1',
      name: '郏祥瑞',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop',
      bio: '软件测试工程师，4年测试经验',
      social: { github: 'https://github.com/mxqys', twitter: 'https://twitter.com/mxqys', email: '1102684926@qq.com' },
    },
    tags: [${tagStr}
    ],
    category: ${categoryStr},
    createdAt: '${now}',
    updatedAt: '${now}',
    readTime: ${readTime},
    views: 0,
    likes: 0,
    comments: [],
    featured: ${featured || false},
  },`;

    const newContent = replacePostBlock(fileData.content, slug, newBlock);
    if (!newContent) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    const success = await updateFile(newContent, fileData.sha, `Update post: ${title}`);
    if (!success) {
      return res.status(500).json({ success: false, error: 'Failed to commit' });
    }

    return res.status(200).json({
      success: true,
      message: '文章更新成功',
      postUrl: `https://www.mxqys.xyz/${slug}`,
    });
  } catch (error) {
    console.error('Edit error:', error);
    return res.status(500).json({ success: false, error: 'Edit failed' });
  }
}
