import { RECYCLE_PATHS, RECYCLE_VIEWBOX } from "./icon-mark";

/** Colores del logo oficial. */
const LOGO_GREEN = "#004b23";
const LOGO_LIME = "#9ef01a";

/**
 * Ícono cuadrado del sitio (pestaña del navegador y pantalla de inicio): el símbolo de
 * reciclaje con hojas del logo, en verde lima sobre el verde oscuro de la marca.
 */
export function BrandIcon({ size, radius }: { size: number; radius: number }) {
  const mark = Math.round(size * 0.74);
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: radius,
        background: LOGO_GREEN,
      }}
    >
      <svg width={mark} height={mark} viewBox={RECYCLE_VIEWBOX}>
        {RECYCLE_PATHS.map((d, i) => (
          <path key={i} d={d} fill={LOGO_LIME} />
        ))}
      </svg>
    </div>
  );
}
