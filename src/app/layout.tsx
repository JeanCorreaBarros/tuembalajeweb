import type { Metadata, Viewport } from "next";
import { Caveat, Montserrat, Kaushan_Script } from "next/font/google";
import { Suspense } from "react";
import JsonLd from "@/components/seo/JsonLd";
import MotionProvider from "@/components/ui/MotionProvider";
import ScrollToTop from "@/components/ui/ScrollToTop";
import { PRODUCTS } from "@/lib/products";
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

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: title, template: "%s | Tu Embalaje" },
  description: SITE.description,
  keywords: SITE.keywords,
  applicationName: SITE.name,
  authors: [{ name: SITE.legalName, url: SITE.url }],
  creator: SITE.legalName,
  publisher: SITE.legalName,
  category: "business",
  formatDetection: { telephone: false, email: false, address: false },
  // La URL canónica va en cada página (pageMetadata): aquí se heredaría a todas como "/".
  openGraph: { type: "website", locale: "es_CO", siteName: SITE.name, title, description: SITE.description },
  twitter: { card: "summary_large_image", title, description: SITE.description },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
};

export const viewport: Viewport = {
  themeColor: "#062a1c",
  colorScheme: "light",
};

/** Datos de la empresa para Google (panel de negocio, logo, contacto, catálogo). */
const organization = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "LocalBusiness"],
      "@id": `${SITE.url}/#empresa`,
      name: SITE.name,
      legalName: SITE.legalName,
      url: SITE.url,
      logo: `${SITE.url}/logo/tu-embalaje-color.png`,
      image: `${SITE.url}/opengraph-image`,
      description: SITE.description,
      email: SITE.email,
      telephone: SITE.phoneTel,
      address: { "@type": "PostalAddress", addressCountry: "CO" },
      areaServed: { "@type": "Country", name: "Colombia" },
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "07:30",
        closes: "17:30",
      },
      contactPoint: SITE.phones.map((p) => ({
        "@type": "ContactPoint",
        telephone: p.tel,
        contactType: "sales",
        areaServed: "CO",
        availableLanguage: "Spanish",
      })),
      sameAs: [SITE.instagram.url],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Embalajes en madera",
        itemListElement: PRODUCTS.map((p) => ({
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-CO" className={`${montserrat.variable} ${script.variable} ${hand.variable} antialiased`}>
      <body className="min-h-screen overflow-x-hidden">
        <JsonLd data={organization} />
        <Suspense fallback={null}>
          <ScrollToTop />
        </Suspense>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
