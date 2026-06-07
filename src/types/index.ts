export interface Topic {
  id: number;
  name: string;
  description?: string;
  type: 'grouped' | 'separate';
  priority: number;
}

export interface ImportanceLevel {
  id: number;
  level: number;
  label: string;
  description?: string;
  notifySubscribers: boolean;
}

export interface News {
  id: number;
  title: string;
  subtitle?: string;
  body: string;
  author?: string;
  slug?: string;
  imageUrl?: string;
  imageCaption?: string;
  tags?: string[];
  status: 'draft' | 'published';
  featured: boolean;
  readTime?: number;
  clicks?: number;
  createdAt: string;
  topic?: Topic;
  topicId?: number;
  importanceLevel?: ImportanceLevel;
  importanceLevelId?: number;
}

export interface Subscriber {
  id: number;
  email: string;
  active: boolean;
  subscribedAt: string;
  unsubscribeToken?: string;
}

export interface Ad {
  id: number;
  side: 'left' | 'right';
  size: 'large' | 'small';
  imageUrl: string;
  linkUrl?: string;
  displayDuration: number;
  startsAt?: string;
  endsAt?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CarouselItem {
  id: number;
  label: string;
  content?: string;
  linkUrl?: string;
  imageUrl?: string;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NewsMetrics {
  totalClicks: number;
  ranking: Pick<News, 'id' | 'title' | 'slug' | 'clicks' | 'status'>[];
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
