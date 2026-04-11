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
import { Textarea } from '@/components/ui/textarea';
import type { Post } from '@/types/blog';
import { getRelatedPosts } from '@/data/blogData';
import PostCard from './PostCard';

interface PostDetailProps {
  post: Post;
  onBack: () => void;
  onPostClick: (post: Post) => void;
}

export default function PostDetail({ post, onBack, onPostClick }: PostDetailProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);

  const relatedPosts = getRelatedPosts(post, 3);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
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

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      // 这里可以添加提交评论的逻辑
      setCommentText('');
    }
  };

  // 渲染 Markdown 内容（简化版本）
  const renderContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, index) => {
      const trimmedLine = line.trim();
      
      if (trimmedLine.startsWith('## ')) {
        return (
          <h2 key={index} className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">
            {trimmedLine.replace('## ', '')}
          </h2>
        );
      }
      
      if (trimmedLine.startsWith('### ')) {
        return (
          <h3 key={index} className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">
            {trimmedLine.replace('### ', '')}
          </h3>
        );
      }
      
      if (trimmedLine.startsWith('```')) {
        return null; // 代码块处理简化
      }
      
      if (trimmedLine.startsWith('- ')) {
        return (
          <li key={index} className="text-slate-700 dark:text-slate-300 ml-6 mb-2">
            {trimmedLine.replace('- ', '')}
          </li>
        );
      }
      
      if (trimmedLine.startsWith('1. ') || trimmedLine.startsWith('2. ') || trimmedLine.startsWith('3. ')) {
        return (
          <li key={index} className="text-slate-700 dark:text-slate-300 ml-6 mb-2 list-decimal">
            {trimmedLine.replace(/^\d+\. /, '')}
          </li>
        );
      }
      
      if (trimmedLine === '') {
        return <div key={index} className="h-4" />;
      }
      
      if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
        return (
          <p key={index} className="text-slate-700 dark:text-slate-300 mb-4 font-semibold">
            {trimmedLine.replace(/\*\*/g, '')}
          </p>
        );
      }
      
      return (
        <p key={index} className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
          {trimmedLine}
        </p>
      );
    });
  };

  return (
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

        {/* Comments Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
            评论 ({post.comments.length})
          </h3>
          
          {/* Comment Form */}
          <form onSubmit={handleSubmitComment} className="mb-8">
            <Textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="写下你的想法..."
              className="mb-4 resize-none"
              rows={4}
            />
            <Button type="submit" className="bg-violet-600 hover:bg-violet-700">
              发表评论
            </Button>
          </form>

          {/* Comments List */}
          <div className="space-y-6">
            {post.comments.map((comment, index) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex space-x-4"
              >
                <Avatar className="w-10 h-10">
                  <AvatarImage src={comment.avatar} alt={comment.author} />
                  <AvatarFallback>{comment.author[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-slate-900 dark:text-white">
                      {comment.author}
                    </span>
                    <span className="text-sm text-slate-500">
                      {comment.createdAt}
                    </span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300">
                    {comment.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
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
                  onClick={() => onPostClick(relatedPost)}
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
  );
}
