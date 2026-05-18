"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Settings } from "lucide-react";
import { useState } from "react";

interface NavbarProps {
  onProfileClick: () => void;
}

const NAV_LINKS = ["Inicio", "Podcasts", "Noticias", "Tendencias"];
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

      {/* MENÚ */}
      <nav
        className={`${
          scrolled ? "glass-panel-strong" : "glass-panel"
        } hidden md:flex flex-1 ${menuHeight} rounded-full items-center justify-center gap-8 transition-all duration-300`}
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link}
            href="#"
            className="text-[9px] font-bold tracking-[0.22em] text-brand-cream/65 uppercase hover:text-brand-brown transition-colors"
          >
            {link}
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
