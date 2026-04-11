import { motion } from 'framer-motion';

function SkeletonCard({ index = 0 }: { index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
    >
      {/* Image skeleton */}
      <div className="h-48 bg-slate-200 dark:bg-slate-700 animate-pulse" />

      {/* Content skeleton */}
      <div className="p-6 space-y-4">
        {/* Tags skeleton */}
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" />
          <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" />
        </div>

        {/* Title skeleton */}
        <div className="h-7 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse w-3/4" />

        {/* Excerpt skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-5/6" />
        </div>

        {/* Meta skeleton */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
          <div className="flex items-center space-x-4">
            <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SkeletonFeaturedCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 md:col-span-2 md:grid md:grid-cols-2"
    >
      {/* Image skeleton */}
      <div className="h-full min-h-[200px] bg-slate-200 dark:bg-slate-700 animate-pulse" />

      {/* Content skeleton */}
      <div className="p-8 space-y-4">
        {/* Tags skeleton */}
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" />
          <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" />
        </div>

        {/* Title skeleton */}
        <div className="h-9 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse w-4/5" />

        {/* Excerpt skeleton */}
        <div className="space-y-2">
          <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
          <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-5/6" />
        </div>

        {/* Meta skeleton */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
          <div className="flex items-center space-x-4">
            <div className="h-4 w-28 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function PostListSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header skeleton */}
        <div className="mb-8 space-y-4">
          <div className="h-10 w-48 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
          <div className="h-5 w-96 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
        </div>

        {/* Search skeleton */}
        <div className="mb-8">
          <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse" />
        </div>

        {/* Featured skeleton */}
        <div className="mb-12">
          <div className="h-7 w-32 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse mb-6" />
          <div className="grid md:grid-cols-2 gap-6">
            <SkeletonFeaturedCard />
          </div>
        </div>

        {/* Regular posts skeleton */}
        <div>
          <div className="h-7 w-32 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse mb-6" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <SkeletonCard key={i} index={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
