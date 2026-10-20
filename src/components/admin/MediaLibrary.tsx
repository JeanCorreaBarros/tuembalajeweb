"use client";

import { Check, Copy, ExternalLink, EyeOff, Globe, ImageIcon, Link2, Loader2, RefreshCw, RotateCcw, Search, Trash2, Upload } from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo, useState, useTransition } from "react";
import { deleteMediaAction, hideSiteImageAction, replaceImageAction, restoreSiteImageAction, updateMediaAltAction } from "@/app/admin/actions";
import type { LibraryItem, Media } from "@/lib/cms/media";
import { useConfirm } from "./ConfirmDialog";
import MediaPicker, { DropZone, useUploader } from "./MediaPicker";

const kb = (n: number) => (n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.round(n / 1024)} KB`);

type Filter = "todas" | "upload" | "site" | "usadas" | "sin-usar" | "ocultas";

function MediaCard({ m, onDeleted }: { m: LibraryItem; onDeleted: (url: string) => void }) {
  const [alt, setAlt] = useState(m.alt ?? "");
  const [savedAlt, setSavedAlt] = useState(m.alt ?? "");
  const [copied, setCopied] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [picking, setPicking] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [pending, start] = useTransition();
  const confirmDlg = useConfirm();
  const used = m.usage.length > 0;
  const uses = showAll ? m.usage : m.usage.slice(0, 2);

  return (
    <li className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition hover:shadow-md hover:ring-brand/30">
      <a href={m.url} target="_blank" rel="noopener noreferrer" className="relative block overflow-hidden bg-mist" title="Ver en tamaño completo">
        {/* eslint-disable-next-line @next/next/no-img-element -- miniatura del panel */}
        <img src={m.url} alt={m.alt ?? ""} loading="lazy" className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105" />
        <span
          className={`absolute left-2 top-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold shadow-sm backdrop-blur ${
            m.kind === "upload" ? "bg-brand/90 text-white" : "bg-white/90 text-forest-dark"
          }`}
        >
          {m.kind === "upload" ? <Upload className="h-3 w-3" aria-hidden /> : <Globe className="h-3 w-3" aria-hidden />}
          {m.kind === "upload" ? "Subida" : "De la web"}
        </span>
        <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/45 text-white opacity-0 backdrop-blur transition group-hover:opacity-100">
          <ExternalLink className="h-3.5 w-3.5" aria-hidden />
        </span>
      </a>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="min-w-0">
          <p className="truncate text-[12px] font-bold text-forest-dark" title={m.name}>
            {m.name}
          </p>
          <p className="text-[11px] text-ink/45">
            {m.width ? `${m.width} × ${m.height} · ` : ""}
            {kb(m.size)}
          </p>
        </div>

        {/* Dónde se usa */}
        <div className={`rounded-xl px-2.5 py-2 text-[11px] ${used ? "bg-brand/[0.07]" : "bg-mist/70"}`}>
          {used ? (
            <>
              <p className="mb-1 flex items-center gap-1 font-bold text-brand-dark">
                <Link2 className="h-3 w-3" aria-hidden /> En uso ({m.usage.length})
              </p>
              <ul className="space-y-0.5">
                {uses.map((u) => (
                  <li key={u.label}>
                    <Link href={u.href} className="block truncate text-ink/65 hover:text-forest-dark hover:underline" title={u.label}>
                      {u.label}
                    </Link>
                  </li>
                ))}
              </ul>
              {m.usage.length > 2 && (
                <button type="button" onClick={() => setShowAll((s) => !s)} className="mt-0.5 font-bold text-brand-dark hover:underline">
                  {showAll ? "Ver menos" : `+${m.usage.length - 2} más`}
                </button>
              )}
            </>
          ) : (
            <p className="text-ink/45">Sin usar en la web</p>
          )}
        </div>

        {m.kind === "upload" && (
          <input
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            onBlur={() => {
              if (alt === savedAlt || m.id === undefined) return;
              start(async () => {
                await updateMediaAltAction(m.id!, alt);
                setSavedAlt(alt);
              });
            }}
            placeholder="Descripción (para Google)"
            aria-label="Descripción de la imagen"
            className="w-full rounded-lg border border-black/10 px-2.5 py-1.5 text-base outline-none focus:border-brand sm:text-[12px]"
          />
        )}

        <div className="mt-auto grid grid-cols-[1fr_auto_auto] items-center gap-1 border-t border-black/5 pt-2">
          {m.hidden ? (
            <button
              type="button"
              disabled={pending}
              onClick={() =>
                start(async () => {
                  const r = await restoreSiteImageAction(m.url);
                  setMsg(r.ok ? { ok: true, text: r.message ?? "Restaurada" } : { ok: false, text: r.error });
                })
              }
              className="col-span-3 inline-flex items-center justify-center gap-1.5 rounded-lg bg-forest-dark px-2 py-2 text-[12px] font-bold text-white hover:bg-brand"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden /> Restaurar a la biblioteca
            </button>
          ) : (
            <>
              <button
                type="button"
                disabled={pending}
                onClick={() => setPicking(true)}
                title={used ? "Cambiarla por otra en todos los lugares donde se usa" : "Cambiarla por otra"}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-forest-dark px-2 py-2 text-[12px] font-bold text-white transition hover:bg-brand disabled:opacity-50"
              >
                {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" aria-hidden />} Reemplazar
              </button>
              <button
                type="button"
                onClick={async () => {
                  await navigator.clipboard.writeText(m.url);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                }}
                title="Copiar enlace"
                aria-label="Copiar enlace"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-ink/50 hover:bg-mist hover:text-forest"
              >
                {copied ? <Check className="h-4 w-4 text-brand" /> : <Copy className="h-4 w-4" />}
              </button>
              <button
                type="button"
                disabled={pending}
                title={m.kind === "upload" ? "Eliminar imagen" : "Quitar de la biblioteca"}
                aria-label={m.kind === "upload" ? "Eliminar imagen" : "Quitar de la biblioteca"}
                onClick={async () => {
                  if (used) {
                    // En uso: no se puede quitar. Se explica dónde está y se ofrece reemplazarla.
                    const n = m.usage.length;
                    const replace = await confirmDlg({
                      tone: "info",
                      title: "Esta imagen está en uso",
                      message: `Aparece en ${n} ${n === 1 ? "lugar" : "lugares"} de la web. Para quitarla, primero reemplázala por otra; así ninguna sección queda sin foto.`,
                      images: [m.url],
                      details: m.usage.map((u) => u.label),
                      confirmLabel: "Reemplazarla ahora",
                    });
                    if (replace) setPicking(true);
                    return;
                  }
                  const ok =
                    m.kind === "upload"
                      ? await confirmDlg({
                          tone: "danger",
                          title: "¿Eliminar esta imagen?",
                          message: (
                            <>
                              Se borrará el archivo <b className="break-all text-forest-dark">{m.name}</b> del servidor.
                            </>
                          ),
                          images: [m.url],
                          confirmLabel: "Sí, eliminar definitivamente",
                        })
                      : await confirmDlg({
                          tone: "warning",
                          title: "¿Quitar esta imagen de la biblioteca?",
                          message:
                            "No se borra el archivo: es parte del código de la web. Dejará de aparecer aquí y en el selector de imágenes. Podrás restaurarla cuando quieras desde el filtro «Ocultas».",
                          images: [m.url],
                          confirmLabel: "Quitar de la biblioteca",
                        });
                  if (!ok) return;
                  start(async () => {
                    const r = m.kind === "upload" ? await deleteMediaAction(m.id!) : await hideSiteImageAction(m.url);
                    if (r.ok) onDeleted(m.url);
                    else setMsg({ ok: false, text: r.error });
                  });
                }}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-ink/50 hover:bg-red-50 hover:text-red-600"
              >
                {m.kind === "upload" ? <Trash2 className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
            </>
          )}
        </div>
        {msg && (
          <p className={`rounded-lg px-2.5 py-2 text-[11px] leading-snug ${msg.ok ? "bg-brand/10 text-brand-dark" : "bg-amber-50 text-amber-800"}`}>{msg.text}</p>
        )}
        <MediaPicker
          open={picking}
          current={m.url}
          onClose={() => setPicking(false)}
          onSelect={async (url) => {
            setPicking(false);
            if (url === m.url) return;
            const n = m.usage.length;
            const ok = await confirmDlg({
              tone: "warning",
              title: "¿Reemplazar esta imagen?",
              message: used
                ? `Se cambiará en ${n === 1 ? "el lugar" : `los ${n} lugares`} donde se usa y se publicará de inmediato. Podrás deshacerlo desde el Historial.`
                : "Ahora no se usa en ninguna parte, así que la web no cambiará.",
              images: [m.url, url],
              details: m.usage.map((u) => u.label),
              confirmLabel: "Reemplazar",
            });
            if (!ok) return;
            start(async () => {
              const r = await replaceImageAction(m.url, url);
              setMsg(r.ok ? { ok: true, text: r.message ?? "Reemplazada" } : { ok: false, text: r.error });
            });
          }}
        />
      </div>
    </li>
  );
}

/** Biblioteca de medios: todas las imágenes de la web (subidas y propias), con su uso, filtros y buscador. */
export default function MediaLibrary({ initial }: { initial: LibraryItem[] }) {
  const [items, setItems] = useState(initial);
  // Tras reemplazar, ocultar o restaurar, el servidor envía la lista actualizada.
  const [prevInitial, setPrevInitial] = useState(initial);
  if (initial !== prevInitial) {
    setPrevInitial(initial);
    setItems(initial);
  }
  const [chosen, setFilter] = useState<Filter>("todas");
  const [q, setQ] = useState("");
  const onUploaded = useCallback(
    (m: Media) =>
      setItems((x) => [
        { url: m.url, kind: "upload", name: m.original_name, width: m.width, height: m.height, size: m.size, id: m.id, alt: m.alt, created_at: m.created_at, usage: [] },
        ...x,
      ]),
    [],
  );
  const { upload, busy, error } = useUploader(onUploaded);

  const counts = useMemo(() => {
    const shown = items.filter((i) => !i.hidden);
    return {
      todas: shown.length,
      upload: shown.filter((i) => i.kind === "upload").length,
      site: shown.filter((i) => i.kind === "site").length,
      usadas: shown.filter((i) => i.usage.length).length,
      "sin-usar": shown.filter((i) => !i.usage.length).length,
      ocultas: items.length - shown.length,
    };
  }, [items]);

  // Si se restauró la última oculta, ese filtro ya no existe: se vuelve a «Todas».
  const filter: Filter = chosen === "ocultas" && !counts.ocultas ? "todas" : chosen;
  const term = q.trim().toLowerCase();
  const visible = items.filter((i) => {
    if ((filter === "ocultas") !== Boolean(i.hidden)) return false;
    if (filter === "upload" && i.kind !== "upload") return false;
    if (filter === "site" && i.kind !== "site") return false;
    if (filter === "usadas" && !i.usage.length) return false;
    if (filter === "sin-usar" && i.usage.length) return false;
    if (!term) return true;
    return `${i.name} ${i.alt ?? ""} ${i.usage.map((u) => u.label).join(" ")}`.toLowerCase().includes(term);
  });

  const FILTERS: [Filter, string][] = [
    ["todas", "Todas"],
    ["usadas", "En uso"],
    ["sin-usar", "Sin usar"],
    ["upload", "Subidas"],
    ["site", "De la web"],
    ...(counts.ocultas ? ([["ocultas", "Ocultas"]] as [Filter, string][]) : []),
  ];

  return (
    <>
      <DropZone onFiles={upload} busy={busy} />
      {error && <p className="mt-3 rounded-xl bg-red-50 px-4 py-2.5 text-[13px] font-medium text-red-700">{error}</p>}

      <div className="mb-4 mt-7 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 sm:mx-0 sm:px-0" role="tablist" aria-label="Filtrar imágenes">
          {FILTERS.map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={filter === id}
              onClick={() => setFilter(id)}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-[12px] font-bold transition ${
                filter === id ? "bg-forest-dark text-white" : "bg-white text-ink/60 ring-1 ring-black/5 hover:text-forest-dark"
              }`}
            >
              {label}
              <span className={`rounded-full px-1.5 text-[10px] tabular-nums ${filter === id ? "bg-white/15" : "bg-black/[0.06]"}`}>{counts[id]}</span>
            </button>
          ))}
        </div>
        <label className="relative w-full lg:w-72">
          <span className="sr-only">Buscar imágenes</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" aria-hidden />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nombre o dónde se usa…"
            className="w-full rounded-full border border-black/10 bg-white py-2.5 pl-10 pr-4 text-base outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/15 sm:text-[13px]"
          />
        </label>
      </div>

      {visible.length === 0 ? (
        <div className="flex flex-col items-center rounded-3xl bg-white px-6 py-12 text-center shadow-sm ring-1 ring-black/5">
          <ImageIcon className="h-8 w-8 text-ink/25" aria-hidden />
          <p className="mt-2 text-[14px] text-ink/55">
            {term ? `No hay imágenes que coincidan con «${q}».` : filter === "upload" ? "Aún no has subido imágenes." : "No hay imágenes en este filtro."}
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {visible.map((m) => (
            <MediaCard key={m.url} m={m} onDeleted={(url) => setItems((x) => x.flatMap((i) => (i.url !== url ? [i] : i.kind === "site" ? [{ ...i, hidden: true }] : [])))} />
          ))}
        </ul>
      )}
    </>
  );
}
