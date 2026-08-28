"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui";
import { GOALS } from "@/lib/constants";
import type { Goal, CoachingStyle } from "@/types";
import { usePredatorStore } from "@/lib/store";
import { ArrowRight } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [goal, setGoal] = useState<Goal | null>(null);
  const [experience, setExperience] = useState<"beginner" | "intermediate" | "advanced">("beginner");
  const [sessions, setSessions] = useState(3);
  const [minutes, setMinutes] = useState(40);
  const [style, setStyle] = useState<CoachingStyle>("direct");
  const completeOnboarding = usePredatorStore((s) => s.completeOnboarding);
  const router = useRouter();
  const finish = () => {
    if (!name.trim() || !goal) return;
    completeOnboarding({ name: name.trim(), goal, experience, sessionsPerWeek: sessions, availableMinutes: minutes, coachingStyle: style });
    router.replace("/");
  };
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-5 py-10 bg-bg">
      <div className="w-full max-w-md">
        <div className="flex gap-1.5 mb-8 justify-center">
          {[0, 1, 2, 3].map((i) => <div key={i} className={`h-1 flex-1 max-w-12 rounded-full ${i <= step ? "bg-accent" : "bg-border"}`} />)}
        </div>
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="s0" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center space-y-8">
              <div className="flex flex-col items-center">
                <BrandLogo size="hero" priority />
                <div className="text-xs uppercase tracking-[0.3em] text-muted mt-3">Система трансформации</div>
              </div>
              <p className="text-lg leading-relaxed">Ты начинаешь путь, который изменит не только тело — но и то, кем ты являешься.</p>
              <Button size="lg" className="w-full" onClick={() => setStep(1)}>НАЧАТЬ ПУТЬ <ArrowRight className="w-5 h-5" /></Button>
            </motion.div>
          )}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <h2 className="text-2xl font-bold text-center">Как тебя зовут?</h2>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Твоё имя" className="w-full h-14 px-4 rounded-xl bg-card border border-border text-lg text-center outline-none focus:border-accent" maxLength={32} />
              <Button size="lg" className="w-full" disabled={!name.trim()} onClick={() => setStep(2)}>ДАЛЕЕ</Button>
            </motion.div>
          )}
          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              <h2 className="text-2xl font-bold text-center">Главная цель?</h2>
              {GOALS.map((g) => (
                <button key={g} type="button" onClick={() => setGoal(g)} className={`w-full text-left px-4 py-3.5 rounded-xl border ${goal === g ? "border-accent bg-accent/10" : "border-border bg-card text-muted"}`}>{g}</button>
              ))}
              <Button size="lg" className="w-full" disabled={!goal} onClick={() => setStep(3)}>ДАЛЕЕ</Button>
            </motion.div>
          )}
          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              <h2 className="text-2xl font-bold text-center">Контекст</h2>
              <div className="grid grid-cols-3 gap-2">
                {([["beginner", "Новичок"], ["intermediate", "Средний"], ["advanced", "Опытный"]] as const).map(([v, label]) => (
                  <button key={v} type="button" onClick={() => setExperience(v)} className={`py-3 rounded-xl border text-sm ${experience === v ? "border-accent bg-accent/10" : "border-border text-muted"}`}>{label}</button>
                ))}
              </div>
              <label className="block text-xs text-muted">Тренировок в неделю: {sessions}<input type="range" min={2} max={6} value={sessions} onChange={(e) => setSessions(Number(e.target.value))} className="w-full mt-2" /></label>
              <label className="block text-xs text-muted">Минут на сессию: {minutes}<input type="range" min={15} max={75} step={5} value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} className="w-full mt-2" /></label>
              <div className="grid grid-cols-3 gap-2">
                {([["direct", "Прямой"], ["supportive", "Поддержка"], ["analytical", "Аналитик"]] as const).map(([v, label]) => (
                  <button key={v} type="button" onClick={() => setStyle(v)} className={`py-3 rounded-xl border text-sm ${style === v ? "border-accent bg-accent/10" : "border-border text-muted"}`}>{label}</button>
                ))}
              </div>
              <Button size="lg" className="w-full" onClick={finish}>ВОЙТИ В СИСТЕМУ</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
