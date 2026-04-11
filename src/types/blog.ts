// 博客文章类型定义

export interface Author {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  social: {
    github?: string;
    twitter?: string;
    email?: string;
  };
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  createdAt: string;
  replies?: Comment[];
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  author: Author;
  tags: Tag[];
  category: Category;
  createdAt: string;
  updatedAt: string;
  readTime: number;
  views: number;
  likes: number;
  comments: Comment[];
  featured?: boolean;
}

export interface BlogStats {
  totalPosts: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
}
