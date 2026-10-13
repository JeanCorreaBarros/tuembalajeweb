"use client";

import { motion } from "framer-motion";
import { IMAGES } from "@/lib/images";
import Button from "../ui/Button";
import Logo from "../ui/Logo";
import Reveal from "../ui/Reveal";
import SmartImage from "../ui/SmartImage";

export default function CTA() {
  return (
    <section id="contacto" className="relative isolate overflow-hidden bg-forest-dark py-12 text-white">
      <div className="absolute inset-0 -z-20 opacity-40">
        <SmartImage src={IMAGES.ctaBg} alt="" />
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-forest-dark via-forest-dark/85 to-forest-dark/60" />

      <div className="mx-auto flex max-w-[1240px] flex-col items-start gap-8 px-5 lg:flex-row lg:items-center lg:gap-14 lg:px-8">
        <Reveal x={-30} y={0}>
          <Logo size="lg" />
        </Reveal>
        <Reveal delay={0.1} className="flex-1">
          <h2 className="text-xl font-bold leading-snug lg:text-[22px]">
            ¿Listo para proteger tus productos
            <br />
            con la mejor solución en madera?
          </h2>
          <p className="mt-2 text-[12px] text-white/75">
            Contáctanos hoy y recibe asesoría personalizada sin compromiso.
          </p>
        </Reveal>
        <Reveal delay={0.2} x={30} y={0} className="flex flex-wrap gap-3">
          <motion.div animate={{ scale: [1, 1.04, 1] }} transition={{ repeat: Infinity, duration: 2.4 }}>
            <Button whatsapp arrow={false}>
              Solicita tu asesoría GRATIS
            </Button>
          </motion.div>
          <Button href="/contacto" variant="outline" arrow={false}>
            Contáctanos
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
