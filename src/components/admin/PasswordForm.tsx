"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import { useActionState } from "react";
import { changePasswordAction } from "@/app/admin/actions";
import { inputCls } from "./fields";

export default function PasswordForm() {
  const [state, action, pending] = useActionState(changePasswordAction, null);
  return (
    <form action={action} className="grid max-w-md gap-4">
      {(
        [
          ["current", "Contraseña actual", "current-password"],
          ["next", "Nueva contraseña (mínimo 10 caracteres)", "new-password"],
          ["confirm", "Repite la nueva contraseña", "new-password"],
        ] as const
      ).map(([name, label, ac]) => (
        <div key={name}>
          <label htmlFor={`pw-${name}`} className="mb-1.5 block text-[13px] font-bold text-forest-dark">
            {label}
          </label>
          <input id={`pw-${name}`} name={name} type="password" required autoComplete={ac} className={inputCls} />
        </div>
      ))}
      {state && (
        <p
          role="status"
          className={`flex items-center gap-1.5 rounded-xl px-4 py-3 text-[13px] font-medium ${state.ok ? "bg-brand/10 text-brand-dark" : "bg-red-50 text-red-700"}`}
        >
          {state.ok && <CheckCircle2 className="h-4 w-4" />} {state.ok ? state.message : state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-fit items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-[13px] font-bold text-white shadow-lg shadow-brand/25 hover:bg-brand-dark disabled:opacity-60"
      >
        {pending && <Loader2 className="h-4 w-4 animate-spin" />} Cambiar contraseña
      </button>
    </form>
  );
}
