import { connection } from "next/server";
import { CheckCircle2, Eye, MessageCircle, MessagesSquare, ShieldCheck, Trash2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Avatar from "@/components/foro/Avatar";
import AnswerThread from "@/components/foro/AnswerThread";
import ConfirmButton from "@/components/foro/ConfirmButton";
import ForumBar from "@/components/foro/ForumBar";
import ForumHero from "@/components/foro/ForumHero";
import { AnswerForm } from "@/components/foro/forms";
import { getCurrentUser } from "@/lib/auth";
import { addView, categoryLabel, getQuestion, listAnswers, relatedQuestions, timeAgo } from "@/lib/forum";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbs, pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { deleteQuestion } from "../actions";

const parseId = (raw: string) => (/^\d+$/.test(raw) ? Number(raw) : NaN);
/** Resumen de una línea para la descripción de Google (máx. ~155 caracteres). */
const snippet = (text: string, max = 155) => {
  const s = text.replace(/\s+/g, " ").trim();
  return s.length > max ? `${s.slice(0, max - 1).trimEnd()}…` : s;
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const id = parseId((await params).id);
  const q = Number.isFinite(id) ? getQuestion(id) : undefined;
  if (!q) return { title: "Pregunta no encontrada", robots: { index: false, follow: true } };
  return pageMetadata({
    title: q.title,
    description: snippet(`${categoryLabel(q.category)}: ${q.body}`),
    path: `/foro/${q.id}`,
  });
}

export default function PreguntaPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="h-[70vh] bg-forest-dark" />}>
      <Content params={params} />
    </Suspense>
  );
}

function Author({ name, role, ts, label }: { name: string; role: "user" | "admin"; ts: number; label?: string }) {
  return (
    <div className="flex items-center gap-3">
      <Avatar name={name} role={role} />
      <div className="leading-tight">
        <p className="flex flex-wrap items-center gap-2 text-[13px] font-bold text-ink/85">
          {name}
          {role === "admin" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-forest px-2 py-0.5 text-[10px] font-bold text-white">
              <ShieldCheck className="h-3 w-3" /> Equipo Tu Embalaje
            </span>
          )}
        </p>
        <p className="mt-0.5 text-[11px] text-ink/45">
          {label} {timeAgo(ts)}
        </p>
      </div>
    </div>
  );
}

