"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
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
      <div className="flex flex-col gap-3">
        <div className="glass-panel rounded-[28px] overflow-hidden relative aspect-[3/6] w-full flex items-center justify-center">
          <span className="text-[9px] font-bold tracking-[0.2em] text-brand-cream/20 uppercase">Publicidad</span>
        </div>
        <div className="glass-panel rounded-[28px] overflow-hidden relative aspect-[14/9] w-full flex items-center justify-center">
          <span className="text-[9px] font-bold tracking-[0.2em] text-brand-cream/20 uppercase">Publicidad</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {ads.map((ad) => {
        const inner = (
          <div
            className={`ad-bubble glass-panel rounded-[28px] overflow-hidden relative w-full ${SIZE_ASPECT[ad.size]}`}
          >
            <Image
              src={ad.imageUrl}
              alt="Publicidad"
              fill
              className="object-cover"
              sizes="300px"
            />
          </div>
        );

        return ad.linkUrl ? (
          <a key={ad.id} href={ad.linkUrl} target="_blank" rel="noopener noreferrer">
            {inner}
          </a>
        ) : (
          <div key={ad.id}>{inner}</div>
        );
      })}
    </div>
  );
}
