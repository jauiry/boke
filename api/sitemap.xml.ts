// Vercel Serverless Function - 动态站点地图生成
// 自动从 GitHub 仓库遍历所有文章链接

import type { VercelRequest, VercelResponse } from '@vercel/node';

const CONFIG = {
  githubToken: process.env.GITHUB_TOKEN || '',
  owner: 'jauiry',
  repo: 'boke',
  branch: 'master',
};

const siteUrl = 'https://www.mxqys.xyz';
const currentDate = new Date().toISOString();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 只允许 GET 请求
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
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

    // 提取 slug 和 createdAt
    const slugMatches = content.matchAll(/slug:\s*'([^']*)'/g);
    const createdAtMatches = content.matchAll(/createdAt:\s*'([^']*)'/g);
    const featuredMatches = content.matchAll(/featured:\s*(true|false)/g);

    const slugs = [...slugMatches].map(m => m[1]);
    const createdAts = [...createdAtMatches].map(m => m[1]);
    const featured = [...featuredMatches].map(m => m[1] === 'true');

    // 生成 XML
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // 首页
    xml += '  <url>\n';
    xml += `    <loc>${siteUrl}/</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += '    <changefreq>daily</changefreq>\n';
    xml += '    <priority>1.0</priority>\n';
    xml += '  </url>\n';

    // 文章页面
    for (let i = 0; i < slugs.length; i++) {
      const slug = slugs[i];
      const createdAt = createdAts[i] || currentDate;
      const isFeatured = featured[i] || false;

      xml += '  <url>\n';
      xml += `    <loc>${siteUrl}/${slug}</loc>\n`;
      xml += `    <lastmod>${new Date(createdAt).toISOString().split('T')[0]}</lastmod>\n`;
      xml += '    <changefreq>weekly</changefreq>\n';
      xml += `    <priority>${isFeatured ? '0.9' : '0.8'}</priority>\n`;
      xml += '  </url>\n';
    }

    // 标签页
    const tags = ['测试', '技术', '职场', 'JMeter', '性能测试'];
    for (const tag of tags) {
      xml += '  <url>\n';
      xml += `    <loc>${siteUrl}/tags/${encodeURIComponent(tag)}</loc>\n`;
      xml += `    <lastmod>${currentDate.split('T')[0]}</lastmod>\n`;
      xml += '    <changefreq>weekly</changefreq>\n';
      xml += '    <priority>0.6</priority>\n';
      xml += '  </url>\n';
    }

    xml += '</urlset>';

    // 设置响应头
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');

    return res.status(200).send(xml);
  } catch (error) {
    console.error('Sitemap generation error:', error);

    // 返回静态 sitemap
    const staticXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${currentDate.split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

    res.setHeader('Content-Type', 'application/xml');
    return res.status(200).send(staticXml);
  }
}
