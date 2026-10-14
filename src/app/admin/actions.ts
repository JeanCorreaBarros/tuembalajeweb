"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { createSession, destroySession, hashPassword, verifyPassword } from "@/lib/auth";
import { requireAdmin } from "@/lib/cms/admin";
import { deleteMedia, listMedia, listSiteImages, saveUpload, updateMediaAlt, type Media } from "@/lib/cms/media";
import { isCmsPage } from "@/lib/cms/pages";
import {
  deleteProduct,
  moveProduct,
  PRODUCTS_TAG,
  readProduct,
  restoreProduct,
  saveProduct,
} from "@/lib/cms/products";
import { CMS_TAG, resetSection, saveSection, sectionDef } from "@/lib/cms/store";
import { db } from "@/lib/db";

export type ActionResult = { ok: true; message?: string; at?: number } | { ok: false; error: string };

/* ---------- ingreso ---------- */

/** Límite contra fuerza bruta: 6 intentos fallidos por correo cada 15 minutos. */
const attempts = new Map<string, { n: number; reset: number }>();

export async function adminLogin(_: { error?: string }, fd: FormData): Promise<{ error?: string }> {
  const email = String(fd.get("email") ?? "").trim().toLowerCase();
  const password = String(fd.get("password") ?? "");
  const a = attempts.get(email);
  if (a && a.reset > Date.now() && a.n >= 6) return { error: "Demasiados intentos. Espera unos minutos e inténtalo de nuevo." };

  const user = db.prepare("SELECT id, password_hash, role FROM users WHERE email = ?").get(email) as
    | { id: number; password_hash: string; role: string }
    | undefined;
  // Se verifica siempre (aunque el correo no exista) para no revelar qué correos están registrados.
  const ok = user ? await verifyPassword(password, user.password_hash) : false;
  if (!user || !ok || user.role !== "admin") {
    if (!a || a.reset <= Date.now()) attempts.set(email, { n: 1, reset: Date.now() + 15 * 60_000 });
    else a.n++;
    return { error: "Correo o contraseña incorrectos, o la cuenta no es de administrador." };
  }
  attempts.delete(email);
  await createSession(user.id);
  redirect("/admin");
}

export async function adminLogout() {
  await destroySession();
  redirect("/admin/login");
}

/* ---------- contenido de páginas ---------- */

/** Invalida la caché de la web para que el cambio se vea de inmediato. */
function refreshSite() {
  updateTag(CMS_TAG);
}

export async function saveSectionAction(pageId: string, sectionId: string, values: unknown): Promise<ActionResult> {
  const user = await requireAdmin();
  if (!isCmsPage(pageId) || !sectionDef(pageId, sectionId)) return { ok: false, error: "Sección desconocida." };
  try {
    saveSection(pageId, sectionId, values, user.id);
  } catch {
    return { ok: false, error: "No se pudo guardar. Revisa los datos e inténtalo de nuevo." };
  }
  refreshSite();
  return { ok: true, message: "Cambios publicados", at: Date.now() };
}

export async function resetSectionAction(pageId: string, sectionId: string): Promise<ActionResult> {
  const user = await requireAdmin();
  if (!isCmsPage(pageId) || !sectionDef(pageId, sectionId)) return { ok: false, error: "Sección desconocida." };
  resetSection(pageId, sectionId, user.id);
  refreshSite();
  revalidatePath(`/admin/paginas/${pageId}`);
  return { ok: true, message: "Sección restablecida a los textos originales" };
}

/* ---------- productos ---------- */

function refreshProducts() {
  updateTag(PRODUCTS_TAG);
  updateTag(CMS_TAG);
}

export async function saveProductAction(originalSlug: string | null, data: unknown): Promise<ActionResult & { slug?: string }> {
  const user = await requireAdmin();
  let slug: string;
  try {
    slug = saveProduct(originalSlug, data, user.id);
  } catch {
    return { ok: false, error: "No se pudo guardar el producto." };
  }
  refreshProducts();
  revalidatePath("/admin/productos");
  return { ok: true, message: "Producto publicado", slug, at: Date.now() };
}

