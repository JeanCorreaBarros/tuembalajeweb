import { CheckCircle2, Eye, MessageSquare, Plus, Search } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import ForumHero from "@/components/foro/ForumHero";
import { CATEGORIES, categoryLabel, isCategory, listQuestions, stats, timeAgo } from "@/lib/forum";

type SP = Promise<{ q?: string; categoria?: string; pagina?: string }>;

export default function ForoPage({ searchParams }: { searchParams: SP }) {
  return (
    <Suspense fallback={<div className="h-[60vh]" />}>
      <ForoList searchParams={searchParams} />
    </Suspense>
  );
}

function href(params: { q?: string; categoria?: string; pagina?: number }) {
  const sp = new URLSearchParams();
  if (params.q) sp.set("q", params.q);
  if (params.categoria) sp.set("categoria", params.categoria);
  if (params.pagina && params.pagina > 1) sp.set("pagina", String(params.pagina));
  const s = sp.toString();
  return s ? `/foro?${s}` : "/foro";
}

async function ForoList({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim().slice(0, 100);
  const categoria = sp.categoria && isCategory(sp.categoria) ? sp.categoria : undefined;
  const page = Math.max(1, Number.parseInt(sp.pagina ?? "1", 10) || 1);

  const { rows, total, pages } = listQuestions({ q, category: categoria, page });
  const s = stats();

  return (
    <>
      <ForumHero
        title="Foro de preguntas y respuestas"
        text="Resuelve tus dudas sobre estibas, embalajes especiales y exportación con la comunidad y el equipo de Tu Embalaje."
      >
        <div className="flex flex-wrap items-center gap-6 text-[12px] text-white/85">
          <span><b className="text-lg text-white">{s.questions}</b> preguntas</span>
          <span><b className="text-lg text-white">{s.answers}</b> respuestas</span>
          <span><b className="text-lg text-white">{s.members}</b> miembros</span>
        </div>
      </ForumHero>

      <div className="mx-auto max-w-[1240px] px-5 py-10 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <form action="/foro" className="relative flex-1 sm:max-w-md">
            {categoria && <input type="hidden" name="categoria" value={categoria} />}
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
            <input
              name="q"
              defaultValue={q}
              placeholder="Buscar en el foro…"
              className="w-full rounded-full border border-black/10 bg-white py-3 pl-11 pr-4 text-[13px] outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </form>
          <Link
            href="/foro/preguntar"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-xs font-bold text-white shadow-lg shadow-brand/30 transition hover:bg-brand-dark"
          >
            <Plus className="h-4 w-4" /> Hacer una pregunta
          </Link>
        </div>

        <ul className="mt-5 flex flex-wrap gap-2">
          {[{ slug: "", label: "Todas" }, ...CATEGORIES].map((c) => {
            const active = (categoria ?? "") === c.slug;
            return (
              <li key={c.slug}>
                <Link
                  href={href({ q, categoria: c.slug || undefined })}
                  className={`inline-block rounded-full border px-4 py-1.5 text-[12px] font-semibold transition ${
                    active
                      ? "border-forest bg-forest text-white"
                      : "border-black/10 bg-white text-forest-dark hover:border-brand hover:text-brand"
                  }`}
                >
                  {c.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {(q || categoria) && (
          <p className="mt-5 text-[13px] text-ink/60">
            {total} {total === 1 ? "resultado" : "resultados"}
            {q && <> para “<b>{q}</b>”</>}.{" "}
            <Link href="/foro" className="font-bold text-brand-dark hover:underline">Limpiar filtros</Link>
          </p>
        )}

        {rows.length === 0 ? (
          <div className="mt-8 rounded-2xl bg-white p-10 text-center shadow-sm">
            <MessageSquare className="mx-auto h-10 w-10 text-brand/60" />
            <p className="mt-3 font-bold text-forest-dark">
              {q || categoria ? "No encontramos preguntas con ese filtro." : "Aún no hay preguntas. ¡Haz la primera!"}
            </p>
            <Link href="/foro/preguntar" className="mt-4 inline-block text-[13px] font-bold text-brand-dark hover:underline">
              Hacer una pregunta
            </Link>
          </div>
        ) : (
          <ul className="mt-6 space-y-3">
            {rows.map((r) => (
              <li key={r.id}>
                <Link
                  href={`/foro/${r.id}`}
                  className="group flex gap-4 rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div
                    className={`flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl text-center ${
                      r.accepted_id ? "bg-brand text-white" : r.answers ? "bg-brand/10 text-brand-dark" : "bg-mist text-ink/50"
                    }`}
                  >
                    <span className="text-lg font-extrabold leading-none">{r.answers}</span>
                    <span className="text-[9px] font-semibold">resp.</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-forest/10 px-2.5 py-0.5 text-[10px] font-bold text-forest">
                        {categoryLabel(r.category)}
                      </span>
                      {r.accepted_id && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-brand-dark">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Resuelta
                        </span>
                      )}
                    </div>
                    <h2 className="mt-1.5 text-[15px] font-bold leading-snug text-forest-dark group-hover:text-brand-dark">
                      {r.title}
                    </h2>
                    <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-ink/60">{r.body}</p>
                    <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-ink/50">
                      <span>
                        Por <b className="text-ink/70">{r.author}</b>
                        {r.author_role === "admin" && <span className="ml-1 font-bold text-brand-dark">· Equipo</span>}
                      </span>
                      <span>{timeAgo(r.created_at)}</span>
                      <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {r.views}</span>
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {pages > 1 && (
          <nav aria-label="Paginación" className="mt-8 flex items-center justify-center gap-2 text-[13px] font-semibold">
            {page > 1 && (
              <Link href={href({ q, categoria, pagina: page - 1 })} className="rounded-full bg-white px-4 py-2 shadow-sm hover:text-brand">
                ← Anterior
              </Link>
            )}
            <span className="px-3 text-ink/60">Página {page} de {pages}</span>
            {page < pages && (
              <Link href={href({ q, categoria, pagina: page + 1 })} className="rounded-full bg-white px-4 py-2 shadow-sm hover:text-brand">
                Siguiente →
              </Link>
            )}
          </nav>
        )}
      </div>
    </>
  );
}
