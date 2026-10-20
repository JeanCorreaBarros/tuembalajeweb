import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/lib/db";
import { PRODUCT_CATEGORIES, PRODUCTS as DEFAULT_PRODUCTS, type Product } from "@/lib/products";
import { isImagePath } from "./store";

/** Etiqueta de caché del catálogo: al guardar un producto se invalida. */
export const PRODUCTS_TAG = "products";

/** La primera vez, la tabla se llena con los productos que tenía la web.
 *  Además, en cada arranque inserta (sin sobrescribir) cualquier producto de
 *  DEFAULT_PRODUCTS que no exista aún en la DB — esto garantiza que los productos
 *  nuevos añadidos al código aparezcan en producción sin tocar la base de datos. */
/**
 * Lleva a la base de datos los productos que vienen en el código (lib/products.ts), cada uno UNA sola vez:
 * se anota en cms_product_seeds. Así un producto nuevo del código llega al servidor ya desplegado, pero
 * uno que el administrador eliminó desde el panel no vuelve a aparecer.
 */
function ensureSeeded() {
  const seeded = new Set((db.prepare("SELECT slug FROM cms_product_seeds").all() as { slug: string }[]).map((r) => r.slug));
  const pending = DEFAULT_PRODUCTS.filter((p) => !seeded.has(p.slug));
  if (!pending.length) return;

  const exists = db.prepare("SELECT 1 FROM cms_products WHERE slug = ?");
  const ins = db.prepare("INSERT INTO cms_products (slug, position, data, updated_at) VALUES (?, ?, ?, ?)");
  const mark = db.prepare("INSERT OR IGNORE INTO cms_product_seeds (slug) VALUES (?)");
  db.transaction(() => {
    let { m: pos } = db.prepare("SELECT COALESCE(MAX(position), -1) AS m FROM cms_products").get() as { m: number };
    for (const p of pending) {
      if (!exists.get(p.slug)) ins.run(p.slug, ++pos, JSON.stringify(p), Date.now());
      mark.run(p.slug);
    }
  })();
}

/** Catálogo ordenado (lectura directa, para el panel). */
export function readProducts(): Product[] {
  ensureSeeded();
  const rows = db.prepare("SELECT data FROM cms_products ORDER BY position, slug").all() as { data: string }[];
  return rows.flatMap((r) => {
    try {
      return [cleanProduct(JSON.parse(r.data))];
    } catch {
      return [];
    }
  });
}

/** Catálogo para la web (en caché hasta que se edite un producto). */
export async function getProducts(): Promise<Product[]> {
  "use cache";
  cacheTag(PRODUCTS_TAG);
  cacheLife("max");
  return readProducts();
}

export function readProduct(slug: string): Product | undefined {
  ensureSeeded();
  const row = db.prepare("SELECT data FROM cms_products WHERE slug = ?").get(slug) as { data: string } | undefined;
  return row ? cleanProduct(JSON.parse(row.data)) : undefined;
}

/* ---------- validación ---------- */

const s = (v: unknown, max = 2000) => (typeof v === "string" ? v.replace(/\r\n/g, "\n").trim().slice(0, max) : "");
const strings = (v: unknown, max = 40) => (Array.isArray(v) ? v.map((x) => s(x, 600)).filter(Boolean).slice(0, max) : []);

