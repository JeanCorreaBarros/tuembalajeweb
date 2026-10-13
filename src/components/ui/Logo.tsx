import { Leaf } from "lucide-react";
import Link from "next/link";

export default function Logo({ size = "md" }: { size?: "md" | "lg" }) {
  const big = size === "lg";
  return (
    <Link href="/" aria-label="Tu Embalaje - inicio" className="inline-block leading-none text-white">
      <span className={`relative block font-extrabold tracking-tight ${big ? "text-[34px]" : "text-[26px]"}`}>
        <span className="block leading-[0.95]">Tu</span>
        <span className="block leading-[0.95]">Embalaje</span>
        <Leaf
          className={`absolute -rotate-12 fill-brand text-brand ${
            big ? "left-[52px] top-[-4px] h-6 w-6" : "left-[38px] top-[-6px] h-5 w-5"
          }`}
        />
      </span>
      <span className="mt-1 block text-[8px] font-semibold uppercase tracking-[0.45em] text-white/80">
        A tu medida
      </span>
    </Link>
  );
}
