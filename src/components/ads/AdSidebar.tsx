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

  if (!ads.length) return null;

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
