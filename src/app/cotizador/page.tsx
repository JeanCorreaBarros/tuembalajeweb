import type { Metadata } from "next";
import Cotizador from "@/components/cotizador/Cotizador";
import { Highlight } from "@/components/cms/Text";
import Footer from "@/components/sections/Footer";
import Navbar from "@/components/sections/Navbar";
import PageHeader from "@/components/sections/PageHeader";
import JsonLd from "@/components/seo/JsonLd";
import Watermark from "@/components/ui/Watermark";
import { iconFor } from "@/lib/cms/icons";
import { getSettings } from "@/lib/cms/settings";
import { getPageContent } from "@/lib/cms/store";
import { cotizadorConfig } from "@/lib/cotizador";
import { breadcrumbs, pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getSettings();
  return pageMetadata({ title: seo.cotizadorTitle, description: seo.cotizadorDescription, path: "/cotizador" });
}

/** Cotizador: textos, medidas, precios y mensajes en /admin (Páginas · Cotizador). */
export default async function CotizadorPage() {
  const c = await getPageContent("cotizador");
  const h = c.encabezado;
  return (
    <>
      <JsonLd
        data={breadcrumbs([
          { name: "Inicio", path: "/" },
          { name: "Cotizador", path: "/cotizador" },
        ])}
      />
      <Navbar solid />
      <main>
        <PageHeader art="productos" eyebrow={h.eyebrow} title={<Highlight text={h.title} />} text={h.text} />

        <section className="relative isolate overflow-hidden bg-mist/60 py-10 sm:py-14">
          <Watermark
            tone="mist"
            items={[
              { symbol: "cycle", className: "-left-28 top-4 w-[300px] -rotate-6 md:-left-40 md:w-[520px]" },
              { symbol: "recycle", className: "-right-24 bottom-0 w-[260px] rotate-12 md:-right-36 md:w-[460px]" },
            ]}
          />
          <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
            <Cotizador config={cotizadorConfig(c)} />

            {h.perks.length > 0 && (
              <ul className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3">
                {h.perks.map(({ icon, label }, i) => {
                  const Icon = iconFor(icon);
                  return (
                    <li key={i} className="flex items-center gap-2 text-[13px] font-semibold text-forest-dark/80">
                      <Icon className="h-5 w-5 text-brand" aria-hidden /> {label}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
