"use client";
import { AppShell } from "@/components/AppShell";
import { Card, PageHeader } from "@/components/ui";
import { usePredatorStore } from "@/lib/store";
export default function MonthlyPage() {
  const profile = usePredatorStore((s) => s.profile);
  const workouts = usePredatorStore((s) => s.workouts);
  return (
    <AppShell>
      <PageHeader title="Monthly" />
      <Card>
        <p className="text-sm">{profile?.stage} · {profile?.rank}</p>
        <p className="text-sm text-muted mt-2">Тренировок: {workouts.filter((w) => w.completed).length}</p>
      </Card>
    </AppShell>
  );
}
