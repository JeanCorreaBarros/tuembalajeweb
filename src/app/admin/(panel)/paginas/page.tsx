import { ChevronRight, FileText } from "lucide-react";
import { connection } from "next/server";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminShell";
import { CMS_PAGES, type CmsPageId } from "@/lib/cms/pages";
import { sectionUpdates } from "@/lib/cms/store";

// El panel depende de la sesión en cada pantalla: no se navega «al instante» (lo indica Next en desarrollo).
export const instant = false;

export const metadata = { title: "Páginas" };

const fmt = (ts: number) => new Intl.DateTimeFormat("es-CO", { dateStyle: "medium" }).format(new Date(ts));

export default async function PaginasPage() {
  await connection();
  const pages = (Object.keys(CMS_PAGES) as CmsPageId[]).filter((id) => id !== "ajustes");

  return (
    <>
      <AdminHeader title="Páginas" description="Elige una página para editar sus textos e imágenes. Los cambios se publican al guardar." />
      <ul className="grid gap-3 sm:grid-cols-2">
        {pages.map((id) => {
          const p = CMS_PAGES[id];
          const upd = Object.values(sectionUpdates(id));
          const last = upd.length ? Math.max(...upd.map((u) => u.at)) : null;
          const count = Object.keys(p.sections).length;
          return (
            <li key={id}>
              <Link
                href={`/admin/paginas/${id}`}
                className="group flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md hover:ring-brand/30"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <FileText className="h-5 w-5" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-bold text-forest-dark">{p.title}</span>
                  <span className="block text-[12px] text-ink/50">
                    {count} {count === 1 ? "sección" : "secciones"} · {last ? `editada el ${fmt(last)}` : "textos originales"}
                  </span>
                </span>
                <ChevronRight className="h-5 w-5 text-ink/30 transition group-hover:translate-x-0.5 group-hover:text-brand" aria-hidden />
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
