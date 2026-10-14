import { connection } from "next/server";
import { AdminHeader } from "@/components/admin/AdminShell";
import PasswordForm from "@/components/admin/PasswordForm";
import { getCurrentUser } from "@/lib/auth";

// El panel depende de la sesión en cada pantalla: no se navega «al instante» (lo indica Next en desarrollo).
export const instant = false;

export const metadata = { title: "Mi cuenta" };

export default async function CuentaPage() {
  await connection();
  const user = await getCurrentUser();
  return (
    <>
      <AdminHeader title="Mi cuenta" description={`${user?.name} · ${user?.email}`} />
      <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 sm:p-6">
        <h2 className="mb-4 text-[17px] font-extrabold text-forest-dark">Cambiar contraseña</h2>
        <PasswordForm />
      </section>
    </>
  );
}
