"use client";

import Image from "next/image";
import { useState } from "react";
import { Mail, Check } from "lucide-react";
import type { TarjeteroPerson } from "@/src/types";
import { imgSrc } from "@/src/lib/utils";

export default function TarjeteroPersonCard({ person }: { person: TarjeteroPerson }) {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    if (!person.email) return;
    try {
      await navigator.clipboard.writeText(person.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  return (
    <div className="glass-panel rounded-[28px] p-5 flex flex-col items-center text-center">
      <div className="relative w-24 h-24 rounded-full overflow-hidden bg-white/[0.04] mb-3">
        {person.imageUrl ? (
          <Image src={imgSrc(person.imageUrl)} alt={person.name} fill className="object-cover" sizes="96px" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-brand-cream/20 font-serif text-3xl">
            {person.name.charAt(0)}
          </div>
        )}
      </div>

      <h3 className="font-serif text-[16px] font-black text-brand-brown leading-tight">{person.name}</h3>
      {person.role && <p className="text-[11px] text-brand-cream/50 mt-0.5">{person.role}</p>}

      {person.email && (
        <button
          onClick={copyEmail}
          className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.1em] uppercase text-brand-cream/50 hover:text-brand-brown transition-colors"
          title="Copiar email"
        >
          {copied ? <Check size={12} /> : <Mail size={12} />}
          {copied ? "¡Copiado!" : person.email}
        </button>
      )}
    </div>
  );
}
