import type { Metadata } from "next";
import { Montserrat, Kaushan_Script } from "next/font/google";
import { Suspense } from "react";
import ScrollToTop from "@/components/ui/ScrollToTop";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const script = Kaushan_Script({
  variable: "--font-script",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Tu Embalaje | Embalajes en madera a tu medida",
  description:
    "Diseñamos y fabricamos embalajes en madera sostenibles y de alta resistencia, a tu medida. Cajas, estibas, pallets y embalajes especiales en Colombia.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${montserrat.variable} ${script.variable} antialiased`}>
      <body className="min-h-screen overflow-x-hidden">
        <Suspense fallback={null}>
          <ScrollToTop />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
