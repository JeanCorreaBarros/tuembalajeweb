import type { Metadata } from "next";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/sections/Footer";
import Navbar from "@/components/sections/Navbar";
import ProductCatalog from "@/components/sections/ProductCatalog";
import ProductsHeader from "@/components/sections/ProductsHeader";
import JsonLd from "@/components/seo/JsonLd";
import { getProducts } from "@/lib/cms/products";
import { getPageContent } from "@/lib/cms/store";
import type { Product } from "@/lib/products";
import { breadcrumbs } from "@/lib/seo";
import { seoMetadata } from "@/lib/cms/seo";
import { SITE } from "@/lib/site";

export function generateMetadata(): Promise<Metadata> {
  return seoMetadata("productos");
}

/** Catálogo para Google: cada producto como servicio ofrecido por la empresa. */
function catalog(products: Product[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Productos y servicios de Tu Embalaje",
    itemListElement: products.map((p, i) => ({
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
}

/** Productos: encabezado en /admin (Páginas · Productos) y catálogo en /admin (Productos). */
export default async function ProductosPage() {
  const [c, home, products] = await Promise.all([getPageContent("productos"), getPageContent("inicio"), getProducts()]);
  return (
    <>
      <JsonLd data={catalog(products)} />
      <JsonLd
        data={breadcrumbs([
          { name: "Inicio", path: "/" },
          { name: "Productos y servicios", path: "/productos" },
        ])}
      />
      <Navbar solid />
      <main>
        <ProductsHeader c={c.encabezado} />
        <ProductCatalog products={products} />
        <CTA c={home.cta} />
      </main>
      <Footer />
    </>
  );
}
