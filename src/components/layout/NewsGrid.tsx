"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import LiquidButton from "@/src/components/ui/LiquidButton";
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
    <div className="glass-panel rounded-[36px] overflow-hidden flex flex-col animate-pulse">
      <div className="h-[145px] bg-white/[0.04]" />
      <div className="p-6 flex flex-col gap-3">
        <div className="h-2 w-16 bg-white/[0.06] rounded-full" />
        <div className="h-4 w-full bg-white/[0.06] rounded" />
        <div className="h-3 w-3/4 bg-white/[0.04] rounded" />
        <div className="h-3 w-1/2 bg-white/[0.04] rounded" />
      </div>
    </div>
  );
}

function NewsCard({ news, onClick }: { news: News; onClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="news-card glass-panel rounded-[36px] overflow-hidden flex flex-col cursor-pointer"
      onClick={onClick}
    >
      <div className="relative h-[145px] overflow-hidden">
        <Image
          src={news.imageUrl ? imgSrc(news.imageUrl) : PLACEHOLDER_IMG}
          fill
          alt={news.title}
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
        {news.featured && (
          <span className="absolute top-3 right-3 bg-brand-brown text-white text-[7px] font-bold tracking-[0.18em] px-3 py-1 rounded-full uppercase">
            ★ Dest.
          </span>
        )}
        {news.topic && (
          <span className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-brand-cream/80 text-[7px] font-bold tracking-[0.15em] px-3 py-1 rounded-full uppercase border border-white/10">
            {news.topic.name}
          </span>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        {news.importanceLevel && (
          <span className="text-[7px] font-bold tracking-[0.18em] text-brand-red/70 uppercase mb-2">
            Niv.{news.importanceLevel.level} · {news.importanceLevel.label}
          </span>
        )}
        <h3 className="font-serif text-[17px] font-bold text-brand-brown leading-snug mb-2 line-clamp-2">
          {news.title}
        </h3>
        {news.subtitle && (
          <p className="text-[10px] text-brand-cream/40 leading-relaxed flex-1 mb-2 line-clamp-2">
            {news.subtitle}
          </p>
        )}
        <p className="text-[9px] text-brand-cream/28 mb-4 font-medium">
          {news.author && <span className="text-brand-cream/40">{news.author} · </span>}
          {fmt(news.createdAt)}
          {news.readTime && ` · ${news.readTime} min`}
        </p>
        <LiquidButton variant="ghost">
          Leer →
        </LiquidButton>
      </div>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="col-span-full glass-panel rounded-[36px] flex flex-col items-center justify-center text-center p-12 min-h-[200px]"
    >
      <div className="font-serif text-3xl font-black text-brand-brown/20 mb-3">L11</div>
      <p className="text-[11px] text-brand-cream/30 tracking-wide">Sin resultados para esta búsqueda.</p>
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
