import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import SiteHeader from "@/src/components/layout/SiteHeader";

export const metadata = {
  title: "Política de Privacidad — LOTE 11",
  description: "Cómo LOTE 11 Digital trata los datos personales de sus usuarios.",
};

const SECTIONS = [
  {
    title: "1. Responsable del tratamiento",
    body: [
      "LOTE 11 Digital, con sede en Río Cuarto, Córdoba, Argentina, es responsable del tratamiento de los datos personales que se describen en esta política. Ante cualquier consulta podés escribir a consultoratierraylimon.dario@gmail.com.",
    ],
  },
  {
    title: "2. Qué datos recopilamos",
    body: [
      "Cuando te suscribís a nuestro newsletter, recopilamos únicamente tu dirección de email. No te pedimos nombre, teléfono ni ningún otro dato para suscribirte.",
      "Si nos contactás por mail o teléfono, conservamos esa comunicación para poder responderte.",
    ],
  },
  {
    title: "3. Para qué usamos tus datos",
    body: [
      "Usamos tu email exclusivamente para enviarte las novedades editoriales del Sitio a las que te suscribiste. No vendemos, alquilamos ni compartimos tu email con terceros con fines comerciales o publicitarios ajenos a LOTE 11 Digital.",
    ],
  },
  {
    title: "4. Cómo darte de baja",
    body: [
      "Todos nuestros emails incluyen un enlace de \"cancelar suscripción\" que da de baja tu dirección de forma inmediata, sin necesidad de justificar el motivo. También podés pedirnos la baja escribiendo a consultoratierraylimon.dario@gmail.com.",
    ],
  },
  {
    title: "5. Proveedores que usamos",
    body: [
      "Para operar el Sitio usamos proveedores de infraestructura (hosting y base de datos) y de envío de email. Estos proveedores procesan los datos en nuestro nombre, bajo sus propias políticas de seguridad, y no los usan para fines propios.",
    ],
  },
  {
    title: "6. Seguridad",
    body: [
      "Tomamos medidas razonables para proteger tus datos (por ejemplo, no publicamos ni exponemos las direcciones de email de nuestros suscriptores). Sin embargo, ningún sistema conectado a internet es 100% seguro, por lo que no podemos garantizar una protección absoluta.",
    ],
  },
  {
    title: "7. Tus derechos",
    body: [
      "De acuerdo con la Ley 25.326 de Protección de Datos Personales de la República Argentina, tenés derecho a acceder, rectificar, actualizar o solicitar la eliminación de tus datos personales en cualquier momento, escribiéndonos a consultoratierraylimon.dario@gmail.com.",
      "La Agencia de Acceso a la Información Pública, en su carácter de Órgano de Control de la Ley 25.326, tiene la atribución de atender las denuncias y reclamos que se interpongan con relación al incumplimiento de las normas sobre protección de datos personales.",
    ],
  },
  {
    title: "8. Cookies",
    body: [
      "El Sitio usa una cookie técnica de sesión únicamente en el panel de administración (/admin), necesaria para mantener la sesión de los editores autorizados. No usamos cookies de seguimiento ni de publicidad para los visitantes públicos del Sitio.",
    ],
  },
  {
    title: "9. Cambios en esta política",
    body: [
      "Podemos actualizar esta Política de Privacidad para reflejar cambios en el Sitio o en la normativa aplicable. La versión vigente es siempre la publicada en esta página.",
    ],
  },
];

export default function PrivacidadPage() {
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
            Política de Privacidad
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
