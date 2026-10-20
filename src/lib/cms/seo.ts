import "server-only";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { SEO_PAGES, type SeoPageId } from "./pages";
import { fullSeoTitle } from "./seo-score";
import { getPageContent } from "./store";

/** Metadatos (Google y redes) de una página pública, editables en /admin/seo. */
export async function seoMetadata(id: SeoPageId): Promise<Metadata> {
  const seo = await getPageContent("seo");
  const p = seo[id];
  return pageMetadata({
    absoluteTitle: fullSeoTitle(id === "inicio", p.title, seo.general.suffix),
    description: p.description,
    path: SEO_PAGES[id].path,
    image: p.image || seo.general.shareImage || undefined,
    noIndex: p.noindex,
  });
}

/** Ajustes globales de SEO (final de marca, palabras clave, verificación de buscadores…). */
export async function getSeoGeneral() {
  const seo = await getPageContent("seo");
  return { ...seo.general, homeDescription: seo.inicio.description };
}
