"use client";

import { useState, useEffect, useCallback, useRef } from "react";

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
import AdSidebar        from "@/src/components/ads/AdSidebar";
import LogoBanner       from "@/src/components/layout/LogoBanner";

import { newsApi, topicsApi, importanceApi, adsApi } from "@/src/lib/api";
import type { News, Topic, ImportanceLevel, Ad } from "@/src/types";

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

  // Ads: se piden una sola vez acá y se comparten entre el rail fijo y el fallback inline
  // (antes cada AdSidebar hacía su propio fetch: 4 requests en vez de 2).
  const [leftAds, setLeftAds]   = useState<Ad[]>([]);
  const [rightAds, setRightAds] = useState<Ad[]>([]);

  // Load topics + importance levels + ads once
  useEffect(() => {
    Promise.all([topicsApi.getAll(), importanceApi.getAll()])
      .then(([t, i]) => { setTopics(t); setImportanceLevels(i); })
      .catch(() => {});
    adsApi.getBySide("left").then((a) => setLeftAds(Array.isArray(a) ? a : [])).catch(() => {});
    adsApi.getBySide("right").then((a) => setRightAds(Array.isArray(a) ? a : [])).catch(() => {});
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

  // El modal abre al instante con lo que ya trae el listado (título, cuerpo, portada...);
  // la galería de imágenes solo viene en el detalle, así que se completa cuando responde.
  const openDetail = (id: number) => {
    const fromList = newsList.find((n) => n.id === id);
    if (fromList) setSelectedNews(fromList);
    newsApi
      .getDetail(id)
      .then((full) =>
        setSelectedNews((current) => {
          if (!fromList) return full;
          // Si mientras tanto se cerró el modal o se abrió otra noticia, no lo pisamos.
          return current?.id === id ? full : current;
        }),
      )
      .catch(() => { /* ignore: se queda con los datos del listado */ });
  };

  const handleSearch = (s: string) => { setSearch(s); setPage(1); };
  const handleTopic  = (t: string) => { setTopicId(t); setPage(1); };
  const handleImp    = (i: string) => { setImportanceId(i); setPage(1); };

  // Side rails: fluyen con el scroll y se anclan arriba del footer (no lo tapan)
  const footerRef = useRef<HTMLDivElement>(null);
  const leftRailRef = useRef<HTMLDivElement>(null);
  const rightRailRef = useRef<HTMLDivElement>(null);
  const [leftTop, setLeftTop] = useState(110);
  const [rightTop, setRightTop] = useState(110);

  useEffect(() => {
    const BASE_TOP = 110;
    const GAP = 16;
    let raf = 0;

    const compute = () => {
      const footer = footerRef.current?.getBoundingClientRect();
      if (!footer) return;
      const scrollY = window.scrollY;
      const leftH = leftRailRef.current?.offsetHeight ?? 0;
      const rightH = rightRailRef.current?.offsetHeight ?? 0;

      // Mientras el footer está lejos, el rail fluye 1:1 con el scroll (baja/sube junto
      // con las noticias, como cualquier otro bloque de la página). Recién cuando el
      // footer se acerca lo suficiente como para que se solaparía si se quedara quieto
      // en BASE_TOP, se ancla ahí y lo va esquivando.
      const flowTop = BASE_TOP - scrollY;
      const footerLimitLeft = footer.top - leftH - GAP;
      const footerLimitRight = footer.top - rightH - GAP;
      setLeftTop(footerLimitLeft < BASE_TOP ? footerLimitLeft : flowTop);
      setRightTop(footerLimitRight < BASE_TOP ? footerLimitRight : flowTop);
    };

    const onScroll = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {/* ── NAV ── */}
      <Navbar onProfileClick={() => setProfileOpen(true)} />

      {/* ── ESPACIADO NAV ── */}
      <div className="h-[80px]" />

      {/* ── LOGO BANNER ── */}
      <div className="flex justify-center mb-4 mt-2">
        <LogoBanner />
      </div>

      {/* ── TICKER ── */}
      <div className="max-w-[1080px] mx-auto px-5 mb-3">
        <Ticker />
      </div>

      {/*
        ── SIDE RAILS (fixed, sticky-to-viewport) ──
        Visibles sólo en pantallas >= 1400px para que no pisen el contenido.
      */}
      <aside
        className="side-rail side-rail-left hidden min-[1280px]:block"
        style={{ top: `${leftTop}px` }}
        aria-label="Publicidad lateral izquierda"
      >
        <div ref={leftRailRef}>
          <AdSidebar ads={leftAds} />
        </div>
      </aside>
      <aside
        className="side-rail side-rail-right hidden min-[1280px]:block"
        style={{ top: `${rightTop}px` }}
        aria-label="Publicidad lateral derecha"
      >
        <div ref={rightRailRef}>
          <AdSidebar ads={rightAds} />
        </div>
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
        <div className="min-[1280px]:hidden grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          <AdSidebar ads={leftAds} />
          <AdSidebar ads={rightAds} />
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div ref={footerRef}>
        <Footer />
      </div>

      {/* ── MODALS ── */}
      <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
      <NewsDetailModal news={selectedNews} onClose={() => setSelectedNews(null)} />
    </>
  );
}
