import { ImageResponse } from "next/og";
import { BrandIcon } from "./brand-mark";

// Ícono para "Agregar a pantalla de inicio" en iPhone/iPad (iOS redondea las esquinas solo).
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(<BrandIcon size={180} radius={0} />, size);
}
