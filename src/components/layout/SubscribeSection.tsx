"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, X } from "lucide-react";
import { subscribersApi } from "@/src/lib/api";

export default function SubscribeSection() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [mode, setMode] = useState<"subscribe" | "unsubscribe">("subscribe");
  const [loading, setLoading] = useState(false);

  const showMsg = (text: string, ok: boolean) => {
    setMsg({ text, ok });
    setTimeout(() => setMsg(null), 4000);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await subscribersApi.subscribe(email);
      showMsg(res.message || "¡Suscripto exitosamente!", true);
      setEmail("");
    } catch (err) {
      showMsg((err as Error).message, false);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await subscribersApi.unsubscribe(token.trim());
      showMsg(res.message || "Desuscripto correctamente.", true);
      setToken("");
    } catch (err) {
      showMsg((err as Error).message, false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-panel rounded-[44px] p-10 md:p-14 flex flex-col md:flex-row items-start md:items-center gap-10"
    >
      {/* Left: copy */}
      <div className="flex-shrink-0 max-w-xs">
        <p className="text-[8px] font-bold tracking-[0.25em] text-brand-red uppercase mb-4 flex items-center gap-2">
          <span className="w-4 h-px bg-brand-red inline-block" />
          Newsletter
        </p>
        <h2 className="font-serif text-[32px] font-black text-brand-brown leading-tight mb-3">
          Sumate a<br />LOTE 11
        </h2>
        <p className="text-[11px] text-brand-cream/45 leading-relaxed">
          Recibí análisis, noticias y tendencias del Real Estate directamente en tu casilla.
        </p>
      </div>

      {/* Right: forms */}
      <div className="flex-1 w-full">
        {/* Tab toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode("subscribe")}
            className={`text-[8px] font-bold tracking-[0.18em] uppercase px-4 py-2 rounded-full transition-all ${
              mode === "subscribe"
                ? "bg-brand-brown text-brand-cream"
                : "bg-white/[0.05] text-brand-cream/40 hover:bg-white/10"
            }`}
          >
            Suscribirme
          </button>
          <button
            onClick={() => setMode("unsubscribe")}
            className={`text-[8px] font-bold tracking-[0.18em] uppercase px-4 py-2 rounded-full transition-all ${
              mode === "unsubscribe"
                ? "bg-brand-brown text-brand-cream"
                : "bg-white/[0.05] text-brand-cream/40 hover:bg-white/10"
            }`}
          >
            Desuscribirme
          </button>
        </div>

        {mode === "subscribe" ? (
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
            <div className="flex flex-1 items-center gap-2 bg-white/[0.04] border border-white/[0.07] rounded-full px-4 h-10">
              <Mail size={14} className="text-brand-cream/25 flex-shrink-0" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="bg-transparent outline-none text-[12px] text-brand-cream/70 placeholder:text-brand-cream/20 flex-1 font-sans"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-7 py-[10px] rounded-full text-[9px] font-bold tracking-[0.2em] uppercase bg-brand-brown text-brand-cream hover:bg-brand-cream hover:text-brand-dark transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              {loading ? "Enviando..." : "Suscribirme →"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleUnsubscribe} className="flex flex-col sm:flex-row gap-3">
            <div className="flex flex-1 items-center gap-2 bg-white/[0.04] border border-white/[0.07] rounded-full px-4 h-10">
              <X size={14} className="text-brand-cream/25 flex-shrink-0" />
              <input
                type="text"
                required
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Token de baja (del email que recibiste)"
                className="bg-transparent outline-none text-[12px] text-brand-cream/70 placeholder:text-brand-cream/20 flex-1 font-sans"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-7 py-[10px] rounded-full text-[9px] font-bold tracking-[0.2em] uppercase bg-white/[0.07] border border-white/10 text-brand-cream/60 hover:bg-white/15 transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              {loading ? "Procesando..." : "Desuscribirme"}
            </button>
          </form>
        )}

        {msg && (
          <p className={`mt-3 text-[11px] font-medium ${msg.ok ? "text-[#4caf82]" : "text-[#d47a6a]"}`}>
            {msg.text}
          </p>
        )}
      </div>
    </motion.div>
  );
}
