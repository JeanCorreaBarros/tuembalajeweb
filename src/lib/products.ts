export type Spec = { label: string; value: string };

/** Categorías del catálogo: filtros del buscador en /productos. */
export const PRODUCT_CATEGORIES = [
  { slug: "cajas", label: "Cajas" },
  { slug: "estibas", label: "Estibas" },
  { slug: "especiales", label: "Especiales" },
  { slug: "medida", label: "A la medida" },
] as const;
export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number]["slug"];

export type Product = {
  slug: string;
  title: string;
  short: string;
  image: string;
  category: ProductCategory;
  intro?: string;
  bullets?: string[];
  items?: { title: string; desc: string }[];
  tags?: string[];
  /** Ficha técnica que se muestra en /productos. */
  specs: Spec[];
  /** Destacados: se muestran en el inicio y en el pie de página (el resto solo en /productos). */
  featured?: boolean;
};

/* ---------- datos comunes de la ficha técnica ---------- */
const MADERA: Spec = { label: "Madera", value: "Reforestada: Pino, Melina, Teca o Acacia, según tu necesidad" };
const NIMF15: Spec = {
  label: "Tratamiento",
  value: "Térmico con certificación NIMF 15 (sello HT), apto para exportación",
};
const ENSAMBLE: Spec = { label: "Ensamble", value: "Puntillas, o puntillas y tornillos para mayor rigidez" };
const MEDIDAS_ESTIBA: Spec = {
  label: "Medidas",
  value: "Estándar de 50 a 150 cm de largo y ancho; otras medidas a la medida",
};
const CAPACIDAD: Spec = {
  label: "Capacidad de carga",
  value: "Según diseño, madera y uso; te la confirmamos en la cotización",
};

