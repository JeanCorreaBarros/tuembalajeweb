import { connection } from "next/server";
import { Lightbulb, Ruler, Search, Tag } from "lucide-react";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import ForumBar from "@/components/foro/ForumBar";
import ForumHero from "@/components/foro/ForumHero";
import { QuestionForm } from "@/components/foro/forms";
import { getCurrentUser } from "@/lib/auth";
import { CATEGORIES } from "@/lib/forum";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Haz una pregunta",
  description: "Publica tu pregunta sobre embalajes en madera y recibe respuesta del equipo de Tu Embalaje.",
  path: "/foro/preguntar",
  noIndex: true,
});

const TIPS = [
  { icon: Search, title: "Busca primero", text: "Quizá tu duda ya tiene respuesta en el foro." },
  { icon: Tag, title: "Título claro", text: "Resume tu pregunta en una frase concreta." },
  { icon: Ruler, title: "Da contexto", text: "Medidas, peso, cantidad, tipo de producto y destino." },
];

export default function PreguntarPage() {
  return (
    <Suspense fallback={<div className="h-[70vh] bg-forest-dark" />}>
      <Content />
    </Suspense>
  );
}

async function Content() {
  await connection();
  const user = await getCurrentUser();
  if (!user) redirect("/foro/ingresar?next=/foro/preguntar");

  return (
    <>
      <ForumHero
        bar={<ForumBar crumbs={[{ label: "Nueva pregunta" }]} />}
        eyebrow="Nueva pregunta"
        title="Haz una pregunta"
        text="Mientras más detalles des, mejores respuestas recibirás."
      />
      <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-8 px-5 py-8 sm:px-8 sm:py-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8">
        <QuestionForm categories={CATEGORIES} />
        <aside className="h-fit rounded-3xl bg-white p-6 shadow-sm">
          <h3 className="flex items-center gap-2 text-[13px] font-extrabold uppercase tracking-wider text-forest-dark">
            <Lightbulb className="h-4 w-4 text-amber-500" /> Consejos
          </h3>
          <ul className="mt-5 space-y-5">
            {TIPS.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <Icon className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-[13px] font-bold text-forest-dark">{title}</span>
                  <span className="block text-[12px] leading-snug text-ink/60">{text}</span>
                </span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </>
  );
}
