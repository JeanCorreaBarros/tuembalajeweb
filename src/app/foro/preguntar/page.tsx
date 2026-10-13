import { redirect } from "next/navigation";
import { Suspense } from "react";
import ForumHero from "@/components/foro/ForumHero";
import { QuestionForm } from "@/components/foro/forms";
import { getCurrentUser } from "@/lib/auth";
import { CATEGORIES } from "@/lib/forum";

export default function PreguntarPage() {
  return (
    <Suspense fallback={<div className="h-[60vh]" />}>
      <Content />
    </Suspense>
  );
}

async function Content() {
  const user = await getCurrentUser();
  if (!user) redirect("/foro/ingresar?next=/foro/preguntar");

  return (
    <>
      <ForumHero title="Haz una pregunta" text="Sé específico: medidas, peso y destino ayudan a obtener mejores respuestas." />
      <div className="mx-auto max-w-2xl px-5 py-10">
        <QuestionForm categories={CATEGORIES} />
      </div>
    </>
  );
}
