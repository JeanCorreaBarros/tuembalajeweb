import { connection } from "next/server";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Eye,
  MessageCircle,
  MessagesSquare,
  Plus,
  Search,
  ShieldCheck,
  Trophy,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import Avatar from "@/components/foro/Avatar";
import ForumBar from "@/components/foro/ForumBar";
import ForumHero from "@/components/foro/ForumHero";
import { WhatsAppIcon } from "@/components/ui/icons";
import {
  CATEGORIES,
  categoryCounts,
  categoryLabel,
  isCategory,
  isView,
  listQuestions,
  stats,
  timeAgo,
  topMembers,
  VIEWS,
  type View,
} from "@/lib/forum";
import { breadcrumbs, pageMetadata } from "@/lib/seo";
import { getSettings } from "@/lib/cms/settings";
import JsonLd from "@/components/seo/JsonLd";

// Los filtros (?q=, ?categoria=, ?pagina=) apuntan a /foro como URL canónica: evita contenido duplicado.
export const metadata = pageMetadata({
  title: "Foro de preguntas sobre embalajes en madera",
  description:
    "Pregunta y resuelve dudas sobre cajas de madera, estibas, embalajes especiales, exportación y NIMF 15 con la comunidad y el equipo de Tu Embalaje.",
  path: "/foro",
});

type SP = Promise<{ q?: string; categoria?: string; pagina?: string; vista?: string }>;

export default function ForoPage({ searchParams }: { searchParams: SP }) {
  return (
    <>
      <JsonLd
        data={breadcrumbs([
          { name: "Inicio", path: "/" },
          { name: "Foro", path: "/foro" },
        ])}
      />
      <Suspense fallback={<ListSkeleton />}>
        <ForoList searchParams={searchParams} />
      </Suspense>
    </>
  );
}

function ListSkeleton() {
  return (
    <>
      <div className="h-[380px] bg-forest-dark" />
      <div className="mx-auto max-w-[1240px] space-y-3 px-5 py-10 lg:px-8">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-32 animate-pulse rounded-2xl bg-white" />
        ))}
      </div>
    </>
  );
}

type Params = { q?: string; categoria?: string; vista?: View; pagina?: number };

function href(p: Params) {
  const sp = new URLSearchParams();
  if (p.q) sp.set("q", p.q);
  if (p.categoria) sp.set("categoria", p.categoria);
  if (p.vista && p.vista !== "recientes") sp.set("vista", p.vista);
  if (p.pagina && p.pagina > 1) sp.set("pagina", String(p.pagina));
  const s = sp.toString();
  return s ? `/foro?${s}` : "/foro";
}

