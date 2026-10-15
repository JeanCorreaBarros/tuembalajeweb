"use client";

import { Calculator, PackageSearch, Search, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PRODUCT_CATEGORIES, type Product, type ProductCategory } from "@/lib/products";
import { useWhatsappLink } from "@/components/cms/SettingsProvider";
import { WhatsAppIcon } from "../ui/icons";
import ProductDetail from "./ProductDetail";
import ServicesView from "./ServicesView";

type Filter = ProductCategory | "todos" | "servicios";

/** Minúsculas y sin tildes: "Diseño" encuentra "diseno" y viceversa. */
const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

/** Todo el texto de un producto (incluida la ficha técnica) en un solo bloque para buscar. */
const searchText = (p: Product) =>
  normalize(
    [
      p.title,
      p.short,
      p.intro,
      ...(p.bullets ?? []),
      ...(p.items ?? []).flatMap((it) => [it.title, it.desc]),
      ...(p.tags ?? []),
      // La capacidad de carga dice lo mismo en todos ("según diseño…"): no aporta a la búsqueda.
      ...p.specs.filter((sp) => sp.label !== "Capacidad de carga").flatMap((sp) => [sp.label, sp.value]),
      PRODUCT_CATEGORIES.find((c) => c.slug === p.category)?.label,
    ]
      .filter(Boolean)
      .join(" "),
  );

const SUGGESTIONS = ["4 entradas", "tacos", "NIMF 15", "huacales", "piso cerrado"];

/** Texto de todos los servicios para el buscador. */
const SERVICE_SEARCH_TEXT = normalize(
  [
    "fabricacion gran escala produccion industrial volumen lotes",
    "recertificacion embalajes madera nimf 15 exportacion sello ht tratamiento termico",
    "recoleccion madera residuos disposicion final huacales polines estibas baja",
    "remanufactura reparacion embalajes madera readecuacion medidas ahorro",
    "servicios servicio fabricar reparar recertificar recolectar",
  ].join(" ")
);

/**
 * Catálogo de /productos con buscador y filtros por categoría. Ambos se combinan y quedan
 * en la URL (?q=…&categoria=…) para poder compartir el resultado.
 */
