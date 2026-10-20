"use client";

import { ArrowDown, ArrowUp, ChevronDown, ImageOff, Plus, RefreshCw, Trash2 } from "lucide-react";
import { createElement, useState } from "react";
import { ICONS, iconFor } from "@/lib/cms/icons";
import type { Field, ListField, ScalarField } from "@/lib/cms/schema";
import { useConfirm } from "./ConfirmDialog";
import MediaPicker from "./MediaPicker";

type Obj = Record<string, unknown>;

export const inputCls =
  "w-full rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-base text-ink outline-none transition placeholder:text-ink/35 focus:border-brand focus:ring-4 focus:ring-brand/15 sm:text-[14px]";

function Label({ field, htmlFor, count }: { field: Field; htmlFor?: string; count?: number }) {
  const max = (field.type === "text" || field.type === "textarea") && field.max ? field.max : undefined;
  const min = (field.type === "text" || field.type === "textarea") && field.min ? field.min : undefined;
  let counter = null;
  if (max && count !== undefined) {
    // Con mínimo y máximo (SEO): verde dentro del rango ideal, ámbar fuera.
    const inRange = count <= max && (!min || count >= min);
    counter = (
      <span
        className={`rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums ${
          min ? (inRange ? "bg-brand/10 text-brand-dark" : count === 0 ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-700") : count > max ? "font-bold text-amber-600" : "text-ink/40"
        }`}
        title={min ? `Ideal: entre ${min} y ${max} caracteres` : `Máximo recomendado: ${max}`}
      >
        {count}
        {min ? ` · ideal ${min}–${max}` : `/${max}`}
      </span>
    );
  }
  return (
    <div className="mb-1.5 flex items-end justify-between gap-3">
      <label htmlFor={htmlFor} className="text-[13px] font-bold text-forest-dark">
        {field.label}
      </label>
      {counter}
    </div>
  );
}

function Help({ text }: { text?: string }) {
  return text ? <p className="mt-1.5 text-[12px] leading-snug text-ink/50">{text}</p> : null;
}

/* ---------- imagen ---------- */

function ImageInput({ value, onChange, optional }: { value: string; onChange: (v: string) => void; optional: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-mist ring-1 ring-black/10 sm:w-48">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element -- vista previa del panel
          <img src={value} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="flex h-full w-full flex-col items-center justify-center gap-1 text-[11px] text-ink/40">
            <ImageOff className="h-5 w-5" aria-hidden /> Sin imagen
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-full bg-forest px-4 py-2 text-[12px] font-bold text-white transition hover:bg-forest-mid"
        >
          <RefreshCw className="h-3.5 w-3.5" aria-hidden /> {value ? "Cambiar imagen" : "Elegir imagen"}
        </button>
        {optional && value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="rounded-full border border-black/10 px-4 py-2 text-[12px] font-semibold text-ink/60 hover:border-red-300 hover:text-red-600"
          >
            Quitar
          </button>
        )}
      </div>
      <MediaPicker
        open={open}
        current={value}
        onClose={() => setOpen(false)}
        onSelect={(url) => {
          onChange(url);
          setOpen(false);
        }}
      />
    </div>
  );
}

/* ---------- ícono ---------- */

function IconInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="inline-flex items-center gap-2.5 rounded-xl border border-black/10 bg-white px-3 py-2 text-[13px] font-semibold text-forest-dark hover:border-brand"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-brand">
          {createElement(iconFor(value), { className: "h-4 w-4", "aria-hidden": true })}
        </span>
        {(ICONS as Record<string, { label: string }>)[value]?.label ?? "Elegir"}
        <ChevronDown className="h-4 w-4 text-ink/40" aria-hidden />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-20 mt-2 grid w-[min(320px,80vw)] grid-cols-6 gap-1.5 rounded-2xl border border-black/10 bg-white p-2.5 shadow-xl">
          {Object.entries(ICONS).map(([key, { icon: Icon, label }]) => (
            <button
              key={key}
              type="button"
              title={label}
              aria-label={label}
              onClick={() => {
                onChange(key);
                setOpen(false);
              }}
              className={`flex aspect-square items-center justify-center rounded-lg transition ${
                key === value ? "bg-brand text-white" : "text-forest-dark hover:bg-brand/10"
              }`}
            >
              <Icon className="h-[18px] w-[18px]" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- campo simple ---------- */

export function ScalarInput({
  field,
  value,
  onChange,
  id,
  optionalImage = false,
}: {
  field: ScalarField;
  value: unknown;
  onChange: (v: unknown) => void;
  id: string;
  optionalImage?: boolean;
}) {
  const str = typeof value === "string" ? value : value == null ? "" : String(value);
  let control;
  switch (field.type) {
    case "toggle": {
      const on = value === true;
      return (
        <label htmlFor={id} className="flex cursor-pointer items-start gap-3.5 rounded-2xl bg-mist/60 px-4 py-3.5 ring-1 ring-black/5">
          <button
            id={id}
            type="button"
            role="switch"
            aria-checked={on}
            onClick={() => onChange(!on)}
            className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition ${on ? "bg-brand" : "bg-ink/20"}`}
          >
            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${on ? "left-[22px]" : "left-0.5"}`} />
          </button>
          <span className="min-w-0">
            <span className="block text-[13px] font-bold text-forest-dark">{field.label}</span>
            {field.help && <span className="mt-0.5 block text-[12px] leading-snug text-ink/50">{field.help}</span>}
          </span>
        </label>
      );
    }
    case "textarea":
    case "richtext":
      control = (
        <textarea
          id={id}
          value={str}
          rows={field.rows ?? (field.type === "richtext" ? 8 : 3)}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputCls} resize-y leading-relaxed ${field.type === "richtext" ? "font-mono text-[13px]" : ""}`}
        />
      );
      break;
    case "number":
      control = (
        <input
          id={id}
          type="number"
          inputMode="decimal"
          step={field.step ?? 1}
          min={field.min}
          value={str}
          onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
          className={inputCls}
        />
      );
      break;
    case "image":
      control = <ImageInput value={str} onChange={onChange} optional={optionalImage} />;
      break;
    case "icon":
      control = <IconInput value={str} onChange={onChange} />;
      break;
    default:
      control = (
        <input id={id} type="text" value={str} placeholder={field.placeholder} onChange={(e) => onChange(e.target.value)} className={inputCls} />
      );
  }
  return (
    <div>
      <Label field={field} htmlFor={field.type === "image" || field.type === "icon" ? undefined : id} count={str.length} />
      {control}
      <Help text={field.help} />
    </div>
  );
}

/* ---------- lista ---------- */

function ListInput({ field, value, onChange, id }: { field: ListField; value: unknown; onChange: (v: unknown) => void; id: string }) {
  const items = Array.isArray(value) ? (value as Obj[]) : [];
  const set = (next: Obj[]) => onChange(next);
  const confirmDlg = useConfirm();
  const empty = () => Object.fromEntries(field.fields.map((f) => [f.key, f.type === "number" ? 0 : f.type === "icon" ? "leaf" : ""]));
  const canAdd = items.length < (field.max ?? 50);
  const canRemove = items.length > (field.min ?? 0);
  // El resumen de cada elemento: su primer texto.
  const summary = (it: Obj) => {
    const f = field.fields.find((x) => x.type === "text" || x.type === "textarea");
    const t = f ? String(it[f.key] ?? "") : "";
    return t.replace(/\s+/g, " ").trim() || `${field.itemLabel} sin texto`;
  };

  return (
    <div>
      <Label field={field} />
      <Help text={field.help} />
      <ol className="mt-2 space-y-2.5">
        {items.map((it, i) => (
          <li key={i} className="rounded-2xl border border-black/10 bg-mist/50">
            <details open={items.length <= 4}>
              <summary className="flex cursor-pointer list-none items-center gap-3 px-3.5 py-2.5 [&::-webkit-details-marker]:hidden">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-forest text-[11px] font-bold text-white">{i + 1}</span>
                <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-forest-dark">{summary(it)}</span>
                <span className="flex shrink-0 items-center gap-1" onClick={(e) => e.preventDefault()}>
                  <button
                    type="button"
                    aria-label="Subir"
                    disabled={i === 0}
                    onClick={() => {
                      const n = [...items];
                      [n[i - 1], n[i]] = [n[i], n[i - 1]];
                      set(n);
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-ink/50 hover:bg-white hover:text-forest disabled:opacity-30"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Bajar"
                    disabled={i === items.length - 1}
                    onClick={() => {
                      const n = [...items];
                      [n[i + 1], n[i]] = [n[i], n[i + 1]];
                      set(n);
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-ink/50 hover:bg-white hover:text-forest disabled:opacity-30"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Eliminar"
                    disabled={!canRemove}
                    onClick={async () => {
                      const ok = await confirmDlg({
                        tone: "warning",
                        title: `¿Quitar ${field.itemLabel.toLowerCase()} ${i + 1}?`,
                        message: "Se quitará de la lista. El cambio se aplica en la web cuando pulses «Publicar cambios»; antes puedes usar «Descartar».",
                        details: [summary(it)],
                        confirmLabel: "Quitar",
                      });
                      if (ok) set(items.filter((_, k) => k !== i));
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-ink/50 hover:bg-red-50 hover:text-red-600 disabled:opacity-30"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </span>
              </summary>
              <div className="grid grid-cols-1 gap-4 border-t border-black/5 bg-white/60 p-3.5 sm:grid-cols-2 sm:p-4">
                {field.fields.map((sf) => (
                  <div key={sf.key} className={`min-w-0 ${sf.half ? "" : "sm:col-span-2"}`}>
                    <ScalarInput
                      id={`${id}-${i}-${sf.key}`}
                      field={sf}
                      value={it[sf.key]}
                      onChange={(v) => set(items.map((x, k) => (k === i ? { ...x, [sf.key]: v } : x)))}
                    />
                  </div>
                ))}
              </div>
            </details>
          </li>
        ))}
      </ol>
      <button
        type="button"
        disabled={!canAdd}
        onClick={() => set([...items, empty()])}
        className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-dashed border-brand/60 px-4 py-2 text-[12px] font-bold text-brand-dark transition hover:bg-brand/5 disabled:opacity-40"
      >
        <Plus className="h-4 w-4" aria-hidden /> Agregar {field.itemLabel.toLowerCase()}
      </button>
    </div>
  );
}

/** Campo de cualquier tipo. `defaults` sirve para saber si una imagen es opcional (vacía por defecto). */
export function FieldInput({ field, value, onChange, id, defaults }: { field: Field; value: unknown; onChange: (v: unknown) => void; id: string; defaults?: Obj }) {
  if (field.type === "list") return <ListInput field={field} value={value} onChange={onChange} id={id} />;
  return <ScalarInput field={field} value={value} onChange={onChange} id={id} optionalImage={field.type === "image" && defaults?.[field.key] === ""} />;
}

/**
 * Formulario de una sección ordenado en bloques (según `group` de cada campo) y en dos columnas
 * en escritorio: los campos `half` van lado a lado; textos largos, listas e imágenes ocupan todo el ancho.
 */
export function FieldGroups({
  fields,
  values,
  defaults,
  idPrefix,
  onChange,
}: {
  fields: Field[];
  values: Obj;
  defaults: Obj;
  idPrefix: string;
  onChange: (key: string, v: unknown) => void;
}) {
  const groups: { name: string; fields: Field[] }[] = [];
  for (const f of fields) {
    const name = f.group ?? "";
    const g = groups.find((x) => x.name === name);
    if (g) g.fields.push(f);
    else groups.push({ name, fields: [f] });
  }
  const titled = groups.length > 1 || groups[0]?.name !== "";

  return (
    <div className="divide-y divide-black/5">
      {groups.map((g, gi) => (
        <fieldset key={g.name || gi} className="min-w-0 px-5 py-5 sm:px-6">
          {titled && (
            <legend className="float-left mb-4 flex w-full items-center gap-2.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-brand-dark">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden />
              {g.name || "Contenido"}
            </legend>
          )}
          <div className="clear-both grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
            {g.fields.map((f) => (
              <div key={f.key} className={`min-w-0 ${f.half && f.type !== "list" && f.type !== "image" ? "" : "sm:col-span-2"}`}>
                <FieldInput
                  id={`${idPrefix}-${f.key}`}
                  field={f}
                  value={values[f.key]}
                  defaults={defaults}
                  onChange={(v) => onChange(f.key, v)}
                />
              </div>
            ))}
          </div>
        </fieldset>
      ))}
    </div>
  );
}
