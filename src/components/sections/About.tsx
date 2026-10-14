"use client";

import { m } from "framer-motion";
import { Cog, Leaf, Truck } from "lucide-react";
import { IMAGES } from "@/lib/images";
import Button from "../ui/Button";
import Reveal from "../ui/Reveal";
import SmartImage from "../ui/SmartImage";
import Watermark from "../ui/Watermark";

const points = [
  { icon: Cog, title: "Compromiso\ncon la calidad" },
  { icon: Leaf, title: "Madera certificada\ncon NIMF 15" },
  { icon: Cog, title: "Atención personalizada\nen cada proyecto" },
  { icon: Truck, title: "Entregas a nivel nacional\ne internacional" },
];

/** `watermark`: muestra los símbolos del logo de fondo (se usa en /nosotros, no en el inicio). */
export default function About({ watermark = false }: { watermark?: boolean }) {
  return (
    <section id="nosotros" className="relative isolate overflow-hidden bg-[#f7f8f7] py-14 lg:py-12">
      {watermark && (
        <Watermark
          tone="mist"
          items={[{ symbol: "cycle", className: "-left-28 -bottom-16 w-[300px] -rotate-6 md:-left-40 md:w-[500px]" }]}
        />
      )}
      {/* Celular: una columna. Tablet: texto arriba y foto + puntos lado a lado. Escritorio: tres columnas. */}
      <div className="grid grid-cols-1 items-center gap-10 px-5 sm:px-8 md:grid-cols-2 md:gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,31%)_minmax(250px,20%)] lg:gap-[2.5%] lg:pl-[6%] lg:pr-[5%]">
        <Reveal x={-40} y={0} className="md:col-span-2 lg:col-span-1">
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-forest">
            <span className="h-[3px] w-7 rounded bg-brand" /> Sobre nosotros
          </p>
          <h2 className="mt-2 text-3xl font-extrabold leading-[1.15] text-forest-dark lg:text-[28px] xl:text-[32px] 2xl:text-[36px]">
            Más que embalajes,
            <br />
            <span className="lg:whitespace-nowrap">soluciones que protegen</span>
          </h2>
          <p className="mt-4 max-w-[540px] text-[14px] leading-relaxed text-ink/70">
            En Tu Embalaje combinamos experiencia, calidad y sostenibilidad para ofrecerte embalajes en madera
            diseñados a la medida de tus necesidades. Trabajamos con empresas de todos los sectores para garantizar que
            sus productos lleguen en perfectas condiciones, de forma segura y responsable con el medio ambiente.
          </p>
          <Button href="/nosotros" className="mt-7 px-9 py-3.5 text-[13px]">
            Conoce nuestra historia
          </Button>
        </Reveal>

        <Reveal delay={0.15}>
          {/* Paralelogramo con esquinas redondeadas: se inclina el marco y se endereza la foto. */}
          {/* La inclinación va en style (no en una clase) para que Framer Motion la combine con la escala del hover. */}
          <m.div
            style={{ skewX: -10 }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            // Al inclinarse, las esquinas se salen unos px: en pantallas angostas se deja margen a los lados.
            className="relative mx-auto aspect-[1.36/1] w-[88%] max-w-[560px] overflow-hidden lg:w-full rounded-[22px] shadow-2xl shadow-forest/20"
          >
            <div className="absolute -inset-x-[12%] inset-y-0 skew-x-[10deg] [&_img]:object-[50%_30%]">
              <SmartImage
                src={IMAGES.aboutWorker}
                alt="Operario de Tu Embalaje trabajando con estibas de madera"
                sizes="(min-width:1024px) 640px, (min-width:768px) 50vw, 100vw"
              />
            </div>
          </m.div>
        </Reveal>

        <div className="flex flex-col gap-3">
          {points.map(({ icon: Icon, title }, i) => (
            <Reveal key={title} delay={0.2 + i * 0.1} x={40} y={0}>
              <m.div
                whileHover={{ x: 6 }}
                className="flex items-center gap-4 rounded-xl bg-brand/[0.07] px-4 py-4 xl:px-5"
              >
                <Icon className="h-7 w-7 shrink-0 text-brand-dark" strokeWidth={1.5} />
                <p className="whitespace-pre text-[12px] font-semibold leading-snug text-forest-dark">{title}</p>
              </m.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
