"use client";

import Link from "next/link";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Settings } from "lucide-react";
import { useState } from "react";

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
    if (latest < HIDE_THRESHOLD) { setHidden(false); return; }
    if (diff > 4) setHidden(true);
    else if (diff < -4) setHidden(false);
  });

  const menuHeight = scrolled ? "h-[44px]" : "h-[52px]";

  return (
    <motion.header
      animate={{ y: hidden ? -120 : 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      className={`fixed left-1/2 -translate-x-1/2 w-[calc(100%-40px)] max-w-[1360px] z-50 flex items-center gap-3 md:gap-4 transition-all duration-300 ${
        scrolled ? "top-3" : "top-5"
      }`}
    >
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
      <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
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
          } w-11 h-11 rounded-[16px] flex items-center justify-center cursor-pointer overflow-hidden transition-all duration-300`}
          aria-label="Ver perfil del editor"
        >
          <span className="text-2xl">🧑‍💼</span>
        </motion.button>
      </div>
    </motion.header>
  );
}
