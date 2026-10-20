import { CheckCircle2, ChevronRight, MessagesSquare, Search, ShieldCheck, UserPlus, Users, UserX } from "lucide-react";
import { connection } from "next/server";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminShell";
import { Avatar } from "@/components/admin/users/ui";
import { getCurrentUser } from "@/lib/auth";
import { listUsers, userStats, type UserFilter } from "@/lib/cms/users";

// El panel depende de la sesión en cada pantalla: no se navega «al instante» (lo indica Next en desarrollo).
export const instant = false;

export const metadata = { title: "Usuarios" };

const ago = (ts: number | null) => {
  if (!ts) return "Nunca";
  const d = Math.floor((Date.now() - ts) / 86_400_000);
  if (d < 1) return "Hoy";
  if (d === 1) return "Ayer";
  if (d < 30) return `Hace ${d} días`;
  return new Intl.DateTimeFormat("es-CO", { dateStyle: "medium" }).format(new Date(ts));
};

const FILTERS: { id: UserFilter; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "admin", label: "Administradores" },
  { id: "user", label: "Miembros del foro" },
  { id: "suspendidos", label: "Suspendidos" },
];

export default async function UsuariosPage({ searchParams }: { searchParams: Promise<{ q?: string; rol?: string; eliminado?: string }> }) {
  await connection();
  const sp = await searchParams;
  const q = (sp.q ?? "").trim().slice(0, 80);
  const filter = (FILTERS.some((f) => f.id === sp.rol) ? sp.rol : "todos") as UserFilter;
  const me = await getCurrentUser();
  const users = listUsers(q, filter);
  const stats = userStats();
  const link = (rol: UserFilter) => `/admin/usuarios?${new URLSearchParams({ ...(q ? { q } : {}), ...(rol !== "todos" ? { rol } : {}) })}`;

  const cards = [
    { label: "Usuarios", value: stats.total, icon: Users, cls: "bg-forest-dark text-white", iconCls: "bg-white/10 text-lime", sub: "text-white/60" },
    { label: "Administradores", value: stats.admins ?? 0, icon: ShieldCheck, cls: "bg-white", iconCls: "bg-brand/10 text-brand", sub: "text-ink/50" },
    { label: "Miembros del foro", value: stats.members ?? 0, icon: MessagesSquare, cls: "bg-white", iconCls: "bg-sky-50 text-sky-600", sub: "text-ink/50" },
    { label: "Suspendidos", value: stats.suspended ?? 0, icon: UserX, cls: "bg-white", iconCls: "bg-red-50 text-red-500", sub: "text-ink/50" },
  ];

  return (
    <>
      <AdminHeader
        title="Usuarios"
        description="Administradores del panel y miembros del foro: crea cuentas, edita sus datos, cambia su rol o suspéndelas."
        help="/admin/ayuda#usuarios"
        actions={
          <Link
            href="/admin/usuarios/nuevo"
            className="inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2.5 text-[13px] font-bold text-white shadow-lg shadow-brand/25 transition hover:bg-brand-dark"
          >
            <UserPlus className="h-4 w-4" aria-hidden /> Nuevo usuario
          </Link>
        }
      />

      {sp.eliminado && (
        <p role="status" className="mb-5 flex items-center gap-2 rounded-2xl bg-brand/10 px-4 py-3 text-[13px] font-semibold text-brand-dark">
          <CheckCircle2 className="h-4 w-4" /> Usuario eliminado.
        </p>
      )}

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, cls, iconCls, sub }) => (
          <div key={label} className={`flex items-center gap-3 rounded-2xl p-4 shadow-sm ring-1 ring-black/5 ${cls}`}>
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconCls}`}>
              <Icon className="h-5 w-5" aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="block text-[22px] font-extrabold leading-none tabular-nums">{value}</span>
              <span className={`mt-1 block truncate text-[12px] ${sub}`}>{label}</span>
            </span>
          </div>
        ))}
      </div>

      {/* Filtros y buscador */}
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <nav aria-label="Filtrar usuarios" className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          {FILTERS.map((f) => (
            <Link
              key={f.id}
              href={link(f.id)}
              aria-current={filter === f.id ? "page" : undefined}
              className={`shrink-0 rounded-full px-3.5 py-2 text-[12px] font-bold transition ${
                filter === f.id ? "bg-forest-dark text-white" : "bg-white text-ink/60 ring-1 ring-black/5 hover:text-forest-dark"
              }`}
            >
              {f.label}
            </Link>
          ))}
        </nav>
        <form action="/admin/usuarios" className="relative w-full lg:w-80">
          {filter !== "todos" && <input type="hidden" name="rol" value={filter} />}
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" aria-hidden />
          <input
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Buscar por nombre, correo, teléfono…"
            aria-label="Buscar usuarios"
            className="w-full rounded-full border border-black/10 bg-white py-2.5 pl-10 pr-4 text-base outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/15 sm:text-[13px]"
          />
        </form>
      </div>

      {/* Lista */}
      <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5">
        <div className="hidden grid-cols-[minmax(0,2.2fr)_150px_120px_130px_28px] gap-4 border-b border-black/5 bg-mist/60 px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-ink/45 md:grid">
          <span>Usuario</span>
          <span>Rol</span>
          <span>Foro</span>
          <span>Último ingreso</span>
          <span />
        </div>
        {users.length === 0 ? (
          <p className="px-5 py-12 text-center text-[14px] text-ink/50">
            {q ? `No hay usuarios que coincidan con «${q}».` : "No hay usuarios en este filtro."}
          </p>
        ) : (
          <ul className="divide-y divide-black/5">
            {users.map((u) => (
              <li key={u.id}>
                <Link
                  href={`/admin/usuarios/${u.id}`}
                  className={`group grid grid-cols-[minmax(0,1fr)_20px] items-center gap-x-4 gap-y-2 px-5 py-3.5 transition hover:bg-mist/50 md:grid-cols-[minmax(0,2.2fr)_150px_120px_130px_28px] ${
                    u.disabled ? "opacity-60" : ""
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <Avatar name={u.name} />
                    <span className="min-w-0">
                      <span className="flex items-center gap-2">
                        <span className="truncate text-[14px] font-bold text-forest-dark">{u.name}</span>
                        {u.id === me?.id && <span className="shrink-0 rounded-full bg-lime/30 px-2 py-0.5 text-[10px] font-bold text-forest-dark">Tú</span>}
                        {u.disabled ? (
                          <span className="shrink-0 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600">Suspendido</span>
                        ) : null}
                      </span>
                      <span className="block truncate text-[12px] text-ink/50">
                        {u.email}
                        {u.job_title && ` · ${u.job_title}`}
                      </span>
                    </span>
                  </span>
                  <ChevronRight className="h-4 w-4 text-ink/25 transition group-hover:translate-x-0.5 group-hover:text-brand md:hidden" aria-hidden />
                  <span className="col-span-2 flex flex-wrap items-center gap-x-3 gap-y-1 pl-14 text-[12px] text-ink/50 md:col-span-1 md:pl-0">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                        u.role === "admin" ? "bg-brand/10 text-brand-dark" : "bg-sky-50 text-sky-700"
                      }`}
                    >
                      {u.role === "admin" ? <ShieldCheck className="h-3 w-3" aria-hidden /> : <MessagesSquare className="h-3 w-3" aria-hidden />}
                      {u.role === "admin" ? "Administrador" : "Miembro"}
                    </span>
                    <span className="md:hidden">
                      {u.questions} preguntas · {u.answers} respuestas · {ago(u.last_login)}
                    </span>
                  </span>
                  <span className="hidden text-[12px] text-ink/60 md:block">
                    {u.questions} preg. · {u.answers} resp.
                  </span>
                  <span className="hidden text-[12px] text-ink/60 md:block">{ago(u.last_login)}</span>
                  <ChevronRight className="hidden h-4 w-4 text-ink/25 transition group-hover:translate-x-0.5 group-hover:text-brand md:block" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      <p className="mt-3 text-[12px] text-ink/45">
        {users.length} {users.length === 1 ? "usuario" : "usuarios"}
        {q || filter !== "todos" ? " en esta búsqueda" : ""}.
      </p>
    </>
  );
}
