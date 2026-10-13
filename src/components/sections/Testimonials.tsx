"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { IMAGES } from "@/lib/images";
import Reveal from "../ui/Reveal";
import SmartImage from "../ui/SmartImage";

const testimonials = [
  {
    quote: "Excelente servicio y calidad en cada pedido. Los embalajes llegaron en perfecto estado y superaron nuestras expectativas.",
    name: "Carlos Méndez",
    role: "Gerente de Logística - Industrias del Norte",
    img: IMAGES.clientAvatar,
  },
  {
    quote: "Nos diseñaron una caja a la medida para maquinaria delicada. Cero daños en la exportación.",
    name: "Laura Gómez",
    role: "Directora de Operaciones - AgroExport",
    img: IMAGES.clientAvatar,
  },
  {
    quote: "Cumplen los tiempos y la madera viene certificada NIMF 15. Totalmente recomendados.",
    name: "Andrés Rojas",
    role: "Jefe de Compras - Comercial Andina",
    img: IMAGES.clientAvatar,
  },
];

export default function Testimonials() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = testimonials.length;
  const t = testimonials[i];

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setI((x) => (x + 1) % n), 6000);
    return () => clearInterval(id);
  }, [paused, n]);

  return (
    <section className="relative isolate overflow-hidden bg-forest-dark py-14 text-white">
      <div className="absolute inset-y-0 left-0 -z-10 w-1/4 opacity-50">
        <SmartImage src={IMAGES.testimonialsBg} alt="" sizes="25vw" />
      </div>
      <div className="mx-auto grid max-w-[1240px] items-center gap-8 px-5 lg:grid-cols-[1fr_1.4fr] lg:px-8">
        <Reveal x={-40} y={0}>
          <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em]">
            <span className="h-[3px] w-6 rounded bg-brand" /> Lo que dicen nuestros clientes
          </p>
          <h2 className="mt-3 text-2xl font-extrabold leading-tight lg:text-[28px]">
            La confianza de nuestros clientes es nuestra mayor satisfacción
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
              onClick={() => setI((i - 1 + n) % n)}
              className="rounded-full p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="relative min-h-[130px] flex-1 overflow-hidden rounded-xl bg-white p-5 text-ink shadow-xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.35 }}
                  className="flex gap-4"
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full">
                    <SmartImage src={t.img} alt={t.name} sizes="56px" />
                  </div>
                  <div>
                    <p className="text-[12px] leading-snug text-ink/80">“{t.quote}”</p>
                    <p className="mt-2 text-[11px] font-bold text-forest-dark">{t.name}</p>
                    <div className="flex items-end justify-between gap-4">
                      <p className="text-[9px] text-ink/55">{t.role}</p>
                      <div className="flex text-amber-400">
                        {Array.from({ length: 5 }).map((_, s) => (
                          <Star key={s} className="h-3 w-3 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <button
              aria-label="Siguiente"
              onClick={() => setI((i + 1) % n)}
              className="rounded-full p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-3 flex justify-center gap-1.5">
            {testimonials.map((_, d) => (
              <button
                key={d}
                aria-label={`Testimonio ${d + 1}`}
                onClick={() => setI(d)}
                className={`h-1.5 rounded-full transition-all ${d === i ? "w-5 bg-white" : "w-1.5 bg-white/40"}`}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
