import { motion } from 'framer-motion';
import { Calendar, Clock, Eye, Heart, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Post } from '@/types/blog';
import type { PostListItem } from '@/types/api';
import { useState, useEffect } from 'react';
import type { MouseEvent } from 'react';

interface PostCardProps {
  post: Post | PostListItem;
  index?: number;
  onClick: () => void;
  variant?: 'default' | 'featured' | 'compact';
}

// Type guard to check if post is a full Post
function isFullPost(post: Post | PostListItem): post is Post {
  return 'content' in post && 'author' in post && 'tags' in post;
}

// 格式化日期为友好格式
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 加载封面图片 URL（支持 JSON 格式的 base64 数据）
async function getCoverImageUrl(coverImage: string | undefined): Promise<string | null> {
  if (!coverImage) return null;

  // 如果是 JSON 文件路径，fetch 并解析 base64
  if (coverImage.startsWith('/')) {
    try {
      const response = await fetch(coverImage);
      const data = await response.json();
      if (data.base64) {
        return `data:image/jpeg;base64,${data.base64}`;
      }
    } catch (error) {
      console.error('加载封面图片失败:', error);
      return null;
    }
  }

  // 如果是直接的 data URI
  if (coverImage.startsWith('data:')) {
    return coverImage;
  }

  // 否则返回原 URL
  return coverImage;
}

// 获取标签的深色文字颜色（用于浅色背景）
function getTagTextColor(bgColor: string): string {
  // 将 hex 颜色转换为 RGB
  const hex = bgColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  // 计算亮度
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  // 如果亮度 > 150（浅色），返回深色文字
  return brightness > 150 ? '#374151' : '#ffffff';
}

export default function PostCard({ post, index = 0, onClick, variant = 'default' }: PostCardProps) {
  const isFeatured = variant === 'featured';
  const isCompact = variant === 'compact';
  const [coverUrl, setCoverUrl] = useState<string | null>(null);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    onClick();
  };

  useEffect(() => {
    let isMounted = true;

    async function loadCover() {
      const url = await getCoverImageUrl(post.coverImage);
      if (isMounted && url) {
        setCoverUrl(url);
      }
    }

    loadCover();

    return () => {
      isMounted = false;
    };
  }, [post.coverImage]);

  if (isCompact) {
    return (
      <motion.a
        href={`/${post.slug}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        onClick={handleClick}
        className="ink-card group p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--cinnabar)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--cinnabar)]"
      >
        <div className="flex items-start space-x-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-serif-cn font-semibold text-ink group-hover:text-cinnabar transition-colors line-clamp-1">
              {post.title}
            </h3>
            <p className="text-sm text-ink-muted mt-1 line-clamp-1">
              {post.excerpt}
            </p>
            <div className="mt-2 flex items-center space-x-4 text-xs text-ink-muted">
              <span className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(post.createdAt)}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{post.readTime} 分钟</span>
              </span>
            </div>
          </div>
        </div>
      </motion.a>
    );
  }

  return (
    <motion.a
      href={`/${post.slug}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={handleClick}
      className={`ink-card group overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:border-[var(--cinnabar)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--cinnabar)] ${
        isFeatured ? 'md:col-span-2 md:grid md:grid-cols-2' : ''
      }`}
    >
      {/* Cover Image */}
      <div className={`relative overflow-hidden ${isFeatured ? 'md:h-full h-48' : 'h-48'}`}>
        {coverUrl ? (
          <motion.img
            src={coverUrl}
            alt={post.title}
            loading="lazy"
            decoding="async"
            className="ink-cover h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              const parent = (e.target as HTMLImageElement).parentElement;
              if (parent) {
                parent.style.background = 'linear-gradient(145deg, #d8d2c5, #59615a)';
              }
            }}
          />
        ) : (
          <div className="w-full h-full bg-[radial-gradient(circle_at_65%_28%,rgba(168,63,50,.42),transparent_18%),linear-gradient(145deg,#d8d2c5,#59615a)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Featured Badge */}
        {post.featured && (
          <div className="absolute top-4 left-4">
            <Badge className="rounded-none bg-[var(--cinnabar)] text-white border-0">
              精选
            </Badge>
          </div>
        )}

        {/* Category Badge */}
        {isFullPost(post) && post.category && (
          <div className="absolute bottom-4 left-4">
            <Badge variant="secondary" className="rounded-none border border-black/10 bg-[var(--paper)]/90 text-ink-soft backdrop-blur-sm dark:border-white/10">
              {post.category.name}
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`p-6 ${isFeatured ? 'md:p-8' : ''}`}>
        {/* Tags */}
        {isFullPost(post) && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.slice(0, 3).map((tag) => {
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
        )}

        {/* Title */}
        <h3 className={`font-serif-cn font-semibold tracking-[0.04em] text-ink group-hover:text-cinnabar transition-colors mb-3 ${
          isFeatured ? 'text-2xl md:text-3xl' : 'text-xl'
        }`}>
          {post.title}
        </h3>

        {/* Excerpt */}
        <div className="relative mb-4">
          <p className={`text-ink-soft line-clamp-2 leading-7 ${
            isFeatured ? 'text-base md:text-lg' : 'text-sm'
          }`}>
            {post.excerpt}
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-[var(--paper)] to-transparent" />
        </div>

        {/* Meta */}
        <div className="flex items-center justify-between border-t border-black/10 pt-4 dark:border-white/10">
          <div className="flex items-center space-x-4 text-sm text-ink-muted">
            <span className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(post.createdAt)}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{post.readTime} 分钟</span>
            </span>
          </div>

          <div className="flex items-center space-x-3 text-sm text-ink-muted">
            {isFullPost(post) && post.views > 0 && (
              <span className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{post.views}</span>
              </span>
            )}
            {isFullPost(post) && post.likes > 0 && (
              <span className="flex items-center space-x-1">
                <Heart className="w-4 h-4" />
                <span>{post.likes}</span>
              </span>
            )}
          </div>
        </div>

        {/* Read More */}
        <div className="mt-4 flex items-center text-cinnabar font-medium text-sm tracking-[0.08em] group-hover:translate-x-2 transition-transform">
          <span>阅读全文</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </div>
      </div>
    </motion.a>
  );
}
