import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { PostListItem } from '@/types/api';
import { usePostList } from '@/hooks/usePosts';

interface FeaturedGridProps {
  onPostClick: (post: PostListItem) => void;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

async function getCoverUrl(coverImage: string | undefined): Promise<string | null> {
  if (!coverImage) return null;
  if (coverImage.startsWith('/')) {
    try {
      const res = await fetch(coverImage);
      const data = await res.json();
      return data.base64 ? `data:image/jpeg;base64,${data.base64}` : null;
    } catch { return null; }
  }
  if (coverImage.startsWith('data:')) return coverImage;
  return coverImage;
}

function BentoCard({
  post,
  size,
  index,
  onClick,
}: {
  post: PostListItem;
  size: 'large' | 'tall' | 'wide';
  index: number;
  onClick: () => void;
}) {
  const [coverUrl, setCoverUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getCoverUrl(post.coverImage).then(url => { if (!cancelled) setCoverUrl(url); });
    return () => { cancelled = true; };
  }, [post.coverImage]);

  const sizeClasses = {
    large: 'md:col-span-2 md:row-span-2',
    tall: 'md:row-span-2',
    wide: 'md:col-span-2',
  };

  const isLarge = size === 'large';

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={onClick}
      className={`ink-card group cursor-pointer relative overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:border-[var(--cinnabar)] ${sizeClasses[size]} flex flex-col`}
    >
      {/* Cover */}
      <div className={`relative overflow-hidden ${isLarge ? 'h-64 md:h-80' : 'h-40 md:h-48'} shrink-0`}>
        {coverUrl ? (
          <img src={coverUrl} alt={post.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full bg-[radial-gradient(circle_at_65%_28%,rgba(168,63,50,.42),transparent_18%),linear-gradient(145deg,#d8d2c5,#59615a)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        {post.featured && (
          <div className="absolute top-3 left-3">
            <Badge className="rounded-none border-0 bg-[var(--cinnabar)] text-white backdrop-blur-sm">精选</Badge>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
          <h3 className={`font-serif-cn font-semibold tracking-[0.06em] text-white transition-colors ${isLarge ? 'text-xl md:text-3xl' : 'text-lg md:text-xl'} line-clamp-2`}>
            {post.title}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 md:p-5 flex flex-col">
        <p className={`text-ink-soft line-clamp-2 mb-3 leading-7 ${isLarge ? 'text-base' : 'text-sm'}`}>
          {post.excerpt}
        </p>
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 text-xs text-ink-muted">
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(post.createdAt)}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}分钟</span>
          </div>
          <span className="flex items-center text-xs font-medium text-cinnabar group-hover:translate-x-1 transition-transform">
            阅读 <ArrowRight className="w-3 h-3 ml-0.5" />
          </span>
        </div>
      </div>
    </motion.article>
  );
}

export default function FeaturedGrid({ onPostClick }: FeaturedGridProps) {
  const posts = usePostList();
  const featured = posts.filter(p => p.featured);
  const recent = posts.filter(p => !p.featured).slice(0, 2);

  // Mix: first 2 featured + 2 recent for variety
  const displayPosts = [...featured.slice(0, 2), ...recent].slice(0, 4);

  if (displayPosts.length === 0) return null;

  // Assign sizes based on position
  const sizes: ('large' | 'tall' | 'wide')[] = ['large', 'tall', 'wide', 'tall'];

  return (
    <div className="relative mb-20">
      <div className="text-center mb-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif-cn text-3xl md:text-4xl font-semibold text-ink mb-3 tracking-[0.12em]"
        >
          卷中精选
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-sm tracking-[0.18em] text-ink-muted"
        >
          择数篇，邀君共读
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[minmax(200px,auto)]">
        {displayPosts.map((post, i) => (
          <BentoCard
            key={post.id}
            post={post}
            size={sizes[i]}
            index={i}
            onClick={() => onPostClick(post)}
          />
        ))}
      </div>
    </div>
  );
}
