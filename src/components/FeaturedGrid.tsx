import type { MouseEvent } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, UserRound } from 'lucide-react';
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

function categoryLabel(post: PostListItem): string {
  const value = `${post.title} ${post.excerpt}`.toLowerCase();
  if (value.includes('pytest') || value.includes('自动化')) return '自动化测试';
  if (value.includes('性能') || value.includes('jmeter')) return '性能测试';
  if (value.includes('git')) return '工具与框架';
  if (value.includes('docker') || value.includes('ci')) return '质量保障';
  return '测试基础';
}

function ScrollArticleCard({ post, index, onClick }: { post: PostListItem; index: number; onClick: () => void }) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    onClick();
  };

  return (
    <motion.a
      href={`/${post.slug}`}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      onClick={handleClick}
      className={`scroll-article-card scroll-article-card-${index + 1}`}
    >
      <span className="scroll-card-label">{categoryLabel(post)}</span>
      <h3>{post.title}</h3>
      <p>{post.excerpt}</p>
      <div className="scroll-card-meta">
        <span><UserRound aria-hidden="true" />郏祥瑞</span>
        <span><Calendar aria-hidden="true" />{formatDate(post.createdAt)}</span>
        <span><Clock aria-hidden="true" />{post.readTime} 分钟</span>
      </div>
    </motion.a>
  );
}

export default function FeaturedGrid({ onPostClick }: FeaturedGridProps) {
  const posts = usePostList();
  const featured = posts.filter((post) => post.featured);
  const displayPosts = [...featured, ...posts.filter((post) => !post.featured)].slice(0, 3);

  if (displayPosts.length === 0) return null;

  return (
    <div className="featured-scroll relative mb-20">
      <div className="scroll-article-grid">
        {displayPosts.map((post, index) => (
          <ScrollArticleCard key={post.slug} post={post} index={index} onClick={() => onPostClick(post)} />
        ))}
      </div>
    </div>
  );
}
