import Image from "next/image";
import Link from "next/link";

/** Proporción del logo (ancho / alto) según la mesa de trabajo del archivo original. */
const RATIO = 726.3 / 466.41;

const SIZES = {
  sm: "h-[61px]", // menú superior: con py-3 la barra mide 85px (los saltos de sección cuentan con eso)
  md: "h-[64px]", // pie de página y foro
  lg: "h-[84px] lg:h-[96px]", // franja final (CTA)
} as const;

/**
 * Logo oficial de Tu Embalaje (vectorial, en /public/logo).
 * `white` para fondos oscuros (por defecto) y `color` para fondos claros.
 */
export default function Logo({
  size = "md",
  variant = "white",
  priority = false,
}: {
  size?: keyof typeof SIZES;
  variant?: "white" | "color";
  priority?: boolean;
}) {
  const src = variant === "white" ? "/logo/tu-embalaje-blanco.svg" : "/logo/tu-embalaje-color.svg";
  return (
    <Link href="/" aria-label="Tu Embalaje - inicio" className="inline-block shrink-0">
      <Image
        src={src}
        alt="Tu Embalaje - A tu medida"
        width={Math.round(96 * RATIO)}
        height={96}
        priority={priority}
        unoptimized
        className={`${SIZES[size]} w-auto`}
      />
    </Link>
  );
}
