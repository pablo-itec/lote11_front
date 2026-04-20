"use client";
// src/components/layout/Ticker.tsx

const ITEMS = [
  { label: "NUEVO EP. 12 — INVERSIONES 2026", pip: "red" },
  { label: "PALERMO SOHO +18% YTD",           pip: "brown" },
  { label: "ENTREVISTA: ARQ. LUNA VIDAL",      pip: "dim" },
  { label: "MASTERCLASS ONLINE — 24 MAYO",    pip: "red" },
  { label: "BUENOS AIRES · TOP DESTINO 2026", pip: "brown" },
  { label: "NEWSLETTER MAYO — SUSCRIBITE",    pip: "dim" },
  { label: "DÓLAR INMOBILIARIO: ANÁLISIS MES", pip: "red" },
  { label: "REPORTE Q2 — DESCARGA GRATUITA",  pip: "brown" },
  { label: "PODCAST EP. 13 — PRÓXIMAMENTE",   pip: "dim" },
];

const PIP: Record<string, string> = {
  red:   "bg-brand-red",
  brown: "bg-brand-brown",
  dim:   "bg-brand-cream/20",
};

export default function Ticker() {
  // Duplicamos para el loop infinito CSS
  const doubled = [...ITEMS, ...ITEMS];

  return (
    <div className="relative h-[42px] rounded-full flex items-center overflow-hidden glass-panel">

      {/* Label fijo */}
      <div className="flex-shrink-0 bg-brand-red text-white text-[8px] font-bold tracking-[0.22em] uppercase px-4 h-full flex items-center gap-2 rounded-full z-10">
        <span className="w-[6px] h-[6px] rounded-full bg-white dot-blink" />
        EN VIVO
      </div>

      {/* Fade izquierdo */}
      <div className="absolute left-[100px] w-8 h-full bg-gradient-to-r from-[#1a1614]/80 to-transparent pointer-events-none z-[1]" />

      {/* Track */}
      <div className="flex-1 overflow-hidden h-full flex items-center">
        <div className="ticker-track flex items-center whitespace-nowrap">
          {doubled.map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-2 px-5 text-[9px] font-bold tracking-[0.16em] text-brand-cream/45 uppercase border-r border-brand-cream/[0.07] h-[42px] cursor-pointer hover:text-brand-cream transition-colors flex-shrink-0"
            >
              <span className={`w-[5px] h-[5px] rounded-full flex-shrink-0 ${PIP[item.pip]}`} />
              {item.label}
            </span>
          ))}
        </div>
      </div>

      {/* Fade derecho */}
      <div className="absolute right-0 w-14 h-full bg-gradient-to-l from-[#1a1614]/90 to-transparent pointer-events-none rounded-full" />
    </div>
  );
}
