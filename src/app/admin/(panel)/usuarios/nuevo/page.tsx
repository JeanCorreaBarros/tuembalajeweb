import { ArrowLeft } from "lucide-react";
import { connection } from "next/server";
import Link from "next/link";
import { createUserAction } from "@/app/admin/users-actions";
import { AdminHeader } from "@/components/admin/AdminShell";
import UserForm from "@/components/admin/users/UserForm";

// El panel depende de la sesión en cada pantalla: no se navega «al instante» (lo indica Next en desarrollo).
export const instant = false;

export const metadata = { title: "Nuevo usuario" };

export default async function NuevoUsuarioPage() {
  await connection();
  return (
    <div className="max-w-3xl">
      <Link href="/admin/usuarios" className="mb-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink/55 hover:text-forest">
        <ArrowLeft className="h-4 w-4" aria-hidden /> Usuarios
      </Link>
      <AdminHeader
        title="Nuevo usuario"
        description="Crea la cuenta de un administrador del panel o de un miembro del foro."
        help="/admin/ayuda#usuarios"
      />
      <UserForm mode="create" action={createUserAction} />
    </div>
  );
}
