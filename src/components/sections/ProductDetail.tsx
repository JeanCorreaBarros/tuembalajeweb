"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import type { Product } from "@/lib/products";
import Button from "../ui/Button";
import Reveal from "../ui/Reveal";
import SmartImage from "../ui/SmartImage";

export default function ProductDetail({ product, index }: { product: Product; index: number }) {
  const flip = index % 2 === 1;
  return (
    <section
      id={product.slug}
      className={`scroll-mt-28 py-16 ${flip ? "bg-mist/70" : "bg-white"}`}
    >
      <div className="mx-auto grid max-w-[1240px] items-center gap-10 px-5 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <Reveal x={flip ? 40 : -40} y={0} className={flip ? "lg:order-2" : ""}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl"
          >
            <SmartImage src={product.image} alt={product.title} sizes="(min-width:1024px) 50vw, 100vw" />
            <span className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-brand text-sm font-extrabold text-white shadow-lg">
              {index + 1}
            </span>
          </motion.div>
        </Reveal>

        <Reveal x={flip ? -40 : 40} y={0}>
          <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-forest">
            <span className="h-[3px] w-6 rounded bg-brand" /> Producto {index + 1}
          </p>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight text-forest-dark lg:text-4xl">{product.title}</h2>

          {product.intro && <p className="mt-4 text-[14px] leading-relaxed text-ink/70">{product.intro}</p>}

          {product.bullets && (
            <ul className="mt-5 space-y-3">
              {product.bullets.map((b) => (
                <li key={b} className="flex gap-3 text-[14px] leading-relaxed text-ink/75">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                  {b}
                </li>
              ))}
            </ul>
          )}

          {product.items && (
            <ul className="mt-5 grid gap-3">
              {product.items.map((it) => (
                <motion.li
                  key={it.title}
                  whileHover={{ x: 6 }}
                  className="rounded-xl border border-black/5 bg-white p-4 shadow-sm"
                >
                  <h3 className="text-[14px] font-bold text-forest-dark">{it.title}</h3>
                  <p className="mt-1 text-[13px] leading-snug text-ink/65">{it.desc}</p>
                </motion.li>
              ))}
            </ul>
          )}

          {product.tags && (
            <ul className="mt-5 flex flex-wrap gap-2">
              {product.tags.map((t) => (
                <li key={t} className="rounded-full bg-forest/10 px-3 py-1 text-[11px] font-semibold text-forest">
                  {t}
                </li>
              ))}
            </ul>
          )}

          <Button href={`/contacto?producto=${product.slug}`} whatsapp className="mt-7">
            Cotiza {product.title.toLowerCase()}
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
