"use client";

import { ArrowRight, Loader2, MessagesSquare, Save, ShieldCheck, UserPlus } from "lucide-react";
import Link from "next/link";
import { useActionState, useState } from "react";
import type { UserResult } from "@/app/admin/users-actions";
import { inputCls } from "../fields";
import { GeneratedPassword, Notice, PasswordChoice } from "./ui";

type Values = { name: string; email: string; phone: string; job_title: string; role: "user" | "admin"; disabled: number };

const EMPTY: Values = { name: "", email: "", phone: "", job_title: "", role: "user", disabled: 0 };

const ROLES = [
  {
    value: "admin",
    title: "Administrador",
    text: "Entra a este panel y puede editar todo: páginas, productos, SEO y usuarios.",
    icon: ShieldCheck,
  },
  {
    value: "user",
    title: "Miembro del foro",
    text: "Pregunta y responde en el foro. No tiene acceso al panel.",
    icon: MessagesSquare,
  },
] as const;

function Field({ id, label, children, hint }: { id: string; label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-bold text-forest-dark">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-[12px] text-ink/50">{hint}</p>}
    </div>
  );
}

/** Formulario de usuario: crear (con contraseña) o editar datos, rol y estado. */
export default function UserForm({
  mode,
  action,
  user = EMPTY,
  isSelf = false,
}: {
  mode: "create" | "edit";
  action: (prev: UserResult, fd: FormData) => Promise<UserResult>;
  user?: Values;
  isSelf?: boolean;
}) {
  const [state, formAction, pending] = useActionState(action, null);
  const [role, setRole] = useState(user.role);
  const [disabled, setDisabled] = useState(Boolean(user.disabled));

  // Usuario recién creado: se muestra la contraseña generada (una sola vez) y qué hacer después.
  if (mode === "create" && state?.ok) {
    return (
      <div className="space-y-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 sm:p-7">
        <Notice state={state} />
        {state.password && <GeneratedPassword password={state.password} />}
        <div className="flex flex-wrap gap-2 pt-1">
          <Link
            href={`/admin/usuarios/${state.id}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-forest-dark px-4 py-2.5 text-[13px] font-bold text-white hover:bg-brand"
          >
            Ver usuario <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link href="/admin/usuarios" className="rounded-full px-4 py-2.5 text-[13px] font-bold text-ink/60 hover:bg-mist">
            Volver a la lista
          </Link>
        </div>
      </div>
    );
  }

  const block = "rounded-3xl bg-white shadow-sm ring-1 ring-black/5";
  const legend = "mb-4 flex items-center gap-2.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-brand-dark";

  return (
    <form action={formAction} className="space-y-5">
      <fieldset className={`${block} p-5 sm:p-6`}>
        <legend className="sr-only">Datos personales</legend>
        <p className={legend}>
          <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden /> Datos personales
        </p>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field id="u-name" label="Nombre completo">
            <input id="u-name" name="name" required defaultValue={user.name} autoComplete="off" className={inputCls} />
          </Field>
          <Field id="u-email" label="Correo" hint="Con este correo inicia sesión.">
            <input id="u-email" name="email" type="email" required defaultValue={user.email} autoComplete="off" className={inputCls} />
          </Field>
          <Field id="u-phone" label="Teléfono / WhatsApp (opcional)">
            <input id="u-phone" name="phone" type="tel" defaultValue={user.phone} placeholder="+57 300 000 0000" className={inputCls} />
          </Field>
          <Field id="u-job" label="Cargo (opcional)">
            <input id="u-job" name="job_title" defaultValue={user.job_title} placeholder="Ej: Asesor comercial" className={inputCls} />
          </Field>
        </div>
      </fieldset>

      <fieldset className={`${block} p-5 sm:p-6`}>
        <legend className="sr-only">Rol y acceso</legend>
        <p className={legend}>
          <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden /> Rol y acceso
        </p>
        <input type="hidden" name="role" value={role} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {ROLES.map(({ value, title, text, icon: Icon }) => {
            const on = role === value;
            const locked = isSelf && value !== "admin";
            return (
              <button
                key={value}
                type="button"
                disabled={locked}
                onClick={() => setRole(value)}
                aria-pressed={on}
                className={`flex gap-3 rounded-2xl p-4 text-left ring-1 transition disabled:cursor-not-allowed disabled:opacity-45 ${
                  on ? "bg-brand/[0.08] ring-2 ring-brand" : "bg-white ring-black/10 hover:ring-brand/40"
                }`}
              >
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${on ? "bg-brand text-white" : "bg-mist text-forest"}`}>
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <span>
                  <span className="block text-[14px] font-bold text-forest-dark">{title}</span>
                  <span className="mt-0.5 block text-[12px] leading-snug text-ink/55">{text}</span>
                </span>
              </button>
            );
          })}
        </div>

        {mode === "edit" && (
          <label
            className={`mt-4 flex items-start gap-3.5 rounded-2xl px-4 py-3.5 ring-1 ${disabled ? "bg-red-50 ring-red-200" : "bg-mist/60 ring-black/5"} ${
              isSelf ? "opacity-50" : "cursor-pointer"
            }`}
          >
            <input type="checkbox" name="disabled" checked={disabled} onChange={(e) => setDisabled(e.target.checked)} disabled={isSelf} className="sr-only" />
            <span className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition ${disabled ? "bg-red-500" : "bg-ink/20"}`} aria-hidden>
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${disabled ? "left-[22px]" : "left-0.5"}`} />
            </span>
            <span>
              <span className="block text-[13px] font-bold text-forest-dark">Cuenta suspendida</span>
              <span className="mt-0.5 block text-[12px] leading-snug text-ink/55">
                {isSelf
                  ? "No puedes suspender tu propia cuenta."
                  : "No podrá iniciar sesión (ni en el panel ni en el foro) hasta que la reactives. Sus publicaciones se conservan."}
              </span>
            </span>
          </label>
        )}
      </fieldset>

      {mode === "create" && (
        <fieldset className={`${block} p-5 sm:p-6`}>
          <legend className="sr-only">Contraseña</legend>
          <p className={legend}>
            <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden /> Contraseña
          </p>
          <PasswordChoice idPrefix="new" />
        </fieldset>
      )}

      <div className="sticky bottom-0 z-10 -mx-1 flex flex-wrap items-center gap-3 rounded-2xl bg-[#f3f5f3]/90 px-1 py-3 backdrop-blur">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-[13px] font-bold text-white shadow-lg shadow-brand/25 transition hover:bg-brand-dark disabled:opacity-60"
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : mode === "create" ? <UserPlus className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {mode === "create" ? "Crear usuario" : "Guardar cambios"}
        </button>
        {state && (
          <div className="min-w-0 flex-1">
            <Notice state={state} />
          </div>
        )}
      </div>
    </form>
  );
}
