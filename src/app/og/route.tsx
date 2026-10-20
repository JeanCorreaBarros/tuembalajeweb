import { ImageResponse } from "next/og";
import { LOGO_BLANCO_DATA_URI, LOGO_RATIO } from "../logo-data";

// Imagen de marca al compartir el enlace (WhatsApp, Facebook, LinkedIn, X). Es la imagen por defecto:
// en el panel (SEO) se puede elegir otra para todo el sitio o para cada página.
// Va sin foto a propósito: una foto en PNG pesa >1 MB y WhatsApp no muestra vistas previas tan pesadas.
// Es una ruta (y no el archivo opengraph-image) porque ese archivo tendría prioridad sobre la imagen elegida en el panel.
const size = { width: 1200, height: 630 };

const LOGO_W = 330;

const tags = ["Cajas de madera", "Estibas y pallets", "Huacales", "NIMF 15"];

export function GET() {
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
        {/* Anillos y logo oficial a la derecha, como en los encabezados del sitio. */}
        {[520, 400, 280].map((d, i) => (
          <div
            key={d}
            style={{
              position: "absolute",
              right: 250 - d / 2,
              top: 315 - d / 2,
              width: d,
              height: d,
              borderRadius: 9999,
              border: `2px solid rgba(59,224,90,${0.12 + i * 0.06})`,
            }}
          />
        ))}
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse solo admite <img> */}
        <img
          src={LOGO_BLANCO_DATA_URI}
          alt=""
          width={LOGO_W}
          height={Math.round(LOGO_W / LOGO_RATIO)}
          style={{ position: "absolute", right: 250 - LOGO_W / 2, top: 315 - LOGO_W / LOGO_RATIO / 2 }}
        />

        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 70px", width: 780 }}>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 62, fontWeight: 700, lineHeight: 1.04 }}>
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
