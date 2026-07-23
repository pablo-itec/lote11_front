export function fmt(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

import { API_ORIGIN } from './api';
import type { News } from '@/src/types';

export function imgSrc(url?: string): string {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  return `${API_ORIGIN}${url}`;
}

export interface NewsSlide {
  url: string;
  caption?: string;
}

// Combina portada + galería (en ese orden) para el carrusel de la vista de detalle.
export function newsSlides(news: Pick<News, 'imageUrl' | 'imageCaption' | 'images'>): NewsSlide[] {
  const slides: NewsSlide[] = [];
  if (news.imageUrl) slides.push({ url: news.imageUrl, caption: news.imageCaption });
  for (const img of news.images ?? []) {
    slides.push({ url: img.imageUrl, caption: img.caption });
  }
  return slides;
}
