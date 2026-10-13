"use client";

import { motion } from "framer-motion";
import { PRODUCTS } from "@/lib/products";

export default function ProductsHeader() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-forest-dark via-forest to-forest-mid pb-16 pt-36 text-white">
        <div className="pointer-events-none absolute inset-0 opacity-25 [background:radial-gradient(circle_at_15%_30%,#3be05a44,transparent_40%),radial-gradient(circle_at_90%_80%,#1fb34a44,transparent_40%)]" />
        <div className="relative mx-auto max-w-[1240px] px-5 lg:px-8">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.25em]"
          >
            <span className="h-[3px] w-8 rounded bg-brand" /> Productos y servicios
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="mt-5 max-w-2xl text-4xl font-extrabold leading-tight sm:text-5xl"
          >
            Embalajes para cada <span className="text-lime">necesidad</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/85"
          >
            Estibas de madera y plástico, embalajes especiales y piezas en madera a la medida de tu operación.
          </motion.p>
        </div>
      </section>

      <nav
        aria-label="Categorías de productos"
        className="sticky top-[60px] z-40 border-b border-black/5 bg-white/95 backdrop-blur"
      >
        <ul className="mx-auto flex max-w-[1240px] gap-2 overflow-x-auto px-5 py-3 lg:px-8">
          {PRODUCTS.map((p, i) => (
            <li key={p.slug} className="shrink-0">
              <a
                href={`#${p.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-[12px] font-semibold text-forest-dark transition hover:border-brand hover:bg-brand hover:text-white"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-forest text-[10px] text-white">
                  {i + 1}
                </span>
                {p.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
