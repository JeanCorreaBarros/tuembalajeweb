import { ExternalLink, FileCode2, Gauge, Map as MapIcon, SearchCheck } from "lucide-react";
import { connection } from "next/server";
import { ScoreRing } from "@/components/admin/SeoPreview";
import PageEditorView from "@/components/admin/PageEditorView";
import { SEO_PAGES, type SeoPageId } from "@/lib/cms/pages";
import { fullSeoTitle, seoChecks, seoScore, STATE_LABEL, type SeoValues } from "@/lib/cms/seo-score";
import { readPageContent } from "@/lib/cms/store";
import { SITE } from "@/lib/site";

// El panel depende de la sesión en cada pantalla: no se navega «al instante» (lo indica Next en desarrollo).
export const instant = false;

export const metadata = { title: "SEO" };

const STATE_TEXT = { good: "text-brand-dark", ok: "text-amber-700", bad: "text-red-600" } as const;

export default async function SeoPage() {
  await connection();
  const seo = readPageContent("seo") as unknown as Record<string, SeoValues> & { general: { suffix: string } };
  const rows = (Object.keys(SEO_PAGES) as SeoPageId[]).map((id) => {
    const v = seo[id];
    const checks = seoChecks(v, fullSeoTitle(id === "inicio", v.title, seo.general.suffix));
    return { id, ...SEO_PAGES[id], ...seoScore(checks), issues: checks.filter((c) => c.state !== "good").length, noindex: v.noindex };
  });
  const avg = Math.round(rows.reduce((s, r) => s + r.score, 0) / rows.length);
  const avgState = avg >= 80 ? "good" : avg >= 50 ? "ok" : "bad";

  const tools = [
    { href: "/sitemap.xml", label: "Mapa del sitio", text: "La lista de páginas que lee Google", icon: MapIcon },
    { href: "/robots.txt", label: "robots.txt", text: "Qué pueden rastrear los buscadores", icon: FileCode2 },
    { href: "https://search.google.com/search-console", label: "Google Search Console", text: "Cómo te ve Google y con qué búsquedas", icon: SearchCheck },
    {
      href: `https://pagespeed.web.dev/analysis?url=${encodeURIComponent(SITE.url)}`,
      label: "Velocidad (PageSpeed)",
      text: "Rendimiento en celular y computador",
      icon: Gauge,
    },
  ];

  const intro = (
    <div className="mb-7 space-y-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
        <div className="flex items-center gap-4 rounded-3xl bg-forest-dark p-5 text-white">
          <div className="rounded-full bg-white p-1">
            <ScoreRing score={avg} state={avgState} size={72} />
          </div>
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-wider text-white/55">Puntaje general</p>
            <p className="text-[20px] font-extrabold">{STATE_LABEL[avgState]}</p>
            <p className="text-[12px] text-white/60">Promedio de {rows.length} páginas</p>
          </div>
        </div>
        <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {rows.map((r) => (
            <li key={r.id}>
              <a
                href={`#${r.id}`}
                className="flex h-full flex-col gap-1 rounded-2xl bg-white p-3.5 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:ring-brand/40"
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="truncate text-[13px] font-bold text-forest-dark">{r.label}</span>
                  <span className={`text-[15px] font-extrabold tabular-nums ${STATE_TEXT[r.state]}`}>{r.score}</span>
                </span>
                <span className="h-1.5 overflow-hidden rounded-full bg-black/[0.06]">
                  <span
                    className={`block h-full rounded-full ${r.state === "good" ? "bg-brand" : r.state === "ok" ? "bg-amber-400" : "bg-red-500"}`}
                    style={{ width: `${r.score}%` }}
                  />
                </span>
                <span className="text-[11px] text-ink/50">
                  {r.noindex ? "Oculta de Google" : r.issues ? `${r.issues} ${r.issues === 1 ? "sugerencia" : "sugerencias"}` : "Todo en orden"}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
      <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
        {tools.map(({ href, label, text, icon: Icon }) => (
          <li key={href}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 rounded-2xl border border-dashed border-black/10 px-3.5 py-3 transition hover:border-brand/50 hover:bg-white"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand-dark">
                <Icon className="h-[18px] w-[18px]" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-bold text-forest-dark">{label}</span>
                <span className="block truncate text-[11px] text-ink/50">{text}</span>
              </span>
              <ExternalLink className="h-3.5 w-3.5 shrink-0 text-ink/30 group-hover:text-brand" aria-hidden />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );

  return <PageEditorView pageId="seo" help="/admin/ayuda#seo" intro={intro} />;
}
