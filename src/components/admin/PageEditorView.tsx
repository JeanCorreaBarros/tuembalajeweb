import { ExternalLink } from "lucide-react";
import { CMS_PAGES, type CmsPageId } from "@/lib/cms/pages";
import type { Field } from "@/lib/cms/schema";
import { readPageContent, sectionUpdates } from "@/lib/cms/store";
import { AdminHeader } from "./AdminShell";
import SectionEditor from "./SectionEditor";

/** Editor completo de una página del CMS: índice de secciones + un formulario por sección. */
export default function PageEditorView({ pageId }: { pageId: CmsPageId }) {
  const page = CMS_PAGES[pageId];
  const values = readPageContent(pageId) as Record<string, Record<string, unknown>>;
  const updates = sectionUpdates(pageId);
  const sections = Object.entries(page.sections) as [string, { title: string; description?: string; fields: Field[]; defaults: Record<string, unknown> }][];

  return (
    <>
      <AdminHeader
        title={page.title}
        description={page.description}
        actions={
          "path" in page && page.path ? (
            <a
              href={page.path}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-4 py-2 text-[12px] font-bold text-forest-dark transition hover:border-brand hover:text-brand-dark"
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden /> Ver en el sitio
            </a>
          ) : null
        }
      />

      {sections.length > 1 && (
        <nav aria-label="Secciones" className="no-scrollbar -mx-4 mb-5 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
          {sections.map(([id, s]) => (
            <a
              key={id}
              href={`#${id}`}
              className="shrink-0 rounded-full bg-white px-3.5 py-2 text-[12px] font-semibold text-ink/65 shadow-sm ring-1 ring-black/5 transition hover:text-forest-dark hover:ring-brand/40"
            >
              {s.title}
            </a>
          ))}
        </nav>
      )}

      <div className="space-y-6">
        {sections.map(([id, s]) => (
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
          />
        ))}
      </div>
    </>
  );
}
