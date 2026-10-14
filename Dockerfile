# Imagen de producción de Tu Embalaje (Next.js + SQLite) para Easypanel / cualquier servidor con Docker.
#
#   docker build -t tuembalaje .
#   docker run -p 3000:3000 -v tuembalaje-data:/app/data tuembalaje
#
# La base de datos del foro vive en /app/data: monta ahí un VOLUMEN para no perderla al redesplegar.

# ---------- 1. Dependencias (incluye compilar better-sqlite3 si no hay binario precompilado) ----------
FROM node:22-bookworm-slim AS deps
WORKDIR /app
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm ci

# ---------- 2. Build ----------
FROM node:22-bookworm-slim AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
# Dominio público: se fija al compilar (sitemap, Open Graph, URLs canónicas).
ARG NEXT_PUBLIC_SITE_URL=https://tuembalaje.com
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---------- 3. Ejecución (solo el servidor standalone, sin código fuente ni dependencias de desarrollo) ----------
FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production \
  NEXT_TELEMETRY_DISABLED=1 \
  PORT=3000 \
  HOSTNAME=0.0.0.0 \
  DATABASE_PATH=/app/data/foro.db

COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public
# Esquema del foro y script para crear el administrador (npm run admin dentro del contenedor).
COPY --from=build --chown=node:node /app/src/lib/schema.sql ./src/lib/schema.sql
COPY --from=build --chown=node:node /app/scripts ./scripts

# Carpeta de la base de datos, propiedad del usuario sin privilegios. Un volumen de Docker vacío
# montado aquí hereda estos permisos la primera vez.
RUN mkdir -p /app/data && chown node:node /app/data
VOLUME ["/app/data"]

USER node
EXPOSE 3000
# start.mjs inicia server.js y, al arrancar, sincroniza las páginas con lo guardado en el panel (/admin).
CMD ["node", "scripts/start.mjs"]
