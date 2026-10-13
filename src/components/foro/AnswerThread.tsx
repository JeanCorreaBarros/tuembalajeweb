import { CheckCircle2, CornerDownRight, Heart, ShieldCheck, Trash2 } from "lucide-react";
import Link from "next/link";
import { acceptAnswer, deleteAnswer, toggleVote } from "@/app/foro/actions";
import type { User } from "@/lib/auth";
import { timeAgo, type AnswerRow } from "@/lib/forum";
import Avatar from "./Avatar";
import ConfirmButton from "./ConfirmButton";
import { ReplyBox } from "./forms";

/** A partir de este nivel las respuestas ya no se sangran más (siguen mostrando a quién responden). */
const MAX_INDENT = 3;

type Ctx = {
  questionId: number;
  acceptedId: number | null;
  user: User | null;
  canManage: boolean;
  next: string;
  children: Map<number, AnswerRow[]>;
  byId: Map<number, AnswerRow>;
};

/** Respuestas en forma de hilo: cada comentario muestra sus respuestas debajo, unidas por una línea. */
export default function AnswerThread({
  answers,
  questionId,
  acceptedId,
  user,
  canManage,
}: {
  answers: AnswerRow[];
  questionId: number;
  acceptedId: number | null;
  user: User | null;
  canManage: boolean;
}) {
  const byId = new Map(answers.map((a) => [a.id, a]));
  const children = new Map<number, AnswerRow[]>();
  const roots: AnswerRow[] = [];

  for (const a of answers) {
    // Si el comentario padre ya no existe, la respuesta se muestra como directa.
    if (a.parent_id !== null && byId.has(a.parent_id)) {
      const list = children.get(a.parent_id) ?? [];
      list.push(a);
      children.set(a.parent_id, list);
    } else {
      roots.push(a);
    }
  }
  // Las respuestas a comentarios van en orden de conversación (más antiguas primero).
  for (const list of children.values()) list.sort((x, y) => x.created_at - y.created_at);

  const ctx: Ctx = { questionId, acceptedId, user, canManage, next: encodeURIComponent(`/foro/${questionId}`), children, byId };

  return (
    <ul className="mt-4 space-y-4">
      {roots.map((a) => (
        <li key={a.id}>
          <Node a={a} depth={0} ctx={ctx} />
        </li>
      ))}
    </ul>
  );
}

function LikeButton({ a, ctx }: { a: AnswerRow; ctx: Ctx }) {
  const liked = a.voted > 0;
  const base = "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-bold transition";
  const icon = <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />;
  const label = `${a.votes} me gusta`;

  if (!ctx.user) {
    return (
      <Link href={`/foro/ingresar?next=${ctx.next}`} title="Ingresa para dar me gusta" className={`${base} text-ink/50 hover:bg-rose-50 hover:text-rose-600`}>
        {icon} {label}
      </Link>
    );
  }
  if (ctx.user.id === a.author_id) {
    return (
      <span title="No puedes dar me gusta a tu propio comentario" className={`${base} text-ink/35`}>
        {icon} {label}
      </span>
    );
  }
  return (
    <form action={toggleVote.bind(null, a.id)}>
      <button
        aria-pressed={liked}
        title={liked ? "Quitar me gusta" : "Me gusta"}
        className={`${base} ${liked ? "bg-rose-50 text-rose-600" : "text-ink/55 hover:bg-rose-50 hover:text-rose-600"}`}
      >
        {icon} {label}
      </button>
    </form>
  );
}

function Node({ a, depth, ctx }: { a: AnswerRow; depth: number; ctx: Ctx }) {
  const isReply = a.parent_id !== null && ctx.byId.has(a.parent_id);
  const parent = isReply ? ctx.byId.get(a.parent_id!) : undefined;
  const accepted = ctx.acceptedId === a.id;
  const replies = ctx.children.get(a.id) ?? [];
  const canDelete = !!ctx.user && (ctx.user.id === a.author_id || ctx.user.role === "admin");
  const canAccept = ctx.canManage && !isReply;

  return (
    <div>
      <article
        id={`r${a.id}`}
        className={`scroll-mt-28 rounded-3xl bg-white shadow-sm ${isReply ? "p-4 sm:p-5" : "p-5 sm:p-6"} ${
          accepted ? "ring-2 ring-brand" : ""
        }`}
      >
        <header className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <Avatar name={a.author} role={a.author_role} size={isReply ? "sm" : "md"} />
          <div className="min-w-0 flex-1 leading-tight">
            <p className="flex flex-wrap items-center gap-2 text-[13px] font-bold text-ink/85">
              {a.author}
              {a.author_role === "admin" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-forest px-2 py-0.5 text-[10px] font-bold text-white">
                  <ShieldCheck className="h-3 w-3" /> Equipo Tu Embalaje
                </span>
              )}
            </p>
            <p className="mt-0.5 text-[11px] text-ink/45">{timeAgo(a.created_at)}</p>
          </div>
          {accepted && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-[11px] font-bold text-brand-dark">
              <CheckCircle2 className="h-3.5 w-3.5" /> Respuesta aceptada
            </span>
          )}
        </header>

        {parent && (
          <a
            href={`#r${parent.id}`}
            className="mt-3 flex max-w-full items-center gap-2 rounded-xl border-l-4 border-brand/40 bg-mist px-3 py-2 text-[12px] text-ink/60 transition hover:bg-brand/5"
          >
            <CornerDownRight className="h-3.5 w-3.5 shrink-0 text-brand" />
            <span className="shrink-0">
              En respuesta a <b className="text-ink/80">{parent.author}</b>:
            </span>
            <span className="truncate italic">“{parent.body}”</span>
          </a>
        )}

        <p className="mt-3 whitespace-pre-wrap break-words text-[14px] leading-[1.75] text-ink/85">{a.body}</p>

        <footer className="mt-4 flex flex-wrap items-center gap-1 border-t border-black/5 pt-3">
          <LikeButton a={a} ctx={ctx} />
          <ReplyBox
            questionId={ctx.questionId}
            parentId={a.id}
            parentAuthor={a.author}
            loggedIn={!!ctx.user}
            next={ctx.next}
          />
          <span className="flex-1" />
          {canAccept && (
            <form action={acceptAnswer.bind(null, a.id)}>
              <button className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold text-brand-dark transition hover:bg-brand/10">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {accepted ? "Quitar solución" : "Marcar como solución"}
              </button>
            </form>
          )}
          {canDelete && (
            <form action={deleteAnswer.bind(null, a.id)}>
              <ConfirmButton
                message={replies.length ? "¿Eliminar este comentario y sus respuestas?" : "¿Eliminar este comentario?"}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold text-red-600 transition hover:bg-red-50"
              >
                <Trash2 className="h-3.5 w-3.5" /> Eliminar
              </ConfirmButton>
            </form>
          )}
        </footer>
      </article>

      {replies.length > 0 && (
        <ul
          className={`mt-3 space-y-3 ${
            depth < MAX_INDENT ? "ml-4 border-l-2 border-brand/20 pl-4 sm:ml-8 sm:pl-6" : ""
          }`}
        >
          {replies.map((r) => (
            <li key={r.id} className="relative">
              {depth < MAX_INDENT && (
                <span aria-hidden className="absolute -left-4 top-8 h-0.5 w-4 bg-brand/20 sm:-left-6 sm:w-6" />
              )}
              <Node a={r} depth={depth + 1} ctx={ctx} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
