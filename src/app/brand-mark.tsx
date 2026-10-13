/** Hoja de la marca (mismo trazo que el ícono Leaf del logo) para íconos e imágenes generadas. */
export function LeafMark({ size, color = "#3be05a" }: { size: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"
        fill={color}
        stroke={color}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

/** Ícono cuadrado: fondo verde bosque con la hoja de la marca. */
export function BrandIcon({ size, radius }: { size: number; radius: number }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: radius,
        background: "linear-gradient(135deg, #0f5236 0%, #062a1c 100%)",
      }}
    >
      <LeafMark size={Math.round(size * 0.62)} />
    </div>
  );
}
