import { ImageResponse } from "next/og";
import { LeafMark } from "./brand-mark";

// Vista previa al compartir el enlace (WhatsApp, Facebook, LinkedIn, X). La heredan todas las páginas.
// Va sin foto a propósito: una foto en PNG pesa >1 MB y WhatsApp no muestra vistas previas tan pesadas.
export const alt = "Tu Embalaje — Embalajes en madera a tu medida";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const tags = ["Cajas de madera", "Estibas y pallets", "Huacales", "NIMF 15"];

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          color: "white",
          background: "linear-gradient(135deg, #062a1c 0%, #0b3b28 55%, #0f5236 100%)",
        }}
      >
        {/* Anillos y hoja grande a la derecha, como en los encabezados del sitio. */}
        {[520, 400, 280].map((d, i) => (
          <div
            key={d}
            style={{
              position: "absolute",
              right: 170 - d / 2,
              top: 315 - d / 2,
              width: d,
              height: d,
              borderRadius: 9999,
              border: `2px solid rgba(59,224,90,${0.12 + i * 0.06})`,
            }}
          />
        ))}
        <div style={{ position: "absolute", right: 50, top: 195, display: "flex" }}>
          <LeafMark size={240} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 80px", width: 900 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 30, fontWeight: 700 }}>
            <LeafMark size={40} />
            Tu Embalaje
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: 26, fontSize: 68, fontWeight: 700, lineHeight: 1.04 }}>
            <span>Embalajes en madera</span>
            <span style={{ color: "#3be05a" }}>a tu medida</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 34 }}>
            {tags.map((t) => (
              <div
                key={t}
                style={{
                  display: "flex",
                  padding: "10px 22px",
                  borderRadius: 999,
                  border: "2px solid rgba(255,255,255,0.25)",
                  fontSize: 24,
                  color: "rgba(255,255,255,0.9)",
                }}
              >
                {t}
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 34,
              display: "flex",
              alignSelf: "flex-start",
              padding: "14px 30px",
              borderRadius: 999,
              background: "#1fb34a",
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            Asesoría gratis · Envíos a toda Colombia
          </div>
        </div>
      </div>
    ),
    size,
  );
}
