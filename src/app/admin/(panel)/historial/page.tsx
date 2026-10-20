import { connection } from "next/server";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminShell";
import RestoreButton from "@/components/admin/RestoreButton";
import { db } from "@/lib/db";

// El panel depende de la sesión en cada pantalla: no se navega «al instante» (lo indica Next en desarrollo).
export const instant = false;

export const metadata = { title: "Historial" };

const PAGE = 40;
const fmt = (ts: number) => new Intl.DateTimeFormat("es-CO", { dateStyle: "medium", timeStyle: "short" }).format(new Date(ts));

type Row = { id: number; key: string; label: string; has_value: number; created_at: number; user: string | null };

export default async function HistorialPage({ searchParams }: { searchParams: Promise<{ pagina?: string }> }) {
  await connection();
  const page = Math.max(1, Number.parseInt((await searchParams).pagina ?? "1", 10) || 1);
  const { n } = db.prepare("SELECT COUNT(*) AS n FROM cms_revisions").get() as { n: number };
  const rows = db
    .prepare(
      `SELECT r.id, r.key, r.label, r.value IS NOT NULL AS has_value, r.created_at, u.name AS user
         FROM cms_revisions r LEFT JOIN users u ON u.id = r.user_id
        ORDER BY r.created_at DESC, r.id DESC LIMIT ? OFFSET ?`,
    )
    .all(PAGE, (page - 1) * PAGE) as Row[];
  const pages = Math.max(1, Math.ceil(n / PAGE));
  // La versión más reciente de cada sección/producto es la que está publicada.
  const latest = new Set(
    (db.prepare("SELECT MAX(id) AS id FROM cms_revisions GROUP BY key").all() as { id: number }[]).map((r) => r.id),
  );

  return (
    <>
      <AdminHeader
        title="Historial"
        help="/admin/ayuda#historial"
        description="Cada vez que publicas, se guarda una copia. Puedes restaurar cualquier versión anterior con un clic."
      />
      {rows.length === 0 ? (
        <p className="rounded-2xl bg-white p-8 text-center text-[14px] text-ink/55">Todavía no hay cambios registrados.</p>
      ) : (
        <ol className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5">
          {rows.map((r) => (
            <li key={r.id} className="flex flex-wrap items-center gap-3 border-b border-black/5 px-4 py-3.5 last:border-0 sm:flex-nowrap sm:px-5">
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-semibold text-forest-dark">{r.label}</p>
                <p className="text-[12px] text-ink/50">
                  {fmt(r.created_at)}
                  {r.user && ` · ${r.user}`}
                </p>
              </div>
              {latest.has(r.id) ? (
                <span className="rounded-full bg-brand/10 px-3 py-1 text-[11px] font-bold text-brand-dark">Publicada</span>
              ) : r.has_value ? (
                <RestoreButton id={r.id} label={r.label} />
              ) : null}
            </li>
          ))}
        </ol>
      )}
      {pages > 1 && (
        <nav aria-label="Páginas del historial" className="mt-6 flex flex-wrap justify-center gap-2">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/historial?pagina=${p}`}
              aria-current={p === page ? "page" : undefined}
              className={`flex h-10 w-10 items-center justify-center rounded-full text-[13px] font-bold ${p === page ? "bg-forest text-white" : "bg-white text-ink/60 shadow-sm"}`}
            >
              {p}
            </Link>
          ))}
        </nav>
      )}
    </>
  );
}
