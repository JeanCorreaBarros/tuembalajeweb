import type { Metadata } from "next";
import { ArrowRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import { Suspense } from "react";
import ContactForm from "@/components/sections/ContactForm";
import ContactHero from "@/components/sections/ContactHero";
import Footer from "@/components/sections/Footer";
import Navbar from "@/components/sections/Navbar";
import Reveal from "@/components/ui/Reveal";
import Watermark from "@/components/ui/Watermark";
import { WhatsAppIcon } from "@/components/ui/icons";
import JsonLd from "@/components/seo/JsonLd";
import { iconFor } from "@/lib/cms/icons";
import { getProducts } from "@/lib/cms/products";
import { getSettings } from "@/lib/cms/settings";
import { getPageContent } from "@/lib/cms/store";
import { seoMetadata } from "@/lib/cms/seo";
import { breadcrumbs } from "@/lib/seo";

export function generateMetadata(): Promise<Metadata> {
  return seoMetadata("contacto");
}

/** Contacto: textos en /admin (Páginas · Contacto); teléfonos, correos y horario en Ajustes generales. */
export default async function ContactoPage() {
  const [c, settings, products] = await Promise.all([getPageContent("contacto"), getSettings(), getProducts()]);
  const t = c.tarjetas;
  const info = [
    { icon: Phone, label: "Teléfono", value: settings.phoneDisplay, sub: t.phoneSub, href: `tel:${settings.phoneTel}` },
    { icon: Mail, label: "Correo", value: settings.email, sub: t.emailSub, href: `mailto:${settings.email}` },
    { icon: MapPin, label: "Ubicación", value: settings.location, sub: t.locationSub },
    { icon: Clock, label: "Horario", value: settings.schedule, sub: t.scheduleSub },
  ].filter((x) => x.value);

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
        <ContactHero c={c.encabezado} />

        <section className="relative isolate overflow-hidden bg-mist/60 py-12 lg:py-14">
          <Watermark
            tone="mist"
            items={[
              { symbol: "recycle", className: "-left-24 top-8 w-[280px] -rotate-12 md:-left-36 md:w-[480px]" },
              { symbol: "leaf", className: "-right-24 bottom-6 w-[260px] rotate-12 md:-right-32 md:w-[420px]" },
            ]}
          />
          <div className="pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-brand/10 blur-2xl" />
          <div className="pointer-events-none absolute -right-24 top-1/2 h-72 w-72 rounded-full bg-lime/10 blur-2xl" />

          <div className="relative mx-auto grid max-w-[1240px] grid-cols-1 gap-6 px-5 sm:px-8 lg:grid-cols-[1.35fr_1fr] lg:px-8">
            <div className="min-w-0">
              <Reveal x={-30} y={0}>
                <Suspense fallback={<div className="h-[520px] rounded-2xl bg-white shadow-xl" />}>
                  <ContactForm c={c.formulario} products={products.map(({ slug, title }) => ({ slug, title }))} />
                </Suspense>
              </Reveal>
              {t.trust.length > 0 && (
                <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3 pl-2 sm:gap-x-8">
                  {t.trust.map(({ icon, label }, i) => {
                    const Icon = iconFor(icon);
                    return (
                      <li key={i} className="flex items-center gap-2 text-[11px] font-medium text-ink/60">
                        <Icon className="h-5 w-5 text-forest" strokeWidth={1.4} /> {label}
                      </li>
                    );
                  })}
                </ul>
              )}
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
                  href={`https://wa.me/${settings.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-2xl bg-gradient-to-r from-forest-dark to-forest-mid p-4 text-white shadow-lg transition hover:-translate-y-0.5"
                >
                  <WhatsAppIcon className="h-9 w-9 text-lime" />
                  <span className="h-9 w-px bg-white/20" />
                  <span className="flex-1">
                    <span className="block text-[13px] font-bold">{t.whatsappTitle}</span>
                    <span className="block text-[11px] text-white/70">{t.whatsappSub}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </a>
              </Reveal>

              {t.script && (
                <p className="pr-2 text-right font-script text-lg text-forest-mid -rotate-2 md:col-span-2 lg:col-span-1">
                  {t.script}
                </p>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
