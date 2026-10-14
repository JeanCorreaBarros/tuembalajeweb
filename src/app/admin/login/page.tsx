import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { connection } from "next/server";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import LoginForm from "@/components/admin/LoginForm";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = { title: "Ingresar" };

export default function AdminLoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-forest-dark via-forest to-forest-mid px-4 py-10">
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="relative w-full max-w-[420px]">
        <div className="mb-6 flex justify-center">
          <Image src="/logo/tu-embalaje-blanco.svg" alt="Tu Embalaje" width={140} height={90} className="h-[90px] w-auto" unoptimized priority />
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
          <h1 className="flex items-center gap-2 text-xl font-extrabold text-forest-dark">
            <ShieldCheck className="h-5 w-5 text-brand" aria-hidden /> Panel administrativo
          </h1>
          <p className="mt-1 text-[13px] text-ink/55">Ingresa con tu usuario de administrador.</p>
          <div className="mt-6">
            <Suspense fallback={<div className="h-[260px]" />}>
              <AlreadyIn />
              <LoginForm />
            </Suspense>
          </div>
        </div>
        <p className="mt-6 text-center text-[12px] text-white/60">
          <Link href="/" className="hover:text-lime">
            ← Volver al sitio
          </Link>
        </p>
      </div>
    </div>
  );
}

/** Si ya hay una sesión de administrador, va directo al panel. */
async function AlreadyIn() {
  await connection();
  const user = await getCurrentUser();
  if (user?.role === "admin") redirect("/admin");
  return null;
}
