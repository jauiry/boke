import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Moon, Search, Sun, X } from 'lucide-react';
import SearchOverlay from './SearchOverlay';
import AuthDialog from './AuthDialog';
import type { PostListItem } from '@/types/api';

interface NavbarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  onSearch?: (query: string) => void;
  onPostClick: (post: PostListItem) => void;
}

const navItems = [
  { id: 'home', label: '首页', eyebrow: '归处' },
  { id: 'articles', label: '文章', eyebrow: '文集' },
  { id: 'tags', label: '标签', eyebrow: '索引' },
  { id: 'about', label: '关于', eyebrow: '其人' },
];

export default function Navbar({ currentView, onViewChange, onPostClick }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setIsSearchOpen(true);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const selectView = (view: string) => {
    onViewChange(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        aria-label="主导航"
        className="fixed inset-x-0 top-0 z-50 border-b border-black/5 bg-[#f3f0e8]/82 shadow-[0_10px_40px_rgba(32,37,33,0.04)] backdrop-blur-xl dark:border-white/5 dark:bg-[#171a18]/82"
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
          <button onClick={() => selectView('home')} className="group flex items-center gap-3" aria-label="返回首页">
            <span className="grid h-10 w-10 place-items-center border border-[var(--cinnabar)] font-calligraphy text-xl text-cinnabar transition-colors group-hover:bg-[var(--cinnabar)] group-hover:text-[var(--paper)]">
              明
            </span>
            <span className="text-left">
              <span className="block font-serif-cn text-base font-semibold tracking-[0.2em] text-ink">嘉明手札</span>
              <span className="mt-0.5 block text-[11px] tracking-[0.18em] text-ink-muted">JIAMING NOTES</span>
            </span>
          </button>

          <div className="hidden items-center gap-7 md:flex">
            {navItems.map((item) => (
              <button key={item.id} onClick={() => selectView(item.id)} className="group relative py-3 text-center">
                <span className={`block text-sm tracking-[0.18em] transition-colors ${currentView === item.id ? 'text-cinnabar' : 'text-ink-soft group-hover:text-ink'}`}>
                  {item.label}
                </span>
                <span className="mt-0.5 block text-[11px] tracking-[0.16em] text-ink-muted">{item.eyebrow}</span>
                {currentView === item.id && (
                  <motion.span layoutId="nav-ink" className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-cinnabar" />
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <button onClick={() => setIsSearchOpen(true)} className="grid h-11 w-11 place-items-center text-ink-soft hover:text-cinnabar" aria-label="搜索文章">
              <Search data-testid="open-search" className="h-[18px] w-[18px]" />
            </button>
            <button onClick={() => setIsDark((value) => !value)} className="hidden h-11 w-11 place-items-center text-ink-soft hover:text-cinnabar sm:grid" aria-label={isDark ? '切换浅色主题' : '切换深色主题'}>
              {isDark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
            </button>
            <span className="mx-2 hidden h-5 w-px bg-black/10 sm:block dark:bg-white/10" />
            <AuthDialog />
            <button onClick={() => setIsMobileMenuOpen((value) => !value)} className="grid h-11 w-11 place-items-center text-ink md:hidden" aria-label={isMobileMenuOpen ? '关闭菜单' : '打开菜单'}>
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="fixed inset-x-0 top-20 z-40 border-b border-black/10 bg-[#f3f0e8]/96 px-5 py-5 backdrop-blur-xl md:hidden dark:border-white/10 dark:bg-[#171a18]/96"
          >
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => (
                <button key={item.id} onClick={() => selectView(item.id)} className={`border p-4 text-left ${currentView === item.id ? 'border-[var(--cinnabar)] text-cinnabar' : 'border-black/10 text-ink-soft dark:border-white/10'}`}>
                  <span className="block text-base tracking-[0.18em]">{item.label}</span>
                  <span className="mt-1 block text-xs tracking-[0.16em] text-ink-muted">{item.eyebrow}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setIsDark((value) => !value)} className="mt-3 flex w-full items-center justify-center gap-2 border border-black/10 p-3 text-sm text-ink-soft dark:border-white/10">
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {isDark ? '切换日间卷轴' : '切换夜间卷轴'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} onResultClick={(post) => { onPostClick(post); setIsSearchOpen(false); }} />
    </>
  );
}
