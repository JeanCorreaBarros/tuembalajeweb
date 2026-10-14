"use client";

import { m } from "framer-motion";
import { Eye, Target } from "lucide-react";
import { iconFor } from "@/lib/cms/icons";
import type { CmsValues } from "@/lib/cms/pages";
import Reveal from "../ui/Reveal";
import Watermark from "../ui/Watermark";

/** Misión, visión y valores (editables en /admin: Nosotros · Misión, visión y valores). */
export default function Values({ c }: { c: CmsValues<"nosotros">["valores"] }) {
  const mv = [
    { icon: Target, title: "Misión", text: c.mision },
    { icon: Eye, title: "Visión", text: c.vision },
  ].filter((x) => x.text.trim());

  return (
    <section className="relative isolate overflow-hidden bg-mist/70 py-12 sm:py-16">
      <Watermark
        tone="mist"
        items={[
          { symbol: "leaf", className: "-right-28 -top-10 w-[300px] rotate-12 md:-right-40 md:w-[500px]" },
          { symbol: "recycle", className: "-left-28 bottom-0 w-[280px] -rotate-12 md:-left-40 md:w-[460px]" },
        ]}
      />
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <div className="grid gap-5 md:grid-cols-2">
          {mv.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 0.12}>
              <m.div whileHover={{ y: -6 }} className="h-full rounded-2xl bg-white p-6 shadow-md sm:p-7">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-xl font-extrabold text-forest-dark">{title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-ink/70">{text}</p>
              </m.div>
            </Reveal>
          ))}
        </div>

        {c.values.length > 0 && (
          <>
            <Reveal className="mt-14">
              <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-forest">
                <span className="h-[3px] w-6 rounded bg-brand" /> {c.eyebrow}
              </p>
            </Reveal>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {c.values.map(({ icon, title, text }, i) => {
                const Icon = iconFor(icon);
                return (
                  <Reveal key={i} delay={i * 0.1}>
                    <m.div whileHover={{ y: -6 }} className="h-full rounded-2xl bg-forest p-4 text-white shadow-lg sm:p-6">
                      <Icon className="h-8 w-8 text-lime" strokeWidth={1.4} />
                      <h3 className="mt-4 text-[15px] font-bold">{title}</h3>
                      <p className="mt-1.5 text-[12px] leading-snug text-white/70">{text}</p>
                    </m.div>
                  </Reveal>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
