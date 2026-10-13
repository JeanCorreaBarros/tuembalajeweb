/**
 * Crea el usuario administrador del foro, o le cambia la contraseña si ya existe.
 *
 *   npm run admin                      -> usa ADMIN_EMAIL de .env.local y genera una contraseña
 *   npm run admin -- correo@x.com      -> otro correo
 *   npm run admin -- correo@x.com "Mi Nombre" "MiClaveSegura123"
 *
 * Si no indicas contraseña, se genera una y se guarda en .env.local como ADMIN_PASSWORD
 * (ese archivo no se sube a GitHub). Ingresa en /foro/ingresar con ese correo y clave.
 */
import Database from "better-sqlite3";
import { randomBytes, scrypt } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const envPath = path.join(root, ".env.local");

function readEnv() {
  if (!fs.existsSync(envPath)) return {};
  return Object.fromEntries(
    fs
      .readFileSync(envPath, "utf8")
      .split(/\r?\n/)
      .filter((l) => l.includes("=") && !l.trim().startsWith("#"))
      .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()]),
  );
}

function setEnv(key, value) {
  const lines = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8").split(/\r?\n/) : [];
  const i = lines.findIndex((l) => l.startsWith(`${key}=`));
  if (i >= 0) lines[i] = `${key}=${value}`;
  else lines.push(`${key}=${value}`);
  fs.writeFileSync(envPath, lines.filter((l, n) => l !== "" || n < lines.length - 1).join("\n") + "\n");
}

// Mismo formato que src/lib/auth.ts: "salHex:claveHex" con scrypt de 64 bytes.
const hashPassword = (password) =>
  new Promise((resolve, reject) => {
    const salt = randomBytes(16);
    scrypt(password, salt, 64, (err, key) =>
      err ? reject(err) : resolve(`${salt.toString("hex")}:${key.toString("hex")}`),
    );
  });

// .env.local (en tu PC) o variables de entorno del servidor (en Easypanel/Docker no hay .env.local).
const env = { ...process.env, ...readEnv() };
const [argEmail, argName, argPassword] = process.argv.slice(2);
const email = (argEmail ?? env.ADMIN_EMAIL ?? "").trim().toLowerCase();
const name = argName ?? "Equipo Tu Embalaje";

if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
  console.error("Indica un correo válido: npm run admin -- correo@ejemplo.com  (o define ADMIN_EMAIL en .env.local)");
  process.exit(1);
}
if (argPassword && argPassword.length < 8) {
  console.error("La contraseña debe tener al menos 8 caracteres.");
  process.exit(1);
}

const generated = !argPassword;
const password = argPassword ?? randomBytes(9).toString("base64url"); // 12 caracteres

const dbPath = env.DATABASE_PATH || path.join(root, "data", "foro.db");
fs.mkdirSync(path.dirname(dbPath), { recursive: true });
const db = new Database(dbPath);
db.pragma("foreign_keys = ON");
db.exec(fs.readFileSync(path.join(root, "src", "lib", "schema.sql"), "utf8"));

const hash = await hashPassword(password);
const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);

if (existing) {
  db.prepare("UPDATE users SET password_hash = ?, role = 'admin' WHERE id = ?").run(hash, existing.id);
  db.prepare("DELETE FROM sessions WHERE user_id = ?").run(existing.id); // cierra sesiones anteriores
  console.log(`Administrador actualizado: ${email}`);
} else {
  db.prepare("INSERT INTO users (name, email, password_hash, role, created_at) VALUES (?, ?, ?, 'admin', ?)").run(
    name,
    email,
    hash,
    Date.now(),
  );
  console.log(`Administrador creado: ${email}`);
}

db.close();

// En el servidor (Docker) no se puede escribir .env.local: en ese caso la contraseña se muestra aquí.
let saved = false;
try {
  setEnv("ADMIN_EMAIL", email);
  if (generated) setEnv("ADMIN_PASSWORD", password);
  saved = true;
} catch {
  saved = false;
}

if (!generated) console.log("Contraseña establecida.");
else if (saved) console.log("Contraseña generada y guardada en .env.local (ADMIN_PASSWORD).");
else console.log(`Contraseña generada (guárdala, no se volverá a mostrar): ${password}`);
