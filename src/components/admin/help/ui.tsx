import { AlertTriangle, Lightbulb } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

/* Piezas de texto de la Guía de uso. */

export function P({ children }: { children: ReactNode }) {
  return <p className="text-[14px] leading-relaxed text-ink/75">{children}</p>;
}

export function H({ children }: { children: ReactNode }) {
  return <h3 className="pt-2 text-[15px] font-extrabold text-forest-dark">{children}</h3>;
}

export function Steps({ items }: { items: ReactNode[] }) {
  return (
    <ol className="space-y-2.5">
      {items.map((it, i) => (
        <li key={i} className="flex gap-3 text-[14px] leading-relaxed text-ink/75">
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-[12px] font-bold text-white">{i + 1}</span>
          <span className="min-w-0">{it}</span>
        </li>
      ))}
    </ol>
  );
}

export function List({ items }: { items: ReactNode[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((it, i) => (
        <li key={i} className="flex gap-2.5 text-[14px] leading-relaxed text-ink/75">
          <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden />
          <span className="min-w-0">{it}</span>
        </li>
      ))}
    </ul>
  );
}

export function Tip({ children, warn = false }: { children: ReactNode; warn?: boolean }) {
  const Icon = warn ? AlertTriangle : Lightbulb;
  return (
    <div className={`flex gap-3 rounded-2xl px-4 py-3.5 text-[13.5px] leading-relaxed ${warn ? "bg-amber-50 text-amber-900" : "bg-brand/[0.08] text-forest-dark"}`}>
      <Icon className={`mt-0.5 h-[18px] w-[18px] shrink-0 ${warn ? "text-amber-500" : "text-brand"}`} aria-hidden />
      <div className="min-w-0">{children}</div>
    </div>
  );
}

export function Table({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="overflow-x-auto rounded-2xl ring-1 ring-black/5">
      <table className="w-full min-w-[480px] text-left text-[13px]">
        <thead className="bg-mist text-[11px] uppercase tracking-wider text-ink/55">
          <tr>
            {head.map((h) => (
              <th key={h} className="px-4 py-2.5 font-bold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-black/5 bg-white">
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td key={j} className={`px-4 py-2.5 align-top ${j === 0 ? "font-semibold text-forest-dark" : "text-ink/70"}`}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Texto de ejemplo, como se escribe en el panel. */
export function C({ children }: { children: ReactNode }) {
  return <code className="rounded-md bg-mist px-1.5 py-0.5 font-mono text-[12.5px] text-forest-dark">{children}</code>;
}

/** Enlace a otra pantalla del panel. */
export function Go({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="font-semibold text-brand-dark underline decoration-brand/30 underline-offset-2 hover:decoration-brand">
      {children}
    </Link>
  );
}
