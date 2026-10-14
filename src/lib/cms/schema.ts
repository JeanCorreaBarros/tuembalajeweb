/**
 * Tipos del esquema de contenido del panel. Cada página tiene secciones; cada sección declara
 * sus campos (para generar el formulario del panel) y sus valores por defecto (los textos
 * actuales de la web, que se usan mientras la sección no se haya editado).
 */

type Base = { key: string; label: string; help?: string };

export type ScalarField =
  | (Base & { type: "text"; max?: number })
  | (Base & { type: "textarea"; rows?: number; max?: number })
  | (Base & { type: "image" })
  | (Base & { type: "icon" })
  | (Base & { type: "number"; step?: number; min?: number })
  /** Texto con formato simple: párrafos, "- " para viñetas y **negrita**. */
  | (Base & { type: "richtext"; rows?: number });

export type ListField = Base & {
  type: "list";
  /** Nombre de cada elemento ("Paso", "Valor"…). */
  itemLabel: string;
  fields: ScalarField[];
  min?: number;
  max?: number;
};

export type Field = ScalarField | ListField;

export type SectionDef<D extends Record<string, unknown> = Record<string, unknown>> = {
  title: string;
  description?: string;
  fields: Field[];
  defaults: D;
};

export type PageDef<S extends Record<string, SectionDef> = Record<string, SectionDef>> = {
  title: string;
  /** Página pública que muestra este contenido (para el botón "Ver en el sitio"). */
  path?: string;
  description?: string;
  sections: S;
};

/** Ayudantes para declarar con tipos inferidos a partir de los valores por defecto. */
export const section = <D extends Record<string, unknown>>(def: SectionDef<D>) => def;
export const page = <S extends Record<string, SectionDef>>(def: PageDef<S>) => def;

/** Valores de una página: { seccion: { campo: valor } }. */
export type PageValues<P extends PageDef> = { [K in keyof P["sections"]]: P["sections"][K]["defaults"] };

/** Texto de ayuda común para títulos con palabras resaltadas. */
export const HIGHLIGHT_HELP = "Escribe *entre asteriscos* la parte que va resaltada en verde.";
