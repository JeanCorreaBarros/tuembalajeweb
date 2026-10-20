/**
 * Datos fijos del sitio. Los datos de contacto (WhatsApp, teléfonos, correos, horario…), la
 * empresa se editan en /admin → Ajustes generales; el SEO, en /admin → SEO.
 */
export const SITE = {
  name: "Tu Embalaje",
  legalName: "Tu Embalaje SAS",
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
};

/** Mensaje inicial de los botones "Solicita tu asesoría GRATIS". */
export const WHATSAPP_ASESORIA = "Hola, quiero solicitar una asesoría gratis para mis embalajes en madera.";
