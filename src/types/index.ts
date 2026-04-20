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

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
