"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Settings } from "@/lib/cms/settings";

const Ctx = createContext<Settings | null>(null);

/** Entrega los ajustes generales (editables en /admin) a los componentes del navegador. */
export function SettingsProvider({ value, children }: { value: Settings; children: ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSettings(): Settings {
  const v = useContext(Ctx);
  if (!v) throw new Error("useSettings debe usarse dentro de <SettingsProvider>");
  return v;
}

/** Enlace a WhatsApp de ventas con un mensaje opcional ya escrito. */
export function waLink(number: string, text?: string) {
  return `https://wa.me/${number}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

/** Atajo: enlace a WhatsApp con el número guardado en los ajustes. */
export function useWhatsappLink() {
  const { whatsapp } = useSettings();
  return (text?: string) => waLink(whatsapp, text);
}
