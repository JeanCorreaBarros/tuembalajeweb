"use client";

import { motion } from "framer-motion";
import { ArrowRight, MessageSquare, PackageCheck, PencilRuler, Wrench } from "lucide-react";
import Button from "../ui/Button";
import Reveal from "../ui/Reveal";

const steps = [
  { icon: MessageSquare, title: "Consulta y asesoría", desc: "Entendemos tus necesidades y requerimientos." },
  { icon: PencilRuler, title: "Diseño y planificación", desc: "Creamos la solución ideal para tu producto." },
  { icon: Wrench, title: "Fabricación", desc: "Usamos materiales de alta calidad y tecnología especializada." },
  { icon: PackageCheck, title: "Empaque y entrega", desc: "Tu embalaje listo, seguro y a tiempo." },
];

export default function Process() {
  return (
    <section id="proceso" className="relative overflow-hidden bg-gradient-to-br from-forest-dark via-forest to-forest-mid py-16 text-white">
      <div className="pointer-events-none absolute inset-0 opacity-20 [background:radial-gradient(circle_at_20%_20%,#3be05a33,transparent_40%),radial-gradient(circle_at_90%_80%,#1fb34a33,transparent_40%)]" />
      <div className="relative mx-auto grid max-w-[1240px] items-center gap-10 px-5 lg:grid-cols-[0.9fr_2fr] lg:px-8">
        <Reveal x={-40} y={0}>
          <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em]">
            <span className="h-[3px] w-6 rounded bg-brand" /> Nuestro proceso
          </p>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight">
            Del diseño a la entrega, sin complicaciones
          </h2>
          <p className="mt-4 max-w-xs text-[12px] leading-relaxed text-white/75">
            Te acompañamos en cada paso para que tu embalaje sea exactamente lo que necesitas, con la mejor calidad y en
            el menor tiempo posible.
          </p>
          <Button href="/nosotros" variant="outline" className="mt-6">
            Conoce nuestro proceso
          </Button>
        </Reveal>

        <ol className="grid grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-2">
          {steps.map(({ icon: Icon, title, desc }, i) => (
            <Reveal key={title} delay={i * 0.15}>
              <li className="relative flex flex-col items-start">
                <motion.div
                  whileHover={{ scale: 1.08, rotate: 4 }}
                  className="relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-brand bg-forest-dark/60 shadow-[0_0_30px_#1fb34a40]"
                >
                  <Icon className="h-8 w-8" strokeWidth={1.4} />
                  <span className="absolute -bottom-2 left-1/2 flex h-5 w-5 -translate-x-1/2 items-center justify-center rounded-full bg-brand text-[10px] font-bold">
                    {i + 1}
                  </span>
                </motion.div>
                {i < steps.length - 1 && (
                  <ArrowRight className="absolute right-0 top-7 hidden h-4 w-4 text-brand lg:block" />
                )}
                <h3 className="mt-5 text-[13px] font-bold">{title}</h3>
                <p className="mt-1.5 max-w-[150px] text-[10px] leading-snug text-white/65">{desc}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
