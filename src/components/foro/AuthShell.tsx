import { CheckCircle2, MessagesSquare } from "lucide-react";
import type { ReactNode } from "react";
import Logo from "../ui/Logo";

const BENEFITS = [
  "Pregunta sobre estibas, embalajes y exportación",
  "Respuestas del equipo experto de Tu Embalaje",
  "Comparte tu experiencia y ayuda a otros",
];

/** Tarjeta de dos columnas para ingresar / registrarse. */
export default function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-[1000px] px-5 py-12 lg:py-16">
      <div className="grid overflow-hidden rounded-[28px] bg-white shadow-2xl shadow-forest/10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative hidden overflow-hidden bg-forest-dark p-10 text-white lg:block">
          <div className="pointer-events-none absolute inset-0 [background:radial-gradient(70%_60%_at_100%_0%,#1fb34a55,transparent_60%),radial-gradient(60%_50%_at_0%_100%,#3be05a33,transparent_60%)]" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:22px_22px]" />
          <MessagesSquare className="pointer-events-none absolute -bottom-10 -right-10 h-64 w-64 text-white/[0.06]" strokeWidth={1} />
          <div className="relative flex h-full flex-col">
            <Logo />
            <h2 className="mt-12 text-2xl font-extrabold leading-tight">
              La comunidad de <span className="text-lime">embalaje</span> en madera
            </h2>
            <ul className="mt-8 space-y-4">
              {BENEFITS.map((b) => (
                <li key={b} className="flex items-start gap-3 text-[14px] leading-snug text-white/85">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-lime" /> {b}
                </li>
              ))}
            </ul>
            <p className="mt-auto pt-10 text-[12px] text-white/50">Gratis y sin compromiso.</p>
          </div>
        </div>

        <div className="p-7 sm:p-10">
          <h1 className="text-2xl font-extrabold text-forest-dark sm:text-[28px]">{title}</h1>
          <p className="mt-1.5 text-[14px] text-ink/60">{subtitle}</p>
          <div className="mt-7">{children}</div>
        </div>
      </div>
    </div>
  );
}
