"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}

export default function Pagination({ page, totalPages, onPrev, onNext }: Props) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4">
      <button
        onClick={onPrev}
        disabled={page <= 1}
        className="w-9 h-9 rounded-full glass-panel flex items-center justify-center text-brand-cream/50 hover:text-brand-brown transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={16} />
      </button>

      <span className="text-[9px] font-bold tracking-[0.2em] text-brand-cream/35 uppercase">
        Página {page} de {totalPages}
      </span>

      <button
        onClick={onNext}
        disabled={page >= totalPages}
        className="w-9 h-9 rounded-full glass-panel flex items-center justify-center text-brand-cream/50 hover:text-brand-brown transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
