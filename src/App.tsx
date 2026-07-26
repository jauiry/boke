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

function resolveLocation(): { view: ViewType; post: Post | null } {
  const slug = window.location.pathname.replace(/^\/+|\/+$/g, '');
  if (!slug) return { view: 'home', post: null };
  if (slug === 'articles' || slug === 'tags' || slug === 'about' || slug === 'admin') {
    return { view: slug, post: null };
  }
  return { view: 'home', post: getPostBySlug(slug) ?? null };
}

function App() {
  const [currentView, setCurrentView] = useState<ViewType>(() => resolveLocation().view);
  const [selectedPost, setSelectedPost] = useState<Post | null>(() => resolveLocation().post);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle view change
  const handleViewChange = (view: string) => {
    setCurrentView(view as ViewType);
    setSelectedPost(null);
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 文章正文随应用发布，直接本地解析，避免重复请求详情接口。
  const handlePostClick = (postItem: PostListItem) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const localPost = getPostBySlug(postItem.slug);
    if (localPost) setSelectedPost(localPost);
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

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const route = resolveLocation();
      setCurrentView(route.view);
      setSelectedPost(route.post);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Keep the URL aligned with the active view.
  useEffect(() => {
    if (selectedPost) {
      window.history.pushState({}, '', `/${selectedPost.slug}`);
    } else {
      window.history.pushState({}, '', currentView === 'home' ? '/' : `/${currentView}`);
    }
  }, [currentView, selectedPost]);

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
                  <div className="featured-scroll-section relative py-20 md:py-24">
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
