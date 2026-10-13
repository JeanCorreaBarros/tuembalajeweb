import type { ReactNode } from "react";
import HeroArt, { type HeroArtVariant } from "../ui/HeroArt";

type Props = { eyebrow: string; title: ReactNode; text: string; art?: HeroArtVariant };

/** Cabecera de página interna. Componente de servidor con animaciones CSS (ver globals.css). */
export default function PageHeader({ eyebrow, title, text, art = "nosotros" }: Props) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-forest-dark via-forest to-forest-mid pb-12 pt-32 text-white sm:pb-16 sm:pt-36">
      <HeroArt variant={art} />
      <div className="relative mx-auto max-w-[1240px] px-5 sm:px-8">
        <p className="flex animate-fade-up items-center gap-3 text-[11px] font-bold uppercase tracking-[0.25em]">
          <span className="h-[3px] w-8 rounded bg-brand" /> {eyebrow}
        </p>
        <h1 className="mt-5 max-w-2xl animate-fade-up text-[34px] font-extrabold leading-tight [animation-delay:100ms] sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-xl animate-fade-up text-[15px] leading-relaxed text-white/85 [animation-delay:200ms]">
          {text}
        </p>
      </div>
    </section>
  );
}
