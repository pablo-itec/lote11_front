import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { TarjeteroGroup, TarjeteroSection } from "@/src/types";
import { imgSrc } from "@/src/lib/utils";
import { API_BASE } from "@/src/lib/api";
import SiteHeader from "@/src/components/layout/SiteHeader";

async function getSections(): Promise<TarjeteroSection[]> {
  try {
    const res = await fetch(`${API_BASE}/tarjetero/sections`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export const metadata = {
  title: "Tarjetero — LOTE 11",
  description: "Directorio de empresas, profesionales y contactos agrupados por sección.",
};

// Render on-demand (no prerender en build): evita que el fetch al backend
// bloquee la generación estática en Vercel.
export const dynamic = "force-dynamic";

function GroupCard({ g }: { g: TarjeteroGroup }) {
  return (
    <Link
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
        <h3 className="font-serif text-[16px] font-black text-brand-brown leading-tight group-hover:underline">{g.name}</h3>
        {g.description && (
          <p className="text-[11px] text-brand-cream/45 mt-1 line-clamp-2">{g.description}</p>
        )}
      </div>
    </Link>
  );
}

export default async function TarjeteroPage() {
  const sections = (await getSections()).filter((s) => (s.groups?.length ?? 0) > 0);

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
          <p className="text-[13px] text-brand-cream/55 mt-2">Empresas, profesionales y contactos agrupados por sección.</p>
        </header>

        {sections.length === 0 ? (
          <p className="text-center py-16 text-[12px] text-brand-cream/30">Todavía no hay nada publicado.</p>
        ) : (
          <div className="space-y-12">
            {sections.map((section, i) => (
              <section key={section.id ?? "sin-seccion"}>
                {/* El bucket sin sección (id null) se muestra sin encabezado, separado al final */}
                {section.id != null ? (
                  <div className="mb-5">
                    <h2 className="font-serif text-[22px] sm:text-[26px] font-black text-brand-brown leading-tight">{section.name}</h2>
                    {section.description && (
                      <p className="text-[12px] text-brand-cream/45 mt-1">{section.description}</p>
                    )}
                  </div>
                ) : (
                  // Separador sutil antes de los grupos sin sección (solo si hay secciones antes)
                  i > 0 && <div className="border-t border-brand-cream/10 mb-8" />
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {section.groups!.map((g) => (
                    <GroupCard key={g.id} g={g} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
