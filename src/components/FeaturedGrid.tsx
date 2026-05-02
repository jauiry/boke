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
      className={`group cursor-pointer relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-violet-300/50 dark:hover:border-violet-600/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(139,92,246,0.15)] dark:hover:shadow-[0_8px_30px_rgba(139,92,246,0.2)] ${sizeClasses[size]} flex flex-col`}
    >
      {/* Cover */}
      <div className={`relative overflow-hidden ${isLarge ? 'h-64 md:h-80' : 'h-40 md:h-48'} shrink-0`}>
        {coverUrl ? (
          <img src={coverUrl} alt={post.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        {post.featured && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-violet-500/90 text-white border-0 backdrop-blur-sm">精选</Badge>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
          <h3 className={`font-bold text-white group-hover:text-violet-200 transition-colors ${isLarge ? 'text-xl md:text-3xl' : 'text-lg md:text-xl'} line-clamp-2`}>
            {post.title}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 md:p-5 flex flex-col">
        <p className={`text-slate-600 dark:text-slate-400 line-clamp-2 mb-3 ${isLarge ? 'text-base' : 'text-sm'}`}>
          {post.excerpt}
        </p>
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 text-xs text-slate-400">
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(post.createdAt)}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}分钟</span>
          </div>
          <span className="flex items-center text-xs font-medium text-violet-600 dark:text-violet-400 group-hover:translate-x-1 transition-transform">
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
    <div className="mb-16">
      <div className="text-center mb-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight"
        >
          精选文章
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-slate-500 dark:text-slate-400"
        >
          推荐阅读的高质量内容
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
