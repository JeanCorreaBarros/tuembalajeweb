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
  noIndex = false,
}: {
  title?: string;
  /** Título completo, sin agregar "| Tu Embalaje" (lo usa el inicio). */
  absoluteTitle?: string;
  description: string;
  path: string;
  noIndex?: boolean;
}): Metadata {
  const full = absoluteTitle || (title ? `${title} | ${SITE.name}` : `${SITE.name} | Embalajes en madera a tu medida`);
  return {
    ...(absoluteTitle ? { title: { absolute: absoluteTitle } } : title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", locale: "es_CO", siteName: SITE.name, url: path, title: full, description },
    twitter: { card: "summary_large_image", title: full, description },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
  };
}

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
