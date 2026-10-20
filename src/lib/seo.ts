import type { Metadata } from "next";
import { SITE } from "./site";

/**
 * Metadatos de una página: título, descripción, URL canónica y vista previa para redes
 * (Open Graph / X). `title` sin marca: la plantilla del layout añade "| Tu Embalaje".
 */
export function pageMetadata({
  title,
  absoluteTitle,
  description,
  path,
  image,
  noIndex = false,
}: {
  title?: string;
  /** Título completo, sin agregar "| Tu Embalaje" (lo usa el inicio). */
  absoluteTitle?: string;
  description: string;
  path: string;
  /** Imagen al compartir. Por defecto, la imagen de marca generada en /og. */
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const full = absoluteTitle || (title ? `${title} | ${SITE.name}` : `${SITE.name} | Embalajes en madera a tu medida`);
  const images = [image ? { url: image, alt: full } : { ...DEFAULT_SHARE_IMAGE }];
  return {
    ...(absoluteTitle ? { title: { absolute: absoluteTitle } } : title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", locale: "es_CO", siteName: SITE.name, url: path, title: full, description, images },
    twitter: { card: "summary_large_image", title: full, description, images },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
  };
}

/** Imagen de marca para compartir (src/app/og/route.tsx). */
export const DEFAULT_SHARE_IMAGE = {
  url: "/og",
  width: 1200,
  height: 630,
  alt: "Tu Embalaje — Embalajes en madera a tu medida",
};

/** Migas de pan (BreadcrumbList) para que Google muestre la ruta en los resultados. */
export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE.url}${it.path}`,
    })),
  };
}
