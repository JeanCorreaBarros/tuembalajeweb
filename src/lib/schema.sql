-- Esquema del foro (SQLite). Lo usan la app (src/lib/db.ts) y el script scripts/admin.mjs.

CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT    NOT NULL,
  email         TEXT    NOT NULL UNIQUE,
  password_hash TEXT    NOT NULL,
  role          TEXT    NOT NULL DEFAULT 'user' CHECK (role IN ('user','admin')),
  created_at    INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT    PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS questions (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category    TEXT    NOT NULL,
  title       TEXT    NOT NULL,
  body        TEXT    NOT NULL,
  views       INTEGER NOT NULL DEFAULT 0,
  accepted_id INTEGER,
  created_at  INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS answers (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  parent_id   INTEGER REFERENCES answers(id) ON DELETE CASCADE, -- comentario al que responde (NULL = respuesta directa)
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  body        TEXT    NOT NULL,
  created_at  INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS votes (
  answer_id INTEGER NOT NULL REFERENCES answers(id) ON DELETE CASCADE,
  user_id   INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (answer_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_questions_created  ON questions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_questions_category ON questions(category);
CREATE INDEX IF NOT EXISTS idx_answers_question   ON answers(question_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires   ON sessions(expires_at);

/* ---------- Panel administrativo (CMS) ---------- */

-- Contenido editable: una fila por sección ("inicio.hero", "ajustes.general"…), valores en JSON.
-- Si una sección no tiene fila, la web usa los textos por defecto del código.
CREATE TABLE IF NOT EXISTS cms_content (
  key        TEXT    PRIMARY KEY,
  value      TEXT    NOT NULL,
  updated_at INTEGER NOT NULL,
  updated_by INTEGER REFERENCES users(id) ON DELETE SET NULL
);

-- Productos del catálogo (se llenan con los productos actuales la primera vez).
CREATE TABLE IF NOT EXISTS cms_products (
  slug       TEXT    PRIMARY KEY,
  position   INTEGER NOT NULL DEFAULT 0,
  data       TEXT    NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Imágenes subidas desde el panel (los archivos viven en <carpeta de datos>/uploads).
CREATE TABLE IF NOT EXISTS cms_media (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  filename      TEXT    NOT NULL UNIQUE,
  original_name TEXT    NOT NULL,
  alt           TEXT    NOT NULL DEFAULT '',
  width         INTEGER NOT NULL,
  height        INTEGER NOT NULL,
  size          INTEGER NOT NULL,
  created_at    INTEGER NOT NULL,
  uploaded_by   INTEGER REFERENCES users(id) ON DELETE SET NULL
);

-- Historial: copia de cada versión guardada (contenido o producto) para poder restaurarla.
CREATE TABLE IF NOT EXISTS cms_revisions (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  key        TEXT    NOT NULL,            -- "inicio.hero", "producto:cajas-madera"…
  label      TEXT    NOT NULL,            -- descripción legible del cambio
  value      TEXT,                        -- JSON guardado (NULL = eliminado)
  created_at INTEGER NOT NULL,
  user_id    INTEGER REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_cms_revisions_key     ON cms_revisions(key, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cms_revisions_created ON cms_revisions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cms_media_created     ON cms_media(created_at DESC);
