import { useState, useEffect, lazy, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import SEO from './components/SEO';
import PostListSkeleton from './components/PostListSkeleton';
import { setupGlobalErrorHandler } from './components/ErrorBoundary';
import type { Post } from './types/blog';
import type { PostListItem } from './types/api';
import { getPostBySlug } from './data/blogData';

// 初始化全局错误处理
setupGlobalErrorHandler();

// 代码分割：延迟加载非首屏组件
const PostList = lazy(() => import('./components/PostList'));
const PostDetail = lazy(() => import('./components/PostDetail'));
const TagsPage = lazy(() => import('./components/TagsPage'));
const AboutPage = lazy(() => import('./components/AboutPage'));
const AdminPage = lazy(() => import('./components/AdminPage'));
const FeaturedGrid = lazy(() => import('./components/FeaturedGrid'));

// 加载骨架屏组件
function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl h-64" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

type ViewType = 'home' | 'articles' | 'tags' | 'about' | 'admin';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handle view change
  const handleViewChange = (view: string) => {
    setIsLoading(true);
    setCurrentView(view as ViewType);
    setSelectedPost(null);
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  // Handle post click - fetch full post from API
  const handlePostClick = async (postItem: PostListItem) => {
    setIsLoading(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      // 从 API 获取完整文章
      const response = await fetch(`/api/posts/${postItem.slug}`);
      const result = await response.json();

      if (result.success && result.data) {
        // 转换为 Post 类型
        const fullPost: Post = {
          id: result.data.id,
          title: result.data.title,
          slug: result.data.slug,
          excerpt: result.data.excerpt,
          content: result.data.content,
          coverImage: result.data.coverImage,
          author: {
            id: '1',
            name: '郏祥瑞',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop',
            bio: '软件测试工程师，4年测试经验',
            social: { github: 'https://github.com/mxqys', twitter: 'https://twitter.com/mxqys', email: '1102684926@qq.com' },
          },
          tags: [],
          category: { id: '1', name: '技术分享', description: '测试技术和经验分享', icon: 'Code' },
          createdAt: result.data.createdAt,
          updatedAt: result.data.createdAt,
          readTime: result.data.readTime,
          views: 0,
          likes: 0,
          comments: [],
          featured: result.data.featured,
        };
        setSelectedPost(fullPost);
      } else {
        // API 失败，尝试本地数据
        const localPost = getPostBySlug(postItem.slug);
        if (localPost) {
          setSelectedPost(localPost);
        }
      }
    } catch (error) {
      console.error('Failed to fetch post:', error);
      // 降级到本地数据
      const localPost = getPostBySlug(postItem.slug);
      if (localPost) {
        setSelectedPost(localPost);
      }
    }

    setIsLoading(false);
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentView('articles');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle back from post detail
  const handleBackFromPost = () => {
    setSelectedPost(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Check URL for direct post access or admin
  useEffect(() => {
    const path = window.location.pathname;
    const slug = path.replace('/', '');

    if (slug === 'admin') {
      setCurrentView('admin');
    } else if (slug) {
      const post = getPostBySlug(slug);
      if (post) {
        setSelectedPost(post);
      }
    }
  }, []);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const slug = path.replace('/', '');
      if (slug === 'admin') {
        setSelectedPost(null);
        setCurrentView('admin');
      } else if (slug) {
        const post = getPostBySlug(slug);
        if (post) {
          setSelectedPost(post);
        } else {
          setSelectedPost(null);
          setCurrentView('home');
        }
      } else {
        setSelectedPost(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update URL when post changes
  useEffect(() => {
    if (selectedPost) {
      window.history.pushState({}, '', `/${selectedPost.slug}`);
    } else {
      window.history.pushState({}, '', '/');
    }
  }, [selectedPost]);

  return (
    <div className="ink-page min-h-screen">
      {/* Navbar */}
      <Navbar
        currentView={currentView}
        onViewChange={handleViewChange}
        onSearch={handleSearch}
        onPostClick={handlePostClick}
      />

      {/* SEO */}
      <SEO />

      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-12 h-12 border-4 border-violet-200 dark:border-violet-800 border-t-violet-600 rounded-full"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main id="main-content">
        <AnimatePresence mode="wait">
          {selectedPost ? (
            <motion.div
              key="post-detail"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Suspense fallback={<LoadingSkeleton />}>
                <PostDetail
                  post={selectedPost}
                  onBack={handleBackFromPost}
                  onPostClick={handlePostClick}
                />
              </Suspense>
            </motion.div>
          ) : (
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentView === 'home' && (
                <>
                  <Hero onExplore={() => handleViewChange('articles')} />
                  <div className="relative py-20 md:py-28">
                    <div className="paper-noise absolute inset-0" aria-hidden="true" />
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                      <Suspense fallback={<PostListSkeleton />}>
                        <FeaturedGrid onPostClick={handlePostClick} />
                      </Suspense>
                    </div>
                  </div>
                </>
              )}

              {currentView === 'articles' && (
                <Suspense fallback={<PostListSkeleton />}>
                  <PostList
                    onPostClick={handlePostClick}
                    initialSearchQuery={searchQuery}
                  />
                </Suspense>
              )}

              {currentView === 'tags' && (
                <Suspense fallback={<LoadingSkeleton />}>
                  <TagsPage onPostClick={handlePostClick} />
                </Suspense>
              )}

              {currentView === 'about' && (
                <Suspense fallback={<LoadingSkeleton />}>
                  <AboutPage />
                </Suspense>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Admin page — full screen, no nav/footer */}
        {currentView === 'admin' && (
          <Suspense fallback={<LoadingSkeleton />}>
            <AdminPage onBack={() => {
              setCurrentView('home');
              window.history.pushState({}, '', '/');
            }} />
          </Suspense>
        )}
      </main>

      {/* Footer */}
      {!selectedPost && currentView !== 'admin' && <Footer onViewChange={handleViewChange} />}

      {/* 返回顶部按钮 & 滚动进度条 */}
      {currentView !== 'admin' && <ScrollToTop />}
    </div>
  );
}

export default App;
