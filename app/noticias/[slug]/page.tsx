import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, User, Tag, ArrowLeft } from "lucide-react";
import type { News } from "@/src/types";
import { fmt, newsSlides } from "@/src/lib/utils";
import { API_BASE } from "@/src/lib/api";
import NewsImageCarousel from "@/src/components/layout/NewsImageCarousel";

async function getNews(slug: string): Promise<News | null> {
  try {
    const res = await fetch(`${API_BASE}/news/slug/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function NewsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const news = await getNews(slug);
  if (!news) notFound();
  const slides = newsSlides(news);

  return (
    <div className="min-h-screen">
      <div className="max-w-[760px] mx-auto px-6 pt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.15em] uppercase text-brand-cream/40 hover:text-brand-cream transition-colors"
        >
          <ArrowLeft size={12} /> Volver
        </Link>
      </div>

      <article className="max-w-[760px] mx-auto px-6 py-6 pb-16">
        <div className="glass-panel rounded-[44px] overflow-hidden">
          {slides.length > 0 && (
            <div className="relative h-[240px] sm:h-[320px] overflow-hidden rounded-t-[44px]">
              <NewsImageCarousel slides={slides} alt={news.title} priority />
            </div>
          )}

          <div className="p-8 md:p-12">
            <div className="flex flex-wrap gap-2 mb-5">
              {news.featured && (
                <span className="abadge abadge-brown">★ Destacada</span>
              )}
              {news.importanceLevel && (
                <span className="abadge abadge-red">
                  Niv.{news.importanceLevel.level} · {news.importanceLevel.label}
                </span>
              )}
              {news.topic && (
                <span className="abadge abadge-gray">{news.topic.name}</span>
              )}
            </div>

            <h1 className="font-serif text-[28px] sm:text-[36px] font-black text-brand-brown leading-tight mb-3">
              {news.title}
            </h1>

            {news.subtitle && (
              <p className="text-[13px] text-brand-cream/55 leading-relaxed mb-5 italic">
                {news.subtitle}
              </p>
            )}

            <div className="flex flex-wrap gap-4 mb-7 text-[10px] text-brand-cream/40 font-medium">
              {news.author && (
                <span className="flex items-center gap-1.5">
                  <User size={12} className="text-brand-brown" />
                  {news.author}
                </span>
              )}
              <span>{fmt(news.createdAt)}</span>
              {news.readTime && (
                <span className="flex items-center gap-1.5">
                  <Clock size={12} className="text-brand-brown" />
                  {news.readTime} min lectura
                </span>
              )}
            </div>

            <div className="h-px bg-white/[0.06] mb-7" />

            <div className="text-[14px] text-brand-cream/80 leading-[1.85] whitespace-pre-wrap drop-cap">
              {news.body}
            </div>

            {news.tags && news.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-7 pt-6 border-t border-white/[0.06]">
                <Tag size={12} className="text-brand-cream/30 mt-0.5" />
                {news.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[9px] font-bold tracking-[0.12em] uppercase text-brand-cream/35 bg-white/[0.04] border border-white/[0.06] px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
