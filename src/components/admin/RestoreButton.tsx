"use client";

import { CheckCircle2, Loader2, RotateCcw } from "lucide-react";
import { useState, useTransition } from "react";
import { restoreRevisionAction } from "@/app/admin/actions";

export default function RestoreButton({ id, label }: { id: number; label: string }) {
  const [pending, start] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);
  if (result?.ok)
    return (
      <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-brand-dark">
        <CheckCircle2 className="h-4 w-4" /> Restaurada
      </span>
    );
  return (
    <span className="inline-flex flex-col items-end gap-1">
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (!confirm(`¿Restaurar esta versión de «${label}»? Se publicará de inmediato.`)) return;
          start(async () => {
            const r = await restoreRevisionAction(id);
            setResult(r.ok ? { ok: true, text: r.message ?? "" } : { ok: false, text: r.error });
          });
        }}
        className="inline-flex items-center gap-1.5 rounded-full border border-black/10 px-3 py-1.5 text-[12px] font-bold text-forest-dark transition hover:border-brand hover:text-brand-dark disabled:opacity-50"
      >
        {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RotateCcw className="h-3.5 w-3.5" />} Restaurar
      </button>
      {result && !result.ok && <span className="text-[11px] text-red-600">{result.text}</span>}
    </span>
  );
}
