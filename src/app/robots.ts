import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

// Todo es rastreable. Las páginas de ingreso/registro/preguntar llevan "noindex" en sus metadatos
// (si se bloquearan aquí, Google no podría leer ese noindex).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
