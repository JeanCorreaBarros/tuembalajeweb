"use client";

import { m } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { whatsappLink, WHATSAPP_ASESORIA } from "@/lib/site";
import { WhatsAppIcon } from "./icons";

type Props = {
  children: ReactNode;
  href?: string;
  variant?: "solid" | "outline";
  whatsapp?: boolean;
  arrow?: boolean;
  size?: "sm" | "md";
  className?: string;
};

const variants = {
  solid: "bg-brand text-white shadow-lg shadow-brand/30 hover:bg-brand-dark",
  outline: "border border-white/70 text-white hover:bg-white/10",
};

/**
 * Botón principal. Con `whatsapp` y sin `href`, abre el WhatsApp de ventas (pestaña nueva)
 * con un mensaje de asesoría ya escrito.
 */
export default function Button({
  children,
  href,
  variant = "solid",
  whatsapp,
  arrow = true,
  size = "md",
  className = "",
}: Props) {
  const toWhatsApp = whatsapp && !href;
  const target = toWhatsApp ? whatsappLink(WHATSAPP_ASESORIA) : (href ?? "/contacto");
  return (
    <m.a
      href={target}
      {...(toWhatsApp ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className={`inline-flex items-center gap-2 rounded-full font-semibold transition-colors ${
        size === "sm" ? "px-4 py-2 text-[11px]" : "px-6 py-3 text-xs"
      } ${variants[variant]} ${className}`}
    >
      {whatsapp && <WhatsAppIcon className="h-4 w-4" />}
      {children}
      {arrow && <ArrowRight className="h-3.5 w-3.5" />}
    </m.a>
  );
}
