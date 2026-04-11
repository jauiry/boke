import { useState, useEffect, lazy, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import type { Post } from './types/blog';
import { getPostBySlug } from './data/blogData';

// 代码分割：延迟加载非首屏组件
const PostList = lazy(() => import('./components/PostList'));
const PostDetail = lazy(() => import('./components/PostDetail'));
const TagsPage = lazy(() => import('./components/TagsPage'));
const AboutPage = lazy(() => import('./components/AboutPage'));

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

type ViewType = 'home' | 'articles' | 'tags' | 'about';

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

  // Handle post click
  const handlePostClick = (post: Post) => {
    setIsLoading(true);
    setSelectedPost(post);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
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

  // Check URL for direct post access
  useEffect(() => {
    const path = window.location.pathname;
    const slug = path.replace('/', '');
    
    if (slug) {
      const post = getPostBySlug(slug);
      if (post) {
        setSelectedPost(post);
      }
    }
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Navbar */}
      <Navbar
        currentView={currentView}
        onViewChange={handleViewChange}
        onSearch={handleSearch}
      />

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
      <main>
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
                  <div className="py-16 bg-white dark:bg-slate-900">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                      <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                          精选文章
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400">
                          推荐阅读的高质量内容
                        </p>
                      </div>
                      <PostList
                        onPostClick={handlePostClick}
                        initialSearchQuery={searchQuery}
                      />
                    </div>
                  </div>
                </>
              )}

              {currentView === 'articles' && (
                <Suspense fallback={<LoadingSkeleton />}>
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
      </main>

      {/* Footer */}
      {!selectedPost && <Footer onViewChange={handleViewChange} />}

      {/* 返回顶部按钮 & 滚动进度条 */}
      <ScrollToTop />
    </div>
  );
}

export default App;
