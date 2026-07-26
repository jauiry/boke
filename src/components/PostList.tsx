import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Grid3X3, List as ListIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PostCard from './PostCard';
import { usePostList, useLocalTags, useLocalCategories, preloadPostList } from '@/hooks/usePosts';
import type { PostListItem } from '@/types/api';

interface PostListProps {
  onPostClick: (post: PostListItem) => void;
  initialSearchQuery?: string;
}

// 预加载数据
preloadPostList();

export default function PostList({ onPostClick, initialSearchQuery = '' }: PostListProps) {
  const posts = usePostList();
  const tags = useLocalTags();
  const categories = useLocalCategories();

  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch = searchQuery === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = !selectedCategory ||
        (post as any).categoryId === selectedCategory;

      const matchesTag = !selectedTag ||
        (post as any).tagIds?.includes(selectedTag);

      return matchesSearch && matchesCategory && matchesTag;
    });
  }, [posts, searchQuery, selectedCategory, selectedTag]);

  const featuredPosts = filteredPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  return (
    <div className="relative min-h-screen bg-transparent pt-28 pb-20">
      <div className="paper-noise absolute inset-0" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="mb-3 flex items-center gap-3 text-xs tracking-[0.3em] text-cinnabar"><span className="h-px w-8 bg-cinnabar" />文集</div>
          <h1 className="font-serif-cn text-3xl md:text-4xl font-semibold tracking-[0.12em] text-ink mb-4">
            展卷阅文
          </h1>
          <p className="text-ink-muted tracking-[0.06em]">
            共收录 {filteredPosts.length} 篇，愿每一次阅读都有所得
          </p>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                type="text"
                placeholder="搜索文章..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 rounded-none border-black/15 bg-[var(--paper)] pl-10 text-ink placeholder:text-ink-muted focus-visible:ring-[var(--cinnabar)] dark:border-white/15"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? 'bg-violet-50 border-violet-300 text-violet-700' : ''}
              >
                <Filter className="w-4 h-4 mr-2" />
                筛选
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              >
                {viewMode === 'grid' ? <ListIcon className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="ink-card space-y-4 p-5"
            >
              {/* Categories */}
              <div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                  分类
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === null
                        ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    全部
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                  标签
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedTag(null)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      selectedTag === null
                        ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    全部
                  </button>
                  {tags.map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => setSelectedTag(tag.id)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        selectedTag === tag.id
                          ? 'text-white'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400 hover:bg-slate-200'
                      }`}
                      style={selectedTag === tag.id ? { backgroundColor: tag.color } : {}}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && !searchQuery && !selectedCategory && !selectedTag && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="font-serif-cn text-xl font-semibold tracking-[0.08em] text-ink mb-6 flex items-center">
              <Badge className="mr-2 rounded-none bg-[var(--cinnabar)] text-white">精选</Badge>
              推荐阅读
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredPosts.slice(0, 2).map((post, index) => (
                <PostCard
                  key={post.id}
                  post={post}
                  index={index}
                  onClick={() => onPostClick(post)}
                  variant="featured"
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Regular Posts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="font-serif-cn text-xl font-semibold tracking-[0.08em] text-ink mb-6">
            {searchQuery || selectedCategory || selectedTag ? '搜索结果' : '最新文章'}
          </h2>

          {regularPosts.length > 0 ? (
            <div className={`grid gap-6 ${
              viewMode === 'grid'
                ? 'md:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-1'
            }`}>
              {regularPosts.map((post, index) => (
                <PostCard
                  key={post.id}
                  post={post}
                  index={index}
                  onClick={() => onPostClick(post)}
                  variant={viewMode === 'list' ? 'compact' : 'default'}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-medium text-slate-900 dark:text-white mb-2">
                没有找到相关文章
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                尝试调整搜索关键词或筛选条件
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
