import { motion } from 'framer-motion';
import { Github, Twitter, Mail, Heart, ArrowUp } from 'lucide-react';
import { author } from '@/data/blogData';

interface FooterProps {
  onViewChange: (view: string) => void;
}

const footerLinks = [
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
      { label: 'RSS 订阅', view: 'rss' },
      { label: '站点地图', view: 'sitemap' },
      { label: '友情链接', view: 'friends' },
    ],
  },
];

export default function Footer({ onViewChange }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                Blog
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mb-4 max-w-md">
              记录技术成长，分享编程心得。一个专注于前端开发、后端架构和技术思考的博客。
            </p>
            <div className="flex items-center space-x-3">
              <a
                href={author.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-violet-100 dark:hover:bg-violet-900/30 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href={author.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-violet-100 dark:hover:bg-violet-900/30 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href={`mailto:${author.social.email}`}
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
                    <button
                      onClick={() => onViewChange(link.view)}
                      className="text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                    >
                      {link.label}
                    </button>
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
              Made with 
              <Heart className="w-4 h-4 mx-1 text-red-500 fill-current" />
              by {author.name} © {new Date().getFullYear()}
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-sm text-slate-500 dark:text-slate-400">
                使用 React + Tailwind CSS 构建
              </span>
              <motion.button
                onClick={scrollToTop}
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
