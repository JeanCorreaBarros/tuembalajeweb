import type { Metadata } from "next";
import LegalDoc from "@/components/legal/LegalDoc";
import Footer from "@/components/sections/Footer";
import Navbar from "@/components/sections/Navbar";
import JsonLd from "@/components/seo/JsonLd";
import { getSettings } from "@/lib/cms/settings";
import { getPageContent } from "@/lib/cms/store";
import { breadcrumbs } from "@/lib/seo";
import { seoMetadata } from "@/lib/cms/seo";

export function generateMetadata(): Promise<Metadata> {
  return seoMetadata("privacidad");
}

/** Política de privacidad: texto editable en /admin (Páginas · Política de privacidad). */
export default async function PoliticaPrivacidadPage() {
  const [{ documento: d }, settings] = await Promise.all([getPageContent("privacidad"), getSettings()]);
  return (
    <>
      <JsonLd
        data={breadcrumbs([
          { name: "Inicio", path: "/" },
          { name: "Política de privacidad", path: "/politica-de-privacidad" },
        ])}
      />
      <Navbar solid />
      <main>
        <LegalDoc
          kind="Documento legal"
          title={d.title}
          intro={d.intro}
          sections={d.sections}
          settings={settings}
          related={{ label: "Términos y condiciones", href: "/terminos-y-condiciones" }}
        />
      </main>
      <Footer />
    </>
  );
}
