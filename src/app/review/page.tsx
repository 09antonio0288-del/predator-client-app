"use client";
import { AppShell } from "@/components/AppShell";
import { Card, PageHeader } from "@/components/ui";
import { usePredatorStore } from "@/lib/store";
export default function ReviewPage() {
  const profile = usePredatorStore((s) => s.profile);
  const workouts = usePredatorStore((s) => s.workouts);
  return (
    <AppShell>
      <PageHeader title="Weekly Review" />
      <Card>
        <p className="text-sm">{profile?.name}, тренировок всего: {workouts.filter((w) => w.completed).length}.</p>
        <p className="text-sm text-muted mt-2">Держи частоту. Не наверстывай пропуски объёмом.</p>
      </Card>
    </AppShell>
  );
}
