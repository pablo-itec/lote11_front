"use client";
// src/components/layout/NewsGrid.tsx

import Image from "next/image";
import { motion } from "framer-motion";
import LiquidButton from "@/src/components/ui/LiquidButton";

const PODCAST_IMG = "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=800&auto=format&fit=crop";
const CITY_IMG    = "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=800&auto=format&fit=crop";

interface Card {
  type: "podcast" | "news" | "promo";
}

function PodcastCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="news-card glass-panel rounded-[36px] overflow-hidden flex flex-col"
    >
      <div className="relative h-[145px] overflow-hidden">
        <Image src={PODCAST_IMG} fill alt="Podcast Studio" className="object-cover group-hover:scale-110 transition-transform duration-700" />
        <span className="absolute top-3 left-3 bg-brand-red text-white text-[7px] font-bold tracking-[0.18em] px-3 py-1 rounded-full uppercase">
          Podcast
        </span>
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-serif text-[17px] font-bold text-brand-brown leading-snug mb-2">
          EP. 12 — Claves de Inversión
        </h3>
        <p className="text-[10px] text-brand-cream/40 leading-relaxed flex-1 mb-4">
          Zonas con mayor crecimiento proyectado para este semestre. Análisis exclusivo del equipo editorial.
        </p>
        <LiquidButton variant="ghost">Escuchar →</LiquidButton>
      </div>
    </motion.div>
  );
}

function CityCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.08 }}
      className="news-card glass-panel rounded-[36px] overflow-hidden flex flex-col"
    >
      <div className="relative h-[145px] overflow-hidden">
        <Image src={CITY_IMG} fill alt="Smart City" className="object-cover hover:scale-110 transition-transform duration-700" />
        <span className="absolute top-3 left-3 bg-brand-brown text-white text-[7px] font-bold tracking-[0.18em] px-3 py-1 rounded-full uppercase">
          Tendencias
        </span>
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-serif text-[17px] font-bold text-brand-brown leading-snug mb-2">
          Ciudades Inteligentes 2026
        </h3>
        <p className="text-[10px] text-brand-cream/40 leading-relaxed flex-1 mb-4">
          Cómo la tecnología 5G transforma la infraestructura urbana y el mercado de oficinas premium.
        </p>
        <LiquidButton variant="ghost">Leer Más →</LiquidButton>
      </div>
    </motion.div>
  );
}

function PromoCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.16 }}
      className="news-card glass-panel rounded-[36px] flex flex-col items-center justify-center text-center p-8 border-dashed min-h-[260px]"
    >
      <div className="font-serif text-3xl font-black text-brand-brown/20 mb-3">L11</div>
      <h3 className="font-serif text-lg font-bold text-brand-cream/50 mb-1">
        Más contenido en camino
      </h3>
      <p className="text-[8px] font-bold tracking-[0.2em] text-brand-cream/20 uppercase mb-5">
        Suscribite al Newsletter
      </p>
      <LiquidButton variant="primary">Suscribirme</LiquidButton>
    </motion.div>
  );
}

export default function NewsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      <PodcastCard />
      <CityCard />
      <PromoCard />
    </div>
  );
}
