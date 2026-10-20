import "server-only";
import { randomInt } from "node:crypto";
import { db } from "@/lib/db";

/** Usuario como se ve en el panel (/admin/usuarios). Nunca incluye la contraseña. */
export type AdminUser = {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
  phone: string;
  job_title: string;
  disabled: number;
  /** Superadministrador (soporte técnico): solo otro superadministrador puede modificar su cuenta. */
  is_super: number;
  created_at: number;
  last_login: number | null;
  questions: number;
  answers: number;
  sessions: number;
};

const SELECT = `
  SELECT u.id, u.name, u.email, u.role, u.phone, u.job_title, u.disabled, u.is_super, u.created_at, u.last_login,
         (SELECT COUNT(*) FROM questions q WHERE q.user_id = u.id) AS questions,
         (SELECT COUNT(*) FROM answers a WHERE a.user_id = u.id) AS answers,
         (SELECT COUNT(*) FROM sessions s WHERE s.user_id = u.id AND s.expires_at > @now) AS sessions
    FROM users u`;

export type UserFilter = "todos" | "admin" | "user" | "suspendidos";

export function listUsers(q: string, filter: UserFilter): AdminUser[] {
  const where: string[] = [];
  if (filter === "admin" || filter === "user") where.push("u.role = @role");
  if (filter === "suspendidos") where.push("u.disabled = 1");
  if (q) where.push("(u.name LIKE @q OR u.email LIKE @q OR u.phone LIKE @q OR u.job_title LIKE @q)");
  return db
    .prepare(`${SELECT} ${where.length ? `WHERE ${where.join(" AND ")}` : ""} ORDER BY u.is_super DESC, u.role = 'admin' DESC, u.disabled, u.name COLLATE NOCASE`)
    .all({ now: Date.now(), role: filter, q: `%${q}%` }) as AdminUser[];
}

export function getUser(id: number): AdminUser | null {
  return (db.prepare(`${SELECT} WHERE u.id = @id`).get({ now: Date.now(), id }) as AdminUser | undefined) ?? null;
}

export function userStats() {
  return db
    .prepare(
      `SELECT COUNT(*) AS total,
              SUM(role = 'admin') AS admins,
              SUM(role = 'user') AS members,
              SUM(disabled = 1) AS suspended
         FROM users`,
    )
    .get() as { total: number; admins: number; members: number; suspended: number };
}

/** ¿Es superadministrador? */
export const isSuperUser = (id: number) =>
  ((db.prepare("SELECT is_super FROM users WHERE id = ?").get(id) as { is_super: number } | undefined)?.is_super ?? 0) === 1;

/** Administradores activos (para no dejar el panel sin nadie que pueda entrar). */
export const activeAdmins = () =>
  (db.prepare("SELECT COUNT(*) AS n FROM users WHERE role = 'admin' AND disabled = 0").get() as { n: number }).n;

/* ---------- validación ---------- */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type UserInput = { name: string; email: string; phone: string; job_title: string };

/** Lee y valida los datos básicos de un formulario. Devuelve los datos limpios o un mensaje de error. */
export function readUserInput(fd: FormData, excludeId?: number): { data: UserInput } | { error: string } {
  const s = (k: string, max: number) => String(fd.get(k) ?? "").trim().replace(/\s+/g, " ").slice(0, max);
  const data = { name: s("name", 80), email: s("email", 120).toLowerCase(), phone: s("phone", 30), job_title: s("job_title", 80) };
  if (data.name.length < 2) return { error: "Escribe el nombre (mínimo 2 letras)." };
  if (!EMAIL_RE.test(data.email)) return { error: "El correo no es válido." };
  if (data.phone && !/^[+\d][\d\s()-]{5,}$/.test(data.phone)) return { error: "El teléfono solo puede tener números, espacios y «+»." };
  const taken = db.prepare("SELECT id FROM users WHERE email = ? AND id != ?").get(data.email, excludeId ?? -1);
  if (taken) return { error: "Ya existe un usuario con ese correo." };
  return { data };
}

export const MIN_PASSWORD = 10;

/** Contraseña aleatoria fácil de dictar (sin 0/O, 1/l): 4 bloques de 4. */
export function generatePassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  const block = () => Array.from({ length: 4 }, () => chars[randomInt(chars.length)]).join("");
  return `${block()}-${block()}-${block()}-${block()}`;
}
