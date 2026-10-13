import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { sitemapQuestions } from "@/lib/forum";
import { PRODUCTS } from "@/lib/products";
import { SITE } from "@/lib/site";

/** Mapa del sitio para Google. Se genera en cada petición para incluir las preguntas nuevas del foro. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection();
  const now = new Date();
  const u = (path: string) => `${SITE.url}${path}`;

  return [
    { url: u("/"), lastModified: now, changeFrequency: "monthly", priority: 1 },
    {
      url: u("/productos"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
      images: PRODUCTS.map((p) => u(p.image)),
    },
    { url: u("/nosotros"), lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: u("/contacto"), lastModified: now, changeFrequency: "yearly", priority: 0.8 },
    { url: u("/foro"), lastModified: now, changeFrequency: "daily", priority: 0.6 },
    { url: u("/politica-de-privacidad"), changeFrequency: "yearly", priority: 0.2 },
    { url: u("/terminos-y-condiciones"), changeFrequency: "yearly", priority: 0.2 },
    ...sitemapQuestions().map((q) => ({
      url: u(`/foro/${q.id}`),
      lastModified: new Date(q.updated),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
  ];
}
