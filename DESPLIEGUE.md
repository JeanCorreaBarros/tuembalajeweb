# Despliegue en Hostinger VPS con Easypanel

La app se construye con el `Dockerfile` del repositorio. El foro guarda sus datos en SQLite
(`/app/data/foro.db`), así que **necesita un volumen** para no perder usuarios y preguntas al redesplegar.

## 1. Apuntar el dominio al VPS

En Hostinger → **Dominios → DNS / Nameservers** del dominio:

| Tipo | Nombre | Valor             |
| ---- | ------ | ----------------- |
| A    | `@`    | IP pública del VPS |
| A    | `www`  | IP pública del VPS |

La IP está en Hostinger → **VPS → Información general**. El cambio tarda de minutos a unas horas.

## 2. Crear la app en Easypanel

1. Entra a Easypanel (`http://IP-DEL-VPS:3000` la primera vez) → **Create Project** → `tuembalaje`.
2. **+ Service → App** → nombre `web`.
3. **Source → GitHub**: conecta tu cuenta y elige `JeanCorreaBarros/tuembalajeweb`, rama `main`, ruta `/`.
4. **Build → Dockerfile** (archivo: `Dockerfile`).

## 3. Variables de entorno (pestaña Environment)

```
ADMIN_EMAIL=tu-correo-de-administrador@tuembalaje.com
NEXT_PUBLIC_SITE_URL=https://tuembalaje.com
```

`NEXT_PUBLIC_SITE_URL` se usa **al compilar**: si Easypanel muestra una opción de *Build arguments*,
agrégala también ahí. Si tu dominio es otro (por ejemplo con `www`), cámbialo en ambos lugares.

## 4. Volumen para la base de datos (pestaña Mounts)

**Add Volume Mount** → Name: `foro-data` → Mount path: `/app/data`

Usa un **Volume** (no *Bind*): así hereda los permisos correctos del contenedor.

## 5. Dominio y HTTPS (pestaña Domains)

**Add Domain** → `tuembalaje.com` → **HTTPS activado** → Port: `3000`.
Repite con `www.tuembalaje.com` (o configúralo como redirección al dominio principal).
Easypanel genera el certificado SSL (Let's Encrypt) automáticamente.

## 6. Desplegar

Pulsa **Deploy**. La primera vez tarda unos minutos (instala dependencias y compila).
Activa **Auto Deploy** para que cada `git push` a `main` se publique solo.

## 7. Crear el administrador del foro

En el servicio → **Console** (terminal del contenedor):

```bash
node scripts/admin.mjs tu-correo@tuembalaje.com "Equipo Tu Embalaje" "UnaClaveSegura123"
```

Si no pones contraseña, se genera una y **se muestra una sola vez** en la consola.

## Copias de seguridad

Toda la información del foro está en el volumen `foro-data` (`/app/data/foro.db`).
Haz respaldos periódicos desde Easypanel (Backups del volumen) o copiando ese archivo.

## Probar la imagen en tu PC (opcional, requiere Docker Desktop)

```bash
docker build -t tuembalaje .
docker run -p 3000:3000 -v tuembalaje-data:/app/data -e ADMIN_EMAIL=tu@correo.com tuembalaje
```
