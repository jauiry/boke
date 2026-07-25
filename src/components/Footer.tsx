import { motion } from 'framer-motion';
import { Github, Twitter, Mail, Heart, ArrowUp } from 'lucide-react';
import { author } from '@/data/blogData';

interface FooterProps {
  onViewChange: (view: string) => void;
}

interface FooterLink {
  label: string;
  view?: string;
  href?: string;
}

const footerLinks: { title: string; links: FooterLink[] }[] = [
  {
    title: '导航',
    links: [
      { label: '首页', view: 'home' },
      { label: '文章', view: 'articles' },
      { label: '标签', view: 'tags' },
      { label: '关于', view: 'about' },
    ],
  },
  {
    title: '资源',
    links: [
      { label: 'RSS 订阅', href: '/api/rss.xml' },
      { label: '站点地图', href: '/sitemap.xml' },
      { label: 'GitHub', href: 'https://github.com/jauiry/boke' },
    ],
  },
];

export default function Footer({ onViewChange }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-black/10 bg-[var(--paper-deep)] dark:border-white/10">
      <div className="paper-noise absolute inset-0" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="grid h-9 w-9 place-items-center border border-[var(--cinnabar)]">
                <span className="font-calligraphy text-xl text-cinnabar">明</span>
              </div>
              <span className="font-serif-cn text-xl font-semibold tracking-[0.16em] text-ink">
                嘉明手札
              </span>
            </div>
            <p className="mb-4 max-w-md font-serif-cn leading-8 text-ink-soft">
              以代码为笔，以思考为墨。记录技术、设计与生活中值得被慢慢看见的瞬间。
            </p>
            <div className="flex items-center space-x-3">
              <a
                href={author.social.github}
                aria-label="访问 GitHub"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-violet-100 dark:hover:bg-violet-900/30 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href={author.social.twitter}
                aria-label="访问 Twitter"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-violet-100 dark:hover:bg-violet-900/30 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href={`mailto:${author.social.email}`}
                aria-label="发送邮件"
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-violet-100 dark:hover:bg-violet-900/30 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.href ? (
                      <a
                        href={link.href}
                        target={link.href.startsWith('http') ? '_blank' : undefined}
                        rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <button
                        onClick={() => onViewChange(link.view!)}
                        className="text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                      >
                        {link.label}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center">
              用心书写
              <Heart className="w-4 h-4 mx-1 text-red-500 fill-current" />
              by {author.name} © {new Date().getFullYear()}
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-sm text-slate-500 dark:text-slate-400">
                使用 React + Tailwind CSS 构建
              </span>
              <motion.button
                onClick={scrollToTop}
                aria-label="返回页面顶部"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 hover:bg-violet-200 dark:hover:bg-violet-900/50 transition-colors"
              >
                <ArrowUp className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
