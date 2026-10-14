import fs from "node:fs/promises";
import path from "node:path";
import { isMediaFilename, UPLOAD_DIR } from "@/lib/cms/media";

/**
 * Sirve las imágenes subidas desde el panel (guardadas en el volumen de datos, fuera de /public).
 * Cada archivo tiene un nombre único que nunca se reutiliza, así que se puede guardar en caché un año.
 */
export async function GET(_req: Request, ctx: RouteContext<"/media/[file]">) {
  const { file } = await ctx.params;
  if (!isMediaFilename(file)) return new Response("No encontrado", { status: 404 });
  try {
    const data = await fs.readFile(path.join(UPLOAD_DIR, file));
    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("No encontrado", { status: 404 });
  }
}
