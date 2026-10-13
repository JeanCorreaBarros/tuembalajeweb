"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSession, destroySession, getCurrentUser, hashPassword, verifyPassword, type User } from "@/lib/auth";
import { db } from "@/lib/db";
import { isCategory, recentPosts } from "@/lib/forum";

export type FormState = { error?: string; ok?: number };

/* ---------- utilidades ---------- */

const str = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Solo permite volver a rutas internas del foro (evita redirecciones abiertas). */
function safeNext(next: string) {
  return /^\/foro(\/[\w\-/]*)?$/.test(next) ? next : "/foro";
}

async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect("/foro/ingresar");
  return user;
}

/** Límite simple contra fuerza bruta: 8 intentos fallidos por correo cada 10 minutos. */
const attempts = new Map<string, { n: number; reset: number }>();
function tooManyAttempts(email: string) {
  const a = attempts.get(email);
  return !!a && a.reset > Date.now() && a.n >= 8;
}
function failAttempt(email: string) {
  const a = attempts.get(email);
  if (!a || a.reset <= Date.now()) attempts.set(email, { n: 1, reset: Date.now() + 600_000 });
  else a.n++;
}

/* ---------- cuenta ---------- */

export async function register(_: FormState, fd: FormData): Promise<FormState> {
  const name = str(fd, "name");
  const email = str(fd, "email").toLowerCase();
  const password = String(fd.get("password") ?? "");

  if (name.length < 2 || name.length > 60) return { error: "Escribe tu nombre (2 a 60 caracteres)." };
  if (!EMAIL_RE.test(email) || email.length > 120) return { error: "Escribe un correo válido." };
  if (password.length < 8 || password.length > 100) return { error: "La contraseña debe tener al menos 8 caracteres." };
  // La autorización de datos es obligatoria por ley: se valida también aquí, no solo en el navegador.
  if (fd.get("acepto") !== "on") {
    return { error: "Para crear la cuenta debes aceptar los términos y autorizar el tratamiento de tus datos." };
  }

  if (db.prepare("SELECT 1 FROM users WHERE email = ?").get(email)) {
    return { error: "Ya existe una cuenta con ese correo. Prueba iniciar sesión." };
  }

  const admin = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const role = admin && admin === email ? "admin" : "user";
  const info = db
    .prepare("INSERT INTO users (name, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?)")
    .run(name, email, await hashPassword(password), role, Date.now());

  await createSession(Number(info.lastInsertRowid));
  redirect(safeNext(str(fd, "next")));
}

export async function login(_: FormState, fd: FormData): Promise<FormState> {
  const email = str(fd, "email").toLowerCase();
  const password = String(fd.get("password") ?? "");

  if (tooManyAttempts(email)) return { error: "Demasiados intentos. Espera unos minutos e inténtalo de nuevo." };

  const user = db.prepare("SELECT id, password_hash FROM users WHERE email = ?").get(email) as
    | { id: number; password_hash: string }
    | undefined;
  // Se verifica siempre, para no revelar si el correo existe.
  const ok = user ? await verifyPassword(password, user.password_hash) : false;
  if (!user || !ok) {
    failAttempt(email);
    return { error: "Correo o contraseña incorrectos." };
  }

  await createSession(user.id);
  redirect(safeNext(str(fd, "next")));
}

export async function logout() {
  await destroySession();
  redirect("/foro");
}

/* ---------- preguntas y respuestas ---------- */

export async function createQuestion(_: FormState, fd: FormData): Promise<FormState> {
  const user = await requireUser();
  const title = str(fd, "title");
  const body = str(fd, "body");
  const category = str(fd, "category");

  if (title.length < 10 || title.length > 150) return { error: "El título debe tener entre 10 y 150 caracteres." };
  if (body.length < 20 || body.length > 5000) return { error: "Describe tu pregunta (20 a 5000 caracteres)." };
  if (!isCategory(category)) return { error: "Elige una categoría." };
  if (recentPosts(user.id) >= 5) return { error: "Estás publicando muy rápido. Espera un minuto." };

  const info = db
    .prepare("INSERT INTO questions (user_id, category, title, body, created_at) VALUES (?, ?, ?, ?, ?)")
    .run(user.id, category, title, body, Date.now());

  revalidatePath("/foro");
  redirect(`/foro/${info.lastInsertRowid}`);
}

