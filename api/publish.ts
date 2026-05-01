// Vercel Serverless Function - 博客文章发布接口
// 通过 GitHub API 自动提交文章到仓库
// 支持 MiniMax 文生图 API 自动生成文章封面

import type { VercelRequest, VercelResponse } from '@vercel/node';

// 配置
const CONFIG = {
  githubToken: process.env.GITHUB_TOKEN || '',
  owner: 'jauiry',
  repo: 'boke',
  path: 'src/data/blogData.ts',
  secret: process.env.SECRET || '',
  minimaxApiKey: process.env.MINIMAX_API_KEY || '',
};

// 生成唯一 ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// 生成 slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50);
}

// 转义模板字符串中的特殊字符
function escapeTemplateString(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$');
}

// 使用 MiniMax API 生成文章封面图片（返回 base64 格式）
async function generateCoverImage(title: string): Promise<string | null> {
  try {
    // 构建图片生成提示词
    const prompt = `Tech blog article cover image, "${title}". Modern minimalist style, abstract technology concept, clean design with purple and blue gradient background, professional software engineering theme, no text, high quality, 16:9 aspect ratio`;

    const response = await fetch('https://api.minimaxi.com/v1/image_generation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CONFIG.minimaxApiKey}`,
      },
      body: JSON.stringify({
        model: 'image-01',
        prompt: prompt,
        aspect_ratio: '16:9',
        response_format: 'base64',  // 使用 base64 格式，永久有效
        n: 1,
        prompt_optimizer: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('MiniMax API 错误:', errorText);
      return null;
    }

    const data = await response.json();

    if (data.base_resp && data.base_resp.status_code !== 0) {
      console.error('MiniMax API 返回错误:', data.base_resp.status_msg);
      return null;
    }

    // 返回生成的图片 base64 数据
    if (data.data && data.data.image_base64 && data.data.image_base64.length > 0) {
      const base64Data = data.data.image_base64[0];
      console.log('封面图片生成成功，长度:', base64Data.length);
      // 返回 data URI 格式
      return `data:image/jpeg;base64,${base64Data}`;
    }

    return null;
  } catch (error) {
    console.error('生成封面图片失败:', error);
    return null;
  }
}

// 获取当前文件内容和 SHA
async function getFileContent(): Promise<{ content: string; sha: string } | null> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/contents/${CONFIG.path}`,
      {
        headers: {
          'Authorization': `token ${CONFIG.githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    if (!response.ok) {
      console.error('获取文件失败:', await response.text());
      return null;
    }

    const data = await response.json();
    const content = Buffer.from(data.content, 'base64').toString('utf-8');
    return { content, sha: data.sha };
  } catch (error) {
    console.error('获取文件错误:', error);
    return null;
  }
}

// 提交更新到 GitHub
async function updateFile(content: string, sha: string, message: string): Promise<boolean> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/contents/${CONFIG.path}`,
      {
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
      }
    );

    if (!response.ok) {
      console.error('提交失败:', await response.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error('提交错误:', error);
    return false;
  }
}

// 创建新文章对象
function createPostObject(
  title: string,
  content: string,
  categoryId: string,
  tags: string[],
  featured: boolean = false,
  coverImage?: string | null
) {
  const id = generateId();
  const slug = generateSlug(title) || `post-${id}`;
  const excerpt = content.slice(0, 150).replace(/[#*\[\]`]/g, '') + '...';
  const readTime = Math.max(1, Math.ceil(content.length / 300));
  const now = new Date().toISOString();

  // 转义内容中的特殊字符
  const escapedContent = escapeTemplateString(content);

  return {
    id,
    title,
    slug,
    excerpt,
    content: escapedContent,
    coverImage: coverImage || undefined,
    categoryId,
    tags,
    featured,
    readTime,
    createdAt: now,
    updatedAt: now,
  };
}

