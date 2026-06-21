"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Settings } from "lucide-react";
import { useState } from "react";

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-red-500">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5 text-pink-400">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

interface NavbarProps {
  onProfileClick: () => void;
}

const NAV_LINKS = [
  { label: "Inicio", href: "/" },
  { label: "Podcasts", href: "#" },
  { label: "Noticias", href: "#" },
  { label: "Tarjetero", href: "/tarjetero" },
];
const HIDE_THRESHOLD = 120;

export default function Navbar({ onProfileClick }: NavbarProps) {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    const diff = latest - prev;

    setScrolled(latest > 24);

    if (latest < HIDE_THRESHOLD) {
      setHidden(false);
      return;
    }
    if (diff > 4) setHidden(true);
    else if (diff < -4) setHidden(false);
  });

  const logoSize = scrolled ? "w-14 h-14 md:w-[60px] md:h-[60px]" : "w-16 h-16 md:w-[72px] md:h-[72px]";
  const profileSize = scrolled ? "w-14 h-14 md:w-[60px] md:h-[60px]" : "w-16 h-16 md:w-[72px] md:h-[72px]";
  const menuHeight = scrolled ? "h-[44px]" : "h-[52px]";

  return (
    <motion.header
      animate={{ y: hidden ? -140 : 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      className={`fixed top-5 left-1/2 -translate-x-1/2 w-[calc(100%-40px)] max-w-[1360px] z-50 flex items-center gap-3 md:gap-4 transition-all duration-300 ${
        scrolled ? "top-3" : "top-5"
      }`}
    >
      {/* YOUTUBE */}
      <motion.a
        href="https://www.youtube.com/@umdmpodcast/videos"
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.94 }}
        aria-label="Canal de YouTube"
        className={`${
          scrolled ? "glass-panel-strong" : "glass-panel"
        } w-12 h-12 md:w-[52px] md:h-[52px] rounded-[18px] flex items-center justify-center flex-shrink-0 cursor-pointer transition-all duration-300`}
      >
        <YouTubeIcon />
      </motion.a>

      {/* LOGO */}
      <motion.a
        href="/"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.96 }}
        aria-label="LOTE 11 — Inicio"
        className={`${
          scrolled ? "glass-panel-strong" : "glass-panel"
        } ${logoSize} rounded-[22px] flex items-center justify-center flex-shrink-0 cursor-pointer transition-all duration-300 relative overflow-hidden`}
      >
        <Image
          src="/logo.png"
          alt="LOTE 11"
          fill
          sizes="80px"
          preload
          className="object-contain scale-[1.85] translate-y-[10%]"
        />
      </motion.a>

      {/* INSTAGRAM */}
      <motion.a
        href="https://www.instagram.com/lote11.ar/"
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.94 }}
        aria-label="Instagram de LOTE 11"
        className={`${
          scrolled ? "glass-panel-strong" : "glass-panel"
        } w-12 h-12 md:w-[52px] md:h-[52px] rounded-[18px] flex items-center justify-center flex-shrink-0 cursor-pointer transition-all duration-300`}
      >
        <InstagramIcon />
      </motion.a>

      {/* MENÚ */}
      <nav
        className={`${
          scrolled ? "glass-panel-strong" : "glass-panel"
        } hidden md:flex flex-1 ${menuHeight} rounded-full items-center justify-center gap-8 transition-all duration-300`}
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="text-[9px] font-bold tracking-[0.22em] text-brand-cream/65 uppercase hover:text-brand-brown transition-colors"
          >
            {link.label}
          </a>
        ))}
      </nav>

      {/* ADMIN + PERFIL */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <Link href="/admin">
          <motion.div
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.96 }}
            className={`${
              scrolled ? "glass-panel-strong" : "glass-panel"
            } w-10 h-10 rounded-[14px] flex items-center justify-center text-brand-cream/55 hover:text-brand-brown transition-all duration-300 cursor-pointer`}
            title="Panel de administración"
          >
            <Settings size={16} />
          </motion.div>
        </Link>

        <motion.button
          onClick={onProfileClick}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.96 }}
          className={`${
            scrolled ? "glass-panel-strong" : "glass-panel"
          } ${profileSize} rounded-[22px] flex items-center justify-center cursor-pointer overflow-hidden transition-all duration-300`}
          aria-label="Ver perfil del editor"
        >
          <span className="text-3xl">🧑‍💼</span>
        </motion.button>
      </div>
    </motion.header>
  );
}
