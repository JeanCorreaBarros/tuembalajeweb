import { ShieldCheck } from "lucide-react";

const COLORS = ["bg-emerald-600", "bg-teal-600", "bg-lime-600", "bg-amber-600", "bg-sky-600", "bg-rose-600", "bg-violet-600"];

export function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "?";
}

/** Círculo con iniciales; los administradores llevan el color de marca y un escudo. */
export default function Avatar({
  name,
  role = "user",
  size = "md",
}: {
  name: string;
  role?: "user" | "admin";
  size?: "sm" | "md" | "lg";
}) {
  const dim = size === "sm" ? "h-8 w-8 text-[11px]" : size === "lg" ? "h-12 w-12 text-sm" : "h-10 w-10 text-xs";
  const color =
    role === "admin" ? "bg-forest" : COLORS[[...name].reduce((s, c) => s + c.charCodeAt(0), 0) % COLORS.length];

  return (
    <span className={`relative inline-flex shrink-0 items-center justify-center rounded-full font-bold text-white ${dim} ${color}`}>
      {initials(name)}
      {role === "admin" && (
        <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand ring-2 ring-white">
          <ShieldCheck className="h-2.5 w-2.5" />
        </span>
      )}
    </span>
  );
}
