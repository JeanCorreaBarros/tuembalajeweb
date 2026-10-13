import { ArrowUp, CheckCircle2, Eye, ShieldCheck, Trash2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import ConfirmButton from "@/components/foro/ConfirmButton";
import ForumHero from "@/components/foro/ForumHero";
import { AnswerForm } from "@/components/foro/forms";
import { getCurrentUser } from "@/lib/auth";
import { addView, categoryLabel, getQuestion, listAnswers, timeAgo } from "@/lib/forum";
import { acceptAnswer, deleteAnswer, deleteQuestion, toggleVote } from "../actions";

export default function PreguntaPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="h-[60vh]" />}>
      <Content params={params} />
    </Suspense>
  );
}

function Author({ name, role, ts }: { name: string; role: "user" | "admin"; ts: number }) {
  return (
    <p className="flex flex-wrap items-center gap-x-2 text-[12px] text-ink/55">
      <b className="text-ink/80">{name}</b>
      {role === "admin" && (
        <span className="inline-flex items-center gap-1 rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-bold text-brand-dark">
          <ShieldCheck className="h-3 w-3" /> Equipo Tu Embalaje
        </span>
      )}
      <span>· {timeAgo(ts)}</span>
    </p>
  );
}

async function Content({ params }: { params: Promise<{ id: string }> }) {
  const { id: raw } = await params;
  const id = /^\d+$/.test(raw) ? Number(raw) : NaN;
  const question = Number.isFinite(id) ? getQuestion(id) : undefined;
  if (!question) notFound();

  const user = await getCurrentUser();
  addView(question.id);
  const answers = listAnswers(question.id, user?.id ?? null);

  const canManageQuestion = !!user && (user.id === question.author_id || user.role === "admin");
  const next = encodeURIComponent(`/foro/${question.id}`);

  return (
    <>
      <ForumHero title={question.title} />

      <div className="mx-auto max-w-3xl px-5 py-10">
        <article className="rounded-2xl bg-white p-6 shadow-md">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={`/foro?categoria=${question.category}`}
              className="rounded-full bg-forest/10 px-3 py-1 text-[11px] font-bold text-forest hover:bg-forest/20"
            >
              {categoryLabel(question.category)}
            </Link>
            <span className="flex items-center gap-1 text-[11px] text-ink/50">
              <Eye className="h-3.5 w-3.5" /> {question.views + 1} vistas
            </span>
          </div>
          <p className="mt-4 whitespace-pre-wrap break-words text-[15px] leading-relaxed text-ink/85">{question.body}</p>
          <div className="mt-5 flex items-center justify-between gap-3 border-t border-black/5 pt-4">
            <Author name={question.author} role={question.author_role} ts={question.created_at} />
            {canManageQuestion && (
              <form action={deleteQuestion.bind(null, question.id)}>
                <ConfirmButton
                  message="¿Eliminar esta pregunta y todas sus respuestas?"
                  className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-red-600 hover:underline"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Eliminar
                </ConfirmButton>
              </form>
            )}
          </div>
        </article>

        <h2 className="mt-10 text-xl font-extrabold text-forest-dark">
          {answers.length} {answers.length === 1 ? "respuesta" : "respuestas"}
        </h2>

        <ul className="mt-4 space-y-3">
          {answers.map((a) => {
            const accepted = question.accepted_id === a.id;
            const canDelete = !!user && (user.id === a.author_id || user.role === "admin");
            const canAccept = !!user && (user.id === question.author_id || user.role === "admin");
            const canVote = !!user && user.id !== a.author_id;

            return (
              <li
                key={a.id}
                className={`flex gap-4 rounded-2xl bg-white p-5 shadow-sm ${accepted ? "ring-2 ring-brand" : ""}`}
              >
                <div className="flex w-10 shrink-0 flex-col items-center gap-1">
                  {canVote ? (
                    <form action={toggleVote.bind(null, a.id)}>
                      <button
                        aria-label={a.voted ? "Quitar voto" : "Votar útil"}
                        className={`flex h-9 w-9 items-center justify-center rounded-full border transition ${
                          a.voted ? "border-brand bg-brand text-white" : "border-black/10 text-ink/50 hover:border-brand hover:text-brand"
                        }`}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                    </form>
                  ) : (
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-black/5 text-ink/30">
                      <ArrowUp className="h-4 w-4" />
                    </span>
                  )}
                  <span className="text-[13px] font-extrabold text-forest-dark">{a.votes}</span>
                  {accepted && <CheckCircle2 className="h-6 w-6 fill-brand text-white" aria-label="Respuesta aceptada" />}
                </div>

                <div className="min-w-0 flex-1">
                  {accepted && <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-brand-dark">Respuesta aceptada</p>}
                  <p className="whitespace-pre-wrap break-words text-[14px] leading-relaxed text-ink/85">{a.body}</p>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <Author name={a.author} role={a.author_role} ts={a.created_at} />
                    <div className="flex items-center gap-4 text-[12px] font-semibold">
                      {canAccept && (
                        <form action={acceptAnswer.bind(null, a.id)}>
                          <button className="text-brand-dark hover:underline">
                            {accepted ? "Quitar como aceptada" : "Marcar como solución"}
                          </button>
                        </form>
                      )}
                      {canDelete && (
                        <form action={deleteAnswer.bind(null, a.id)}>
                          <ConfirmButton message="¿Eliminar esta respuesta?" className="text-red-600 hover:underline">
                            Eliminar
                          </ConfirmButton>
                        </form>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-8">
          {user ? (
            <AnswerForm questionId={question.id} />
          ) : (
            <div className="rounded-2xl bg-white p-6 text-center shadow-md">
              <p className="font-bold text-forest-dark">¿Quieres responder?</p>
              <p className="mt-1 text-[13px] text-ink/60">Ingresa o crea una cuenta gratis para participar.</p>
              <div className="mt-4 flex justify-center gap-3">
                <Link href={`/foro/ingresar?next=${next}`} className="rounded-full border border-black/10 px-5 py-2.5 text-xs font-bold text-forest-dark hover:border-brand hover:text-brand">
                  Ingresar
                </Link>
                <Link href={`/foro/registro?next=${next}`} className="rounded-full bg-brand px-5 py-2.5 text-xs font-bold text-white hover:bg-brand-dark">
                  Crear cuenta
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
