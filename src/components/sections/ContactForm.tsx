"use client";

import { m } from "framer-motion";
import {
  ArrowRight,
  Building2,
  ChevronDown,
  Lock,
  Mail,
  MessageCircleMore,
  MessageSquare,
  Package,
  Phone,
  User,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, type ReactNode } from "react";
import { PRODUCTS } from "@/lib/products";
import { SITE } from "@/lib/site";
import { WhatsAppIcon } from "../ui/icons";

// En celular el texto va a 16px: con menos, iOS hace zoom al tocar el campo.
const input =
  "w-full rounded-xl border border-black/10 bg-white py-3.5 pl-11 pr-4 text-base text-ink sm:text-[13px] outline-none transition placeholder:text-ink/45 focus:border-brand focus:ring-2 focus:ring-brand/20";

function Field({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-4 top-[17px] text-ink/50 [&>svg]:h-4 [&>svg]:w-4">{icon}</span>
      {children}
    </div>
  );
}

export default function ContactForm() {
  const params = useSearchParams();
  const initial = params.get("producto") ?? "";
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const product = PRODUCTS.find((p) => p.slug === d.get("producto"))?.title ?? "Sin definir";
    const text = [
      "Hola, quiero solicitar una asesoría.",
      `Nombre: ${d.get("nombre")}`,
      `Empresa: ${d.get("empresa") || "-"}`,
      `Teléfono: ${d.get("telefono")}`,
      `Correo: ${d.get("correo")}`,
      `Producto de interés: ${product}`,
      `Mensaje: ${d.get("mensaje") || "-"}`,
    ].join("\n");
    window.open(`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
    setSent(true);
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl bg-white p-5 shadow-[0_10px_40px_-12px_rgba(11,59,40,0.2)] sm:p-8">
      <div className="flex items-start gap-3 sm:items-center sm:gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand sm:h-12 sm:w-12">
          <MessageCircleMore className="h-6 w-6" />
        </span>
        <div className="min-w-0">
          <h2 className="text-xl font-extrabold leading-tight text-forest-dark sm:text-2xl">
            Solicita tu asesoría <span className="text-brand">GRATIS</span>
          </h2>
          <p className="mt-0.5 text-[12px] text-ink/55">Cuéntanos qué necesitas y te respondemos por WhatsApp.</p>
        </div>
      </div>

      <div className="mt-6 grid gap-3.5 sm:grid-cols-2">
        <Field icon={<User />}>
          <input name="nombre" required placeholder="Nombre completo *" className={input} autoComplete="name" />
        </Field>
        <Field icon={<Building2 />}>
          <input name="empresa" placeholder="Empresa" className={input} autoComplete="organization" />
        </Field>
        <Field icon={<Phone />}>
          <input name="telefono" required type="tel" placeholder="Teléfono *" className={input} autoComplete="tel" />
        </Field>
        <Field icon={<Mail />}>
          <input name="correo" required type="email" placeholder="Correo electrónico *" className={input} autoComplete="email" />
        </Field>
      </div>

      <div className="mt-3.5 space-y-3.5">
        <Field icon={<Package />}>
          <select name="producto" defaultValue={initial} className={`${input} appearance-none`}>
            <option value="">Producto de interés</option>
            {PRODUCTS.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.title}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 top-[17px] h-4 w-4 text-ink/50" />
        </Field>
        <Field icon={<MessageSquare />}>
          <textarea name="mensaje" rows={4} placeholder="Cuéntanos medidas, cantidades, destino…" className={`${input} resize-none`} />
        </Field>
      </div>

      <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-between sm:gap-4">
        <m.button
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          className="inline-flex w-full items-center justify-center gap-3 sm:w-auto rounded-full bg-gradient-to-r from-brand-dark to-brand px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand/30"
        >
          <WhatsAppIcon className="h-5 w-5" /> Enviar por WhatsApp <ArrowRight className="h-4 w-4" />
        </m.button>
        <p className="flex items-center gap-1.5 text-[11px] text-ink/45">
          <Lock className="h-3.5 w-3.5" /> Tus datos están seguros
        </p>
      </div>

      <p className="mt-4 text-center text-[11px] leading-relaxed text-ink/50 sm:text-left">
        Al enviar, aceptas que usemos tus datos para responder tu solicitud, según nuestra{" "}
        <Link href="/politica-de-privacidad" className="font-semibold text-brand-dark underline-offset-2 hover:underline">
          Política de privacidad
        </Link>
        .
      </p>

      {sent && (
        <p role="status" className="mt-4 text-[13px] font-medium text-brand-dark">
          ¡Gracias! Se abrió WhatsApp con tu mensaje listo para enviar.
        </p>
      )}
    </form>
  );
}
