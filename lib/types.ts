export type Category =
  | 'UI'
  | 'UX'
  | 'AX'
  | 'VibeCoding'
  | 'DesignSystems'
  | 'Prototypes'
  | 'ComponentLibraries'
  | 'Interactions';

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  url: string;
  source: string;
  category: Category[];
  publishDate: Date;
  imageUrl?: string;
  author?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  category: Category[];
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'published';
  tags?: string[];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  htmlContent: string;
  category: Category[];
  createdAt: Date;
  publishedAt: Date;
  excerpt?: string;
  tags?: string[];
}

export interface NewsSource {
  name: string;
  url: string;
  rssUrl: string;
  categories?: Category[];
}

export interface FilterOptions {
  categories: Category[];
  sources: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  searchQuery?: string;
}

export interface ViewMode {
  type: 'grid' | 'list' | 'compact';
}

export interface UserPreferences {
  favoriteCategories: Category[];
  viewMode: ViewMode;
  darkMode: boolean;
}

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnailUrl: string;
  channelName: string;
  channelId: string;
  category: Category[];
  publishDate: Date;
  duration?: string;
  viewCount?: number;
}

