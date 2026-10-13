import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

/** Datos para "Agregar a pantalla de inicio" en celulares y para el color de la barra del navegador. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE.name} — Embalajes en madera a tu medida`,
    short_name: SITE.name,
    description: SITE.description,
    lang: "es-CO",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#062a1c",
    icons: [
      { src: "/icon", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
