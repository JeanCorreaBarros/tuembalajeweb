import HeroArt from "../ui/HeroArt";

/** Cabecera de /productos (la barra de búsqueda y filtros está en ProductCatalog). Componente de servidor con animaciones CSS. */
export default function ProductsHeader() {
  return (
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
  );
}
