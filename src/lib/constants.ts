import type { Mission, Stage, Rank, Goal, Achievement, Exercise } from "@/types";

export const RANKS: { rank: Rank; minXp: number; maxXp: number }[] = [
  { rank: "НОВИЧОК", minXp: 0, maxXp: 599 },
  { rank: "ОХОТНИК", minXp: 600, maxXp: 1499 },
  { rank: "ХИЩНИК", minXp: 1500, maxXp: 2999 },
  { rank: "APEX", minXp: 3000, maxXp: Infinity },
];

export const STAGES: { stage: Stage; days: string; description: string; focus: string }[] = [
  { stage: "ПРОБУЖДЕНИЕ", days: "Дни 1–21", description: "Первые шаги. Вырабатываем привычку.", focus: "Регулярность > интенсивность" },
  { stage: "ОХОТА", days: "Месяц 2–3", description: "Наращиваем нагрузку. Первые результаты.", focus: "Прогрессия и объём" },
  { stage: "ХИЩНИК", days: "Месяц 4–6", description: "Устойчивая система. Сила и рельеф.", focus: "Сила + композиция" },
  { stage: "APEX", days: "Месяц 7–12", description: "Выдающаяся форма. Лидер сообщества.", focus: "Мастерство и влияние" },
];

export const GOALS: Goal[] = [
  "Сбросить лишний вес и обрести форму",
  "Набрать мышечную массу",
  "Улучшить здоровье и энергию",
  "Развить дисциплину и характер",
  "Стать сильнее и функциональнее",
];

export const INITIAL_MISSIONS: Omit<Mission, "completed" | "completedAt">[] = [
  { id: "m1-1", stage: "ПРОБУЖДЕНИЕ", title: "Выполни первую тренировку", xp: 50, order: 1 },
  { id: "m1-2", stage: "ПРОБУЖДЕНИЕ", title: "3 тренировки подряд без пропусков", xp: 100, order: 2 },
  { id: "m1-3", stage: "ПРОБУЖДЕНИЕ", title: "Сделай фото «День 1»", xp: 75, order: 3 },
  { id: "m1-4", stage: "ПРОБУЖДЕНИЕ", title: "Напиши свою цель в одном предложении", xp: 50, order: 4 },
  { id: "m1-5", stage: "ПРОБУЖДЕНИЕ", title: "7 дней активности подряд", xp: 200, order: 5 },
  { id: "m2-1", stage: "ОХОТА", title: "Добавь гантели или резину к тренировке", xp: 100, order: 1 },
  { id: "m2-2", stage: "ОХОТА", title: "4 тренировки за неделю", xp: 150, order: 2 },
  { id: "m2-3", stage: "ОХОТА", title: "Фото прогресса через 30 дней", xp: 100, order: 3 },
  { id: "m2-4", stage: "ОХОТА", title: "Освой 3 новых упражнения", xp: 150, order: 4 },
  { id: "m2-5", stage: "ОХОТА", title: "21 тренировка выполнена", xp: 300, order: 5 },
  { id: "m3-1", stage: "ХИЩНИК", title: "Тренируйся 4 раза в неделю 3 недели подряд", xp: 200, order: 1 },
  { id: "m3-2", stage: "ХИЩНИК", title: "Пройди тест на силовые показатели", xp: 150, order: 2 },
  { id: "m3-3", stage: "ХИЩНИК", title: "Внедри базовый план питания", xp: 150, order: 3 },
  { id: "m3-4", stage: "ХИЩНИК", title: "Поделись прогрессом с сообществом", xp: 100, order: 4 },
  { id: "m3-5", stage: "ХИЩНИК", title: "50 тренировок выполнено", xp: 500, order: 5 },
  { id: "m4-1", stage: "APEX", title: "Помоги новому участнику сообщества", xp: 200, order: 1 },
  { id: "m4-2", stage: "APEX", title: "Фото трансформации «День 1 vs сейчас»", xp: 300, order: 2 },
  { id: "m4-3", stage: "APEX", title: "100 тренировок выполнено", xp: 1000, order: 3 },
  { id: "m4-4", stage: "APEX", title: "Стань наставником", xp: 500, order: 4 },
  { id: "m4-5", stage: "APEX", title: "Поставь цель на следующий год", xp: 200, order: 5 },
];

export const ACHIEVEMENTS: Achievement[] = [
  { id: "a1", title: "Первый шаг", description: "Выполнил первую тренировку", icon: "🔥", xp: 25 },
  { id: "a2", title: "Неделя силы", description: "7 дней streak", icon: "⚡", xp: 50 },
  { id: "a3", title: "Десятка", description: "10 тренировок", icon: "💪", xp: 75 },
  { id: "a4", title: "Четверть сотни", description: "25 тренировок", icon: "🏆", xp: 150 },
  { id: "a5", title: "Полсотни", description: "50 тренировок", icon: "👑", xp: 300 },
  { id: "a6", title: "Сотня", description: "100 тренировок", icon: "🐆", xp: 500 },
  { id: "a7", title: "Охотник", description: "Достиг ранга ОХОТНИК", icon: "🎯", xp: 100 },
  { id: "a8", title: "Хищник", description: "Достиг ранга ХИЩНИК", icon: "🦁", xp: 200 },
  { id: "a9", title: "Apex", description: "Достиг ранга APEX", icon: "🦅", xp: 500 },
];

