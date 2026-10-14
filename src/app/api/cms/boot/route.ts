import { revalidateTag } from "next/cache";
import { CMS_TAG } from "@/lib/cms/store";
import { PRODUCTS_TAG } from "@/lib/cms/products";

/**
 * Lo llama scripts/start.mjs al arrancar el servidor (no es público: exige un token que solo
 * conoce ese proceso). Las páginas se compilan sin acceso a la base de datos del volumen; esto
 * descarta esa versión para que la primera visita muestre el contenido guardado en el panel.
 */
export async function POST(req: Request) {
  const token = process.env.CMS_BOOT_TOKEN;
  if (!token || req.headers.get("x-boot-token") !== token) return new Response(null, { status: 404 });
  revalidateTag(CMS_TAG, { expire: 0 });
  revalidateTag(PRODUCTS_TAG, { expire: 0 });
  return Response.json({ ok: true });
}
