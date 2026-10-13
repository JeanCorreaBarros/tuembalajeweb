"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Props = { eyebrow: string; title: ReactNode; text: string };

export default function PageHeader({ eyebrow, title, text }: Props) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-forest-dark via-forest to-forest-mid pb-16 pt-36 text-white">
      <div className="pointer-events-none absolute inset-0 opacity-25 [background:radial-gradient(circle_at_15%_30%,#3be05a44,transparent_40%),radial-gradient(circle_at_90%_80%,#1fb34a44,transparent_40%)]" />
      <div className="relative mx-auto max-w-[1240px] px-5 lg:px-8">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.25em]"
        >
          <span className="h-[3px] w-8 rounded bg-brand" /> {eyebrow}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7 }}
          className="mt-5 max-w-2xl text-4xl font-extrabold leading-tight sm:text-5xl"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/85"
        >
          {text}
        </motion.p>
      </div>
    </section>
  );
}
