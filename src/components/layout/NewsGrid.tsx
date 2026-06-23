"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { News } from "@/src/types";
import { fmt, imgSrc } from "@/src/lib/utils";

const PLACEHOLDER_IMG = "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=800&auto=format&fit=crop";

interface Props {
  news?: News[];
  loading?: boolean;
  onNewsClick?: (id: number) => void;
}

function SkeletonCard() {
  return (
    <div className="glass-panel rounded-[36px] overflow-hidden flex flex-col">
      <div className="h-[145px] shimmer" />
      <div className="p-6 flex flex-col gap-3">
        <div className="h-2 w-16 rounded-full shimmer" />
        <div className="h-4 w-full rounded shimmer" />
        <div className="h-3 w-3/4 rounded shimmer" />
        <div className="h-3 w-1/2 rounded shimmer" />
      </div>
    </div>
  );
}

function NewsCard({ news, onClick }: { news: News; onClick: () => void }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: [0.22, 0.68, 0, 1] }}
      className="news-card glass-panel rounded-[36px] overflow-hidden flex flex-col cursor-pointer"
      onClick={onClick}
    >
      <div className="relative h-[160px] overflow-hidden">
        <Image
          src={news.imageUrl ? imgSrc(news.imageUrl) : PLACEHOLDER_IMG}
          fill
          alt={news.title}
          className="news-img object-cover duotone"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {/* Editorial overlay reveal on hover */}
        <div className="news-overlay absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex items-end p-5">
          <span className="text-[10px] text-brand-cream/85 italic font-medium leading-snug line-clamp-3">
            {news.subtitle ?? news.title}
          </span>
        </div>

        {news.featured && (
          <span className="absolute top-3 right-3 bg-brand-brown text-white text-[7px] font-bold tracking-[0.18em] px-3 py-1 rounded-full uppercase z-10 elev-2">
            ★ Dest.
          </span>
        )}
        {news.topic && (
          <span className="absolute top-3 left-3 bg-black/55 backdrop-blur-sm text-brand-cream/90 text-[7px] font-bold tracking-[0.15em] px-3 py-1 rounded-full uppercase border border-white/10 z-10">
            {news.topic.name}
          </span>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        {news.importanceLevel && (
          <span className="kicker mb-3">
            Niv.{news.importanceLevel.level} · {news.importanceLevel.label}
          </span>
        )}
        <h3 className="font-serif text-[18px] font-bold text-brand-brown leading-snug mb-2 line-clamp-2">
          {news.title}
        </h3>
        {news.subtitle && (
          <p className="text-[10px] text-brand-cream/55 leading-relaxed flex-1 mb-2 line-clamp-2">
            {news.subtitle}
          </p>
        )}
        <p className="text-[9px] text-brand-cream/45 mb-4 font-medium">
          {news.author && <span className="text-brand-cream/60">{news.author} · </span>}
          {fmt(news.createdAt)}
          {news.readTime && ` · ${news.readTime} min`}
        </p>
        <Link
          href={`/noticias/${news.slug}`}
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-2 px-7 py-[10px] rounded-full text-[9px] font-bold tracking-[0.2em] uppercase transition-colors bg-brand-cream/[0.07] border border-brand-cream/15 text-brand-cream/60 hover:bg-brand-cream/15 hover:text-brand-cream"
        >
          Leer →
        </Link>
      </div>
    </motion.article>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="col-span-full glass-panel rounded-[36px] flex flex-col items-center justify-center text-center p-12 min-h-[220px]"
    >
      <div className="font-serif text-5xl font-black italic text-brand-brown/25 mb-3 tracking-tight">L11</div>
      <p className="kicker mb-2">Sin resultados</p>
      <p className="text-[12px] text-brand-cream/50 max-w-[280px]">
        Probá ajustar los filtros o limpiar la búsqueda para descubrir más artículos.
      </p>
    </motion.div>
  );
}

export default function NewsGrid({ news, loading = false, onNewsClick }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (!news || news.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {news.map((item) => (
        <NewsCard key={item.id} news={item} onClick={() => onNewsClick?.(item.id)} />
      ))}
    </div>
  );
}
