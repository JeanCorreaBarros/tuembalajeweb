import { iconFor } from "@/lib/cms/icons";
import type { CmsValues } from "@/lib/cms/pages";
import Button from "../ui/Button";
import SmartImage from "../ui/SmartImage";

/*
 * Componente de servidor: las animaciones de entrada son CSS (ver globals.css), así el título
 * se pinta con el HTML inicial sin esperar a JavaScript. El escalonado se hace con animation-delay.
 * Textos e imagen editables en /admin (Inicio · Encabezado principal).
 */
export default function Hero({ c }: { c: CmsValues<"inicio">["hero"] }) {
  return (
    // La altura sigue la proporción de la foto (≈2.9:1) para que la caja y la planta se vean completas.
    <section id="inicio" className="relative isolate min-h-[640px] overflow-hidden bg-forest-dark lg:h-[clamp(540px,35vw,760px)] lg:min-h-0">
      <div className="absolute inset-0 -z-20 animate-hero-zoom [&_img]:object-[72%_50%]">
        <SmartImage src={c.image} alt={c.imageAlt} priority quality={80} />
      </div>
      {/* Sombra neutra solo detrás del texto; la caja y la planta quedan con su color real. */}
      <div className="absolute inset-0 -z-10 bg-black/45 lg:bg-transparent lg:bg-[linear-gradient(to_right,rgba(0,0,0,0.6)_0%,rgba(0,0,0,0.25)_38%,transparent_55%)]" />

      <div className="flex h-full items-center px-5 pb-12 pt-32 sm:px-8 lg:pb-8 lg:pl-[6%] lg:pr-[4%] lg:pt-24">
        <div className="max-w-xl">
          <p className="flex animate-fade-up items-center gap-3 text-[11px] font-bold uppercase tracking-[0.25em] text-white">
            <span className="h-[3px] w-8 rounded bg-brand" />
            {c.eyebrow}
          </p>
          <h1 className="mt-5 animate-fade-up text-5xl font-extrabold leading-[1.02] tracking-tight text-white [animation-delay:80ms] sm:text-6xl lg:text-[68px]">
            {c.title}
            <span className="block bg-gradient-to-r from-brand to-lime bg-clip-text text-transparent">{c.highlight}</span>
          </h1>
          <p className="mt-5 max-w-md animate-fade-up text-[15px] leading-relaxed text-white/90 [animation-delay:160ms]">
            {c.text}
          </p>

          {c.features.length > 0 && (
            <ul className="mt-7 grid animate-fade-up grid-cols-2 gap-x-5 gap-y-4 [animation-delay:240ms] sm:flex sm:flex-wrap sm:gap-x-7">
              {c.features.map(({ icon, label }, i) => {
                const Icon = iconFor(icon);
                return (
                  <li key={i} className="flex items-center gap-2.5 text-[11px] font-medium leading-tight text-white sm:text-[10px]">
                    <Icon className="h-7 w-7 text-brand" strokeWidth={1.5} aria-hidden />
                    <span className="whitespace-pre-line">{label}</span>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="mt-8 flex animate-fade-up flex-col gap-3 [animation-delay:320ms] sm:flex-row sm:flex-wrap">
            <Button whatsapp className="justify-center">
              {c.cta}
            </Button>
            <Button href="/productos" variant="outline" className="justify-center">
              {c.cta2}
            </Button>
          </div>
        </div>
      </div>

      {c.script && (
        <p
          aria-hidden
          className="absolute right-[3%] top-[38%] hidden max-w-[260px] animate-pop-in font-script text-4xl leading-tight text-white drop-shadow-lg [--pop-rotate:-10deg] [animation-delay:1s] lg:block xl:text-5xl"
        >
          {c.script}
          <svg viewBox="0 0 220 24" className="mt-1 h-5 w-52 text-brand" fill="none">
            <path
              d="M4 18C60 4 130 2 216 10"
              pathLength={1}
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              className="draw-path animate-draw [animation-delay:1.6s]"
            />
          </svg>
        </p>
      )}
    </section>
  );
}
