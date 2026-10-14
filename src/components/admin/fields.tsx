"use client";

import { ArrowDown, ArrowUp, ChevronDown, ImageOff, Plus, RefreshCw, Trash2 } from "lucide-react";
import { createElement, useState } from "react";
import { ICONS, iconFor } from "@/lib/cms/icons";
import type { Field, ListField, ScalarField } from "@/lib/cms/schema";
import MediaPicker from "./MediaPicker";

type Obj = Record<string, unknown>;

export const inputCls =
  "w-full rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-base text-ink outline-none transition placeholder:text-ink/35 focus:border-brand focus:ring-4 focus:ring-brand/15 sm:text-[14px]";

function Label({ field, htmlFor, count }: { field: Field; htmlFor?: string; count?: number }) {
  const max = "max" in field && field.type !== "list" ? field.max : undefined;
  return (
    <div className="mb-1.5 flex items-end justify-between gap-3">
      <label htmlFor={htmlFor} className="text-[13px] font-bold text-forest-dark">
        {field.label}
      </label>
      {max && count !== undefined && (
        <span className={`text-[11px] ${count > max ? "font-bold text-amber-600" : "text-ink/40"}`}>
          {count}/{max}
        </span>
      )}
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
    case "textarea":
    case "richtext":
      control = (
        <textarea
          id={id}
          value={str}
          rows={field.rows ?? (field.type === "richtext" ? 8 : 3)}
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
          className={`${inputCls} max-w-[220px]`}
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
      control = <input id={id} type="text" value={str} onChange={(e) => onChange(e.target.value)} className={inputCls} />;
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
                    onClick={() => {
                      if (confirm(`¿Eliminar ${field.itemLabel.toLowerCase()} ${i + 1}?`)) set(items.filter((_, k) => k !== i));
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-ink/50 hover:bg-red-50 hover:text-red-600 disabled:opacity-30"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </span>
              </summary>
              <div className="grid grid-cols-1 gap-4 border-t border-black/5 p-3.5">
                {field.fields.map((sf) => (
                  <ScalarInput
                    key={sf.key}
                    id={`${id}-${i}-${sf.key}`}
                    field={sf}
                    value={it[sf.key]}
                    onChange={(v) => set(items.map((x, k) => (k === i ? { ...x, [sf.key]: v } : x)))}
                  />
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
