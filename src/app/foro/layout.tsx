import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import Footer from "@/components/sections/Footer";
import Navbar from "@/components/sections/Navbar";
import ForumBar from "@/components/foro/ForumBar";

export const metadata: Metadata = {
  title: "Foro de preguntas y respuestas | Tu Embalaje",
  description:
    "Pregunta y resuelve dudas sobre estibas, embalajes especiales, exportación y NIMF 15 con la comunidad y el equipo de Tu Embalaje.",
};

export default function ForoLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar solid />
      <main className="min-h-[70vh] bg-mist/60 pt-[72px]">
        <Suspense fallback={<div className="h-[49px] border-b border-black/5 bg-white" />}>
          <ForumBar />
        </Suspense>
        {children}
      </main>
      <Footer />
    </>
  );
}
