import { ExternalLink } from "lucide-react";
import type { ReactNode } from "react";
import { CMS_PAGES, SEO_PAGES, type CmsPageId, type SeoPageId } from "@/lib/cms/pages";
import type { Field } from "@/lib/cms/schema";
import { fullSeoTitle, seoChecks, seoScore, type SeoValues } from "@/lib/cms/seo-score";
import { readPageContent, sectionUpdates } from "@/lib/cms/store";
import { SITE } from "@/lib/site";
import { AdminHeader, HelpLink } from "./AdminShell";
import EditorTabs, { type EditorTab } from "./EditorTabs";
import SectionEditor from "./SectionEditor";
import type { SeoPreviewContext } from "./SeoPreview";

type SectionDefLike = { title: string; description?: string; fields: Field[]; defaults: Record<string, unknown> };

const SCORE_DOT = { good: "bg-brand", ok: "bg-amber-400", bad: "bg-red-500" } as const;

/** Editor completo de una página del CMS: índice de secciones + un formulario por sección. */
export default function PageEditorView({ pageId, help, intro }: { pageId: CmsPageId; help?: string; intro?: ReactNode }) {
  const page = CMS_PAGES[pageId];
  const values = readPageContent(pageId) as Record<string, Record<string, unknown>>;
  const updates = sectionUpdates(pageId);
  const sections = Object.entries(page.sections) as [string, SectionDefLike][];

  // En la página de SEO, cada sección (menos la general) lleva vista previa y puntaje.
  const seoCtx = (id: string): SeoPreviewContext | undefined => {
    if (pageId !== "seo" || !(id in SEO_PAGES)) return undefined;
    const general = values.general as { suffix: string; shareImage: string };
    return { siteUrl: SITE.url, path: SEO_PAGES[id as SeoPageId].path, isHome: id === "inicio", suffix: general.suffix, fallbackImage: general.shareImage };
  };

  const tabs: EditorTab[] = sections.map(([id, s]) => {
    const ctx = seoCtx(id);
    let badge: ReactNode;
    if (ctx) {
      const v = values[id] as SeoValues;
      const { score, state } = seoScore(seoChecks(v, fullSeoTitle(ctx.isHome, v.title, ctx.suffix)));
      badge = (
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-black/[0.06] px-1.5 py-0.5 text-[10px] font-bold tabular-nums">
          <span className={`h-1.5 w-1.5 rounded-full ${SCORE_DOT[state]}`} aria-hidden /> {score}
        </span>
      );
    }
    return { id, title: s.title, edited: Boolean(updates[id]), badge };
  });

  const panels = sections.map(([id, s]) => (
    <SectionEditor
      key={id}
      pageId={pageId}
      sectionId={id}
      title={s.title}
      description={s.description}
      fields={s.fields}
      initial={values[id]}
      defaults={s.defaults}
      updated={updates[id]}
      seo={seoCtx(id)}
    />
  ));

  return (
    <>
      <AdminHeader
        title={page.title}
        description={page.description}
        actions={
          <>
            {help && <HelpLink href={help} />}
            {"path" in page && page.path ? (
              <a
                href={page.path}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-4 py-2 text-[12px] font-bold text-forest-dark transition hover:border-brand hover:text-brand-dark"
              >
                <ExternalLink className="h-3.5 w-3.5" aria-hidden /> Ver en el sitio
              </a>
            ) : null}
          </>
        }
      />
      {intro}
      <EditorTabs tabs={tabs} panels={panels} layout={pageId === "seo" ? "top" : "side"} />
    </>
  );
}
