"use client";

import { motion } from "framer-motion";
import { BadgeCheck, Leaf, Recycle, ShieldCheck } from "lucide-react";
import { IMAGES } from "@/lib/images";
import Reveal from "../ui/Reveal";
import SmartImage from "../ui/SmartImage";

const badges = [
  { icon: BadgeCheck, label: "Madera certificada\ncon NIMF 15" },
  { icon: ShieldCheck, label: "Uso responsable\nde recursos" },
  { icon: Recycle, label: "Reutilización\nde materiales" },
];

export default function Commitment() {
  return (
    <section className="relative isolate overflow-hidden py-20">
      <div className="absolute inset-0 -z-20">
        <SmartImage src={IMAGES.commitmentBg} alt="Manos sosteniendo una planta joven" />
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-white/10 via-white/85 to-white/70" />

      <div className="mx-auto grid max-w-[1240px] items-center gap-8 px-5 lg:grid-cols-[1fr_1.1fr_0.9fr] lg:px-8">
        <div className="hidden lg:block" />
        <Reveal>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-forest">Nuestro compromiso</p>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight text-forest-dark">
            Cuidamos el planeta en cada embalaje
          </h2>
          <p className="mt-4 max-w-sm text-[12px] leading-relaxed text-ink/65">
            Utilizamos madera de origen responsable y procesos sostenibles que reducen el impacto ambiental, porque
            creemos en un futuro más verde.
          </p>
          <ul className="mt-6 flex flex-wrap gap-5">
            {badges.map(({ icon: Icon, label }, i) => (
              <motion.li
                key={label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.12 }}
                className="flex items-center gap-2.5"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest text-white">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="whitespace-pre-line text-[10px] font-medium leading-tight text-forest-dark">{label}</span>
              </motion.li>
            ))}
          </ul>
        </Reveal>

        <motion.div
          initial={{ opacity: 0, rotate: -14, scale: 0.85 }}
          whileInView={{ opacity: 1, rotate: -8, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative mx-auto w-full max-w-[320px] rounded-[40px_12px_40px_12px] bg-gradient-to-br from-brand-dark to-brand px-8 py-8 text-center shadow-xl"
        >
          <p className="font-script text-2xl leading-snug text-white">
            Pequeñas acciones también hacen grandes cambios
          </p>
          <Leaf className="mx-auto mt-3 h-6 w-6 text-white" strokeWidth={1.5} />
        </motion.div>
      </div>
    </section>
  );
}
