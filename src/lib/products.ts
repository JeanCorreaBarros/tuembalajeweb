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
    slug: "estibas-madera",
    title: "Estibas de madera",
    short: "Madera reforestada, aptas para exportación.",
    image: "/images/producto-estibas-madera.jpg",
    bullets: [
      "Utilizamos madera REFORESTADA y de diferentes tipos según tu necesidad: Pino, Melina, Teca, Acacia.",
      "La madera cumple con la Norma Internacional de Medidas Fitosanitarias NIMF 15, por lo que son aptas para exportación internacional.",
    ],
    tags: ["Pino", "Melina", "Teca", "Acacia", "NIMF 15"],
  },
  {
    slug: "estibas-plastico",
    title: "Estibas de plástico",
    short: "Plástico reciclado: una alternativa más sostenible.",
    image: "/images/producto-estibas-plastico.jpg",
    bullets: [
      "Utilizamos plástico reciclado fundido para fabricar las estibas. Ideal si quieres transicionar a una alternativa de embalaje más sostenible.",
      "Opción perfecta para transporte de alimentos, ya que mantiene la inocuidad.",
    ],
    tags: ["Plástico reciclado", "Grado alimenticio"],
  },
  {
    slug: "embalajes-especiales",
    title: "Embalajes especiales",
    short: "Estibas tipo V, reforzadas en lámina y huacales.",
    image: "/images/producto-especiales.jpg",
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
    slug: "otros-madera",
    title: "Otros productos en madera",
    short: "Tablas, barrotes, listones y más.",
    image: "/images/producto-otros.jpg",
    intro: "Se puede evaluar la fabricación de cualquier otro producto en madera. Consulta con nosotros.",
    items: [
      { title: "Tablas", desc: "Medidas y espesores según tu requerimiento." },
      { title: "Barrotes", desc: "Piezas estructurales para armado y refuerzo." },
      { title: "Listones", desc: "Para refuerzos, divisiones y acabados." },
    ],
  },
];
