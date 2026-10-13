"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { PRODUCTS } from "@/lib/products";
import Button from "../ui/Button";
import Reveal from "../ui/Reveal";
import SmartImage from "../ui/SmartImage";

export default function Products() {
  return (
    <section id="productos" className="bg-mist/70 py-16">
      <div className="mx-auto grid max-w-[1240px] gap-10 px-5 lg:grid-cols-[0.8fr_2.2fr] lg:px-8">
        <Reveal x={-40} y={0} className="self-center">
          <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-forest">
            <span className="h-[3px] w-6 rounded bg-brand" /> Nuestros productos y servicios
          </p>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight text-forest-dark">
            Soluciones en madera para cada necesidad
          </h2>
          <p className="mt-4 text-[12px] leading-relaxed text-ink/60">
            Fabricamos y diseñamos embalajes especializados según el tipo de producto, sector y destino. Desde estibas
            hasta soluciones industriales de gran formato.
          </p>
          <Button href="/productos" className="mt-6">
            Ver todos nuestros productos
          </Button>
        </Reveal>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {PRODUCTS.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.1}>
              <Link href="/productos" className="block h-full">
                <motion.article
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="group h-full overflow-hidden rounded-xl bg-white shadow-md"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-110">
                      <SmartImage src={p.image} alt={p.title} sizes="(min-width:1024px) 20vw, 50vw" />
                    </div>
                  </div>
                  <div className="relative p-4 pr-10">
                    <h3 className="text-[12px] font-bold text-forest-dark">{p.title}</h3>
                    <p className="mt-1 text-[10px] leading-snug text-ink/55">{p.short}</p>
                    <span className="absolute right-3 top-4 flex h-6 w-6 items-center justify-center rounded-full border border-brand text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </motion.article>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
