import { connection } from "next/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import AuthShell from "@/components/foro/AuthShell";
import { AuthForm } from "@/components/foro/forms";
import { getCurrentUser } from "@/lib/auth";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Crear cuenta en el foro",
  description: "Únete gratis a la comunidad de Tu Embalaje para resolver dudas sobre embalajes en madera.",
  path: "/foro/registro",
  noIndex: true,
});

export default function RegistroPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  return (
    <Suspense fallback={<div className="h-[70vh]" />}>
      <Content searchParams={searchParams} />
    </Suspense>
  );
}

async function Content({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  await connection();
  const { next = "/foro" } = await searchParams;
  if (await getCurrentUser()) redirect("/foro");

  return (
    <AuthShell title="Crea tu cuenta" subtitle="Únete gratis a la comunidad de Tu Embalaje.">
      <AuthForm mode="register" next={next} />
    </AuthShell>
  );
}
