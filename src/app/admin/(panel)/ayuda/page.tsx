import { connection } from "next/server";
import { AdminHeader } from "@/components/admin/AdminShell";
import HelpCenter from "@/components/admin/help/HelpCenter";

// El panel depende de la sesión en cada pantalla: no se navega «al instante» (lo indica Next en desarrollo).
export const instant = false;

export const metadata = { title: "Guía de uso" };

export default async function AyudaPage() {
  await connection();
  return (
    <>
      <AdminHeader title="Guía de uso" description="Cómo funciona cada parte del panel y para qué sirve, paso a paso." />
      <HelpCenter />
    </>
  );
}
