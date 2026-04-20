"use client";
// src/components/ads/AdBubbles.tsx

import { motion } from "framer-motion";

const ADS = [
  {
    icon:  "🏙️",
    tag:   "Patrocinado",
    title: "Desarrollos Nordelta",
    desc:  "Unidades desde USD 85.000 en entrega inmediata.",
    cta:   "Ver Oferta",
  },
  {
    icon:  "📊",
    tag:   "Finanzas",
    title: "Invertí en Real Estate Digital",
    desc:  "Tokens inmobiliarios desde $500 USD.",
    cta:   "Conocer Más",
  },
  {
    icon:  "🎙️",
    tag:   "Evento",
    title: "Summit LOTE 11 · Junio 2026",
    desc:  "Buenos Aires. Cupos limitados.",
    cta:   "Registrarme",
  },
];

export default function AdBubbles() {
  return (
    <aside className="flex flex-col gap-3">
      {ADS.map((ad, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="ad-bubble glass-panel rounded-[28px] p-5 flex flex-col items-center text-center gap-[10px] cursor-pointer"
        >
          <div className="w-11 h-11 rounded-full bg-white/[0.07] border border-white/10 flex items-center justify-center text-xl">
            {ad.icon}
          </div>
          <p className="text-[7px] font-bold tracking-[0.2em] text-brand-red uppercase">
            {ad.tag}
          </p>
          <p className="font-serif text-[13px] font-bold text-brand-brown leading-tight">
            {ad.title}
          </p>
          <p className="text-[9px] text-brand-cream/40 leading-relaxed">
            {ad.desc}
          </p>
          <span className="text-[8px] font-bold tracking-[0.15em] uppercase px-4 py-[6px] rounded-full border border-brand-cream/15 text-brand-cream/50 hover:bg-brand-brown hover:text-brand-cream hover:border-brand-brown transition-colors">
            {ad.cta}
          </span>
        </motion.div>
      ))}
    </aside>
  );
}
