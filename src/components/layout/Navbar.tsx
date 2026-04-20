"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Settings } from "lucide-react";

interface NavbarProps {
  onProfileClick: () => void;
}

const NAV_LINKS = ["Inicio", "Podcasts", "Noticias", "Tendencias"];

export default function Navbar({ onProfileClick }: NavbarProps) {
  return (
    <header className="fixed top-5 left-1/2 -translate-x-1/2 w-[calc(100%-40px)] max-w-[1360px] z-50 flex items-center gap-3 md:gap-4">

      {/* LOGO */}
      <motion.div
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.96 }}
        className="glass-panel w-16 h-16 md:w-[72px] md:h-[72px] rounded-[22px] flex items-center justify-center flex-shrink-0 cursor-pointer"
      >
        <span className="font-serif text-sm font-black text-brand-brown tracking-tight">L11</span>
      </motion.div>

      {/* MENÚ — oculto en móvil, visible en md+ */}
      <nav className="glass-panel hidden md:flex flex-1 h-[52px] rounded-full items-center justify-center gap-8">
        {NAV_LINKS.map((link) => (
          <a
            key={link}
            href="#"
            className="text-[9px] font-bold tracking-[0.22em] text-brand-cream/45 uppercase hover:text-brand-brown transition-colors"
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
            className="glass-panel w-10 h-10 rounded-[14px] flex items-center justify-center text-brand-cream/35 hover:text-brand-brown transition-colors cursor-pointer"
            title="Panel de administración"
          >
            <Settings size={16} />
          </motion.div>
        </Link>

        <motion.button
          onClick={onProfileClick}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.96 }}
          className="glass-panel w-16 h-16 md:w-[72px] md:h-[72px] rounded-[22px] flex items-center justify-center cursor-pointer overflow-hidden"
          aria-label="Ver perfil del editor"
        >
          <span className="text-3xl">🧑‍💼</span>
        </motion.button>
      </div>
    </header>
  );
}
