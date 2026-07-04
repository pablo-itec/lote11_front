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
  pip: CarouselPip;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CarouselPip = "red" | "brown" | "dim";

export interface TarjeteroPerson {
  id: number;
  groupId: number;
  name: string;
  role?: string;
  imageUrl?: string;
  email?: string;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TarjeteroGroup {
  id: number;
  name: string;
  slug: string;
  imageUrl?: string;
  description?: string;
  order: number;
  active: boolean;
  sectionId?: number | null;
  people?: TarjeteroPerson[];
  createdAt: string;
  updatedAt: string;
}

// Sección/etiqueta que agrupa rubros en el menú del tarjetero.
// El bucket "sin sección" que devuelve el back viene con id/name/slug null.
export interface TarjeteroSection {
  id: number | null;
  name: string | null;
  slug: string | null;
  description?: string | null;
  imageUrl?: string | null;
  priority: number | null;
  randomOrder?: number | null;
  active: boolean;
  groups?: TarjeteroGroup[];
  createdAt: string | null;
  updatedAt: string | null;
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
