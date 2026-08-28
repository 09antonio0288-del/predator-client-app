"use client";
import { AppShell } from "@/components/AppShell";
import { Button, Card, PageHeader, Badge } from "@/components/ui";
import { usePredatorStore } from "@/lib/store";
export default function ProfilePage() {
  const profile = usePredatorStore((s) => s.profile);
  const resetAll = usePredatorStore((s) => s.resetAll);
  if (!profile) return null;
  return (
    <AppShell>
      <PageHeader title="Profile" />
      <Card className="space-y-2">
        <div className="text-2xl font-bold">{profile.name}</div>
        <Badge>{profile.rank}</Badge>
        <div className="text-sm text-muted">{profile.goal}</div>
        <div className="text-sm">XP {profile.xp} · streak {profile.streak} · тренировок {profile.totalWorkouts}</div>
      </Card>
      <Button variant="outline" className="w-full mt-6" onClick={() => { if (confirm("Сбросить локальные данные?")) resetAll(); }}>Сбросить прогресс</Button>
    </AppShell>
  );
}
