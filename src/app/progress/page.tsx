"use client";
import { AppShell } from "@/components/AppShell";
import { Button, Card, PageHeader } from "@/components/ui";
import { usePredatorStore } from "@/lib/store";
import { useState } from "react";
export default function ProgressPage() {
  const progress = usePredatorStore((s) => s.progress);
  const addProgress = usePredatorStore((s) => s.addProgress);
  const [weight, setWeight] = useState("");
  return (
    <AppShell>
      <PageHeader title="Progress" subtitle="Замеры" />
      <Card className="space-y-3">
        <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Вес, кг" className="w-full h-11 px-3 rounded-xl bg-bg border border-border" />
        <Button className="w-full" disabled={!weight} onClick={() => { addProgress({ date: new Date().toISOString(), weight: Number(weight) }); setWeight(""); }}>Сохранить замер</Button>
      </Card>
      <div className="space-y-2 mt-4">
        {progress.slice().reverse().map((p) => (
          <Card key={p.id} className="flex justify-between text-sm"><span>{new Date(p.date).toLocaleDateString("ru-RU")}</span><span>{p.weight ?? "—"} кг</span></Card>
        ))}
        {progress.length === 0 && <p className="text-sm text-muted">Пока нет замеров.</p>}
      </div>
    </AppShell>
  );
}
