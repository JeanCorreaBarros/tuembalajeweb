import "server-only";
import { getPageContent } from "./store";

/** Ajustes generales listos para usar (datos de contacto, empresa y pie), editables en /admin. El SEO está en ./seo.ts. */
export async function getSettings() {
  const a = await getPageContent("ajustes");
  const c = a.contacto;
  const phones = c.phones.filter((p) => p.display.trim() || p.tel.trim());
  const emails = c.emails.map((e) => e.email.trim()).filter(Boolean);
  return {
    whatsapp: c.whatsapp.replace(/\D/g, ""),
    phones,
    emails,
    phoneDisplay: phones[0]?.display ?? "",
    phoneTel: phones[0]?.tel ?? "",
    email: emails[0] ?? "",
    location: c.location,
    schedule: c.schedule,
    instagram: { handle: c.instagramHandle, url: c.instagramUrl },
    legalName: a.empresa.legalName,
    nit: a.empresa.nit,
    address: a.empresa.address,
    legalUpdated: a.empresa.legalUpdated,
    footer: a.pie,
  };
}

export type Settings = Awaited<ReturnType<typeof getSettings>>;
