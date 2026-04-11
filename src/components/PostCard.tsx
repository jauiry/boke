import { motion } from 'framer-motion';
import { Calendar, Clock, Eye, Heart, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Post } from '@/types/blog';

interface PostCardProps {
  post: Post;
  index?: number;
  onClick: () => void;
  variant?: 'default' | 'featured' | 'compact';
}

export default function PostCard({ post, index = 0, onClick, variant = 'default' }: PostCardProps) {
  const isFeatured = variant === 'featured';
  const isCompact = variant === 'compact';

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
                <span>{post.createdAt}</span>
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
    >
      {/* Cover Image */}
      <div className={`relative overflow-hidden ${isFeatured ? 'md:h-full h-48' : 'h-48'}`}>
        {post.coverImage ? (
          <motion.img
            src={post.coverImage}
            alt={post.title}
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
            {post.category.name}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className={`p-6 ${isFeatured ? 'md:p-8' : ''}`}>
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag.id}
              className="text-xs font-medium px-2.5 py-0.5 rounded-full"
              style={{ 
                backgroundColor: `${tag.color}20`, 
                color: tag.color 
              }}
            >
              {tag.name}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3 className={`font-bold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors mb-3 ${
          isFeatured ? 'text-2xl md:text-3xl' : 'text-xl'
        }`}>
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className={`text-slate-600 dark:text-slate-400 mb-4 line-clamp-2 ${
          isFeatured ? 'text-base md:text-lg' : 'text-sm'
        }`}>
          {post.excerpt}
        </p>

        {/* Meta */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
          <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
            <span className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{post.createdAt}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{post.readTime} 分钟</span>
            </span>
          </div>

          <div className="flex items-center space-x-3 text-sm text-slate-500 dark:text-slate-400">
            <span className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{post.views}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Heart className="w-4 h-4" />
              <span>{post.likes}</span>
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
