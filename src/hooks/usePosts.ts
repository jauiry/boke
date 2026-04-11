import { use, useState, useEffect } from 'react';
import { posts as localPosts, tags as localTags, categories as localCategories } from '@/data/blogData';
import type { PostListItem, ApiResponse } from '@/types/api';

// 缓存 promise，避免重复请求
const postListPromiseCache = new Map<string, Promise<PostListItem[]>>();

// 获取文章列表（轻量化 API）
async function fetchPostListFromAPI(): Promise<PostListItem[]> {
  try {
    const response = await fetch('/api/posts');
    const result: ApiResponse<PostListItem[]> = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to fetch posts');
    }

    return result.data;
  } catch (error) {
    console.error('API fetch failed, falling back to local data:', error);
    // 降级到本地数据
    return localPosts.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      createdAt: post.createdAt,
      readTime: post.readTime,
      coverImage: post.coverImage,
      featured: post.featured,
    }));
  }
}

// React 19 use() 风格的 Hook
export function usePostList(): PostListItem[] {
  const cacheKey = 'postList';

  if (!postListPromiseCache.has(cacheKey)) {
    postListPromiseCache.set(cacheKey, fetchPostListFromAPI());
  }

  // 使用 use() 来消费 Promise
  return use(postListPromiseCache.get(cacheKey)!);
}

// 预加载文章列表（用于路由切换时预热缓存）
export function preloadPostList(): void {
  const cacheKey = 'postList';
  if (!postListPromiseCache.has(cacheKey)) {
    postListPromiseCache.set(cacheKey, fetchPostListFromAPI());
  }
}

// 本地标签/分类数据（用于列表页筛选）
export function useLocalTags() {
  return localTags;
}

export function useLocalCategories() {
  return localCategories;
}

// 格式化日期为 YYYY年MM月DD日
export function formatDateChinese(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}年${month}月${day}日`;
}

// 加载封面图片 URL
export function useCoverImage(coverImage: string | undefined) {
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadCover() {
      if (!coverImage) {
        setIsLoading(false);
        return null;
      }

      try {
        let url: string;

        if (coverImage.startsWith('/')) {
          // JSON 文件路径
          const response = await fetch(coverImage);
          const data = await response.json();
          url = `data:image/jpeg;base64,${data.base64}`;
        } else if (coverImage.startsWith('data:')) {
          // 直接的 data URI
          url = coverImage;
        } else {
          url = coverImage;
        }

        if (isMounted) {
          setCoverUrl(url);
        }
      } catch (error) {
        console.error('Failed to load cover:', error);
        if (isMounted) {
          setCoverUrl(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadCover();

    return () => {
      isMounted = false;
    };
  }, [coverImage]);

  return { coverUrl, isLoading };
}
