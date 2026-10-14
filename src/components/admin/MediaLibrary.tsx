"use client";

import { Check, Copy, Loader2, Trash2 } from "lucide-react";
import { useCallback, useState, useTransition } from "react";
import { deleteMediaAction, updateMediaAltAction } from "@/app/admin/actions";
import type { Media } from "@/lib/cms/media";
import { DropZone, useUploader } from "./MediaPicker";

const kb = (n: number) => (n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.round(n / 1024)} KB`);

function MediaCard({ m, onDeleted }: { m: Media; onDeleted: (id: number) => void }) {
  const [alt, setAlt] = useState(m.alt);
  const [savedAlt, setSavedAlt] = useState(m.alt);
  const [copied, setCopied] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, start] = useTransition();

  return (
    <li className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
      <a href={m.url} target="_blank" rel="noopener noreferrer" className="block bg-mist">
        {/* eslint-disable-next-line @next/next/no-img-element -- miniatura del panel */}
        <img src={m.url} alt={m.alt} loading="lazy" className="aspect-[4/3] w-full object-cover" />
      </a>
      <div className="space-y-2 p-3">
        <p className="truncate text-[12px] font-semibold text-forest-dark" title={m.original_name}>
          {m.original_name}
        </p>
        <p className="text-[11px] text-ink/45">
          {m.width} × {m.height} · {kb(m.size)}
        </p>
        <input
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          onBlur={() => {
            if (alt === savedAlt) return;
            start(async () => {
              await updateMediaAltAction(m.id, alt);
              setSavedAlt(alt);
            });
          }}
          placeholder="Descripción (para Google)"
          aria-label="Descripción de la imagen"
          className="w-full rounded-lg border border-black/10 px-2.5 py-1.5 text-base outline-none focus:border-brand sm:text-[12px]"
        />
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={async () => {
              await navigator.clipboard.writeText(m.url);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-[12px] font-semibold text-ink/60 hover:bg-mist hover:text-forest"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-brand" /> : <Copy className="h-3.5 w-3.5" />} {copied ? "Copiado" : "Copiar enlace"}
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              if (!confirm("¿Eliminar esta imagen? No se puede deshacer.")) return;
              start(async () => {
                const r = await deleteMediaAction(m.id);
                if (r.ok) onDeleted(m.id);
                else setMsg(r.error);
              });
            }}
            aria-label="Eliminar imagen"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-ink/45 hover:bg-red-50 hover:text-red-600"
          >
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          </button>
        </div>
        {msg && <p className="rounded-lg bg-amber-50 px-2.5 py-2 text-[11px] leading-snug text-amber-800">{msg}</p>}
      </div>
    </li>
  );
}

export default function MediaLibrary({ initial }: { initial: Media[] }) {
  const [items, setItems] = useState(initial);
  const onUploaded = useCallback((m: Media) => setItems((x) => [m, ...x]), []);
  const { upload, busy, error } = useUploader(onUploaded);

  return (
    <>
      <DropZone onFiles={upload} busy={busy} />
      {error && <p className="mt-3 rounded-xl bg-red-50 px-4 py-2.5 text-[13px] font-medium text-red-700">{error}</p>}
      {items.length === 0 ? (
        <p className="mt-8 text-center text-[14px] text-ink/50">Aún no has subido imágenes.</p>
      ) : (
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((m) => (
            <MediaCard key={m.id} m={m} onDeleted={(id) => setItems((x) => x.filter((i) => i.id !== id))} />
          ))}
        </ul>
      )}
    </>
  );
}
