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
  image = '/og-image.png',
  post,
  type = 'website',
}: SEOProps) {
  const siteName = '郏祥瑞的技术博客';
  const fullTitle = post ? `${post.title} - ${siteName}` : title;
  const fullDescription = post?.excerpt || description;
  const fullImage = post?.coverImage || image;
  const url = post ? `https://www.mxqys.xyz/${post.slug}` : 'https://www.mxqys.xyz';

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
    updateMeta('og:image', fullImage, true);
    updateMeta('og:site_name', siteName, true);

    // Twitter Card
    updateMeta('twitter:title', fullTitle);
    updateMeta('twitter:description', fullDescription);
    updateMeta('twitter:image', fullImage);
    updateMeta('twitter:card', 'summary_large_image');

    // 其他重要 meta
    updateMeta('description', fullDescription);
    updateMeta('author', '郏祥瑞');

    // 更新 canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url;

  }, [fullTitle, fullDescription, fullImage, url, type, post]);

  return null;
}
