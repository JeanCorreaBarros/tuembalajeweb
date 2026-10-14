"use client";

import { m } from "framer-motion";
import { ArrowUpRight, Calculator, CheckCircle2, ClipboardList } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/products";
import Button from "../ui/Button";
import Reveal from "../ui/Reveal";
import SmartImage from "../ui/SmartImage";
import Watermark, { type WatermarkItem } from "../ui/Watermark";
import ProductSpecsModal from "./ProductSpecsModal";

/** Marca de agua por producto: va del lado del texto y alterna los símbolos del logo. */
const SYMBOLS = ["recycle", "cycle", "leaf"] as const;

/**
 * `index`: número del producto en el catálogo (se muestra como "Producto N").
 * `position`: lugar en la lista visible tras buscar/filtrar; define la alternancia izquierda/derecha.
 */
export default function ProductDetail({
  product,
  index,
  position = index,
}: {
  product: Product;
  index: number;
  position?: number;
}) {
  const flip = position % 2 === 1;
  const [specsOpen, setSpecsOpen] = useState(false);
  const watermark: WatermarkItem = {
    symbol: SYMBOLS[position % SYMBOLS.length],
    className: flip
      ? "-left-28 top-1/2 w-[300px] -translate-y-1/2 -rotate-12 md:-left-40 md:w-[520px]"
      : "-right-28 top-1/2 w-[300px] -translate-y-1/2 rotate-12 md:-right-40 md:w-[520px]",
  };
  return (
    <section
      id={product.slug}
      // Al saltar a la sección: menú fijo (85px) + barra de búsqueda fija desde tablet (~66px).
      className={`relative isolate scroll-mt-[100px] md:scroll-mt-[160px] overflow-hidden py-12 sm:py-16 ${flip ? "bg-mist/70" : "bg-white"}`}
    >
      <Watermark items={[watermark]} tone={flip ? "mist" : "light"} />
      <div className="relative mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-8 px-5 sm:gap-10 sm:px-8 md:grid-cols-2 lg:gap-16 lg:px-8">
        <Reveal x={flip ? 40 : -40} y={0} className={flip ? "md:order-2" : ""}>
          <m.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl"
          >
            <SmartImage src={product.image} alt={product.title} sizes="(min-width:1240px) 600px, (min-width:768px) 50vw, 100vw" />
            <span className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-brand text-sm font-extrabold text-white shadow-lg">
              {index + 1}
            </span>
          </m.div>
        </Reveal>

        <Reveal x={flip ? -40 : 40} y={0}>
          <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-forest">
            <span className="h-[3px] w-6 rounded bg-brand" /> Producto {index + 1}
          </p>
          <h2 className="mt-3 text-[26px] font-extrabold leading-tight text-forest-dark sm:text-3xl lg:text-4xl">{product.title}</h2>

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
                <m.li
                  key={it.title}
                  whileHover={{ x: 6 }}
                  className="rounded-xl border border-black/5 bg-white p-4 shadow-sm"
                >
                  <h3 className="text-[14px] font-bold text-forest-dark">{it.title}</h3>
                  <p className="mt-1 text-[13px] leading-snug text-ink/65">{it.desc}</p>
                </m.li>
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

          {/* Ficha técnica: abre un modal con todos los datos. */}
          <button
            type="button"
            onClick={() => setSpecsOpen(true)}
            aria-haspopup="dialog"
            className="group mt-6 flex w-full items-center gap-3.5 rounded-2xl border border-black/10 bg-white p-3.5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-forest text-white shadow-md shadow-forest/20">
              <ClipboardList className="h-5 w-5" aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[14px] font-bold text-forest-dark">Ficha técnica</span>
              <span className="block text-[12px] text-ink/55">{product.specs.length} especificaciones · madera, medidas, ensamble…</span>
            </span>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand transition group-hover:bg-brand group-hover:text-white">
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </span>
          </button>
          <ProductSpecsModal product={product} number={index + 1} open={specsOpen} onClose={() => setSpecsOpen(false)} />

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Button href={`/contacto?producto=${product.slug}`} whatsapp className="w-full justify-center sm:w-auto">
              Cotiza {product.title.toLowerCase()}
            </Button>
            {/* Las estibas tienen rango de precio en el cotizador. */}
            {product.slug.startsWith("estiba") && (
              <Link
                href="/cotizador"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-forest/20 px-5 py-3 text-xs font-semibold text-forest-dark transition hover:border-brand hover:text-brand-dark"
              >
                <Calculator className="h-4 w-4" aria-hidden /> Calcular en el cotizador
              </Link>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
