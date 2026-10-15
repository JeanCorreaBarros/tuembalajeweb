"use client";

import { m, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Factory,
  Hammer,
  Recycle,
  Stamp,
  CheckCircle2,
  Leaf,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useWhatsappLink } from "@/components/cms/SettingsProvider";
import { WhatsAppIcon } from "../ui/icons";
import Reveal from "../ui/Reveal";
import Watermark from "../ui/Watermark";

/* ─── Datos de los servicios ─────────────────────────────────────── */
const SERVICES = [
  {
    id: "fabricacion",
    icon: Factory,
    badge: "Producción industrial",
    title: "Fabricación a gran escala",
    tagline: "Producimos las cantidades que tu operación exige",
    desc: "Fabricamos grandes volúmenes de embalajes en madera con tiempos de entrega competitivos. Solicita una asesoría y te ayudamos a planear la cantidad exacta que necesitas.",
    bullets: [
      "Grandes lotes sin perder calidad",
      "Tiempos de entrega planificados",
      "Asesoría de volumen sin costo",
    ],
    gradient: "from-[#1a3d2b] via-[#1e5c38] to-[#2a7a4b]",
    accentColor: "#4ade80",
    metric: { value: "+10 años", label: "de experiencia fabricando" },
    cta: "Cotizar producción",
  },
  {
    id: "recertificacion",
    icon: Stamp,
    badge: "NIMF 15 · Exportación",
    title: "Recertificación de embalajes en madera",
    tagline: "Salva tu inversión y exporta sin barreras",
    desc: "¿Tus embalajes perdieron la certificación NIMF 15? Los recuperamos con tratamiento térmico certificado para que puedas seguir exportando sin contratiempos ni gastos adicionales.",
    bullets: [
      "Tratamiento térmico con sello HT",
      "Certificación válida para exportación",
      "Ahorro vs. comprar embalajes nuevos",
    ],
    gradient: "from-[#1a2d50] via-[#1e3d70] to-[#2a5299]",
    accentColor: "#60a5fa",
    metric: { value: "100%", label: "de cumplimiento NIMF 15" },
    cta: "Recertificar mis embalajes",
  },
  {
    id: "recoleccion",
    icon: Recycle,
    badge: "Sostenibilidad",
    title: "Recolección de madera",
    tagline: "Convierte tus residuos en un activo sostenible",
    desc: "Si tienes madera de estibas, huacales o polines dados de baja, te recogemos el material y te entregamos la certificación de disposición final. Cero preocupaciones, cero costos ocultos.",
    bullets: [
      "Recolección en tu planta",
      "Certificado de disposición final",
      "Contribuye a tus metas ESG",
    ],
    gradient: "from-[#3d2800] via-[#6b4400] to-[#9a6200]",
    accentColor: "#fbbf24",
    metric: { value: "287", label: "árboles preservados desde 2025" },
    cta: "Solicitar recolección",
  },
  {
    id: "reparacion",
    icon: Hammer,
    badge: "Reparación · Ahorro",
    title: "Remanufactura y reparación",
    tagline: "Repara, no reemplaces — ahorra hasta un 60%",
    desc: "Estibas dañadas o con medidas incorrectas no son un problema. Las recibimos, las reparamos o readecuamos exactamente a tus medidas. Un ahorro significativo frente a comprar nuevas.",
    bullets: [
      "Recibimos estibas en cualquier estado",
      "Readecuamos a tus medidas exactas",
      "Ahorro importante vs. compra nueva",
    ],
    gradient: "from-[#2d1a3d] via-[#4a2a5c] to-[#6b3a7a]",
    accentColor: "#c084fc",
    metric: { value: "-60%", label: "en costos vs. compra nueva" },
    cta: "Enviar mis estibas",
  },
];


