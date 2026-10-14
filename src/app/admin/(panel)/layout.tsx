import { connection } from "next/server";
import { redirect } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { getCurrentUser } from "@/lib/auth";

// El panel depende de la sesión: no se navega «al instante» (cada pantalla también lo declara).
export const instant = false;

/**
 * Todas las pantallas del panel (excepto /admin/login) exigen un administrador con sesión.
 * src/proxy.ts ya envía al login a quien no tiene cookie de sesión; aquí se valida la sesión y el rol.
 */
export default function PanelLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen animate-pulse bg-[#f3f5f3]" />}>
      <Guard>{children}</Guard>
    </Suspense>
  );
}

async function Guard({ children }: { children: ReactNode }) {
  await connection();
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") redirect("/admin/login");
  return <AdminShell user={{ name: user.name, email: user.email }}>{children}</AdminShell>;
}
