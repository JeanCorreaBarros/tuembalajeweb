import "server-only";
import { randomBytes } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { DB_PATH, db } from "@/lib/db";

/** Carpeta de las imágenes subidas: junto a la base de datos (en Docker, el volumen /app/data). */
export const UPLOAD_DIR = path.join(path.dirname(DB_PATH), "uploads");

export const MAX_UPLOAD_MB = 15;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_SIDE = 2400;

export type Media = {
  id: number;
  filename: string;
  original_name: string;
  alt: string;
  width: number;
  height: number;
  size: number;
  created_at: number;
  url: string;
};

/** Nombre de archivo válido (evita rutas maliciosas al servirlo). */
export const isMediaFilename = (f: string) => /^[a-z0-9-]+\.webp$/.test(f);

export function listMedia(): Media[] {
  const rows = db.prepare("SELECT * FROM cms_media ORDER BY created_at DESC").all() as Omit<Media, "url">[];
  return rows.map((r) => ({ ...r, url: `/media/${r.filename}` }));
}

/**
 * Guarda una imagen subida: valida tipo y tamaño, corrige la orientación, la reduce a un máximo
 * de 2400 px y la convierte a WebP (pesa mucho menos con la misma calidad).
 */
export async function saveUpload(file: File, userId: number): Promise<Media> {
  if (!ACCEPTED.includes(file.type)) throw new Error("Formato no permitido. Usa JPG, PNG, WebP o AVIF.");
  if (file.size > MAX_UPLOAD_MB * 1024 * 1024) throw new Error(`La imagen pesa más de ${MAX_UPLOAD_MB} MB.`);

  const input = Buffer.from(await file.arrayBuffer());
  let output: { data: Buffer; info: { width: number; height: number } };
  try {
    output = await sharp(input, { failOn: "error" })
      .rotate()
      .resize({ width: MAX_SIDE, height: MAX_SIDE, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer({ resolveWithObject: true });
  } catch {
    throw new Error("No pudimos leer la imagen. Prueba con otro archivo.");
  }

  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  const base = path
    .parse(file.name)
    .name.toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  const filename = `${base || "imagen"}-${Date.now().toString(36)}${randomBytes(3).toString("hex")}.webp`;
  fs.writeFileSync(path.join(UPLOAD_DIR, filename), output.data);

  const info = db
    .prepare(
      "INSERT INTO cms_media (filename, original_name, alt, width, height, size, created_at, uploaded_by) VALUES (?, ?, '', ?, ?, ?, ?, ?)",
    )
    .run(filename, file.name.slice(0, 200), output.info.width, output.info.height, output.data.length, Date.now(), userId);
  return listMedia().find((m) => m.id === Number(info.lastInsertRowid))!;
}

/** Imágenes que vienen con la web (carpeta public/images): se pueden volver a elegir desde el panel. */
export function listSiteImages(): string[] {
  try {
    return fs
      .readdirSync(path.join(process.cwd(), "public", "images"))
      .filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f))
      .sort()
      .map((f) => `/images/${f}`);
  } catch {
    return [];
  }
}

/** Dónde se usa una imagen (contenido de páginas o productos). */
export function mediaUsage(url: string): string[] {
  const like = `%${url}%`;
  const content = db.prepare("SELECT key FROM cms_content WHERE value LIKE ?").all(like) as { key: string }[];
  const products = db.prepare("SELECT slug FROM cms_products WHERE data LIKE ?").all(like) as { slug: string }[];
  return [...content.map((c) => c.key), ...products.map((p) => `producto:${p.slug}`)];
}

/** Elimina una imagen si no se está usando en ninguna parte. */
export function deleteMedia(id: number) {
  const m = db.prepare("SELECT filename FROM cms_media WHERE id = ?").get(id) as { filename: string } | undefined;
  if (!m) return { ok: true as const };
  const used = mediaUsage(`/media/${m.filename}`);
  if (used.length) return { ok: false as const, usedIn: used };
  db.prepare("DELETE FROM cms_media WHERE id = ?").run(id);
  fs.rmSync(path.join(UPLOAD_DIR, m.filename), { force: true });
  return { ok: true as const };
}

export function updateMediaAlt(id: number, alt: string) {
  db.prepare("UPDATE cms_media SET alt = ? WHERE id = ?").run(alt.trim().slice(0, 200), id);
}
