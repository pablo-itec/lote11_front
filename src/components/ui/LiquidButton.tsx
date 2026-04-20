"use client";
// src/components/ui/LiquidButton.tsx

import { motion } from "framer-motion";

interface Props {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "ghost";
  className?: string;
}

export default function LiquidButton({
  children,
  href = "#",
  onClick,
  variant = "primary",
  className = "",
}: Props) {
  const base =
    "inline-flex items-center gap-2 px-7 py-[10px] rounded-full text-[9px] font-bold tracking-[0.2em] uppercase cursor-pointer transition-colors";

  const variants = {
    primary: "bg-brand-brown text-brand-cream hover:bg-brand-cream hover:text-brand-dark",
    ghost:
      "bg-brand-cream/[0.07] border border-brand-cream/15 text-brand-cream/60 hover:bg-brand-cream/15 hover:text-brand-cream",
  };

  return (
    <motion.a
      href={href}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.96 }}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </motion.a>
  );
}
