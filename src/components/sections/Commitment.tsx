"use client";

import { m } from "framer-motion";
import { BadgeCheck, Leaf, Recycle, ShieldCheck } from "lucide-react";
import { IMAGES } from "@/lib/images";
import Reveal from "../ui/Reveal";
import SmartImage from "../ui/SmartImage";

const badges = [
  { icon: BadgeCheck, label: "Madera certificada\ncon NIMF 15" },
  { icon: ShieldCheck, label: "Uso responsable\nde recursos" },
  { icon: Recycle, label: "Reutilización\nde materiales" },
];

/** Mancha de pintura verde (trazo de pincel) detrás del mensaje. */
function BrushStroke() {
  return (
    <svg viewBox="0 0 400 230" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="brushFill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#159a3c" />
          <stop offset="0.55" stopColor="#1fb34a" />
          <stop offset="1" stopColor="#127a31" />
        </linearGradient>
      </defs>
      <path
        fill="url(#brushFill)"
        d="M26 64 C70 40 150 30 248 22 C300 18 350 10 388 18 L376 34 L394 44 L380 58 C390 98 388 140 376 172 L392 186 L366 196
           C290 206 196 212 112 218 C78 220 46 220 22 214 L36 200 L10 192 L28 180 C12 146 10 104 18 80 L4 72 Z"
      />
      {/* vetas del pincel */}
      <g stroke="#ffffff" strokeOpacity="0.12" strokeWidth="3" strokeLinecap="round" fill="none">
        <path d="M40 74 C140 58 260 46 370 36" />
        <path d="M30 120 C150 108 270 98 382 92" />
        <path d="M34 168 C140 160 250 150 372 142" />
        <path d="M48 200 C150 196 250 188 340 184" />
      </g>
      <g stroke="#0b3b28" strokeOpacity="0.18" strokeWidth="2" strokeLinecap="round" fill="none">
        <path d="M60 96 C170 84 280 74 360 66" />
        <path d="M52 146 C170 136 280 126 368 118" />
      </g>
    </svg>
  );
}

export default function Commitment() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-20 [&_img]:object-[50%_32%]">
        <SmartImage src={IMAGES.commitmentBg} alt="Manos sosteniendo una planta joven frente a un bosque" />
      </div>
      {/* Aclara solo la franja central para leer el texto; la planta y el bosque quedan nítidos. */}
      <div className="absolute inset-0 -z-10 bg-white/70 lg:bg-transparent lg:bg-[linear-gradient(to_right,transparent_0%,transparent_22%,rgba(255,255,255,0.62)_34%,rgba(255,255,255,0.62)_58%,transparent_74%)]" />

      <div className="grid grid-cols-1 items-center gap-8 px-5 py-12 sm:px-8 md:grid-cols-[minmax(0,1fr)_minmax(0,42%)] lg:min-h-[clamp(340px,21vw,420px)] lg:grid-cols-[33%_minmax(0,1fr)_29%] lg:gap-6 lg:px-[3%] lg:py-8">
        <div className="hidden lg:block" />

        <Reveal>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-dark">Nuestro compromiso</p>
          <h2 className="mt-2 text-3xl font-extrabold leading-[1.15] text-forest-dark xl:text-[34px]">
            Cuidamos el planeta
            <br />
            en cada embalaje
          </h2>
          <p className="mt-3 max-w-[440px] text-[14px] leading-relaxed text-ink/75">
            Utilizamos madera de origen responsable y procesos sostenibles que reducen el impacto ambiental, porque
            creemos en un futuro más verde.
          </p>
          <ul className="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 min-[400px]:grid-cols-2 lg:flex lg:flex-wrap">
            {badges.map(({ icon: Icon, label }, i) => (
              <m.li
                key={label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.12 }}
                className="flex items-center gap-3"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-forest text-white shadow-md shadow-forest/30">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="whitespace-pre text-[12px] font-semibold leading-tight text-forest-dark">{label}</span>
              </m.li>
            ))}
          </ul>
        </Reveal>

        <m.div
          initial={{ opacity: 0, rotate: -14, scale: 0.85 }}
          whileInView={{ opacity: 1, rotate: -9, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative mx-auto aspect-[400/230] w-full max-w-[400px] drop-shadow-xl"
        >
          <BrushStroke />
          <div className="relative flex h-full items-center justify-center gap-3 px-[12%] pb-2">
            <p className="font-script text-[clamp(18px,5.6vw,22px)] leading-[1.15] text-white md:text-[20px] lg:text-[22px] xl:text-[25px]">
              Pequeñas acciones
              <br />
              también hacen
              <br />
              grandes cambios
              <svg viewBox="0 0 200 16" className="mt-1 h-3 w-full max-w-44 text-lime" fill="none" aria-hidden>
                <m.path
                  d="M4 12C60 2 130 2 196 7"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8, duration: 0.9 }}
                />
              </svg>
            </p>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-white/90 text-white">
              <Leaf className="h-5 w-5" />
            </span>
          </div>
        </m.div>
      </div>
    </section>
  );
}
