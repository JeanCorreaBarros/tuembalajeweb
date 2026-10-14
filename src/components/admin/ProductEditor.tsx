"use client";

import { CheckCircle2, ExternalLink, Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { saveProductAction } from "@/app/admin/actions";
import type { Field } from "@/lib/cms/schema";
import { PRODUCT_CATEGORIES, type Product } from "@/lib/products";
import { FieldInput, inputCls } from "./fields";

type Form = {
  title: string;
  slug: string;
  category: string;
  featured: boolean;
  image: string;
  short: string;
  intro: string;
  bullets: { text: string }[];
  items: { title: string; desc: string }[];
  tags: string;
  specs: { label: string; value: string }[];
};

const toForm = (p?: Product): Form => ({
  title: p?.title ?? "",
  slug: p?.slug ?? "",
  category: p?.category ?? "estibas",
  featured: p?.featured ?? false,
  image: p?.image ?? "/images/producto-estibas.jpg",
  short: p?.short ?? "",
  intro: p?.intro ?? "",
  bullets: (p?.bullets ?? []).map((text) => ({ text })),
  items: p?.items ?? [],
  tags: (p?.tags ?? []).join(", "),
  specs: p?.specs ?? [
    { label: "Tipo", value: "" },
    { label: "Medidas", value: "" },
    { label: "Madera", value: "Reforestada: Pino, Melina, Teca o Acacia, según tu necesidad" },
    { label: "Tratamiento", value: "Térmico con certificación NIMF 15 (sello HT), apto para exportación" },
  ],
});

const fromForm = (f: Form) => ({
  title: f.title,
  slug: f.slug,
  category: f.category,
  featured: f.featured,
  image: f.image,
  short: f.short,
  intro: f.intro,
  bullets: f.bullets.map((b) => b.text),
  items: f.items,
  tags: f.tags.split(",").map((t) => t.trim()),
  specs: f.specs,
});

/* Definición de los campos (se reutilizan los editores de las páginas). */
const F = {
  image: { key: "image", label: "Foto del producto", type: "image" },
  short: { key: "short", label: "Resumen corto", type: "textarea", rows: 2, max: 120, help: "Se muestra en la tarjeta del inicio." },
  intro: { key: "intro", label: "Descripción", type: "textarea", rows: 3, help: "Opcional." },
  bullets: {
    key: "bullets",
    label: "Viñetas destacadas",
    type: "list",
    itemLabel: "Viñeta",
    max: 10,
    help: "Opcional. Frases con un visto bueno verde.",
    fields: [{ key: "text", label: "Texto", type: "textarea", rows: 2 }],
  },
  items: {
    key: "items",
    label: "Tipos o variantes",
    type: "list",
    itemLabel: "Variante",
    max: 10,
    help: "Opcional. Tarjetas con título y descripción (ej. Estibas tipo V, Huacales).",
    fields: [
      { key: "title", label: "Título", type: "text" },
      { key: "desc", label: "Descripción", type: "textarea", rows: 2 },
    ],
  },
  specs: {
    key: "specs",
    label: "Ficha técnica",
    type: "list",
    itemLabel: "Dato",
    max: 30,
    help: "Cada dato se muestra en el modal «Ficha técnica». Nombres como Medidas, Madera, Tratamiento, Ensamble o «Entradas de montacargas» llevan su ícono propio.",
    fields: [
      { key: "label", label: "Nombre", type: "text" },
      { key: "value", label: "Valor", type: "textarea", rows: 2 },
    ],
  },
} satisfies Record<string, Field>;

export default function ProductEditor({ product }: { product?: Product }) {
  const router = useRouter();
  const [form, setForm] = useState<Form>(() => toForm(product));
  const [saved, setSaved] = useState(() => JSON.stringify(toForm(product)));
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();
  const dirty = JSON.stringify(form) !== saved;
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    if (!dirty) return;
    const h = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);

  const save = () => {
    if (!form.title.trim()) {
      setStatus({ ok: false, text: "Escribe el nombre del producto." });
      return;
    }
    start(async () => {
      const r = await saveProductAction(product?.slug ?? null, fromForm(form));
      if (!r.ok) {
        setStatus({ ok: false, text: r.error });
        return;
      }
      const next = { ...form, slug: r.slug ?? form.slug };
      setForm(next);
      setSaved(JSON.stringify(next));
      setStatus({ ok: true, text: r.message ?? "Guardado" });
      // Producto nuevo (o slug cambiado): pasa a la URL de edición definitiva.
      if (r.slug && r.slug !== product?.slug) router.replace(`/admin/productos/${r.slug}`);
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="space-y-6">
        <section className="grid grid-cols-1 gap-5 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 sm:p-6">
          <div>
            <label htmlFor="p-title" className="mb-1.5 block text-[13px] font-bold text-forest-dark">
              Nombre del producto
            </label>
            <input id="p-title" value={form.title} onChange={(e) => set("title", e.target.value)} className={`${inputCls} text-[16px] font-bold`} />
          </div>
          <FieldInput id="p-image" field={F.image} value={form.image} onChange={(v) => set("image", String(v))} />
          <FieldInput id="p-short" field={F.short} value={form.short} onChange={(v) => set("short", String(v))} />
          <FieldInput id="p-intro" field={F.intro} value={form.intro} onChange={(v) => set("intro", String(v))} />
        </section>

        <section className="grid grid-cols-1 gap-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 sm:p-6">
          <FieldInput id="p-specs" field={F.specs} value={form.specs} onChange={(v) => set("specs", v as Form["specs"])} />
          <FieldInput id="p-bullets" field={F.bullets} value={form.bullets} onChange={(v) => set("bullets", v as Form["bullets"])} />
          <FieldInput id="p-items" field={F.items} value={form.items} onChange={(v) => set("items", v as Form["items"])} />
        </section>
      </div>

      {/* Columna lateral: publicación y clasificación */}
      <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
        <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5">
          <button
            type="button"
            onClick={save}
            disabled={pending || (!dirty && !!product)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 text-[13px] font-bold text-white shadow-lg shadow-brand/25 transition hover:bg-brand-dark disabled:opacity-50 disabled:shadow-none"
          >
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} {product ? "Publicar cambios" : "Crear producto"}
          </button>
          {dirty && !pending && <p className="mt-2 text-center text-[12px] font-semibold text-amber-600">Cambios sin guardar</p>}
          {status && (!dirty || !status.ok) && (
            <p role="status" className={`mt-2 flex items-center justify-center gap-1.5 text-center text-[12px] font-semibold ${status.ok ? "text-brand-dark" : "text-red-600"}`}>
              {status.ok && <CheckCircle2 className="h-4 w-4" />} {status.text}
            </p>
          )}
          {product && (
            <a
              href={`/productos#${form.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center justify-center gap-1.5 text-[12px] font-semibold text-ink/55 hover:text-brand-dark"
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden /> Ver en el sitio
            </a>
          )}
        </section>

        <section className="grid grid-cols-1 gap-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5">
          <div>
            <label htmlFor="p-cat" className="mb-1.5 block text-[13px] font-bold text-forest-dark">
              Categoría
            </label>
            <select id="p-cat" value={form.category} onChange={(e) => set("category", e.target.value)} className={inputCls}>
              {PRODUCT_CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-mist px-3.5 py-3">
            <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="mt-0.5 h-4 w-4 accent-[#1fb34a]" />
            <span>
              <span className="block text-[13px] font-bold text-forest-dark">Destacado</span>
              <span className="block text-[12px] text-ink/55">Aparece en el inicio y en el pie de página.</span>
            </span>
          </label>
          <div>
            <label htmlFor="p-tags" className="mb-1.5 block text-[13px] font-bold text-forest-dark">
              Etiquetas
            </label>
            <input id="p-tags" value={form.tags} onChange={(e) => set("tags", e.target.value)} className={inputCls} placeholder="NIMF 15, Exportación" />
            <p className="mt-1.5 text-[12px] text-ink/50">Separadas por comas. También ayudan al buscador.</p>
          </div>
          <div>
            <label htmlFor="p-slug" className="mb-1.5 block text-[13px] font-bold text-forest-dark">
              Identificador en la URL
            </label>
            <input id="p-slug" value={form.slug} onChange={(e) => set("slug", e.target.value)} className={inputCls} placeholder="se-crea-del-nombre" />
            <p className="mt-1.5 text-[12px] text-ink/50">Opcional. Ej: /productos#{form.slug || "nombre-del-producto"}</p>
          </div>
        </section>
      </aside>
    </div>
  );
}