export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function cleanProduct(raw: unknown): Product {
  const p = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const pairs = (v: unknown, a: string, b: string, max = 30) =>
    Array.isArray(v)
      ? v
          .map((x) => (x && typeof x === "object" ? (x as Record<string, unknown>) : {}))
          .map((x) => ({ [a]: s(x[a], 200), [b]: s(x[b], 1000) }))
          .filter((x) => x[a] || x[b])
          .slice(0, max)
      : [];
  const category = PRODUCT_CATEGORIES.some((c) => c.slug === p.category) ? (p.category as Product["category"]) : "estibas";
  const items = pairs(p.items, "title", "desc") as { title: string; desc: string }[];
  const bullets = strings(p.bullets);
  const tags = strings(p.tags, 12);
  return {
    slug: slugify(s(p.slug, 80)) || "producto",
    title: s(p.title, 120) || "Producto sin nombre",
    short: s(p.short, 240),
    image: isImagePath(p.image) ? p.image : "/images/producto-estibas.jpg",
    category,
    intro: s(p.intro, 1500) || undefined,
    bullets: bullets.length ? bullets : undefined,
    items: items.length ? items : undefined,
    tags: tags.length ? tags : undefined,
    specs: pairs(p.specs, "label", "value", 30) as { label: string; value: string }[],
    featured: p.featured === true,
  };
}

/* ---------- escritura ---------- */

function revision(slug: string, label: string, value: Product | null, userId: number) {
  db.prepare("INSERT INTO cms_revisions (key, label, value, created_at, user_id) VALUES (?, ?, ?, ?, ?)").run(
    `producto:${slug}`,
    label,
    value ? JSON.stringify(value) : null,
    Date.now(),
    userId,
  );
}

/** Crea o actualiza un producto. `originalSlug` = null para uno nuevo. Devuelve el slug final. */
export function saveProduct(originalSlug: string | null, raw: unknown, userId: number) {
  ensureSeeded();
  const p = cleanProduct(raw);
  // El slug sale del campo slug o del título; si ya lo usa otro producto, se le agrega un número.
  let slug = slugify(p.slug && p.slug !== "producto" ? p.slug : p.title) || "producto";
  const taken = (x: string) =>
    x !== originalSlug && !!db.prepare("SELECT 1 FROM cms_products WHERE slug = ?").get(x);
  for (let i = 2; taken(slug); i++) slug = `${slugify(p.slug || p.title)}-${i}`;
  const product = { ...p, slug };
  const now = Date.now();

  db.transaction(() => {
    if (originalSlug && db.prepare("SELECT 1 FROM cms_products WHERE slug = ?").get(originalSlug)) {
      db.prepare("UPDATE cms_products SET slug = ?, data = ?, updated_at = ? WHERE slug = ?").run(
        slug,
        JSON.stringify(product),
        now,
        originalSlug,
      );
    } else {
      const { m } = db.prepare("SELECT COALESCE(MAX(position), -1) AS m FROM cms_products").get() as { m: number };
      db.prepare("INSERT INTO cms_products (slug, position, data, updated_at) VALUES (?, ?, ?, ?)").run(
        slug,
        m + 1,
        JSON.stringify(product),
        now,
      );
    }
    revision(slug, `Producto · ${product.title}${originalSlug ? "" : " (creado)"}`, product, userId);
  })();
  return slug;
}

export function deleteProduct(slug: string, userId: number) {
  const p = readProduct(slug);
  if (!p) return;
  db.transaction(() => {
    db.prepare("DELETE FROM cms_products WHERE slug = ?").run(slug);
    revision(slug, `Producto · ${p.title} (eliminado)`, null, userId);
  })();
}

/** Sube (-1) o baja (+1) un producto en el orden del catálogo. */
export function moveProduct(slug: string, dir: -1 | 1) {
  const list = readProducts().map((p) => p.slug);
  const i = list.indexOf(slug);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= list.length) return;
  [list[i], list[j]] = [list[j], list[i]];
  const upd = db.prepare("UPDATE cms_products SET position = ? WHERE slug = ?");
  db.transaction(() => list.forEach((sl, k) => upd.run(k, sl)))();
}

/** Restaura un producto desde una versión del historial (lo crea si fue eliminado). */
export function restoreProduct(value: string, userId: number) {
  const p = cleanProduct(JSON.parse(value));
  const exists = !!db.prepare("SELECT 1 FROM cms_products WHERE slug = ?").get(p.slug);
  return saveProduct(exists ? p.slug : null, p, userId);
}