export async function deleteProductAction(slug: string) {
  const user = await requireAdmin();
  deleteProduct(slug, user.id);
  refreshProducts();
  revalidatePath("/admin/productos");
}

export async function moveProductAction(slug: string, dir: -1 | 1) {
  await requireAdmin();
  moveProduct(slug, dir === -1 ? -1 : 1);
  refreshProducts();
  revalidatePath("/admin/productos");
}

export async function duplicateProductAction(slug: string) {
  const user = await requireAdmin();
  const p = readProduct(slug);
  if (!p) return;
  const copy = saveProduct(null, { ...p, slug: `${p.slug}-copia`, title: `${p.title} (copia)`, featured: false }, user.id);
  refreshProducts();
  redirect(`/admin/productos/${copy}`);
}

/* ---------- medios ---------- */

/** Imágenes para el selector: las subidas desde el panel y las que vienen con la web. */
export async function listMediaAction(): Promise<{ uploads: Media[]; site: string[] }> {
  await requireAdmin();
  return { uploads: listMedia(), site: listSiteImages() };
}

export async function uploadMediaAction(fd: FormData): Promise<{ ok: true; media: Media } | { ok: false; error: string }> {
  const user = await requireAdmin();
  const file = fd.get("file");
  if (!(file instanceof File) || file.size === 0) return { ok: false, error: "Elige una imagen." };
  try {
    const media = await saveUpload(file, user.id);
    revalidatePath("/admin/medios");
    return { ok: true, media };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "No se pudo subir la imagen." };
  }
}

export async function deleteMediaAction(id: number): Promise<ActionResult> {
  await requireAdmin();
  const r = deleteMedia(id);
  revalidatePath("/admin/medios");
  if (!r.ok) return { ok: false, error: `Esta imagen se está usando (${r.usedIn.join(", ")}). Cámbiala allí antes de eliminarla.` };
  return { ok: true, message: "Imagen eliminada" };
}

export async function updateMediaAltAction(id: number, alt: string): Promise<ActionResult> {
  await requireAdmin();
  updateMediaAlt(id, alt);
  return { ok: true, message: "Descripción guardada" };
}

/* ---------- historial ---------- */

export async function restoreRevisionAction(id: number): Promise<ActionResult> {
  const user = await requireAdmin();
  const rev = db.prepare("SELECT key, value FROM cms_revisions WHERE id = ?").get(id) as
    | { key: string; value: string | null }
    | undefined;
  if (!rev || rev.value === null) return { ok: false, error: "Esta versión no se puede restaurar." };
  try {
    if (rev.key.startsWith("producto:")) {
      restoreProduct(rev.value, user.id);
      refreshProducts();
    } else {
      const [pageId, sectionId] = rev.key.split(".");
      if (!isCmsPage(pageId) || !sectionDef(pageId, sectionId)) return { ok: false, error: "Esa sección ya no existe." };
      saveSection(pageId, sectionId, JSON.parse(rev.value), user.id);
      refreshSite();
    }
  } catch {
    return { ok: false, error: "No se pudo restaurar esta versión." };
  }
  revalidatePath("/admin/historial");
  return { ok: true, message: "Versión restaurada y publicada" };
}

/* ---------- cuenta ---------- */

export async function changePasswordAction(_: ActionResult | null, fd: FormData): Promise<ActionResult> {
  const user = await requireAdmin();
  const current = String(fd.get("current") ?? "");
  const next = String(fd.get("next") ?? "");
  const confirm = String(fd.get("confirm") ?? "");
  if (next.length < 10) return { ok: false, error: "La nueva contraseña debe tener al menos 10 caracteres." };
  if (next !== confirm) return { ok: false, error: "Las contraseñas nuevas no coinciden." };
  const row = db.prepare("SELECT password_hash FROM users WHERE id = ?").get(user.id) as { password_hash: string };
  if (!(await verifyPassword(current, row.password_hash))) return { ok: false, error: "La contraseña actual no es correcta." };
  db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(await hashPassword(next), user.id);
  return { ok: true, message: "Contraseña actualizada" };
}
