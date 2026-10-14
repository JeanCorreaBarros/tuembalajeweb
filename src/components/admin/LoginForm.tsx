"use client";

import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { useActionState, useState } from "react";
import { adminLogin } from "@/app/admin/actions";

const input =
  "w-full rounded-xl border border-black/10 bg-white py-3 pl-11 pr-4 text-base text-ink outline-none transition placeholder:text-ink/40 focus:border-brand focus:ring-4 focus:ring-brand/15 sm:text-[14px]";

export default function LoginForm() {
  const [state, action, pending] = useActionState(adminLogin, {});
  const [show, setShow] = useState(false);

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-[12px] font-bold text-forest-dark">
          Correo
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" aria-hidden />
          <input id="email" name="email" type="email" required autoComplete="username" className={input} placeholder="tu-correo@tuembalaje.com" />
        </div>
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-[12px] font-bold text-forest-dark">
          Contraseña
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" aria-hidden />
          <input
            id="password"
            name="password"
            type={show ? "text" : "password"}
            required
            autoComplete="current-password"
            className={`${input} pr-12`}
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
            className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-ink/45 hover:bg-mist hover:text-forest"
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {state.error && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-[14px] font-bold text-white shadow-lg shadow-brand/30 transition hover:bg-brand-dark disabled:opacity-60"
      >
        {pending && <Loader2 className="h-4 w-4 animate-spin" />} Ingresar al panel
      </button>
    </form>
  );
}
