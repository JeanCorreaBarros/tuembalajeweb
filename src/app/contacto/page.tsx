import type { Metadata } from "next";
import { ArrowRight, Clock, Leaf, Mail, MapPin, Phone, ShieldCheck, Truck } from "lucide-react";
import { Suspense } from "react";
import ContactForm from "@/components/sections/ContactForm";
import ContactHero from "@/components/sections/ContactHero";
import Footer from "@/components/sections/Footer";
import Navbar from "@/components/sections/Navbar";
import Reveal from "@/components/ui/Reveal";
import { WhatsAppIcon } from "@/components/ui/icons";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbs, pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Contacto y cotizaciones",
  description:
    "Solicita tu asesoría gratis y cotiza cajas de madera, estibas, pallets y embalajes especiales a tu medida. Escríbenos por WhatsApp o llámanos.",
  path: "/contacto",
});

const info = [
  { icon: Phone, label: "Teléfono", value: SITE.phoneDisplay, sub: "Llámanos o escríbenos por WhatsApp", href: `tel:${SITE.phoneTel}` },
  { icon: Mail, label: "Correo", value: SITE.email, sub: "Te respondemos en menos de 24 horas", href: `mailto:${SITE.email}` },
  { icon: MapPin, label: "Ubicación", value: SITE.location, sub: "Envíos a todo el país" },
  { icon: Clock, label: "Horario", value: SITE.schedule, sub: "¡Estamos para atenderte!" },
];

const trust = [
  { icon: ShieldCheck, label: "Calidad garantizada" },
  { icon: Truck, label: "Envíos a todo el país" },
  { icon: Leaf, label: "Empaque responsable" },
];

export default function ContactoPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbs([
          { name: "Inicio", path: "/" },
          { name: "Contacto", path: "/contacto" },
        ])}
      />
      <Navbar solid />
      <main>
        <ContactHero />

        <section className="relative overflow-hidden bg-mist/60 py-12 lg:py-14">
          <div className="pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-brand/10 blur-2xl" />
          <div className="pointer-events-none absolute -right-24 top-1/2 h-72 w-72 rounded-full bg-lime/10 blur-2xl" />

          <div className="relative mx-auto grid max-w-[1240px] grid-cols-1 gap-6 px-5 sm:px-8 lg:grid-cols-[1.35fr_1fr] lg:px-8">
            <div className="min-w-0">
              <Reveal x={-30} y={0}>
                <Suspense fallback={<div className="h-[520px] rounded-2xl bg-white shadow-xl" />}>
                  <ContactForm />
                </Suspense>
              </Reveal>
              <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3 pl-2 sm:gap-x-8">
                {trust.map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-2 text-[11px] font-medium text-ink/60">
                    <Icon className="h-5 w-5 text-forest" strokeWidth={1.4} /> {label}
                  </li>
                ))}
              </ul>
            </div>

            {/* En tablet las tarjetas de contacto van en dos columnas; en celular y escritorio, una. */}
            <div className="grid min-w-0 grid-cols-1 content-start gap-3.5 md:grid-cols-2 lg:grid-cols-1">
              {info.map(({ icon: Icon, label, value, sub, href }, i) => {
                const body = (
                  <>
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-ink/50">{label}</span>
                      <span className="block truncate text-[14px] font-extrabold text-forest-dark">{value}</span>
                      <span className="block text-[11px] text-ink/50">{sub}</span>
                    </span>
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand transition group-hover:bg-brand group-hover:text-white">
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </>
                );
                const cls =
                  "group flex items-center gap-4 rounded-2xl bg-white p-4 shadow-[0_6px_24px_-10px_rgba(11,59,40,0.2)] transition hover:-translate-y-0.5 hover:shadow-lg";
                return (
                  <Reveal key={label} delay={0.08 * i} x={30} y={0}>
                    {href ? (
                      <a href={href} className={cls}>
                        {body}
                      </a>
                    ) : (
                      <div className={cls}>{body}</div>
                    )}
                  </Reveal>
                );
              })}

              <Reveal delay={0.35} x={30} y={0} className="md:col-span-2 lg:col-span-1">
                <a
                  href={`https://wa.me/${SITE.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-2xl bg-gradient-to-r from-forest-dark to-forest-mid p-4 text-white shadow-lg transition hover:-translate-y-0.5"
                >
                  <WhatsAppIcon className="h-9 w-9 text-lime" />
                  <span className="h-9 w-px bg-white/20" />
                  <span className="flex-1">
                    <span className="block text-[13px] font-bold">Escríbenos directo por WhatsApp</span>
                    <span className="block text-[11px] text-white/70">Te asesoramos en minutos</span>
                  </span>
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </a>
              </Reveal>

              <p className="pr-2 text-right font-script text-lg text-forest-mid -rotate-2 md:col-span-2 lg:col-span-1">
                Tu aliado en soluciones de embalaje
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
