"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Dumbbell, TrendingUp, Target, Bot, User, CalendarCheck, Utensils, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/BrandLogo";

const mobileItems = [
  { href: "/", label: "HOME", icon: Home },
  { href: "/training", label: "TRAIN", icon: Dumbbell },
  { href: "/progress", label: "PROGRESS", icon: TrendingUp },
  { href: "/quest", label: "QUEST", icon: Target },
  { href: "/ai", label: "AI", icon: Bot },
  { href: "/profile", label: "YOU", icon: User },
];
const sidebarItems = [
  { href: "/", label: "HOME", icon: Home },
  { href: "/training", label: "TRAINING", icon: Dumbbell },
  { href: "/progress", label: "PROGRESS", icon: TrendingUp },
  { href: "/quest", label: "QUEST", icon: Target },
  { href: "/review", label: "REVIEW", icon: CalendarCheck },
  { href: "/nutrition", label: "NUTRITION", icon: Utensils },
  { href: "/community", label: "TRIBE", icon: Users },
  { href: "/ai", label: "AI", icon: Bot },
  { href: "/profile", label: "PROFILE", icon: User },
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden glass border-t border-border" aria-label="Навигация">
      <div className="flex items-center justify-around h-16 px-1">
        {mobileItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link key={href} href={href} className={cn("flex flex-col items-center justify-center gap-0.5 flex-1 h-full min-w-[44px] text-[10px] font-medium transition-colors", active ? "text-accent" : "text-muted hover:text-text")} aria-current={active ? "page" : undefined}>
              <Icon className={cn("w-5 h-5", active && "drop-shadow-[0_0_6px_rgba(255,107,53,0.6)]")} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex flex-col w-56 shrink-0 border-r border-border bg-card/50 h-dvh sticky top-0">
      <div className="p-5 border-b border-border flex flex-col items-center text-center">
        <BrandLogo size="lg" />
        <div className="text-[10px] uppercase tracking-[0.2em] text-muted mt-2">Система трансформации</div>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {sidebarItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link key={href} href={href} className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors min-h-[44px]", active ? "bg-accent/15 text-accent" : "text-muted hover:text-text hover:bg-white/5")} aria-current={active ? "page" : undefined}>
              <Icon className="w-5 h-5" />{label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-border text-[10px] text-muted">Тренируй тело. Строй характер.</div>
    </aside>
  );
}
