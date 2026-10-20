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
  return seoMetadata("terminos");
}

/** Términos y condiciones: texto editable en /admin (Páginas · Términos y condiciones). */
export default async function TerminosPage() {
  const [{ documento: d }, settings] = await Promise.all([getPageContent("terminos"), getSettings()]);
  return (
    <>
      <JsonLd
        data={breadcrumbs([
          { name: "Inicio", path: "/" },
          { name: "Términos y condiciones", path: "/terminos-y-condiciones" },
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
          related={{ label: "Política de privacidad", href: "/politica-de-privacidad" }}
        />
      </main>
      <Footer />
    </>
  );
}