async function ForoList({ searchParams }: { searchParams: SP }) {
  await connection();
  const sp = await searchParams;
  const q = (sp.q ?? "").trim().slice(0, 100);
  const categoria = sp.categoria && isCategory(sp.categoria) ? sp.categoria : undefined;
  const vista: View = sp.vista && isView(sp.vista) ? sp.vista : "recientes";
  const page = Math.max(1, Number.parseInt(sp.pagina ?? "1", 10) || 1);

  const { rows, total, pages } = listQuestions({ q, category: categoria, view: vista, page });
  const s = stats();
  const settings = await getSettings();
  const counts = categoryCounts();
  const members = topMembers();
  const filtered = !!(q || categoria || vista !== "recientes");

  return (
    <>
      <ForumHero
        bar={<ForumBar />}
        title={
          <>
            Foro de preguntas <span className="text-lime">y respuestas</span>
          </>
        }
        text="Resuelve tus dudas sobre estibas, embalajes especiales, exportación y NIMF 15 con la comunidad y el equipo experto de Tu Embalaje."
      >
        <form action="/foro" className="flex max-w-2xl items-center gap-1.5 rounded-2xl bg-white p-1.5 shadow-2xl shadow-black/20 sm:gap-2 sm:p-2">
          {categoria && <input type="hidden" name="categoria" value={categoria} />}
          <Search className="ml-2.5 h-5 w-5 shrink-0 text-ink/40 sm:ml-3" />
          <input
            name="q"
            type="search"
            defaultValue={q}
            placeholder="¿Qué quieres saber? Ej: estibas para exportar a Europa"
            className="min-w-0 flex-1 bg-transparent px-1.5 py-2.5 text-base text-ink outline-none placeholder:text-ink/40 sm:px-2 sm:text-[14px]"
          />
          <button className="shrink-0 rounded-xl bg-brand px-4 py-3 text-[13px] font-bold text-white transition hover:bg-brand-dark sm:px-5">
            Buscar
          </button>
        </form>

        <ul className="mt-6 flex flex-wrap gap-3">
          {[
            { icon: MessagesSquare, n: s.questions, label: "preguntas" },
            { icon: MessageCircle, n: s.answers, label: "respuestas" },
            { icon: Users, n: s.members, label: "miembros" },
          ].map(({ icon: Icon, n, label }) => (
            <li key={label} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 backdrop-blur">
              <Icon className="h-5 w-5 text-lime" />
              <span className="text-[13px] text-white/70">
                <b className="mr-1 text-lg font-extrabold text-white">{n}</b>
                {label}
              </span>
            </li>
          ))}
        </ul>
      </ForumHero>

      <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-8 px-5 py-8 sm:px-8 sm:py-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8">
        {/* ---------- columna principal ---------- */}
        <div className="min-w-0">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <nav aria-label="Ordenar" className="no-scrollbar flex gap-1 overflow-x-auto rounded-full bg-white p-1 shadow-sm">
              {VIEWS.map((v) => (
                <Link
                  key={v.slug}
                  href={href({ q, categoria, vista: v.slug })}
                  className={`shrink-0 whitespace-nowrap rounded-full px-3.5 py-2 text-[12px] font-bold transition sm:px-4 ${
                    vista === v.slug ? "bg-forest text-white shadow" : "text-ink/60 hover:text-forest"
                  }`}
                >
                  {v.label}
                </Link>
              ))}
            </nav>
            <Link
              href="/foro/preguntar"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-[13px] font-bold text-white shadow-lg shadow-brand/30 transition hover:-translate-y-0.5 hover:bg-brand-dark"
            >
              <Plus className="h-4 w-4" /> Hacer una pregunta
            </Link>
          </div>

          {/* En celular las categorías van en una fila que se desliza de lado. */}
          <ul className="no-scrollbar -mx-5 mt-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
            {[{ slug: "", label: "Todas" }, ...CATEGORIES].map((c) => {
              const active = (categoria ?? "") === c.slug;
              return (
                <li key={c.slug} className="shrink-0">
                  <Link
                    href={href({ q, vista, categoria: c.slug || undefined })}
                    className={`inline-block whitespace-nowrap rounded-full border px-4 py-1.5 text-[12px] font-semibold transition ${
                      active
                        ? "border-brand bg-brand/10 text-brand-dark"
                        : "border-black/10 bg-white text-ink/70 hover:border-brand hover:text-brand-dark"
                    }`}
                  >
                    {c.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {filtered && (
            <p className="mt-5 text-[13px] text-ink/60">
              {total} {total === 1 ? "pregunta" : "preguntas"}
              {q && (
                <>
                  {" "}
                  para “<b className="text-ink">{q}</b>”
                </>
              )}
              {categoria && <> en <b className="text-ink">{categoryLabel(categoria)}</b></>}.{" "}
              <Link href="/foro" className="font-bold text-brand-dark hover:underline">
                Limpiar filtros
              </Link>
            </p>
          )}

          {rows.length === 0 ? (
            <div className="mt-6 flex flex-col items-center rounded-3xl border border-dashed border-brand/30 bg-white px-6 py-14 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                <MessagesSquare className="h-8 w-8" />
              </span>
              <h2 className="mt-5 text-xl font-extrabold text-forest-dark">
                {filtered ? "No encontramos preguntas con ese filtro" : "Sé el primero en preguntar"}
              </h2>
              <p className="mt-2 max-w-md text-[14px] text-ink/60">
                {filtered
                  ? "Prueba con otras palabras o quita los filtros. Si no encuentras tu duda, pregúntala."
                  : "Nuestro equipo y la comunidad te ayudan con medidas, tipos de madera, normas de exportación y más."}
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  href="/foro/preguntar"
                  className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-[13px] font-bold text-white shadow-lg shadow-brand/30 hover:bg-brand-dark"
                >
                  <Plus className="h-4 w-4" /> Hacer una pregunta
                </Link>
                {filtered && (
                  <Link href="/foro" className="rounded-full border border-black/10 px-6 py-3 text-[13px] font-bold text-forest-dark hover:border-brand">
                    Ver todas
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <ul className="mt-5 space-y-3">
              {rows.map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/foro/${r.id}`}
                    className="group flex gap-3 rounded-2xl border border-transparent bg-white p-4 shadow-sm sm:gap-4 sm:p-5 transition hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-xl hover:shadow-forest/5"
                  >
                    <Avatar name={r.author} role={r.author_role} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-[11px]">
                        <b className="text-ink/80">{r.author}</b>
                        {r.author_role === "admin" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-forest px-2 py-0.5 text-[10px] font-bold text-white">
                            <ShieldCheck className="h-3 w-3" /> Equipo
                          </span>
                        )}
                        <span className="text-ink/40">· {timeAgo(r.created_at)}</span>
                      </div>
                      <h2 className="mt-1 text-[16px] font-bold leading-snug text-forest-dark group-hover:text-brand-dark">
                        {r.title}
                      </h2>
                      <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-ink/60">{r.body}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-mist px-2.5 py-1 text-[11px] font-semibold text-forest">
                          {categoryLabel(r.category)}
                        </span>
                        {r.accepted_id && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-brand/10 px-2.5 py-1 text-[11px] font-bold text-brand-dark">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Resuelta
                          </span>
                        )}
                        {/* En celular la columna de respuestas/vistas se oculta: el dato va aquí. */}
                        <span className="inline-flex items-center gap-3 text-[11px] text-ink/45 sm:hidden">
                          <span className="inline-flex items-center gap-1">
                            <MessageCircle className="h-3.5 w-3.5" /> {r.answers}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Eye className="h-3.5 w-3.5" /> {r.views}
                          </span>
                        </span>
                      </div>
                    </div>
                    <div className="hidden shrink-0 flex-col items-end justify-between gap-2 sm:flex">
                      <span
                        className={`flex min-w-[64px] flex-col items-center rounded-xl px-3 py-2 ${
                          r.accepted_id
                            ? "bg-brand text-white"
                            : r.answers
                              ? "border border-brand/40 text-brand-dark"
                              : "border border-black/10 text-ink/50"
                        }`}
                      >
                        <span className="text-lg font-extrabold leading-none">{r.answers}</span>
                        <span className="mt-0.5 text-[10px] font-semibold">{r.answers === 1 ? "respuesta" : "respuestas"}</span>
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-ink/45">
                        <Eye className="h-3.5 w-3.5" /> {r.views}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {pages > 1 && (
            <nav aria-label="Paginación" className="mt-8 flex flex-wrap items-center justify-center gap-2 text-[13px] font-bold">
              {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                <Link
                  key={n}
                  href={href({ q, categoria, vista, pagina: n })}
                  aria-current={n === page ? "page" : undefined}
                  className={`flex h-10 w-10 items-center justify-center rounded-full transition ${
                    n === page ? "bg-forest text-white" : "bg-white text-ink/70 shadow-sm hover:text-brand"
                  }`}
                >
                  {n}
                </Link>
              ))}
            </nav>
          )}
        </div>

        {/* ---------- barra lateral ---------- */}
        <aside className="space-y-5">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-dark to-forest p-6 text-white shadow-xl shadow-forest/20">
            <MessagesSquare className="absolute -right-6 -top-6 h-28 w-28 text-white/10" />
            <h3 className="text-lg font-extrabold">¿Tienes una duda?</h3>
            <p className="mt-1.5 text-[13px] leading-relaxed text-white/80">
              Publícala y recibe respuesta de nuestro equipo y de otros clientes.
            </p>
            <Link
              href="/foro/preguntar"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[13px] font-bold text-forest transition hover:bg-lime"
            >
              Preguntar ahora <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <section className="rounded-3xl bg-white p-5 shadow-sm">
            <h3 className="text-[13px] font-extrabold uppercase tracking-wider text-forest-dark">Categorías</h3>
            <ul className="mt-3 space-y-1">
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={href({ categoria: c.slug, vista })}
                    className={`flex items-center justify-between rounded-xl px-3 py-2 text-[13px] transition ${
                      categoria === c.slug ? "bg-brand/10 font-bold text-brand-dark" : "text-ink/70 hover:bg-mist"
                    }`}
                  >
                    {c.label}
                    <span className="rounded-full bg-mist px-2 py-0.5 text-[11px] font-bold text-ink/50">{counts[c.slug] ?? 0}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {members.length > 0 && (
            <section className="rounded-3xl bg-white p-5 shadow-sm">
              <h3 className="flex items-center gap-2 text-[13px] font-extrabold uppercase tracking-wider text-forest-dark">
                <Trophy className="h-4 w-4 text-amber-500" /> Miembros destacados
              </h3>
              <ul className="mt-4 space-y-3">
                {members.map((m) => (
                  <li key={m.id} className="flex items-center gap-3">
                    <Avatar name={m.name} role={m.role} size="sm" />
                    <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-ink/80">{m.name}</span>
                    <span className="text-[11px] text-ink/50">{m.answers} resp.</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="rounded-3xl bg-white p-5 shadow-sm">
            <h3 className="flex items-center gap-2 text-[13px] font-extrabold uppercase tracking-wider text-forest-dark">
              <BadgeCheck className="h-4 w-4 text-brand" /> Normas del foro
            </h3>
            <ul className="mt-3 space-y-2 text-[13px] leading-snug text-ink/65">
              <li>• Sé claro: incluye medidas, peso y destino.</li>
              <li>• Busca antes de preguntar, quizá ya está resuelto.</li>
              <li>• Respeto ante todo. Nada de spam ni publicidad.</li>
              <li>• Marca la respuesta que resolvió tu duda.</li>
            </ul>
          </section>

          <a
            href={`https://wa.me/${settings.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-3xl bg-forest-dark p-5 text-white transition hover:bg-forest"
          >
            <WhatsAppIcon className="h-10 w-10 shrink-0 text-lime" />
            <span>
              <span className="block text-[14px] font-bold">¿Necesitas una cotización?</span>
              <span className="block text-[12px] text-white/70">Escríbenos por WhatsApp</span>
            </span>
          </a>
        </aside>
      </div>
    </>
  );
}
