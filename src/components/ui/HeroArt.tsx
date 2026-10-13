import type { CSSProperties } from "react";
import {
  Award,
  Boxes,
  CircleHelp,
  Clock,
  Handshake,
  Headset,
  Layers,
  Leaf,
  Lightbulb,
  type LucideIcon,
  Mail,
  MapPin,
  MessageCircle,
  MessagesSquare,
  Package,
  PackageCheck,
  Phone,
  Ruler,
  ShieldCheck,
  ThumbsUp,
  TreePine,
  Truck,
  Users,
} from "lucide-react";

export type HeroArtVariant = "productos" | "nosotros" | "contacto" | "foro";

type Piece = {
  icon: LucideIcon;
  /** posición en % dentro de la mitad derecha del hero */
  x: number;
  y: number;
  size: number;
  rotate?: number;
  opacity?: number;
  /** duración del vaivén (s) */
  float?: number;
  /** ícono relleno con un círculo de color */
  accent?: boolean;
};

const PIECES: Record<HeroArtVariant, Piece[]> = {
  // Cajas, estibas y logística
  productos: [
    { icon: Boxes, x: 58, y: 46, size: 300, rotate: -4, opacity: 0.34, float: 7 },
    { icon: Package, x: 86, y: 18, size: 120, rotate: 10, opacity: 0.45, float: 5 },
    { icon: Layers, x: 40, y: 12, size: 90, rotate: -8, opacity: 0.34, float: 6 },
    { icon: Truck, x: 90, y: 72, size: 130, rotate: 0, opacity: 0.36, float: 8 },
    { icon: Ruler, x: 30, y: 74, size: 80, rotate: 20, opacity: 0.34, float: 5.5 },
    { icon: PackageCheck, x: 72, y: 80, size: 70, rotate: -6, opacity: 0.5, float: 6.5, accent: true },
  ],
  // Bosque, equipo y compromiso
  nosotros: [
    { icon: TreePine, x: 62, y: 44, size: 300, rotate: 0, opacity: 0.34, float: 8 },
    { icon: Leaf, x: 88, y: 20, size: 130, rotate: 24, opacity: 0.5, float: 5 },
    { icon: Handshake, x: 38, y: 76, size: 120, rotate: -6, opacity: 0.36, float: 6 },
    { icon: Users, x: 90, y: 74, size: 100, rotate: 0, opacity: 0.36, float: 7 },
    { icon: Award, x: 36, y: 14, size: 80, rotate: -10, opacity: 0.34, float: 5.5 },
    { icon: ShieldCheck, x: 74, y: 82, size: 64, rotate: 8, opacity: 0.5, float: 6, accent: true },
  ],
  // Preguntas, ideas y comunidad
  foro: [
    { icon: MessagesSquare, x: 60, y: 46, size: 300, rotate: -4, opacity: 0.34, float: 7 },
    { icon: CircleHelp, x: 88, y: 20, size: 120, rotate: 12, opacity: 0.45, float: 5 },
    { icon: Lightbulb, x: 38, y: 14, size: 90, rotate: -10, opacity: 0.34, float: 6 },
    { icon: Users, x: 90, y: 74, size: 110, rotate: 0, opacity: 0.36, float: 8 },
    { icon: MessageCircle, x: 34, y: 78, size: 80, rotate: 8, opacity: 0.34, float: 5.5 },
    { icon: ThumbsUp, x: 72, y: 84, size: 64, rotate: -6, opacity: 0.5, float: 6.5, accent: true },
  ],
  // Mensajes, llamadas y ubicación
  contacto: [
    { icon: MessageCircle, x: 60, y: 44, size: 290, rotate: -6, opacity: 0.34, float: 7 },
    { icon: Mail, x: 88, y: 20, size: 120, rotate: 12, opacity: 0.45, float: 5 },
    { icon: Phone, x: 40, y: 14, size: 90, rotate: -14, opacity: 0.34, float: 6 },
    { icon: MapPin, x: 90, y: 74, size: 120, rotate: 0, opacity: 0.38, float: 8 },
    { icon: Headset, x: 34, y: 76, size: 90, rotate: 8, opacity: 0.34, float: 5.5 },
    { icon: Clock, x: 46, y: 90, size: 64, rotate: -8, opacity: 0.5, float: 6.5, accent: true },
  ],
};

/**
 * Fondo decorativo para el hero de cada página: brillos verdes, textura de puntos,
 * anillos y dibujos de línea grandes (alusivos a la sección) que flotan suavemente.
 * Va con `absolute inset-0` dentro de un hero `relative overflow-hidden`.
 * Las animaciones son CSS (fade-in + float en globals.css): no carga JavaScript.
 */
export default function HeroArt({ variant }: { variant: HeroArtVariant }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Brillos de color */}
      <div className="absolute inset-0 [background:radial-gradient(55%_90%_at_88%_20%,#1fb34a47,transparent_62%),radial-gradient(45%_70%_at_8%_100%,#3be05a26,transparent_62%)]" />
      {/* Textura de puntos, más visible hacia la derecha */}
      <div className="absolute inset-0 opacity-[0.09] [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] [mask-image:linear-gradient(to_right,transparent_25%,black_75%)]" />

      {/* Anillos concéntricos */}
      <svg className="absolute -right-24 top-1/2 hidden h-[620px] w-[620px] -translate-y-1/2 text-lime lg:block" viewBox="0 0 620 620" fill="none">
        {[300, 240, 180, 120].map((r, i) => (
          <circle key={r} cx="310" cy="310" r={r} stroke="currentColor" strokeOpacity={0.1 - i * 0.015} strokeWidth="1.5" strokeDasharray={i % 2 ? "4 10" : undefined} />
        ))}
      </svg>

      {/* Dibujos de línea (solo desde pantallas medianas) */}
      <div className="absolute inset-y-0 right-0 hidden w-[58%] md:block">
        {PIECES[variant].map(({ icon: Icon, x, y, size, rotate = 0, opacity = 0.2, float = 6, accent }, i) => (
          // El contenedor aparece (fade-in) y el hijo flota; así cada animación usa su propio transform.
          <div
            key={i}
            className="absolute animate-fade-in text-white"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: size,
              height: size,
              marginLeft: -size / 2,
              marginTop: -size / 2,
              animationDelay: `${200 + i * 120}ms`,
            }}
          >
            <div
              className="h-full w-full animate-float will-change-transform"
              style={{ "--float-rotate": `${rotate}deg`, animationDuration: `${float}s` } as CSSProperties}
            >
            {accent ? (
              <span className="flex h-full w-full items-center justify-center rounded-full border border-lime/50 bg-brand/25 text-lime shadow-[0_0_40px_#1fb34a55]">
                <Icon className="h-1/2 w-1/2" strokeWidth={1.4} />
              </span>
            ) : (
              <Icon className="h-full w-full" strokeWidth={0.9} style={{ opacity }} />
            )}
            </div>
          </div>
        ))}
      </div>

      {/* Desvanece el dibujo hacia el texto para que siga legible */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(6,42,28,0.85)_0%,rgba(6,42,28,0.35)_45%,transparent_70%)]" />
    </div>
  );
}
