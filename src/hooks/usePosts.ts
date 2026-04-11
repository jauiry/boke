import { use } from 'react';

// 缓存 promise，避免重复请求
const postListPromiseCache = new Map<string, Promise<any>>();

// 获取文章列表（轻量化，仅标题/摘要/日期）
export function usePostList() {
  const cacheKey = 'postList';

  if (!postListPromiseCache.has(cacheKey)) {
    postListPromiseCache.set(cacheKey, fetchPostList());
  }

  return use(postListPromiseCache.get(cacheKey)!);
}

// 获取单篇文章详情
export function usePostDetail(slug: string) {
  const cacheKey = `postDetail-${slug}`;

  if (!postListPromiseCache.has(cacheKey)) {
    postListPromiseCache.set(cacheKey, fetchPostDetail(slug));
  }

  return use(postListPromiseCache.get(cacheKey)!);
}

async function fetchPostList(): Promise<any> {
  try {
    const response = await fetch('/api/posts');
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error);
    }

    return result.data;
  } catch (error) {
    console.error('Failed to fetch post list:', error);
    throw error;
  }
}

async function fetchPostDetail(slug: string): Promise<any> {
  try {
    const response = await fetch(`/api/posts/${slug}`);
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error);
    }

    return result.data;
  } catch (error) {
    console.error('Failed to fetch post detail:', error);
    throw error;
  }
}

// 预加载文章列表（用于首页）
export function preloadPostList(): void {
  const cacheKey = 'postList';
  if (!postListPromiseCache.has(cacheKey)) {
    postListPromiseCache.set(cacheKey, fetchPostList());
  }
}
