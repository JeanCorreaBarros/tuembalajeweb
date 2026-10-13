"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

/** Imagen que llena su contenedor (padre `relative`). Si falta el archivo muestra un relleno. */
export default function SmartImage({ src, alt, className = "", priority, sizes = "100vw" }: Props) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-forest-mid/70 via-forest to-forest-dark p-2 text-center text-[10px] font-medium tracking-wide text-white/40 ${className}`}
      >
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
      className={`object-cover ${className}`}
      onError={() => setFailed(true)}
    />
  );
}
