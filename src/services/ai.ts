import type { UserProfile, Report, Workout, BehaviorState } from "@/types";
import { AI_SYSTEM_PROMPT } from "@/lib/constants";

export function generatePredatorResponse(
  userMessage: string,
  profile: UserProfile | null,
  context?: { report?: Report; workout?: Workout; behaviorState?: BehaviorState; streak?: number; totalWorkouts?: number }
): string {
  const name = profile?.name || "хищник";
  const lower = userMessage.toLowerCase();
  const stage = profile?.stage || "ПРОБУЖДЕНИЕ";
  const rank = profile?.rank || "НОВИЧОК";
  if (context?.report) {
    const r = context.report;
    if (r.rpe >= 9) return `${name}, RPE ${r.rpe} — нагрузка на пределе. Следующую сессию не усложняем.\n\nСледующий шаг: отметь check-in и дай телу восстановление.`;
    return `${name}, работа сделана. RPE ${r.rpe}, энергия ${r.energy}/10.\n\nСледующий шаг: отметь check-in и закрой день в системе.`;
  }
  if (context?.workout) return `${name}, тренировка закрыта. +50 XP. Ты в ранге ${rank}, этап «${stage}».\n\nСледующий шаг: сделай короткий отчёт.`;
  if (context?.behaviorState === "AT_RISK" || context?.behaviorState === "RETURNING") {
    return `${name}, сейчас не время «наверстывать». Один короткий шаг сегодня важнее идеального плана.\n\nСледующий шаг: открой Тренировки и сделай короткую версию.`;
  }
  if (lower.includes("тренировк") || lower.includes("упражнен") || lower.includes("что делать")) {
    return `${name}, на этапе «${stage}» главное — выполненная сессия.\n\nСледующий шаг: открой Тренировки → «Начать».`;
  }
  if (lower.includes("питан") || lower.includes("еда") || lower.includes("белок")) {
    return `${name}, белок в каждом приёме, вода 2+ л.\n\nСледующий шаг: отметь «Питание» в check-in.`;
  }
  if (lower.includes("лень") || lower.includes("мотивац") || lower.includes("не хочу")) {
    return `${name}, дисциплина — это действие без настроения. Streak ${context?.streak ?? profile?.streak ?? 0}.\n\nСледующий шаг: 10–15 минут движения сейчас.`;
  }
  return `${name}, главный вопрос: «Что сделать прямо сейчас?» Ранг ${rank}, день ${profile?.dayInSystem ?? 1}.\n\nСледующий шаг: открой Home и выполни текущую миссию.`;
}

export async function callPredatorAI(messages: { role: string; content: string }[], profile: UserProfile | null, extra?: { behaviorState?: BehaviorState }): Promise<string> {
  try {
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, profile, behaviorState: extra?.behaviorState }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.reply) return data.reply;
    }
  } catch {}
  const last = messages[messages.length - 1]?.content || "";
  return generatePredatorResponse(last, profile, { behaviorState: extra?.behaviorState, streak: profile?.streak, totalWorkouts: profile?.totalWorkouts });
}

export { AI_SYSTEM_PROMPT };
