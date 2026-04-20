"use client";
// src/app/page.tsx

import { useState } from "react";

import Navbar        from "@/src/components/layout/Navbar";
import Ticker        from "@/src/components/layout/Ticker";
import HeroSection   from "@/src/components/layout/HeroSection";
import NewsGrid      from "@/src/components/layout/NewsGrid";
import ProfileModal  from "@/src/components/layout/ProfileModal";
import Footer        from "@/src/components/layout/Footer";
import AdBubbles     from "@/src/components/ads/AdBubbles";
import AdBanner      from "@/src/components/ads/AdBanner";

export default function Home() {
  const [profileOpen, setProfileOpen] = useState(false);

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
        ── MAIN LAYOUT ──
        Mobile:  columna única (ads arriba → contenido → banner)
        Tablet:  contenido full, ads ocultos
        Desktop: 3 columnas [ads | contenido | banner]
      */}
      <div className="
        max-w-[1400px] mx-auto
        px-0
        grid gap-3

        /* mobile: columna única sin sidebars */
        grid-cols-1

        /* desktop (≥1280px): 3 columnas pegadas a los bordes */
        xl:grid-cols-[200px_1fr_185px]
        xl:px-0
      ">

        {/* SIDEBAR IZQ — oculta en mobile/tablet */}
        <div className="hidden xl:block pl-3">
          <div className="sticky top-[100px]">
            <AdBubbles />
          </div>
        </div>

        {/* CONTENIDO CENTRAL */}
        <div className="flex flex-col gap-3 px-5 xl:px-0">
          <HeroSection />
          <NewsGrid />
        </div>

        {/* SIDEBAR DER — oculta en mobile/tablet */}
        <div className="hidden xl:block pr-3">
          <div className="sticky top-[100px]">
            <AdBanner />
          </div>
        </div>

      </div>

      {/* ── FOOTER ── */}
      <Footer />

      {/* ── MODAL PERFIL ── */}
      <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
    </>
  );
}