async function Content({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id: raw } = await params;
  const id = parseId(raw);
  const question = Number.isFinite(id) ? getQuestion(id) : undefined;
  if (!question) notFound();

  const user = await getCurrentUser();
  addView(question.id);
  const answers = listAnswers(question.id, user?.id ?? null);
  const related = relatedQuestions(question.category, question.id);
  const topLevel = answers.filter((a) => a.parent_id === null).length;
  const replies = answers.length - topLevel;

  const isOwner = !!user && user.id === question.author_id;
  const canManage = !!user && (isOwner || user.role === "admin");
  const next = encodeURIComponent(`/foro/${question.id}`);

  // Datos de pregunta y respuestas (QAPage): Google puede mostrarlos como resultado enriquecido.
  const url = `${SITE.url}/foro/${question.id}`;
  const toAnswer = (a: (typeof answers)[number]) => ({
    "@type": "Answer",
    text: a.body,
    dateCreated: new Date(a.created_at).toISOString(),
    upvoteCount: a.votes,
    url: `${url}#r${a.id}`,
    author: { "@type": "Person", name: a.author },
  });
  const accepted = answers.find((a) => a.id === question.accepted_id);
  const qaPage = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    mainEntity: {
      "@type": "Question",
      name: question.title,
      text: question.body,
      answerCount: answers.length,
      dateCreated: new Date(question.created_at).toISOString(),
      author: { "@type": "Person", name: question.author },
      ...(accepted ? { acceptedAnswer: toAnswer(accepted) } : {}),
      suggestedAnswer: answers.filter((a) => a.id !== question.accepted_id).map(toAnswer),
    },
  };

  return (
    <>
      {answers.length > 0 && <JsonLd data={qaPage} />}
      <JsonLd
        data={breadcrumbs([
          { name: "Inicio", path: "/" },
          { name: "Foro", path: "/foro" },
          { name: question.title, path: `/foro/${question.id}` },
        ])}
      />
      <ForumHero
        bar={<ForumBar crumbs={[{ label: categoryLabel(question.category), href: `/foro?categoria=${question.category}` }, { label: "Pregunta" }]} />}
        eyebrow={categoryLabel(question.category)}
        title={question.title}
      >
        <div className="flex flex-wrap items-center gap-3 text-[12px] text-white/75">
          {question.accepted_id ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1.5 font-bold text-white">
              <CheckCircle2 className="h-4 w-4" /> Resuelta
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1.5 font-semibold">
              Abierta
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <MessageCircle className="h-4 w-4 text-lime" /> {answers.length} {answers.length === 1 ? "respuesta" : "respuestas"}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Eye className="h-4 w-4 text-lime" /> {question.views + 1} vistas
          </span>
        </div>
      </ForumHero>

      <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-8 px-5 py-8 sm:px-8 sm:py-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8">
        <div className="min-w-0">
          <article className="rounded-3xl bg-white p-5 shadow-sm sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Author name={question.author} role={question.author_role} ts={question.created_at} label="Preguntó" />
              {canManage && (
                <form action={deleteQuestion.bind(null, question.id)}>
                  <ConfirmButton
                    message="¿Eliminar esta pregunta y todas sus respuestas?"
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Eliminar
                  </ConfirmButton>
                </form>
              )}
            </div>
            <p className="mt-6 whitespace-pre-wrap break-words text-[15px] leading-[1.75] text-ink/85">{question.body}</p>
          </article>

          <div className="mt-10 flex items-center gap-3">
            <h2 className="text-xl font-extrabold text-forest-dark">
              {topLevel} {topLevel === 1 ? "respuesta" : "respuestas"}
              {replies > 0 && (
                <span className="ml-2 text-[14px] font-semibold text-ink/45">
                  · {replies} {replies === 1 ? "comentario" : "comentarios"}
                </span>
              )}
            </h2>
            <span className="h-px flex-1 bg-black/10" />
          </div>

          {answers.length === 0 && (
            <div className="mt-4 rounded-3xl border border-dashed border-brand/30 bg-white px-6 py-10 text-center">
              <MessagesSquare className="mx-auto h-8 w-8 text-brand/60" />
              <p className="mt-3 font-bold text-forest-dark">Todavía no hay respuestas</p>
              <p className="mt-1 text-[13px] text-ink/55">¿Sabes la respuesta? Ayuda a la comunidad.</p>
            </div>
          )}

          <AnswerThread
            answers={answers}
            questionId={question.id}
            acceptedId={question.accepted_id}
            user={user}
            canManage={canManage}
          />

          <div className="mt-8">
            {user ? (
              <AnswerForm questionId={question.id} userName={user.name} userRole={user.role} />
            ) : (
              <div className="flex flex-col items-center gap-4 rounded-3xl bg-white p-6 text-center shadow-sm sm:flex-row sm:p-8 sm:text-left">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                  <MessageCircle className="h-7 w-7" />
                </span>
                <div className="flex-1">
                  <p className="text-[16px] font-extrabold text-forest-dark">¿Quieres responder?</p>
                  <p className="mt-0.5 text-[13px] text-ink/60">Ingresa o crea una cuenta gratis para participar.</p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/foro/ingresar?next=${next}`}
                    className="rounded-full border border-black/10 px-5 py-2.5 text-[13px] font-bold text-forest-dark hover:border-brand hover:text-brand"
                  >
                    Ingresar
                  </Link>
                  <Link href={`/foro/registro?next=${next}`} className="rounded-full bg-brand px-5 py-2.5 text-[13px] font-bold text-white hover:bg-brand-dark">
                    Crear cuenta
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-5">
          <section className="rounded-3xl bg-white p-5 shadow-sm">
            <h3 className="text-[13px] font-extrabold uppercase tracking-wider text-forest-dark">
              Más en {categoryLabel(question.category)}
            </h3>
            {related.length === 0 ? (
              <p className="mt-3 text-[13px] text-ink/55">Aún no hay otras preguntas en esta categoría.</p>
            ) : (
              <ul className="mt-3 space-y-1">
                {related.map((r) => (
                  <li key={r.id}>
                    <Link href={`/foro/${r.id}`} className="flex items-start gap-3 rounded-xl p-2 transition hover:bg-mist">
                      <span className="mt-0.5 flex h-6 min-w-6 items-center justify-center rounded-md bg-brand/10 px-1 text-[11px] font-bold text-brand-dark">
                        {r.answers}
                      </span>
                      <span className="text-[13px] leading-snug text-ink/75">{r.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <div className="rounded-3xl bg-gradient-to-br from-brand-dark to-forest p-6 text-white shadow-xl shadow-forest/20">
            <h3 className="text-lg font-extrabold">¿Tienes otra duda?</h3>
            <p className="mt-1.5 text-[13px] text-white/80">Pregúntale a la comunidad y al equipo de Tu Embalaje.</p>
            <Link
              href="/foro/preguntar"
              className="mt-4 inline-flex rounded-full bg-white px-5 py-2.5 text-[13px] font-bold text-forest transition hover:bg-lime"
            >
              Hacer una pregunta
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
