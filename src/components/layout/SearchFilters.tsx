"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import type { Topic, ImportanceLevel } from "@/src/types";

interface Props {
  topics: Topic[];
  importanceLevels: ImportanceLevel[];
  onSearch: (search: string) => void;
  onTopicChange: (topicId: string) => void;
  onImportanceChange: (importanceLevelId: string) => void;
}

export default function SearchFilters({ topics, importanceLevels, onSearch, onTopicChange, onImportanceChange }: Props) {
  const [input, setInput] = useState("");

  const handleSearch = () => onSearch(input.trim());

  return (
    <div className="glass-panel rounded-[28px] px-5 py-4 flex flex-wrap items-center gap-3">
      <p className="text-[8px] font-bold tracking-[0.22em] text-brand-cream/30 uppercase hidden sm:block">
        Filtrar
      </p>

      {/* Search */}
      <div className="flex flex-1 min-w-[180px] items-center gap-2 bg-white/[0.04] border border-white/[0.07] rounded-full px-4 h-9">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Buscar noticias..."
          className="bg-transparent outline-none text-[11px] text-brand-cream/70 placeholder:text-brand-cream/20 flex-1 font-sans"
        />
        <button onClick={handleSearch} className="text-brand-cream/30 hover:text-brand-brown transition-colors">
          <Search size={14} />
        </button>
      </div>

      {/* Topic filter */}
      <select
        onChange={(e) => onTopicChange(e.target.value)}
        className="glass-input !w-auto !rounded-full text-[11px] text-brand-cream/60 px-4 h-9 cursor-pointer"
      >
        <option value="">Todos los temas</option>
        {topics.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>

      {/* Importance filter */}
      <select
        onChange={(e) => onImportanceChange(e.target.value)}
        className="glass-input !w-auto !rounded-full text-[11px] text-brand-cream/60 px-4 h-9 cursor-pointer"
      >
        <option value="">Toda importancia</option>
        {importanceLevels.map((l) => (
          <option key={l.id} value={l.id}>
            Niv.{l.level} · {l.label}
          </option>
        ))}
      </select>
    </div>
  );
}
