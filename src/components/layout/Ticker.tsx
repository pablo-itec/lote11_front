"use client";
// src/components/layout/Ticker.tsx

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { carouselApi } from "@/src/lib/api";
import type { CarouselItem, CarouselPip } from "@/src/types";

const PIP: Record<CarouselPip, string> = {
  red:   "bg-brand-red",
  brown: "bg-brand-brown",
  dim:   "bg-brand-cream/20",
};

const DURATION = 34;

export default function Ticker() {
  const [items, setItems] = useState<CarouselItem[]>([]);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    carouselApi.getActive()
      .then(setItems)
      .catch(() => setItems([]));
  }, []);

  // Sin fallback: si no hay items activos, no se muestra la marquesina.
  if (items.length === 0) return null;

  const doubled = [...items, ...items];

  return (
    <div className="relative h-[42px] rounded-full flex items-center overflow-hidden glass-panel">

      {/* Label fijo */}
      <div className="flex-shrink-0 bg-brand-red text-white text-[8px] font-bold tracking-[0.22em] uppercase px-4 h-full flex items-center gap-2 rounded-full z-10">
        <span className="w-[6px] h-[6px] rounded-full bg-white dot-blink" />
        EN VIVO
      </div>

      {/* Fade izquierdo */}
      <div className="absolute left-[100px] w-8 h-full bg-gradient-to-r from-[#1a1614]/80 to-transparent pointer-events-none z-[1]" />

      {/* Track */}
      <div
        className="flex-1 overflow-hidden h-full flex items-center"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <motion.div
          className="flex items-center whitespace-nowrap"
          animate={{ x: paused ? undefined : ["0%", "-50%"] }}
          transition={{ duration: DURATION, ease: "linear", repeat: Infinity }}
          style={{ willChange: "transform" }}
        >
          {doubled.map((item, i) => {
            const content = (
              <>
                <span className={`w-[5px] h-[5px] rounded-full flex-shrink-0 ${PIP[item.pip] ?? PIP.red}`} />
                {item.label}
                {item.content ? <span className="text-brand-cream/80 normal-case">{item.content}</span> : null}
              </>
            );
            const cls =
              "inline-flex items-center gap-2 px-5 text-[9px] font-bold tracking-[0.16em] text-brand-cream/55 uppercase border-r border-brand-cream/[0.07] h-[42px] cursor-pointer hover:text-brand-cream transition-colors flex-shrink-0";

            return item.linkUrl ? (
              <a key={`${item.id}-${i}`} href={item.linkUrl} target="_blank" rel="noopener noreferrer" className={cls}>
                {content}
              </a>
            ) : (
              <span key={`${item.id}-${i}`} className={cls}>
                {content}
              </span>
            );
          })}
        </motion.div>
      </div>

      {/* Fade derecho */}
      <div className="absolute right-0 w-14 h-full bg-gradient-to-l from-[#1a1614]/90 to-transparent pointer-events-none rounded-full" />
    </div>
  );
}
