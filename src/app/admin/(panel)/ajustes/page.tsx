import { connection } from "next/server";
import PageEditorView from "@/components/admin/PageEditorView";

// El panel depende de la sesión en cada pantalla: no se navega «al instante» (lo indica Next en desarrollo).
export const instant = false;

export const metadata = { title: "Ajustes generales" };

export default async function AjustesPage() {
  await connection();
  return <PageEditorView pageId="ajustes" />;
}
