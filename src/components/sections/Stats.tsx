"use client";

import { animate, m, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { iconFor } from "@/lib/cms/icons";
import type { CmsValues } from "@/lib/cms/pages";

function Counter({ to, decimals }: { to: number; decimals: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, { duration: 2, ease: "easeOut", onUpdate: setVal });
    return () => controls.stop();
  }, [inView, to]);

  return <span ref={ref}>{val.toFixed(Math.max(0, Math.min(4, decimals)))}</span>;
}

/** Columnas en escritorio según cuántas cifras haya (editables en /admin). */
const LG_COLS: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
  6: "lg:grid-cols-6",
};

export default function Stats({ c }: { c: CmsValues<"inicio">["cifras"] }) {
  const items = c.items;
  if (!items.length) return null;
  return (
    <section className="relative z-10 border-b border-black/5 bg-white shadow-sm">
      <div
        className={`mx-auto grid max-w-[1240px] grid-cols-2 gap-y-8 px-3 py-8 sm:grid-cols-3 sm:px-5 lg:px-8 ${LG_COLS[items.length] ?? "lg:grid-cols-5"}`}
      >
        {items.map(({ icon, value, decimals, label }, i) => {
          const Icon = iconFor(icon);
          // En celular son 2 columnas: si hay un número impar, la última cifra ocupa la fila completa.
          const lastOdd = i === items.length - 1 && items.length % 2 === 1;
          return (
            <m.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className={`flex items-center gap-3 px-2 sm:px-4 ${lastOdd ? "col-span-2 justify-center sm:col-span-1 sm:justify-start" : ""} ${
                i > 0 ? "lg:border-l lg:border-black/10" : ""
              }`}
            >
              <Icon className="h-9 w-9 shrink-0 text-brand sm:h-11 sm:w-11" strokeWidth={1.3} />
              <div className="min-w-0">
                <p className="text-2xl font-extrabold leading-none text-forest sm:text-3xl">
                  <Counter to={value} decimals={decimals} />
                </p>
                <p className="mt-1 text-[11px] leading-tight text-ink/60 sm:text-[10px]">{label}</p>
              </div>
            </m.div>
          );
        })}
      </div>
    </section>
  );
}
