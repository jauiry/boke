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

  // ESC 关闭
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleResultClick = useCallback((post: PostListItem) => {
    onResultClick(post);
    setQuery('');
    setResults([]);
    onClose();
  }, [onResultClick, onClose]);

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
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* Search Modal */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className="flex items-center px-4 border-b border-slate-200 dark:border-slate-700">
              <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索文章标题或内容..."
                className="flex-1 px-4 py-5 text-lg bg-transparent border-0 outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              )}
            </div>

            {/* Loading State */}
            {isPending && query.length >= 2 && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 text-violet-500 animate-spin" />
                <span className="ml-2 text-slate-500">搜索中...</span>
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
                <div className="px-4 py-2 text-sm text-slate-500 border-b border-slate-100 dark:border-slate-800">
                  找到 {results.length} 篇相关文章
                </div>
                <div className="py-2">
                  {results.map((post, index) => (
                    <motion.button
                      key={post.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleResultClick(post)}
                      className="w-full px-6 py-4 flex items-start space-x-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
                    >
                      <FileText className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-slate-900 dark:text-white truncate">
                          {post.title}
                        </h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1 mt-1">
                          {post.excerpt}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
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
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-slate-600 dark:text-slate-400">
                  未找到与 "{query}" 相关的文章
                </p>
                <p className="text-sm text-slate-400 mt-2">
                  尝试使用不同的关键词
                </p>
              </div>
            )}

            {/* Hint */}
            {query.length < 2 && (
              <div className="px-6 py-4 text-sm text-slate-400 text-center">
                输入至少 2 个字符开始搜索
              </div>
            )}

            {/* Footer */}
            <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center space-x-4">
                  <span>
                    <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-xs">Enter</kbd> 选择
                  </span>
                  <span>
                    <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-xs">Esc</kbd> 关闭
                  </span>
                </div>
                <span>
                  <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-xs">↑↓</kbd> 导航
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
