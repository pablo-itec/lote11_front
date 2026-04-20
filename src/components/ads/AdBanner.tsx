"use client";
// src/components/ads/AdBanner.tsx

import { motion } from "framer-motion";
import LiquidButton from "@/src/components/ui/LiquidButton";

const FEATURES = [
  "Acceso ilimitado a todos los podcasts",
  "Reportes mensuales en PDF",
  "Newsletter exclusivo semanal",
  "Comunidad privada de inversores",
  "Early access a eventos",
];

export default function AdBanner() {
  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="ad-bubble glass-panel rounded-[28px] p-6 flex flex-col items-center text-center gap-4 cursor-pointer overflow-hidden relative"
      style={{ minHeight: 500 }}
    >
      {/* Decorative glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-brown/[0.07] to-brand-red/[0.05] pointer-events-none rounded-[28px]" />

      <p className="text-[7px] font-bold tracking-[0.22em] text-brand-red uppercase relative z-10">
        Oferta Especial
      </p>

      <div className="w-14 h-14 rounded-full bg-brand-brown/10 border border-brand-brown/20 flex items-center justify-center text-2xl relative z-10">
        🏆
      </div>

      <h3 className="font-serif text-lg font-bold text-brand-brown leading-tight relative z-10">
        LOTE 11<br />Premium
      </h3>

      <div className="w-8 h-px bg-brand-brown/30 relative z-10" />

      <p className="text-[10px] text-brand-cream/40 leading-relaxed relative z-10">
        Accedé a análisis exclusivos, reportes de mercado y entrevistas sin límite.
      </p>

      <div className="relative z-10">
        <span className="font-serif text-[26px] font-bold text-brand-cream tracking-tight">
          $12
        </span>
        <span className="text-[11px] text-brand-cream/40 ml-1">/ mes</span>
      </div>

      <ul className="w-full text-left space-y-2 relative z-10">
        {FEATURES.map((f) => (
          <li key={f} className="flex items-start gap-2 text-[9px] text-brand-cream/45">
            <span className="w-[5px] h-[5px] rounded-full bg-brand-brown flex-shrink-0 mt-[3px]" />
            {f}
          </li>
        ))}
      </ul>

      <div className="w-full relative z-10">
        <LiquidButton className="w-full justify-center">
          Empezar Ahora
        </LiquidButton>
        <p className="text-[8px] text-brand-cream/20 tracking-wide mt-2">
          Sin tarjeta requerida
        </p>
      </div>
    </motion.aside>
  );
}
