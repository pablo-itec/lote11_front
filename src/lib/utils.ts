export function fmt(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function imgSrc(url?: string): string {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  const base = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api').replace(/\/api$/, '');
  return `${base}${url}`;
}
