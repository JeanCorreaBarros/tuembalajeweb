import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/lib/db";
import { ICONS } from "./icons";
import { CMS_PAGES, type CmsPageId, type CmsValues } from "./pages";
import type { Field, ScalarField } from "./schema";

/** Etiqueta de caché del contenido editable: al guardar en el panel se invalida y la web se actualiza. */
export const CMS_TAG = "cms";

type Obj = Record<string, unknown>;

/* ---------- validación (lo guardado siempre respeta el esquema) ---------- */

const MAX_TEXT = 20_000;
/** Imágenes permitidas: las de la web (/images, /logo) o las subidas desde el panel (/media). */
export const isImagePath = (v: unknown): v is string =>
  typeof v === "string" && /^\/(images|media|logo)\/[\w\-./]+$/.test(v) && !v.includes("..");

function cleanScalar(f: ScalarField, v: unknown, fallback: unknown): unknown {
  switch (f.type) {
    case "number": {
      const n = typeof v === "number" ? v : Number(String(v ?? "").replace(",", "."));
      return Number.isFinite(n) ? n : fallback;
    }
    case "image":
      // "" = sin imagen, permitido solo en campos de imagen opcionales (los que vienen vacíos por defecto).
      if (v === "" && fallback === "") return "";
      return isImagePath(v) ? v : fallback;
    case "icon":
      return typeof v === "string" && v in ICONS ? v : fallback;
    default: {
      if (typeof v !== "string") return fallback;
      const max = "max" in f && f.max ? Math.max(f.max, 1) : MAX_TEXT;
      return v.replace(/\r\n/g, "\n").slice(0, Math.min(max * 2, MAX_TEXT));
    }
  }
}

/** Mezcla lo guardado con los valores por defecto, campo por campo, descartando lo que no encaje. */
function cleanSection(fields: Field[], stored: unknown, defaults: Obj): Obj {
  const src = stored && typeof stored === "object" ? (stored as Obj) : {};
  const out: Obj = {};
  for (const f of fields) {
    const def = defaults[f.key];
    if (!(f.key in src)) {
      out[f.key] = def;
      continue;
    }
    if (f.type === "list") {
      const arr = Array.isArray(src[f.key]) ? (src[f.key] as unknown[]) : null;
      if (!arr) {
        out[f.key] = def;
        continue;
      }
      const template = (Array.isArray(def) && (def[0] as Obj)) || {};
      out[f.key] = arr.slice(0, f.max ?? 50).map((item) => {
        const it = item && typeof item === "object" ? (item as Obj) : {};
        const row: Obj = {};
        for (const sf of f.fields) row[sf.key] = cleanScalar(sf, it[sf.key], template[sf.key] ?? (sf.type === "number" ? 0 : ""));
        return row;
      });
    } else {
      out[f.key] = cleanScalar(f, src[f.key], def);
    }
  }
  return out;
}

/* ---------- lectura (en caché) ---------- */

/** Contenido de una página: valores guardados en la base de datos o, si no hay, los textos por defecto. */
export async function getPageContent<K extends CmsPageId>(id: K): Promise<CmsValues<K>> {
  "use cache";
  cacheTag(CMS_TAG);
  cacheLife("max");
  return readPageContent(id);
}

/** Lectura directa (sin caché) para el panel, que siempre debe ver lo último guardado. */
export function readPageContent<K extends CmsPageId>(id: K): CmsValues<K> {
  const def = CMS_PAGES[id];
  const rows = db.prepare("SELECT key, value FROM cms_content WHERE key LIKE ?").all(`${id}.%`) as { key: string; value: string }[];
  const stored = new Map(rows.map((r) => [r.key.slice(id.length + 1), r.value]));
  const out: Obj = {};
  for (const [sid, sec] of Object.entries(def.sections)) {
    let parsed: unknown;
    try {
      parsed = stored.has(sid) ? JSON.parse(stored.get(sid)!) : undefined;
    } catch {
      parsed = undefined;
    }
    out[sid] = cleanSection(sec.fields, parsed, sec.defaults as Obj);
  }
  return out as CmsValues<K>;
}

/* ---------- escritura ---------- */

export function sectionDef(pageId: string, sectionId: string) {
  const p = (CMS_PAGES as Record<string, (typeof CMS_PAGES)[CmsPageId]>)[pageId];
  const s = p ? (p.sections as Record<string, { title: string; fields: Field[]; defaults: Obj }>)[sectionId] : undefined;
  return p && s ? { page: p, section: s } : null;
}

/** Guarda una sección (validada) y deja la versión anterior en el historial. Devuelve lo guardado. */
export function saveSection(pageId: CmsPageId, sectionId: string, values: unknown, userId: number) {
  const def = sectionDef(pageId, sectionId);
  if (!def) throw new Error("Sección desconocida");
  const clean = cleanSection(def.section.fields, values, def.section.defaults);
  const json = JSON.stringify(clean);
  const key = `${pageId}.${sectionId}`;
  const now = Date.now();
  db.transaction(() => {
    db.prepare(
      `INSERT INTO cms_content (key, value, updated_at, updated_by) VALUES (?, ?, ?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at, updated_by = excluded.updated_by`,
    ).run(key, json, now, userId);
    db.prepare("INSERT INTO cms_revisions (key, label, value, created_at, user_id) VALUES (?, ?, ?, ?, ?)").run(
      key,
      `${def.page.title} · ${def.section.title}`,
      json,
      now,
      userId,
    );
  })();
  return clean;
}

/** Vuelve una sección a los textos originales de la web (borra lo guardado). */
export function resetSection(pageId: CmsPageId, sectionId: string, userId: number) {
  const def = sectionDef(pageId, sectionId);
  if (!def) throw new Error("Sección desconocida");
  const key = `${pageId}.${sectionId}`;
  db.transaction(() => {
    db.prepare("DELETE FROM cms_content WHERE key = ?").run(key);
    db.prepare("INSERT INTO cms_revisions (key, label, value, created_at, user_id) VALUES (?, ?, ?, ?, ?)").run(
      key,
      `${def.page.title} · ${def.section.title} (restablecido al original)`,
      JSON.stringify(def.section.defaults),
      Date.now(),
      userId,
    );
  })();
}

/** Fecha de la última edición de cada sección guardada (para el panel). */
export function sectionUpdates(pageId: CmsPageId) {
  const rows = db
    .prepare(
      `SELECT c.key, c.updated_at, u.name AS user FROM cms_content c LEFT JOIN users u ON u.id = c.updated_by WHERE c.key LIKE ?`,
    )
    .all(`${pageId}.%`) as { key: string; updated_at: number; user: string | null }[];
  return Object.fromEntries(rows.map((r) => [r.key.slice(pageId.length + 1), { at: r.updated_at, user: r.user }]));
}
