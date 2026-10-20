"use client";

import { KeyRound, Loader2 } from "lucide-react";
import { useActionState } from "react";
import type { UserResult } from "@/app/admin/users-actions";
import { GeneratedPassword, Notice, PasswordChoice } from "./ui";

/** Asignar una contraseña nueva a otro usuario (generada o escrita). */
export default function PasswordReset({ action }: { action: (prev: UserResult, fd: FormData) => Promise<UserResult> }) {
  const [state, formAction, pending] = useActionState(action, null);
  return (
    <form action={formAction} className="space-y-4">
      <PasswordChoice idPrefix="reset" />
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-full bg-forest-dark px-4 py-2.5 text-[13px] font-bold text-white transition hover:bg-brand disabled:opacity-60"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />} Asignar nueva contraseña
      </button>
      <Notice state={state} />
      {state?.ok && state.password && <GeneratedPassword password={state.password} />}
    </form>
  );
}
