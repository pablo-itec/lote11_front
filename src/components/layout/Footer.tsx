"use client";
// src/components/layout/Footer.tsx

const LINKS = {
  Contenido: ["Podcasts", "Noticias", "Tendencias", "Entrevistas", "Reportes"],
  Empresa:   ["Nosotros", "Equipo Editorial", "Publicite Aquí", "Prensa", "Contacto"],
  Legal:     ["Términos de Uso", "Privacidad", "Cookies", "Newsletter"],
};

const SOCIALS = ["IG", "TW", "LI", "SP"];

export default function Footer() {
  return (
    <footer className="px-5 pb-5 mt-12">
      <div className="glass-panel rounded-[44px] px-8 md:px-14 py-14 relative overflow-hidden">

        {/* Monograma decorativo */}
        <div
          aria-hidden
          className="absolute -top-6 right-6 md:right-12 font-serif italic font-black text-[160px] md:text-[220px] leading-none text-brand-brown/[0.06] pointer-events-none select-none"
        >
          L11
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 mb-12 relative z-10">

          {/* Marca */}
          <div className="col-span-2 md:col-span-1">
            <div className="font-serif text-3xl font-black text-brand-brown tracking-tight mb-1">
              LOTE 11
            </div>
            <p className="kicker mb-4 text-brand-red/80">Digital · Real Estate</p>
            <p className="text-[11px] text-brand-cream/55 leading-relaxed mb-5 max-w-[240px]">
              La revista digital de referencia para el Real Estate latinoamericano. Noticias, análisis y tendencias del mercado.
            </p>
            <div className="flex gap-2 flex-wrap">
              {SOCIALS.map((s) => (
                <button
                  key={s}
                  className="px-3 py-[6px] rounded-full border border-brand-cream/15 text-[8px] font-bold tracking-[0.15em] text-brand-cream/55 hover:border-brand-brown hover:text-brand-brown hover:bg-brand-brown/5 transition-all cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Columnas de links */}
          {Object.entries(LINKS).map(([title, links]) => (
            <div key={title}>
              <p className="text-[8px] font-bold tracking-[0.28em] text-brand-cream/45 uppercase mb-5">
                {title}
              </p>
              <ul className="space-y-[10px]">
                {links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-[12px] text-brand-cream/65 hover:text-brand-brown hover:translate-x-0.5 inline-block transition-all"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pt-7 border-t border-brand-cream/[0.08] relative z-10">
          <p className="text-[10px] text-brand-cream/45 tracking-wide">
            © 2026 LOTE 11 Digital. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-2 text-[9px] font-bold tracking-[0.18em] text-brand-cream/55 uppercase">
            <span className="w-[6px] h-[6px] rounded-full bg-brand-red dot-blink" />
            Buenos Aires, Argentina
          </div>
        </div>

      </div>
    </footer>
  );
}
