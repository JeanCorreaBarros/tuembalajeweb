/** Datos de contacto reales. Cámbialos aquí y se actualizan en toda la web. */
const PHONES = [
  { display: "+57 300 571 3284", tel: "+573005713284" },
  { display: "+57 301 768 8468", tel: "+573017688468" },
];
const EMAILS = ["comercial@tuembalaje.com", "gerencia@tuembalaje.com"];

export const SITE = {
  name: "Tu Embalaje",
  legalName: "Tu Embalaje SAS",
  // Datos para los documentos legales. Si están vacíos no se muestran: complétalos con los del RUT.
  nit: "",
  address: "", // dirección de la sede (ej. "Calle 00 # 00-00, Bogotá D.C.")
  legalUpdated: "13 de octubre de 2026", // fecha de la última actualización de privacidad y términos
  /** Dominio público (sin "/" final). Se puede cambiar con NEXT_PUBLIC_SITE_URL sin tocar código. */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://tuembalaje.com").replace(/\/$/, ""),
  description:
    "Diseñamos y fabricamos embalajes en madera a tu medida: cajas, estibas, pallets y huacales con madera reforestada certificada NIMF 15, aptos para exportación. Envíos a toda Colombia.",
  keywords: [
    "embalajes en madera",
    "cajas de madera",
    "estibas de madera",
    "pallets de madera",
    "huacales",
    "estibas NIMF 15",
    "embalaje para exportación",
    "embalajes a la medida",
    "Colombia",
  ],
  phones: PHONES,
  emails: EMAILS,
  instagram: { handle: "@tuembalaje.sas", url: "https://www.instagram.com/tuembalaje.sas" },

  // Principales (los usan el contacto y los botones de WhatsApp)
  email: EMAILS[0],
  phoneDisplay: PHONES[0].display,
  phoneTel: PHONES[0].tel,
  whatsapp: "573005713284", // solo números, con indicativo de país
  location: "Colombia",
  schedule: "Lunes a viernes, 7:30 a.m. – 5:30 p.m.",
};
