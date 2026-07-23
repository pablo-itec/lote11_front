"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { imgSrc, type NewsSlide } from "@/src/lib/utils";

const AUTOPLAY_MS = 5000;

interface Props {
  slides: NewsSlide[];
  alt: string;
  priority?: boolean;
}

export default function NewsImageCarousel({ slides, alt, priority }: Props) {
  const [index, setIndex] = useState(0);

  const goTo = useCallback(
    (i: number) => setIndex((i + slides.length) % slides.length),
    [slides.length],
  );

  // Se reinicia cada vez que `index` cambia, así la navegación manual pospone el auto-avance.
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [index, slides.length]);

  if (slides.length === 0) return null;

  const current = slides[index];

  return (
    <div className="relative w-full h-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0"
        >
          <Image src={imgSrc(current.url)} alt={alt} fill className="object-cover" priority={priority} />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

      {current.caption && (
        <p className="absolute bottom-4 left-6 text-[9px] text-brand-cream/50 font-medium max-w-[60%]">
          {current.caption}
        </p>
      )}

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Imagen anterior"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Imagen siguiente"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
          >
            <ChevronRight size={16} />
          </button>
          <div className="absolute bottom-4 right-6 flex gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Ir a la imagen ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-4 bg-brand-cream" : "w-1.5 bg-brand-cream/40"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
