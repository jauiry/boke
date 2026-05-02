import { useEffect, useRef } from 'react';

const TWIKOO_ENV_ID = 'https://mxqys-twikoo.vercel.app';

// 声明全局 twikoo 类型
declare global {
  interface Window {
    twikoo?: {
      init: (config: {
        envId: string;
        el: string | HTMLElement;
        lang?: string;
        region?: string;
        path?: string;
      }) => void;
    };
  }
}

export default function Comment() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 避免重复初始化
    if (container.querySelector('.twikoo')) return;

    const loadTwikoo = () => {
      if (window.twikoo) {
        window.twikoo.init({
          envId: TWIKOO_ENV_ID,
          el: container,
          lang: 'zh-CN',
          path: window.location.pathname,
        });
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/twikoo@1.6.41/dist/twikoo.all.min.js';
      script.async = true;
      script.onload = () => {
        if (window.twikoo) {
          window.twikoo.init({
            envId: TWIKOO_ENV_ID,
            el: container,
            lang: 'zh-CN',
            path: window.location.pathname,
          });
        }
      };
      document.body.appendChild(script);
    };

    loadTwikoo();
  }, []);

  return (
    <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">评论</h2>
      <div ref={containerRef} />
    </div>
  );
}
