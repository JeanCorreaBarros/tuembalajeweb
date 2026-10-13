import { connection } from "next/server";
import { ChevronRight, LogIn, LogOut, UserPlus } from "lucide-react";
import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { logout } from "@/app/foro/actions";
import { getCurrentUser } from "@/lib/auth";
import Avatar from "./Avatar";

type Crumb = { label: string; href?: string };

/** Fila superior del hero del foro: ruta a la izquierda y sesión del usuario a la derecha. */
export default function ForumBar({ crumbs = [] }: { crumbs?: Crumb[] }) {
  const all: Crumb[] = [{ label: "Inicio", href: "/" }, { label: "Foro", href: "/foro" }, ...crumbs];

  return (
    <div className="mx-auto flex min-h-[56px] max-w-[1240px] flex-wrap items-center justify-between gap-3 px-5 py-2.5 text-[12px] sm:px-8">
      <nav aria-label="Ruta" className="flex min-w-0 items-center gap-1.5 font-medium text-white/60">
        {all.map((c, i) => {
          const last = i === all.length - 1;
          return (
            <span key={`${c.label}-${i}`} className="flex min-w-0 items-center gap-1.5">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0 text-white/30" />}
              {c.href && !last ? (
                <Link href={c.href} className="transition hover:text-lime">
                  {c.label}
                </Link>
              ) : (
                <span className="truncate font-semibold text-white">{c.label}</span>
              )}
            </span>
          );
        })}
      </nav>

      <Suspense fallback={<div className="h-9 w-48 animate-pulse rounded-full bg-white/10" />}>
        <Session />
      </Suspense>
    </div>
  );
}

function Pill({ children, href, solid }: { children: ReactNode; href: string; solid?: boolean }) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-bold transition ${
        solid ? "bg-brand text-white hover:bg-brand-dark" : "border border-white/25 text-white hover:border-lime hover:text-lime"
      }`}
    >
      {children}
    </Link>
  );
}

/** Lee la cookie de sesión: por eso va dentro de <Suspense>. */
async function Session() {
  await connection();
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Pill href="/foro/ingresar">
          <LogIn className="h-3.5 w-3.5" /> Ingresar
        </Pill>
        <Pill href="/foro/registro" solid>
          <UserPlus className="h-3.5 w-3.5" /> Crear cuenta
        </Pill>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-full bg-white/10 py-1 pl-1 pr-1.5 backdrop-blur">
      <Avatar name={user.name} role={user.role} size="sm" />
      <span className="leading-tight">
        <span className="block font-bold text-white">{user.name}</span>
        <span className="block text-[10px] text-white/60">{user.role === "admin" ? "Administrador" : "Miembro"}</span>
      </span>
      <form action={logout}>
        <button
          aria-label="Cerrar sesión"
          title="Cerrar sesión"
          className="ml-1 flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition hover:bg-white/15 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
