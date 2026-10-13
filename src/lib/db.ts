import "server-only";
import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

/**
 * Base de datos SQLite (un solo archivo). Por defecto: ./data/foro.db
 * Cambia la ruta con la variable DATABASE_PATH. Haz respaldo copiando ese archivo.
 */
const DB_PATH = process.env.DATABASE_PATH ?? path.join(process.cwd(), "data", "foro.db");
const SCHEMA_PATH = path.join(process.cwd(), "src", "lib", "schema.sql");

const g = globalThis as unknown as { __foroDb?: Database.Database };

function open() {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.exec(fs.readFileSync(SCHEMA_PATH, "utf8"));
  migrate(db);
  return db;
}

/** Cambios de esquema para bases creadas con versiones anteriores (no borran datos). */
function migrate(db: Database.Database) {
  const cols = db.prepare("PRAGMA table_info(answers)").all() as { name: string }[];
  if (!cols.some((c) => c.name === "parent_id")) {
    db.exec("ALTER TABLE answers ADD COLUMN parent_id INTEGER REFERENCES answers(id) ON DELETE CASCADE");
  }
  db.exec("CREATE INDEX IF NOT EXISTS idx_answers_parent ON answers(parent_id)");
}

/** Una sola conexión por proceso (también sobrevive al hot reload en desarrollo). */
export const db = (g.__foroDb ??= open());
