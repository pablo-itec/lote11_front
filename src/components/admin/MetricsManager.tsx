"use client";

// Issue #4: vista de métricas de noticias más vistas.
// Implementación base — pendiente de mejora visual por el equipo de front.

import { useState, useEffect } from "react";
import { metricsApi } from "@/src/lib/api";
import type { NewsMetrics } from "@/src/types";

interface Props {
  onToast: (msg: string, ok: boolean) => void;
}

export default function MetricsManager({ onToast }: Props) {
  const [data, setData] = useState<NewsMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try { setData(await metricsApi.getNews(20)); }
    catch (err) { onToast((err as Error).message, false); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[10px] font-bold tracking-[0.2em] text-brand-cream/40 uppercase">Métricas</h2>
        {data && (
          <span className="abadge abadge-brown">Total de clics: {data.totalClicks}</span>
        )}
      </div>

      <div className="glass-panel rounded-[28px] overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <p className="text-center py-8 text-[11px] text-brand-cream/30">Cargando...</p>
          ) : !data || data.ranking.length === 0 ? (
            <p className="text-center py-8 text-[11px] text-brand-cream/30">Sin datos.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr><th>#</th><th>Noticia</th><th>Estado</th><th>Clics</th></tr>
              </thead>
              <tbody>
                {data.ranking.map((n, i) => (
                  <tr key={n.id}>
                    <td className="text-[11px]">{i + 1}</td>
                    <td className="font-medium text-brand-cream/70">{n.title}</td>
                    <td>
                      <span className={`abadge ${n.status === "published" ? "abadge-brown" : "abadge-gray"}`}>
                        {n.status === "published" ? "Publicada" : "Borrador"}
                      </span>
                    </td>
                    <td className="text-[11px]">{n.clicks ?? 0}</td>
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
