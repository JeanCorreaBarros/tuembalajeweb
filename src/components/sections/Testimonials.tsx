"use client";

import { AnimatePresence, m } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Lines } from "@/components/cms/Text";
import type { CmsValues } from "@/lib/cms/pages";
import Reveal from "../ui/Reveal";
import SmartImage from "../ui/SmartImage";

const initials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

/** Testimonios (editables en /admin: Inicio · Testimonios). */
export default function Testimonials({ c }: { c: CmsValues<"inicio">["testimonios"] }) {
  const testimonials = c.items;
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = Math.max(1, testimonials.length);
  const t = testimonials[i % n] ?? { quote: "", name: "", role: "" };

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setI((x) => (x + 1) % n), 6000);
    return () => clearInterval(id);
  }, [paused, n]);

  const prev = () => setI((x) => (x - 1 + n) % n);
  const next = () => setI((x) => (x + 1) % n);
  const arrowCls =
    "h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/25 bg-black/25 text-white/80 transition hover:border-lime hover:text-lime";

  return (
    <section className="relative isolate overflow-hidden bg-forest-dark text-white">
      {/* Fondo: cajas a la izquierda y bosque oscuro detrás del texto y la tarjeta. */}
      <div className="absolute inset-0 -z-20 [&_img]:object-[0%_45%]">
        <SmartImage src={c.image} alt="" />
      </div>
      <div className="absolute inset-0 -z-10 bg-black/40 lg:bg-black/15" />

      <div className="grid grid-cols-1 items-center gap-8 px-5 py-12 sm:px-8 lg:min-h-[clamp(210px,13vw,260px)] lg:grid-cols-[15%_minmax(0,1fr)_minmax(0,47%)] lg:gap-6 lg:px-[3%] lg:py-6">
        <div className="hidden lg:block" />
        <Reveal x={-40} y={0}>
          <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em]">
            <span className="h-[3px] w-6 rounded bg-brand" /> {c.eyebrow}
          </p>
          <h2 className="mt-2 max-w-[540px] text-2xl font-extrabold leading-tight drop-shadow 2xl:text-[28px]">
            <Lines text={c.title} />
          </h2>
        </Reveal>

        <Reveal delay={0.15}>
          <div
            className="flex items-center gap-3"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <button
              aria-label="Anterior"
              onClick={prev}
              className={`${arrowCls} hidden sm:flex`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="relative min-h-[130px] min-w-0 flex-1 overflow-hidden rounded-xl bg-white p-4 text-ink shadow-xl sm:p-5">
              <AnimatePresence mode="wait">
                {/* En pantallas táctiles se puede deslizar la tarjeta para cambiar de testimonio. */}
                <m.div
                  key={i}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.35 }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.4}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -50) next();
                    else if (info.offset.x > 50) prev();
                  }}
                  className="flex cursor-grab touch-pan-y gap-3 active:cursor-grabbing sm:gap-4"
                >
                  {/* Iniciales del cliente (no hay fotos de clientes). */}
                  <span
                    aria-hidden
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-forest text-[14px] font-extrabold text-white sm:h-14 sm:w-14 sm:text-[16px]"
                  >
                    {initials(t.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] leading-snug text-ink/80">“{t.quote}”</p>
                    <p className="mt-2 text-[12px] font-bold text-forest-dark">{t.name}</p>
                    <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-1.5">
                      <p className="text-[11px] text-ink/55">{t.role}</p>
                      <div className="flex text-brand">
                        {Array.from({ length: 5 }).map((_, s) => (
                          <Star key={s} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                </m.div>
              </AnimatePresence>
            </div>

            <button
              aria-label="Siguiente"
              onClick={next}
              className={`${arrowCls} hidden sm:flex`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          {/* En celular las flechas van aquí abajo para que la tarjeta use todo el ancho. */}
          <div className="mt-4 flex items-center justify-center gap-3 sm:mt-3">
            <button aria-label="Anterior" onClick={prev} className={`${arrowCls} flex sm:hidden`}>
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex">
              {testimonials.map((_, d) => (
                <button
                  key={d}
                  aria-label={`Testimonio ${d + 1}`}
                  aria-current={d === i}
                  onClick={() => setI(d)}
                  // Zona táctil amplia (28px) con el punto pequeño dentro.
                  className="flex h-7 min-w-7 items-center justify-center"
                >
                  <span className={`h-1.5 rounded-full transition-all ${d === i ? "w-5 bg-white" : "w-1.5 bg-white/40"}`} />
                </button>
              ))}
            </div>
            <button aria-label="Siguiente" onClick={next} className={`${arrowCls} flex sm:hidden`}>
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
