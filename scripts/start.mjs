/**
 * Arranque en producción (Docker / Easypanel): inicia el servidor de Next y, cuando responde,
 * le pide descartar las páginas generadas al compilar para que muestren el contenido guardado
 * en la base de datos del volumen (lo editado en /admin).
 *
 *   node scripts/start.mjs
 */
import { spawn } from "node:child_process";
import { randomBytes } from "node:crypto";
import { existsSync } from "node:fs";

const token = randomBytes(24).toString("hex");
const port = process.env.PORT || "3000";
const server = existsSync("server.js") ? "server.js" : ".next/standalone/server.js";

const child = spawn(process.execPath, [server], {
  stdio: "inherit",
  env: { ...process.env, CMS_BOOT_TOKEN: token },
});
for (const sig of ["SIGTERM", "SIGINT"]) process.on(sig, () => child.kill(sig));
child.on("exit", (code) => process.exit(code ?? 0));

for (let i = 0; i < 60; i++) {
  await new Promise((r) => setTimeout(r, 1000));
  try {
    const res = await fetch(`http://127.0.0.1:${port}/api/cms/boot`, {
      method: "POST",
      headers: { "x-boot-token": token },
    });
    if (res.ok) {
      console.log("[cms] contenido sincronizado con la base de datos");
      break;
    }
  } catch {
    // el servidor todavía no responde
  }
}
