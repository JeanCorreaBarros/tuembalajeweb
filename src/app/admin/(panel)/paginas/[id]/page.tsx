import { connection } from "next/server";
import { notFound } from "next/navigation";
import PageEditorView from "@/components/admin/PageEditorView";
import { isCmsPage, SPECIAL_PAGES } from "@/lib/cms/pages";

// El panel depende de la sesión en cada pantalla: no se navega «al instante» (lo indica Next en desarrollo).
export const instant = false;

// Título fijo: calcularlo desde la URL bloquearía la precarga de la pantalla (aviso de Next).
export const metadata = { title: "Editar página" };

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;
  if (!isCmsPage(id) || SPECIAL_PAGES.includes(id)) notFound();
  return <PageEditorView pageId={id} help="/admin/ayuda#editar" />;
}
