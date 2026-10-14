"use client";

import { m } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Lines } from "@/components/cms/Text";
import { iconFor } from "@/lib/cms/icons";
import type { CmsValues } from "@/lib/cms/pages";
import Button from "../ui/Button";
import Reveal from "../ui/Reveal";
import SmartImage from "../ui/SmartImage";

/** Columnas de los pasos desde tablet, según cuántos haya (editables en /admin). */
const MD_COLS: Record<number, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
  5: "md:grid-cols-5",
  6: "md:grid-cols-3 lg:grid-cols-6",
};

export default function Process({ c }: { c: CmsValues<"inicio">["proceso"] }) {
  const steps = c.steps;
  return (
    <section id="proceso" className="relative isolate overflow-hidden bg-forest-dark py-14 text-white lg:py-12">
      {/* Fondo de hojas; un velo oscuro a la izquierda para leer el texto. */}
      <div className="absolute inset-0 -z-20">
        <SmartImage src={c.image} alt="" />
      </div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(4,27,18,0.7)_0%,rgba(4,27,18,0.35)_45%,rgba(4,27,18,0.25)_100%)]" />

      <div className="grid grid-cols-1 items-center gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(0,36%)_minmax(0,1fr)] lg:gap-[3%] lg:pl-[5%] lg:pr-[4%]">
        <Reveal x={-40} y={0}>
          <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em]">
            <span className="h-[3px] w-6 rounded bg-brand" /> {c.eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight lg:text-[26px] xl:text-[28px] 2xl:text-[34px]">
            <Lines text={c.title} brClassName="hidden sm:block" />
          </h2>
          <p className="mt-4 max-w-md text-[14px] leading-relaxed text-white/80">{c.text}</p>
          <Button href="/nosotros" variant="outline" className="mt-6">
            {c.button}
          </Button>
        </Reveal>

        <ol className={`grid grid-cols-2 gap-x-5 gap-y-8 md:gap-4 lg:gap-2 ${MD_COLS[steps.length] ?? "md:grid-cols-4"}`}>
          {steps.map(({ icon, title, desc }, i) => {
            const Icon = iconFor(icon);
            return (
              <Reveal key={i} delay={i * 0.15}>
                <li className="relative flex flex-col items-start">
                  <m.div
                    whileHover={{ scale: 1.08, rotate: 4 }}
                    className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-brand bg-forest-dark/60 shadow-[0_0_30px_#1fb34a40] sm:h-20 sm:w-20"
                  >
                    <Icon className="h-8 w-8" strokeWidth={1.4} />
                    <span className="absolute -bottom-1 -left-1 flex h-6 w-6 items-center justify-center rounded-full bg-brand text-[11px] font-bold ring-4 ring-forest-dark/60">
                      {i + 1}
                    </span>
                  </m.div>
                  {i < steps.length - 1 && <ArrowRight className="absolute right-2 top-8 hidden h-5 w-5 text-lime lg:block" />}
                  <h3 className="mt-4 text-[14px] font-bold leading-snug sm:mt-5 sm:text-[15px]">{title}</h3>
                  <p className="mt-1.5 max-w-[170px] text-[12px] leading-snug text-white/75">{desc}</p>
                </li>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
