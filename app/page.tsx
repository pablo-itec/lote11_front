"use client";

import { useState, useEffect, useCallback } from "react";

import Navbar           from "@/src/components/layout/Navbar";
import Ticker           from "@/src/components/layout/Ticker";
import HeroSection      from "@/src/components/layout/HeroSection";
import NewsGrid         from "@/src/components/layout/NewsGrid";
import SearchFilters    from "@/src/components/layout/SearchFilters";
import Pagination       from "@/src/components/layout/Pagination";
import SubscribeSection from "@/src/components/layout/SubscribeSection";
import NewsDetailModal  from "@/src/components/layout/NewsDetailModal";
import ProfileModal     from "@/src/components/layout/ProfileModal";
import Footer           from "@/src/components/layout/Footer";
import AdBubbles        from "@/src/components/ads/AdBubbles";
import AdBanner         from "@/src/components/ads/AdBanner";

import { newsApi, topicsApi, importanceApi } from "@/src/lib/api";
import type { News, Topic, ImportanceLevel } from "@/src/types";

const PAGE_LIMIT = 9;

export default function Home() {
  const [profileOpen, setProfileOpen] = useState(false);

  // News state
  const [newsList, setNewsList]       = useState<News[]>([]);
  const [heroNews, setHeroNews]       = useState<News | null>(null);
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [loading, setLoading]         = useState(true);
  const [page, setPage]               = useState(1);
  const [totalPages, setTotalPages]   = useState(1);

  // Filter state
  const [search, setSearch]         = useState("");
  const [topicId, setTopicId]       = useState("");
  const [importanceId, setImportanceId] = useState("");

  // Selects data
  const [topics, setTopics]               = useState<Topic[]>([]);
  const [importanceLevels, setImportanceLevels] = useState<ImportanceLevel[]>([]);

  // Load topics + importance levels once
  useEffect(() => {
    Promise.all([topicsApi.getAll(), importanceApi.getAll()])
      .then(([t, i]) => { setTopics(t); setImportanceLevels(i); })
      .catch(() => {});
  }, []);

  const loadNews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await newsApi.getPublic({
        page,
        limit: PAGE_LIMIT,
        search: search || undefined,
        topicId: topicId || undefined,
        importanceLevelId: importanceId || undefined,
      });
      const items = res.data ?? [];
      setNewsList(items);
      setTotalPages(res.meta?.totalPages ?? 1);
      // Hero: first featured, or first item
      const featured = items.find((n) => n.featured) ?? items[0] ?? null;
      setHeroNews(featured);
    } catch {
      setNewsList([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, topicId, importanceId]);

  useEffect(() => { loadNews(); }, [loadNews]);

  const openDetail = async (id: number) => {
    try {
      const n = await newsApi.getDetail(id);
      setSelectedNews(n);
    } catch { /* ignore */ }
  };

  const handleSearch = (s: string) => { setSearch(s); setPage(1); };
  const handleTopic  = (t: string) => { setTopicId(t); setPage(1); };
  const handleImp    = (i: string) => { setImportanceId(i); setPage(1); };

  return (
    <>
      {/* ── NAV ── */}
      <Navbar onProfileClick={() => setProfileOpen(true)} />

      {/* ── ESPACIADO NAV ── */}
      <div className="h-[100px]" />

      {/* ── TICKER ── */}
      <div className="px-5 mb-3">
        <Ticker />
      </div>

      {/*
        ── SIDE RAILS (fixed, sticky-to-viewport) ──
        Visibles sólo en pantallas >= 1400px para que no pisen el contenido.
      */}
      <aside className="side-rail side-rail-left hidden min-[1400px]:block" aria-label="Publicidad lateral izquierda">
        <AdBubbles />
      </aside>
      <aside className="side-rail side-rail-right hidden min-[1400px]:block" aria-label="Publicidad lateral derecha">
        <AdBanner />
      </aside>

      {/*
        ── CONTENIDO CENTRAL ──
        En pantallas chicas mostramos los ads inline al final.
      */}
      <div className="max-w-[1080px] mx-auto px-5 flex flex-col gap-3">
        <HeroSection news={heroNews} onReadMore={openDetail} />

        <SearchFilters
          topics={topics}
          importanceLevels={importanceLevels}
          onSearch={handleSearch}
          onTopicChange={handleTopic}
          onImportanceChange={handleImp}
        />

        <NewsGrid
          news={loading ? undefined : newsList}
          loading={loading}
          onNewsClick={openDetail}
        />

        <Pagination
          page={page}
          totalPages={totalPages}
          onPrev={() => setPage((p) => p - 1)}
          onNext={() => setPage((p) => p + 1)}
        />

        <SubscribeSection />

        {/* Fallback de ads en pantallas chicas (< 1400px) */}
        <div className="min-[1400px]:hidden grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          <AdBubbles />
          <AdBanner />
        </div>
      </div>

      {/* ── FOOTER ── */}
      <Footer />

      {/* ── MODALS ── */}
      <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
      <NewsDetailModal news={selectedNews} onClose={() => setSelectedNews(null)} />
    </>
  );
}
