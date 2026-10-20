import type { Metadata } from "next";
import About from "@/components/sections/About";
import Commitment from "@/components/sections/Commitment";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/sections/Footer";
import Hero from "@/components/sections/Hero";
import Industries from "@/components/sections/Industries";
import Navbar from "@/components/sections/Navbar";
import Process from "@/components/sections/Process";
import Products from "@/components/sections/Products";
import Stats from "@/components/sections/Stats";
import Testimonials from "@/components/sections/Testimonials";
import { getProducts } from "@/lib/cms/products";
import { seoMetadata } from "@/lib/cms/seo";
import { getPageContent } from "@/lib/cms/store";

export function generateMetadata(): Promise<Metadata> {
  return seoMetadata("inicio");
}

/** Inicio: todo el contenido se edita en /admin (Páginas · Inicio). */
export default async function Home() {
  const [c, products] = await Promise.all([getPageContent("inicio"), getProducts()]);
  return (
    <>
      <Navbar />
      <main>
        <Hero c={c.hero} />
        <Stats c={c.cifras} />
        <About c={c.nosotros} />
        <Products c={c.productos} products={products.filter((p) => p.featured)} />
        <Process c={c.proceso} />
        <Commitment c={c.compromiso} />
        <Industries c={c.sectores} />
        <Testimonials c={c.testimonios} />
        <CTA c={c.cta} />
      </main>
      <Footer />
    </>
  );
}
