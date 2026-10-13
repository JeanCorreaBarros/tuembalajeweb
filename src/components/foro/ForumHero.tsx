"use client";

import { motion } from "framer-motion";
import { MessagesSquare } from "lucide-react";
import type { ReactNode } from "react";

/**
 * Cabecera del foro. `bar` es la fila superior (ruta + sesión del usuario);
 * `children` va debajo del título (buscador, estadísticas, etc.).
 */
export default function ForumHero({
  title,
  text,
  bar,
  children,
  eyebrow = "Comunidad Tu Embalaje",
}: {
  title: ReactNode;
  text?: string;
  bar?: ReactNode;
  children?: ReactNode;
  eyebrow?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-forest-dark text-white">
      {/* Fondo: brillos verdes + patrón de puntos + ícono grande decorativo */}
      <div className="pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(60%_80%_at_85%_10%,#1fb34a40,transparent_60%),radial-gradient(50%_60%_at_0%_100%,#3be05a26,transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07] [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:22px_22px]" />
      <MessagesSquare
        aria-hidden
        className="pointer-events-none absolute -right-10 top-6 -z-10 hidden h-80 w-80 text-white/[0.04] lg:block"
        strokeWidth={1}
      />

      {bar && <div className="border-b border-white/10">{bar}</div>}

      <div className="mx-auto max-w-[1240px] px-5 pb-12 pt-10 lg:px-8 lg:pb-14">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-lime"
        >
          <span className="h-[3px] w-7 rounded bg-brand" /> {eyebrow}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.6 }}
          className="mt-3 max-w-3xl text-3xl font-extrabold leading-tight sm:text-[42px]"
        >
          {title}
        </motion.h1>
        {text && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.6 }}
            className="mt-3 max-w-2xl text-[15px] leading-relaxed text-white/75"
          >
            {text}
          </motion.p>
        )}
        {children && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-7"
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
}
