// Vercel Serverless Function - 动态 OG 图片生成
// 返回 SVG 格式的分享图（兼容性好）

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') || '郏祥瑞的技术博客';
  const date = searchParams.get('date') || '';

  // 格式化日期
  let formattedDate = '';
  if (date) {
    try {
      formattedDate = new Date(date).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      formattedDate = '';
    }
  }

  // 截断过长的标题
  const displayTitle = title.length > 40 ? title.slice(0, 40) + '...' : title;

  // SVG OG 图片
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#7c3aed"/>
      <stop offset="50%" style="stop-color:#a855f7"/>
      <stop offset="100%" style="stop-color:#ec4899"/>
    </linearGradient>
  </defs>

  <!-- 背景 -->
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- 装饰圆 -->
  <circle cx="1050" cy="80" r="120" fill="rgba(255,255,255,0.1)"/>
  <circle cx="150" cy="550" r="80" fill="rgba(255,255,255,0.08)"/>

  <!-- Logo -->
  <rect x="50" y="40" width="50" height="50" rx="12" fill="rgba(255,255,255,0.2)"/>
  <text x="75" y="75" font-family="system-ui, sans-serif" font-size="28" font-weight="bold" fill="white" text-anchor="middle">M</text>
  <text x="115" y="72" font-family="system-ui, sans-serif" font-size="20" font-weight="500" fill="rgba(255,255,255,0.9)">mxqys.xyz</text>

  <!-- 标签 -->
  <rect x="50" y="200" width="100" height="36" rx="18" fill="rgba(255,255,255,0.2)"/>
  <text x="100" y="225" font-family="system-ui, sans-serif" font-size="14" fill="white" text-anchor="middle">技术分享</text>

  <!-- 标题 -->
  <text x="50" y="340" font-family="system-ui, -apple-system, sans-serif" font-size="48" font-weight="700" fill="white">
    ${escapeXml(displayTitle)}
  </text>

  <!-- 日期和作者 -->
  ${formattedDate ? `
  <text x="50" y="420" font-family="system-ui, sans-serif" font-size="18" fill="rgba(255,255,255,0.8)">
    ${escapeXml(formattedDate)} · 郏祥瑞
  </text>
  ` : ''}

  <!-- 底部装饰线 -->
  <rect x="0" y="620" width="1200" height="10" fill="rgba(255,255,255,0.3)"/>
</svg>`;

  function escapeXml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');

  return res.status(200).send(svg);
}