// 解析现有的 blogData.ts 并插入新文章
function insertNewPost(fileContent: string, post: any): string {
  // 找到 posts 数组的定义位置
  const postsMatch = fileContent.match(/export const posts: Post\[\] = \[/);
  if (!postsMatch) {
    throw new Error('无法找到 posts 数组定义');
  }

  const insertPosition = postsMatch.index! + postsMatch[0].length;

  // 生成新文章代码
  const coverImageLine = post.coverImage ? `\n    coverImage: '${post.coverImage}',` : '';
  const newPostCode = `
  {
    id: '${post.id}',
    title: '${post.title.replace(/'/g, "\\'")}',
    slug: '${post.slug}',
    excerpt: '${post.excerpt.replace(/'/g, "\\'")}',
    content: \`${post.content}\`,${coverImageLine}
    author: {
      id: '1',
      name: '郏祥瑞',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop',
      bio: '软件测试工程师，4年测试经验',
      social: { github: '', twitter: '', email: '1102684926@qq.com' },
    },
    tags: [${post.tags.map((t: string) => `
      { id: '${t}', name: '${getTagName(t)}', color: '${getTagColor(t)}' }`).join(',')}
    ],
    category: ${getCategoryCode(post.categoryId)},
    createdAt: '${post.createdAt}',
    updatedAt: '${post.updatedAt}',
    readTime: ${post.readTime},
    views: 0,
    likes: 0,
    comments: [],
    featured: ${post.featured},
  },`;

  // 插入到数组开头
  return fileContent.slice(0, insertPosition) + newPostCode + fileContent.slice(insertPosition);
}

// 获取标签名称
function getTagName(tagId: string): string {
  const tags: Record<string, string> = {
    '1': '测试',
    '2': '技术',
    '3': '职场',
    '4': 'JMeter',
    '5': '性能测试',
  };
  return tags[tagId] || '其他';
}

// 获取标签颜色
function getTagColor(tagId: string): string {
  const colors: Record<string, string> = {
    '1': '#61DAFB',
    '2': '#3178C6',
    '3': '#339933',
    '4': '#FF6B6B',
    '5': '#F39C12',
  };
  return colors[tagId] || '#888888';
}

// 获取分类代码
function getCategoryCode(categoryId: string): string {
  const categories: Record<string, string> = {
    '1': `{ id: '1', name: '技术分享', description: '测试技术和经验分享', icon: 'Code' }`,
    '2': `{ id: '2', name: '职场感悟', description: '工作心得和职业发展', icon: 'Coffee' }`,
  };
  return categories[categoryId] || categories['1'];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed. Use POST.' 
    });
  }

  try {
    const { title, content, categoryId, tags, featured, secret } = req.body;

    // 验证密码
    if (secret !== CONFIG.secret) {
      return res.status(401).json({ 
        success: false, 
        error: 'Unauthorized: Invalid secret' 
      });
    }

    // 验证必填字段
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request: title and content are required'
      });
    }

    // 获取当前文件内容
    const fileData = await getFileContent();
    if (!fileData) {
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch current file content'
      });
    }

    // 使用 MiniMax API 生成封面图片
    console.log('正在为文章生成封面图片...');
    const coverImage = await generateCoverImage(title);

    // 创建新文章
    const newPost = createPostObject(
      title,
      content,
      categoryId || '1',
      tags || ['1'],
      featured || false,
      coverImage
    );

    // 生成新文件内容
    const newContent = insertNewPost(fileData.content, newPost);

    // 提交到 GitHub
    const commitMessage = `Add post: ${title}`;
    const success = await updateFile(newContent, fileData.sha, commitMessage);

    if (!success) {
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to commit changes to GitHub' 
      });
    }

    // 返回成功响应
    return res.status(200).json({
      success: true,
      message: '文章发布成功',
      post: {
        id: newPost.id,
        title: newPost.title,
        slug: newPost.slug,
        excerpt: newPost.excerpt,
        coverImage: newPost.coverImage,
      },
      postUrl: `https://www.mxqys.xyz/${newPost.slug}`,
      adminUrl: `https://vercel.com/dashboard`,
    });

  } catch (error) {
    console.error('发布错误:', error);
    return res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}
