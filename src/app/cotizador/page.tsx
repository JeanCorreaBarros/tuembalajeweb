import type { Metadata } from "next";
import { Clock, PencilRuler, ShieldCheck } from "lucide-react";
import Cotizador from "@/components/cotizador/Cotizador";
import Footer from "@/components/sections/Footer";
import Navbar from "@/components/sections/Navbar";
import PageHeader from "@/components/sections/PageHeader";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbs, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Cotizador de estibas de madera",
  description:
    "Cotiza tu estiba de madera en línea: ingresa medidas, tipo (listones o tacos) y ensamble, y recibe gratis una propuesta a medida en menos de 24 horas.",
  path: "/cotizador",
});

const perks = [
  { icon: PencilRuler, label: "Diseño a medida gratis" },
  { icon: Clock, label: "Respuesta en menos de 24 h" },
  { icon: ShieldCheck, label: "Madera certificada NIMF 15" },
];

export default function CotizadorPage() {
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
        <PageHeader
          art="productos"
          eyebrow="Cotizador de estibas"
          title={
            <>
              Cotiza tu estiba <span className="text-lime">en segundos</span>
            </>
          }
          text="Ingresa las medidas, elige el tipo de estiba y el ensamble, y conoce el rango de referencia. Diseñamos gratis la solución que se ajuste a tu carga."
        />

        <section className="bg-mist/60 py-10 sm:py-14">
          <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
            <Cotizador />

            <ul className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3">
              {perks.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2 text-[13px] font-semibold text-forest-dark/80">
                  <Icon className="h-5 w-5 text-brand" aria-hidden /> {label}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
