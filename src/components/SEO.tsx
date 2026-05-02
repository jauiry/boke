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
  const authorName = '郏祥瑞';

  const fullTitle = post ? `${post.title} - ${siteName}` : title;
  const fullDescription = post?.excerpt || description;
  const ogImage = image || `${siteUrl}/icon-512.svg`;
  const url = post ? `${siteUrl}/${post.slug}` : siteUrl;
  const keywords = post
    ? post.tags.map(t => t.name).join(', ')
    : '软件测试,性能测试,JMeter,接口测试,自动化测试,技术博客';

  useEffect(() => {
    document.title = fullTitle;

    const setMeta = (selector: string, content: string) => {
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        if (selector.startsWith('meta[property=')) {
          el.setAttribute('property', selector.match(/property="([^"]+)"/)![1]);
        } else {
          el.setAttribute('name', selector.match(/name="([^"]+)"/)![1]);
        }
        document.head.appendChild(el);
      }
      el.content = content;
    };

    setMeta('meta[name="description"]', fullDescription);
    setMeta('meta[name="keywords"]', keywords);
    setMeta('meta[name="author"]', authorName);
    setMeta('meta[property="og:title"]', fullTitle);
    setMeta('meta[property="og:description"]', fullDescription);
    setMeta('meta[property="og:type"]', type);
    setMeta('meta[property="og:url"]', url);
    setMeta('meta[property="og:image"]', ogImage);
    setMeta('meta[property="og:site_name"]', siteName);
    setMeta('meta[property="og:locale"]', 'zh_CN');
    setMeta('meta[name="twitter:card"]', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', fullTitle);
    setMeta('meta[name="twitter:description"]', fullDescription);
    setMeta('meta[name="twitter:image"]', ogImage);

    if (post) {
      setMeta('meta[property="article:published_time"]', post.createdAt);
      setMeta('meta[property="article:author"]', authorName);
      setMeta('meta[property="article:tag"]', post.tags.map(t => t.name).join(', '));
    }

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url;

    // JSON-LD structured data
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) existingScript.remove();

    const script = document.createElement('script');
    script.type = 'application/ld+json';

    if (post) {
      script.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt,
        image: post.coverImage ? `${siteUrl}${post.coverImage}` : ogImage,
        datePublished: post.createdAt,
        dateModified: post.updatedAt,
        author: { '@type': 'Person', name: authorName, url: siteUrl },
        publisher: { '@type': 'Organization', name: siteName, url: siteUrl },
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        keywords: post.tags.map(t => t.name),
      });
    } else {
      script.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: siteName,
        description,
        url: siteUrl,
        author: { '@type': 'Person', name: authorName },
        potentialAction: {
          '@type': 'SearchAction',
          target: { '@type': 'EntryPoint', urlTemplate: `${siteUrl}/?q={search_term_string}` },
          'query-input': 'required name=search_term_string',
        },
      });
    }

    document.head.appendChild(script);
  }, [fullTitle, fullDescription, ogImage, url, type, post, keywords, authorName, siteName, siteUrl, description]);

  return null;
}
