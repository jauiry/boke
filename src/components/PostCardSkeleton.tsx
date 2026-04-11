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
        className="group cursor-pointer p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-violet-300 dark:hover:border-violet-700 transition-all hover:shadow-lg"
      >
        <div className="flex items-start space-x-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors line-clamp-1">
              {post.title}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
              {post.excerpt}
            </p>
            <div className="flex items-center space-x-4 mt-2 text-xs text-slate-400">
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
      className={`group cursor-pointer overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-violet-300 dark:hover:border-violet-700 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/10 ${
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
                parent.classList.add('bg-gradient-to-br', 'from-violet-500', 'to-fuchsia-500');
              }
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-violet-500 to-fuchsia-500" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Featured Badge */}
        {post.featured && (
          <div className="absolute top-4 left-4">
            <Badge className="bg-violet-500 text-white border-0">
              精选
            </Badge>
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute bottom-4 left-4">
          <Badge variant="secondary" className="bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 backdrop-blur-sm">
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
        <h3 className={`font-bold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors mb-3 ${
          isFeatured ? 'text-2xl md:text-3xl' : 'text-xl'
        }`}>
          {post.title}
        </h3>

        {/* Excerpt */}
        <div className="relative mb-4">
          <p className={`text-slate-600 dark:text-slate-400 line-clamp-2 ${
            isFeatured ? 'text-base md:text-lg' : 'text-sm'
          }`}>
            {post.excerpt}
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white dark:from-slate-800 to-transparent" />
        </div>

        {/* Meta */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
          <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
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
        <div className="mt-4 flex items-center text-violet-600 dark:text-violet-400 font-medium text-sm group-hover:translate-x-2 transition-transform">
          <span>阅读全文</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </div>
      </div>
    </motion.article>
  );
}
