"use client";
import { AppShell } from "@/components/AppShell";
import { Button, Card, PageHeader } from "@/components/ui";
import { usePredatorStore } from "@/lib/store";
import { getNutritionPlan } from "@/lib/nutrition";
import { useState } from "react";
export default function NutritionPage() {
  const profile = usePredatorStore((s) => s.profile)!;
  const addNutritionLog = usePredatorStore((s) => s.addNutritionLog);
  const plan = getNutritionPlan(profile.goal);
  const [protein, setProtein] = useState(3);
  const [water, setWater] = useState(2);
  return (
    <AppShell>
      <PageHeader title="Nutrition" subtitle={plan.title} />
      <Card className="space-y-2">
        <div>Белок ≈ {plan.proteinG} г · вода {plan.waterL} л</div>
        <ul className="text-sm text-muted list-disc pl-5">{plan.rules.map((r) => <li key={r}>{r}</li>)}</ul>
      </Card>
      <Card className="space-y-3 mt-4">
        <label className="block text-sm">Приёмы с белком: {protein}<input type="range" min={0} max={5} value={protein} onChange={(e) => setProtein(Number(e.target.value))} className="w-full" /></label>
        <label className="block text-sm">Вода, л: {water}<input type="range" min={0} max={5} step={0.5} value={water} onChange={(e) => setWater(Number(e.target.value))} className="w-full" /></label>
        <Button className="w-full" onClick={() => addNutritionLog({ date: new Date().toISOString().slice(0, 10), proteinMeals: protein, waterLiters: water, followedPlan: true })}>Отметить день</Button>
      </Card>
    </AppShell>
  );
}
