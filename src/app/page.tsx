import type { Metadata } from "next";
import About from "@/components/sections/About";
import Commitment from "@/components/sections/Commitment";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/sections/Footer";
import Hero from "@/components/sections/Hero";
import Industries from "@/components/sections/Industries";
import Navbar from "@/components/sections/Navbar";
import Process from "@/components/sections/Process";
import Products from "@/components/sections/Products";
import Stats from "@/components/sections/Stats";
import Testimonials from "@/components/sections/Testimonials";
import { pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata: Metadata = pageMetadata({ description: SITE.description, path: "/" });

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <About />
        <Products />
        <Process />
        <Commitment />
        <Industries />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
