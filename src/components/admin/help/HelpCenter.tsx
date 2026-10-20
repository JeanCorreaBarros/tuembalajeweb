"use client";

import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { ARTICLES } from "./articles";

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

/** Guía de uso del panel: buscador, índice fijo y artículos. */
export default function HelpCenter() {
  const [q, setQ] = useState("");
  const [current, setCurrent] = useState(ARTICLES[0].id);
  const words = norm(q).split(/\s+/).filter(Boolean);
  const visible = ARTICLES.filter((a) => {
    const hay = norm(`${a.title} ${a.summary} ${a.keywords}`);
    return words.every((w) => hay.includes(w));
  });

  // Marca en el índice el artículo que se está leyendo.
  useEffect(() => {
    const els = ARTICLES.map((a) => document.getElementById(a.id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        const top = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (top) setCurrent(top.target.id);
      },
      { rootMargin: "-90px 0px -60% 0px" },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [q]);

  return (
    <>
      {/* Buscador */}
      <div className="relative mb-6 overflow-hidden rounded-3xl bg-forest-dark px-5 py-7 text-white sm:px-8 sm:py-9">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full border-2 border-brand/20" aria-hidden />
        <div className="pointer-events-none absolute -right-4 -top-4 h-32 w-32 rounded-full border-2 border-brand/25" aria-hidden />
        <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-lime">Centro de ayuda</p>
        <h2 className="mt-1 text-[22px] font-extrabold sm:text-[26px]">¿Qué quieres hacer hoy?</h2>
        <p className="mt-1 max-w-xl text-[14px] text-white/65">Busca una tarea o un tema: «cambiar foto», «WhatsApp», «Google», «deshacer»…</p>
        <label className="relative mt-5 block max-w-xl">
          <span className="sr-only">Buscar en la guía</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink/40" aria-hidden />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar en la guía"
            className="w-full rounded-full bg-white py-3.5 pl-12 pr-12 text-base text-ink outline-none ring-4 ring-transparent transition focus:ring-brand/40 sm:text-[15px]"
          />
          {q && (
            <button
              type="button"
              onClick={() => setQ("")}
              aria-label="Borrar búsqueda"
              className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-ink/50 hover:bg-mist"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </label>
      </div>

      {/* Atajos */}
      {!q && (
        <ul className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {ARTICLES.slice(0, 8).map(({ id, title, summary, icon: Icon }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className="flex h-full gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md hover:ring-brand/30"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block text-[14px] font-bold text-forest-dark">{title}</span>
                  <span className="mt-0.5 block text-[12px] leading-snug text-ink/55">{summary}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        {/* Índice */}
        <nav aria-label="Temas de la guía" className="hidden lg:sticky lg:top-20 lg:block lg:self-start">
          <p className="mb-2 px-3 text-[11px] font-extrabold uppercase tracking-[0.12em] text-ink/40">Temas</p>
          <ul className="space-y-0.5">
            {visible.map((a) => (
              <li key={a.id}>
                <a
                  href={`#${a.id}`}
                  className={`block rounded-lg px-3 py-2 text-[13px] font-semibold transition ${
                    current === a.id ? "bg-white text-forest-dark shadow-sm ring-1 ring-black/5" : "text-ink/55 hover:text-forest-dark"
                  }`}
                >
                  {a.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Artículos */}
        <div className="min-w-0 space-y-5">
          {visible.length === 0 && (
            <p className="rounded-3xl bg-white p-8 text-center text-[14px] text-ink/55 shadow-sm ring-1 ring-black/5">
              No encontramos nada con «{q}». Prueba con otra palabra.
            </p>
          )}
          {visible.map(({ id, title, summary, icon: Icon, body }) => (
            <article key={id} id={id} className="scroll-mt-24 rounded-3xl bg-white shadow-sm ring-1 ring-black/5">
              <header className="flex items-start gap-3.5 border-b border-black/5 px-5 py-4 sm:px-7 sm:py-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-forest-dark text-lime">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <div className="min-w-0">
                  <h2 className="text-[19px] font-extrabold text-forest-dark">{title}</h2>
                  <p className="text-[13px] text-ink/55">{summary}</p>
                </div>
              </header>
              <div className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">{body}</div>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
