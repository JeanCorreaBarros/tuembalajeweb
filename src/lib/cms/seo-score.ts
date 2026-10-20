/** Largos recomendados de título y descripción (en caracteres). */
export const SEO_LIMITS = { title: [30, 60], description: [120, 160] } as const;

/*
 * Revisión SEO de una página (como la de Yoast o Rank Math): una lista de comprobaciones con
 * su estado y un puntaje de 0 a 100. Sin dependencias de servidor: la usa el editor en vivo.
 */

export type SeoValues = { keyword: string; title: string; description: string; image: string; noindex: boolean };
export type CheckState = "good" | "ok" | "bad";
export type SeoCheck = { id: string; state: CheckState; text: string };

/** Título completo: el de Inicio va tal cual; los demás llevan el final de marca ("| Tu Embalaje"). */
export function fullSeoTitle(isHome: boolean, title: string, suffix: string) {
  const s = suffix.trim();
  return isHome || !s ? title.trim() : `${title.trim()} ${s}`;
}

/** Minúsculas y sin tildes, para comparar frases. */
const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, " ")
    .trim();

function lengthCheck(id: string, name: string, len: number, [min, max]: readonly [number, number]): SeoCheck {
  if (len === 0) return { id, state: "bad", text: `Falta ${name}.` };
  if (len < min) return { id, state: "ok", text: `${cap(name)} es corto (${len} caracteres). Lo ideal: entre ${min} y ${max}.` };
  if (len > max + 10) return { id, state: "bad", text: `${cap(name)} es muy largo (${len}). Google lo cortará; lo ideal: hasta ${max}.` };
  if (len > max) return { id, state: "ok", text: `${cap(name)} es un poco largo (${len}). Lo ideal: hasta ${max}.` };
  return { id, state: "good", text: `${cap(name)} tiene un buen largo (${len} caracteres).` };
}

const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

export function seoChecks(v: SeoValues, fullTitle: string): SeoCheck[] {
  const kw = norm(v.keyword);
  const checks: SeoCheck[] = [];
  if (v.noindex) checks.push({ id: "noindex", state: "bad", text: "La página está oculta de Google (opción «Ocultar esta página»)." });

  checks.push(lengthCheck("title", "el título", fullTitle.trim().length, SEO_LIMITS.title));
  checks.push(lengthCheck("description", "la descripción", v.description.trim().length, SEO_LIMITS.description));

  if (!kw) {
    checks.push({ id: "keyword", state: "ok", text: "Define una palabra clave principal para revisar si la usas bien." });
  } else {
    const t = norm(v.title);
    checks.push(
      t.includes(kw)
        ? t.startsWith(kw) || t.indexOf(kw) < t.length / 2
          ? { id: "kw-title", state: "good", text: "La palabra clave está en el título, cerca del inicio." }
          : { id: "kw-title", state: "ok", text: "La palabra clave está en el título; mejor si va más al inicio." }
        : { id: "kw-title", state: "bad", text: "La palabra clave no aparece en el título." },
    );
    checks.push(
      norm(v.description).includes(kw)
        ? { id: "kw-desc", state: "good", text: "La palabra clave aparece en la descripción." }
        : { id: "kw-desc", state: "bad", text: "La palabra clave no aparece en la descripción." },
    );
  }
  checks.push(
    v.image
      ? { id: "image", state: "good", text: "Tiene imagen propia para compartir en redes." }
      : { id: "image", state: "good", text: "Al compartir se usa la imagen general del sitio." },
  );
  return checks;
}

const WEIGHT: Record<CheckState, number> = { good: 1, ok: 0.5, bad: 0 };

export function seoScore(checks: SeoCheck[]) {
  const score = Math.round((checks.reduce((s, c) => s + WEIGHT[c.state], 0) / checks.length) * 100);
  const state: CheckState = checks.some((c) => c.id === "noindex") ? "bad" : score >= 80 ? "good" : score >= 50 ? "ok" : "bad";
  return { score, state };
}

export const STATE_LABEL: Record<CheckState, string> = { good: "Bien", ok: "Mejorable", bad: "Revisar" };
