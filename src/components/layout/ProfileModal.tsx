"use client";
// src/components/layout/ProfileModal.tsx

import { AnimatePresence, motion } from "framer-motion";
import { X, Mail, MapPin, Briefcase } from "lucide-react";
import LiquidButton from "@/src/components/ui/LiquidButton";

const EDITOR = {
  name:     "Valentina Rossi",
  role:     "Editora Jefe — LOTE 11",
  bio:      "Especialista en tendencias de Real Estate de lujo y arquitectura sustentable con más de 10 años de experiencia en el mercado global.",
  email:    "v.rossi@lote11.digital",
  location: "Buenos Aires, AR",
};

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ProfileModal({ open, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-12 bg-black/65 backdrop-blur-[8px]"
        >
          <motion.div
            key="box"
            initial={{ scale: 0.9, y: 24 }}
            animate={{ scale: 1,   y: 0  }}
            exit={{   scale: 0.9, y: 24  }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-panel w-full max-w-[900px] max-h-[90vh] rounded-[48px] overflow-hidden relative grid md:grid-cols-[5fr_7fr] shadow-2xl"
          >
            {/* Cerrar */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-white/[0.08] border border-white/10 flex items-center justify-center text-brand-cream/50 hover:bg-white/15 hover:text-brand-cream transition-all"
            >
              <X size={18} />
            </button>

            {/* Imagen */}
            <div className="relative min-h-[280px] md:min-h-[500px] bg-gradient-to-br from-[#3a2018] to-[#241408] flex items-center justify-center text-[80px]">
              🧑‍💼
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#241408]/90 to-transparent" />
            </div>

            {/* Info */}
            <div className="p-10 md:p-14 flex flex-col justify-center gap-6 overflow-y-auto">
              <div>
                <p className="text-[8px] font-bold tracking-[0.25em] text-brand-red uppercase mb-3">
                  Meet the Editor
                </p>
                <h2 className="font-serif text-5xl font-black text-brand-brown leading-[0.9] tracking-tight mb-2">
                  {EDITOR.name}
                </h2>
                <p className="text-sm text-brand-cream/60 font-light">{EDITOR.role}</p>
              </div>

              <p className="text-xs text-brand-cream/50 leading-relaxed max-w-sm">
                {EDITOR.bio}
              </p>

              <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-[11px] text-brand-cream/45">
                <span className="flex items-center gap-2"><Mail size={13} className="text-brand-brown" />{EDITOR.email}</span>
                <span className="flex items-center gap-2"><Briefcase size={13} className="text-brand-brown" />Real Estate</span>
                <span className="flex items-center gap-2"><MapPin size={13} className="text-brand-brown" />{EDITOR.location}</span>
              </div>

              <div className="pt-2">
                <LiquidButton>Ver Artículos Publicados</LiquidButton>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
