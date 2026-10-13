import type { ReactNode } from "react";
import HeroArt from "../ui/HeroArt";

/**
 * Cabecera del foro. `bar` es la fila superior (ruta + sesión del usuario);
 * `children` va debajo del título (buscador, estadísticas, etc.).
 * Componente de servidor con animaciones CSS (ver globals.css).
 */
export default function ForumHero({
  title,
  text,
  bar,
  children,
  eyebrow = "Comunidad Tu Embalaje",
}: {
  title: ReactNode;
  text?: string;
  bar?: ReactNode;
  children?: ReactNode;
  eyebrow?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-forest-dark text-white">
      <div className="absolute inset-0 -z-10">
        <HeroArt variant="foro" />
      </div>

      {bar && <div className="border-b border-white/10">{bar}</div>}

      <div className="mx-auto max-w-[1240px] px-5 pb-10 pt-8 sm:px-8 sm:pb-12 sm:pt-10 lg:pb-14">
        <p className="flex animate-fade-up items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-lime">
          <span className="h-[3px] w-7 rounded bg-brand" /> {eyebrow}
        </p>
        <h1 className="mt-3 max-w-3xl animate-fade-up break-words text-[28px] font-extrabold leading-tight [animation-delay:50ms] sm:text-[42px]">
          {title}
        </h1>
        {text && (
          <p className="mt-3 max-w-2xl animate-fade-up text-[15px] leading-relaxed text-white/75 [animation-delay:120ms]">
            {text}
          </p>
        )}
        {children && <div className="mt-7 animate-fade-up [animation-delay:200ms]">{children}</div>}
      </div>
    </section>
  );
}
