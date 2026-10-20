"use client";

import { Check, ImagePlus, Loader2, UploadCloud, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { listMediaAction, uploadMediaAction } from "@/app/admin/actions";
import type { Media } from "@/lib/cms/media";

/** Sube varios archivos uno por uno (cada envío respeta el límite de tamaño). Devuelve los subidos. */
export function useUploader(onUploaded: (m: Media) => void) {
  const [busy, setBusy] = useState<{ done: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (files: FileList | File[]) => {
      const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
      if (!list.length) return;
      setError(null);
      setBusy({ done: 0, total: list.length });
      for (let i = 0; i < list.length; i++) {
        const fd = new FormData();
        fd.append("file", list[i]);
        const r = await uploadMediaAction(fd);
        if (r.ok) onUploaded(r.media);
        else setError(`${list[i].name}: ${r.error}`);
        setBusy({ done: i + 1, total: list.length });
      }
      setBusy(null);
    },
    [onUploaded],
  );
  return { upload, busy, error };
}

/** Zona para soltar archivos o hacer clic y elegirlos. */
export function DropZone({ onFiles, busy, compact }: { onFiles: (f: FileList) => void; busy: { done: number; total: number } | null; compact?: boolean }) {
  const [over, setOver] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        if (e.dataTransfer.files.length) onFiles(e.dataTransfer.files);
      }}
      className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed text-center transition ${
        over ? "border-brand bg-brand/5" : "border-black/15 bg-white"
      } ${compact ? "px-4 py-5" : "px-6 py-10"}`}
    >
      {busy ? (
        <p className="flex items-center gap-2 text-[13px] font-semibold text-forest-dark">
          <Loader2 className="h-4 w-4 animate-spin" /> Subiendo {busy.done + 1 > busy.total ? busy.total : busy.done + 1} de {busy.total}…
        </p>
      ) : (
        <>
          <UploadCloud className="h-8 w-8 text-brand" aria-hidden />
          <p className="mt-2 text-[13px] font-semibold text-forest-dark">Arrastra imágenes aquí o</p>
          <button
            type="button"
            onClick={() => input.current?.click()}
            className="mt-2 rounded-full bg-forest px-4 py-2 text-[12px] font-bold text-white transition hover:bg-forest-mid"
          >
            Elegir archivos
          </button>
          <p className="mt-2 text-[11px] text-ink/45">JPG, PNG, WebP o AVIF · hasta 15 MB · se optimizan solas</p>
        </>
      )}
      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        multiple
        hidden
        onChange={(e) => {
          if (e.target.files?.length) onFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}

/**
 * Selector de imágenes en un modal: fotos subidas, imágenes originales de la web y subida directa.
 */
export default function MediaPicker({
  open,
  current,
  onClose,
  onSelect,
}: {
  open: boolean;
  current?: string;
  onClose: () => void;
  onSelect: (url: string) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [tab, setTab] = useState<"subidas" | "web">("subidas");
  const [uploads, setUploads] = useState<Media[] | null>(null);
  const [site, setSite] = useState<string[]>([]);
  const onUploaded = useCallback((m: Media) => setUploads((u) => [m, ...(u ?? [])]), []);
  const { upload, busy, error } = useUploader(onUploaded);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      listMediaAction().then((r) => {
        setUploads(r.uploads);
        setSite(r.site);
        // Sin fotos subidas (o si la actual es de la web), abre directo en las imágenes de la web.
        if (!r.uploads.length || current?.startsWith("/images/")) setTab("web");
      });
    } else if (!open && d.open) d.close();
  }, [open, current]);

  const items = tab === "subidas" ? (uploads ?? []).map((m) => ({ url: m.url, label: m.original_name })) : site.map((url) => ({ url, label: url.split("/").pop() ?? url }));

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-label="Elegir imagen"
      className="m-auto h-[min(88dvh,760px)] w-[calc(100%-1.5rem)] max-w-[920px] overflow-hidden rounded-3xl bg-mist p-0 shadow-2xl backdrop:bg-forest-dark/70 backdrop:backdrop-blur-sm open:flex open:flex-col"
    >
      <div className="flex items-center justify-between gap-3 border-b border-black/5 bg-white px-5 py-4">
        <h2 className="flex items-center gap-2 text-[16px] font-extrabold text-forest-dark">
          <ImagePlus className="h-5 w-5 text-brand" aria-hidden /> Elegir imagen
        </h2>
        <button type="button" onClick={onClose} aria-label="Cerrar" className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-mist">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
        <DropZone onFiles={upload} busy={busy} compact />
        {error && <p className="mt-3 rounded-xl bg-red-50 px-4 py-2.5 text-[12px] font-medium text-red-700">{error}</p>}

        <div role="tablist" className="mt-5 flex gap-2">
          {(
            [
              ["subidas", `Subidas${uploads ? ` (${uploads.length})` : ""}`],
              ["web", `Originales de la web (${site.length})`],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className={`rounded-full px-4 py-2 text-[12px] font-bold transition ${tab === id ? "bg-forest text-white" : "bg-white text-ink/60 hover:text-forest"}`}
            >
              {label}
            </button>
          ))}
        </div>

        {uploads === null ? (
          <p className="mt-10 flex items-center justify-center gap-2 text-[13px] text-ink/50">
            <Loader2 className="h-4 w-4 animate-spin" /> Cargando imágenes…
          </p>
        ) : items.length === 0 ? (
          <p className="mt-10 text-center text-[13px] text-ink/50">Todavía no hay imágenes aquí. Sube la primera arriba.</p>
        ) : (
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {items.map(({ url, label }) => {
              const selected = url === current;
              return (
                <li key={url}>
                  <button
                    type="button"
                    onClick={() => onSelect(url)}
                    className={`group relative block w-full overflow-hidden rounded-xl bg-white text-left shadow-sm ring-2 transition ${
                      selected ? "ring-brand" : "ring-transparent hover:ring-brand/50"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- miniaturas del panel, sin optimizar a propósito */}
                    <img src={url} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover" />
                    <span className="block truncate px-2.5 py-2 text-[11px] text-ink/60">{label}</span>
                    {selected && (
                      <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-brand text-white shadow">
                        <Check className="h-4 w-4" />
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </dialog>
  );
}
