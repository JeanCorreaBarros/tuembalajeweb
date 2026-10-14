"use client";

import {
  Boxes,
  Calculator,
  ClipboardList,
  Forklift,
  Hammer,
  Layers,
  type LucideIcon,
  Paintbrush,
  Puzzle,
  Rows3,
  Ruler,
  Shapes,
  ShieldCheck,
  ShieldPlus,
  Target,
  TreePine,
  Truck,
  Weight,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { PRODUCT_CATEGORIES, type Product } from "@/lib/products";
import { whatsappLink } from "@/lib/site";
import { WhatsAppIcon } from "../ui/icons";
import SmartImage from "../ui/SmartImage";

/** Ícono de cada dato de la ficha según su nombre. */
const SPEC_ICONS: Record<string, LucideIcon> = {
  Tipo: Boxes,
  Tipos: Shapes,
  Medidas: Ruler,
  "Medidas y espesores": Ruler,
  "Entradas de montacargas": Forklift,
  "Piso superior": Rows3,
  "Base inferior": Layers,
  Madera: TreePine,
  Tratamiento: ShieldCheck,
  Ensamble: Hammer,
  Refuerzos: ShieldPlus,
  Piezas: Puzzle,
  Personalización: Paintbrush,
  Uso: Target,
  "Uso recomendado": Target,
  Entrega: Truck,
  "Capacidad de carga": Weight,
};

/**
 * Ficha técnica en un modal (<dialog> nativo: atrapa el foco, se cierra con Esc).
 * En celular sube desde abajo como una hoja; en escritorio es una ventana centrada a dos columnas.
 */
export default function ProductSpecsModal({
  product,
  number,
  open,
  onClose,
}: {
  product: Product;
  number: number;
  open: boolean;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      document.documentElement.style.overflow = "hidden"; // evita que la página se desplace detrás
    } else if (!open && d.open) d.close();
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const category = PRODUCT_CATEGORIES.find((c) => c.slug === product.category)?.label;
  const isEstiba = product.slug.startsWith("estiba");

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      // Clic en el fondo oscuro (fuera de la tarjeta) cierra el modal.
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-labelledby={`ficha-${product.slug}`}
      className="m-0 mt-auto max-h-[92dvh] w-full max-w-none overflow-hidden rounded-t-[28px] bg-white p-0 text-ink shadow-2xl backdrop:bg-forest-dark/70 backdrop:backdrop-blur-sm open:flex open:flex-col sm:m-auto sm:max-h-[88vh] sm:w-[calc(100%-3rem)] sm:max-w-[960px] sm:rounded-[28px]"
    >
      <div className="flex min-h-0 w-full flex-1 animate-fade-up flex-col overflow-hidden [animation-duration:0.35s] md:flex-row">
        {/* ---------- Foto y resumen ---------- */}
        <div className="relative isolate h-48 shrink-0 overflow-hidden bg-forest-dark text-white sm:h-56 md:h-auto md:w-[38%]">
          <div className="absolute inset-0 -z-20">
            <SmartImage src={product.image} alt={product.title} sizes="(min-width:768px) 360px, 100vw" />
          </div>
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-dark via-forest-dark/70 to-forest-dark/10" />

          <div className="flex h-full flex-col justify-end p-5 sm:p-7">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-[12px] font-extrabold">
                {number}
              </span>
              {category && (
                <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-semibold backdrop-blur">
                  {category}
                </span>
              )}
            </div>
            <p className="mt-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-lime">
              <ClipboardList className="h-3.5 w-3.5" aria-hidden /> Ficha técnica
            </p>
            <h2 id={`ficha-${product.slug}`} className="mt-1 text-[22px] font-extrabold leading-tight sm:text-[26px]">
              {product.title}
            </h2>
            <p className="mt-1.5 hidden text-[13px] leading-snug text-white/80 md:block">{product.short}</p>
            {product.tags && (
              <ul className="mt-4 hidden flex-wrap gap-1.5 md:flex">
                {product.tags.map((t) => (
                  <li key={t} className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold">
                    {t}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* ---------- Datos técnicos ---------- */}
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-7">
            {/* 2 columnas cuando hay ancho (celular girado y escritorio); 1 en tablet, donde la foto ocupa media ventana. */}
            <dl className="grid gap-2.5 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
              {product.specs.map((sp) => {
                const Icon = SPEC_ICONS[sp.label] ?? ClipboardList;
                return (
                  <div
                    key={sp.label}
                    className="flex gap-3 rounded-2xl border border-black/5 bg-mist/70 p-3.5 transition hover:border-brand/30 hover:bg-brand/[0.05]"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-brand shadow-sm">
                      <Icon className="h-[18px] w-[18px]" aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <dt className="text-[11px] font-bold uppercase tracking-wider text-forest-dark/70">{sp.label}</dt>
                      <dd className="mt-0.5 text-[13px] font-medium leading-snug text-ink/85">{sp.value}</dd>
                    </div>
                  </div>
                );
              })}
            </dl>
            <p className="mt-4 text-[11px] leading-relaxed text-ink/45">
              Datos de referencia. Cada embalaje se fabrica según tu carga: confirmamos medidas, madera y capacidad en la
              cotización.
            </p>
          </div>

          {/* Acciones (fijas abajo) */}
          <div className="flex shrink-0 items-center gap-2.5 border-t border-black/5 bg-white p-3 sm:p-4 sm:px-7">
            <a
              href={whatsappLink(`Hola, quiero cotizar: ${product.title}.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-brand px-4 py-3 text-[13px] font-bold text-white shadow-lg shadow-brand/30 transition hover:bg-brand-dark sm:flex-none sm:px-6"
            >
              <WhatsAppIcon className="h-4 w-4" /> <span className="sm:hidden">Cotizar</span>
              <span className="hidden sm:inline">Cotizar por WhatsApp</span>
            </a>
            {isEstiba && (
              <Link
                href="/cotizador"
                onClick={onClose}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-forest/20 px-4 py-3 text-[13px] font-semibold text-forest-dark transition hover:border-brand hover:text-brand-dark sm:flex-none sm:px-5"
              >
                <Calculator className="h-4 w-4" aria-hidden /> <span className="sm:hidden">Cotizador</span>
                <span className="hidden sm:inline">Calcular en el cotizador</span>
              </Link>
            )}
            <button
              type="button"
              onClick={onClose}
              className="hidden text-[13px] font-semibold text-ink/50 transition hover:text-forest sm:ml-auto sm:block"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar ficha técnica"
        className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur transition hover:bg-black/55"
      >
        <X className="h-5 w-5" />
      </button>
    </dialog>
  );
}
