import type { ReactNode } from "react";
import Footer from "@/components/sections/Footer";
import Navbar from "@/components/sections/Navbar";

// Los metadatos van en cada página del foro (cada una con su propia URL canónica).

export default function ForoLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar solid />
      {/* El menú fijo mide 85px: el contenido empieza justo debajo. */}
      <main className="min-h-[70vh] bg-[#f4f6f4] pt-[85px]">{children}</main>
      <Footer />
    </>
  );
}
