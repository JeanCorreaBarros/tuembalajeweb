import { WATERMARK_SYMBOLS, type WatermarkSymbol } from "./watermark-symbols";

export type WatermarkItem = {
  symbol: WatermarkSymbol;
  /** Posición, tamaño y giro con clases de Tailwind (ej. "-left-32 top-10 w-[460px] -rotate-6"). */
  className: string;
};

/**
 * Marca de agua con los símbolos del logo, como en la papelería de la empresa.
 * Va dentro de una sección `relative isolate overflow-hidden`: queda detrás de todo el contenido
 * de la sección (z-index negativo) y se recorta en los bordes.
 * Es decorativa: no recibe clics ni la leen los lectores de pantalla.
 */
export default function Watermark({ items, tone = "light" }: { items: WatermarkItem[]; tone?: "light" | "mist" }) {
  // Sobre blanco basta un verde muy tenue; sobre gris claro (mist) se sube un poco para que se note.
  const opacity = tone === "light" ? "opacity-[0.055]" : "opacity-[0.07]";
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {items.map(({ symbol, className }, i) => {
        const s = WATERMARK_SYMBOLS[symbol];
        return (
          <svg key={i} viewBox={s.viewBox} className={`absolute aspect-square text-forest ${opacity} ${className}`}>
            {s.paths.map((d, k) => (
              <path key={k} d={d} fill="currentColor" />
            ))}
          </svg>
        );
      })}
    </div>
  );
}
