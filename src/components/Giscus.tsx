import { useEffect, useRef } from 'react';

// Giscus 配置 — 使用 GitHub Discussions 作为评论系统
// 安装 Giscus App: https://github.com/apps/giscus
const GISCUS_CONFIG = {
  repo: 'jauiry/boke' as `${string}/${string}`,
  repoId: 'R_kgDORmBs3A',
  category: 'General',
  categoryId: 'DIC_kwDORmBs3M4C8Ihc',
  mapping: 'pathname' as const,
  strict: '0',
  reactionsEnabled: '1',
  emitMetadata: '0',
  inputPosition: 'top' as const,
  theme: 'preferred_color_scheme',
  lang: 'zh-CN',
  loading: 'lazy',
};

export default function Giscus() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 避免重复加载
    const existing = container.querySelector('script');
    if (existing) {
      // 更新主题
      const iframe = container.querySelector('iframe.giscus-frame') as HTMLIFrameElement;
      if (iframe) {
        const isDark = document.documentElement.classList.contains('dark');
        iframe.contentWindow?.postMessage(
          { giscus: { setConfig: { theme: isDark ? 'dark' : 'light' } } },
          'https://giscus.app'
        );
      }
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', GISCUS_CONFIG.repo);
    script.setAttribute('data-repo-id', GISCUS_CONFIG.repoId);
    script.setAttribute('data-category', GISCUS_CONFIG.category);
    script.setAttribute('data-category-id', GISCUS_CONFIG.categoryId);
    script.setAttribute('data-mapping', GISCUS_CONFIG.mapping);
    script.setAttribute('data-strict', GISCUS_CONFIG.strict);
    script.setAttribute('data-reactions-enabled', GISCUS_CONFIG.reactionsEnabled);
    script.setAttribute('data-emit-metadata', GISCUS_CONFIG.emitMetadata);
    script.setAttribute('data-input-position', GISCUS_CONFIG.inputPosition);
    script.setAttribute('data-theme', GISCUS_CONFIG.theme);
    script.setAttribute('data-lang', GISCUS_CONFIG.lang);
    script.setAttribute('data-loading', GISCUS_CONFIG.loading);
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;

    container.appendChild(script);
  }, []);

  // 监听主题切换
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const iframe = document.querySelector('iframe.giscus-frame') as HTMLIFrameElement;
      if (iframe) {
        const isDark = document.documentElement.classList.contains('dark');
        iframe.contentWindow?.postMessage(
          { giscus: { setConfig: { theme: isDark ? 'dark' : 'light' } } },
          'https://giscus.app'
        );
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">评论</h2>
      <div ref={containerRef} className="giscus" />
    </div>
  );
}
