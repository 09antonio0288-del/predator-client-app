export type Rank = "НОВИЧОК" | "ОХОТНИК" | "ХИЩНИК" | "APEX";
export type Stage = "ПРОБУЖДЕНИЕ" | "ОХОТА" | "ХИЩНИК" | "APEX";
export type Goal =
  | "Сбросить лишний вес и обрести форму"
  | "Набрать мышечную массу"
  | "Улучшить здоровье и энергию"
  | "Развить дисциплину и характер"
  | "Стать сильнее и функциональнее";
export type BehaviorState = "CONSISTENT" | "AT_RISK" | "FATIGUED" | "DISENGAGED" | "RETURNING" | "HIGH_PERFORMANCE";
export type CoachingStyle = "direct" | "supportive" | "analytical";
export interface UserProfile {
  id: string; name: string; goal: Goal; age?: number; heightCm?: number; weightKg?: number;
  experience?: "beginner" | "intermediate" | "advanced"; equipment?: string[];
  sessionsPerWeek?: number; availableMinutes?: number; limitations?: string;
  coachingStyle?: CoachingStyle; startDate: string; xp: number; rank: Rank; stage: Stage;
  streak: number; lastActiveDate: string | null; totalWorkouts: number; dayInSystem: number;
  onboardingCompleted: boolean; goalOneSentence?: string;
  telegramChatId?: string; telegramUsername?: string; telegramLinkedAt?: string;
}
export interface Mission { id: string; stage: Stage; title: string; xp: number; completed: boolean; completedAt?: string; order: number; }
export interface WorkoutSet { id: string; setNumber: number; reps: number; weightKg?: number; rpe?: number; completed: boolean; }
export interface Exercise {
  id: string; name: string; sets: number; reps: string; weight?: number; rpe?: number; rir?: number;
  rest: number; tempo?: string; completed: boolean; notes?: string; targetMuscle?: string; loggedSets?: WorkoutSet[];
}
export interface Workout {
  id: string; title: string; date: string; exercises: Exercise[]; completed: boolean;
  completedAt?: string; durationMinutes?: number; xpEarned?: number; rpe?: number; notes?: string; adaptiveReason?: string;
}
export interface ProgressMetric { id: string; date: string; weight?: number; waist?: number; chest?: number; biceps?: number; thigh?: number; bodyFat?: number; notes?: string; }
export interface PhotoEntry { id: string; date: string; front?: string; side?: string; back?: string; label?: string; }
export interface Report {
  id: string; date: string; workoutId?: string; whatDone: string; difficulty: number; rpe: number;
  energy: number; mood: number; soreness?: number; stress?: number; comment?: string; aiFeedback?: string;
}
export interface DailyCheckIn {
  date: string; workout: boolean; nutrition: boolean; water: boolean; sleep: boolean; steps: boolean; report: boolean;
  energy?: number; sleepHours?: number; mood?: number; soreness?: number; stress?: number; readiness?: number;
}
export interface Achievement { id: string; title: string; description: string; icon: string; unlockedAt?: string; xp: number; }
export interface AIMessage { id: string; role: "user" | "assistant"; content: string; timestamp: string; }
export interface AIInsight {
  id: string; type: "proactive" | "weekly" | "monthly" | "behavior" | "recovery";
  title: string; body: string; actionLabel?: string; actionHref?: string; createdAt: string; dismissed?: boolean;
}
export interface BehaviorSnapshot { state: BehaviorState; reason: string; recommendation: string; updatedAt: string; }
export type WearableProvider = "apple_health" | "health_connect" | "garmin" | "whoop" | "oura" | "fitbit" | "strava" | "manual";
export interface WearableConnection { provider: WearableProvider; connected: boolean; lastSync?: string; note?: string; }
export interface RecoverySnapshot { date: string; source: WearableProvider; sleepHours?: number; restingHr?: number; hrv?: number; readiness?: number; stress?: number; }
export interface NutritionLog { id: string; date: string; proteinMeals: number; waterLiters: number; followedPlan: boolean; notes?: string; }
export type NotificationType = "TRAINING" | "CHECK_IN" | "MISSION" | "STREAK" | "RECOVERY" | "PROGRESS" | "AI_INSIGHT" | "MILESTONE";
export interface NotificationPrefs { enabled: boolean; training: boolean; checkIn: boolean; streak: boolean; weeklyReview: boolean; }
export interface AppNotification { id: string; type: NotificationType; title: string; body: string; href?: string; createdAt: string; read: boolean; }
export type PlanTier = "FREE" | "PRO" | "PREMIUM" | "COACH";
export interface SubscriptionState { tier: PlanTier; status: "active" | "trial" | "cancelled" | "none"; renewAt?: string; source?: "local" | "stripe" | "manual"; }
export interface Challenge {
  id: string; title: string; description: string; goalCount: number; unit: "workouts" | "checkins" | "days";
  startsAt: string; endsAt: string; xpReward: number; joined: boolean; progress: number; completed: boolean;
}
export interface CommunityShare {
  id: string; createdAt: string; text: string; rank: string; stage: string; workouts: number; streak: number; visibility: "local";
}
export interface MonthlyTransformSummary {
  monthKey: string; day1Weight?: number; currentWeight?: number; workouts: number; avgRpe: number | null;
  adherenceDays: number; xpGained: number; stage: string; rank: string; summary: string; focusNext: string;
}
export type AnalyticsEventName =
  | "onboarding_completed" | "first_workout" | "mission_completed" | "report_created" | "photo_uploaded"
  | "ai_message" | "checkin_completed" | "streak_started" | "level_up" | "weekly_review"
  | "subscription_started" | "challenge_joined" | "progress_shared";
export interface AnalyticsEvent { id: string; name: AnalyticsEventName; payload?: Record<string, string | number | boolean>; at: string; }
