"use client";

import { motion } from "framer-motion";
import { Factory, Globe, Pill, Sprout, Store, Wine } from "lucide-react";
import { IMAGES } from "@/lib/images";
import Button from "../ui/Button";
import Reveal from "../ui/Reveal";
import SmartImage from "../ui/SmartImage";

const sectors = [
  { icon: Factory, label: "Industria" },
  { icon: Store, label: "Comercio" },
  { icon: Sprout, label: "Agroindustria" },
  { icon: Wine, label: "Alimentos\ny bebidas" },
  { icon: Pill, label: "Farmacéutico" },
  { icon: Globe, label: "Exportación" },
];

export default function Industries() {
  return (
    <section id="sectores" className="overflow-hidden bg-white">
      <div className="mx-auto grid max-w-[1240px] items-center gap-6 px-5 py-10 lg:grid-cols-[1.1fr_1fr] lg:px-8">
        <Reveal x={-40} y={0}>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-forest">Sectores que atendemos</p>
          <h2 className="mt-2 text-2xl font-extrabold text-forest-dark">Tu aliado en múltiples industrias</h2>
          <p className="mt-2 max-w-sm text-[11px] leading-relaxed text-ink/60">
            Trabajamos con empresas de diferentes sectores, ofreciendo soluciones personalizadas y adaptadas a cada
            necesidad.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button href="/nosotros" size="sm">
              Ver sectores
            </Button>
            <ul className="flex flex-wrap gap-2">
              {sectors.map(({ icon: Icon, label }, i) => (
                <motion.li
                  key={label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ y: -4, borderColor: "#1fb34a" }}
                  className="flex h-[68px] w-[62px] flex-col items-center justify-center gap-1.5 rounded-lg border border-black/10 bg-white text-center shadow-sm"
                >
                  <Icon className="h-5 w-5 text-forest" strokeWidth={1.4} />
                  <span className="whitespace-pre-line text-[8px] font-medium leading-tight text-ink/70">{label}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal x={40} y={0}>
          <div className="grid h-[200px] grid-cols-2 gap-2 sm:h-[220px]">
            <div className="relative overflow-hidden rounded-2xl">
              <SmartImage src={IMAGES.sectorsBg} alt="Cajas de madera apiladas" sizes="25vw" />
            </div>
            <div className="relative overflow-hidden rounded-2xl">
              <SmartImage src={IMAGES.sectorsTruck} alt="Camión y montacargas cargando embalajes" sizes="25vw" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
