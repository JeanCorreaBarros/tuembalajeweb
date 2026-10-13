import { ImageResponse } from "next/og";
import { BrandIcon } from "./brand-mark";

// Ícono del sitio (pestaña del navegador, resultados de Google y manifiesto). Se genera al compilar.
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(<BrandIcon size={512} radius={112} />, size);
}
