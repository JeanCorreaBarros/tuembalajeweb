"use client";

import { m } from "framer-motion";
import { IMAGES } from "@/lib/images";
import Button from "../ui/Button";
import Logo from "../ui/Logo";
import Reveal from "../ui/Reveal";
import SmartImage from "../ui/SmartImage";

export default function CTA() {
  return (
    <section id="contacto" className="relative isolate overflow-hidden bg-forest-dark py-12 text-white">
      {/* Montañas y cajas detrás; un velo verde oscuro deja leer el texto. */}
      <div className="absolute inset-0 -z-20 [&_img]:object-[50%_55%]">
        <SmartImage src={IMAGES.ctaBg} alt="" />
      </div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(6,42,28,0.88)_0%,rgba(6,42,28,0.72)_45%,rgba(6,42,28,0.5)_100%)]" />

      <div className="flex flex-col items-start gap-6 px-5 sm:gap-8 sm:px-8 md:grid md:grid-cols-[auto_minmax(0,1fr)] md:items-center md:gap-x-8 lg:flex lg:flex-row lg:gap-[5%] lg:px-[6%]">
        <Reveal x={-30} y={0} className="hidden sm:block">
          <Logo size="lg" />
        </Reveal>
        <Reveal delay={0.1} className="flex-1">
          <h2 className="text-xl font-bold leading-snug sm:text-2xl lg:text-[22px]">
            ¿Listo para proteger tus productos
            <br className="hidden sm:block" />{" "}
            con la mejor solución en madera?
          </h2>
          <p className="mt-2 text-[12px] text-white/75">
            Contáctanos hoy y recibe asesoría personalizada sin compromiso.
          </p>
        </Reveal>
        <Reveal
          delay={0.2}
          x={30}
          y={0}
          className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap md:col-span-2 lg:col-span-1"
        >
          <m.div animate={{ scale: [1, 1.04, 1] }} transition={{ repeat: Infinity, duration: 2.4 }}>
            <Button whatsapp arrow={false} className="w-full justify-center sm:w-auto">
              Solicita tu asesoría GRATIS
            </Button>
          </m.div>
        </Reveal>
      </div>
    </section>
  );
}
