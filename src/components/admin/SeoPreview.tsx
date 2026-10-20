"use client";

import { AlertTriangle, CheckCircle2, Globe, MoreVertical, XCircle } from "lucide-react";
import { useState } from "react";
import { fullSeoTitle, seoChecks, seoScore, STATE_LABEL, type CheckState, type SeoValues } from "@/lib/cms/seo-score";

export type SeoPreviewContext = {
  /** Dominio público, sin "/" final (https://tuembalaje.com). */
  siteUrl: string;
  path: string;
  isHome: boolean;
  /** Final de marca que se agrega a los títulos (menos en Inicio). */
  suffix: string;
  /** Imagen general al compartir (vacía = imagen de marca automática). */
  fallbackImage: string;
};

const STATE_STYLE: Record<CheckState, { ring: string; text: string; bg: string }> = {
  good: { ring: "#1fb34a", text: "text-brand-dark", bg: "bg-brand/10" },
  ok: { ring: "#f59e0b", text: "text-amber-700", bg: "bg-amber-50" },
  bad: { ring: "#ef4444", text: "text-red-600", bg: "bg-red-50" },
};

const ICON = { good: CheckCircle2, ok: AlertTriangle, bad: XCircle };
const ICON_CLS = { good: "text-brand", ok: "text-amber-500", bad: "text-red-500" };

/** Círculo con el puntaje (0–100). */
export function ScoreRing({ score, state, size = 56 }: { score: number; state: CheckState; size?: number }) {
  const r = (size - 6) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0" aria-hidden>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth="5" className="text-black/[0.07]" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={STATE_STYLE[state].ring}
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={`${(score / 100) * c} ${c}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" className="fill-forest-dark text-[15px] font-extrabold">
        {score}
      </text>
    </svg>
  );
}

/** Vista previa en Google y al compartir, con la revisión SEO. Se actualiza mientras se escribe. */
export default function SeoPreview({ values, ctx }: { values: SeoValues; ctx: SeoPreviewContext }) {
  const [tab, setTab] = useState<"google" | "redes">("google");
  const title = fullSeoTitle(ctx.isHome, values.title, ctx.suffix);
  const checks = seoChecks(values, title);
  const { score, state } = seoScore(checks);
  const host = ctx.siteUrl.replace(/^https?:\/\//, "");
  const crumbs = ctx.path === "/" ? "" : ctx.path.split("/").filter(Boolean).join(" › ");
  const image = values.image || ctx.fallbackImage || "/og";

  return (
    <div className="space-y-5">
      {/* Puntaje */}
      <div className={`flex items-center gap-3.5 rounded-2xl p-3.5 ${STATE_STYLE[state].bg}`}>
        <ScoreRing score={score} state={state} />
        <div className="min-w-0">
          <p className={`text-[14px] font-extrabold ${STATE_STYLE[state].text}`}>SEO: {STATE_LABEL[state]}</p>
          <p className="text-[12px] leading-snug text-ink/60">
            {checks.filter((c) => c.state === "good").length} de {checks.length} puntos en verde. Se actualiza mientras escribes.
          </p>
        </div>
      </div>

      {/* Vistas previas */}
      <div>
        <div className="mb-2.5 flex rounded-full bg-white p-1 ring-1 ring-black/5" role="tablist" aria-label="Vista previa">
          {(
            [
              ["google", "En Google"],
              ["redes", "Al compartir"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className={`flex-1 rounded-full px-3 py-1.5 text-[12px] font-bold transition ${tab === id ? "bg-forest-dark text-white" : "text-ink/55 hover:text-forest-dark"}`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "google" ? (
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5" style={{ fontFamily: "Arial, sans-serif" }}>
            <div className="flex items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element -- favicon del sitio */}
              <img src="/icon" alt="" className="h-7 w-7 rounded-full bg-mist p-1 ring-1 ring-black/5" />
              <div className="min-w-0 flex-1 leading-tight">
                <p className="truncate text-[14px] text-[#202124]">Tu Embalaje</p>
                <p className="truncate text-[12px] text-[#4d5156]">
                  {host}
                  {crumbs && ` › ${crumbs}`}
                </p>
              </div>
              <MoreVertical className="h-4 w-4 text-[#70757a]" aria-hidden />
            </div>
            <p className="mt-2 line-clamp-2 text-[19px] leading-[1.3] text-[#1a0dab]">{title || "Escribe un título"}</p>
            <p className="mt-1 line-clamp-3 text-[13px] leading-[1.55] text-[#4d5156]">{values.description || "Escribe una descripción para invitar a hacer clic."}</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
            <div className="relative aspect-[1.91/1] bg-mist">
              {/* eslint-disable-next-line @next/next/no-img-element -- vista previa del panel */}
              <img src={image} alt="" className="h-full w-full object-cover" />
              {!values.image && (
                <span className="absolute left-2 top-2 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur">
                  Imagen general
                </span>
              )}
            </div>
            <div className="border-t border-black/5 bg-[#f0f2f5] px-3.5 py-3">
              <p className="flex items-center gap-1 text-[11px] uppercase tracking-wide text-ink/50">
                <Globe className="h-3 w-3" aria-hidden /> {host}
              </p>
              <p className="mt-0.5 line-clamp-2 text-[14px] font-bold leading-snug text-[#050505]">{title || "Sin título"}</p>
              <p className="mt-0.5 line-clamp-2 text-[12px] leading-snug text-ink/60">{values.description}</p>
            </div>
          </div>
        )}
        <p className="mt-2 text-[11px] text-ink/40">Vista aproximada: cada buscador o red puede mostrarlo un poco distinto.</p>
      </div>

      {/* Revisión */}
      <div>
        <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.12em] text-ink/45">Revisión</p>
        <ul className="space-y-2">
          {checks.map((c) => {
            const Icon = ICON[c.state];
            return (
              <li key={c.id} className="flex items-start gap-2.5 text-[12.5px] leading-snug text-ink/75">
                <Icon className={`mt-px h-4 w-4 shrink-0 ${ICON_CLS[c.state]}`} aria-hidden />
                {c.text}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
