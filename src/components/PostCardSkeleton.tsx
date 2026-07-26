import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { PostListItem } from '@/types/api';
import { formatDateChinese, useCoverImage } from '@/hooks/usePosts';

interface PostCardProps {
  post: PostListItem;
  index?: number;
  onClick: () => void;
  variant?: 'default' | 'featured' | 'compact';
}

// 获取标签的深色文字颜色
function getTagTextColor(bgColor: string): string {
  const hex = bgColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 150 ? '#374151' : '#ffffff';
}

// 默认标签（列表页简化显示）
const defaultTags = [
  { id: '1', name: '测试', color: '#61DAFB' },
  { id: '2', name: '技术', color: '#3178C6' },
];

export default function PostCard({ post, index = 0, onClick, variant = 'default' }: PostCardProps) {
  const isFeatured = variant === 'featured';
  const isCompact = variant === 'compact';
  const { coverUrl } = useCoverImage(post.coverImage);

  if (isCompact) {
    return (
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        onClick={onClick}
        className="group cursor-pointer p-4 rounded-xl bg-white dark:bg-[var(--paper-deep)] border border-black/10 dark:border-white/10 hover:border-[var(--cinnabar)]/35 dark:hover:border-[var(--cinnabar)]/45 transition-all hover:shadow-lg"
      >
        <div className="flex items-start space-x-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-ink dark:text-white group-hover:text-cinnabar dark:group-hover:text-cinnabar transition-colors line-clamp-1">
              {post.title}
            </h3>
            <p className="text-sm text-ink-muted dark:text-ink-muted mt-1 line-clamp-1">
              {post.excerpt}
            </p>
            <div className="flex items-center space-x-4 mt-2 text-xs text-ink-muted">
              <span className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>{formatDateChinese(post.createdAt)}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{post.readTime} 分钟</span>
              </span>
            </div>
          </div>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={onClick}
      className={`ink-card group cursor-pointer overflow-hidden transition-all duration-300 hover:border-[var(--cinnabar)] ${
        isFeatured ? 'md:col-span-2 md:grid md:grid-cols-2' : ''
      }`}
      style={{ contentVisibility: 'auto' }}
    >
      {/* Cover Image */}
      <div className={`relative overflow-hidden ${isFeatured ? 'md:h-full h-48' : 'h-48'}`}>
        {coverUrl ? (
          <motion.img
            src={coverUrl}
            alt={post.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              const parent = (e.target as HTMLImageElement).parentElement;
              if (parent) {
                parent.classList.add('bg-gradient-to-br', 'from-[#59615a]', 'to-[#a83f32]');
              }
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#59615a] to-[#a83f32]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Featured Badge */}
        {post.featured && (
          <div className="absolute top-4 left-4">
            <Badge className="border-0 bg-cinnabar text-white">
              精选
            </Badge>
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute bottom-4 left-4">
          <Badge variant="secondary" className="bg-white/90 dark:bg-[#171a18]/90 text-ink-soft dark:text-ink-soft backdrop-blur-sm">
            技术分享
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className={`p-6 ${isFeatured ? 'md:p-8' : ''}`}>
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {defaultTags.slice(0, 2).map((tag) => {
            const bgColor = `${tag.color}30`;
            const textColor = getTagTextColor(tag.color);
            return (
              <span
                key={tag.id}
                className="text-xs font-medium px-2.5 py-0.5 rounded-full"
                style={{
                  backgroundColor: bgColor,
                  color: textColor,
                  border: `1px solid ${tag.color}40`
                }}
              >
                {tag.name}
              </span>
            );
          })}
        </div>

        {/* Title */}
        <h3 className={`font-bold text-ink dark:text-white group-hover:text-cinnabar dark:group-hover:text-cinnabar transition-colors mb-3 ${
          isFeatured ? 'text-2xl md:text-3xl' : 'text-xl'
        }`}>
          {post.title}
        </h3>

        {/* Excerpt */}
        <div className="relative mb-4">
          <p className={`text-ink-soft dark:text-ink-muted line-clamp-2 ${
            isFeatured ? 'text-base md:text-lg' : 'text-sm'
          }`}>
            {post.excerpt}
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white dark:from-[var(--paper-deep)] to-transparent" />
        </div>

        {/* Meta */}
        <div className="flex items-center justify-between pt-4 border-t border-black/5 dark:border-white/10">
          <div className="flex items-center space-x-4 text-sm text-ink-muted dark:text-ink-muted">
            <span className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDateChinese(post.createdAt)}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{post.readTime} 分钟</span>
            </span>
          </div>
        </div>

        {/* Read More */}
        <div className="mt-4 flex items-center text-cinnabar dark:text-cinnabar font-medium text-sm group-hover:translate-x-2 transition-transform">
          <span>阅读全文</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </div>
      </div>
    </motion.article>
  );
}
