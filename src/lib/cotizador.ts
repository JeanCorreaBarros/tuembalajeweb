/**
 * Parámetros del cotizador de estibas. Cambia aquí medidas estándar, precios y textos:
 * la página /cotizador se actualiza sola.
 */

/** Medidas estándar (cm). Fuera de este rango la estiba requiere diseño especial. */
export const MEDIDAS = {
  largo: { min: 50, max: 150 },
  ancho: { min: 50, max: 150 },
} as const;

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

/** Rango de precio de referencia (COP) según ensamble y tipo de estiba. */
export const PRECIOS: Record<Ensamble, Record<TipoEstiba, { min: number; max: number }>> = {
  puntillas: {
    listones: { min: 28_000, max: 100_000 },
    tacos: { min: 34_000, max: 120_000 },
  },
  "puntillas-tornillos": {
    listones: { min: 70_000, max: 250_000 },
    tacos: { min: 28_000, max: 100_000 },
  },
};

export const MENSAJES = {
  dentro: {
    titulo: "Este rango es el punto de partida. Tu embalaje puede ser a la medida.",
    texto:
      "Déjanos tus datos y diseñamos gratis la solución que se ajuste a tu carga y en menos de 24 horas un asesor te contacta con una propuesta ajustada.",
  },
  fuera: {
    titulo: "Esto se sale de lo estándar, y es justo lo que mejor sabemos hacer.",
    texto:
      "Las estibas con estas medidas requieren un diseño especial. Déjanos tus datos y en menos de 24 horas un asesor te contacta para estudiar tu caso, sin compromiso.",
  },
  cta: "Recibir propuesta a medida",
} as const;

export const dentroDeRango = (largo: number, ancho: number) =>
  largo >= MEDIDAS.largo.min && largo <= MEDIDAS.largo.max && ancho >= MEDIDAS.ancho.min && ancho <= MEDIDAS.ancho.max;

export const formatoCOP = (n: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);
