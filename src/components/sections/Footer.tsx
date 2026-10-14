import { ArrowUpRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Fragment } from "react";
import { getProducts } from "@/lib/cms/products";
import { getSettings } from "@/lib/cms/settings";
import Logo from "../ui/Logo";
import { InstagramIcon, WhatsAppIcon } from "../ui/icons";

const NAV = [
  { label: "Inicio", href: "/" },
  { label: "Productos y servicios", href: "/productos" },
  { label: "Cotizador", href: "/cotizador" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Foro", href: "/foro" },
  { label: "Contacto", href: "/contacto" },
];

function Title({ children }: { children: ReactNode }) {
  return (
    <h3 className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.18em] text-white">
      <span className="h-[3px] w-5 rounded bg-brand" /> {children}
    </h3>
  );
}

const linkCls = "group inline-flex items-center gap-1.5 py-1 text-[13px] text-white/65 transition-colors hover:text-lime";

function ContactRow({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-lime ring-1 ring-white/10 [&>svg]:h-4 [&>svg]:w-4">
        {icon}
      </span>
      <div className="flex min-w-0 flex-col text-[13px] text-white/75">{children}</div>
    </li>
  );
}

/** Pie de página: datos y textos editables en /admin (Ajustes generales) y productos destacados. */
export default async function Footer() {
  const [settings, products] = await Promise.all([getSettings(), getProducts()]);
  const featured = products.filter((p) => p.featured);
  const tagline = settings.footer.tagline.split("·").map((t) => t.trim()).filter(Boolean);
  return (
    <footer className="relative overflow-hidden bg-[#041b12] text-white">
      {/* Línea de acento y brillo sutil */}
      <div className="h-1 w-full bg-gradient-to-r from-brand via-lime to-brand" />
      <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-brand/10 blur-3xl" />

      {/* Celular: marca y contacto a lo ancho; navegación y productos lado a lado. */}
      <div className="relative mx-auto grid max-w-[1240px] grid-cols-2 gap-x-6 gap-y-10 px-5 py-12 sm:px-8 sm:py-14 lg:grid-cols-[1.3fr_0.8fr_0.9fr_1.3fr] lg:gap-12 lg:px-8">
        {/* Marca */}
        <div className="col-span-2 sm:col-span-1">
          <Logo />
          <p className="mt-5 max-w-xs text-[13px] leading-relaxed text-white/60">
            {settings.footer.description}
          </p>
          <p className="mt-4 flex flex-wrap items-center gap-x-2 text-[12px] font-semibold text-white/80">
            {tagline.map((t, i) => (
              <Fragment key={i}>
                {i > 0 && <span className="text-brand">•</span>}
                {t}
              </Fragment>
            ))}
          </p>
          <a
            href={settings.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2.5 rounded-full bg-white/5 py-2 pl-2 pr-4 text-[13px] font-semibold ring-1 ring-white/10 transition hover:bg-white/10 hover:ring-lime/40"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af]">
              <InstagramIcon className="h-4 w-4 text-white" />
            </span>
            {settings.instagram.handle}
          </a>
        </div>

        {/* Navegación */}
        <nav aria-label="Navegación del pie de página">
          <Title>Navegación</Title>
          <ul className="mt-4 space-y-1">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className={linkCls}>
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Productos */}
        <div>
          <Title>Productos</Title>
          <ul className="mt-4 space-y-1">
            {featured.map((p) => (
              <li key={p.slug}>
                <Link href={`/productos#${p.slug}`} className={linkCls}>
                  {p.title}
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contacto */}
        <div className="col-span-2 sm:col-span-1">
          <Title>Contacto</Title>
          <ul className="mt-5 space-y-4">
            <ContactRow icon={<Phone />}>
              {settings.phones.map((p) => (
                <a key={p.tel} href={`tel:${p.tel}`} className="py-0.5 transition-colors hover:text-lime">
                  {p.display}
                </a>
              ))}
            </ContactRow>
            <ContactRow icon={<Mail />}>
              {settings.emails.map((e) => (
                <a key={e} href={`mailto:${e}`} className="truncate py-0.5 transition-colors hover:text-lime">
                  {e}
                </a>
              ))}
            </ContactRow>
            <ContactRow icon={<MapPin />}>
              <span>{settings.location}</span>
            </ContactRow>
            <ContactRow icon={<Clock />}>
              <span>{settings.schedule}</span>
            </ContactRow>
          </ul>
          <a
            href={`https://wa.me/${settings.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-[13px] font-bold text-white shadow-lg shadow-brand/20 transition hover:-translate-y-0.5 hover:bg-brand-dark"
          >
            <WhatsAppIcon className="h-4 w-4" /> Escríbenos por WhatsApp
          </a>
        </div>
      </div>

      {/* Barra inferior */}
      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-[1240px] flex-col items-center justify-between gap-2 px-5 py-5 text-center text-[12px] text-white/50 sm:px-8 lg:flex-row lg:px-8 lg:text-left">
          <span>Copyright © 2026 Tu Embalaje SAS. Todos los derechos reservados.</span>
          <nav aria-label="Documentos legales" className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <Link href="/politica-de-privacidad" className="inline-block py-1.5 transition-colors hover:text-lime">
              Política de privacidad
            </Link>
            <span aria-hidden className="text-white/20">
              |
            </span>
            <Link href="/terminos-y-condiciones" className="inline-block py-1.5 transition-colors hover:text-lime">
              Términos y condiciones
            </Link>
          </nav>
          <span>
            Made by{" "}
            <a
              href="https://www.bi-voo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-purple-500 transition-colors hover:text-purple-400"
            >
              Bi-voo
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
