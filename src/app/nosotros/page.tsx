import type { Metadata } from "next";
import { Highlight } from "@/components/cms/Text";
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
import { getSettings } from "@/lib/cms/settings";
import { getPageContent } from "@/lib/cms/store";
import { breadcrumbs, pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getSettings();
  return pageMetadata({ title: seo.nosotrosTitle, description: seo.nosotrosDescription, path: "/nosotros" });
}

/** Nosotros: encabezado y valores en /admin (Páginas · Nosotros); el resto se comparte con Inicio. */
export default async function NosotrosPage() {
  const [c, home] = await Promise.all([getPageContent("nosotros"), getPageContent("inicio")]);
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
        <PageHeader eyebrow={c.encabezado.eyebrow} title={<Highlight text={c.encabezado.title} />} text={c.encabezado.text} />
        <About c={home.nosotros} watermark />
        <Values c={c.valores} />
        <Stats c={home.cifras} />
        <Process c={home.proceso} />
        <Commitment c={home.compromiso} />
        <Industries c={home.sectores} />
        <Testimonials c={home.testimonios} />
        <CTA c={home.cta} />
      </main>
      <Footer />
    </>
  );
}
