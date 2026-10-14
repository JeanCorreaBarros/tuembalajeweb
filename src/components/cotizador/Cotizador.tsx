"use client";

import { AlertTriangle, ArrowRight, Building2, CheckCircle2, Lock, Mail, Phone, Ruler, Sparkles, User } from "lucide-react";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { useSettings } from "@/components/cms/SettingsProvider";
import {
  dentroDeRango,
  ENSAMBLES,
  formatoCOP,
  TIPOS_ESTIBA,
  type CotizadorConfig,
  type Ensamble,
  type TipoEstiba,
} from "@/lib/cotizador";
import { WhatsAppIcon } from "../ui/icons";

// 16px en celular: con menos, iOS hace zoom al tocar el campo.
const input =
  "w-full rounded-xl border border-black/10 bg-white py-3.5 pl-11 pr-4 text-base text-ink outline-none transition placeholder:text-ink/45 focus:border-brand focus:ring-2 focus:ring-brand/20 sm:text-[14px]";

function Field({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/45 [&>svg]:h-4 [&>svg]:w-4">{icon}</span>
      {children}
    </div>
  );
}

function Medida({
  id,
  label,
  value,
  onChange,
  range,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  range: { min: number; max: number };
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[12px] font-bold text-forest-dark">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={1}
          step="any"
          placeholder={`Ej: ${range.max - 30}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-black/10 bg-white py-3.5 pl-4 pr-12 text-base font-semibold text-ink outline-none transition placeholder:font-normal placeholder:text-ink/40 focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[13px] font-semibold text-ink/45">cm</span>
      </div>
      <p className="mt-1 text-[11px] text-ink/45">
        Estándar: {range.min} – {range.max} cm
      </p>
    </div>
  );
}

/** Grupo de opciones tipo tarjeta (radio). */
function Options<T extends string>({
  name,
  label,
  options,
  value,
  onChange,
}: {
  name: string;
  label: string;
  options: readonly { slug: T; label: string; desc: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-1.5 block text-[12px] font-bold text-forest-dark">{label}</legend>
      <div className="grid grid-cols-2 gap-2.5">
        {options.map((o) => (
          <label key={o.slug} className="cursor-pointer">
            <input
              type="radio"
              name={name}
              value={o.slug}
              checked={value === o.slug}
              onChange={() => onChange(o.slug)}
              className="peer sr-only"
            />
            <span className="flex h-full flex-col rounded-xl border-2 border-black/10 bg-white px-3.5 py-3 transition peer-checked:border-brand peer-checked:bg-brand/[0.06] peer-focus-visible:ring-4 peer-focus-visible:ring-brand/20 hover:border-brand/50">
              <span className="text-[13px] font-bold text-forest-dark">{o.label}</span>
              <span className="mt-0.5 text-[11px] leading-snug text-ink/55">{o.desc}</span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** Cotizador de estibas. Medidas, precios y mensajes llegan del panel (/admin · Cotizador). */
export default function Cotizador({ config }: { config: CotizadorConfig }) {
  const { whatsapp } = useSettings();
  const { medidas: MEDIDAS, precios: PRECIOS, mensajes: MENSAJES } = config;
  const [largo, setLargo] = useState("");
  const [ancho, setAncho] = useState("");
  const [tipo, setTipo] = useState<TipoEstiba>(TIPOS_ESTIBA[0].slug);
  const [ensamble, setEnsamble] = useState<Ensamble>(ENSAMBLES[0].slug);
  const [sent, setSent] = useState(false);

  const l = Number.parseFloat(largo.replace(",", "."));
  const a = Number.parseFloat(ancho.replace(",", "."));
  const listo = l > 0 && a > 0;
  const estandar = listo && dentroDeRango(MEDIDAS, l, a);
  const precio = PRECIOS[ensamble][tipo];
  const tipoLabel = TIPOS_ESTIBA.find((t) => t.slug === tipo)!.label;
  const ensambleLabel = ENSAMBLES.find((e) => e.slug === ensamble)!.label;
  const msg = estandar ? MENSAJES.dentro : MENSAJES.fuera;

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const text = [
      "Hola, quiero una propuesta a medida para estibas (cotizador web).",
      `Medidas: ${l} x ${a} cm (largo x ancho)${estandar ? "" : " — fuera de lo estándar"}`,
      `Tipo de estiba: ${tipoLabel}`,
      `Ensamble: ${ensambleLabel}`,
      ...(estandar ? [`Rango de referencia: ${formatoCOP(precio.min)} – ${formatoCOP(precio.max)}`] : []),
      `Nombre: ${d.get("nombre")}`,
      `Empresa: ${d.get("empresa")}`,
      `Teléfono/WhatsApp: ${d.get("telefono")}`,
      `Correo: ${d.get("correo")}`,
    ].join("\n");
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
    setSent(true);
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-8">
      {/* ---------- 1. Parámetros ---------- */}
      <section aria-labelledby="paso-1" className="rounded-3xl bg-white p-5 shadow-[0_10px_40px_-12px_rgba(11,59,40,0.2)] sm:p-8">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest text-[14px] font-extrabold text-white">1</span>
          <h2 id="paso-1" className="text-xl font-extrabold text-forest-dark">
            Cuéntanos tu estiba
          </h2>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3.5">
          <Medida id="largo" label="Largo" value={largo} onChange={setLargo} range={MEDIDAS.largo} />
          <Medida id="ancho" label="Ancho" value={ancho} onChange={setAncho} range={MEDIDAS.ancho} />
        </div>

        <div className="mt-6 space-y-5">
          <Options name="tipo" label="Tipo de estiba" options={TIPOS_ESTIBA} value={tipo} onChange={setTipo} />
          <Options name="ensamble" label="Tipo de ensamble" options={ENSAMBLES} value={ensamble} onChange={setEnsamble} />
        </div>
      </section>

      {/* ---------- 2. Resultado + datos de contacto ---------- */}
      <section aria-labelledby="paso-2" aria-live="polite" className="rounded-3xl bg-white p-5 shadow-[0_10px_40px_-12px_rgba(11,59,40,0.2)] sm:p-8">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest text-[14px] font-extrabold text-white">2</span>
          <h2 id="paso-2" className="text-xl font-extrabold text-forest-dark">
            Tu cotización
          </h2>
        </div>

        {!listo ? (
          <div className="mt-6 flex flex-col items-center rounded-2xl border-2 border-dashed border-black/10 px-6 py-12 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10 text-brand">
              <Ruler className="h-7 w-7" aria-hidden />
            </span>
            <p className="mt-4 text-[15px] font-bold text-forest-dark">Ingresa el largo y el ancho</p>
            <p className="mt-1 max-w-xs text-[13px] text-ink/55">Verás al instante el rango de referencia para tu estiba.</p>
          </div>
        ) : (
          <>
            {estandar ? (
              <div className="mt-6 overflow-hidden rounded-2xl bg-gradient-to-br from-forest-dark to-forest-mid p-5 text-white sm:p-6">
                <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-lime">
                  <CheckCircle2 className="h-4 w-4" aria-hidden /> Medida estándar
                </p>
                <p className="mt-3 text-[12px] text-white/70">
                  Estiba de {tipoLabel.toLowerCase()} · {ensambleLabel.toLowerCase()} · {l} × {a} cm
                </p>
                <p className="mt-1 text-[28px] font-extrabold leading-tight sm:text-[32px]">
                  {formatoCOP(precio.min)} <span className="text-white/50">–</span> {formatoCOP(precio.max)}
                </p>
                <p className="mt-1 text-[11px] text-white/60">
                  Rango de referencia en pesos colombianos. El valor final depende de la madera, la cantidad y el diseño.
                </p>
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border-2 border-amber-300 bg-amber-50 p-5 sm:p-6">
                <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-amber-700">
                  <AlertTriangle className="h-4 w-4" aria-hidden /> Fuera de lo estándar · {l} × {a} cm
                </p>
                <p className="mt-2 flex items-center gap-2 text-[12px] font-semibold text-amber-800">
                  <Sparkles className="h-4 w-4 shrink-0" aria-hidden /> Requiere diseño especial
                </p>
              </div>
            )}

            <div className="mt-5">
              <p className="text-[17px] font-extrabold leading-snug text-forest-dark">{msg.titulo}</p>
              <p className="mt-1.5 text-[14px] leading-relaxed text-ink/65">{msg.texto}</p>
            </div>

            <form onSubmit={onSubmit} className="mt-6 space-y-3.5">
              <div className="grid gap-3.5 sm:grid-cols-2">
                <Field icon={<User />}>
                  <input name="nombre" required autoComplete="name" placeholder="Nombre de contacto *" className={input} />
                </Field>
                <Field icon={<Building2 />}>
                  <input name="empresa" required autoComplete="organization" placeholder="Empresa *" className={input} />
                </Field>
                <Field icon={<Phone />}>
                  <input name="telefono" required type="tel" autoComplete="tel" placeholder="Teléfono / WhatsApp *" className={input} />
                </Field>
                <Field icon={<Mail />}>
                  <input name="correo" required type="email" autoComplete="email" placeholder="Correo *" className={input} />
                </Field>
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-brand-dark to-brand px-7 py-4 text-[15px] font-bold text-white shadow-lg shadow-brand/30 transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                <WhatsAppIcon className="h-5 w-5" /> {MENSAJES.cta} <ArrowRight className="h-4 w-4" aria-hidden />
              </button>

              <p className="flex items-start justify-center gap-1.5 text-center text-[11px] leading-relaxed text-ink/50">
                <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                <span>
                  Sin compromiso. Usamos tus datos solo para enviarte la propuesta, según nuestra{" "}
                  <Link href="/politica-de-privacidad" className="font-semibold text-brand-dark hover:underline">
                    Política de privacidad
                  </Link>
                  .
                </span>
              </p>

              {sent && (
                <p role="status" className="rounded-xl bg-brand/10 px-4 py-3 text-center text-[13px] font-medium text-brand-dark">
                  ¡Gracias! Se abrió WhatsApp con tu solicitud lista para enviar. Un asesor te contactará en menos de 24 horas.
                </p>
              )}
            </form>
          </>
        )}
      </section>
    </div>
  );
}