export async function createAnswer(questionId: number, _: FormState, fd: FormData): Promise<FormState> {
  const user = await requireUser();
  const body = str(fd, "body");

  if (body.length < 5 || body.length > 5000) return { error: "Tu respuesta debe tener entre 5 y 5000 caracteres." };
  if (!db.prepare("SELECT 1 FROM questions WHERE id = ?").get(questionId)) return { error: "La pregunta ya no existe." };
  if (recentPosts(user.id) >= 5) return { error: "Estás publicando muy rápido. Espera un minuto." };

  // Si responde a un comentario, este debe existir y ser de la misma pregunta.
  const rawParent = str(fd, "parent_id");
  const parentId = /^\d+$/.test(rawParent) ? Number(rawParent) : null;
  if (parentId !== null) {
    const parent = db.prepare("SELECT question_id FROM answers WHERE id = ?").get(parentId) as
      | { question_id: number }
      | undefined;
    if (!parent || parent.question_id !== questionId) return { error: "El comentario al que respondes ya no existe." };
  }

  db.prepare("INSERT INTO answers (question_id, parent_id, user_id, body, created_at) VALUES (?, ?, ?, ?, ?)").run(
    questionId,
    parentId,
    user.id,
    body,
    Date.now(),
  );
  revalidatePath(`/foro/${questionId}`);
  revalidatePath("/foro");
  return { ok: Date.now() };
}

export async function toggleVote(answerId: number) {
  const user = await requireUser();
  const a = db.prepare("SELECT user_id, question_id FROM answers WHERE id = ?").get(answerId) as
    | { user_id: number; question_id: number }
    | undefined;
  if (!a || a.user_id === user.id) return; // no se puede votar la propia respuesta

  const del = db.prepare("DELETE FROM votes WHERE answer_id = ? AND user_id = ?").run(answerId, user.id);
  if (del.changes === 0) db.prepare("INSERT INTO votes (answer_id, user_id) VALUES (?, ?)").run(answerId, user.id);
  revalidatePath(`/foro/${a.question_id}`);
}

export async function acceptAnswer(answerId: number) {
  const user = await requireUser();
  const row = db
    .prepare(
      `SELECT q.id AS qid, q.user_id AS owner, q.accepted_id, a.parent_id
         FROM answers a JOIN questions q ON q.id = a.question_id WHERE a.id = ?`,
    )
    .get(answerId) as { qid: number; owner: number; accepted_id: number | null; parent_id: number | null } | undefined;
  // Solo una respuesta directa (no un comentario a otra respuesta) puede ser la solución.
  if (!row || row.parent_id !== null || (row.owner !== user.id && user.role !== "admin")) return;

  db.prepare("UPDATE questions SET accepted_id = ? WHERE id = ?").run(
    row.accepted_id === answerId ? null : answerId,
    row.qid,
  );
  revalidatePath(`/foro/${row.qid}`);
  revalidatePath("/foro");
}

export async function deleteQuestion(id: number) {
  const user = await requireUser();
  const q = db.prepare("SELECT user_id FROM questions WHERE id = ?").get(id) as { user_id: number } | undefined;
  if (!q || (q.user_id !== user.id && user.role !== "admin")) return;

  db.prepare("DELETE FROM questions WHERE id = ?").run(id);
  revalidatePath("/foro");
  redirect("/foro");
}

export async function deleteAnswer(id: number) {
  const user = await requireUser();
  const a = db.prepare("SELECT user_id, question_id FROM answers WHERE id = ?").get(id) as
    | { user_id: number; question_id: number }
    | undefined;
  if (!a || (a.user_id !== user.id && user.role !== "admin")) return;

  db.prepare("UPDATE questions SET accepted_id = NULL WHERE accepted_id = ?").run(id);
  db.prepare("DELETE FROM answers WHERE id = ?").run(id); // sus respuestas se borran en cascada
  revalidatePath(`/foro/${a.question_id}`);
  revalidatePath("/foro");
}
