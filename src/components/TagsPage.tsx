import { motion } from 'framer-motion';
import { Hash, BookOpen } from 'lucide-react';
import { tags, posts, getPostsByTag } from '@/data/blogData';
import type { Post } from '@/types/blog';
import PostCard from './PostCard';
import { useState } from 'react';

interface TagsPageProps {
  onPostClick: (post: Post) => void;
}

export default function TagsPage({ onPostClick }: TagsPageProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // selectedTag 保存的是 tag.id（点击时 setSelectedTag(tag.id)）；静态 tags 数组
  // 使用 '1'、'2'… 数字 ID，而文章内嵌的 tag 对象使用 'obs-1-1' 这类自定义 ID。
  // 两种 ID 体系不相通，必须先查 tag.name 再传给 getPostsByTag。
  const selectedTagInfo = selectedTag ? tags.find(t => t.id === selectedTag || t.name === selectedTag) : null;
  const filterTagKey: string = selectedTagInfo?.name ?? selectedTag ?? '';
  const filteredPosts = selectedTag ? getPostsByTag(filterTagKey) : posts;

  return (
    <div className="ink-page min-h-[100dvh] pb-16 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-ink dark:text-white mb-4">
            标签云
          </h1>
          <p className="text-ink-soft dark:text-ink-muted max-w-2xl mx-auto">
            按标签浏览文章，快速找到你感兴趣的内容
          </p>
        </motion.div>

        {/* Tags Cloud */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedTag === null
                  ? 'bg-cinnabar text-white shadow-[4px_4px_0_color-mix(in_srgb,var(--ink)_20%,transparent)]'
                  : 'bg-white dark:bg-[var(--paper-deep)] text-ink-soft dark:text-ink-soft hover:bg-[color-mix(in_srgb,var(--cinnabar)_7%,var(--paper))] dark:hover:bg-[color-mix(in_srgb,var(--cinnabar)_18%,var(--paper))]/20 border border-black/10 dark:border-white/10'
              }`}
            >
              <span className="flex items-center space-x-2">
                <Hash className="w-4 h-4" />
                <span>全部 ({posts.length})</span>
              </span>
            </button>
            {tags.map((tag, index) => {
              // 静态 tags 数组使用 '1'、'2'… 数字 ID；文章内嵌的 tag 对象使用
              // 'obs-1-1' 这类自定义 ID。按 tag.id 查找永远匹配不到，导致几乎所有
              // 标签显示 0。按 tag.name 匹配可命中文章内嵌标签的名称字段。
              const tagPostCount = getPostsByTag(tag.name).length;
              return (
                <motion.button
                  key={tag.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05 * index }}
                  onClick={() => setSelectedTag(tag.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedTag === tag.id
                      ? 'text-white shadow-lg'
                      : 'bg-white dark:bg-[var(--paper-deep)] hover:shadow-md border border-black/10 dark:border-white/10'
                  }`}
                  style={{
                    backgroundColor: selectedTag === tag.id ? tag.color : undefined,
                    color: selectedTag === tag.id ? '#fff' : tag.color,
                  }}
                >
                  <span className="flex items-center space-x-2">
                    <span>{tag.name}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      selectedTag === tag.id 
                        ? 'bg-white/20' 
                        : 'bg-[var(--paper-deep)] dark:bg-[#292e29]'
                    }`}>
                      {tagPostCount}
                    </span>
                  </span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Selected Tag Info */}
        {selectedTagInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 rounded-2xl"
            style={{ backgroundColor: `${selectedTagInfo.color}10` }}
          >
            <div className="flex items-center space-x-3">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: selectedTagInfo.color }}
              >
                <Hash className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold" style={{ color: selectedTagInfo.color }}>
                  {selectedTagInfo.name}
                </h2>
                <p className="text-ink-soft dark:text-ink-muted">
                  共 {filteredPosts.length} 篇文章
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Posts Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post, index) => (
                <PostCard
                  key={post.id}
                  post={post}
                  index={index}
                  onClick={() => onPostClick(post)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-medium text-ink dark:text-white mb-2">
                该标签下暂无文章
              </h3>
              <p className="text-ink-muted dark:text-ink-muted">
                选择其他标签查看更多内容
              </p>
            </div>
          )}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { value: tags.length, label: '标签总数', icon: Hash },
            { value: posts.length, label: '文章总数', icon: BookOpen },
            { value: Math.round(posts.length / tags.length), label: '平均每标签', icon: BookOpen },
            { value: tags.slice().sort((a, b) => getPostsByTag(b.name).length - getPostsByTag(a.name).length)[0]?.name || '-', label: '最热标签', icon: Hash },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              className="p-6 bg-white dark:bg-[var(--paper-deep)] rounded-2xl border border-black/10 dark:border-white/10 text-center"
            >
              <stat.icon className="w-6 h-6 text-cinnabar mx-auto mb-2" />
              <div className="text-2xl font-bold text-ink dark:text-white">
                {stat.value}
              </div>
              <div className="text-sm text-ink-muted dark:text-ink-muted">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
