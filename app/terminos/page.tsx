import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import SiteHeader from "@/src/components/layout/SiteHeader";

export const metadata = {
  title: "Términos de Uso — LOTE 11",
  description: "Condiciones de uso del sitio LOTE 11 Digital.",
};

const SECTIONS = [
  {
    title: "1. Aceptación de los términos",
    body: [
      "Al acceder y utilizar el sitio LOTE 11 Digital (en adelante, \"el Sitio\") aceptás estos Términos de Uso en su totalidad. Si no estás de acuerdo con alguna de estas condiciones, te pedimos que no utilices el Sitio.",
    ],
  },
  {
    title: "2. Contenido editorial",
    body: [
      "El Sitio publica noticias, artículos y contenido audiovisual vinculado al mercado inmobiliario (Real Estate) con fines informativos. El contenido tiene carácter periodístico y no constituye asesoramiento legal, financiero, impositivo ni de inversión. Cualquier decisión que tomes en base a la información publicada es de tu exclusiva responsabilidad.",
      "Nos esforzamos por mantener la información actualizada y precisa, pero no garantizamos que esté libre de errores u omisiones.",
    ],
  },
  {
    title: "3. Propiedad intelectual",
    body: [
      "Los textos, imágenes, logotipos y demás contenidos originales publicados en el Sitio son propiedad de LOTE 11 Digital o de terceros que autorizaron su uso, y están protegidos por la normativa de propiedad intelectual vigente en Argentina.",
      "Podés compartir enlaces a nuestras notas y citar fragmentos breves mencionando la fuente. No está permitida la reproducción total de artículos, ni su uso comercial, sin autorización previa por escrito.",
    ],
  },
  {
    title: "4. Suscripción al newsletter",
    body: [
      "Si te suscribís para recibir novedades por email, usamos esa dirección exclusivamente para enviarte los envíos editoriales que elegiste recibir. Podés darte de baja en cualquier momento desde el enlace de \"cancelar suscripción\" incluido en cada email, sin necesidad de justificar el motivo.",
    ],
  },
  {
    title: "5. Enlaces a sitios de terceros",
    body: [
      "El Sitio puede incluir enlaces a redes sociales (Instagram, YouTube) o a sitios de anunciantes. No tenemos control sobre el contenido ni las políticas de esos sitios externos, por lo que no somos responsables por ellos. Te recomendamos revisar sus propios términos y políticas de privacidad.",
    ],
  },
  {
    title: "6. Panel de administración",
    body: [
      "El acceso al panel administrativo del Sitio está restringido a personal autorizado de LOTE 11 Digital. Cualquier intento de acceso no autorizado será considerado una violación a estos Términos y podrá derivar en las acciones legales que correspondan.",
    ],
  },
  {
    title: "7. Limitación de responsabilidad",
    body: [
      "El Sitio se ofrece \"tal cual está\". En la medida permitida por la ley, LOTE 11 Digital no será responsable por daños directos o indirectos derivados del uso o la imposibilidad de uso del Sitio, incluyendo interrupciones del servicio.",
    ],
  },
  {
    title: "8. Modificaciones",
    body: [
      "Podemos actualizar estos Términos de Uso en cualquier momento para reflejar cambios en el Sitio o en la normativa aplicable. La versión vigente es siempre la publicada en esta página.",
    ],
  },
  {
    title: "9. Ley aplicable y jurisdicción",
    body: [
      "Estos Términos se rigen por las leyes de la República Argentina. Ante cualquier controversia, las partes se someten a los tribunales ordinarios de la ciudad de Río Cuarto, Córdoba.",
    ],
  },
  {
    title: "10. Contacto",
    body: [
      "Ante consultas sobre estos Términos de Uso, podés escribirnos a consultoratierraylimon.dario@gmail.com.",
    ],
  },
];

export default function TerminosPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <div className="max-w-[760px] mx-auto px-6 pt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.15em] uppercase text-brand-cream/40 hover:text-brand-cream transition-colors"
        >
          <ArrowLeft size={12} /> Volver
        </Link>
      </div>

      <article className="max-w-[760px] mx-auto px-6 py-6 pb-16">
        <div className="glass-panel rounded-[44px] overflow-hidden p-8 md:p-12">
          <p className="kicker mb-3">Legal</p>
          <h1 className="font-serif text-[28px] sm:text-[36px] font-black text-brand-brown leading-tight mb-3">
            Términos de Uso
          </h1>
          <p className="text-[11px] text-brand-cream/40 mb-8">Última actualización: agosto de 2026</p>

          <div className="h-px bg-white/[0.06] mb-7" />

          <div className="space-y-7">
            {SECTIONS.map((s) => (
              <section key={s.title}>
                <h2 className="font-serif text-[17px] font-bold text-brand-brown mb-2">{s.title}</h2>
                {s.body.map((p, i) => (
                  <p key={i} className="text-[14px] text-brand-cream/80 leading-[1.85] mb-2 last:mb-0">
                    {p}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}
