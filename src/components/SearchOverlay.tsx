import { useState, useTransition, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, FileText, Loader2 } from 'lucide-react';
import type { PostListItem } from '@/types/api';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onResultClick: (post: PostListItem) => void;
}

// 防抖 hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

// 格式化日期
function formatDateChinese(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

export default function SearchOverlay({ isOpen, onClose, onResultClick }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PostListItem[]>([]);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const debouncedQuery = useDebounce(query, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const requestIdRef = useRef(0);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  // 聚焦输入框
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // 搜索请求
  useEffect(() => {
    if (debouncedQuery.trim().length < 2) {
      setResults([]);
      setError(null);
      return;
    }

    const currentRequestId = ++requestIdRef.current;
    setError(null);

    startTransition(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`);
        const data = await response.json();

        // 忽略过时的请求
        if (currentRequestId !== requestIdRef.current) {
          return;
        }

        if (data.success && data.data) {
          setResults(data.data);
        } else {
          setResults([]);
        }
      } catch (err) {
        if (currentRequestId === requestIdRef.current) {
          setError('搜索服务暂时不可用，请稍后再试');
          setResults([]);
        }
      }
    });
  }, [debouncedQuery]);

  const handleResultClick = useCallback((post: PostListItem) => {
    onResultClick(post);
    setQuery('');
    setResults([]);
    onClose();
  }, [onResultClick, onClose]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (results.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, -1));
      } else if (e.key === 'Enter' && selectedIndex >= 0) {
        e.preventDefault();
        handleResultClick(results[selectedIndex]);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, results, selectedIndex, handleResultClick]);

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [results]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-[#171a18]/55 backdrop-blur-sm" />

          {/* Search Modal */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl overflow-hidden border border-black/15 bg-[var(--paper)] shadow-[12px_18px_60px_rgba(20,24,21,.25)] dark:border-white/15"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className="flex items-center border-b border-black/10 px-4 dark:border-white/10">
              <Search className="w-5 h-5 text-ink-muted flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索文章标题或内容..."
                className="flex-1 border-0 bg-transparent px-4 py-5 font-serif-cn text-lg text-ink outline-none placeholder:text-ink-muted"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="grid h-11 w-11 place-items-center text-ink-muted transition-colors hover:text-cinnabar"
                  aria-label="清空搜索"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Loading State */}
            {isPending && query.length >= 2 && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 text-cinnabar animate-spin" />
                <span className="ml-2 text-ink-muted">搜索中...</span>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="px-6 py-8 text-center">
                <p className="text-red-500">{error}</p>
              </div>
            )}

            {/* Results */}
            {!isPending && !error && results.length > 0 && (
              <div className="max-h-[60vh] overflow-y-auto">
                <div className="border-b border-black/10 px-4 py-2 text-sm text-ink-muted dark:border-white/10">
                  找到 {results.length} 篇相关文章
                </div>
                <div className="py-2" ref={resultsContainerRef} role="listbox" aria-label="搜索结果">
                  {results.map((post, index) => (
                    <motion.button
                      key={post.id}
                      role="option"
                      aria-selected={selectedIndex === index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleResultClick(post)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full px-6 py-4 flex items-start space-x-4 transition-colors text-left ${
                        selectedIndex === index
                          ? 'bg-[color-mix(in_srgb,var(--cinnabar)_10%,transparent)]'
                          : 'hover:bg-black/[.035] dark:hover:bg-white/[.035]'
                      }`}
                    >
                      <FileText className={`w-5 h-5 flex-shrink-0 mt-0.5 ${selectedIndex === index ? 'text-cinnabar' : 'text-ink-muted'}`} />
                      <div className="flex-1 min-w-0">
                        <h4 className="truncate font-serif-cn font-medium text-ink">
                          {post.title}
                        </h4>
                        <p className="mt-1 line-clamp-1 text-sm text-ink-soft">
                          {post.excerpt}
                        </p>
                        <p className="mt-1 text-xs text-ink-muted">
                          {formatDateChinese(post.createdAt)} · {post.readTime} 分钟阅读
                        </p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {!isPending && !error && query.length >= 2 && results.length === 0 && (
              <div className="px-6 py-12 text-center">
                <Search className="mx-auto mb-4 h-10 w-10 text-ink-muted" aria-hidden="true" />
                <p className="text-ink-soft">
                  未找到与 "{query}" 相关的文章
                </p>
                <p className="mt-2 text-sm text-ink-muted">
                  尝试使用不同的关键词
                </p>
              </div>
            )}

            {/* Hint */}
            {query.length < 2 && (
              <div className="px-6 py-4 text-center text-sm text-ink-muted">
                输入至少 2 个字符开始搜索
              </div>
            )}

            {/* Footer */}
            <div className="border-t border-black/10 bg-black/[.025] px-6 py-3 dark:border-white/10 dark:bg-white/[.025]">
              <div className="flex items-center justify-between text-xs text-ink-muted">
                <div className="flex items-center space-x-4">
                  <span>
                    <kbd className="border border-black/10 px-1.5 py-0.5 text-xs dark:border-white/10">Enter</kbd> 选择
                  </span>
                  <span>
                    <kbd className="border border-black/10 px-1.5 py-0.5 text-xs dark:border-white/10">Esc</kbd> 关闭
                  </span>
                </div>
                <span>
                  <kbd className="border border-black/10 px-1.5 py-0.5 text-xs dark:border-white/10">↑↓</kbd> 导航
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
