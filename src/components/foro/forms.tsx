"use client";

import { Eye, EyeOff, Loader2, Lock, Mail, Reply, User } from "lucide-react";
import Link from "next/link";
import { useActionState, useEffect, useRef, useState, type ReactNode } from "react";
import { createAnswer, createQuestion, login, register, type FormState } from "@/app/foro/actions";
import Avatar from "./Avatar";

// En celular el texto va a 16px: con menos, iOS hace zoom al tocar el campo.
const input =
  "w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-base text-ink sm:text-[14px] outline-none transition placeholder:text-ink/40 focus:border-brand focus:ring-4 focus:ring-brand/15";
const label = "mb-1.5 block text-[12px] font-bold text-forest-dark";

function Submit({ pending, children, full }: { pending: boolean; children: ReactNode; full?: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-7 py-3.5 text-[14px] font-bold text-white shadow-lg shadow-brand/30 transition hover:bg-brand-dark disabled:opacity-60 ${
        full ? "w-full" : ""
      }`}
    >
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

function ErrorMsg({ error }: { error?: string }) {
  if (!error) return null;
  return (
    <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-700">
      {error}
    </p>
  );
}

/** Campo con ícono a la izquierda. */
function IconField({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/40 [&>svg]:h-4 [&>svg]:w-4">{icon}</span>
      {children}
    </div>
  );
}

const initial: FormState = {};

/* ---------- ingresar / registrarse ---------- */

export function AuthForm({ mode, next }: { mode: "login" | "register"; next: string }) {
  const [state, action, pending] = useActionState(mode === "login" ? login : register, initial);
  const [show, setShow] = useState(false);
  const isLogin = mode === "login";

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next} />

      {!isLogin && (
        <div>
          <label htmlFor="name" className={label}>Nombre completo</label>
          <IconField icon={<User />}>
            <input id="name" name="name" required minLength={2} maxLength={60} autoComplete="name" placeholder="Tu nombre" className={`${input} pl-11`} />
          </IconField>
        </div>
      )}
      <div>
        <label htmlFor="email" className={label}>Correo electrónico</label>
        <IconField icon={<Mail />}>
          <input id="email" name="email" type="email" required autoComplete="email" placeholder="tucorreo@empresa.com" className={`${input} pl-11`} />
        </IconField>
      </div>
      <div>
        <label htmlFor="password" className={label}>Contraseña</label>
        <IconField icon={<Lock />}>
          <input
            id="password"
            name="password"
            type={show ? "text" : "password"}
            required
            minLength={isLogin ? 1 : 8}
            autoComplete={isLogin ? "current-password" : "new-password"}
            placeholder={isLogin ? "Tu contraseña" : "Mínimo 8 caracteres"}
            className={`${input} pl-11 pr-12`}
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
            className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-ink/45 transition hover:bg-mist hover:text-forest"
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </IconField>
      </div>

      {/* Autorización previa y expresa para el tratamiento de datos (Ley 1581 de 2012). */}
      {!isLogin && (
        <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-mist px-4 py-3 text-[13px] leading-snug text-ink/70">
          <input
            type="checkbox"
            name="acepto"
            required
            className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[#1fb34a]"
          />
          <span>
            Acepto los{" "}
            <Link href="/terminos-y-condiciones" target="_blank" className="font-bold text-brand-dark hover:underline">
              Términos y condiciones
            </Link>{" "}
            y autorizo el tratamiento de mis datos según la{" "}
            <Link href="/politica-de-privacidad" target="_blank" className="font-bold text-brand-dark hover:underline">
              Política de privacidad
            </Link>
            .
          </span>
        </label>
      )}

      <ErrorMsg error={state.error} />
      <Submit pending={pending} full>
        {isLogin ? "Ingresar" : "Crear cuenta"}
      </Submit>

      <p className="text-center text-[13px] text-ink/60">
        {isLogin ? "¿Aún no tienes cuenta? " : "¿Ya tienes cuenta? "}
        <Link
          href={`${isLogin ? "/foro/registro" : "/foro/ingresar"}?next=${encodeURIComponent(next)}`}
          className="font-bold text-brand-dark hover:underline"
        >
          {isLogin ? "Regístrate gratis" : "Ingresa"}
        </Link>
      </p>
    </form>
  );
}

/* ---------- nueva pregunta ---------- */

export function QuestionForm({ categories }: { categories: readonly { slug: string; label: string }[] }) {
  const [state, action, pending] = useActionState(createQuestion, initial);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  return (
    <form action={action} className="min-w-0 space-y-5 rounded-3xl bg-white p-5 shadow-sm sm:p-8">
      <div>
        <label className={label}>Categoría</label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {categories.map((c, i) => (
            <label key={c.slug} className="cursor-pointer">
              <input type="radio" name="category" value={c.slug} required={i === 0} className="peer sr-only" />
              <span className="block rounded-xl border border-black/10 px-3 py-2.5 text-center text-[12px] font-semibold text-ink/70 transition peer-checked:border-brand peer-checked:bg-brand/10 peer-checked:text-brand-dark peer-focus-visible:ring-4 peer-focus-visible:ring-brand/20 hover:border-brand/50">
                {c.label}
              </span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <div className="flex items-end justify-between">
          <label htmlFor="title" className={label}>Título de tu pregunta</label>
          <span className={`mb-1.5 text-[11px] ${title.length > 150 ? "text-red-600" : "text-ink/40"}`}>{title.length}/150</span>
        </div>
        <input
          id="title"
          name="title"
          required
          minLength={10}
          maxLength={150}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej: ¿Qué estiba necesito para exportar maquinaria de 2 toneladas?"
          className={input}
        />
      </div>
      <div>
        <div className="flex items-end justify-between">
          <label htmlFor="body" className={label}>Detalles</label>
          <span className="mb-1.5 text-[11px] text-ink/40">{body.length}/5000</span>
        </div>
        <textarea
          id="body"
          name="body"
          required
          minLength={20}
          maxLength={5000}
          rows={8}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Cuéntanos medidas, peso, destino y cualquier detalle que ayude a responderte."
          className={`${input} resize-y leading-relaxed`}
        />
      </div>
      <ErrorMsg error={state.error} />
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-black/5 pt-5">
        <Link href="/foro" className="text-[13px] font-semibold text-ink/55 hover:text-forest">
          Cancelar
        </Link>
        <Submit pending={pending}>Publicar pregunta</Submit>
      </div>
    </form>
  );
}

/* ---------- responder ---------- */

export function AnswerForm({
  questionId,
  userName,
  userRole,
}: {
  questionId: number;
  userName: string;
  userRole: "user" | "admin";
}) {
  const [state, action, pending] = useActionState(createAnswer.bind(null, questionId), initial);
  const ref = useRef<HTMLFormElement>(null);

  // Limpia el campo cuando la respuesta se publicó con éxito.
  useEffect(() => {
    if (state.ok) ref.current?.reset();
  }, [state.ok]);

  return (
    <form ref={ref} action={action} className="rounded-3xl bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center gap-3">
        <Avatar name={userName} role={userRole} size="sm" />
        <label htmlFor="answer" className="text-[14px] font-extrabold text-forest-dark">
          Escribe tu respuesta
        </label>
      </div>
      <textarea
        id="answer"
        name="body"
        required
        minLength={5}
        maxLength={5000}
        rows={5}
        placeholder="Comparte lo que sabes: medidas, materiales, normas…"
        className={`${input} mt-4 resize-y leading-relaxed`}
      />
      <div className="mt-3 space-y-3">
        <ErrorMsg error={state.error} />
        <div className="flex justify-end">
          <Submit pending={pending}>Publicar respuesta</Submit>
        </div>
      </div>
    </form>
  );
}

/* ---------- responder a un comentario ---------- */

export function ReplyBox({
  questionId,
  parentId,
  parentAuthor,
  loggedIn,
  next,
}: {
  questionId: number;
  parentId: number;
  parentAuthor: string;
  loggedIn: boolean;
  next: string;
}) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(createAnswer.bind(null, questionId), initial);
  const [handled, setHandled] = useState(state);

  // Al publicar con éxito se cierra (y el formulario, al desmontarse, queda limpio).
  // Se ajusta durante el render cuando llega un resultado nuevo, sin un efecto extra.
  if (state !== handled) {
    setHandled(state);
    if (state.ok) setOpen(false);
  }

  const button = "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-bold text-ink/55 transition hover:bg-brand/10 hover:text-brand-dark";

  if (!loggedIn) {
    return (
      <Link href={`/foro/ingresar?next=${next}`} className={button} title="Ingresa para responder">
        <Reply className="h-4 w-4" /> Responder
      </Link>
    );
  }

  return (
    <>
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className={button}>
        <Reply className="h-4 w-4" /> {open ? "Cancelar" : "Responder"}
      </button>
      {open && (
        <form action={action} className="order-last mt-3 w-full space-y-3 rounded-2xl bg-mist p-3">
          <input type="hidden" name="parent_id" value={parentId} />
          <textarea
            name="body"
            required
            minLength={5}
            maxLength={5000}
            rows={3}
            autoFocus
            placeholder={`Responde a ${parentAuthor}…`}
            className={`${input} resize-y leading-relaxed`}
          />
          <ErrorMsg error={state.error} />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-2.5 text-[13px] font-semibold text-ink/60 hover:text-forest"
            >
              Cancelar
            </button>
            <Submit pending={pending}>Responder</Submit>
          </div>
        </form>
      )}
    </>
  );
}
