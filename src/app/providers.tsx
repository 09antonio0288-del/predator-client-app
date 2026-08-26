"use client";
import { useEffect } from "react";
import { usePredatorStore } from "@/lib/store";
export function Providers({ children }: { children: React.ReactNode }) {
  const setHydrated = usePredatorStore((s) => s.setHydrated);
  useEffect(() => { setHydrated(true); }, [setHydrated]);
  return <>{children}</>;
}
