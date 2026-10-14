import { FileText, History, Image as ImageIcon, Package, Settings, type LucideIcon } from "lucide-react";
import { connection } from "next/server";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminShell";
import { getCurrentUser } from "@/lib/auth";
import { CMS_PAGES } from "@/lib/cms/pages";
import { readProducts } from "@/lib/cms/products";
import { db } from "@/lib/db";

// El panel depende de la sesión en cada pantalla: no se navega «al instante» (lo indica Next en desarrollo).
export const instant = false;

export const metadata = { title: "Escritorio" };

const fmt = (ts: number) => new Intl.DateTimeFormat("es-CO", { dateStyle: "medium", timeStyle: "short" }).format(new Date(ts));

function Card({ href, icon: Icon, title, value, text }: { href: string; icon: LucideIcon; title: string; value: string; text: string }) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md hover:ring-brand/30"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-forest text-white shadow-md shadow-forest/20">
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <span className="mt-4 text-[28px] font-extrabold leading-none text-forest-dark">{value}</span>
      <span className="mt-1 text-[14px] font-bold text-forest-dark">{title}</span>
      <span className="mt-0.5 text-[12px] text-ink/50">{text}</span>
    </Link>
  );
}

export default async function Escritorio() {
  await connection();
  const user = await getCurrentUser();
  const products = readProducts();
  const media = (db.prepare("SELECT COUNT(*) AS n FROM cms_media").get() as { n: number }).n;
  const edited = (db.prepare("SELECT COUNT(*) AS n FROM cms_content").get() as { n: number }).n;
  const recent = db
    .prepare(
      `SELECT r.label, r.created_at, u.name AS user FROM cms_revisions r LEFT JOIN users u ON u.id = r.user_id
        ORDER BY r.created_at DESC, r.id DESC LIMIT 6`,
    )
    .all() as { label: string; created_at: number; user: string | null }[];
  const pageCount = Object.keys(CMS_PAGES).length - 1;

  return (
    <>
      <AdminHeader
        title={`¡Hola, ${user?.name.split(" ")[0] ?? ""}!`}
        description="Desde aquí editas los textos, imágenes y productos de la web. Los cambios se publican al guardar."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card href="/admin/paginas" icon={FileText} title="Páginas" value={String(pageCount)} text={`${edited} secciones editadas`} />
        <Card
          href="/admin/productos"
          icon={Package}
          title="Productos"
          value={String(products.length)}
          text={`${products.filter((p) => p.featured).length} destacados`}
        />
        <Card href="/admin/medios" icon={ImageIcon} title="Imágenes subidas" value={String(media)} text="Biblioteca de medios" />
        <Card href="/admin/ajustes" icon={Settings} title="Ajustes" value="⚙" text="Contacto, WhatsApp y SEO" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-[16px] font-extrabold text-forest-dark">
              <History className="h-4 w-4 text-brand" aria-hidden /> Últimos cambios
            </h2>
            <Link href="/admin/historial" className="text-[12px] font-bold text-brand-dark hover:underline">
              Ver todo
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="mt-4 text-[13px] text-ink/50">Todavía no has publicado cambios. La web muestra los textos originales.</p>
          ) : (
            <ul className="mt-3 divide-y divide-black/5">
              {recent.map((r, i) => (
                <li key={i} className="py-2.5">
                  <p className="text-[13px] font-semibold text-forest-dark">{r.label}</p>
                  <p className="text-[11px] text-ink/45">
                    {fmt(r.created_at)}
                    {r.user && ` · ${r.user}`}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-3xl bg-forest-dark p-5 text-white shadow-sm sm:p-6">
          <h2 className="text-[16px] font-extrabold">Accesos rápidos</h2>
          <ul className="mt-3 space-y-1.5 text-[13px]">
            {(
              [
                ["/admin/paginas/inicio#hero", "Encabezado del inicio"],
                ["/admin/paginas/inicio#testimonios", "Testimonios"],
                ["/admin/paginas/cotizador#precios", "Precios del cotizador"],
                ["/admin/ajustes#contacto", "WhatsApp y teléfonos"],
                ["/admin/productos/nuevo", "Crear un producto"],
              ] as const
            ).map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="block rounded-lg px-3 py-2 text-white/80 transition hover:bg-white/10 hover:text-lime">
                  {label} →
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
