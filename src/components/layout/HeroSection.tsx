"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import LiquidButton from "@/src/components/ui/LiquidButton";
import type { News } from "@/src/types";
import { fmt, imgSrc } from "@/src/lib/utils";

const HERO_IMG = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop";

interface Props {
  news?: News | null;
  onReadMore?: (id: number) => void;
}

export default function HeroSection({ news, onReadMore }: Props) {
  if (news) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-3 items-stretch">
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel rounded-[44px] p-10 flex flex-col justify-center min-h-[300px] lg:min-h-[340px] relative overflow-hidden"
        >
          {/* edición / fecha en serif */}
          <span className="absolute top-6 right-8 font-serif italic text-[11px] text-brand-cream/40">
            № {new Date(news.createdAt).getFullYear()}
          </span>
          <p className="kicker mb-5">
            {news.featured ? "Artículo Destacado" : news.topic?.name ?? "Última hora"}
          </p>
          <h1 className="font-serif text-[34px] xl:text-[46px] font-black text-brand-brown leading-[0.92] tracking-tight mb-4">
            {news.title}
          </h1>
          {news.subtitle && (
            <p className="font-serif italic text-[13px] text-brand-cream/65 leading-relaxed mb-4 max-w-sm">
              {news.subtitle}
            </p>
          )}
          <p className="text-[9px] text-brand-cream/55 mb-7 font-medium tracking-wide">
            {news.author && <span className="text-brand-cream/75 font-bold">{news.author} · </span>}
            {fmt(news.createdAt)}
            {news.readTime && ` · ${news.readTime} min`}
          </p>
          <div className="flex gap-3 flex-wrap">
            <LiquidButton variant="primary" onClick={() => onReadMore?.(news.id)}>
              Leer Artículo →
            </LiquidButton>
          </div>
        </motion.div>

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.18 }}
          className="relative min-h-[300px] lg:min-h-[340px] rounded-[44px] overflow-hidden border border-white/[0.06] shadow-2xl cursor-pointer"
          onClick={() => onReadMore?.(news.id)}
        >
          <Image
            src={news.imageUrl ? imgSrc(news.imageUrl) : HERO_IMG}
            alt={news.title}
            fill
            className="object-cover duotone hover:scale-[1.04] transition-transform duration-[1400ms]"
            priority
            sizes="(max-width: 1024px) 100vw, 60vw"
          />
          {/* Vignette + gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
          <div className="absolute inset-0 [box-shadow:inset_0_0_120px_rgba(0,0,0,0.55)] pointer-events-none rounded-[44px]" />
          <div className="absolute bottom-5 left-5 flex items-center gap-2">
            <span className="text-[8px] font-bold tracking-[0.18em] text-brand-cream/85 uppercase bg-black/50 backdrop-blur-md border border-white/[0.12] px-3 py-[5px] rounded-full">
              {news.topic?.name ?? "Artículo"} · {new Date(news.createdAt).getFullYear()}
            </span>
          </div>
        </motion.div>
      </div>
    );
  }

  /* Fallback estático */
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-3 items-stretch">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-panel rounded-[44px] p-10 flex flex-col justify-center min-h-[300px] lg:min-h-[340px] relative overflow-hidden"
      >
        <span className="absolute top-6 right-8 font-serif italic text-[11px] text-brand-cream/40">
          № MMXXVI
        </span>
        <p className="kicker mb-5">Edición Mayo 2026</p>
        <h1 className="font-serif text-[42px] xl:text-[52px] font-black text-brand-brown leading-[0.88] tracking-tight mb-5">
          EL FUTURO<br />DEL MERCADO
        </h1>
        <p className="font-serif italic text-[13px] text-brand-cream/65 leading-relaxed mb-7 max-w-xs">
          Arquitectura sustentable y el impacto de la IA en el Real Estate. Una mirada exclusiva hacia el segundo semestre.
        </p>
        <div className="flex gap-3 flex-wrap">
          <LiquidButton variant="primary">Explorar →</LiquidButton>
          <LiquidButton variant="ghost">Ver Podcast</LiquidButton>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.18 }}
        className="relative min-h-[300px] lg:min-h-[340px] rounded-[44px] overflow-hidden border border-white/[0.06] shadow-2xl"
      >
        <Image
          src={HERO_IMG}
          alt="Arquitectura de lujo"
          fill
          className="object-cover duotone hover:scale-[1.04] transition-transform duration-[1400ms]"
          priority
          sizes="(max-width: 1024px) 100vw, 60vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
        <div className="absolute inset-0 [box-shadow:inset_0_0_120px_rgba(0,0,0,0.55)] pointer-events-none rounded-[44px]" />
        <div className="absolute bottom-5 left-5">
          <span className="text-[8px] font-bold tracking-[0.18em] text-brand-cream/85 uppercase bg-black/50 backdrop-blur-md border border-white/[0.12] px-3 py-[5px] rounded-full">
            Arquitectura de Lujo · 2026
          </span>
        </div>
      </motion.div>
    </div>
  );
}
