import { connection } from "next/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import AuthShell from "@/components/foro/AuthShell";
import { AuthForm } from "@/components/foro/forms";
import { getCurrentUser } from "@/lib/auth";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Ingresar al foro",
  description: "Ingresa a tu cuenta para preguntar y responder en el foro de Tu Embalaje.",
  path: "/foro/ingresar",
  noIndex: true,
});

export default function IngresarPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
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
    <AuthShell title="Bienvenido de nuevo" subtitle="Ingresa para preguntar y responder en el foro.">
      <AuthForm mode="login" next={next} />
    </AuthShell>
  );
}
