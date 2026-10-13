"use client";

import { motion } from "framer-motion";
import { Cog, Headset, Leaf, Truck } from "lucide-react";
import { IMAGES } from "@/lib/images";
import Button from "../ui/Button";
import Reveal from "../ui/Reveal";
import SmartImage from "../ui/SmartImage";

const points = [
  { icon: Cog, title: "Compromiso\ncon la calidad" },
  { icon: Leaf, title: "Madera certificada\ncon NIMF 15" },
  { icon: Headset, title: "Atención personalizada\nen cada proyecto" },
  { icon: Truck, title: "Entregas a nivel nacional\ne internacional" },
];

export default function About() {
  return (
    <section id="nosotros" className="bg-white py-20">
      <div className="mx-auto grid max-w-[1240px] items-center gap-10 px-5 lg:grid-cols-[1fr_1fr_0.7fr] lg:px-8">
        <Reveal x={-40} y={0}>
          <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-forest">
            <span className="h-[3px] w-6 rounded bg-brand" /> Sobre nosotros
          </p>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight text-forest-dark lg:text-[34px]">
            Más que embalajes,
            <br />
            soluciones que protegen
          </h2>
          <p className="mt-5 max-w-md text-[13px] leading-relaxed text-ink/70">
            En Tu Embalaje combinamos experiencia, calidad y sostenibilidad para ofrecerte embalajes en madera diseñados
            a la medida. Trabajamos con empresas de todos los sectores para garantizar que sus productos lleguen en
            perfectas condiciones, de forma segura y responsable con el medio ambiente.
          </p>
          <Button href="/nosotros" className="mt-7">
            Conoce nuestra historia
          </Button>
        </Reveal>

        <Reveal delay={0.15}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="relative mx-auto aspect-[4/4.2] w-full max-w-[420px] overflow-hidden rounded-3xl shadow-2xl [clip-path:polygon(8%_0,100%_0,92%_100%,0_100%)]"
          >
            <SmartImage src={IMAGES.aboutWorker} alt="Operario de Tu Embalaje trabajando con madera" sizes="420px" />
          </motion.div>
        </Reveal>

        <div className="flex flex-col gap-3">
          {points.map(({ icon: Icon, title }, i) => (
            <Reveal key={title} delay={0.2 + i * 0.1} x={40} y={0}>
              <motion.div
                whileHover={{ x: 6 }}
                className="flex items-center gap-4 rounded-xl bg-mist px-4 py-3.5"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white text-brand shadow-sm">
                  <Icon className="h-6 w-6" strokeWidth={1.5} />
                </span>
                <p className="whitespace-pre-line text-[11px] font-semibold leading-snug text-forest-dark">{title}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
