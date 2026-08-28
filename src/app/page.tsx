"use client";
import { AppShell } from "@/components/AppShell";
import { Button, Card, ProgressBar, StatCard, Badge } from "@/components/ui";
import { usePredatorStore } from "@/lib/store";
import { getXpToNextRank, STAGES } from "@/lib/constants";
import { getNextActionInsight } from "@/services/adaptive";
import { Flame, Dumbbell, Zap, Calendar, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { BrandLogo } from "@/components/BrandLogo";

export default function HomePage() {
  return (<AppShell><Dashboard /></AppShell>);
}

function Dashboard() {
  const profile = usePredatorStore((s) => s.profile)!;
  const missions = usePredatorStore((s) => s.missions);
  const checkIns = usePredatorStore((s) => s.checkIns);
  const toggleCheckIn = usePredatorStore((s) => s.toggleCheckIn);
  const getBehavior = usePredatorStore((s) => s.getBehavior);
  const router = useRouter();
  const behavior = getBehavior();
  const next = useMemo(() => getNextActionInsight(profile, behavior, missions), [profile, behavior, missions]);
  const xpInfo = getXpToNextRank(profile.xp);
  const today = new Date().toISOString().slice(0, 10);
  const todayCheck = checkIns.find((c) => c.date === today);
  const stageInfo = STAGES.find((s) => s.stage === profile.stage);
  const checkItems = [
    { key: "workout" as const, label: "Тренировка" },
    { key: "nutrition" as const, label: "Питание" },
    { key: "water" as const, label: "Вода" },
    { key: "sleep" as const, label: "Сон" },
    { key: "steps" as const, label: "Шаги" },
    { key: "report" as const, label: "Отчёт" },
  ];
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BrandLogo size="sm" />
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-muted">PREDATOR</div>
            <h1 className="text-xl font-bold">{profile.name}</h1>
          </div>
        </div>
        <Badge color="accent">{profile.rank}</Badge>
      </div>
      <Card className="border-accent/30 bg-gradient-to-br from-card to-accent/5">
        <div className="text-xs uppercase tracking-wider text-muted mb-1">Твой следующий шаг</div>
        <h2 className="text-lg font-semibold mb-3">{next.headline}</h2>
        <Button onClick={() => router.push(next.href)}>{next.action}</Button>
      </Card>
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="XP" value={profile.xp} icon={<Zap className="w-4 h-4" />} sub={`${Math.round(xpInfo.progress)}% до следующего ранга`} />
        <StatCard label="Streak" value={profile.streak} icon={<Flame className="w-4 h-4" />} />
        <StatCard label="Тренировки" value={profile.totalWorkouts} icon={<Dumbbell className="w-4 h-4" />} />
        <StatCard label="День" value={profile.dayInSystem} icon={<Calendar className="w-4 h-4" />} sub={stageInfo?.stage} />
      </div>
      <ProgressBar value={xpInfo.progress} showLabel />
      <Card>
        <div className="text-sm font-semibold mb-3">Check-in сегодня</div>
        <div className="grid grid-cols-3 gap-2">
          {checkItems.map((item) => {
            const on = Boolean(todayCheck?.[item.key]);
            return (
              <button key={item.key} type="button" onClick={() => toggleCheckIn(item.key)} className={`rounded-xl border px-2 py-3 text-xs ${on ? "border-accent bg-accent/15 text-accent" : "border-border text-muted"}`}>
                {on && <CheckCircle2 className="w-4 h-4 mx-auto mb-1" />}{item.label}
              </button>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