export default function ProductCatalog({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("todos");
  const whatsappLink = useWhatsappLink();

  // Lee la búsqueda de la URL al entrar (enlace compartido).
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const q = sp.get("q") ?? "";
    const c = sp.get("categoria");
    /* eslint-disable react-hooks/set-state-in-effect -- la URL solo existe en el navegador */
    if (q) setQuery(q);
    if (c && PRODUCT_CATEGORIES.some((x) => x.slug === c)) setFilter(c as ProductCategory);
    /* eslint-enable react-hooks/set-state-in-effect */

    // Enlace a un producto (/productos#slug): baja hasta él cuando la página ya está lista.
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (id) {
      const t = setTimeout(() => document.getElementById(id)?.scrollIntoView({ block: "start" }), 150);
      return () => clearTimeout(t);
    }
  }, []);

  // Mantiene la URL al día sin recargar ni agregar entradas al historial (conserva el #ancla).
  useEffect(() => {
    const url = new URL(window.location.href);
    if (query.trim()) url.searchParams.set("q", query.trim());
    else url.searchParams.delete("q");
    if (filter !== "todos" && filter !== "servicios") url.searchParams.set("categoria", filter);
    else url.searchParams.delete("categoria");
    window.history.replaceState(window.history.state, "", url);
  }, [query, filter]);

  const index = useMemo(() => products.map((p) => ({ p, text: searchText(p) })), [products]);
  const words = normalize(query).split(/\s+/).filter(Boolean);
  const matchesQuery = (text: string) => words.every((w) => text.includes(w));

  // Cantidad por categoría según la búsqueda actual (así los filtros muestran cuántos hay).
  const counts: Record<string, number> = { todos: 0 };
  for (const { p, text } of index) {
    if (!matchesQuery(text)) continue;
    counts.todos++;
    counts[p.category] = (counts[p.category] ?? 0) + 1;
  }

  // Detecta si la búsqueda coincide con algún servicio.
  const servicesMatch = words.length > 0 && matchesQuery(SERVICE_SEARCH_TEXT);

  const visible = index.filter(({ p, text }) => (filter === "todos" || filter === "servicios" || p.category === filter) && matchesQuery(text));
  const filtered = words.length > 0 || (filter !== "todos" && filter !== "servicios");

  // Si el filtro activo es "todos", no hay productos y la búsqueda coincide con servicios → mostrar servicios.
  const showServicesFromSearch = filter === "todos" && visible.length === 0 && servicesMatch;
  const clear = () => {
    setQuery("");
    setFilter("todos");
  };

  const chips: { slug: Filter; label: string }[] = [
    { slug: "todos", label: "Todos" },
    ...PRODUCT_CATEGORIES,
    { slug: "servicios", label: "Servicios" },
  ];

  return (
    <>
      {/* Barra de búsqueda y filtros: fija bajo el menú desde tablet; en celular se desplaza con la página. */}
      <div className="z-40 border-b border-black/5 bg-white/95 backdrop-blur md:sticky md:top-[85px]">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-3 px-5 py-3 sm:px-8 md:flex-row md:items-center">
          <div className="relative md:w-[340px] md:shrink-0">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar: estiba 4 entradas, cajas, NIMF 15…"
              aria-label="Buscar productos"
              className="w-full rounded-full border border-black/10 bg-mist/60 py-2.5 pl-11 pr-10 text-base text-ink outline-none transition placeholder:text-ink/40 focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20 sm:text-[13px] [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Borrar búsqueda"
                className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-ink/50 transition hover:bg-black/5 hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div role="group" aria-label="Filtrar por categoría" className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:px-0">
            {chips.map((c) => {
              const active = filter === c.slug;
              const isServiciosChip = c.slug === "servicios";
              const n = isServiciosChip ? (words.length > 0 ? (servicesMatch ? 4 : 0) : 4) : (counts[c.slug] ?? 0);
              return (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => setFilter(c.slug)}
                  aria-pressed={active}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-[12px] font-semibold transition ${
                    active
                      ? isServiciosChip
                        ? "border-brand bg-brand text-white"
                        : "border-forest bg-forest text-white"
                      : "border-black/10 bg-white text-forest-dark hover:border-brand hover:text-brand-dark"
                  }`}
                >
                  {c.label}
                  <span
                    className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
                      active ? "bg-white/20 text-white" : "bg-mist text-ink/60"
                    }`}
                  >
                    {n}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Resumen del resultado (lo anuncian los lectores de pantalla). */}
      <div aria-live="polite" className={filtered && visible.length > 0 ? "bg-white" : "sr-only"}>
        {filtered && visible.length > 0 && (
          <p className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-x-3 gap-y-1 px-5 pt-6 text-[13px] text-ink/60 sm:px-8">
            <span>
              {visible.length} de {products.length} productos
              {words.length > 0 && (
                <>
                  {" "}
                  para &ldquo;<b className="text-ink">{query.trim()}</b>&rdquo;
                </>
              )}
            </span>
            <button type="button" onClick={clear} className="font-bold text-brand-dark hover:underline">
              Ver todos
            </button>
          </p>
        )}
      </div>

      {filter === "servicios" || showServicesFromSearch ? (
        <ServicesView />
      ) : visible.length === 0 ? (
        <section className="bg-white px-5 py-16 sm:px-8">
          <div className="mx-auto flex max-w-xl flex-col items-center text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/10 text-brand">
              <PackageSearch className="h-8 w-8" aria-hidden />
            </span>
            <h2 className="mt-5 text-xl font-extrabold text-forest-dark">
              No encontramos productos para &ldquo;{query.trim()}&rdquo;
            </h2>
            <p className="mt-2 text-[14px] leading-relaxed text-ink/60">
              Prueba con otras palabras o quita el filtro. Si necesitas algo distinto, lo diseñamos a tu medida.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setFilter("todos");
                    setQuery(s);
                  }}
                  className="rounded-full border border-black/10 px-3 py-1.5 text-[12px] font-semibold text-forest-dark transition hover:border-brand hover:text-brand-dark"
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/cotizador"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-forest px-6 py-3 text-[13px] font-bold text-white transition hover:bg-forest-mid"
              >
                <Calculator className="h-4 w-4" aria-hidden /> Ir al cotizador
              </Link>
              <a
                href={whatsappLink(`Hola, busco un embalaje en madera${query.trim() ? `: ${query.trim()}` : ""}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-[13px] font-bold text-white shadow-lg shadow-brand/30 transition hover:bg-brand-dark"
              >
                <WhatsAppIcon className="h-4 w-4" /> Pregúntanos por WhatsApp
              </a>
            </div>
            <button type="button" onClick={clear} className="mt-5 text-[13px] font-semibold text-ink/55 hover:text-forest">
              Ver todos los productos
            </button>
          </div>
        </section>
      ) : (
        visible.map(({ p }, position) => (
          <ProductDetail key={p.slug} product={p} index={products.indexOf(p)} position={position} />
        ))
      )}
    </>
  );
}
