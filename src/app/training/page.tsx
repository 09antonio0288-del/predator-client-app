"use client";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Button, Card, PageHeader, Badge } from "@/components/ui";
import { usePredatorStore } from "@/lib/store";
import type { Workout } from "@/types";
import { Check, Play } from "lucide-react";
import { getAdaptiveWorkout, buildWorkoutFromTemplate } from "@/services/adaptive";
import { generatePredatorResponse } from "@/services/ai";

export default function TrainingPage() {
  return (<AppShell><TrainingContent /></AppShell>);
}

function TrainingContent() {
  const profile = usePredatorStore((s) => s.profile)!;
  const completeWorkout = usePredatorStore((s) => s.completeWorkout);
  const addReport = usePredatorStore((s) => s.addReport);
  const getBehavior = usePredatorStore((s) => s.getBehavior);
  const [active, setActive] = useState<Workout | null>(null);
  const [phase, setPhase] = useState<"idle" | "active" | "done">("idle");
  const [rpe, setRpe] = useState(7);
  const behavior = getBehavior();
  const recommendation = useMemo(() => getAdaptiveWorkout(profile, behavior.state, profile.availableMinutes), [profile, behavior.state]);
  const start = () => { setActive(buildWorkoutFromTemplate(recommendation.templateKey, recommendation.title, recommendation.reason)); setPhase("active"); };
  const finish = () => {
    if (!active) return;
    completeWorkout(active);
    addReport({ date: new Date().toISOString(), workoutId: active.id, whatDone: active.title, difficulty: rpe, rpe, energy: 7, mood: 7, aiFeedback: generatePredatorResponse("отчёт", profile, { workout: active }) });
    setPhase("done");
  };
  return (
    <div className="space-y-5">
      <PageHeader title="Training" subtitle={recommendation.reason} />
      <Badge>{behavior.state}</Badge>
      {phase === "idle" && (
        <Card className="space-y-4">
          <h2 className="text-xl font-bold">{recommendation.title}</h2>
          <p className="text-sm text-muted">~{recommendation.durationEstimate} мин · {recommendation.intensity}</p>
          <Button size="lg" className="w-full" onClick={start}><Play className="w-4 h-4" /> Начать</Button>
        </Card>
      )}
      {phase === "active" && active && (
        <div className="space-y-3">
          {active.exercises.map((ex) => (
            <Card key={ex.id} className="flex items-center justify-between">
              <div><div className="font-medium">{ex.name}</div><div className="text-xs text-muted">{ex.sets} × {ex.reps}</div></div>
              <button type="button" onClick={() => setActive({ ...active, exercises: active.exercises.map((e) => e.id === ex.id ? { ...e, completed: !e.completed } : e) })} className={`w-10 h-10 rounded-full border ${ex.completed ? "bg-accent text-black border-accent" : "border-border"}`}><Check className="w-4 h-4 mx-auto" /></button>
            </Card>
          ))}
          <label className="block text-sm text-muted">RPE: {rpe}<input type="range" min={1} max={10} value={rpe} onChange={(e) => setRpe(Number(e.target.value))} className="w-full mt-2" /></label>
          <Button size="lg" className="w-full" onClick={finish}>Закрыть тренировку</Button>
        </div>
      )}
      {phase === "done" && (<Card className="space-y-3"><h2 className="text-xl font-bold">Сессия закрыта. +50 XP</h2><Button className="w-full" onClick={() => { setPhase("idle"); setActive(null); }}>Ещё одна</Button></Card>)}
    </div>
  );
}
