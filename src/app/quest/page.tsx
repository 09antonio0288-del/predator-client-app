"use client";
import { AppShell } from "@/components/AppShell";
import { Card, PageHeader, Badge, ProgressBar } from "@/components/ui";
import { usePredatorStore } from "@/lib/store";
export default function QuestPage() {
  const missions = usePredatorStore((s) => s.missions);
  const profile = usePredatorStore((s) => s.profile);
  const done = missions.filter((m) => m.completed).length;
  return (
    <AppShell>
      <PageHeader title="Quest" subtitle={`${done}/${missions.length} миссий`} />
      <ProgressBar value={(done / Math.max(missions.length, 1)) * 100} showLabel />
      <div className="space-y-2 mt-4">
        {missions.filter((m) => !profile || m.stage === profile.stage || m.completed).map((m) => (
          <Card key={m.id} className="flex items-center justify-between">
            <div><div className="font-medium">{m.title}</div><div className="text-xs text-muted">{m.stage}</div></div>
            <Badge color={m.completed ? "teal" : "muted"}>{m.completed ? "DONE" : `+${m.xp} XP`}</Badge>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
