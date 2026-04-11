import { useEffect } from 'react';
import type { Post } from '@/types/blog';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  post?: Post;
  type?: 'website' | 'article';
}

export default function SEO({
  title = '郏祥瑞的技术博客',
  description = '分享软件测试、性能测试、接口自动化等技术文章',
  image,
  post,
  type = 'website',
}: SEOProps) {
  const siteName = '郏祥瑞的技术博客';
  const siteUrl = 'https://www.mxqys.xyz';

  const fullTitle = post ? `${post.title} - ${siteName}` : title;
  const fullDescription = post?.excerpt || description;

  // 静态 OG 图片（后续可以替换为动态生成的）
  const ogImage = image || `${siteUrl}/og-default.png`;

  const url = post ? `${siteUrl}/${post.slug}` : siteUrl;

  // 从文章内容提取关键词（简化版：取前10个标签或常见词）
  const keywords = post
    ? post.tags.map(t => t.name).join(', ')
    : '软件测试,性能测试,JMeter,接口测试,自动化测试,技术博客';

  useEffect(() => {
    // 更新文档标题
    document.title = fullTitle;

    // 更新或创建 meta 标签
    const updateMeta = (name: string, content: string, property?: boolean) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;

      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Open Graph
    updateMeta('og:title', fullTitle, true);
    updateMeta('og:description', fullDescription, true);
    updateMeta('og:type', type, true);
    updateMeta('og:url', url, true);
    updateMeta('og:image', ogImage, true);
    updateMeta('og:site_name', siteName, true);
    updateMeta('og:locale', 'zh_CN', true);

    // Twitter Card
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', fullTitle);
    updateMeta('twitter:description', fullDescription);
    updateMeta('twitter:image', ogImage);
    updateMeta('twitter:site', '@mxqys', true);

    // 文章特有 meta
    if (post) {
      updateMeta('article:published_time', post.createdAt, true);
      updateMeta('article:author', '郏祥瑞', true);
      updateMeta('article:tag', post.tags.map(t => t.name).join(', '), true);
    }

    // 其他重要 meta
    updateMeta('description', fullDescription);
    updateMeta('keywords', keywords);
    updateMeta('author', '郏祥瑞');

    // 更新 canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url;

  }, [fullTitle, fullDescription, ogImage, url, type, post, keywords]);

  return null;
}
