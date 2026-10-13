"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useActionState, useEffect, useRef, type ReactNode } from "react";
import { createAnswer, createQuestion, login, register, type FormState } from "@/app/foro/actions";

const input =
  "w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-[14px] text-ink outline-none transition placeholder:text-ink/40 focus:border-brand focus:ring-2 focus:ring-brand/20";
const label = "mb-1.5 block text-[12px] font-bold text-forest-dark";

function Submit({ pending, children }: { pending: boolean; children: ReactNode }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-7 py-3 text-sm font-bold text-white shadow-lg shadow-brand/30 transition hover:bg-brand-dark disabled:opacity-60"
    >
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

function ErrorMsg({ error }: { error?: string }) {
  if (!error) return null;
  return (
    <p role="alert" className="rounded-lg bg-red-50 px-4 py-2.5 text-[13px] font-medium text-red-700">
      {error}
    </p>
  );
}

const initial: FormState = {};

/* ---------- ingresar / registrarse ---------- */

export function AuthForm({ mode, next }: { mode: "login" | "register"; next: string }) {
  const [state, action, pending] = useActionState(mode === "login" ? login : register, initial);
  const isLogin = mode === "login";

  return (
    <form action={action} className="space-y-4 rounded-3xl bg-white p-6 shadow-xl sm:p-8">
      <h2 className="text-2xl font-extrabold text-forest-dark">{isLogin ? "Ingresa a tu cuenta" : "Crea tu cuenta"}</h2>
      <p className="text-[13px] text-ink/60">
        {isLogin ? "Para preguntar y responder en el foro." : "Es gratis y toma menos de un minuto."}
      </p>
      <input type="hidden" name="next" value={next} />

      {!isLogin && (
        <div>
          <label htmlFor="name" className={label}>Nombre</label>
          <input id="name" name="name" required minLength={2} maxLength={60} autoComplete="name" className={input} />
        </div>
      )}
      <div>
        <label htmlFor="email" className={label}>Correo electrónico</label>
        <input id="email" name="email" type="email" required autoComplete="email" className={input} />
      </div>
      <div>
        <label htmlFor="password" className={label}>Contraseña</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={isLogin ? 1 : 8}
          autoComplete={isLogin ? "current-password" : "new-password"}
          placeholder={isLogin ? "" : "Mínimo 8 caracteres"}
          className={input}
        />
      </div>

      <ErrorMsg error={state.error} />
      <Submit pending={pending}>{isLogin ? "Ingresar" : "Crear cuenta"}</Submit>

      <p className="text-[13px] text-ink/60">
        {isLogin ? "¿Aún no tienes cuenta? " : "¿Ya tienes cuenta? "}
        <Link
          href={`${isLogin ? "/foro/registro" : "/foro/ingresar"}?next=${encodeURIComponent(next)}`}
          className="font-bold text-brand-dark hover:underline"
        >
          {isLogin ? "Regístrate" : "Ingresa"}
        </Link>
      </p>
    </form>
  );
}

/* ---------- nueva pregunta ---------- */

export function QuestionForm({ categories }: { categories: readonly { slug: string; label: string }[] }) {
  const [state, action, pending] = useActionState(createQuestion, initial);

  return (
    <form action={action} className="space-y-4 rounded-3xl bg-white p-6 shadow-xl sm:p-8">
      <div>
        <label htmlFor="category" className={label}>Categoría</label>
        <select id="category" name="category" required defaultValue="" className={input}>
          <option value="" disabled>Elige una categoría</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>{c.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="title" className={label}>Título de tu pregunta</label>
        <input
          id="title"
          name="title"
          required
          minLength={10}
          maxLength={150}
          placeholder="Ej: ¿Qué estiba necesito para exportar maquinaria de 2 toneladas?"
          className={input}
        />
      </div>
      <div>
        <label htmlFor="body" className={label}>Detalles</label>
        <textarea
          id="body"
          name="body"
          required
          minLength={20}
          maxLength={5000}
          rows={7}
          placeholder="Cuéntanos medidas, peso, destino y cualquier detalle que ayude a responderte."
          className={`${input} resize-y`}
        />
      </div>
      <ErrorMsg error={state.error} />
      <Submit pending={pending}>Publicar pregunta</Submit>
    </form>
  );
}

/* ---------- responder ---------- */

export function AnswerForm({ questionId }: { questionId: number }) {
  const [state, action, pending] = useActionState(createAnswer.bind(null, questionId), initial);
  const ref = useRef<HTMLFormElement>(null);

  // Limpia el campo cuando la respuesta se publicó con éxito.
  useEffect(() => {
    if (state.ok) ref.current?.reset();
  }, [state.ok]);

  return (
    <form ref={ref} action={action} className="space-y-3 rounded-2xl bg-white p-5 shadow-md">
      <label htmlFor="answer" className={label}>Tu respuesta</label>
      <textarea
        id="answer"
        name="body"
        required
        minLength={5}
        maxLength={5000}
        rows={5}
        placeholder="Comparte lo que sabes…"
        className={`${input} resize-y`}
      />
      <ErrorMsg error={state.error} />
      <Submit pending={pending}>Publicar respuesta</Submit>
    </form>
  );
}
