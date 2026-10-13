"use client";

import { LazyMotion } from "framer-motion";
import type { ReactNode } from "react";

const loadFeatures = () => import("./motion-features").then((mod) => mod.default);

/**
 * Carga diferida de Framer Motion: los componentes usan `m.*` (ligero) y el motor de animación
 * se descarga aparte. `strict` avisa si alguien usa `motion.*`, que volvería a meterlo completo.
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      {children}
    </LazyMotion>
  );
}
