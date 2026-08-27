"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ReactNode, ButtonHTMLAttributes } from "react";

export function Card({ children, className, onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return (
    <div onClick={onClick} className={cn("bg-card border border-border rounded-2xl p-4", onClick && "cursor-pointer hover:border-accent/40 transition-colors", className)}>
      {children}
    </div>
  );
}

export function Button({ children, variant = "primary", size = "md", className, disabled, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "outline"; size?: "sm" | "md" | "lg" }) {
  const base = "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all btn-press disabled:opacity-40 disabled:pointer-events-none";
  const variants = {
    primary: "bg-accent text-black hover:bg-[#FF8F5A] shadow-[0_0_20px_rgba(255,107,53,0.25)]",
    secondary: "bg-white/10 text-text hover:bg-white/15",
    ghost: "bg-transparent text-muted hover:text-text hover:bg-white/5",
    outline: "border border-border text-text hover:border-accent/50 hover:bg-accent/5",
  };
  const sizes = { sm: "h-9 px-3 text-sm", md: "h-11 px-5 text-sm", lg: "h-14 px-8 text-base" };
  return <button className={cn(base, variants[variant], sizes[size], className)} disabled={disabled} {...props}>{children}</button>;
}

export function ProgressBar({ value, className, showLabel }: { value: number; className?: string; showLabel?: boolean }) {
  const v = Math.min(100, Math.max(0, value));
  return (
    <div className={cn("w-full", className)}>
      <div className="h-2 bg-border rounded-full overflow-hidden">
        <motion.div className="h-full progress-bar rounded-full" initial={{ width: 0 }} animate={{ width: `${v}%` }} transition={{ duration: 0.6 }} />
      </div>
      {showLabel && <div className="text-xs text-muted mt-1 text-right">{Math.round(v)}%</div>}
    </div>
  );
}

export function Badge({ children, color = "accent", className }: { children: ReactNode; color?: "accent" | "gold" | "teal" | "purple" | "muted"; className?: string }) {
  const colors = {
    accent: "bg-accent/15 text-accent border-accent/30",
    gold: "bg-gold/15 text-gold border-gold/30",
    teal: "bg-accent-3/15 text-accent-3 border-accent-3/30",
    purple: "bg-accent-2/15 text-accent-2 border-accent-2/30",
    muted: "bg-white/5 text-muted border-border",
  };
  return <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border", colors[color], className)}>{children}</span>;
}

export function StatCard({ label, value, icon, sub }: { label: string; value: string | number; icon?: ReactNode; sub?: string }) {
  return (
    <Card className="flex flex-col gap-1 min-h-[88px]">
      <div className="flex items-center justify-between text-muted text-xs uppercase tracking-wider"><span>{label}</span>{icon}</div>
      <div className="text-2xl font-bold tracking-tight">{value}</div>
      {sub && <div className="text-xs text-muted">{sub}</div>}
    </Card>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="text-muted text-sm mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
