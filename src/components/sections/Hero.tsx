"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Cog, Leaf, ShieldCheck, Truck } from "lucide-react";
import { useRef } from "react";
import { IMAGES } from "@/lib/images";
import Button from "../ui/Button";
import SmartImage from "../ui/SmartImage";

const features = [
  { icon: Leaf, label: "Materiales\nsostenibles" },
  { icon: ShieldCheck, label: "Alta\nresistencia" },
  { icon: Cog, label: "Diseño\npersonalizado" },
  { icon: Truck, label: "Transporte\ny exportación" },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } } };
const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section ref={ref} id="inicio" className="relative isolate min-h-[640px] overflow-hidden bg-forest-dark lg:h-[700px]">
      <motion.div style={{ y: bgY }} className="absolute inset-0 -z-20 scale-110">
        <SmartImage src={IMAGES.heroBg} alt="Caja de madera en un bosque" priority />
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-forest-dark/90 via-forest-dark/55 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-forest-dark/40 to-transparent" />

      <div className="mx-auto flex h-full max-w-[1240px] items-center px-5 pb-16 pt-32 lg:px-8">
        <motion.div variants={container} initial="hidden" animate="show" className="max-w-xl">
          <motion.p variants={item} className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.25em] text-white">
            <span className="h-[3px] w-8 rounded bg-brand" />
            Diseñamos y fabricamos
          </motion.p>
          <motion.h1 variants={item} className="mt-5 text-5xl font-extrabold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-[68px]">
            Tu Embalaje
            <span className="block bg-gradient-to-r from-brand to-lime bg-clip-text text-transparent">a tu medida</span>
          </motion.h1>
          <motion.p variants={item} className="mt-5 max-w-md text-[15px] leading-relaxed text-white/90">
            Soluciones sostenibles y de alta resistencia en madera, para que tus productos lleguen seguros a su destino.
          </motion.p>

          <motion.ul variants={item} className="mt-7 flex flex-wrap gap-x-7 gap-y-4">
            {features.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2.5 text-[10px] font-medium leading-tight text-white">
                <Icon className="h-7 w-7 text-brand" strokeWidth={1.5} />
                <span className="whitespace-pre-line">{label}</span>
              </li>
            ))}
          </motion.ul>

          <motion.div variants={item} className="mt-8 flex flex-wrap gap-3">
            <Button whatsapp>Solicita tu asesoría GRATIS</Button>
            <Button href="/productos" variant="outline">
              Conoce nuestros productos
            </Button>
          </motion.div>
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0, rotate: -12, x: 40 }}
        animate={{ opacity: 1, rotate: -10, x: 0 }}
        transition={{ delay: 1, duration: 0.9 }}
        className="absolute bottom-24 right-6 hidden max-w-[260px] font-script text-4xl leading-tight text-white drop-shadow-lg md:block lg:right-16 lg:text-5xl"
      >
        Protegemos lo que te importa
        <svg viewBox="0 0 220 24" className="mt-1 h-5 w-52 text-brand" fill="none">
          <motion.path
            d="M4 18C60 4 130 2 216 10"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 1.6, duration: 1 }}
          />
        </svg>
      </motion.p>
    </section>
  );
}
