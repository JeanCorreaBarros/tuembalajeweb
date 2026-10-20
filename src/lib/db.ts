import "server-only";
import Database from "better-sqlite3";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

/**
 * Base de datos SQLite (un solo archivo). Por defecto: ./data/foro.db
 * Cambia la ruta con la variable DATABASE_PATH. Haz respaldo copiando ese archivo.
 */
export const DB_PATH = process.env.DATABASE_PATH ?? path.join(process.cwd(), "data", "foro.db");
const SCHEMA_PATH = path.join(process.cwd(), "src", "lib", "schema.sql");

const g = globalThis as unknown as { __foroDb?: Database.Database };

function open() {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.exec(fs.readFileSync(SCHEMA_PATH, "utf8"));
  migrate(db);
  ensureEnvAccounts(db);
  return db;
}

/** Cambios de esquema para bases creadas con versiones anteriores (no borran datos). */
function migrate(db: Database.Database) {
  const cols = db.prepare("PRAGMA table_info(answers)").all() as { name: string }[];
  if (!cols.some((c) => c.name === "parent_id")) {
    db.exec("ALTER TABLE answers ADD COLUMN parent_id INTEGER REFERENCES answers(id) ON DELETE CASCADE");
  }
  db.exec("CREATE INDEX IF NOT EXISTS idx_answers_parent ON answers(parent_id)");

  // Datos de usuario que se administran desde el panel (/admin/usuarios).
  const userCols = new Set((db.prepare("PRAGMA table_info(users)").all() as { name: string }[]).map((c) => c.name));
  if (!userCols.has("phone")) db.exec("ALTER TABLE users ADD COLUMN phone TEXT NOT NULL DEFAULT ''");
  if (!userCols.has("job_title")) db.exec("ALTER TABLE users ADD COLUMN job_title TEXT NOT NULL DEFAULT ''");
  if (!userCols.has("disabled")) db.exec("ALTER TABLE users ADD COLUMN disabled INTEGER NOT NULL DEFAULT 0");
  if (!userCols.has("last_login")) db.exec("ALTER TABLE users ADD COLUMN last_login INTEGER");
  // Superadministrador (soporte técnico): solo otro superadministrador puede modificar su cuenta.
  if (!userCols.has("is_super")) db.exec("ALTER TABLE users ADD COLUMN is_super INTEGER NOT NULL DEFAULT 0");

  // Imágenes de la web (public/images) que se quitaron de la biblioteca del panel.
  db.exec("CREATE TABLE IF NOT EXISTS cms_hidden_media (url TEXT PRIMARY KEY, hidden_at INTEGER NOT NULL)");

  // Productos del código que ya se llevaron a la base de datos (ver ensureSeeded en lib/cms/products.ts).
  db.exec("CREATE TABLE IF NOT EXISTS cms_product_seeds (slug TEXT PRIMARY KEY)");

  // Contraseñas de cuentas iniciales ya aplicadas desde variables de entorno (ver ensureEnvAccounts).
  db.exec("CREATE TABLE IF NOT EXISTS cms_bootstrap (key TEXT PRIMARY KEY, value TEXT NOT NULL, applied_at INTEGER NOT NULL)");
}

/* ---------- cuentas iniciales desde variables de entorno ---------- */

// Mismo formato que lib/auth.ts: "salHex:claveHex" con scrypt de 64 bytes.
const hashSync = (pw: string) => {
  const salt = randomBytes(16);
  return `${salt.toString("hex")}:${scryptSync(pw, salt, 64).toString("hex")}`;
};
const verifySync = (pw: string, stored: string) => {
  const [salt, key] = stored.split(":");
  if (!salt || !key) return false;
  const a = Buffer.from(key, "hex");
  const b = scryptSync(pw, Buffer.from(salt, "hex"), 64);
  return a.length === b.length && timingSafeEqual(a, b);
};

/**
 * Crea (o actualiza) las cuentas definidas en el servidor con variables de entorno, para que existan
 * apenas se despliega, sin entrar a la consola:
 *
 *   ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_NAME                 → administrador del cliente
 *   SUPERADMIN_EMAIL / SUPERADMIN_PASSWORD / SUPERADMIN_NAME  → soporte técnico (superadministrador)
 *
 * Cada contraseña se aplica UNA vez: si después se cambia desde el panel, reiniciar o volver a desplegar
 * no la pisa. Solo se vuelve a aplicar si cambia el valor de la variable.
 */
function ensureEnvAccounts(db: Database.Database) {
  const accounts = [
    { email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD, name: process.env.ADMIN_NAME || "Equipo Tu Embalaje", superAdmin: false },
    { email: process.env.SUPERADMIN_EMAIL, password: process.env.SUPERADMIN_PASSWORD, name: process.env.SUPERADMIN_NAME || "Soporte técnico", superAdmin: true },
  ];
  for (const a of accounts) {
    const email = a.email?.trim().toLowerCase();
    if (!email || !a.password) continue;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || a.password.length < 10) {
      console.warn(`[cuentas] Se ignoró ${email}: correo no válido o contraseña de menos de 10 caracteres.`);
      continue;
    }
    try {
      const key = `account:${email}`;
      const prev = db.prepare("SELECT value FROM cms_bootstrap WHERE key = ?").get(key) as { value: string } | undefined;
      const user = db.prepare("SELECT id FROM users WHERE email = ?").get(email) as { id: number } | undefined;
      const pending = !prev || !verifySync(a.password, prev.value);
      if (!user) {
        db.prepare("INSERT INTO users (name, email, password_hash, role, is_super, created_at) VALUES (?, ?, ?, 'admin', ?, ?)").run(
          a.name,
          email,
          hashSync(a.password),
          a.superAdmin ? 1 : 0,
          Date.now(),
        );
        console.log(`[cuentas] Cuenta creada: ${email}`);
      } else {
        // El superadministrador siempre conserva su rol (nadie más puede quitárselo).
        if (a.superAdmin) db.prepare("UPDATE users SET role = 'admin', is_super = 1, disabled = 0 WHERE id = ?").run(user.id);
        if (pending) {
          db.prepare("UPDATE users SET password_hash = ?, role = 'admin', disabled = 0 WHERE id = ?").run(hashSync(a.password), user.id);
          db.prepare("DELETE FROM sessions WHERE user_id = ?").run(user.id);
          console.log(`[cuentas] Contraseña actualizada: ${email}`);
        }
      }
      if (pending) {
        db.prepare(
          "INSERT INTO cms_bootstrap (key, value, applied_at) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, applied_at = excluded.applied_at",
        ).run(key, hashSync(a.password), Date.now());
      }
    } catch (e) {
      console.error(`[cuentas] No se pudo preparar ${email}:`, e);
    }
  }
}

/** Una sola conexión por proceso (también sobrevive al hot reload en desarrollo). */
export const db = (g.__foroDb ??= open());
// Con la conexión reutilizada en desarrollo, open() no vuelve a correr: las migraciones (rápidas e idempotentes) sí.
migrate(db);
