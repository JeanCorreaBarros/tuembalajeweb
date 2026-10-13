import type { Metadata } from "next";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/sections/Footer";
import Navbar from "@/components/sections/Navbar";
import ProductDetail from "@/components/sections/ProductDetail";
import ProductsHeader from "@/components/sections/ProductsHeader";
import JsonLd from "@/components/seo/JsonLd";
import { PRODUCTS } from "@/lib/products";
import { breadcrumbs, pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Cajas de madera, estibas y pallets a la medida",
  description:
    "Cajas de madera, estibas, pallets, huacales y embalajes especiales a la medida. Madera reforestada con certificación NIMF 15, apta para exportación.",
  path: "/productos",
});

/** Catálogo para Google: cada producto como servicio ofrecido por la empresa. */
const catalog = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Productos y servicios de Tu Embalaje",
  itemListElement: PRODUCTS.map((p, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Service",
      name: p.title,
      description: p.intro ?? p.short,
      image: `${SITE.url}${p.image}`,
      url: `${SITE.url}/productos#${p.slug}`,
      serviceType: "Embalaje en madera",
      areaServed: "CO",
      provider: { "@id": `${SITE.url}/#empresa` },
    },
  })),
};

export default function ProductosPage() {
  return (
    <>
      <JsonLd data={catalog} />
      <JsonLd
        data={breadcrumbs([
          { name: "Inicio", path: "/" },
          { name: "Productos y servicios", path: "/productos" },
        ])}
      />
      <Navbar solid />
      <main>
        <ProductsHeader />
        {PRODUCTS.map((p, i) => (
          <ProductDetail key={p.slug} product={p} index={i} />
        ))}
        <CTA />
      </main>
      <Footer />
    </>
  );
}
