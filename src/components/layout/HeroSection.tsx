"use client";
// src/components/layout/HeroSection.tsx

import Image from "next/image";
import { motion } from "framer-motion";
import LiquidButton from "@/src/components/ui/LiquidButton";

const HERO_IMG = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop";

export default function HeroSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-3 items-stretch">

      {/* Texto */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-panel rounded-[44px] p-10 flex flex-col justify-center min-h-[300px] lg:min-h-[340px]"
      >
        <p className="text-[8px] font-bold tracking-[0.25em] text-brand-red uppercase mb-4 flex items-center gap-2">
          <span className="w-4 h-px bg-brand-red inline-block" />
          Edición Mayo 2026
        </p>
        <h1 className="font-serif text-[42px] xl:text-[52px] font-black text-brand-brown leading-[0.88] tracking-tight mb-5">
          EL FUTURO<br />DEL MERCADO
        </h1>
        <p className="text-[11px] text-brand-cream/48 leading-relaxed mb-7 max-w-xs">
          Arquitectura sustentable y el impacto de la IA en el Real Estate. Una mirada exclusiva hacia el segundo semestre.
        </p>
        <div className="flex gap-3 flex-wrap">
          <LiquidButton variant="primary">Explorar →</LiquidButton>
          <LiquidButton variant="ghost">Ver Podcast</LiquidButton>
        </div>
      </motion.div>

      {/* Imagen */}
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
          className="object-cover hover:scale-105 transition-transform duration-[1200ms]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="absolute bottom-5 left-5">
          <span className="text-[8px] font-bold tracking-[0.18em] text-brand-cream/50 uppercase bg-black/40 backdrop-blur-sm border border-white/[0.08] px-3 py-[5px] rounded-full">
            Arquitectura de Lujo · 2026
          </span>
        </div>
      </motion.div>
    </div>
  );
}
