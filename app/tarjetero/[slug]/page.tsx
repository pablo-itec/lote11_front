import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import type { TarjeteroGroup } from "@/src/types";
import { imgSrc } from "@/src/lib/utils";
import { API_BASE } from "@/src/lib/api";
import TarjeteroPersonCard from "@/src/components/layout/TarjeteroPersonCard";

async function getGroup(slug: string): Promise<TarjeteroGroup | null> {
  try {
    const res = await fetch(`${API_BASE}/tarjetero/slug/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function TarjeteroGroupPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const group = await getGroup(slug);
  if (!group) notFound();

  const people = group.people ?? [];

  return (
    <div className="min-h-screen">
      <div className="max-w-[1080px] mx-auto px-6 pt-8">
        <Link
          href="/tarjetero"
          className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.15em] uppercase text-brand-cream/40 hover:text-brand-cream transition-colors"
        >
          <ArrowLeft size={12} /> Tarjetero
        </Link>
      </div>

      <div className="max-w-[1080px] mx-auto px-6 py-6 pb-16">
        <header className="flex items-center gap-5 mb-8">
          {group.imageUrl && (
            <div className="relative w-20 h-20 rounded-[22px] overflow-hidden flex-shrink-0">
              <Image src={imgSrc(group.imageUrl)} alt={group.name} fill className="object-cover" sizes="80px" />
            </div>
          )}
          <div>
            <h1 className="font-serif text-[32px] sm:text-[42px] font-black text-brand-brown leading-tight">{group.name}</h1>
            {group.description && (
              <p className="text-[13px] text-brand-cream/55 mt-1">{group.description}</p>
            )}
          </div>
        </header>

        {people.length === 0 ? (
          <p className="text-center py-16 text-[12px] text-brand-cream/30">Todavía no hay personal en este rubro.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {people.map((p) => (
              <TarjeteroPersonCard key={p.id} person={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
