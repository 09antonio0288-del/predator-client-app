import type { UserProfile, Workout, BehaviorState, DailyCheckIn, Report } from "@/types";
import { WORKOUT_TEMPLATES, getStageForDay } from "@/lib/constants";

export interface AdaptiveRecommendation {
  templateKey: string;
  title: string;
  reason: string;
  durationEstimate: number;
  intensity: "low" | "moderate" | "high";
}

export function detectBehaviorState(
  profile: UserProfile | null,
  checkIns: DailyCheckIn[],
  workouts: Workout[],
  reports: Report[]
): { state: BehaviorState; reason: string; recommendation: string } {
  if (!profile) {
    return { state: "DISENGAGED", reason: "Нет профиля", recommendation: "Пройди onboarding" };
  }
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().slice(0, 10);
  });
  const activeDays = last7.filter((day) => {
    const c = checkIns.find((x) => x.date === day);
    return c && (c.workout || c.nutrition || c.water || c.sleep || c.steps || c.report);
  }).length;
  const workoutsLast7 = workouts.filter((w) => last7.includes(w.date.slice(0, 10)) && w.completed).length;
  const recentReports = reports.slice(-5);
  const avgRpe = recentReports.length > 0 ? recentReports.reduce((s, r) => s + r.rpe, 0) / recentReports.length : 0;
  const daysSinceActive = profile.lastActiveDate
    ? Math.floor((Date.now() - new Date(profile.lastActiveDate).getTime()) / 86400000)
    : 99;
  if (daysSinceActive >= 5) {
    return { state: "RETURNING", reason: `Нет активности ${daysSinceActive} дн.`, recommendation: "Не компенсируй. Просто сделай сегодняшний шаг — короткую сессию." };
  }
  if (daysSinceActive >= 3 || activeDays <= 1) {
    return { state: "AT_RISK", reason: `Активных дней за неделю: ${activeDays}`, recommendation: "Не пытайся наверстать. Сегодня — короткая 15–20 мин версия." };
  }
  if (avgRpe >= 8.5 && workoutsLast7 >= 3) {
    return { state: "FATIGUED", reason: `Средний RPE ${avgRpe.toFixed(1)} при ${workoutsLast7} тренировках`, recommendation: "Снижаем объём. Сегодня recovery или лёгкая сессия." };
  }
  if (activeDays >= 6 && workoutsLast7 >= 4 && profile.streak >= 7) {
    return { state: "HIGH_PERFORMANCE", reason: `Streak ${profile.streak}, ${workoutsLast7} тренировок/нед`, recommendation: "Держим курс. Можно чуть повысить нагрузку, если самочувствие хорошее." };
  }
  if (activeDays >= 4) {
    return { state: "CONSISTENT", reason: `${activeDays} активных дней из 7`, recommendation: "Система работает. Продолжай по плану." };
  }
  return { state: "DISENGAGED", reason: "Низкая вовлечённость", recommendation: "Вернись к минимальному действию: 15 минут сегодня." };
}

export function getAdaptiveWorkout(profile: UserProfile, behavior: BehaviorState, availableMinutes?: number): AdaptiveRecommendation {
  const stage = getStageForDay(profile.dayInSystem);
  const minutes = availableMinutes || profile.availableMinutes || 40;
  const short = minutes < 30 || behavior === "AT_RISK" || behavior === "RETURNING" || behavior === "FATIGUED";
  let templateKey = "awakening_full";
  let title = "Тренировка пробуждения";
  let intensity: "low" | "moderate" | "high" = "moderate";
  if (stage === "ПРОБУЖДЕНИЕ") {
    templateKey = short ? "awakening_short" : "awakening_full";
    title = short ? "Короткая сессия (Пробуждение)" : "Тренировка пробуждения";
    intensity = short ? "low" : "moderate";
  } else if (stage === "ОХОТА") {
    templateKey = short ? "hunt_short" : "hunt_full";
    title = short ? "Короткая охота" : "Тренировка охоты";
    intensity = short ? "moderate" : "high";
  } else {
    templateKey = short ? "predator_short" : "predator_full";
    title = short ? "Короткая сессия хищника" : "Тренировка хищника";
    intensity = short ? "moderate" : "high";
  }
  if (behavior === "FATIGUED") { intensity = "low"; title = "Recovery-сессия"; }
  const reasonMap: Record<BehaviorState, string> = {
    CONSISTENT: "Ты в системе. Полная версия по этапу.",
    HIGH_PERFORMANCE: "Высокая форма. Можно работать плотно.",
    AT_RISK: "Пропуски. Не наверстываем — делаем короткую версию.",
    RETURNING: "Ты вернулся. Начинаем с минимального шага.",
    FATIGUED: "Высокий RPE в последних сессиях. Снижаем объём.",
    DISENGAGED: "Минимальное действие, чтобы вернуться в ритм.",
  };
  const durationEstimate = short ? 18 : stage === "ПРОБУЖДЕНИЕ" ? 25 : stage === "ОХОТА" ? 40 : 50;
  return { templateKey, title, reason: reasonMap[behavior], durationEstimate, intensity };
}

export function buildWorkoutFromTemplate(templateKey: string, title: string, adaptiveReason: string): Workout {
  const template = WORKOUT_TEMPLATES[templateKey] || WORKOUT_TEMPLATES.awakening_full;
  return {
    id: crypto.randomUUID(),
    title,
    date: new Date().toISOString(),
    completed: false,
    adaptiveReason,
    exercises: template.map((e) => ({ ...e, id: crypto.randomUUID(), completed: false })),
  };
}

export function getNextActionInsight(
  profile: UserProfile,
  behavior: ReturnType<typeof detectBehaviorState>,
  missions: { id: string; title: string; completed: boolean; stage: string; xp: number }[]
): { headline: string; action: string; href: string; xp?: number } {
  const activeMission = missions.find((m) => !m.completed && m.stage === profile.stage) || missions.find((m) => !m.completed);
  if (behavior.state === "RETURNING" || behavior.state === "AT_RISK") {
    return { headline: behavior.recommendation, action: "Короткая тренировка", href: "/training" };
  }
  if (activeMission) {
    const isTraining = activeMission.title.toLowerCase().includes("тренировк");
    return { headline: activeMission.title, action: isTraining ? "Начать тренировку" : "Выполнить", href: isTraining ? "/training" : "/quest", xp: activeMission.xp };
  }
  return { headline: "Сегодня: тренировка по плану", action: "Начать", href: "/training" };
}
