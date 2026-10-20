"use client";

import { Loader2, LogOut, Save, ShieldCheck } from "lucide-react";
import { useActionState, useTransition, useState } from "react";
import { changePasswordAction } from "@/app/admin/actions";
import { logoutOtherSessionsAction, updateProfileAction, type UserResult } from "@/app/admin/users-actions";
import { inputCls } from "./fields";
import { Notice, PasswordField } from "./users/ui";

const btn =
  "inline-flex w-fit items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-[13px] font-bold text-white shadow-lg shadow-brand/25 transition hover:bg-brand-dark disabled:opacity-60";

/** Mis datos: nombre, correo, teléfono y cargo. */
export function ProfileForm({ user }: { user: { name: string; email: string; phone: string; job_title: string } }) {
  const [state, action, pending] = useActionState(updateProfileAction, null);
  return (
    <form action={action} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {(
          [
            ["name", "Nombre completo", "text", user.name, "name"],
            ["email", "Correo (para iniciar sesión)", "email", user.email, "email"],
            ["phone", "Teléfono / WhatsApp", "tel", user.phone, "tel"],
            ["job_title", "Cargo", "text", user.job_title, "organization-title"],
          ] as const
        ).map(([name, label, type, value, ac]) => (
          <div key={name}>
            <label htmlFor={`me-${name}`} className="mb-1.5 block text-[13px] font-bold text-forest-dark">
              {label}
            </label>
            <input
              id={`me-${name}`}
              name={name}
              type={type}
              defaultValue={value}
              required={name === "name" || name === "email"}
              autoComplete={ac}
              className={inputCls}
            />
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={pending} className={btn}>
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Guardar datos
        </button>
        <Notice state={state} />
      </div>
    </form>
  );
}

/** Cambiar mi contraseña (con la actual), con medidor de seguridad. */
export default function PasswordForm() {
  const [state, action, pending] = useActionState(changePasswordAction, null);
  // Al cambiarla con éxito, los campos se vacían (se vuelven a montar con otra key).
  const [round, setRound] = useState(0);
  const [seen, setSeen] = useState(state);
  if (state !== seen) {
    setSeen(state);
    if (state?.ok) setRound((r) => r + 1);
  }
  const notice = state ? (state.ok ? { ok: true as const, message: state.message ?? "Contraseña actualizada" } : state) : null;
  return (
    <form action={action} className="space-y-4">
      <div key={round} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2 sm:max-w-[calc(50%-0.5rem)]">
          <PasswordField id="pw-current" name="current" label="Contraseña actual" autoComplete="current-password" />
        </div>
        <PasswordField id="pw-next" name="next" label="Nueva contraseña" autoComplete="new-password" meter />
        <PasswordField id="pw-confirm" name="confirm" label="Repite la nueva contraseña" autoComplete="new-password" />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={pending} className={btn}>
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />} Cambiar contraseña
        </button>
        <Notice state={notice} />
      </div>
    </form>
  );
}

/** Cerrar mi sesión en los demás dispositivos. */
export function OtherSessions({ count }: { count: number }) {
  const [state, setState] = useState<UserResult>(null);
  const [pending, start] = useTransition();
  return (
    <div className="space-y-3">
      <p className="text-[13px] leading-relaxed text-ink/65">
        {count > 1
          ? `Tienes ${count} sesiones abiertas (este dispositivo y ${count - 1} más).`
          : "Solo tienes abierta la sesión de este dispositivo."}{" "}
        Si usaste el panel en un computador ajeno o perdiste tu celular, cierra las demás.
      </p>
      <button
        type="button"
        disabled={pending || count < 2}
        onClick={() => start(async () => setState(await logoutOtherSessionsAction()))}
        className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2.5 text-[13px] font-bold text-forest-dark transition hover:border-red-300 hover:text-red-600 disabled:opacity-45"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />} Cerrar las demás sesiones
      </button>
      <Notice state={state} />
    </div>
  );
}
