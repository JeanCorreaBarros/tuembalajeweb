"use client";

import { m } from "framer-motion";
import { Leaf } from "lucide-react";
import { Lines } from "@/components/cms/Text";
import { iconFor } from "@/lib/cms/icons";
import type { CmsValues } from "@/lib/cms/pages";
import Reveal from "../ui/Reveal";
import SmartImage from "../ui/SmartImage";

/*
 * Pincelada verde: varias pasadas horizontales de distinto largo (así los extremos quedan
 * deshilachados) + vetas de cerdas, y un filtro que vuelve ásperos los bordes como pintura real.
 * Verde claro a la izquierda y más oscuro a la derecha.
 */
const BANDS: [y: number, x0: number, x1: number, width: number][] = [
  [44, 46, 366, 16],
  [60, 24, 390, 22],
  [80, 12, 404, 24],
  [102, 20, 398, 26],
  [124, 6, 410, 26],
  [146, 14, 402, 26],
  [168, 8, 396, 24],
  [188, 24, 386, 22],
  [205, 48, 358, 16],
];
const band = ([y, x0, x1]: (typeof BANDS)[number]) => {
  const d = x1 - x0;
  return `M${x0} ${y + 3} C${x0 + d * 0.3} ${y - 5} ${x0 + d * 0.65} ${y + 5} ${x1} ${y - 3}`;
};
// Vetas: [y, inicio, fin, clara (true) u oscura]
const STREAKS: [number, number, number, boolean][] = [
  [52, 60, 330, true],
  [70, 30, 250, false],
  [90, 110, 392, true],
  [113, 22, 300, false],
  [133, 70, 400, true],
  [156, 18, 260, true],
  [160, 220, 390, false],
  [178, 40, 350, false],
  [196, 70, 330, true],
];

function BrushStroke() {
  return (
    <svg viewBox="0 0 420 240" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
      <defs>
        <linearGradient id="brushFill" x1="0" y1="40" x2="420" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#4cc962" />
          <stop offset="0.35" stopColor="#25ad4b" />
          <stop offset="0.75" stopColor="#168c38" />
          <stop offset="1" stopColor="#0d6a2a" />
        </linearGradient>
        <filter id="brushRough" x="-8%" y="-15%" width="116%" height="130%">
          {/* Ruido alargado en horizontal: deforma los bordes como cerdas de pincel. */}
          <feTurbulence type="fractalNoise" baseFrequency="0.018 0.32" numOctaves="3" seed="7" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="16" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>

      <g filter="url(#brushRough)" strokeLinecap="round" fill="none">
        {BANDS.map((b, i) => (
          <path key={i} d={band(b)} stroke="url(#brushFill)" strokeWidth={b[3]} strokeOpacity={i % 3 === 1 ? 0.92 : 1} />
        ))}
        {STREAKS.map(([y, x0, x1, light], i) => (
          <path
            key={`s${i}`}
            d={`M${x0} ${y + 2} C${x0 + (x1 - x0) * 0.35} ${y - 3} ${x0 + (x1 - x0) * 0.7} ${y + 3} ${x1} ${y - 2}`}
            stroke={light ? "#ffffff" : "#0b3b28"}
            strokeOpacity={light ? 0.16 : 0.2}
            strokeWidth={light ? 1.6 : 1.3}
          />
        ))}
      </g>
    </svg>
  );
}

/** «Nuestro compromiso» (editable en /admin: Inicio · Nuestro compromiso). */
export default function Commitment({ c }: { c: CmsValues<"inicio">["compromiso"] }) {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-20 [&_img]:object-[50%_32%]">
        <SmartImage src={c.image} alt="Manos sosteniendo una planta joven frente a un bosque" />
      </div>
      {/* Aclara solo la franja central para leer el texto; la planta y el bosque quedan nítidos. */}
      <div className="absolute inset-0 -z-10 bg-white/70 lg:bg-transparent lg:bg-[linear-gradient(to_right,transparent_0%,transparent_22%,rgba(255,255,255,0.62)_34%,rgba(255,255,255,0.62)_58%,transparent_74%)]" />

      <div className="grid grid-cols-1 items-center gap-8 px-5 py-12 sm:px-8 md:grid-cols-[minmax(0,1fr)_minmax(0,42%)] lg:min-h-[clamp(340px,21vw,420px)] lg:grid-cols-[33%_minmax(0,1fr)_29%] lg:gap-6 lg:px-[3%] lg:py-8">
        <div className="hidden lg:block" />

        <Reveal>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-dark">{c.eyebrow}</p>
          <h2 className="mt-2 text-3xl font-extrabold leading-[1.15] text-forest-dark xl:text-[34px]">
            <Lines text={c.title} />
          </h2>
          <p className="mt-3 max-w-[440px] text-[14px] leading-relaxed text-ink/75">
            {c.text}
          </p>
          <ul className="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 min-[400px]:grid-cols-2 lg:flex lg:flex-wrap">
            {c.badges.map(({ icon, label }, i) => {
              const Icon = iconFor(icon);
              return (
              <m.li
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.12 }}
                className="flex items-center gap-3"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-forest text-white shadow-md shadow-forest/30">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="whitespace-pre-line text-[12px] font-semibold leading-tight text-forest-dark">{label}</span>
              </m.li>
              );
            })}
          </ul>
        </Reveal>

        <m.div
          initial={{ opacity: 0, rotate: -10, scale: 0.85 }}
          whileInView={{ opacity: 1, rotate: -6, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative mx-auto aspect-[420/240] w-full max-w-[420px] drop-shadow-[0_12px_18px_rgba(6,42,28,0.28)]"
        >
          <BrushStroke />
          <div className="relative flex h-full items-center justify-center gap-[3%] px-[11%] pb-1">
            <p className="font-[family-name:var(--font-hand)] text-[clamp(25px,7.6vw,32px)] font-bold leading-[1.02] text-white [text-shadow:0_1px_2px_rgba(6,42,28,0.25)] md:text-[27px] lg:text-[29px] xl:text-[33px]">
              <Lines text={c.brush} />
              {/* Subrayado de pincel, más grueso al centro. */}
              <svg viewBox="0 0 220 18" className="-mt-0.5 h-[0.5em] w-[88%] text-lime" fill="none" aria-hidden>
                <m.path
                  d="M6 13C64 5 138 3 214 7"
                  stroke="currentColor"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8, duration: 0.9 }}
                />
              </svg>
            </p>
            <Leaf aria-hidden className="h-[24%] w-auto shrink-0 translate-y-[20%] text-white" strokeWidth={1.6} />
          </div>
        </m.div>
      </div>
    </section>
  );
}
