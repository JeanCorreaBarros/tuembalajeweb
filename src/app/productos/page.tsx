import type { Metadata } from "next";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/sections/Footer";
import Navbar from "@/components/sections/Navbar";
import ProductDetail from "@/components/sections/ProductDetail";
import ProductsHeader from "@/components/sections/ProductsHeader";
import { PRODUCTS } from "@/lib/products";

export const metadata: Metadata = {
  title: "Productos y servicios | Tu Embalaje",
  description:
    "Estibas de madera y plástico, embalajes especiales (estibas tipo V, reforzadas en lámina, huacales) y otros productos en madera.",
};

export default function ProductosPage() {
  return (
    <>
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
