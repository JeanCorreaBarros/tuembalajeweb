import { CheckCircle2 } from "lucide-react";
import { IMAGES } from "@/lib/images";
import HeroArt from "../ui/HeroArt";
import SmartImage from "../ui/SmartImage";

const checks = ["Asesoría gratuita", "Respuesta rápida", "Soluciones a tu medida"];

/** Cabecera de /contacto. Componente de servidor con animaciones CSS (ver globals.css). */
export default function ContactHero() {
  return (
    <section className="relative isolate overflow-hidden bg-forest-dark pb-14 pt-32 text-white lg:pb-16 lg:pt-36">
      <div className="absolute inset-0 -z-30 bg-gradient-to-br from-forest-dark via-forest to-forest-mid" />
      <div className="absolute inset-0 -z-20">
        <HeroArt variant="contacto" />
      </div>
      {/* Solo se pide la foto si está configurada en IMAGES.contactHero (evita un 404 en cada visita). */}
      {IMAGES.contactHero && (
        <div className="absolute inset-0 -z-10">
          <SmartImage src={IMAGES.contactHero} alt="Asesora de Tu Embalaje con headset" priority silent className="object-right" />
          <div className="absolute inset-0 bg-gradient-to-r from-forest-dark via-forest/70 to-transparent" />
        </div>
      )}

      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <div className="inline-flex animate-fade-in items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand/70 bg-forest-dark/40 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]">
            <span className="h-2 w-2 rounded-full bg-lime" /> Contacto
          </span>
          <span className="h-px w-8 bg-brand" />
        </div>

        <h1 className="mt-4 max-w-2xl animate-fade-up text-4xl font-extrabold leading-tight tracking-tight [animation-delay:100ms] sm:text-5xl lg:text-[56px]">
          Hablemos de tu <span className="text-lime">embalaje</span>
        </h1>
        <p className="mt-3 max-w-lg animate-fade-up text-[15px] text-white/90 [animation-delay:200ms]">
          Recibe asesoría personalizada y sin compromiso. Te respondemos rápido.
        </p>

        <ul className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
          {checks.map((c, i) => (
            <li
              key={c}
              style={{ animationDelay: `${400 + i * 120}ms` }}
              className="flex animate-fade-up items-center gap-2 text-[12px] font-semibold"
            >
              <CheckCircle2 className="h-5 w-5 fill-brand text-forest-dark" aria-hidden /> {c}
            </li>
          ))}
        </ul>
      </div>

      <p
        aria-hidden
        className="absolute bottom-8 right-24 hidden animate-pop-in font-script text-2xl leading-tight text-white drop-shadow [--pop-rotate:-8deg] [animation-delay:1s] lg:block"
      >
        Estamos <br /> para ayudarte
        <svg viewBox="0 0 120 12" className="mt-1 h-3 w-28 text-brand" fill="none">
          <path
            d="M2 9C30 2 70 2 118 4"
            pathLength={1}
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="draw-path animate-draw [animation-delay:1.5s]"
          />
        </svg>
      </p>
    </section>
  );
}
