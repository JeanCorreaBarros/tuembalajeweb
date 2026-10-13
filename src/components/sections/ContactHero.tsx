"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { IMAGES } from "@/lib/images";
import SmartImage from "../ui/SmartImage";

const checks = ["Asesoría gratuita", "Respuesta rápida", "Soluciones a tu medida"];

export default function ContactHero() {
  return (
    <section className="relative isolate overflow-hidden bg-forest-dark pb-14 pt-32 text-white lg:pb-16 lg:pt-36">
      <div className="absolute inset-0 -z-20">
        <SmartImage src={IMAGES.contactHero} alt="Asesora de Tu Embalaje con headset" priority className="object-right" />
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-forest-dark via-forest/90 to-forest/20 lg:via-forest/80" />

      <div className="mx-auto max-w-[1240px] px-5 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="inline-flex items-center gap-2"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-brand/70 bg-forest-dark/40 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]">
            <span className="h-2 w-2 rounded-full bg-lime" /> Contacto
          </span>
          <span className="h-px w-8 bg-brand" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7 }}
          className="mt-4 max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-[56px]"
        >
          Hablemos de tu <span className="text-lime">embalaje</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="mt-3 max-w-lg text-[15px] text-white/90"
        >
          Recibe asesoría personalizada y sin compromiso. Te respondemos rápido.
        </motion.p>

        <motion.ul
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.12, delayChildren: 0.4 } } }}
          className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2"
        >
          {checks.map((c) => (
            <motion.li
              key={c}
              variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
              className="flex items-center gap-2 text-[12px] font-semibold"
            >
              <CheckCircle2 className="h-5 w-5 fill-brand text-forest-dark" /> {c}
            </motion.li>
          ))}
        </motion.ul>
      </div>

      <motion.p
        initial={{ opacity: 0, rotate: -12 }}
        animate={{ opacity: 1, rotate: -8 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-8 right-6 hidden font-script text-2xl leading-tight text-white drop-shadow md:block lg:right-24"
      >
        Estamos <br /> para ayudarte
        <svg viewBox="0 0 120 12" className="mt-1 h-3 w-28 text-brand" fill="none">
          <motion.path
            d="M2 9C30 2 70 2 118 4"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 1.5, duration: 0.9 }}
          />
        </svg>
      </motion.p>
    </section>
  );
}
