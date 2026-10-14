import { ArrowLeft } from "lucide-react";
import { connection } from "next/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminShell";
import ProductEditor from "@/components/admin/ProductEditor";
import { readProduct } from "@/lib/cms/products";

// El panel depende de la sesión en cada pantalla: no se navega «al instante» (lo indica Next en desarrollo).
export const instant = false;

export const metadata = { title: "Editar producto" };

/** /admin/productos/nuevo crea un producto; cualquier otro valor edita ese producto. */
export default async function EditProductPage({ params }: { params: Promise<{ slug: string }> }) {
  await connection();
  const { slug } = await params;
  const isNew = slug === "nuevo";
  const product = isNew ? undefined : readProduct(slug);
  if (!isNew && !product) notFound();

  return (
    <>
      <Link href="/admin/productos" className="mb-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink/55 hover:text-forest">
        <ArrowLeft className="h-4 w-4" aria-hidden /> Productos
      </Link>
      <AdminHeader title={isNew ? "Nuevo producto" : product!.title} />
      <ProductEditor key={slug} product={product} />
    </>
  );
}
