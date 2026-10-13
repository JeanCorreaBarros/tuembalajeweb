import { LogIn, LogOut, ShieldCheck, UserPlus } from "lucide-react";
import Link from "next/link";
import { logout } from "@/app/foro/actions";
import { getCurrentUser } from "@/lib/auth";

/** Barra con el estado de la sesión. Lee cookies: úsala siempre dentro de <Suspense>. */
export default async function ForumBar() {
  const user = await getCurrentUser();

  return (
    <div className="border-b border-black/5 bg-white">
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-3 px-5 py-3 text-[12px] lg:px-8">
        <nav aria-label="Ruta" className="flex items-center gap-2 font-semibold text-ink/60">
          <Link href="/" className="hover:text-brand">Inicio</Link>
          <span>/</span>
          <Link href="/foro" className="text-forest-dark hover:text-brand">Foro</Link>
        </nav>

        {user ? (
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-semibold text-forest-dark">
              {user.role === "admin" && <ShieldCheck className="h-4 w-4 text-brand" />}
              Hola, {user.name}
            </span>
            <form action={logout}>
              <button className="inline-flex items-center gap-1.5 rounded-full border border-black/10 px-3 py-1.5 font-semibold text-ink/70 transition hover:border-brand hover:text-brand">
                <LogOut className="h-3.5 w-3.5" /> Salir
              </button>
            </form>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/foro/ingresar"
              className="inline-flex items-center gap-1.5 rounded-full border border-black/10 px-3 py-1.5 font-semibold text-forest-dark transition hover:border-brand hover:text-brand"
            >
              <LogIn className="h-3.5 w-3.5" /> Ingresar
            </Link>
            <Link
              href="/foro/registro"
              className="inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1.5 font-bold text-white transition hover:bg-brand-dark"
            >
              <UserPlus className="h-3.5 w-3.5" /> Crear cuenta
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
