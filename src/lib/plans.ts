import type { PlanTier } from "@/types";

export const PLANS: { tier: PlanTier; title: string; price: string; features: string[]; gate: string[] }[] = [
  { tier: "FREE", title: "FREE", price: "0 ₽", features: ["Квест и миссии", "Adaptive тренировки", "Check-in", "Базовый AI", "Weekly review"], gate: [] },
  { tier: "PRO", title: "PRO", price: "2 490 ₽/мес", features: ["Всё из FREE", "Глубокий AI-коуч", "Weekly + Monthly reports", "Nutrition plan", "Приоритет адаптаций"], gate: ["monthly_report", "advanced_ai"] },
  { tier: "PREMIUM", title: "PREMIUM", price: "от 5 990 ₽/мес", features: ["Всё из PRO", "Community challenges", "Mentor track (APEX)", "Wearable priority hooks"], gate: ["community_premium", "mentor"] },
  { tier: "COACH", title: "COACH / ELITE", price: "от 15 000 ₽/мес", features: ["Персональное ведение", "Coach dashboard (скоро)", "Разбор техники", "Приоритетная поддержка"], gate: ["coach_dashboard"] },
];

export function canAccess(tier: PlanTier, feature: string): boolean {
  const order: PlanTier[] = ["FREE", "PRO", "PREMIUM", "COACH"];
  const idx = order.indexOf(tier);
  if (feature === "monthly_report" || feature === "advanced_ai") return idx >= 1;
  if (feature === "community_premium" || feature === "mentor") return idx >= 2;
  if (feature === "coach_dashboard") return idx >= 3;
  return true;
}
