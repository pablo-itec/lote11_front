"use client";

import Image from "next/image";
import { motion } from "framer-motion";

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-red-500">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6 text-pink-400">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function LogoBanner() {
  return (
    <div className="flex items-center justify-center gap-4">
      {/* YOUTUBE */}
      <motion.a
        href="https://www.youtube.com/@umdmpodcast/videos"
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.94 }}
        aria-label="Canal de YouTube"
        className="glass-panel w-14 h-14 rounded-[20px] flex items-center justify-center flex-shrink-0 cursor-pointer"
      >
        <YouTubeIcon />
      </motion.a>

      {/* LOGO PRINCIPAL */}
      <motion.a
        href="/"
        aria-label="LOTE 11 — Inicio"
        className="glass-panel w-32 h-32 rounded-[28px] flex items-center justify-center flex-shrink-0 cursor-pointer relative overflow-hidden"
      >
        <Image
          src="/logo.png"
          alt="LOTE 11"
          fill
          sizes="128px"
          className="object-contain"
          style={{ mixBlendMode: "multiply" }}
        />
      </motion.a>

      {/* INSTAGRAM */}
      <motion.a
        href="https://www.instagram.com/lote11.ar/"
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.94 }}
        aria-label="Instagram de LOTE 11"
        className="glass-panel w-14 h-14 rounded-[20px] flex items-center justify-center flex-shrink-0 cursor-pointer"
      >
        <InstagramIcon />
      </motion.a>
    </div>
  );
}
