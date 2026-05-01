import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Calendar, Clock, Eye, Heart, Share2,
  MessageCircle, Bookmark, Twitter, Linkedin, Link as LinkIcon,
  ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import Giscus from './Giscus';
import type { Post } from '@/types/blog';
import type { PostListItem } from '@/types/api';
import { getRelatedPosts } from '@/data/blogData';
import PostCard from './PostCard';
import SEO from './SEO';

// 转换 Post 为 PostListItem
function toPostListItem(post: Post): PostListItem {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    createdAt: post.createdAt,
    readTime: post.readTime,
    coverImage: post.coverImage,
    featured: post.featured,
  };
}

interface PostDetailProps {
  post: Post;
  onBack: () => void;
  onPostClick: (post: PostListItem) => void;
}

export default function PostDetail({ post, onBack, onPostClick }: PostDetailProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [readProgress, setReadProgress] = useState(0);

  const relatedPosts = getRelatedPosts(post, 3);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);

      // 计算阅读进度
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0;
      setReadProgress(progress);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = post.title;
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`);
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        break;
    }
    setShowShareMenu(false);
  };

  // 渲染 Markdown 内容（支持代码块）
  const renderContent = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeLines: string[] = [];

    const flushCodeBlock = () => {
      if (codeLines.length > 0) {
        elements.push(
          <pre key={`code-${elements.length}`} className="bg-slate-800 dark:bg-slate-950 text-slate-100 rounded-xl p-5 overflow-x-auto my-6 text-sm leading-relaxed">
            <code>{codeLines.join('\n')}</code>
          </pre>
        );
        codeLines = [];
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const trimmedLine = lines[i].trim();

      if (trimmedLine.startsWith('```')) {
        if (inCodeBlock) {
          flushCodeBlock();
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
        }
        continue;
      }

      if (inCodeBlock) {
        codeLines.push(lines[i]);
        continue;
      }

      if (trimmedLine.startsWith('## ')) {
        elements.push(
          <h2 key={i} className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">
            {trimmedLine.replace('## ', '')}
          </h2>
        );
      } else if (trimmedLine.startsWith('### ')) {
        elements.push(
          <h3 key={i} className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">
            {trimmedLine.replace('### ', '')}
          </h3>
        );
      } else if (trimmedLine.startsWith('# ')) {
        elements.push(
          <h1 key={i} className="text-3xl font-bold text-slate-900 dark:text-white mt-12 mb-6">
            {trimmedLine.replace('# ', '')}
          </h1>
        );
      } else if (trimmedLine.startsWith('- ')) {
        elements.push(
          <li key={i} className="text-slate-700 dark:text-slate-300 ml-6 mb-2">
            {trimmedLine.replace('- ', '')}
          </li>
        );
      } else if (/^\d+\.\s/.test(trimmedLine)) {
        elements.push(
          <li key={i} className="text-slate-700 dark:text-slate-300 ml-6 mb-2 list-decimal">
            {trimmedLine.replace(/^\d+\.\s/, '')}
          </li>
        );
      } else if (trimmedLine === '') {
        elements.push(<div key={i} className="h-4" />);
      } else if (trimmedLine.startsWith('> ')) {
        elements.push(
          <blockquote key={i} className="border-l-4 border-violet-500 pl-4 py-2 my-4 bg-slate-50 dark:bg-slate-800/50 italic text-slate-600 dark:text-slate-400">
            {trimmedLine.replace('> ', '')}
          </blockquote>
        );
      } else if (trimmedLine.startsWith('---')) {
        elements.push(<hr key={i} className="my-8 border-slate-200 dark:border-slate-700" />);
      } else if (trimmedLine.startsWith('| ')) {
        // Simple table row - render as styled text
        elements.push(
          <p key={i} className="text-slate-700 dark:text-slate-300 font-mono text-sm">
            {trimmedLine}
          </p>
        );
      } else {
        // Inline formatting: bold, italic, inline code
        const formatted = trimmedLine
          .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.+?)\*/g, '<em>$1</em>')
          .replace(/`(.+?)`/g, '<code class="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-violet-600 dark:text-violet-400 text-sm font-mono">$1</code>')
          .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-violet-600 dark:text-violet-400 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');

        elements.push(
          <p key={i} className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatted }} />
        );
      }
    }

    // Flush any remaining code block
    if (inCodeBlock) {
      flushCodeBlock();
    }

    return elements;
  };

  return (
    <>
      {/* SEO */}
      <SEO post={post} type="article" />

      {/* Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500 z-[100]"
        style={{ width: `${readProgress}%` }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen bg-slate-50 dark:bg-slate-900"
      >
      {/* Header */}
      <div className="sticky top-16 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回
            </Button>
            
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="text-slate-600 dark:text-slate-400"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
                
                {showShareMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute right-0 top-full mt-2 p-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50"
                  >
                    <button
                      onClick={() => handleShare('twitter')}
                      className="flex items-center space-x-2 w-full px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      <Twitter className="w-4 h-4 text-blue-400" />
                      <span className="text-sm">Twitter</span>
                    </button>
                    <button
                      onClick={() => handleShare('linkedin')}
                      className="flex items-center space-x-2 w-full px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      <Linkedin className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">LinkedIn</span>
                    </button>
                    <button
                      onClick={() => handleShare('copy')}
                      className="flex items-center space-x-2 w-full px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      <LinkIcon className="w-4 h-4" />
                      <span className="text-sm">复制链接</span>
                    </button>
                  </motion.div>
                )}
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={isBookmarked ? 'text-violet-600' : 'text-slate-600 dark:text-slate-400'}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cover Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-2xl overflow-hidden mb-8"
        >
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-64 md:h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <Badge className="mb-4 bg-violet-500 text-white border-0">
              {post.category.name}
            </Badge>
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-4">
              {post.title}
            </h1>
          </div>
        </motion.div>

        {/* Author & Meta */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback>{post.author.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-slate-900 dark:text-white">
                {post.author.name}
              </div>
              <div className="flex items-center space-x-3 text-sm text-slate-500 dark:text-slate-400">
                <span className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{post.createdAt}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{post.readTime} 分钟阅读</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
            <span className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{post.views}</span>
            </span>
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`flex items-center space-x-1 transition-colors ${
                isLiked ? 'text-red-500' : ''
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              <span>{post.likes + (isLiked ? 1 : 0)}</span>
            </button>
          </div>
        </motion.div>

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {post.tags.map((tag) => (
            <span
              key={tag.id}
              className="text-sm font-medium px-3 py-1 rounded-full"
              style={{ 
                backgroundColor: `${tag.color}20`, 
                color: tag.color 
              }}
            >
              {tag.name}
            </span>
          ))}
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="prose prose-slate dark:prose-invert max-w-none mb-12"
        >
          {renderContent(post.content)}
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center space-x-4 py-8 border-t border-b border-slate-200 dark:border-slate-800 mb-12"
        >
          <Button
            variant={isLiked ? 'default' : 'outline'}
            size="lg"
            onClick={() => setIsLiked(!isLiked)}
            className={isLiked ? 'bg-red-500 hover:bg-red-600 text-white' : ''}
          >
            <Heart className={`w-5 h-5 mr-2 ${isLiked ? 'fill-current' : ''}`} />
            {isLiked ? '已点赞' : '点赞'}
          </Button>
          <Button variant="outline" size="lg">
            <MessageCircle className="w-5 h-5 mr-2" />
            评论 ({post.comments.length})
          </Button>
        </motion.div>

        {/* Comments Section — powered by Giscus + GitHub Discussions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <Giscus />
        </motion.div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
              相关文章
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost, index) => (
                <PostCard
                  key={relatedPost.id}
                  post={relatedPost}
                  index={index}
                  onClick={() => onPostClick(toPostListItem(relatedPost))}
                  variant="compact"
                />
              ))}
            </div>
          </motion.div>
        )}
      </article>

      {/* Scroll to Top */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: showScrollTop ? 1 : 0 }}
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 p-3 bg-violet-600 text-white rounded-full shadow-lg hover:bg-violet-700 transition-colors z-50"
      >
        <ChevronUp className="w-5 h-5" />
      </motion.button>
    </motion.div>
  </>
  );
}
