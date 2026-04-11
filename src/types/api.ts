// 轻量化文章类型（用于列表页 API）
export interface PostListItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  createdAt: string;
  readTime: number;
  coverImage?: string;
  featured?: boolean;
}

// API 响应类型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  source?: 'cache' | 'stale-cache' | 'api';
  timestamp?: number;
}
