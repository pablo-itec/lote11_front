"use client";

import { useState } from "react";
import Link from "next/link";
import { LogOut, Newspaper, Users, Tag, BarChart2, Megaphone, TrendingUp, GalleryHorizontalEnd, Contact, BookImage } from "lucide-react";
import { auth } from "@/src/lib/api";
import NewsManager          from "./NewsManager";
import SubscribersManager   from "./SubscribersManager";
import TopicsManager        from "./TopicsManager";
import ImportanceManager    from "./ImportanceManager";
import AdsManager           from "./AdsManager";
import MetricsManager       from "./MetricsManager";
import CarouselManager      from "./CarouselManager";
import TarjeteroManager     from "./TarjeteroManager";
import CoversManager        from "./CoversManager";

type Tab = "news" | "subscribers" | "topics" | "importance" | "ads" | "metrics" | "carousel" | "tarjetero" | "covers";

interface Props {
  onLogout: () => void;
}

interface Toast {
  msg: string;
  ok: boolean;
  id: number;
}

interface TabDef { id: Tab; label: string; icon: React.ReactNode }

// Navegación agrupada por área.
const TAB_GROUPS: { label: string; tabs: TabDef[] }[] = [
  {
    label: "Contenido",
    tabs: [
      { id: "news",       label: "Noticias",   icon: <Newspaper size={14} /> },
      { id: "topics",     label: "Temas",      icon: <Tag size={14} /> },
      { id: "importance", label: "Importancia", icon: <BarChart2 size={14} /> },
      { id: "covers",     label: "Tapa del mes", icon: <BookImage size={14} /> },
    ],
  },
  {
    label: "Audiencia",
    tabs: [
      { id: "subscribers", label: "Suscriptores", icon: <Users size={14} /> },
      { id: "metrics",     label: "Métricas",     icon: <TrendingUp size={14} /> },
    ],
  },
  {
    label: "Publicidad",
    tabs: [
      { id: "ads",      label: "Publicidades", icon: <Megaphone size={14} /> },
      { id: "carousel", label: "Carrusel",     icon: <GalleryHorizontalEnd size={14} /> },
    ],
  },
  {
    label: "Tarjetero",
    tabs: [
      { id: "tarjetero", label: "Tarjetero", icon: <Contact size={14} /> },
    ],
  },
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

      {/* Tab nav — agrupada por área */}
      <nav className="mx-5 mt-3">
        <div className="glass-panel rounded-[20px] p-1.5 flex gap-1.5 flex-wrap items-stretch">
          {TAB_GROUPS.map((group, gi) => (
            <div key={group.label} className="flex items-center">
              {gi > 0 && <span className="mx-1 self-stretch w-px bg-brand-cream/10" aria-hidden />}
              <div className="flex flex-col gap-1 px-1">
                <span className="text-[7px] font-bold tracking-[0.2em] text-brand-cream/25 uppercase px-2">{group.label}</span>
                <div className="flex gap-1 flex-wrap">
                  {group.tabs.map((t) => (
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
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main className="mx-5 mt-3 mb-5 flex-1">
        {tab === "news"        && <NewsManager onToast={addToast} />}
        {tab === "subscribers" && <SubscribersManager onToast={addToast} />}
        {tab === "topics"      && <TopicsManager onToast={addToast} />}
        {tab === "importance"  && <ImportanceManager onToast={addToast} />}
        {tab === "covers"      && <CoversManager onToast={addToast} />}
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
