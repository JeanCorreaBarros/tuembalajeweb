"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { destroyAllSessions, destroyOtherSessions, hashPassword } from "@/lib/auth";
import { requireAdmin } from "@/lib/cms/admin";
import { activeAdmins, generatePassword, getUser, MIN_PASSWORD, readUserInput } from "@/lib/cms/users";
import { db } from "@/lib/db";

/** Resultado de los formularios de usuarios. `password` solo vuelve cuando el sistema la generó (se muestra una vez). */
export type UserResult = { ok: true; message: string; password?: string; id?: number } | { ok: false; error: string } | null;

const refresh = (id?: number) => {
  revalidatePath("/admin/usuarios");
  if (id) revalidatePath(`/admin/usuarios/${id}`);
  revalidatePath("/admin/cuenta");
};

/** Contraseña del formulario: la escrita (validada) o una generada. */
function passwordFrom(fd: FormData): { value: string; generated: boolean } | { error: string } {
  if (fd.get("passwordMode") === "manual") {
    const value = String(fd.get("password") ?? "");
    if (value.length < MIN_PASSWORD) return { error: `La contraseña debe tener al menos ${MIN_PASSWORD} caracteres.` };
    return { value, generated: false };
  }
  return { value: generatePassword(), generated: true };
}

/* ---------- mi cuenta ---------- */

export async function updateProfileAction(_: UserResult, fd: FormData): Promise<UserResult> {
  const me = await requireAdmin();
  const input = readUserInput(fd, me.id);
  if ("error" in input) return { ok: false, error: input.error };
  const { name, email, phone, job_title } = input.data;
  db.prepare("UPDATE users SET name = ?, email = ?, phone = ?, job_title = ? WHERE id = ?").run(name, email, phone, job_title, me.id);
  refresh(me.id);
  revalidatePath("/admin", "layout");
  return { ok: true, message: "Datos actualizados" };
}

export async function logoutOtherSessionsAction(): Promise<UserResult> {
  const me = await requireAdmin();
  const n = await destroyOtherSessions(me.id);
  refresh();
  return { ok: true, message: n ? `Se cerraron ${n} ${n === 1 ? "sesión" : "sesiones"} en otros dispositivos` : "No había otras sesiones abiertas" };
}

/* ---------- usuarios ---------- */

export async function createUserAction(_: UserResult, fd: FormData): Promise<UserResult> {
  await requireAdmin();
  const input = readUserInput(fd);
  if ("error" in input) return { ok: false, error: input.error };
  const pw = passwordFrom(fd);
  if ("error" in pw) return { ok: false, error: pw.error };
  const role = fd.get("role") === "admin" ? "admin" : "user";
  const { name, email, phone, job_title } = input.data;
  const info = db
    .prepare("INSERT INTO users (name, email, password_hash, role, phone, job_title, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)")
    .run(name, email, await hashPassword(pw.value), role, phone, job_title, Date.now());
  refresh();
  return {
    ok: true,
    id: Number(info.lastInsertRowid),
    message: `Usuario creado: ${name}`,
    ...(pw.generated ? { password: pw.value } : {}),
  };
}

export async function updateUserAction(id: number, _: UserResult, fd: FormData): Promise<UserResult> {
  const me = await requireAdmin();
  const user = getUser(id);
  if (!user) return { ok: false, error: "El usuario ya no existe." };
  const input = readUserInput(fd, id);
  if ("error" in input) return { ok: false, error: input.error };
  const role = fd.get("role") === "admin" ? "admin" : "user";
  const disabled = fd.get("disabled") === "on" ? 1 : 0;

  // Protecciones: nadie se quita a sí mismo el acceso, y el panel nunca queda sin administradores activos.
  if (id === me.id && (role !== "admin" || disabled)) return { ok: false, error: "No puedes quitarte el rol de administrador ni suspender tu propia cuenta." };
  const wasActiveAdmin = user.role === "admin" && !user.disabled;
  if (wasActiveAdmin && (role !== "admin" || disabled) && activeAdmins() <= 1) {
    return { ok: false, error: "Debe quedar al menos un administrador activo." };
  }

  const { name, email, phone, job_title } = input.data;
  db.prepare("UPDATE users SET name = ?, email = ?, phone = ?, job_title = ?, role = ?, disabled = ? WHERE id = ?").run(
    name,
    email,
    phone,
    job_title,
    role,
    disabled,
    id,
  );
  // Suspendido o sin rol de administrador: se cierran sus sesiones para que el cambio aplique ya.
  if (disabled || (user.role === "admin" && role !== "admin")) destroyAllSessions(id);
  refresh(id);
  return { ok: true, message: "Cambios guardados" };
}

export async function resetUserPasswordAction(id: number, _: UserResult, fd: FormData): Promise<UserResult> {
  const me = await requireAdmin();
  if (!getUser(id)) return { ok: false, error: "El usuario ya no existe." };
  if (id === me.id) return { ok: false, error: "Cambia tu propia contraseña desde Mi cuenta." };
  const pw = passwordFrom(fd);
  if ("error" in pw) return { ok: false, error: pw.error };
  db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(await hashPassword(pw.value), id);
  destroyAllSessions(id);
  refresh(id);
  return { ok: true, message: "Contraseña cambiada. Sus sesiones abiertas se cerraron.", ...(pw.generated ? { password: pw.value } : {}) };
}

export async function deleteUserAction(id: number) {
  const me = await requireAdmin();
  const user = getUser(id);
  if (!user) redirect("/admin/usuarios");
  if (id === me.id) return;
  if (user.role === "admin" && !user.disabled && activeAdmins() <= 1) return;
  // Sus preguntas y respuestas del foro se borran con él (ON DELETE CASCADE); su historial del panel queda sin autor.
  db.prepare("DELETE FROM users WHERE id = ?").run(id);
  refresh();
  redirect("/admin/usuarios?eliminado=1");
}
