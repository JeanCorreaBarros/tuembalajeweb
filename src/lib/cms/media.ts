import "server-only";
import { randomBytes } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { DB_PATH, db } from "@/lib/db";
import { CMS_PAGES, type CmsPageId } from "./pages";
import { readProducts, saveProduct } from "./products";
import { isImagePath, readPageContent, saveSection } from "./store";

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

const hiddenSet = () => new Set((db.prepare("SELECT url FROM cms_hidden_media").all() as { url: string }[]).map((r) => r.url));

/** Imágenes que vienen con la web (carpeta public/images). Por defecto, sin las que se ocultaron en Medios. */
export function listSiteImages({ includeHidden = false } = {}): string[] {
  try {
    const hidden = includeHidden ? new Set<string>() : hiddenSet();
    return fs
      .readdirSync(path.join(process.cwd(), "public", "images"))
      .filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f))
      .sort()
      .map((f) => `/images/${f}`)
      .filter((url) => !hidden.has(url));
  } catch {
    return [];
  }
}

/** Una imagen que existe (subida o de la web), para poder usarla como reemplazo. */
function imageExists(url: string) {
  if (url.startsWith("/media/")) return !!db.prepare("SELECT 1 FROM cms_media WHERE filename = ?").get(url.slice(7));
  return listSiteImages({ includeHidden: true }).includes(url);
}

/** Cambia una valor por otro en todo un objeto (textos, listas y objetos anidados). */
function swapDeep(v: unknown, from: string, to: string): unknown {
  if (typeof v === "string") return v === from ? to : v;
  if (Array.isArray(v)) return v.map((x) => swapDeep(x, from, to));
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, swapDeep(x, from, to)]));
  return v;
}

/**
 * Reemplaza una imagen por otra en todas las secciones y productos que la usan. Cada cambio se guarda
 * como una versión nueva (se puede deshacer desde el Historial). Devuelve en cuántos lugares cambió.
 */
export function replaceImage(from: string, to: string, userId: number) {
  if (!isImagePath(from) || !isImagePath(to) || from === to) throw new Error("Elige una imagen distinta.");
  if (!imageExists(to)) throw new Error("La imagen nueva no existe.");
  let changed = 0;
  for (const id of Object.keys(CMS_PAGES) as CmsPageId[]) {
    const values = readPageContent(id) as Record<string, unknown>;
    for (const sid of Object.keys(CMS_PAGES[id].sections)) {
      if (!imagesIn(values[sid]).includes(from)) continue;
      saveSection(id, sid, swapDeep(values[sid], from, to), userId);
      changed++;
    }
  }
  for (const p of readProducts()) {
    if (!imagesIn(p).includes(from)) continue;
    saveProduct(p.slug, swapDeep(p, from, to), userId);
    changed++;
  }
  return changed;
}

/** Quita (u oculta, si es de la web) una imagen que no se usa. */
export function removeSiteImage(url: string) {
  if (!listSiteImages({ includeHidden: true }).includes(url)) return { ok: false as const, error: "Esa imagen no existe." };
  const used = imageUsageMap().get(url) ?? [];
  if (used.length) return { ok: false as const, error: `Se está usando en: ${used.map((u) => u.label).join(", ")}. Reemplázala primero.` };
  db.prepare("INSERT OR IGNORE INTO cms_hidden_media (url, hidden_at) VALUES (?, ?)").run(url, Date.now());
  return { ok: true as const };
}

export function restoreSiteImage(url: string) {
  db.prepare("DELETE FROM cms_hidden_media WHERE url = ?").run(url);
}

/* ---------- biblioteca completa (pantalla Medios) ---------- */

export type MediaUse = { label: string; href: string };

/** Imagen de la biblioteca: subida desde el panel o incluida con la web. */
export type LibraryItem = {
  url: string;
  kind: "upload" | "site";
  name: string;
  width: number;
  height: number;
  size: number;
  /** Solo las subidas: id, descripción y fecha. */
  id?: number;
  alt?: string;
  created_at?: number;
  /** Imagen de la web quitada de la biblioteca (se puede restaurar). */
  hidden?: boolean;
  usage: MediaUse[];
};

/** Recorre un valor (texto, lista u objeto) y devuelve las rutas de imagen que contiene. */
function imagesIn(v: unknown, out: string[] = []): string[] {
  if (typeof v === "string") {
    if (/^\/(images|media|logo)\//.test(v)) out.push(v);
  } else if (Array.isArray(v)) v.forEach((x) => imagesIn(x, out));
  else if (v && typeof v === "object") Object.values(v).forEach((x) => imagesIn(x, out));
  return out;
}

/** Mapa imagen → lugares donde se usa (páginas, SEO, ajustes y productos), con enlace para editarla. */
export function imageUsageMap(): Map<string, MediaUse[]> {
  const map = new Map<string, MediaUse[]>();
  const add = (url: string, use: MediaUse) => {
    const list = map.get(url) ?? [];
    if (!list.some((u) => u.label === use.label)) list.push(use);
    map.set(url, list);
  };
  for (const id of Object.keys(CMS_PAGES) as CmsPageId[]) {
    const page = CMS_PAGES[id];
    const values = readPageContent(id) as Record<string, unknown>;
    const base = id === "seo" ? "/admin/seo" : id === "ajustes" ? "/admin/ajustes" : `/admin/paginas/${id}`;
    for (const [sid, sec] of Object.entries(page.sections) as [string, { title: string }][]) {
      for (const url of imagesIn(values[sid])) add(url, { label: `${page.title} · ${sec.title}`, href: `${base}#${sid}` });
    }
  }
  for (const p of readProducts()) {
    for (const url of imagesIn(p)) add(url, { label: `Producto · ${p.title}`, href: `/admin/productos/${p.slug}` });
  }
  return map;
}

/** Todas las imágenes (subidas + de la web), con medidas, peso y uso. */
export async function listLibrary(): Promise<LibraryItem[]> {
  const usage = imageUsageMap();
  const uploads: LibraryItem[] = listMedia().map((m) => ({
    url: m.url,
    kind: "upload",
    name: m.original_name,
    width: m.width,
    height: m.height,
    size: m.size,
    id: m.id,
    alt: m.alt,
    created_at: m.created_at,
    usage: usage.get(m.url) ?? [],
  }));
  const hidden = hiddenSet();
  const site = await Promise.all(
    listSiteImages({ includeHidden: true }).map(async (url): Promise<LibraryItem> => {
      const file = path.join(process.cwd(), "public", url);
      let width = 0;
      let height = 0;
      try {
        const meta = await sharp(file).metadata();
        width = meta.width ?? 0;
        height = meta.height ?? 0;
      } catch {
        // Si no se puede leer, se muestra sin medidas.
      }
      return {
        url,
        kind: "site",
        name: path.basename(url),
        width,
        height,
        size: fs.statSync(file).size,
        hidden: hidden.has(url),
        usage: usage.get(url) ?? [],
      };
    }),
  );
  return [...uploads, ...site];
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
