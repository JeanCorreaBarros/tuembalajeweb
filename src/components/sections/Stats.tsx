"use client";

import { animate, motion, useInView } from "framer-motion";
import { Cloud, Layers, Trees, TreePine, Wind } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const stats = [
  { icon: TreePine, value: 287, decimals: 0, label: "Árboles no talados" },
  { icon: Cloud, value: 258, decimals: 0, label: "Toneladas de CO₂ retenidas" },
  { icon: Wind, value: 33.87, decimals: 2, label: "Toneladas de Oxígeno generadas" },
  { icon: Trees, value: 0.26, decimals: 2, label: "Hectáreas de bosque preservadas" },
  { icon: Layers, value: 287.05, decimals: 2, label: "m³ de madera no desechada" },
];

function Counter({ to, decimals }: { to: number; decimals: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, { duration: 2, ease: "easeOut", onUpdate: setVal });
    return () => controls.stop();
  }, [inView, to]);

  return <span ref={ref}>{val.toFixed(decimals)}</span>;
}

export default function Stats() {
  return (
    <section className="relative z-10 border-b border-black/5 bg-white shadow-sm">
      <div className="mx-auto grid max-w-[1240px] grid-cols-2 gap-y-8 px-5 py-8 sm:grid-cols-3 lg:grid-cols-5 lg:px-8">
        {stats.map(({ icon: Icon, value, decimals, label }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            className={`flex items-center gap-3 px-4 ${i > 0 ? "lg:border-l lg:border-black/10" : ""}`}
          >
            <Icon className="h-11 w-11 shrink-0 text-brand" strokeWidth={1.3} />
            <div>
              <p className="text-3xl font-extrabold leading-none text-forest">
                <Counter to={value} decimals={decimals} />
              </p>
              <p className="mt-1 text-[10px] leading-tight text-ink/60">{label}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
