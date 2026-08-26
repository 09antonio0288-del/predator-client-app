"use client";
import { usePredatorStore } from "@/lib/store";
import { MobileNav, Sidebar } from "./Nav";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { BrandLogo } from "@/components/BrandLogo";
export function AppShell({ children }: { children: React.ReactNode }) {
  const profile = usePredatorStore((s) => s.profile);
  const hydrated = usePredatorStore((s) => s.hydrated);
  const router = useRouter();
  useEffect(() => {
    if (hydrated && !profile?.onboardingCompleted) router.replace("/onboarding");
  }, [hydrated, profile, router]);
  if (!hydrated) return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-bg gap-3">
      <BrandLogo size="lg" priority />
      <div className="text-muted text-xs tracking-[0.3em] animate-pulse">PREDATOR</div>
    </div>
  );
  if (!profile?.onboardingCompleted) return null;
  return (
    <div className="flex min-h-dvh">
      <Sidebar />
      <main className="flex-1 min-w-0 pb-20 md:pb-6 overflow-x-hidden">
        <div className="max-w-3xl mx-auto px-4 py-5 md:px-6 md:py-8">{children}</div>
      </main>
      <MobileNav />
    </div>
  );
}