export const WORKOUT_TEMPLATES: Record<string, Omit<Exercise, "id" | "completed">[]> = {
  awakening_full: [
    { name: "Приседания (собственный вес)", sets: 3, reps: "10-12", rest: 60, targetMuscle: "ноги" },
    { name: "Отжимания (или с колен)", sets: 3, reps: "6-12", rest: 60, targetMuscle: "грудь" },
    { name: "Тяга резины / полотенца", sets: 3, reps: "12-15", rest: 45, targetMuscle: "спина" },
    { name: "Планка", sets: 3, reps: "20-40с", rest: 45, targetMuscle: "кор" },
    { name: "Выпады на месте", sets: 2, reps: "8-10/нога", rest: 60, targetMuscle: "ноги" },
  ],
  awakening_short: [
    { name: "Приседания", sets: 2, reps: "10-12", rest: 45, targetMuscle: "ноги" },
    { name: "Отжимания", sets: 2, reps: "6-10", rest: 45, targetMuscle: "грудь" },
    { name: "Планка", sets: 2, reps: "20-30с", rest: 30, targetMuscle: "кор" },
  ],
  hunt_full: [
    { name: "Приседания / гоблет", sets: 4, reps: "8-12", rest: 90, targetMuscle: "ноги" },
    { name: "Жим / отжимания с нагрузкой", sets: 4, reps: "8-12", rest: 75, targetMuscle: "грудь" },
    { name: "Тяга гантели / резины", sets: 4, reps: "10-12", rest: 75, targetMuscle: "спина" },
    { name: "Жим над головой", sets: 3, reps: "8-12", rest: 60, targetMuscle: "плечи" },
    { name: "Сгибания рук", sets: 3, reps: "10-15", rest: 45, targetMuscle: "бицепс" },
    { name: "Планка / dead bug", sets: 3, reps: "30-45с", rest: 45, targetMuscle: "кор" },
  ],
  hunt_short: [
    { name: "Приседания", sets: 3, reps: "8-10", rest: 60, targetMuscle: "ноги" },
    { name: "Отжимания / жим", sets: 3, reps: "8-10", rest: 60, targetMuscle: "грудь" },
    { name: "Тяга", sets: 3, reps: "10", rest: 60, targetMuscle: "спина" },
    { name: "Планка", sets: 2, reps: "30с", rest: 30, targetMuscle: "кор" },
  ],
  predator_full: [
    { name: "Присед / фронтальный", sets: 4, reps: "6-10", rest: 120, targetMuscle: "ноги" },
    { name: "Жим лёжа / гантели", sets: 4, reps: "6-10", rest: 90, targetMuscle: "грудь" },
    { name: "Тяга штанги / гантели", sets: 4, reps: "6-10", rest: 90, targetMuscle: "спина" },
    { name: "Жим стоя", sets: 3, reps: "8-12", rest: 75, targetMuscle: "плечи" },
    { name: "Румынская тяга", sets: 3, reps: "8-12", rest: 75, targetMuscle: "задняя цепь" },
    { name: "Подъём на бицепс", sets: 3, reps: "10-12", rest: 45, targetMuscle: "бицепс" },
    { name: "Разгибание трицепс", sets: 3, reps: "10-12", rest: 45, targetMuscle: "трицепс" },
  ],
  predator_short: [
    { name: "Присед", sets: 3, reps: "6-8", rest: 90, targetMuscle: "ноги" },
    { name: "Жим", sets: 3, reps: "6-8", rest: 75, targetMuscle: "грудь" },
    { name: "Тяга", sets: 3, reps: "8", rest: 75, targetMuscle: "спина" },
    { name: "Кор", sets: 2, reps: "40с", rest: 40, targetMuscle: "кор" },
  ],
};

export function getRankForXp(xp: number): Rank {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (xp >= RANKS[i].minXp) return RANKS[i].rank;
  }
  return "НОВИЧОК";
}

export function getXpToNextRank(xp: number) {
  const rank = getRankForXp(xp);
  const idx = RANKS.findIndex((r) => r.rank === rank);
  if (idx === RANKS.length - 1) return { current: xp, next: xp, progress: 100 };
  const currentMin = RANKS[idx].minXp;
  const nextMin = RANKS[idx + 1].minXp;
  const progress = Math.min(100, ((xp - currentMin) / (nextMin - currentMin)) * 100);
  return { current: xp - currentMin, next: nextMin - currentMin, progress };
}

export function getStageForDay(day: number): Stage {
  if (day <= 21) return "ПРОБУЖДЕНИЕ";
  if (day <= 90) return "ОХОТА";
  if (day <= 180) return "ХИЩНИК";
  return "APEX";
}

export const STORAGE_KEY = "predator-client-v1";

export const AI_SYSTEM_PROMPT = `Ты — PREDATOR AI, персональный ассистент по трансформации клиента.

Философия: «Тренируй тело. Строй характер. Живи как хищник.»
Регулярность важнее интенсивности. Тело — доказательство дисциплины, а не цель.

Правила ответа:
- Конкретный, короткий (3–7 предложений).
- Основан только на данных пользователя. Не выдумывай цифры.
- Если данных мало — прямо скажи об этом.
- Заканчивай ОДНИМ следующим действием.
- Не ставь медицинских диагнозов. Не назначай лекарства.
- Не используй дешёвую мотивацию. Давай факт → вывод → действие.
- Тон: честный, спокойный, иногда жёсткий, всегда на стороне пользователя.
- Язык: русский, как к взрослому мужчине.`;
