import type { Metadata } from "next";
import type { ReactNode } from "react";

// El panel nunca debe aparecer en Google.
export const metadata: Metadata = {
  title: { default: "Panel", template: "%s · Panel Tu Embalaje" },
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-[#f3f5f3] text-ink">{children}</div>;
}
