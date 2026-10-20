import type { Metadata, Viewport } from "next";
import { Caveat, Montserrat, Kaushan_Script } from "next/font/google";
import { Suspense } from "react";
import JsonLd from "@/components/seo/JsonLd";
import MotionProvider from "@/components/ui/MotionProvider";
import ScrollToTop from "@/components/ui/ScrollToTop";
import { SettingsProvider } from "@/components/cms/SettingsProvider";
import { getProducts } from "@/lib/cms/products";
import { getSeoGeneral } from "@/lib/cms/seo";
import { getSettings, type Settings } from "@/lib/cms/settings";
import type { Product } from "@/lib/products";
import { DEFAULT_SHARE_IMAGE } from "@/lib/seo";
import { SITE } from "@/lib/site";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

// Letra manuscrita solo decorativa: no se precarga para no competir con la foto y el título del hero.
const script = Kaushan_Script({
  variable: "--font-script",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
});

// Letra a mano (tipo marcador) de la frase "Pequeñas acciones…". Tampoco se precarga.
const hand = Caveat({
  variable: "--font-hand",
  subsets: ["latin"],
  weight: "700",
  display: "swap",
  preload: false,
});

const title = "Tu Embalaje | Embalajes en madera a tu medida";

/** Metadatos comunes. Palabras clave, final de marca, imagen y verificación de buscadores se editan en /admin/seo. */
export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoGeneral();
  const keywords = seo.keywords.split(",").map((k) => k.trim()).filter(Boolean);
  const images = [seo.shareImage ? { url: seo.shareImage, alt: title } : DEFAULT_SHARE_IMAGE];
  return {
    metadataBase: new URL(SITE.url),
    title: { default: title, template: seo.suffix.trim() ? `%s ${seo.suffix.trim()}` : "%s" },
    description: seo.homeDescription,
    keywords: keywords.length ? keywords : SITE.keywords,
    applicationName: SITE.name,
    authors: [{ name: SITE.legalName, url: SITE.url }],
    creator: SITE.legalName,
    publisher: SITE.legalName,
    category: "business",
    formatDetection: { telephone: false, email: false, address: false },
    // La URL canónica va en cada página (pageMetadata): aquí se heredaría a todas como "/".
    openGraph: { type: "website", locale: "es_CO", siteName: SITE.name, title, description: seo.homeDescription, images },
    twitter: { card: "summary_large_image", title, description: seo.homeDescription, images },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    },
    verification: {
      ...(seo.googleVerification.trim() ? { google: seo.googleVerification.trim() } : {}),
      ...(seo.bingVerification.trim() ? { other: { "msvalidate.01": seo.bingVerification.trim() } } : {}),
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#062a1c",
  colorScheme: "light",
};

/** Datos de la empresa para Google (panel de negocio, logo, contacto, catálogo), desde lo editable en /admin. */
function organization(settings: Settings, products: Product[], description: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "LocalBusiness"],
        "@id": `${SITE.url}/#empresa`,
        name: SITE.name,
        legalName: settings.legalName,
        url: SITE.url,
        logo: `${SITE.url}/logo/tu-embalaje-color.png`,
        image: `${SITE.url}/og`,
        description,
        email: settings.email,
        telephone: settings.phoneTel,
        address: { "@type": "PostalAddress", addressCountry: "CO", ...(settings.address ? { streetAddress: settings.address } : {}) },
        areaServed: { "@type": "Country", name: "Colombia" },
        contactPoint: settings.phones.map((p) => ({
          "@type": "ContactPoint",
          telephone: p.tel,
          contactType: "sales",
          areaServed: "CO",
          availableLanguage: "Spanish",
        })),
        sameAs: settings.instagram.url ? [settings.instagram.url] : [],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Embalajes en madera",
          itemListElement: products.map((p) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: p.title, description: p.short, url: `${SITE.url}/productos#${p.slug}` },
          })),
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE.url}/#sitio`,
        url: SITE.url,
        name: SITE.name,
        inLanguage: "es-CO",
        publisher: { "@id": `${SITE.url}/#empresa` },
      },
    ],
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [settings, products, seo] = await Promise.all([getSettings(), getProducts(), getSeoGeneral()]);
  return (
    <html lang="es-CO" className={`${montserrat.variable} ${script.variable} ${hand.variable} antialiased`}>
      <body className="min-h-screen overflow-x-hidden">
        <JsonLd data={organization(settings, products, seo.homeDescription)} />
        <Suspense fallback={null}>
          <ScrollToTop />
        </Suspense>
        <SettingsProvider value={settings}>
          <MotionProvider>{children}</MotionProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
