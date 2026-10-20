"use client";

import { CheckCircle2, Loader2, RotateCcw, Save } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { resetSectionAction, saveSectionAction } from "@/app/admin/actions";
import type { Field } from "@/lib/cms/schema";
import { useConfirm } from "./ConfirmDialog";
import { useReportDirty } from "./EditorTabs";
import { FieldGroups } from "./fields";
import SeoPreview, { type SeoPreviewContext } from "./SeoPreview";
import type { SeoValues } from "@/lib/cms/seo-score";

type Obj = Record<string, unknown>;

const fmtDate = (ts: number) =>
  new Intl.DateTimeFormat("es-CO", { dateStyle: "medium", timeStyle: "short" }).format(new Date(ts));

/**
 * Formulario de una sección (generado a partir del esquema). Publica al guardar: la web se
 * actualiza de inmediato y la versión queda en el historial.
 */
export default function SectionEditor({
  pageId,
  sectionId,
  title,
  description,
  fields,
  initial,
  defaults,
  updated,
  seo,
}: {
  pageId: string;
  sectionId: string;
  title: string;
  description?: string;
  fields: Field[];
  initial: Obj;
  defaults: Obj;
  updated?: { at: number; user: string | null };
  /** Secciones de SEO: muestra al lado la vista previa de Google y redes con su puntaje. */
  seo?: SeoPreviewContext;
}) {
  const [values, setValues] = useState<Obj>(initial);
  const [saved, setSaved] = useState<Obj>(initial);
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);
  const [lastAt, setLastAt] = useState(updated?.at);
  const [pending, start] = useTransition();
  const confirmDlg = useConfirm();
  const dirty = JSON.stringify(values) !== JSON.stringify(saved);
  useReportDirty(sectionId, dirty);

  // Avisa antes de salir con cambios sin guardar.
  useEffect(() => {
    if (!dirty) return;
    const h = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);

  const save = () =>
    start(async () => {
      const r = await saveSectionAction(pageId, sectionId, values);
      if (r.ok) {
        setSaved(values);
        setLastAt(r.at);
        setStatus({ ok: true, text: r.message ?? "Guardado" });
      } else setStatus({ ok: false, text: r.error });
    });

  const reset = async () => {
    const ok = await confirmDlg({
      tone: "warning",
      title: `¿Restablecer «${title}»?`,
      message: "La sección vuelve a los textos e imágenes originales de la web y se publica de inmediato. Tu versión actual queda en el Historial, desde donde puedes recuperarla.",
      confirmLabel: "Restablecer original",
    });
    if (!ok) return;
    start(async () => {
      const r = await resetSectionAction(pageId, sectionId);
      if (r.ok) {
        setValues(defaults);
        setSaved(defaults);
        setLastAt(undefined);
        setStatus({ ok: true, text: r.message ?? "Restablecido" });
      } else setStatus({ ok: false, text: r.error });
    });
  };

  const form = (
    <FieldGroups
      fields={fields}
      values={values}
      defaults={defaults}
      idPrefix={sectionId}
      onChange={(key, v) => setValues((s) => ({ ...s, [key]: v }))}
    />
  );

  return (
    <section id={`seccion-${sectionId}`} className="rounded-3xl bg-white shadow-sm ring-1 ring-black/5">
      <header className="flex flex-col gap-2 border-b border-black/5 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="min-w-0">
          <h2 className="text-[18px] font-extrabold text-forest-dark">{title}</h2>
          {description && <p className="mt-0.5 text-[13px] text-ink/55">{description}</p>}
        </div>
        <p
          className={`inline-flex shrink-0 items-center gap-1.5 self-start rounded-full px-2.5 py-1 text-[11px] font-semibold sm:self-auto ${
            lastAt ? "bg-brand/10 text-brand-dark" : "bg-mist text-ink/50"
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${lastAt ? "bg-brand" : "bg-ink/30"}`} aria-hidden />
          {lastAt ? `Editado ${fmtDate(lastAt)}${updated?.user && lastAt === updated.at ? ` · ${updated.user}` : ""}` : "Textos originales"}
        </p>
      </header>

      {seo ? (
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="min-w-0">{form}</div>
          <aside className="border-t border-black/5 bg-mist/40 p-5 sm:p-6 xl:border-l xl:border-t-0">
            <div className="xl:sticky xl:top-24">
              <SeoPreview values={values as SeoValues} ctx={seo} />
            </div>
          </aside>
        </div>
      ) : (
        form
      )}

      <footer className="sticky bottom-0 z-10 flex flex-wrap items-center gap-3 rounded-b-3xl border-t border-black/5 bg-white/95 px-5 py-3.5 backdrop-blur sm:px-6">
        <button
          type="button"
          onClick={save}
          disabled={pending || !dirty}
          className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-[13px] font-bold text-white shadow-lg shadow-brand/25 transition hover:bg-brand-dark disabled:opacity-50 disabled:shadow-none"
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Publicar cambios
        </button>
        {dirty && !pending && (
          <>
            <span className="text-[12px] font-semibold text-amber-600">Cambios sin guardar</span>
            <button type="button" onClick={() => setValues(saved)} className="text-[12px] font-semibold text-ink/50 underline-offset-2 hover:text-ink hover:underline">
              Descartar
            </button>
          </>
        )}
        {!dirty && status && (
          <span role="status" className={`inline-flex items-center gap-1.5 text-[12px] font-semibold ${status.ok ? "text-brand-dark" : "text-red-600"}`}>
            {status.ok && <CheckCircle2 className="h-4 w-4" />} {status.text}
          </span>
        )}
        {dirty && status && !status.ok && <span className="text-[12px] font-semibold text-red-600">{status.text}</span>}
        <button
          type="button"
          onClick={reset}
          disabled={pending || !lastAt}
          className="ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[12px] font-semibold text-ink/50 transition hover:bg-mist hover:text-forest disabled:opacity-30"
          title="Volver a los textos originales de la web"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Restablecer original
        </button>
      </footer>
    </section>
  );
}
