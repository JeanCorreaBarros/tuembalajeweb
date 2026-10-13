import type { Metadata } from "next";
import type { ReactNode } from "react";
import Footer from "@/components/sections/Footer";
import Navbar from "@/components/sections/Navbar";

export const metadata: Metadata = {
  title: "Foro de preguntas y respuestas | Tu Embalaje",
  description:
    "Pregunta y resuelve dudas sobre estibas, embalajes especiales, exportación y NIMF 15 con la comunidad y el equipo de Tu Embalaje.",
};

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
