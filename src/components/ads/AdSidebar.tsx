"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { Ad } from "@/src/types";
import { API_BASE } from "@/src/lib/api";

const BASE = API_BASE;

// large → portrait 3:5 · small → landscape 14:9
const SIZE_ASPECT: Record<string, string> = {
  large: "aspect-[3/6]",
  small: "aspect-[14/9]",
};

interface Props {
  side: "left" | "right";
}

// Un slot por anuncio (no por tamaño): se apilan en el `order` que definió el admin,
// sin límite de cantidad ni restricción de tamaño (pueden ir varios grandes o chicos
// seguidos, mezclados como sea). Cada slot rota solo entre las imágenes de SU propio
// anuncio (portada + galería), con su propio `displayDuration`. Se pausa con el mouse encima.
function AdSlot({ ad }: { ad: Ad }) {
  const images = ad.images ?? [];
  const durationMs = Math.max(1, ad.displayDuration || 5) * 1000;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback(
    (i: number) => setIndex((i + images.length) % images.length),
    [images.length],
  );

  useEffect(() => {
    goTo(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ad.id, images.length]);

  useEffect(() => {
    if (images.length <= 1 || paused) return;
    const timer = setTimeout(() => goTo(index + 1), durationMs);
    return () => clearTimeout(timer);
  }, [index, paused, images.length, durationMs, goTo]);

  if (images.length === 0) return null;

  const current = images[Math.min(index, images.length - 1)];

  const inner = (
    <div
      className={`ad-bubble glass-panel rounded-[28px] overflow-hidden relative w-full ${SIZE_ASPECT[ad.size]}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0"
        >
          <Image src={current.imageUrl} alt="Publicidad" fill className="object-cover" sizes="300px" />
        </motion.div>
      </AnimatePresence>
    </div>
  );

  return ad.linkUrl ? (
    <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer">
      {inner}
    </a>
  ) : (
    inner
  );
}

export default function AdSidebar({ side }: Props) {
  const [ads, setAds] = useState<Ad[]>([]);

  useEffect(() => {
    fetch(`${BASE}/ads/${side}`)
      .then((r) => r.json())
      .then((data) => setAds(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [side]);

  if (!ads.length) {
    return (
      <div className="glass-panel rounded-[28px] overflow-hidden relative aspect-[3/6] w-full flex items-center justify-center">
        <span className="text-[9px] font-bold tracking-[0.2em] text-brand-cream/20 uppercase">Publicidad</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {ads.map((ad) => (
        <AdSlot key={ad.id} ad={ad} />
      ))}
    </div>
  );
}
