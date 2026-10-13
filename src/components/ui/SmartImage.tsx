"use client";

import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type Props = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  /** si falta el archivo, no dibuja nada (en vez del recuadro de relleno) */
  silent?: boolean;
};

/** Imagen que llena su contenedor (padre `relative`). Si falta el archivo muestra un relleno. */
export default function SmartImage({ src, alt, className = "", priority, sizes = "100vw", quality, silent }: Props) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    if (silent) return null;
    return (
      <div
        role="img"
        aria-label={alt}
        className={`absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-[#8a978f]/10 p-2 text-center text-[10px] font-medium tracking-wide text-[#8a978f] ${className}`}
      >
        <ImageIcon className="h-5 w-5 opacity-70" />
        {src.replace("/images/", "")}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      quality={quality}
      className={`object-cover ${className}`}
      onError={() => setFailed(true)}
    />
  );
}
