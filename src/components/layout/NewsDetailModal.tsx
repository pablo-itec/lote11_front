"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X, Clock, User, Tag, ArrowRight } from "lucide-react";
import type { News } from "@/src/types";
import { fmt, imgSrc } from "@/src/lib/utils";
import { newsApi } from "@/src/lib/api";

interface Props {
  news: News | null;
  onClose: () => void;
}

export default function NewsDetailModal({ news, onClose }: Props) {
  // Issue #2: registra un clic cada vez que se abre el detalle de una noticia.
  useEffect(() => {
    if (news?.id) newsApi.registerClick(news.id).catch(() => {});
  }, [news?.id]);

  return (
    <AnimatePresence>
      {news && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 bg-black/70 backdrop-blur-[8px]"
        >
          <motion.div
            key="box"
            initial={{ scale: 0.9, y: 24 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 24 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-panel w-full max-w-[760px] max-h-[90vh] rounded-[44px] overflow-y-auto relative shadow-2xl"
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-white/[0.08] border border-white/10 flex items-center justify-center text-brand-cream/50 hover:bg-white/15 hover:text-brand-cream transition-all"
            >
              <X size={18} />
            </button>

            {/* Image */}
            {news.imageUrl && (
              <div className="relative h-[240px] sm:h-[300px] overflow-hidden rounded-t-[44px]">
                <Image
                  src={imgSrc(news.imageUrl)}
                  alt={news.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                {news.imageCaption && (
                  <p className="absolute bottom-4 left-6 text-[9px] text-brand-cream/50 font-medium">
                    {news.imageCaption}
                  </p>
                )}
              </div>
            )}

            {/* Content */}
            <div className="p-8 md:p-12">
              {/* Badges */}
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

              {/* Title */}
              <h2 className="font-serif text-[28px] sm:text-[36px] font-black text-brand-brown leading-tight mb-3">
                {news.title}
              </h2>

              {/* Subtitle */}
              {news.subtitle && (
                <p className="text-[13px] text-brand-cream/55 leading-relaxed mb-5 italic">
                  {news.subtitle}
                </p>
              )}

              {/* Meta */}
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

              {/* Divider */}
              <div className="h-px bg-white/[0.06] mb-7" />

              {/* Body */}
              <div className="text-[14px] text-brand-cream/80 leading-[1.85] whitespace-pre-wrap drop-cap">
                {news.body}
              </div>

              {/* Tags */}
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

              {/* Link a página completa */}
              {news.slug && (
                <div className="mt-7 pt-6 border-t border-white/[0.06] flex justify-end">
                  <Link
                    href={`/noticias/${news.slug}`}
                    className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.15em] uppercase text-brand-brown hover:text-brand-cream transition-colors"
                  >
                    Ver artículo completo <ArrowRight size={12} />
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
