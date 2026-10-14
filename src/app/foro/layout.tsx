import type { ReactNode } from "react";
import Footer from "@/components/sections/Footer";
import Navbar from "@/components/sections/Navbar";
import Watermark from "@/components/ui/Watermark";

// Los metadatos van en cada página del foro (cada una con su propia URL canónica).

export default function ForoLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar solid />
      {/* El menú fijo mide 85px: el contenido empieza justo debajo. */}
      <main className="relative isolate min-h-[70vh] overflow-hidden bg-[#f4f6f4] pt-[85px]">
        {/* Marca de agua bajo el encabezado verde (que la tapa) y más abajo en páginas largas. */}
        <Watermark
          tone="mist"
          items={[
            { symbol: "recycle", className: "-left-28 top-[520px] w-[300px] -rotate-12 md:-left-40 md:w-[520px]" },
            { symbol: "cycle", className: "-right-28 top-[1150px] w-[280px] rotate-6 md:-right-40 md:w-[480px]" },
            { symbol: "leaf", className: "-left-24 top-[1900px] w-[260px] -rotate-6 md:-left-36 md:w-[440px]" },
          ]}
        />
        {children}
      </main>
      <Footer />
    </>
  );
}
