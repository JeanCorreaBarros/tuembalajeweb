import "server-only";
import { db } from "./db";

export const CATEGORIES = [
  { slug: "estibas-madera", label: "Estibas de madera" },
  { slug: "estibas-plastico", label: "Estibas de plástico" },
  { slug: "embalajes-especiales", label: "Embalajes especiales" },
  { slug: "exportacion", label: "Exportación y NIMF 15" },
  { slug: "otros", label: "Otros productos" },
  { slug: "general", label: "General" },
] as const;

export const categoryLabel = (slug: string) => CATEGORIES.find((c) => c.slug === slug)?.label ?? "General";
export const isCategory = (slug: string) => CATEGORIES.some((c) => c.slug === slug);

export const PAGE_SIZE = 10;

export type QuestionRow = {
  id: number;
  title: string;
  body: string;
  category: string;
  views: number;
  accepted_id: number | null;
  created_at: number;
  author_id: number;
  author: string;
  author_role: "user" | "admin";
  answers: number;
};

const QUESTION_SELECT = `
  SELECT q.id, q.title, q.body, q.category, q.views, q.accepted_id, q.created_at,
         u.id AS author_id, u.name AS author, u.role AS author_role,
         (SELECT COUNT(*) FROM answers a WHERE a.question_id = q.id) AS answers
    FROM questions q JOIN users u ON u.id = q.user_id`;

const likeEscape = (s: string) => s.replace(/[\\%_]/g, (m) => `\\${m}`);

export const VIEWS = [
  { slug: "recientes", label: "Recientes" },
  { slug: "populares", label: "Populares" },
  { slug: "sin-respuesta", label: "Sin respuesta" },
  { slug: "resueltas", label: "Resueltas" },
] as const;
export type View = (typeof VIEWS)[number]["slug"];
export const isView = (v: string): v is View => VIEWS.some((x) => x.slug === v);

export function listQuestions(opts: { q?: string; category?: string; view?: View; page: number }) {
  const where: string[] = [];
  const args: (string | number)[] = [];
  if (opts.view === "sin-respuesta") where.push("NOT EXISTS (SELECT 1 FROM answers a WHERE a.question_id = q.id)");
  if (opts.view === "resueltas") where.push("q.accepted_id IS NOT NULL");
  if (opts.q) {
    const like = `%${likeEscape(opts.q)}%`;
    where.push("(q.title LIKE ? ESCAPE '\\' OR q.body LIKE ? ESCAPE '\\')");
    args.push(like, like);
  }
  if (opts.category && isCategory(opts.category)) {
    where.push("q.category = ?");
    args.push(opts.category);
  }
  const w = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const total = (
    db.prepare(`SELECT COUNT(*) AS n FROM questions q ${w}`).get(...args) as { n: number }
  ).n;
  const rows = db
    .prepare(
      `${QUESTION_SELECT} ${w} ORDER BY ${
        opts.view === "populares" ? "answers * 5 + q.views DESC, q.created_at DESC" : "q.created_at DESC"
      } LIMIT ? OFFSET ?`,
    )
    .all(...args, PAGE_SIZE, (opts.page - 1) * PAGE_SIZE) as QuestionRow[];

  return { rows, total, pages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export function getQuestion(id: number) {
  return db.prepare(`${QUESTION_SELECT} WHERE q.id = ?`).get(id) as QuestionRow | undefined;
}

export function addView(id: number) {
  db.prepare("UPDATE questions SET views = views + 1 WHERE id = ?").run(id);
}

export type AnswerRow = {
  id: number;
  parent_id: number | null;
  body: string;
  created_at: number;
  author_id: number;
  author: string;
  author_role: "user" | "admin";
  votes: number;
  voted: number;
};

export function listAnswers(questionId: number, viewerId: number | null) {
  return db
    .prepare(
      `SELECT a.id, a.parent_id, a.body, a.created_at, u.id AS author_id, u.name AS author, u.role AS author_role,
              (SELECT COUNT(*) FROM votes v WHERE v.answer_id = a.id) AS votes,
              (SELECT COUNT(*) FROM votes v WHERE v.answer_id = a.id AND v.user_id = ?) AS voted
         FROM answers a JOIN users u ON u.id = a.user_id
        WHERE a.question_id = ?
        ORDER BY (a.id = (SELECT accepted_id FROM questions WHERE id = ?)) DESC, votes DESC, a.created_at ASC`,
    )
    .all(viewerId ?? 0, questionId, questionId) as AnswerRow[];
}

export function stats() {
  return db
    .prepare(
      `SELECT (SELECT COUNT(*) FROM questions) AS questions,
              (SELECT COUNT(*) FROM answers)   AS answers,
              (SELECT COUNT(*) FROM users)     AS members`,
    )
    .get() as { questions: number; answers: number; members: number };
}

/** Número de preguntas por categoría (para la barra lateral). */
export function categoryCounts() {
  const rows = db.prepare("SELECT category, COUNT(*) AS n FROM questions GROUP BY category").all() as {
    category: string;
    n: number;
  }[];
  return Object.fromEntries(rows.map((r) => [r.category, r.n])) as Record<string, number>;
}

/** Miembros con más respuestas. */
export function topMembers(limit = 5) {
  return db
    .prepare(
      `SELECT u.id, u.name, u.role, COUNT(a.id) AS answers
         FROM users u JOIN answers a ON a.user_id = u.id
        GROUP BY u.id ORDER BY answers DESC LIMIT ?`,
    )
    .all(limit) as { id: number; name: string; role: "user" | "admin"; answers: number }[];
}

/** Otras preguntas de la misma categoría. */
export function relatedQuestions(category: string, excludeId: number, limit = 5) {
  return db
    .prepare(
      `SELECT q.id, q.title, (SELECT COUNT(*) FROM answers a WHERE a.question_id = q.id) AS answers
         FROM questions q WHERE q.category = ? AND q.id != ? ORDER BY q.created_at DESC LIMIT ?`,
    )
    .all(category, excludeId, limit) as { id: number; title: string; answers: number }[];
}

/** Publicaciones del usuario en el último minuto (límite anti-spam). */
export function recentPosts(userId: number) {
  const since = Date.now() - 60_000;
  const r = db
    .prepare(
      `SELECT (SELECT COUNT(*) FROM questions WHERE user_id = ? AND created_at > ?) +
              (SELECT COUNT(*) FROM answers   WHERE user_id = ? AND created_at > ?) AS n`,
    )
    .get(userId, since, userId, since) as { n: number };
  return r.n;
}

/* ---------- formato ---------- */

export function timeAgo(ts: number) {
  const s = Math.max(1, Math.floor((Date.now() - ts) / 1000));
  const units: [number, string, string][] = [
    [31_536_000, "año", "años"],
    [2_592_000, "mes", "meses"],
    [86_400, "día", "días"],
    [3_600, "hora", "horas"],
    [60, "minuto", "minutos"],
  ];
  for (const [secs, one, many] of units) {
    const n = Math.floor(s / secs);
    if (n >= 1) return `hace ${n} ${n === 1 ? one : many}`;
  }
  return "hace unos segundos";
}
