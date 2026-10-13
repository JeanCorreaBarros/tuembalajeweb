"use client";

import { m } from "framer-motion";
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
      <div className="grid grid-cols-1 items-center gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[minmax(0,1fr)_42%] lg:gap-8 lg:py-8 lg:pl-[5%] lg:pr-[3%]">
        <Reveal x={-40} y={0}>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-forest">Sectores que atendemos</p>
          <h2 className="mt-2 text-2xl font-extrabold text-forest-dark xl:text-[30px]">Tu aliado en múltiples industrias</h2>
          <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-ink/65">
            Trabajamos con empresas de diferentes sectores, ofreciendo soluciones personalizadas y adaptadas a cada
            necesidad.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Button href="/nosotros">Ver sectores</Button>
            <ul className="grid w-full grid-cols-3 gap-2.5 sm:flex sm:w-auto sm:flex-wrap">
              {sectors.map(({ icon: Icon, label }, i) => (
                <m.li
                  key={label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ y: -4, borderColor: "#1fb34a" }}
                  className="flex h-[84px] flex-col sm:w-[88px] items-center justify-center gap-2 rounded-xl border border-black/10 bg-white text-center shadow-sm"
                >
                  <Icon className="h-6 w-6 text-forest" strokeWidth={1.5} />
                  <span className="whitespace-pre-line text-[10px] font-medium leading-tight text-ink/75">{label}</span>
                </m.li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* Tres paneles: cajas (se desvanece hacia el blanco), montacargas y camión.
            Las fotos son panorámicas (3:1) dentro de paneles verticales: se piden en ~800px para que se vean nítidas. */}
        <Reveal x={40} y={0}>
          <div className="grid h-[180px] grid-cols-[1.4fr_1fr_1.4fr] gap-1 sm:h-[240px] md:h-[280px] lg:h-[240px]">
            <div className="relative overflow-hidden rounded-r-2xl [mask-image:linear-gradient(to_right,transparent_0%,black_38%)] [&_img]:object-[20%_50%]">
              <SmartImage src={IMAGES.sectorsBg} alt="Cajas de madera apiladas en bodega" sizes="400px" />
            </div>
            <div className="relative overflow-hidden rounded-2xl [&_img]:object-[51%_50%]">
              <SmartImage src={IMAGES.sectorsForklift} alt="Montacargas cargando una caja de madera" sizes="800px" />
            </div>
            <div className="relative overflow-hidden rounded-2xl [&_img]:object-[74%_50%]">
              <SmartImage src={IMAGES.sectorsTruck} alt="Camión listo para transportar embalajes" sizes="800px" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
