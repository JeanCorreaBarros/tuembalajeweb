import { redirect } from "next/navigation";
import { Suspense } from "react";
import ForumHero from "@/components/foro/ForumHero";
import { AuthForm } from "@/components/foro/forms";
import { getCurrentUser } from "@/lib/auth";

export default function IngresarPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  return (
    <Suspense fallback={<div className="h-[60vh]" />}>
      <Content searchParams={searchParams} />
    </Suspense>
  );
}

async function Content({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next = "/foro" } = await searchParams;
  if (await getCurrentUser()) redirect("/foro");

  return (
    <>
      <ForumHero title="Ingresar al foro" />
      <div className="mx-auto max-w-md px-5 py-10">
        <AuthForm mode="login" next={next} />
      </div>
    </>
  );
}
