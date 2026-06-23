import type { News, Topic, ImportanceLevel, Subscriber, PaginatedResponse, Ad, NewsMetrics, CarouselItem } from '@/src/types';

// Única fuente de verdad para la URL del backend.
// Server (SSR/server components): prioriza API_URL; cae a NEXT_PUBLIC_API_URL.
// Browser: usa NEXT_PUBLIC_API_URL (inlineada en build por Next).
export const API_BASE = typeof window === 'undefined'
  ? (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api')
  : (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api');

// Mismo host sin el sufijo /api (para construir URLs de assets/imágenes).
export const API_ORIGIN = API_BASE.replace(/\/api$/, '');

const BASE = API_BASE;

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('admin_token');
}

async function req<T>(method: string, path: string, body?: unknown, isFormData = false): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!isFormData && body) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: isFormData ? (body as FormData) : body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && typeof window !== 'undefined') {
      auth.clearToken();
      window.location.replace('/admin');
    }
    throw new Error((data as { message?: string }).message || `Error ${res.status}`);
  }
  return data as T;
}

function buildQuery(params: Record<string, unknown>): string {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== '');
  return new URLSearchParams(entries.map(([k, v]) => [k, String(v)])).toString();
}

export const auth = {
  setToken: (t: string) => {
    if (typeof window !== 'undefined') localStorage.setItem('admin_token', t);
  },
  clearToken: () => {
    if (typeof window !== 'undefined') localStorage.removeItem('admin_token');
  },
  hasToken: (): boolean => !!getToken(),
  login: (email: string, password: string) =>
    req<{ access_token: string }>('POST', '/auth/login', { email, password }),
};

export const newsApi = {
  getPublic: (params: Record<string, unknown> = {}) =>
    req<PaginatedResponse<News>>('GET', `/news?${buildQuery(params)}`),
  getDetail: (id: number) => req<News>('GET', `/news/${id}`),
  getAll: (params: Record<string, unknown> = {}) =>
    req<PaginatedResponse<News>>('GET', `/news/admin/all?${buildQuery(params)}`),
  create: (formData: FormData) => req<News>('POST', '/news', formData, true),
  update: (id: number, formData: FormData) => req<News>('PATCH', `/news/${id}`, formData, true),
  publish: (id: number) => req<News>('PATCH', `/news/${id}/publish`),
  unpublish: (id: number) => req<News>('PATCH', `/news/${id}/unpublish`),
  toggleFeatured: (id: number) => req<News>('PATCH', `/news/${id}/featured`),
  registerClick: (id: number) => req<{ id: number; clicks: number }>('PATCH', `/news/${id}/click`),
  remove: (id: number) => req<void>('DELETE', `/news/${id}`),
};

export const metricsApi = {
  getNews: (limit?: number) =>
    req<NewsMetrics>('GET', `/news/admin/metrics${limit ? `?limit=${limit}` : ''}`),
};

export const carouselApi = {
  getActive: () => req<CarouselItem[]>('GET', '/carousel'),
  getAll: () => req<CarouselItem[]>('GET', '/carousel/admin/all'),
  create: (data: Partial<CarouselItem>) => req<CarouselItem>('POST', '/carousel', data),
  update: (id: number, data: Partial<CarouselItem>) =>
    req<CarouselItem>('PATCH', `/carousel/${id}`, data),
  remove: (id: number) => req<void>('DELETE', `/carousel/${id}`),
};

export const subscribersApi = {
  subscribe: (email: string) => req<{ message: string }>('POST', '/subscribers', { email }),
  unsubscribe: (unsubToken: string) =>
    req<{ message: string }>('GET', `/subscribers/unsubscribe/${unsubToken}`),
  getAll: (search?: string, page?: number) =>
    req<PaginatedResponse<Subscriber>>('GET', `/subscribers?${buildQuery({ search, page })}`),
  deactivate: (id: number) => req<Subscriber>('PATCH', `/subscribers/${id}/deactivate`),
};

export const topicsApi = {
  getAll: () => req<Topic[]>('GET', '/topics'),
  create: (data: Partial<Topic>) => req<Topic>('POST', '/topics', data),
  update: (id: number, data: Partial<Topic>) => req<Topic>('PATCH', `/topics/${id}`, data),
  remove: (id: number) => req<void>('DELETE', `/topics/${id}`),
};

export const adsApi = {
  getBySide: (side: 'left' | 'right') => req<Ad[]>('GET', `/ads/${side}`),
  getAdminAll: (side?: string) =>
    req<Ad[]>('GET', `/ads/admin/all${side ? `?side=${side}` : ''}`),
  create: (formData: FormData) => req<Ad>('POST', '/ads', formData, true),
  update: (id: number, formData: FormData) => req<Ad>('PATCH', `/ads/${id}`, formData, true),
  reorder: (id: number, newOrder: number) => req<Ad[]>('PATCH', `/ads/${id}/reorder`, { newOrder }),
  remove: (id: number) => req<void>('DELETE', `/ads/${id}`),
};

export const importanceApi = {
  getAll: () => req<ImportanceLevel[]>('GET', '/importance-levels'),
  create: (data: Partial<ImportanceLevel>) => req<ImportanceLevel>('POST', '/importance-levels', data),
  update: (id: number, data: Partial<ImportanceLevel>) =>
    req<ImportanceLevel>('PATCH', `/importance-levels/${id}`, data),
  toggleNotify: (id: number) =>
    req<ImportanceLevel>('PATCH', `/importance-levels/${id}/toggle-notify`),
  remove: (id: number) => req<void>('DELETE', `/importance-levels/${id}`),
};
