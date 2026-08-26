"use client";
import { cn } from "@/lib/utils";
type Size = "sm" | "md" | "lg" | "hero";
const dims: Record<Size, { box: string; img: number }> = {
  sm: { box: "w-8 h-8", img: 32 },
  md: { box: "w-12 h-12", img: 48 },
  lg: { box: "w-20 h-20", img: 80 },
  hero: { box: "w-44 h-44 md:w-56 md:h-56", img: 224 },
};
export function BrandLogo({ size = "md", showWordmark = false, className }: { size?: Size; showWordmark?: boolean; className?: string; priority?: boolean }) {
  const d = dims[size];
  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className={cn("relative shrink-0", d.box)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="PREDATOR" width={d.img} height={d.img} className="w-full h-full object-contain drop-shadow-[0_0_18px_rgba(255,40,20,0.35)]" />
      </div>
      {showWordmark && size !== "hero" && (
        <div className="text-[10px] uppercase tracking-[0.28em] text-muted mt-1">PREDATOR</div>
      )}
    </div>
  );
}
