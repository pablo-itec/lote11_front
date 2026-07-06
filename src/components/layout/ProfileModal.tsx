"use client";
// src/components/layout/ProfileModal.tsx

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, AtSign } from "lucide-react";
import LiquidButton from "@/src/components/ui/LiquidButton";
import { coversApi } from "@/src/lib/api";
import type { Cover } from "@/src/types";
import { imgSrc } from "@/src/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
}

// Normaliza el valor de instagram a un link al perfil.
// Acepta URL completa o handle (con o sin @).
function instagramHref(value: string): string {
  const v = value.trim();
  if (/^https?:\/\//i.test(v)) return v;
  return `https://instagram.com/${v.replace(/^@/, "")}`;
}

function instagramLabel(value: string): string {
  const v = value.trim();
  if (/^https?:\/\//i.test(v)) {
    const handle = v.replace(/\/+$/, "").split("/").pop();
    return handle ? `@${handle}` : v;
  }
  return `@${v.replace(/^@/, "")}`;
}

export default function ProfileModal({ open, onClose }: Props) {
  const [data, setData] = useState<Cover | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!open || loaded) return;
    coversApi
      .getActive()
      .then((res) => setData(res && (res as Cover).name ? (res as Cover) : null))
      .catch(() => setData(null))
      .finally(() => setLoaded(true));
  }, [open, loaded]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-12 bg-black/65 backdrop-blur-[8px]"
        >
          <motion.div
            key="box"
            initial={{ scale: 0.9, y: 24 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 24 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-panel w-full max-w-[900px] max-h-[90vh] rounded-[48px] overflow-hidden relative grid md:grid-cols-[5fr_7fr] shadow-2xl"
          >
            {/* Cerrar */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-white/[0.08] border border-white/10 flex items-center justify-center text-brand-cream/50 hover:bg-white/15 hover:text-brand-cream transition-all"
            >
              <X size={18} />
            </button>

            {/* Imagen */}
            <div className="relative min-h-[280px] md:min-h-[500px] bg-gradient-to-br from-[#3a2018] to-[#241408] flex items-center justify-center text-[80px]">
              {data?.imageUrl ? (
                <Image
                  src={imgSrc(data.imageUrl)}
                  alt={data.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 375px"
                />
              ) : (
                "🧑‍💼"
              )}
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#241408]/90 to-transparent" />
            </div>

            {/* Info */}
            <div className="p-10 md:p-14 flex flex-col justify-center gap-6 overflow-y-auto">
              <div>
                <p className="text-[8px] font-bold tracking-[0.25em] text-brand-red uppercase mb-3">
                  Tapa del mes
                </p>

                {!loaded ? (
                  <p className="text-sm text-brand-cream/40">Cargando…</p>
                ) : !data ? (
                  <p className="text-sm text-brand-cream/50">
                    Todavía no hay una tapa publicada.
                  </p>
                ) : (
                  <>
                    <h2 className="font-serif text-5xl font-black text-brand-brown leading-[0.9] tracking-tight mb-2">
                      {data.name}
                    </h2>
                    {data.role && (
                      <p className="text-sm text-brand-cream/60 font-light">{data.role}</p>
                    )}
                  </>
                )}
              </div>

              {data && (
                <>
                  {data.quote && (
                    <p className="text-xs text-brand-cream/50 leading-relaxed max-w-sm">
                      {data.quote}
                    </p>
                  )}

                  {data.instagram && (
                    <a
                      href={instagramHref(data.instagram)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[11px] text-brand-cream/50 hover:text-brand-cream transition-colors w-fit"
                    >
                      <AtSign size={13} className="text-brand-brown" />
                      {instagramLabel(data.instagram)}
                    </a>
                  )}

                  {data.articleUrl && (
                    <div className="pt-2">
                      <LiquidButton href={data.articleUrl}>Leer la nota</LiquidButton>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
