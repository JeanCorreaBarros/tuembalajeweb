"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Logo from "../ui/Logo";
import { WhatsAppIcon } from "../ui/icons";

const links = [
  ["Inicio", "/"],
  ["Productos y Servicios", "/productos"],
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid || scrolled || open ? "bg-forest-dark/95 py-3 shadow-lg backdrop-blur" : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-[1240px] items-center justify-between px-5 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-9 text-[12px] font-semibold text-white lg:flex">
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className={`transition-colors hover:text-lime ${isActive(pathname, href) ? "text-lime" : ""}`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <motion.a
          href="/contacto"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="hidden items-center gap-2 rounded-full bg-brand px-4 py-2.5 text-[11px] font-bold text-white shadow-lg shadow-brand/30 lg:inline-flex"
        >
          <WhatsAppIcon className="h-4 w-4" />
          Solicita tu asesoría GRATIS
        </motion.a>

        <button
          className="text-white lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden lg:hidden"
          >
            <ul className="flex flex-col gap-1 px-5 pb-5 pt-3 text-sm font-semibold text-white">
              {links.map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    className={`block rounded-lg px-3 py-2.5 hover:bg-white/10 ${isActive(pathname, href) ? "text-lime" : ""}`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <a
                  href="/contacto"
                  className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2.5 text-xs font-bold"
                >
                  <WhatsAppIcon className="h-4 w-4" /> Solicita tu asesoría GRATIS
                </a>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

/** usePathname() es dato de la petición: se envuelve en Suspense para no bloquear rutas dinámicas. */
export default function Navbar({ solid = false }: { solid?: boolean }) {
  return (
    <Suspense
      fallback={
        <header className="fixed inset-x-0 top-0 z-50 bg-forest-dark/95 py-3">
          <div className="mx-auto max-w-[1240px] px-5 lg:px-8">
            <Logo />
          </div>
        </header>
      }
    >
      <NavbarInner solid={solid} />
    </Suspense>
  );
}
