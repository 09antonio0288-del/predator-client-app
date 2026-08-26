import type { Challenge } from "@/types";

export function seedChallenges(): Challenge[] {
  const now = new Date();
  const start = now.toISOString();
  const end = new Date(now.getTime() + 7 * 86400000).toISOString();
  return [
    {
      id: "ch-week-3",
      title: "3 тренировки за 7 дней",
      description: "Минимум системы. Без героизма.",
      goalCount: 3,
      unit: "workouts",
      startsAt: start,
      endsAt: end,
      xpReward: 150,
      joined: false,
      progress: 0,
      completed: false,
    },
    {
      id: "ch-checkin-5",
      title: "5 дней в системе",
      description: "Любой check-in считается касанием.",
      goalCount: 5,
      unit: "checkins",
      startsAt: start,
      endsAt: end,
      xpReward: 100,
      joined: false,
      progress: 0,
      completed: false,
    },
    {
      id: "ch-streak-7",
      title: "Streak 7",
      description: "Неделя без разрыва цепи.",
      goalCount: 7,
      unit: "days",
      startsAt: start,
      endsAt: end,
      xpReward: 200,
      joined: false,
      progress: 0,
      completed: false,
    },
  ];
}
