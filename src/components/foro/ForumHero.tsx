"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export default function ForumHero({ title, text, children }: { title: ReactNode; text?: string; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-forest-dark via-forest to-forest-mid py-12 text-white">
      <div className="pointer-events-none absolute inset-0 opacity-25 [background:radial-gradient(circle_at_15%_30%,#3be05a44,transparent_40%),radial-gradient(circle_at_90%_80%,#1fb34a44,transparent_40%)]" />
      <div className="relative mx-auto max-w-[1240px] px-5 lg:px-8">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl text-3xl font-extrabold leading-tight sm:text-4xl"
        >
          {title}
        </motion.h1>
        {text && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mt-3 max-w-xl text-[14px] leading-relaxed text-white/85"
          >
            {text}
          </motion.p>
        )}
        {children && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-6">
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
}
