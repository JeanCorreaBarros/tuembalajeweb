/**
 * Cotizador de estibas: tipos de estiba y ensamble (fijos) y la configuración que llega del panel
 * (/admin · Páginas · Cotizador): medidas estándar, precios de referencia y mensajes.
 */

export const TIPOS_ESTIBA = [
  { slug: "listones", label: "Listones", desc: "Tablas paralelas sobre largueros" },
  { slug: "tacos", label: "Tacos", desc: "Tablas apoyadas sobre tacos de madera" },
] as const;

export const ENSAMBLES = [
  { slug: "puntillas", label: "Puntillas", desc: "Ensamble estándar" },
  { slug: "puntillas-tornillos", label: "Puntillas y tornillos", desc: "Mayor rigidez y resistencia" },
] as const;

export type TipoEstiba = (typeof TIPOS_ESTIBA)[number]["slug"];
export type Ensamble = (typeof ENSAMBLES)[number]["slug"];

type Rango = { min: number; max: number };

export type CotizadorConfig = {
  medidas: { largo: Rango; ancho: Rango };
  precios: Record<Ensamble, Record<TipoEstiba, Rango>>;
  mensajes: {
    dentro: { titulo: string; texto: string };
    fuera: { titulo: string; texto: string };
    cta: string;
  };
};

/** Arma la configuración a partir de lo guardado en el panel. */
export function cotizadorConfig(c: {
  medidas: { largoMin: number; largoMax: number; anchoMin: number; anchoMax: number };
  precios: Record<string, number>;
  mensajes: { dentroTitulo: string; dentroTexto: string; fueraTitulo: string; fueraTexto: string; cta: string };
}): CotizadorConfig {
  const p = c.precios;
  const r = (min: number, max: number): Rango => ({ min: Math.min(min, max), max: Math.max(min, max) });
  return {
    medidas: { largo: r(c.medidas.largoMin, c.medidas.largoMax), ancho: r(c.medidas.anchoMin, c.medidas.anchoMax) },
    precios: {
      puntillas: {
        listones: r(p.puntillasListonesMin, p.puntillasListonesMax),
        tacos: r(p.puntillasTacosMin, p.puntillasTacosMax),
      },
      "puntillas-tornillos": {
        listones: r(p.tornillosListonesMin, p.tornillosListonesMax),
        tacos: r(p.tornillosTacosMin, p.tornillosTacosMax),
      },
    },
    mensajes: {
      dentro: { titulo: c.mensajes.dentroTitulo, texto: c.mensajes.dentroTexto },
      fuera: { titulo: c.mensajes.fueraTitulo, texto: c.mensajes.fueraTexto },
      cta: c.mensajes.cta,
    },
  };
}

export const dentroDeRango = (m: CotizadorConfig["medidas"], largo: number, ancho: number) =>
  largo >= m.largo.min && largo <= m.largo.max && ancho >= m.ancho.min && ancho <= m.ancho.max;

export const formatoCOP = (n: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);
