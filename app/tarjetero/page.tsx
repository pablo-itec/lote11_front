import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { TarjeteroGroup } from "@/src/types";
import { imgSrc } from "@/src/lib/utils";
import { API_BASE } from "@/src/lib/api";
import SiteHeader from "@/src/components/layout/SiteHeader";

async function getGroups(): Promise<TarjeteroGroup[]> {
  try {
    const res = await fetch(`${API_BASE}/tarjetero`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export const metadata = {
  title: "Tarjetero — LOTE 11",
  description: "Directorio de profesionales y oficios agrupados por rubro.",
};

export default async function TarjeteroPage() {
  const groups = await getGroups();

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <div className="max-w-[1080px] mx-auto px-6 pt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.15em] uppercase text-brand-cream/40 hover:text-brand-cream transition-colors"
        >
          <ArrowLeft size={12} /> Volver
        </Link>
      </div>

      <div className="max-w-[1080px] mx-auto px-6 py-6 pb-16">
        <header className="mb-8">
          <h1 className="font-serif text-[32px] sm:text-[42px] font-black text-brand-brown leading-tight">Tarjetero</h1>
          <p className="text-[13px] text-brand-cream/55 mt-2">Profesionales y oficios agrupados por rubro.</p>
        </header>

        {groups.length === 0 ? (
          <p className="text-center py-16 text-[12px] text-brand-cream/30">Todavía no hay rubros publicados.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {groups.map((g) => (
              <Link
                key={g.id}
                href={`/tarjetero/${g.slug}`}
                className="glass-panel rounded-[28px] overflow-hidden group hover:scale-[1.02] transition-transform"
              >
                <div className="relative h-[140px] overflow-hidden bg-white/[0.03]">
                  {g.imageUrl ? (
                    <Image src={imgSrc(g.imageUrl)} alt={g.name} fill className="object-cover" sizes="260px" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-brand-cream/15 font-serif text-4xl">
                      {g.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h2 className="font-serif text-[16px] font-black text-brand-brown leading-tight group-hover:underline">{g.name}</h2>
                  {g.description && (
                    <p className="text-[11px] text-brand-cream/45 mt-1 line-clamp-2">{g.description}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
