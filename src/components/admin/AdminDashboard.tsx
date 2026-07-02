"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LogOut, Newspaper, Users, Tag, BarChart2, Megaphone, TrendingUp, GalleryHorizontalEnd, Contact } from "lucide-react";
import { auth } from "@/src/lib/api";
import NewsManager          from "./NewsManager";
import SubscribersManager   from "./SubscribersManager";
import TopicsManager        from "./TopicsManager";
import ImportanceManager    from "./ImportanceManager";
import AdsManager           from "./AdsManager";
import MetricsManager       from "./MetricsManager";
import CarouselManager      from "./CarouselManager";
import TarjeteroManager     from "./TarjeteroManager";

type Tab = "news" | "subscribers" | "topics" | "importance" | "ads" | "metrics" | "carousel" | "tarjetero";

interface Props {
  onLogout: () => void;
}

interface Toast {
  msg: string;
  ok: boolean;
  id: number;
}

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "news",        label: "Noticias",    icon: <Newspaper size={14} /> },
  { id: "subscribers", label: "Suscriptores", icon: <Users size={14} /> },
  { id: "topics",      label: "Temas",       icon: <Tag size={14} /> },
  { id: "importance",  label: "Importancia",   icon: <BarChart2 size={14} /> },
  { id: "ads",         label: "Publicidades",  icon: <Megaphone size={14} /> },
  { id: "metrics",     label: "Métricas",     icon: <TrendingUp size={14} /> },
  { id: "carousel",    label: "Carrusel",     icon: <GalleryHorizontalEnd size={14} /> },
  { id: "tarjetero",   label: "Tarjetero",    icon: <Contact size={14} /> },
];

export default function AdminDashboard({ onLogout }: Props) {
  const [tab, setTab]       = useState<Tab>("news");
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (msg: string, ok: boolean) => {
    const id = Date.now();
    setToasts((p) => [...p, { msg, ok, id }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 4000);
  };

  const logout = () => {
    auth.clearToken();
    onLogout();
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="glass-panel m-5 mb-0 rounded-[28px] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-serif text-lg font-black text-brand-brown">LOTE 11</span>
          <span className="text-[9px] font-bold tracking-[0.2em] text-brand-cream/30 uppercase">Admin</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-[9px] font-bold tracking-[0.15em] text-brand-cream/35 hover:text-brand-cream uppercase transition-colors">
            ← Sitio
          </Link>
          <button onClick={logout} className="abtn abtn-del flex items-center gap-1.5">
            <LogOut size={11} /> Salir
          </button>
        </div>
      </header>

      {/* Tab nav */}
      <nav className="mx-5 mt-3">
        <div className="glass-panel rounded-[20px] p-1.5 flex gap-1 flex-wrap">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-2 rounded-[14px] text-[9px] font-bold tracking-[0.15em] uppercase transition-all ${
                tab === t.id
                  ? "bg-brand-brown text-brand-cream"
                  : "text-brand-cream/35 hover:text-brand-cream/60"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main className="mx-5 mt-3 mb-5 flex-1">
        {tab === "news"        && <NewsManager onToast={addToast} />}
        {tab === "subscribers" && <SubscribersManager onToast={addToast} />}
        {tab === "topics"      && <TopicsManager onToast={addToast} />}
        {tab === "importance"  && <ImportanceManager onToast={addToast} />}
        {tab === "ads"         && <AdsManager onToast={addToast} />}
        {tab === "metrics"     && <MetricsManager onToast={addToast} />}
        {tab === "carousel"    && <CarouselManager onToast={addToast} />}
        {tab === "tarjetero"   && <TarjeteroManager onToast={addToast} />}
      </main>

      {/* Toasts */}
      <div className="fixed bottom-6 right-6 z-[999] flex flex-col gap-2">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.ok ? "toast-ok" : "toast-err"}`}>
            {t.msg}
          </div>
        ))}
      </div>
    </div>
  );
}