export const PRODUCTS: Product[] = [
  {
    slug: "cajas-madera",
    category: "cajas",
    title: "Cajas de madera",
    short: "Protección y resistencia para todo tipo de productos.",
    image: "/images/producto-cajas.jpg",
    featured: true,
    intro: "Cajas de madera resistentes para proteger tus productos durante el almacenamiento y el transporte.",
    bullets: [
      "Fabricadas con madera REFORESTADA según tu necesidad: Pino, Melina, Teca, Acacia.",
      "Madera que cumple la Norma Internacional de Medidas Fitosanitarias NIMF 15, apta para exportación.",
    ],
    tags: ["NIMF 15", "Exportación"],
    specs: [
      { label: "Tipo", value: "Caja cerrada de madera con base tipo estiba" },
      { label: "Medidas", value: "A la medida de tu producto" },
      MADERA,
      NIMF15,
      ENSAMBLE,
      { label: "Personalización", value: "Refuerzos internos, tapas desmontables y marcación del cliente" },
      { label: "Uso", value: "Almacenamiento, transporte nacional y exportación" },
      CAPACIDAD,
    ],
  },
  {
    slug: "estibas-pallets",
    category: "estibas",
    title: "Estibas y pallets",
    short: "Ideales para almacenamiento y transporte.",
    image: "/images/producto-estibas.jpg",
    featured: true,
    bullets: [
      "Utilizamos madera REFORESTADA y de diferentes tipos según tu necesidad: Pino, Melina, Teca, Acacia.",
      "La madera cumple con la Norma Internacional de Medidas Fitosanitarias NIMF 15, por lo que son aptas para exportación internacional.",
    ],
    tags: ["Pino", "Melina", "Teca", "Acacia", "NIMF 15"],
    specs: [
      { label: "Tipo", value: "De listones o de tacos" },
      MEDIDAS_ESTIBA,
      { label: "Entradas de montacargas", value: "2 o 4, según el modelo" },
      MADERA,
      NIMF15,
      ENSAMBLE,
      CAPACIDAD,
    ],
  },
  {
    slug: "embalajes-especiales",
    category: "especiales",
    title: "Embalajes especiales",
    short: "Para proyectos industriales, comerciales y de exportación.",
    image: "/images/producto-especiales-2.jpg",
    featured: true,
    intro: "Tenemos experiencia diseñando y fabricando embalajes no convencionales como:",
    items: [
      {
        title: "Estibas tipo V",
        desc: "Para transportar bobinas, motores o productos irregulares que requieren un buen aseguramiento durante el viaje.",
      },
      {
        title: "Estibas reforzadas en lámina",
        desc: "Para transportar láminas de acero y otros metales.",
      },
      {
        title: "Huacales",
        desc: "Para transportar maquinaria pesada que necesita una protección más robusta.",
      },
    ],
    specs: [
      { label: "Tipos", value: "Estibas tipo V, estibas reforzadas en lámina y huacales" },
      { label: "Medidas", value: "Diseñadas según la pieza, su peso y su centro de gravedad" },
      { label: "Refuerzos", value: "Lámina metálica, travesaños y tacos según la carga" },
      MADERA,
      NIMF15,
      ENSAMBLE,
      CAPACIDAD,
    ],
  },
  {
    slug: "diseno-a-la-medida",
    category: "medida",
    title: "Diseño a la medida",
    short: "Nos adaptamos a tus requerimientos.",
    image: "/images/producto-medida.jpg",
    featured: true,
    intro: "Se puede evaluar la fabricación de cualquier otro producto en madera. Consulta con nosotros.",
    items: [
      { title: "Tablas", desc: "Medidas y espesores según tu requerimiento." },
      { title: "Barrotes", desc: "Piezas estructurales para armado y refuerzo." },
      { title: "Listones", desc: "Para refuerzos, divisiones y acabados." },
    ],
    specs: [
      { label: "Piezas", value: "Tablas, barrotes, listones y piezas especiales" },
      { label: "Medidas y espesores", value: "Según tu requerimiento" },
      MADERA,
      { label: "Tratamiento", value: "NIMF 15 (sello HT) opcional para exportación" },
      { label: "Entrega", value: "Piezas sueltas o kits listos para armar" },
    ],
  },
  {
    slug: "estiba-largueros-2-entradas",
    category: "estibas",
    title: "Estiba de largueros 2 entradas",
    short: "La estiba clásica de bodega: firme, liviana y económica.",
    image: "/images/producto-estiba-largueros-v2.jpg",
    intro:
      "Tablas superiores clavadas sobre tres largueros macizos. El montacargas o el estibador entran por los dos extremos.",
    tags: ["2 entradas", "Listones", "Uso en bodega"],
    specs: [
      { label: "Tipo", value: "De listones sobre largueros" },
      { label: "Entradas de montacargas", value: "2 (por los extremos)" },
      { label: "Piso superior", value: "Abierto, con tablas separadas" },
      MEDIDAS_ESTIBA,
      MADERA,
      NIMF15,
      ENSAMBLE,
      { label: "Uso recomendado", value: "Almacenamiento en bodega y carga general" },
      CAPACIDAD,
    ],
  },
  {
    slug: "estiba-largueros-ranurados",
    category: "estibas",
    title: "Estiba de largueros ranurados 4 entradas",
    short: "Largueros con ranuras para entrar por los cuatro lados.",
    image: "/images/producto-estiba-ranurada-v2.jpg",
    intro:
      "Los largueros llevan ranuras que permiten levantar la estiba también por los costados, ideal cuando el espacio para maniobrar es reducido.",
    tags: ["4 entradas", "Listones", "Maniobra ágil"],
    specs: [
      { label: "Tipo", value: "De listones sobre largueros ranurados" },
      { label: "Entradas de montacargas", value: "4 (2 completas por los extremos + 2 por las ranuras)" },
      { label: "Piso superior", value: "Abierto, con tablas separadas" },
      MEDIDAS_ESTIBA,
      MADERA,
      NIMF15,
      ENSAMBLE,
      { label: "Uso recomendado", value: "Bodegas con pasillos estrechos, cargue y descargue frecuente" },
      CAPACIDAD,
    ],
  },
  {
    slug: "estiba-tacos-piso-cerrado",
    category: "estibas",
    title: "Estiba de tacos piso cerrado",
    short: "Superficie continua para cajas pequeñas, sacos y bultos.",
    image: "/images/producto-estiba-tacos-cerrada-v2.jpg",
    intro:
      "Tablas superiores juntas, sin espacios, sobre tacos de madera. La carga se apoya en toda la superficie y no se cuela entre las tablas.",
    tags: ["4 entradas", "Tacos", "Piso cerrado"],
    specs: [
      { label: "Tipo", value: "De tacos" },
      { label: "Entradas de montacargas", value: "4 (por todos los lados)" },
      { label: "Piso superior", value: "Cerrado, con tablas juntas" },
      { label: "Base inferior", value: "Con tablas de apoyo para mayor estabilidad" },
      MEDIDAS_ESTIBA,
      MADERA,
      NIMF15,
      ENSAMBLE,
      { label: "Uso recomendado", value: "Cajas pequeñas, sacos, bultos y productos sueltos" },
      CAPACIDAD,
    ],
  },
  {
    slug: "estiba-tacos-4-entradas",
    category: "estibas",
    title: "Estiba de tacos 4 entradas",
    short: "Acceso por los cuatro lados con montacargas o estibador.",
    image: "/images/producto-estiba-tacos-v2.jpg",
    intro:
      "Tablas superiores sobre tacos macizos que dejan libre el paso por los cuatro costados, para cargar y mover con facilidad.",
    tags: ["4 entradas", "Tacos", "Exportación"],
    specs: [
      { label: "Tipo", value: "De tacos" },
      { label: "Entradas de montacargas", value: "4 (por todos los lados)" },
      { label: "Piso superior", value: "Abierto, con tablas separadas" },
      MEDIDAS_ESTIBA,
      MADERA,
      NIMF15,
      ENSAMBLE,
      { label: "Uso recomendado", value: "Logística y exportación con manejo por cualquier costado" },
      CAPACIDAD,
    ],
  },
];

/** Productos destacados (inicio y pie de página). */
export const FEATURED_PRODUCTS = PRODUCTS.filter((p) => p.featured);
