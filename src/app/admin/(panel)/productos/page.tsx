import { ArrowDown, ArrowUp, Copy, ExternalLink, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { connection } from "next/server";
import Link from "next/link";
import { deleteProductAction, duplicateProductAction, moveProductAction } from "@/app/admin/actions";
import { AdminHeader } from "@/components/admin/AdminShell";
import ConfirmButton from "@/components/foro/ConfirmButton";
import { readProducts } from "@/lib/cms/products";
import { PRODUCT_CATEGORIES } from "@/lib/products";

// El panel depende de la sesión en cada pantalla: no se navega «al instante» (lo indica Next en desarrollo).
export const instant = false;

export const metadata = { title: "Productos" };

const iconBtn =
  "flex h-9 w-9 items-center justify-center rounded-lg text-ink/50 transition hover:bg-mist hover:text-forest-dark disabled:pointer-events-none disabled:opacity-30";

export default async function ProductosAdminPage() {
  await connection();
  const products = readProducts();

  return (
    <>
      <AdminHeader
        title="Productos"
        description="El orden de esta lista es el orden del catálogo. Los «Destacados» aparecen en el inicio y en el pie de página."
        actions={
          <Link
            href="/admin/productos/nuevo"
            className="inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2.5 text-[13px] font-bold text-white shadow-lg shadow-brand/25 transition hover:bg-brand-dark"
          >
            <Plus className="h-4 w-4" aria-hidden /> Nuevo producto
          </Link>
        }
      />

      <ul className="space-y-2.5">
        {products.map((p, i) => (
          <li key={p.slug} className="flex flex-wrap items-center gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-black/5 sm:flex-nowrap sm:gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element -- miniatura del panel */}
            <img src={p.image} alt="" className="h-16 w-20 shrink-0 rounded-xl object-cover" />
            <div className="min-w-0 flex-1">
              <Link href={`/admin/productos/${p.slug}`} className="block truncate text-[15px] font-bold text-forest-dark hover:text-brand-dark">
                {p.title}
              </Link>
              <p className="mt-0.5 flex flex-wrap items-center gap-2 text-[12px] text-ink/50">
                <span className="rounded-full bg-mist px-2 py-0.5 font-semibold text-forest">
                  {PRODUCT_CATEGORIES.find((c) => c.slug === p.category)?.label}
                </span>
                {p.featured && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 font-semibold text-amber-700">
                    <Star className="h-3 w-3 fill-current" aria-hidden /> Destacado
                  </span>
                )}
                <span>{p.specs.length} datos en la ficha</span>
              </p>
            </div>
            <div className="flex w-full shrink-0 items-center justify-end gap-0.5 border-t border-black/5 pt-2 sm:w-auto sm:border-0 sm:pt-0">
              <form action={moveProductAction.bind(null, p.slug, -1)}>
                <button className={iconBtn} disabled={i === 0} aria-label="Subir en el orden" title="Subir">
                  <ArrowUp className="h-4 w-4" />
                </button>
              </form>
              <form action={moveProductAction.bind(null, p.slug, 1)}>
                <button className={iconBtn} disabled={i === products.length - 1} aria-label="Bajar en el orden" title="Bajar">
                  <ArrowDown className="h-4 w-4" />
                </button>
              </form>
              <a href={`/productos#${p.slug}`} target="_blank" rel="noopener noreferrer" className={iconBtn} aria-label="Ver en el sitio" title="Ver en el sitio">
                <ExternalLink className="h-4 w-4" />
              </a>
              <form action={duplicateProductAction.bind(null, p.slug)}>
                <button className={iconBtn} aria-label="Duplicar" title="Duplicar">
                  <Copy className="h-4 w-4" />
                </button>
              </form>
              <Link href={`/admin/productos/${p.slug}`} className={iconBtn} aria-label="Editar" title="Editar">
                <Pencil className="h-4 w-4" />
              </Link>
              <form action={deleteProductAction.bind(null, p.slug)}>
                <ConfirmButton
                  message={`¿Eliminar «${p.title}»? Podrás recuperarlo desde el Historial.`}
                  className={`${iconBtn} hover:bg-red-50 hover:text-red-600`}
                >
                  <Trash2 className="h-4 w-4" aria-label="Eliminar" />
                </ConfirmButton>
              </form>
            </div>
          </li>
        ))}
      </ul>
      {products.length === 0 && <p className="rounded-2xl bg-white p-8 text-center text-ink/55">No hay productos. Crea el primero.</p>}
    </>
  );
}