/* ─── Componente ─────────────────────────────────────────────────── */
export default function ServicesView() {
  const wa = useWhatsappLink();
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="relative isolate overflow-hidden bg-[#f7f8f5]">
      <Watermark
        items={[
          { symbol: "recycle", className: "-left-24 top-[120px] w-[400px] -rotate-12 md:-left-32 md:w-[520px]" },
          { symbol: "cycle", className: "-right-20 top-[500px] w-[350px] rotate-12 md:-right-28 md:w-[480px]" },
          { symbol: "leaf", className: "left-1/2 top-[900px] w-[300px] -translate-x-1/2 rotate-6 md:w-[420px]" },
        ]}
        tone="mist"
      />
      {/* ── TARJETAS DE SERVICIOS ───────────────────────────────── */}
      <div className="mx-auto max-w-[1240px] px-5 py-16 sm:px-8 sm:py-20">
        <Reveal>
          <p className="text-center text-[12px] font-bold uppercase tracking-[0.2em] text-forest/60">
            ¿Qué podemos hacer por ti?
          </p>
          <h3 className="mt-2 text-center text-[26px] font-extrabold text-forest-dark sm:text-3xl">
            Elige el servicio que necesitas
          </h3>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-2">
          {SERVICES.map((srv, i) => {
            const Icon = srv.icon;
            const isOpen = active === srv.id;
            return (
              <Reveal key={srv.id} x={i % 2 === 0 ? -30 : 30} y={0}>
                <m.div
                  layout
                  onClick={() => setActive(isOpen ? null : srv.id)}
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  className="group relative cursor-pointer overflow-hidden rounded-3xl shadow-xl shadow-black/10"
                >
                  {/* Fondo degradado */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${srv.gradient}`} />

                  {/* Decoración */}
                  <div
                    className="absolute -right-8 -top-8 h-40 w-40 rounded-full opacity-10"
                    style={{ background: srv.accentColor }}
                  />
                  <div
                    className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full opacity-5"
                    style={{ background: srv.accentColor }}
                  />

                  {/* Número grande de fondo */}
                  <span className="pointer-events-none absolute right-5 top-4 text-[80px] font-black leading-none text-white/5 select-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className="relative p-7 sm:p-8">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span
                          className="inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest"
                          style={{ background: `${srv.accentColor}25`, color: srv.accentColor }}
                        >
                          {srv.badge}
                        </span>
                        <h4 className="mt-3 text-[22px] font-extrabold leading-snug text-white sm:text-[24px]">
                          {srv.title}
                        </h4>
                        <p className="mt-1 text-[13px] font-semibold" style={{ color: srv.accentColor }}>
                          {srv.tagline}
                        </p>
                      </div>
                      <div
                        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-lg"
                        style={{ background: `${srv.accentColor}20`, border: `1.5px solid ${srv.accentColor}40` }}
                      >
                        <Icon className="h-7 w-7" style={{ color: srv.accentColor }} />
                      </div>
                    </div>

                    {/* Métrica destacada */}
                    <div
                      className="mt-5 inline-flex items-center gap-3 rounded-2xl px-4 py-3"
                      style={{ background: `${srv.accentColor}12` }}
                    >
                      <span className="text-[28px] font-black leading-none" style={{ color: srv.accentColor }}>
                        {srv.metric.value}
                      </span>
                      <span className="text-[12px] leading-tight text-white/60">{srv.metric.label}</span>
                    </div>

                    {/* Descripción + bullets (expandible) */}
                    <AnimatePresence>
                      {isOpen && (
                        <m.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <p className="mt-4 text-[14px] leading-relaxed text-white/70">{srv.desc}</p>
                          <ul className="mt-4 space-y-2">
                            {srv.bullets.map((b) => (
                              <li key={b} className="flex items-start gap-2.5 text-[13px] text-white/80">
                                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" style={{ color: srv.accentColor }} />
                                {b}
                              </li>
                            ))}
                          </ul>
                        </m.div>
                      )}
                    </AnimatePresence>

                    {/* Footer */}
                    <div className="mt-6 flex items-center justify-between gap-3">
                      <a
                        href={wa(`Hola, me interesa el servicio: ${srv.title}.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[12px] font-bold text-white shadow-lg transition hover:scale-105 active:scale-95"
                        style={{ background: srv.accentColor, color: srv.gradient.includes("1a3d") ? "#0f2a1a" : "#fff" }}
                      >
                        <WhatsAppIcon className="h-4 w-4" />
                        {srv.cta}
                      </a>
                      <button
                        type="button"
                        className="text-[12px] font-semibold underline-offset-2 hover:underline"
                        style={{ color: srv.accentColor }}
                      >
                        {isOpen ? "Ver menos ↑" : "Ver más ↓"}
                      </button>
                    </div>
                  </div>
                </m.div>
              </Reveal>
            );
          })}
        </div>
      </div>

      {/* ── BANNER SOSTENIBILIDAD ───────────────────────────────── */}
      <Reveal>
        <div className="mx-auto max-w-[1240px] px-5 pb-16 sm:px-8 sm:pb-20">
          <m.div
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-forest-dark to-forest p-8 sm:p-10"
          >
            {/* Fondo */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-brand/10" />
              <div className="absolute -bottom-10 left-1/3 h-48 w-48 rounded-full bg-white/5" />
            </div>

            <div className="relative flex flex-col items-center gap-6 text-center md:flex-row md:items-center md:gap-10 md:text-left">
              {/* Círculo ícono */}
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-2 border-brand/40 bg-white/10 backdrop-blur">
                <Leaf className="h-10 w-10 text-brand" />
              </div>

              {/* Texto */}
              <div className="flex-1">
                <p className="text-[14px] text-white/70">
                  Nuestra labor de remanufacturación y reparación de estibas ha permitido
                </p>
                <p className="mt-1 text-[48px] font-black leading-none text-brand sm:text-6xl">287 árboles</p>
                <p className="text-[15px] font-semibold text-white/80">
                  preservados desde el año 2025 hasta la actualidad.
                </p>
                <p className="mt-2 text-[13px] text-white/50">
                  Cuando eliges nuestros servicios de reparación, también cuidas el planeta.
                </p>
              </div>

              {/* CTA */}
              <div className="flex flex-col gap-3">
                <a
                  href={wa("Hola, quiero información sobre los servicios de Tu Embalaje.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3.5 text-[13px] font-bold text-white shadow-xl shadow-brand/30 transition hover:scale-105 hover:bg-brand-dark"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  Solicitar servicio
                </a>
                <Link
                  href="/contacto"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3 text-[13px] font-semibold text-white/80 transition hover:border-white/40 hover:text-white"
                >
                  Formulario de contacto <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </m.div>
        </div>
      </Reveal>
    </div>
  );
}
