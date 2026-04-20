"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { auth } from "@/src/lib/api";

interface Props {
  onLogin: () => void;
}

export default function LoginPanel({ onLogin }: Props) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await auth.login(email, password);
      auth.setToken(res.access_token);
      onLogin();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel rounded-[44px] p-12 w-full max-w-[420px] shadow-2xl"
      >
        <p className="text-[8px] font-bold tracking-[0.25em] text-brand-red uppercase mb-4 flex items-center gap-2">
          <span className="w-4 h-px bg-brand-red inline-block" />
          Admin
        </p>
        <h1 className="font-serif text-[36px] font-black text-brand-brown leading-tight mb-2">
          LOTE 11
        </h1>
        <p className="text-[11px] text-brand-cream/40 mb-8">Panel de administración</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-[9px] font-bold tracking-[0.18em] uppercase text-brand-cream/35 block mb-2">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@lote11.com"
              className="glass-input"
            />
          </div>
          <div>
            <label className="text-[9px] font-bold tracking-[0.18em] uppercase text-brand-cream/35 block mb-2">
              Contraseña
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="glass-input"
            />
          </div>

          {error && (
            <p className="text-[11px] text-[#d47a6a] font-medium">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 px-7 py-3 rounded-full text-[9px] font-bold tracking-[0.2em] uppercase bg-brand-brown text-brand-cream hover:bg-brand-cream hover:text-brand-dark transition-colors disabled:opacity-50"
          >
            {loading ? "Ingresando..." : "Ingresar →"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
