"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { subscribersApi } from "@/src/lib/api";
import { fmt } from "@/src/lib/utils";
import type { Subscriber } from "@/src/types";

interface Props {
  onToast: (msg: string, ok: boolean) => void;
}

export default function SubscribersManager({ onToast }: Props) {
  const [list, setList]       = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");

  const load = async (q = "") => {
    setLoading(true);
    try {
      const res = await subscribersApi.getAll(q || undefined);
      setList(res.data ?? []);
    } catch (err) {
      onToast((err as Error).message, false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const deactivate = async (id: number) => {
    try {
      await subscribersApi.deactivate(id);
      onToast("Suscriptor dado de baja", true);
      load(search);
    } catch (err) {
      onToast((err as Error).message, false);
    }
  };

  const activate = async (id: number) => {
    try {
      await subscribersApi.activate(id);
      onToast("Suscriptor activado", true);
      load(search);
    } catch (err) {
      onToast((err as Error).message, false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[10px] font-bold tracking-[0.2em] text-brand-cream/40 uppercase">Suscriptores</h2>
        <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.07] rounded-full px-4 h-9">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load(search)}
            placeholder="Buscar por email..."
            className="bg-transparent outline-none text-[11px] text-brand-cream/70 placeholder:text-brand-cream/20 w-40 font-sans"
          />
          <button onClick={() => load(search)} className="text-brand-cream/30 hover:text-brand-brown transition-colors">
            <Search size={14} />
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-[28px] overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <p className="text-center py-8 text-[11px] text-brand-cream/30">Cargando...</p>
          ) : list.length === 0 ? (
            <p className="text-center py-8 text-[11px] text-brand-cream/30">Sin suscriptores.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Estado</th>
                  <th>Suscripto</th>
                  <th>Token baja</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {list.map((s) => (
                  <tr key={s.id}>
                    <td className="font-medium text-brand-cream/70">{s.email}</td>
                    <td>
                      <span className={`abadge ${s.active ? "abadge-green" : "abadge-gray"}`}>
                        {s.active ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="text-[11px] whitespace-nowrap">{fmt(s.subscribedAt)}</td>
                    <td>
                      <span className="text-[9px] text-brand-cream/25 font-mono max-w-[120px] truncate block">
                        {s.unsubscribeToken ?? "—"}
                      </span>
                    </td>
                    <td>
                      {s.active ? (
                        <button onClick={() => deactivate(s.id)} className="abtn abtn-del">
                          Dar de baja
                        </button>
                      ) : (
                        <button onClick={() => activate(s.id)} className="abtn abtn-pub">
                          Reactivar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
