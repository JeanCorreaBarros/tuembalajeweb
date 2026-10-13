import type { Metadata } from "next";
import About from "@/components/sections/About";
import Commitment from "@/components/sections/Commitment";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/sections/Footer";
import Industries from "@/components/sections/Industries";
import Navbar from "@/components/sections/Navbar";
import PageHeader from "@/components/sections/PageHeader";
import Process from "@/components/sections/Process";
import Stats from "@/components/sections/Stats";
import Testimonials from "@/components/sections/Testimonials";
import Values from "@/components/sections/Values";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbs, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Nosotros: fabricantes de embalajes en madera",
  description:
    "Conoce a Tu Embalaje: diseñamos y fabricamos embalajes en madera a la medida, con madera certificada NIMF 15, servicio personalizado y compromiso ambiental.",
  path: "/nosotros",
});

export default function NosotrosPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbs([
          { name: "Inicio", path: "/" },
          { name: "Nosotros", path: "/nosotros" },
        ])}
      />
      <Navbar solid />
      <main>
        <PageHeader
          eyebrow="Nosotros"
          title={
            <>
              Más que embalajes, <span className="text-lime">soluciones que protegen</span>
            </>
          }
          text="Combinamos experiencia, calidad y sostenibilidad para que tus productos lleguen seguros a su destino."
        />
        <About />
        <Values />
        <Stats />
        <Process />
        <Commitment />
        <Industries />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
