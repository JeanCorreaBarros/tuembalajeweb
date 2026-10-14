import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Genera .next/standalone: un servidor mínimo (server.js) con solo lo necesario. Lo usa el Dockerfile.
  output: "standalone",
  cacheComponents: true,
  serverExternalPackages: ["better-sqlite3", "sharp"],
  // db.ts lee el esquema del foro con fs en tiempo de ejecución: se incluye explícitamente en el build.
  outputFileTracingIncludes: { "/**": ["./src/lib/schema.sql"] },
  poweredByHeader: false,
  images: {
    // AVIF pesa ~40–50 % menos que JPEG con la misma calidad; WebP como respaldo.
    formats: ["image/avif", "image/webp"],
    qualities: [75, 80, 90],
    // Las fotos optimizadas se guardan 7 días en caché. No hay forma de invalidarla: si reemplazas
    // una foto, súbela con otro nombre (p. ej. hero-bg-6.jpg) para que se vea de inmediato.
    minimumCacheTTL: 604800,
  },
  partialPrefetching: true,
  experimental: {
    // Importa solo las funciones usadas de framer-motion (lucide-react ya viene optimizado).
    optimizePackageImports: ["framer-motion"],
    // El panel sube imágenes de hasta 15 MB (una por envío): margen para el formulario.
    serverActions: { bodySizeLimit: "16mb" },
  },
  async headers() {
    return [
      {
        // Fotos originales de /public/images: caché larga en el navegador y en la CDN.
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
