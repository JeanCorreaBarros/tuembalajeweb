export type Product = {
  slug: string;
  title: string;
  short: string;
  image: string;
  intro?: string;
  bullets?: string[];
  items?: { title: string; desc: string }[];
  tags?: string[];
};

export const PRODUCTS: Product[] = [
  {
    slug: "cajas-madera",
    title: "Cajas de madera",
    short: "Protección y resistencia para todo tipo de productos.",
    image: "/images/producto-cajas.jpg",
    intro: "Cajas de madera resistentes para proteger tus productos durante el almacenamiento y el transporte.",
    bullets: [
      "Fabricadas con madera REFORESTADA según tu necesidad: Pino, Melina, Teca, Acacia.",
      "Madera que cumple la Norma Internacional de Medidas Fitosanitarias NIMF 15, apta para exportación.",
    ],
    tags: ["NIMF 15", "Exportación"],
  },
  {
    slug: "estibas-pallets",
    title: "Estibas y pallets",
    short: "Ideales para almacenamiento y transporte.",
    image: "/images/producto-estibas.jpg",
    bullets: [
      "Utilizamos madera REFORESTADA y de diferentes tipos según tu necesidad: Pino, Melina, Teca, Acacia.",
      "La madera cumple con la Norma Internacional de Medidas Fitosanitarias NIMF 15, por lo que son aptas para exportación internacional.",
    ],
    tags: ["Pino", "Melina", "Teca", "Acacia", "NIMF 15"],
  },
  {
    slug: "embalajes-especiales",
    title: "Embalajes especiales",
    short: "Para proyectos industriales, comerciales y de exportación.",
    image: "/images/producto-especiales-2.jpg",
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
  },
  {
    slug: "diseno-a-la-medida",
    title: "Diseño a la medida",
    short: "Nos adaptamos a tus requerimientos.",
    image: "/images/producto-medida.jpg",
    intro: "Se puede evaluar la fabricación de cualquier otro producto en madera. Consulta con nosotros.",
    items: [
      { title: "Tablas", desc: "Medidas y espesores según tu requerimiento." },
      { title: "Barrotes", desc: "Piezas estructurales para armado y refuerzo." },
      { title: "Listones", desc: "Para refuerzos, divisiones y acabados." },
    ],
  },
];
