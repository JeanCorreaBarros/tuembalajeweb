"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type EditorTab = {
  id: string;
  title: string;
  /** Si la sección ya fue editada (no tiene los textos originales). */
  edited: boolean;
  /** Etiqueta opcional a la derecha (p. ej. el puntaje SEO). */
  badge?: ReactNode;
};

const DirtyCtx = createContext<((id: string, dirty: boolean) => void) | null>(null);

/** Cada formulario avisa si tiene cambios sin guardar (para marcarlo en el índice). */
export function useReportDirty(id: string, dirty: boolean) {
  const report = useContext(DirtyCtx);
  useEffect(() => {
    report?.(id, dirty);
  }, [report, id, dirty]);
}

/**
 * Editor por secciones: índice a la izquierda (arriba en celular) y una sola sección visible a la vez.
 * Las demás siguen montadas (ocultas), así no se pierde lo que se esté escribiendo al cambiar de sección.
 * La sección abierta queda en la URL (#seccion) para poder enlazarla o recargar sin perderla.
 */
export default function EditorTabs({
  tabs,
  panels,
  layout = "side",
}: {
  tabs: EditorTab[];
  panels: ReactNode[];
  /** "side": índice a la izquierda en escritorio. "top": pestañas arriba (deja todo el ancho al formulario). */
  layout?: "side" | "top";
}) {
  const [active, setActive] = useState(tabs[0]?.id);
  const [dirty, setDirty] = useState<Record<string, boolean>>({});
  const report = useCallback((id: string, d: boolean) => setDirty((s) => (s[id] === d ? s : { ...s, [id]: d })), []);

  useEffect(() => {
    const fromHash = () => {
      const id = decodeURIComponent(location.hash.slice(1));
      if (tabs.some((t) => t.id === id)) setActive(id);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [tabs]);

  // En celular el índice es una fila deslizable: muestra siempre la pestaña activa.
  useEffect(() => {
    const btn = document.querySelector<HTMLElement>(`#editor-tabs nav button[aria-current]`);
    const row = btn?.closest("ol");
    if (!btn || !row || row.scrollWidth <= row.clientWidth) return;
    const b = btn.getBoundingClientRect();
    const r = row.getBoundingClientRect();
    row.scrollLeft += b.left - r.left - (r.width - b.width) / 2;
  }, [active]);

  const go = (id: string) => {
    setActive(id);
    history.replaceState(null, "", `#${id}`);
    const top = document.getElementById("editor-tabs")?.getBoundingClientRect().top ?? 0;
    if (top < 0) document.getElementById("editor-tabs")?.scrollIntoView({ block: "start" });
  };

  const idx = Math.max(0, tabs.findIndex((t) => t.id === active));
  const prev = tabs[idx - 1];
  const next = tabs[idx + 1];
  const single = tabs.length < 2;
  const side = layout === "side";

  return (
    <DirtyCtx.Provider value={report}>
      <div
        id="editor-tabs"
        className={`scroll-mt-24 ${single ? "" : side ? "grid grid-cols-1 gap-5 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-6" : "space-y-5"}`}
      >
        {!single && (
          <nav aria-label="Secciones" className={`min-w-0 ${side ? "lg:sticky lg:top-20 lg:self-start" : ""}`}>
            {side && <p className="mb-2 hidden px-1 text-[11px] font-extrabold uppercase tracking-[0.12em] text-ink/40 lg:block">Secciones</p>}
            <ol
              className={
                side
                  ? "no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:rounded-2xl lg:bg-white lg:p-2 lg:shadow-sm lg:ring-1 lg:ring-black/5"
                  : "no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
              }
            >
              {tabs.map((t, i) => {
                const on = t.id === active;
                const d = dirty[t.id];
                return (
                  <li key={t.id} className="shrink-0">
                    <button
                      type="button"
                      onClick={() => go(t.id)}
                      aria-current={on ? "true" : undefined}
                      className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold transition ${
                        on
                          ? "bg-forest-dark text-white shadow-md"
                          : `bg-white text-ink/70 ring-1 ring-black/5 hover:bg-mist hover:text-forest-dark ${side ? "lg:bg-transparent lg:ring-0" : ""}`
                      }`}
                    >
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                          on ? "bg-white/15 text-white" : "bg-mist text-forest-dark"
                        }`}
                      >
                        {i + 1}
                      </span>
                      <span className={`min-w-0 flex-1 leading-snug ${side ? "max-lg:truncate" : "truncate"}`}>{t.title}</span>
                      {t.badge}
                      <span
                        title={d ? "Cambios sin guardar" : t.edited ? "Editado" : "Textos originales"}
                        className={`h-2 w-2 shrink-0 rounded-full ${d ? "bg-amber-400" : t.edited ? "bg-brand" : on ? "bg-white/25" : "bg-ink/15"}`}
                      />
                    </button>
                  </li>
                );
              })}
            </ol>
            <p className={`mt-3 hidden gap-3 px-1 text-[11px] text-ink/45 lg:flex-wrap ${side ? "lg:flex" : ""}`}>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-brand" /> Editado
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-400" /> Sin guardar
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-ink/15" /> Original
              </span>
            </p>
          </nav>
        )}

        <div className="min-w-0">
          {panels.map((p, i) => (
            <div key={tabs[i].id} hidden={tabs[i].id !== active}>
              {p}
            </div>
          ))}
          {!single && (
            <div className="mt-4 flex items-center justify-between gap-3">
              {prev ? (
                <button
                  type="button"
                  onClick={() => go(prev.id)}
                  className="inline-flex min-w-0 items-center gap-1.5 rounded-full px-3 py-2 text-[12px] font-semibold text-ink/55 transition hover:bg-white hover:text-forest-dark"
                >
                  <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden /> <span className="truncate">{prev.title}</span>
                </button>
              ) : (
                <span />
              )}
              {next && (
                <button
                  type="button"
                  onClick={() => go(next.id)}
                  className="inline-flex min-w-0 items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[12px] font-bold text-forest-dark shadow-sm ring-1 ring-black/5 transition hover:ring-brand/40"
                >
                  <span className="truncate">Siguiente: {next.title}</span> <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </DirtyCtx.Provider>
  );
}
