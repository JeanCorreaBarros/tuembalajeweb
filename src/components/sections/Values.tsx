"use client";

import { motion } from "framer-motion";
import { Eye, Handshake, Leaf, ShieldCheck, Target, Users } from "lucide-react";
import Reveal from "../ui/Reveal";

const mv = [
  {
    icon: Target,
    title: "Misión",
    text: "Diseñar y fabricar embalajes en madera y plástico reciclado a la medida, que protejan los productos de nuestros clientes con calidad, cumplimiento y responsabilidad ambiental.",
  },
  {
    icon: Eye,
    title: "Visión",
    text: "Ser el aliado de embalaje más confiable de la industria colombiana, reconocido por su calidad, su servicio personalizado y su compromiso con la sostenibilidad.",
  },
];

const values = [
  { icon: ShieldCheck, title: "Calidad", text: "Cada embalaje se fabrica para resistir el viaje." },
  { icon: Leaf, title: "Sostenibilidad", text: "Madera reforestada y plástico reciclado." },
  { icon: Handshake, title: "Confianza", text: "Cumplimos lo que prometemos, a tiempo." },
  { icon: Users, title: "Servicio", text: "Asesoría cercana y personalizada en cada proyecto." },
];

export default function Values() {
  return (
    <section className="bg-mist/70 py-16">
      <div className="mx-auto max-w-[1240px] px-5 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2">
          {mv.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 0.12}>
              <motion.div whileHover={{ y: -6 }} className="h-full rounded-2xl bg-white p-7 shadow-md">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-xl font-extrabold text-forest-dark">{title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-ink/70">{text}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14">
          <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-forest">
            <span className="h-[3px] w-6 rounded bg-brand" /> Nuestros valores
          </p>
        </Reveal>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {values.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -6 }}
                className="h-full rounded-2xl bg-forest p-6 text-white shadow-lg"
              >
                <Icon className="h-8 w-8 text-lime" strokeWidth={1.4} />
                <h3 className="mt-4 text-[15px] font-bold">{title}</h3>
                <p className="mt-1.5 text-[12px] leading-snug text-white/70">{text}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
