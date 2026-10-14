"use client";

import { AnimatePresence, m } from "framer-motion";
import { Lock, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Logo from "../ui/Logo";
import { useWhatsappLink } from "@/components/cms/SettingsProvider";
import { WHATSAPP_ASESORIA } from "@/lib/site";
import { WhatsAppIcon } from "../ui/icons";

const links = [
  ["Inicio", "/"],
  ["Productos y Servicios", "/productos"],
  ["Cotizador", "/cotizador"],
  ["Nosotros", "/nosotros"],
  ["Foro", "/foro"],
  ["Contacto", "/contacto"],
] as const;

const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

function NavbarInner({ solid = false }: { solid?: boolean }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const wa = useWhatsappLink();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    // La entrada es CSS (animate-slide-down): el menú se ve con el HTML inicial, sin esperar a JavaScript.
    <header
      className={`fixed inset-x-0 top-0 z-50 animate-slide-down transition-[background-color,padding,box-shadow] duration-300 ${
        solid || scrolled || open ? "bg-forest-dark/95 py-3 shadow-lg backdrop-blur" : "bg-transparent py-5"
      }`}
    >
      <div className="flex items-center justify-between px-5 lg:px-[6%]">
        <Logo size="sm" priority />

        <nav className="hidden items-center gap-4 text-[12px] font-semibold text-white lg:flex xl:gap-7 2xl:gap-9">
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className={`transition-colors hover:text-lime ${isActive(pathname, href) ? "text-lime" : ""}`}
            >
              {label}
            </Link>
          ))}
          {/* Portal de Clientes: todavía no está activo (sin enlace). */}
          <span
            role="link"
            aria-disabled="true"
            title="Próximamente"
            className="inline-flex cursor-not-allowed items-center gap-1.5 whitespace-nowrap text-white/45"
          >
            <Lock className="h-3.5 w-3.5" aria-hidden /> Portal de Clientes
          </span>
        </nav>

        <m.a
          href={wa(WHATSAPP_ASESORIA)}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="hidden items-center gap-2 rounded-full bg-brand px-4 py-2.5 text-[11px] font-bold text-white shadow-lg shadow-brand/30 lg:inline-flex"
        >
          <WhatsAppIcon className="h-4 w-4" />
          Solicita tu asesoría GRATIS
        </m.a>

        <button
          className="-mr-2 flex h-11 w-11 items-center justify-center rounded-full text-white transition hover:bg-white/10 lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <m.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="max-h-[calc(100dvh-85px)] overflow-y-auto lg:hidden"
          >
            <ul className="mx-auto flex max-w-xl flex-col gap-1 px-5 pb-5 pt-3 text-[15px] font-semibold text-white">
              {links.map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    className={`block rounded-lg px-3 py-3 hover:bg-white/10 ${isActive(pathname, href) ? "bg-white/5 text-lime" : ""}`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <span
                  role="link"
                  aria-disabled="true"
                  className="flex cursor-not-allowed items-center justify-between rounded-lg px-3 py-3 text-white/45"
                >
                  <span className="flex items-center gap-2">
                    <Lock className="h-4 w-4" aria-hidden /> Portal de Clientes
                  </span>
                  <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/70">
                    Próximamente
                  </span>
                </span>
              </li>
              <li className="pt-2">
                <a
                  href={wa(WHATSAPP_ASESORIA)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-brand px-4 py-3 text-[13px] font-bold"
                >
                  <WhatsAppIcon className="h-4 w-4" /> Solicita tu asesoría GRATIS
                </a>
              </li>
            </ul>
          </m.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

/** usePathname() es dato de la petición: se envuelve en Suspense para no bloquear rutas dinámicas. */
export default function Navbar({ solid = false }: { solid?: boolean }) {
  return (
    <Suspense
      fallback={
        <header className="fixed inset-x-0 top-0 z-50 bg-forest-dark/95 py-3">
          <div className="px-5 lg:px-[6%]">
            <Logo size="sm" />
          </div>
        </header>
      }
    >
      <NavbarInner solid={solid} />
    </Suspense>
  );
}
