import { CalendarDays, FileText, Mail, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { RichText } from "@/components/cms/Text";
import type { Settings } from "@/lib/cms/settings";
import { SITE } from "@/lib/site";
import HeroArt from "../ui/HeroArt";

const anchor = (title: string, i: number) =>
  title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || `seccion-${i + 1}`;

/** Variables que se pueden usar en los textos legales del panel ({empresa}, {correo}…). */
export function legalVars(s: Settings): Record<string, string> {
  return {
    empresa: s.legalName,
    nit_texto: s.nit ? `, identificada con NIT ${s.nit}` : "",
    domicilio: s.address || s.location,
    correo: s.email,
    telefono: s.phoneDisplay,
    sitio: SITE.url.replace(/^https?:\/\//, ""),
    horario: s.schedule,
    fecha: s.legalUpdated,
  };
}

/**
 * Plantilla de documento legal (contenido editable en /admin): encabezado, índice lateral
 * (fijo en escritorio, plegable en celular) y secciones numeradas con anclas para enlazarlas.
 */
export default function LegalDoc({
  kind,
  title,
  intro,
  sections,
  settings,
  related,
}: {
  kind: string;
  title: string;
  intro: string;
  sections: { title: string; body: string }[];
  settings: Settings;
  related: { label: string; href: string };
}) {
  const vars = legalVars(settings);
  const items = sections.map((s, i) => ({ ...s, id: anchor(s.title, i) }));
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-forest-dark via-forest to-forest-mid pb-12 pt-32 text-white sm:pb-14 sm:pt-36">
        <HeroArt variant="nosotros" />
        <div className="relative mx-auto max-w-[1240px] px-5 sm:px-8">
          <p className="flex animate-fade-up items-center gap-3 text-[11px] font-bold uppercase tracking-[0.25em]">
            <span className="h-[3px] w-8 rounded bg-brand" /> {kind}
          </p>
          <h1 className="mt-5 max-w-3xl animate-fade-up text-[32px] font-extrabold leading-tight [animation-delay:100ms] sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl animate-fade-up text-[15px] leading-relaxed text-white/85 [animation-delay:200ms]">{intro}</p>
          {settings.legalUpdated && (
            <p className="mt-6 inline-flex animate-fade-up items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[12px] text-white/80 [animation-delay:300ms]">
              <CalendarDays className="h-4 w-4 text-lime" aria-hidden /> Última actualización: {settings.legalUpdated}
            </p>
          )}
        </div>
      </section>

      <div className="bg-mist/60">
        <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-8 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-12">
          {/* Índice */}
          <aside className="lg:sticky lg:top-[109px] lg:h-fit">
            <details className="group rounded-2xl bg-white p-5 shadow-sm" open>
              <summary className="-my-2 flex cursor-pointer list-none items-center justify-between py-2 text-[12px] font-extrabold uppercase tracking-wider text-forest-dark lg:cursor-default">
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-brand" aria-hidden /> Contenido
                </span>
                <span aria-hidden className="text-ink/40 transition group-open:rotate-180 lg:hidden">
                  ▾
                </span>
              </summary>
              <ol className="mt-4 space-y-1 text-[13px]">
                {items.map((s, i) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="flex gap-2 rounded-lg px-2 py-1.5 text-ink/65 transition hover:bg-mist hover:text-forest-dark">
                      <span className="w-5 shrink-0 font-bold text-brand-dark">{i + 1}.</span>
                      {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </details>

            {settings.email && (
              <div className="mt-4 hidden rounded-2xl bg-forest-dark p-5 text-white lg:block">
                <ShieldCheck className="h-6 w-6 text-lime" aria-hidden />
                <p className="mt-3 text-[13px] font-bold">¿Dudas sobre este documento?</p>
                <a href={`mailto:${settings.email}`} className="mt-1 inline-flex items-center gap-1.5 break-all text-[12px] text-white/75 hover:text-lime">
                  <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden /> {settings.email}
                </a>
              </div>
            )}
          </aside>

          {/* Documento */}
          <article className="min-w-0 rounded-3xl bg-white p-6 shadow-sm sm:p-10">
            {items.map((s, i) => (
              <section key={s.id} id={s.id} className="scroll-mt-28 border-b border-black/5 pb-8 pt-8 first:pt-0 last:border-0 last:pb-0">
                <h2 className="flex items-baseline gap-3 text-[20px] font-extrabold leading-snug text-forest-dark sm:text-[22px]">
                  <span className="text-brand">{i + 1}.</span>
                  {s.title}
                </h2>
                <RichText text={s.body} vars={vars} />
              </section>
            ))}

            <div className="mt-10 flex flex-col gap-3 rounded-2xl bg-mist p-5 text-[13px] text-ink/70 sm:flex-row sm:items-center sm:justify-between">
              <span>Consulta también nuestro documento complementario.</span>
              <Link
                href={related.href}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-forest px-5 py-2.5 font-bold text-white transition hover:bg-forest-mid"
              >
                <FileText className="h-4 w-4" aria-hidden /> {related.label}
              </Link>
            </div>
          </article>
        </div>
      </div>
    </>
  );
}
