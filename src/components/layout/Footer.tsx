"use client";
// src/components/layout/Footer.tsx

const IconInstagram = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
  </svg>
);
const IconPhone = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.8a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.84.57 2.8.7A2 2 0 0 1 22 16.92Z" />
  </svg>
);
const IconMail = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);
const IconMapPin = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const LINKS = {
  Contenido: ["Podcasts", "Noticias", "Tendencias", "Entrevistas", "Reportes"],
  Empresa:   ["Nosotros", "Equipo Editorial", "Publicite Aquí", "Prensa"],
  Legal:     ["Términos de Uso", "Privacidad", "Cookies", "Newsletter"],
};

const INSTAGRAMS = [
  { handle: "@lote11.ar", url: "https://instagram.com/lote11.ar" },
  { handle: "@consultoratierraylimon", url: "https://instagram.com/consultoratierraylimon" },
];

const PHONE = "3584820474";
const EMAIL = "consultoratierraylimon.dario@gmail.com";

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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12 mb-12 relative z-10">

          {/* Marca + Contacto */}
          <div className="md:col-span-1">
            <div className="font-serif text-3xl font-black text-brand-brown tracking-tight mb-1">
              LOTE 11
            </div>
            <p className="kicker mb-4 text-brand-red/80">Digital · Real Estate</p>
            <p className="text-[11px] text-brand-cream/55 leading-relaxed mb-5 max-w-[240px]">
              La revista digital de referencia para el Real Estate. Noticias, análisis y tendencias del mercado.
            </p>

            {/* Instagram handles */}
            <ul className="space-y-[6px] mb-4">
              {INSTAGRAMS.map(({ handle, url }) => (
                <li key={handle}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[12px] text-brand-cream/75 hover:text-brand-brown transition-colors"
                  >
                    <IconInstagram width={13} height={13} className="text-brand-red" />
                    {handle}
                  </a>
                </li>
              ))}
            </ul>
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

        {/* Bloque de contacto destacado */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 pt-7 border-t border-brand-cream/[0.08] relative z-10">
          <a
            href={`tel:${PHONE}`}
            className="flex items-center gap-3 text-[12px] text-brand-cream/75 hover:text-brand-brown transition-colors group"
          >
            <span className="w-9 h-9 rounded-full bg-brand-brown/15 border border-brand-brown/25 flex items-center justify-center group-hover:bg-brand-brown/25 transition-colors">
              <IconPhone width={14} height={14} className="text-brand-cream/85" />
            </span>
            <span>
              <span className="block text-[8px] tracking-[0.22em] text-brand-cream/45 uppercase mb-[2px]">Teléfono</span>
              {PHONE}
            </span>
          </a>

          <a
            href={`mailto:${EMAIL}`}
            className="flex items-center gap-3 text-[12px] text-brand-cream/75 hover:text-brand-brown transition-colors group break-all"
          >
            <span className="w-9 h-9 rounded-full bg-brand-brown/15 border border-brand-brown/25 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-brown/25 transition-colors">
              <IconMail width={14} height={14} className="text-brand-cream/85" />
            </span>
            <span className="min-w-0">
              <span className="block text-[8px] tracking-[0.22em] text-brand-cream/45 uppercase mb-[2px]">Mail</span>
              <span className="break-all">{EMAIL}</span>
            </span>
          </a>

          <div className="flex items-center gap-3 text-[12px] text-brand-cream/75">
            <span className="w-9 h-9 rounded-full bg-brand-brown/15 border border-brand-brown/25 flex items-center justify-center">
              <IconMapPin width={14} height={14} className="text-brand-cream/85" />
            </span>
            <span>
              <span className="block text-[8px] tracking-[0.22em] text-brand-cream/45 uppercase mb-[2px]">Ubicación</span>
              Río Cuarto, Córdoba
            </span>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pt-6 border-t border-brand-cream/[0.08] relative z-10">
          <p className="text-[10px] text-brand-cream/45 tracking-wide">
            © 2026 LOTE 11 Digital. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-2 text-[9px] font-bold tracking-[0.18em] text-brand-cream/55 uppercase">
            <span className="w-[6px] h-[6px] rounded-full bg-brand-red dot-blink" />
            Río Cuarto, Córdoba — Argentina
          </div>
        </div>

      </div>
    </footer>
  );
}
