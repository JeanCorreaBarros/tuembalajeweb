"use client";

import { m } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Lines } from "@/components/cms/Text";
import type { CmsValues } from "@/lib/cms/pages";
import type { Product } from "@/lib/products";
import Button from "../ui/Button";
import Reveal from "../ui/Reveal";
import SmartImage from "../ui/SmartImage";

/** Productos destacados del inicio (textos en /admin: Inicio · Productos destacados; productos con «Destacado»). */
export default function Products({ c, products }: { c: CmsValues<"inicio">["productos"]; products: Product[] }) {
  return (
    <section id="productos" className="bg-[#f6f7f6] py-14 lg:py-10">
      <div className="grid grid-cols-1 items-center gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(0,30%)_minmax(0,1fr)] lg:gap-[3%] lg:pl-[5%] lg:pr-[3%]">
        <Reveal x={-40} y={0}>
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-forest">
            <span className="h-[3px] w-7 rounded bg-brand" /> {c.eyebrow}
          </p>
          <h2 className="mt-2 text-3xl font-extrabold leading-[1.15] text-forest-dark 2xl:text-[34px]">
            <Lines text={c.title} />
          </h2>
          <p className="mt-4 max-w-[520px] text-[14px] leading-relaxed text-ink/70">{c.text}</p>
          <Button href="/productos" className="mt-7 px-9 py-3.5 text-[13px]">
            {c.button}
          </Button>
        </Reveal>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          {products.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.1}>
              <Link href={`/productos#${p.slug}`} className="block h-full">
                <m.article
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_8px_24px_-12px_rgba(11,59,40,0.25)]"
                >
                  <div className="relative aspect-[4/3.2] overflow-hidden">
                    <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-110">
                      <SmartImage src={p.image} alt={p.title} sizes="(min-width:1280px) 16vw, (min-width:1024px) 33vw, (min-width:768px) 25vw, 50vw" />
                    </div>
                  </div>
                  <div className="relative flex-1 p-3 pr-11 sm:p-4 sm:pr-12">
                    <h3 className="text-[13px] font-bold leading-snug text-forest-dark 2xl:text-[14px]">{p.title}</h3>
                    <p className="mt-1.5 text-[12px] leading-snug text-ink/60">{p.short}</p>
                    <span className="absolute right-2.5 top-3 flex h-7 w-7 items-center justify-center rounded-full border-2 border-brand text-brand transition-colors group-hover:bg-brand group-hover:text-white sm:right-4 sm:top-4">
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </m.article>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
