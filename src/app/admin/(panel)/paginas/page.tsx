import {
  ArrowRight,
  Calculator,
  ExternalLink,
  FileCheck2,
  Home,
  Layers,
  type LucideIcon,
  Mail,
  Package,
  PenLine,
  Scale,
  Search,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";
import { connection } from "next/server";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminShell";
import { IMAGES } from "@/lib/images";
import { CMS_PAGES, SPECIAL_PAGES, type CmsPageId } from "@/lib/cms/pages";
import { readProducts } from "@/lib/cms/products";
import { readPageContent, sectionUpdates } from "@/lib/cms/store";

// El panel depende de la sesión en cada pantalla: no se navega «al instante» (lo indica Next en desarrollo).
export const instant = false;

export const metadata = { title: "Páginas" };

const fmt = (ts: number) => new Intl.DateTimeFormat("es-CO", { dateStyle: "medium" }).format(new Date(ts));
const fmtLong = (ts: number) => new Intl.DateTimeFormat("es-CO", { dateStyle: "medium", timeStyle: "short" }).format(new Date(ts));

const LEGAL: CmsPageId[] = ["privacidad", "terminos"];

/** Ícono y descripción corta de cada página. */
const META: Partial<Record<CmsPageId, { icon: LucideIcon; text: string }>> = {
  inicio: { icon: Home, text: "La portada: encabezado, cifras, proceso, sectores, testimonios…" },
  nosotros: { icon: Users, text: "Quiénes son: misión, visión y valores." },
  productos: { icon: Package, text: "Encabezado del catálogo de productos." },
  contacto: { icon: Mail, text: "Encabezado, formulario y tarjetas de contacto." },
  cotizador: { icon: Calculator, text: "Medidas estándar, precios de referencia y mensajes." },
  privacidad: { icon: ShieldCheck, text: "Cómo se tratan los datos personales (Ley 1581)." },
  terminos: { icon: Scale, text: "Reglas de uso del sitio, cotizaciones y foro." },
};

export default async function PaginasPage() {
  await connection();
  const ids = (Object.keys(CMS_PAGES) as CmsPageId[]).filter((id) => !SPECIAL_PAGES.includes(id));
  const inicio = readPageContent("inicio");
  const contacto = readPageContent("contacto");
  const firstProduct = readProducts()[0]?.image;

  // Foto de portada de cada tarjeta: la imagen que hoy usa esa página.
  const cover: Partial<Record<CmsPageId, string>> = {
    inicio: inicio.hero.image,
    nosotros: inicio.nosotros.image,
    productos: firstProduct || IMAGES.sectorsBg,
    contacto: contacto.encabezado.image || IMAGES.sectorsTruck,
    cotizador: IMAGES.sectorsForklift,
  };

  const pages = ids.map((id) => {
    const p = CMS_PAGES[id];
    const updates = sectionUpdates(id);
    const sections = Object.entries(p.sections).map(([sid, s]) => ({ id: sid, title: s.title, edited: Boolean(updates[sid]) }));
    const last = Object.values(updates).sort((a, b) => b.at - a.at)[0] ?? null;
    const lastSection = last ? sections.find((s) => updates[s.id]?.at === last.at)?.title : undefined;
    // Los documentos legales tienen una sola sección con muchas partes: se cuentan esas partes.
    const docParts = LEGAL.includes(id) ? ((readPageContent(id) as { documento: { sections: unknown[] } }).documento.sections.length ?? 0) : 0;
    return { id, title: p.title, path: "path" in p ? p.path : undefined, sections, last, lastSection, docParts, ...META[id]! };
  });

  const site = pages.filter((p) => !LEGAL.includes(p.id));
  const legal = pages.filter((p) => LEGAL.includes(p.id));
  const totalSections = pages.reduce((s, p) => s + p.sections.length, 0);
  const editedSections = pages.reduce((s, p) => s + p.sections.filter((x) => x.edited).length, 0);
  const latest = pages.filter((p) => p.last).sort((a, b) => b.last!.at - a.last!.at)[0];
  const pct = Math.round((editedSections / totalSections) * 100);

  return (
    <>
      <AdminHeader
        title="Páginas"
        description="Elige una página para editar sus textos e imágenes. Los cambios se publican al guardar."
        help="/admin/ayuda#paginas"
      />

      {/* Resumen */}
      <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex items-center gap-3.5 rounded-2xl bg-forest-dark p-4 text-white">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-lime">
            <Layers className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <p className="text-[22px] font-extrabold leading-none">{pages.length}</p>
            <p className="mt-1 text-[12px] text-white/60">páginas editables · {totalSections} secciones</p>
          </div>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-[13px] font-bold text-forest-dark">Contenido personalizado</p>
            <p className="text-[13px] font-extrabold tabular-nums text-brand-dark">{pct}%</p>
          </div>
          <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-black/[0.06]">
            <div className="h-full rounded-full bg-gradient-to-r from-brand to-lime" style={{ width: `${Math.max(pct, 2)}%` }} />
          </div>
          <p className="mt-2 text-[12px] text-ink/50">
            {editedSections} de {totalSections} secciones editadas; el resto conserva los textos originales.
          </p>
        </div>
        <div className="flex items-center gap-3.5 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
            <PenLine className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-forest-dark">Último cambio</p>
            {latest?.last ? (
              <p className="mt-0.5 text-[12px] leading-snug text-ink/55">
                <span className="font-semibold text-ink/75">
                  {latest.title} · {latest.lastSection}
                </span>
                <br />
                {fmtLong(latest.last.at)}
                {latest.last.user && ` · ${latest.last.user}`}
              </p>
            ) : (
              <p className="mt-0.5 text-[12px] text-ink/55">Todavía no hay cambios publicados.</p>
            )}
          </div>
        </div>
      </div>

      {/* Páginas del sitio */}
      <SectionTitle title="Páginas del sitio" count={site.length} />
      <ul className="mb-10 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {site.map((p) => {
          const edited = p.sections.filter((s) => s.edited).length;
          const Icon = p.icon;
          const href = `/admin/paginas/${p.id}`;
          return (
            <li
              key={p.id}
              className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-forest/10 hover:ring-brand/30"
            >
              <Link href={href} className="relative block aspect-[16/8] overflow-hidden bg-forest-dark" aria-label={`Editar ${p.title}`}>
                {/* eslint-disable-next-line @next/next/no-img-element -- miniatura del panel */}
                <img
                  src={cover[p.id]}
                  alt=""
                  className="h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-forest-dark via-forest-dark/45 to-transparent" aria-hidden />
                <span className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/95 text-brand shadow-md">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <span className="absolute bottom-3.5 left-4 right-4 text-white">
                  <span className="block text-[19px] font-extrabold leading-tight drop-shadow">{p.title}</span>
                  <span className="mt-0.5 block font-mono text-[11px] text-white/70">{p.path}</span>
                </span>
              </Link>

              <div className="flex flex-1 flex-col p-4 sm:p-5">
                <p className="text-[13px] leading-snug text-ink/60">{p.text}</p>

                <div className="mt-4">
                  <div className="mb-1.5 flex items-center justify-between text-[11px] font-semibold">
                    <span className="text-ink/50">Secciones editadas</span>
                    <span className="tabular-nums text-forest-dark">
                      {edited}/{p.sections.length}
                    </span>
                  </div>
                  <div className="flex gap-1" aria-hidden>
                    {p.sections.map((s) => (
                      <span key={s.id} className={`h-1.5 flex-1 rounded-full ${s.edited ? "bg-brand" : "bg-black/[0.07]"}`} />
                    ))}
                  </div>
                </div>

                <div className="mb-4 mt-4 flex flex-wrap gap-1.5">
                  {p.sections.slice(0, 4).map((s) => (
                    <Link
                      key={s.id}
                      href={`${href}#${s.id}`}
                      className="inline-flex items-center gap-1.5 rounded-full bg-mist px-2.5 py-1 text-[11px] font-semibold text-ink/65 transition hover:bg-brand/15 hover:text-forest-dark"
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${s.edited ? "bg-brand" : "bg-ink/20"}`} aria-hidden />
                      {s.title}
                    </Link>
                  ))}
                  {p.sections.length > 4 && (
                    <Link href={href} className="rounded-full px-2 py-1 text-[11px] font-bold text-brand-dark hover:underline">
                      +{p.sections.length - 4} más
                    </Link>
                  )}
                </div>

                <div className="mt-auto flex items-center gap-2 border-t border-black/5 pt-4">
                  <p className="min-w-0 flex-1 truncate text-[11px] text-ink/45">
                    {p.last ? `Editada el ${fmt(p.last.at)}` : "Textos originales"}
                  </p>
                  {p.path && (
                    <a
                      href={p.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Ver en el sitio"
                      aria-label={`Ver ${p.title} en el sitio`}
                      className="flex h-9 w-9 items-center justify-center rounded-full text-ink/45 transition hover:bg-mist hover:text-forest-dark"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                  <Link
                    href={href}
                    className="inline-flex items-center gap-1.5 rounded-full bg-forest-dark px-4 py-2 text-[12px] font-bold text-white transition hover:bg-brand"
                  >
                    Editar <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" aria-hidden />
                  </Link>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Documentos legales */}
      <SectionTitle title="Documentos legales" count={legal.length} />
      <ul className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-2">
        {legal.map((p) => {
          const Icon = p.icon;
          return (
            <li key={p.id}>
              <Link
                href={`/admin/paginas/${p.id}`}
                className="group flex items-center gap-4 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-lg hover:ring-brand/30 sm:p-5"
              >
                <span className="relative flex h-14 w-12 shrink-0 items-center justify-center rounded-lg bg-mist text-forest ring-1 ring-black/5">
                  <Icon className="h-6 w-6" aria-hidden />
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-white shadow">
                    <FileCheck2 className="h-3 w-3" aria-hidden />
                  </span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[16px] font-extrabold text-forest-dark">{p.title}</span>
                  <span className="mt-0.5 block text-[12px] leading-snug text-ink/55">{p.text}</span>
                  <span className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-ink/45">
                    <span>{p.docParts} apartados</span>
                    <span>{p.last ? `Editado el ${fmt(p.last.at)}` : "Texto original"}</span>
                  </span>
                </span>
                <ArrowRight className="h-5 w-5 shrink-0 text-ink/25 transition group-hover:translate-x-1 group-hover:text-brand" aria-hidden />
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Otros contenidos */}
      <SectionTitle title="También se edita desde aquí" />
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {(
          [
            ["/admin/productos", Package, "Productos", "Catálogo y fichas técnicas"],
            ["/admin/seo", Search, "SEO · Google", "Títulos y descripciones en Google"],
            ["/admin/ajustes", Settings, "Ajustes generales", "WhatsApp, teléfonos y pie de página"],
          ] as const
        ).map(([href, Icon, title, text]) => (
          <li key={href}>
            <Link
              href={href}
              className="group flex items-center gap-3 rounded-2xl border border-dashed border-black/10 px-4 py-3.5 transition hover:border-brand/50 hover:bg-white"
            >
              <Icon className="h-5 w-5 shrink-0 text-brand" aria-hidden />
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] font-bold text-forest-dark">{title}</span>
                <span className="block truncate text-[11px] text-ink/50">{text}</span>
              </span>
              <ArrowRight className="h-4 w-4 text-ink/25 transition group-hover:translate-x-0.5 group-hover:text-brand" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

function SectionTitle({ title, count }: { title: string; count?: number }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-ink/50">{title}</h2>
      {count !== undefined && (
        <span className="rounded-full bg-black/[0.06] px-2 py-0.5 text-[11px] font-bold tabular-nums text-ink/55">{count}</span>
      )}
      <span className="h-px flex-1 bg-black/[0.07]" aria-hidden />
    </div>
  );
}
