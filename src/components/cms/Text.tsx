import Link from "next/link";
import { Fragment, type ReactNode } from "react";

/**
 * Texto con saltos de línea (Enter en el panel) convertidos en <br>.
 * `brClassName` permite, por ejemplo, saltar de línea solo en pantallas grandes ("hidden sm:block").
 */
export function Lines({ text, brClassName }: { text: string; brClassName?: string }) {
  const parts = text.split("\n");
  return (
    <>
      {parts.map((p, i) => (
        <Fragment key={i}>
          {i > 0 && (brClassName ? <br className={brClassName} /> : <br />)}
          {i > 0 && brClassName ? " " : null}
          {p}
        </Fragment>
      ))}
    </>
  );
}

/** Texto donde lo escrito *entre asteriscos* se muestra resaltado (verde por defecto). */
export function Highlight({ text, className = "text-lime" }: { text: string; className?: string }) {
  const parts = text.split(/\*([^*]+)\*/g);
  return (
    <>
      {parts.map((p, i) =>
        i % 2 ? (
          <span key={i} className={className}>
            {p}
          </span>
        ) : (
          <Lines key={i} text={p} />
        ),
      )}
    </>
  );
}

/** Quita los *asteriscos* de resaltado (para títulos en texto plano, como el de la pestaña). */
export const plain = (text: string) => text.replace(/\*([^*]+)\*/g, "$1").replace(/\s*\n\s*/g, " ");

/* ---------- texto con formato simple (documentos legales) ---------- */

/** **negrita** y [texto](enlace) dentro de una línea. */
function inline(text: string, keyBase: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  const linkCls = "font-semibold text-brand-dark underline decoration-brand/40 underline-offset-2 hover:decoration-brand";
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1] !== undefined) {
      out.push(
        <strong key={`${keyBase}-${k++}`} className="font-bold text-forest-dark">
          {m[1]}
        </strong>,
      );
    } else {
      const href = m[3];
      const safe = /^(https?:|mailto:|tel:|\/)/.test(href) ? href : "#";
      out.push(
        safe.startsWith("/") ? (
          <Link key={`${keyBase}-${k++}`} href={safe} className={linkCls}>
            {m[2]}
          </Link>
        ) : (
          <a
            key={`${keyBase}-${k++}`}
            href={safe}
            className={linkCls}
            {...(safe.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {m[2]}
          </a>
        ),
      );
    }
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/**
 * Formato simple: bloques separados por línea en blanco; líneas con «- » forman una lista;
 * un bloque que empieza con «> » es un recuadro destacado. `vars` reemplaza {variables}.
 */
export function RichText({ text, vars = {} }: { text: string; vars?: Record<string, string> }) {
  const filled = text.replace(/\{(\w+)\}/g, (all, name: string) => (name in vars ? vars[name] : all));
  const blocks = filled.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  return (
    <>
      {blocks.map((b, i) => {
        const lines = b.split("\n");
        if (lines.every((l) => l.trim().startsWith("- "))) {
          return (
            <ul key={i} className="mt-3 space-y-2 text-[15px] leading-[1.7] text-ink/75">
              {lines.map((l, j) => (
                <li key={j} className="flex gap-3">
                  <span aria-hidden className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                  <span>{inline(l.trim().slice(2), `${i}-${j}`)}</span>
                </li>
              ))}
            </ul>
          );
        }
        if (b.startsWith(">")) {
          return (
            <div
              key={i}
              className="mt-4 rounded-2xl border-l-4 border-brand bg-brand/[0.06] px-5 py-4 text-[14px] leading-relaxed text-ink/80"
            >
              {inline(lines.map((l) => l.replace(/^>\s?/, "")).join(" "), `${i}`)}
            </div>
          );
        }
        return (
          <p key={i} className="mt-3 text-[15px] leading-[1.8] text-ink/75">
            {lines.map((l, j) => (
              <Fragment key={j}>
                {j > 0 && <br />}
                {inline(l, `${i}-${j}`)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </>
  );
}
