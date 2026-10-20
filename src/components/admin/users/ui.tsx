"use client";

import { AlertCircle, CheckCircle2, Copy, Eye, EyeOff, KeyRound } from "lucide-react";
import { useState } from "react";
import { inputCls } from "../fields";

const COLORS = ["bg-forest", "bg-brand-dark", "bg-[#0e7490]", "bg-[#7c3aed]", "bg-[#c2410c]", "bg-[#be185d]", "bg-[#4d7c0f]"];

/** Círculo con las iniciales del usuario (color estable según el nombre). */
export function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const initials =
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("") || "?";
  const color = COLORS[[...name].reduce((s, c) => s + c.charCodeAt(0), 0) % COLORS.length];
  const cls = size === "lg" ? "h-20 w-20 text-[26px]" : size === "sm" ? "h-9 w-9 text-[12px]" : "h-11 w-11 text-[14px]";
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full font-extrabold text-white ring-4 ring-white ${color} ${cls}`} aria-hidden>
      {initials}
    </span>
  );
}

/** Qué tan segura es una contraseña (0–4), con consejo. */
function strength(pw: string) {
  let s = 0;
  if (pw.length >= 10) s++;
  if (pw.length >= 14) s++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++;
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) s++;
  if (pw.length < 10) s = Math.min(s, 1);
  const label = ["Muy débil", "Débil", "Aceptable", "Buena", "Excelente"][s];
  const color = ["bg-red-500", "bg-red-400", "bg-amber-400", "bg-brand", "bg-brand-dark"][s];
  return { s, label, color };
}

/** Campo de contraseña con botón para verla y, si `meter`, medidor de seguridad. */
export function PasswordField({
  id,
  name,
  label,
  autoComplete,
  meter = false,
  required = true,
}: {
  id: string;
  name: string;
  label: string;
  autoComplete: string;
  meter?: boolean;
  required?: boolean;
}) {
  const [show, setShow] = useState(false);
  const [value, setValue] = useState("");
  const st = strength(value);
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-bold text-forest-dark">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={show ? "text" : "password"}
          required={required}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={`${inputCls} pr-12`}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
          className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-ink/45 hover:bg-mist hover:text-forest-dark"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {meter && value && (
        <div className="mt-2">
          <div className="flex gap-1" aria-hidden>
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className={`h-1.5 flex-1 rounded-full ${i < Math.max(st.s, 1) ? st.color : "bg-black/[0.07]"}`} />
            ))}
          </div>
          <p className="mt-1 text-[11px] text-ink/55">
            Seguridad: <b className="text-forest-dark">{st.label}</b>
            {st.s < 3 && " · Usa 14+ caracteres, mayúsculas, números y símbolos."}
          </p>
        </div>
      )}
    </div>
  );
}

/** Aviso de resultado de un formulario. */
export function Notice({ state }: { state: { ok: true; message: string } | { ok: false; error: string } | null }) {
  if (!state) return null;
  return (
    <p
      role="status"
      className={`flex items-start gap-2 rounded-xl px-4 py-3 text-[13px] font-medium ${state.ok ? "bg-brand/10 text-brand-dark" : "bg-red-50 text-red-700"}`}
    >
      {state.ok ? <CheckCircle2 className="mt-px h-4 w-4 shrink-0" /> : <AlertCircle className="mt-px h-4 w-4 shrink-0" />}
      {state.ok ? state.message : state.error}
    </p>
  );
}

/** Contraseña generada por el sistema: se muestra una sola vez, con botón para copiarla. */
export function GeneratedPassword({ password }: { password: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="rounded-2xl border-2 border-dashed border-brand/50 bg-brand/[0.06] p-4">
      <p className="flex items-center gap-2 text-[13px] font-bold text-forest-dark">
        <KeyRound className="h-4 w-4 text-brand" aria-hidden /> Contraseña generada
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <code className="rounded-lg bg-white px-3 py-2 font-mono text-[15px] font-bold tracking-wide text-forest-dark ring-1 ring-black/10">{password}</code>
        <button
          type="button"
          onClick={async () => {
            await navigator.clipboard.writeText(password);
            setCopied(true);
          }}
          className="inline-flex items-center gap-1.5 rounded-full bg-forest-dark px-3.5 py-2 text-[12px] font-bold text-white hover:bg-brand"
        >
          {copied ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />} {copied ? "Copiada" : "Copiar"}
        </button>
      </div>
      <p className="mt-2 text-[12px] leading-snug text-ink/60">
        Cópiala y entrégasela a la persona por un medio seguro. <b>No se volverá a mostrar.</b> Si es administrador, podrá cambiarla desde «Mi
        cuenta».
      </p>
    </div>
  );
}

/** Elegir: generar una contraseña segura o escribirla. */
export function PasswordChoice({ idPrefix }: { idPrefix: string }) {
  const [mode, setMode] = useState<"auto" | "manual">("auto");
  return (
    <div className="@container space-y-3">
      <input type="hidden" name="passwordMode" value={mode} />
      <div className="grid grid-cols-1 gap-2 @md:grid-cols-2">
        {(
          [
            ["auto", "Generar una segura", "El sistema crea una contraseña y te la muestra una vez."],
            ["manual", "Escribirla yo", `Mínimo 10 caracteres.`],
          ] as const
        ).map(([m, title, text]) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            aria-pressed={mode === m}
            className={`rounded-2xl p-3.5 text-left ring-1 transition ${mode === m ? "bg-brand/[0.08] ring-2 ring-brand" : "bg-white ring-black/10 hover:ring-brand/40"}`}
          >
            <span className="flex items-center gap-2 text-[13px] font-bold text-forest-dark">
              <span className={`flex h-4 w-4 items-center justify-center rounded-full border-2 ${mode === m ? "border-brand" : "border-ink/25"}`}>
                {mode === m && <span className="h-2 w-2 rounded-full bg-brand" />}
              </span>
              {title}
            </span>
            <span className="mt-0.5 block pl-6 text-[12px] text-ink/55">{text}</span>
          </button>
        ))}
      </div>
      {mode === "manual" && <PasswordField id={`${idPrefix}-password`} name="password" label="Contraseña" autoComplete="new-password" meter />}
    </div>
  );
}
