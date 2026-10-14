import type { Metadata } from "next";
import LegalDoc from "@/components/legal/LegalDoc";
import Footer from "@/components/sections/Footer";
import Navbar from "@/components/sections/Navbar";
import JsonLd from "@/components/seo/JsonLd";
import { getSettings } from "@/lib/cms/settings";
import { getPageContent } from "@/lib/cms/store";
import { breadcrumbs, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Política de privacidad y tratamiento de datos",
  description:
    "Cómo Tu Embalaje recolecta, usa y protege tus datos personales según la Ley 1581 de 2012, y cómo ejercer tus derechos de habeas data.",
  path: "/politica-de-privacidad",
});

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
