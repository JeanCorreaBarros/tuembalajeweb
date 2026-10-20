"use client";

import { AlertTriangle, ArrowRight, Info, ShieldAlert, Trash2 } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";

export type ConfirmOptions = {
  title: string;
  message?: ReactNode;
  /** Texto del botón de confirmar. */
  confirmLabel?: string;
  /**
   * danger: borrado definitivo (rojo, con aviso de que no se puede deshacer).
   * warning: cambio importante pero reversible (ámbar).
   * info: confirmación simple.
   */
  tone?: "danger" | "warning" | "info";
  /** Imagen afectada (o dos: antes → después). */
  images?: [string] | [string, string];
  /** Lista de efectos o lugares afectados. */
  details?: string[];
  /** Palabra que hay que escribir para habilitar el botón (para lo más delicado). */
  requireText?: string;
};

type Pending = ConfirmOptions & { resolve: (ok: boolean) => void };

const Ctx = createContext<((o: ConfirmOptions) => Promise<boolean>) | null>(null);

/** Pide confirmación con el diálogo del panel. Fuera del panel (sin proveedor) usa el confirm del navegador. */
export function useConfirm() {
  const ctx = useContext(Ctx);
  return ctx ?? ((o: ConfirmOptions) => Promise.resolve(window.confirm(o.title)));
}

const TONE = {
  danger: { icon: Trash2, circle: "bg-red-100 text-red-600", btn: "bg-red-600 hover:bg-red-700 shadow-red-600/25" },
  warning: { icon: AlertTriangle, circle: "bg-amber-100 text-amber-600", btn: "bg-amber-500 hover:bg-amber-600 shadow-amber-500/25" },
  info: { icon: Info, circle: "bg-brand/15 text-brand-dark", btn: "bg-brand hover:bg-brand-dark shadow-brand/25" },
};

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState<Pending | null>(null);
  const [typed, setTyped] = useState("");
  const ref = useRef<HTMLDialogElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  const confirm = useCallback(
    (o: ConfirmOptions) =>
      new Promise<boolean>((resolve) => {
        setTyped("");
        setPending({ ...o, resolve });
      }),
    [],
  );

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (pending && !d.open) {
      d.showModal();
      // El foco empieza en «Cancelar»: confirmar siempre es una decisión explícita.
      cancelRef.current?.focus();
    } else if (!pending && d.open) d.close();
  }, [pending]);

  const finish = (ok: boolean) => {
    pending?.resolve(ok);
    setPending(null);
  };

  const tone = TONE[pending?.tone ?? "info"];
  const Icon = tone.icon;
  const blocked = !!pending?.requireText && typed.trim().toUpperCase() !== pending.requireText.toUpperCase();

  return (
    <Ctx.Provider value={confirm}>
      {children}
      <dialog
        ref={ref}
        onCancel={(e) => {
          e.preventDefault();
          finish(false);
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) finish(false);
        }}
        aria-labelledby="confirm-title"
        className="m-auto w-[calc(100%-2rem)] max-w-[460px] overflow-hidden rounded-3xl bg-white p-0 shadow-2xl backdrop:bg-forest-dark/60 backdrop:backdrop-blur-sm"
      >
        {pending && (
          <div className="p-6">
            <div className="flex items-start gap-4">
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${tone.circle}`}>
                <Icon className="h-6 w-6" aria-hidden />
              </span>
              <div className="min-w-0 pt-1">
                <h2 id="confirm-title" className="text-[18px] font-extrabold leading-snug text-forest-dark">
                  {pending.title}
                </h2>
                {pending.message && <div className="mt-1.5 text-[14px] leading-relaxed text-ink/65">{pending.message}</div>}
              </div>
            </div>

            {pending.images && (
              <div className="mt-5 flex items-center justify-center gap-3 rounded-2xl bg-mist/70 p-3">
                {pending.images.map((src, i) => (
                  <div key={src + i} className="flex items-center gap-3">
                    {i === 1 && <ArrowRight className="h-5 w-5 shrink-0 text-ink/40" aria-hidden />}
                    {/* eslint-disable-next-line @next/next/no-img-element -- vista previa del panel */}
                    <img
                      src={src}
                      alt=""
                      className={`h-24 w-32 rounded-xl object-cover ring-1 ring-black/10 ${pending.images!.length === 2 && i === 0 ? "opacity-60 grayscale" : ""}`}
                    />
                  </div>
                ))}
              </div>
            )}

            {pending.details && pending.details.length > 0 && (
              <ul className="mt-4 max-h-40 space-y-1 overflow-y-auto rounded-2xl bg-mist/60 px-4 py-3 text-[13px] text-ink/70">
                {pending.details.map((d) => (
                  <li key={d} className="flex gap-2">
                    <span className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full bg-ink/30" aria-hidden />
                    {d}
                  </li>
                ))}
              </ul>
            )}

            {pending.tone === "danger" && (
              <p className="mt-4 flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-semibold leading-snug text-red-700">
                <ShieldAlert className="mt-px h-4 w-4 shrink-0" aria-hidden />
                Esta acción es definitiva y no se puede deshacer.
              </p>
            )}

            {pending.requireText && (
              <label className="mt-4 block">
                <span className="mb-1.5 block text-[13px] text-ink/65">
                  Para confirmar, escribe <b className="font-mono text-red-600">{pending.requireText}</b>
                </span>
                <input
                  value={typed}
                  onChange={(e) => setTyped(e.target.value)}
                  autoComplete="off"
                  className="w-full rounded-xl border border-black/15 px-3.5 py-2.5 font-mono text-base uppercase outline-none focus:border-red-400 focus:ring-4 focus:ring-red-100 sm:text-[14px]"
                />
              </label>
            )}

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                ref={cancelRef}
                type="button"
                onClick={() => finish(false)}
                className="rounded-full border border-black/10 px-5 py-2.5 text-[13px] font-bold text-ink/70 transition hover:bg-mist"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={blocked}
                onClick={() => finish(true)}
                className={`rounded-full px-5 py-2.5 text-[13px] font-bold text-white shadow-lg transition disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none ${tone.btn}`}
              >
                {pending.confirmLabel ?? "Confirmar"}
              </button>
            </div>
          </div>
        )}
      </dialog>
    </Ctx.Provider>
  );
}

/** Botón de envío de formulario que confirma con el diálogo del panel antes de enviar. */
export function ConfirmSubmit({ options, className, children }: { options: ConfirmOptions; className?: string; children: ReactNode }) {
  const confirm = useConfirm();
  return (
    <button
      type="button"
      className={className}
      onClick={async (e) => {
        const form = e.currentTarget.form;
        if (form && (await confirm(options))) form.requestSubmit();
      }}
    >
      {children}
    </button>
  );
}
