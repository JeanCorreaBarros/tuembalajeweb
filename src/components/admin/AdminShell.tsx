"use client";

import {
  ExternalLink,
  FileText,
  History,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Settings,
  UserCog,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { adminLogout } from "@/app/admin/actions";

const NAV = [
  { href: "/admin", label: "Escritorio", icon: LayoutDashboard, exact: true },
  { href: "/admin/paginas", label: "Páginas", icon: FileText },
  { href: "/admin/productos", label: "Productos", icon: Package },
  { href: "/admin/medios", label: "Medios", icon: ImageIcon },
  { href: "/admin/ajustes", label: "Ajustes generales", icon: Settings },
  { href: "/admin/historial", label: "Historial", icon: History },
  { href: "/admin/cuenta", label: "Mi cuenta", icon: UserCog },
];

/** Estructura del panel: menú lateral (cajón en celular) + barra superior. */
export default function AdminShell({ user, children }: { user: { name: string; email: string }; children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const active = (href: string, exact?: boolean) => (exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`));

  const nav = (
    <nav aria-label="Menú del panel" className="flex flex-col gap-1">
      {NAV.map(({ href, label, icon: Icon, exact }) => {
        const on = active(href, exact);
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            aria-current={on ? "page" : undefined}
            className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[14px] font-semibold transition ${
              on ? "bg-brand text-white shadow-lg shadow-brand/20" : "text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden /> {label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[260px_minmax(0,1fr)]">
      {/* Menú lateral (escritorio) */}
      <aside className="sticky top-0 hidden h-screen flex-col bg-forest-dark px-4 py-6 lg:flex">
        <Link href="/admin" className="mb-8 flex items-center gap-3 px-2" aria-label="Escritorio del panel">
          <Image src="/logo/tu-embalaje-blanco.svg" alt="Tu Embalaje" width={78} height={50} className="h-[50px] w-auto" unoptimized />
          <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-lime">Panel</span>
        </Link>
        {nav}
        <div className="mt-auto rounded-2xl bg-white/5 p-3.5 text-white">
          <p className="truncate text-[13px] font-bold">{user.name}</p>
          <p className="truncate text-[11px] text-white/55">{user.email}</p>
        </div>
      </aside>

      {/* Menú lateral (celular y tablet) */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menú del panel">
          <button type="button" aria-label="Cerrar menú" className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-[280px] max-w-[85%] flex-col bg-forest-dark px-4 py-5">
            <div className="mb-6 flex items-center justify-between px-2">
              <Image src="/logo/tu-embalaje-blanco.svg" alt="Tu Embalaje" width={70} height={45} className="h-[45px] w-auto" unoptimized />
              <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar menú" className="flex h-10 w-10 items-center justify-center rounded-full text-white hover:bg-white/10">
                <X className="h-5 w-5" />
              </button>
            </div>
            {nav}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-col">
        {/* Barra superior */}
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-black/5 bg-white/90 px-4 py-3 backdrop-blur sm:px-6">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Abrir menú"
            className="-ml-1 flex h-10 w-10 items-center justify-center rounded-full text-forest-dark hover:bg-mist lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <p className="truncate text-[13px] text-ink/55">
            Hola, <b className="text-forest-dark">{user.name.split(" ")[0]}</b>
          </p>
          <div className="ml-auto flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-black/10 px-3.5 py-2 text-[12px] font-bold text-forest-dark transition hover:border-brand hover:text-brand-dark"
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden /> <span className="hidden sm:inline">Ver sitio</span>
            </a>
            <form action={adminLogout}>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[12px] font-bold text-ink/60 transition hover:bg-red-50 hover:text-red-600"
              >
                <LogOut className="h-3.5 w-3.5" aria-hidden /> <span className="hidden sm:inline">Cerrar sesión</span>
              </button>
            </form>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1100px] flex-1 px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}

/** Encabezado estándar de cada pantalla del panel. */
export function AdminHeader({ title, description, actions }: { title: string; description?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-extrabold text-forest-dark sm:text-[28px]">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-[14px] text-ink/60">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
