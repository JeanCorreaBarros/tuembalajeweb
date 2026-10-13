import { PRODUCTS } from "@/lib/products";
import HeroArt from "../ui/HeroArt";

/** Cabecera de /productos + barra de categorías. Componente de servidor con animaciones CSS. */
export default function ProductsHeader() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-forest-dark via-forest to-forest-mid pb-12 pt-32 text-white sm:pb-16 sm:pt-36">
        <HeroArt variant="productos" />
        <div className="relative mx-auto max-w-[1240px] px-5 sm:px-8">
          <p className="flex animate-fade-up items-center gap-3 text-[11px] font-bold uppercase tracking-[0.25em]">
            <span className="h-[3px] w-8 rounded bg-brand" /> Productos y servicios
          </p>
          <h1 className="mt-5 max-w-2xl animate-fade-up text-4xl font-extrabold leading-tight [animation-delay:100ms] sm:text-5xl">
            Embalajes en madera para cada <span className="text-lime">necesidad</span>
          </h1>
          <p className="mt-4 max-w-xl animate-fade-up text-[15px] leading-relaxed text-white/85 [animation-delay:200ms]">
            Cajas de madera, estibas y pallets, embalajes especiales y diseños a la medida de tu operación.
          </p>
        </div>
      </section>

      <nav
        aria-label="Categorías de productos"
        // El menú fijo mide 85px: la barra se pega justo debajo para que no quede tapada.
        className="sticky top-[85px] z-40 border-b border-black/5 bg-white/95 backdrop-blur"
      >
        <ul className="no-scrollbar mx-auto flex max-w-[1240px] snap-x gap-2 overflow-x-auto scroll-px-5 px-5 py-3 sm:px-8 lg:px-8">
          {PRODUCTS.map((p, i) => (
            <li key={p.slug} className="shrink-0 snap-start">
              <a
                href={`#${p.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-[12px] font-semibold text-forest-dark transition hover:border-brand hover:bg-brand hover:text-white"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-forest text-[10px] text-white">
                  {i + 1}
                </span>
                {p.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
