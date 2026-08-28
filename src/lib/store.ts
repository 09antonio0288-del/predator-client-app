"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  UserProfile, Mission, Workout, ProgressMetric, PhotoEntry, Report,
  DailyCheckIn, Achievement, AIMessage, Goal, AIInsight, BehaviorSnapshot, CoachingStyle,
  NutritionLog, WearableConnection, WearableProvider, RecoverySnapshot,
  NotificationPrefs, AppNotification, SubscriptionState, Challenge, CommunityShare, PlanTier,
} from "@/types";
import { seedChallenges } from "./challenges";
import { trackEvent } from "@/services/analytics";
import { INITIAL_MISSIONS, ACHIEVEMENTS, getRankForXp, getStageForDay, STORAGE_KEY } from "./constants";
import { detectBehaviorState } from "@/services/adaptive";

function todayStr() { return new Date().toISOString().slice(0, 10); }
function daysBetween(a: string, b: string) { return Math.floor((new Date(b).getTime() - new Date(a).getTime()) / 86400000); }

interface PredatorStore {
  profile: UserProfile | null;
  missions: Mission[];
  workouts: Workout[];
  progress: ProgressMetric[];
  photos: PhotoEntry[];
  reports: Report[];
  checkIns: DailyCheckIn[];
  achievements: Achievement[];
  aiMessages: AIMessage[];
  insights: AIInsight[];
  currentWorkout: Workout | null;
  nutritionLogs: NutritionLog[];
  wearables: WearableConnection[];
  recovery: RecoverySnapshot[];
  notificationPrefs: NotificationPrefs;
  notifications: AppNotification[];
  subscription: SubscriptionState;
  challenges: Challenge[];
  shares: CommunityShare[];
  hydrated: boolean;
  completeOnboarding: (data: { name: string; goal: Goal; experience?: UserProfile["experience"]; sessionsPerWeek?: number; availableMinutes?: number; coachingStyle?: CoachingStyle }) => void;
  setGoalOneSentence: (text: string) => void;
  addXp: (amount: number) => void;
  completeMission: (missionId: string) => void;
  completeWorkout: (workout: Workout) => void;
  setCurrentWorkout: (w: Workout | null) => void;
  addProgress: (m: Omit<ProgressMetric, "id">) => void;
  addPhoto: (p: Omit<PhotoEntry, "id">) => void;
  addReport: (r: Omit<Report, "id">) => void;
  toggleCheckIn: (field: keyof Omit<DailyCheckIn, "date">) => void;
  setCheckInScores: (scores: Partial<Pick<DailyCheckIn, "energy" | "sleepHours" | "mood" | "soreness" | "stress" | "readiness">>) => void;
  addAIMessage: (role: "user" | "assistant", content: string) => void;
  addInsight: (insight: Omit<AIInsight, "id" | "createdAt">) => void;
  dismissInsight: (id: string) => void;
  updateStreak: () => void;
  getBehavior: () => BehaviorSnapshot;
  addNutritionLog: (log: Omit<NutritionLog, "id">) => void;
  toggleWearable: (provider: WearableProvider) => void;
  addRecovery: (r: RecoverySnapshot) => void;
  setNotificationPrefs: (p: Partial<NotificationPrefs>) => void;
  addNotification: (n: Omit<AppNotification, "id" | "createdAt" | "read">) => void;
  markNotificationRead: (id: string) => void;
  setPlanTier: (tier: PlanTier) => void;
  joinChallenge: (id: string) => void;
  syncChallengeProgress: () => void;
  shareProgress: (text: string) => void;
  linkTelegram: (chatId: string, username?: string) => void;
  unlinkTelegram: () => void;
  resetAll: () => void;
  setHydrated: (v: boolean) => void;
}

const defaultMissions = (): Mission[] => INITIAL_MISSIONS.map((m) => ({ ...m, completed: false }));

export const usePredatorStore = create<PredatorStore>()(
  persist(
    (set, get) => ({
      profile: null,
      missions: defaultMissions(),
      workouts: [],
      progress: [],
      photos: [],
      reports: [],
      checkIns: [],
      achievements: ACHIEVEMENTS.map((a) => ({ ...a })),
      aiMessages: [],
      insights: [],
      currentWorkout: null,
      nutritionLogs: [],
      wearables: [
        { provider: "manual", connected: true, note: "Self-reported" },
        { provider: "apple_health", connected: false },
        { provider: "health_connect", connected: false },
        { provider: "garmin", connected: false },
        { provider: "whoop", connected: false },
        { provider: "oura", connected: false },
        { provider: "fitbit", connected: false },
        { provider: "strava", connected: false },
      ],
      recovery: [],
      notificationPrefs: { enabled: false, training: true, checkIn: true, streak: true, weeklyReview: true },
      notifications: [],
      subscription: { tier: "FREE", status: "active", source: "local" },
      challenges: seedChallenges(),
      shares: [],
      hydrated: false,
      setHydrated: (v) => set({ hydrated: v }),
      completeOnboarding: (data) => {
        set({
          profile: {
            id: crypto.randomUUID(), name: data.name, goal: data.goal, experience: data.experience,
            sessionsPerWeek: data.sessionsPerWeek, availableMinutes: data.availableMinutes, coachingStyle: data.coachingStyle,
            startDate: new Date().toISOString(), xp: 0, rank: "НОВИЧОК", stage: "ПРОБУЖДЕНИЕ",
            streak: 0, lastActiveDate: null, totalWorkouts: 0, dayInSystem: 1, onboardingCompleted: true,
          },
          missions: defaultMissions(),
        });
        trackEvent("onboarding_completed", { goal: data.goal });
      },
      setGoalOneSentence: (text) => {
        const { profile } = get();
        if (!profile) return;
        set({ profile: { ...profile, goalOneSentence: text } });
        get().completeMission("m1-4");
      },
      addXp: (amount) => {
        const { profile, achievements } = get();
        if (!profile) return;
        const newXp = profile.xp + amount;
        const newRank = getRankForXp(newXp);
        const updatedAch = achievements.map((a) => ({ ...a }));
        if (newRank !== profile.rank) {
          const map: Record<string, string> = { "ОХОТНИК": "a7", "ХИЩНИК": "a8", APEX: "a9" };
          const id = map[newRank];
          const a = id ? updatedAch.find((x) => x.id === id) : undefined;
          if (a && !a.unlockedAt) a.unlockedAt = new Date().toISOString();
        }
        set({ profile: { ...profile, xp: newXp, rank: newRank }, achievements: updatedAch });
      },
      completeMission: (missionId) => {
        const { missions, profile } = get();
        if (!profile) return;
        const mission = missions.find((m) => m.id === missionId);
        if (!mission || mission.completed) return;
        set({ missions: missions.map((m) => m.id === missionId ? { ...m, completed: true, completedAt: new Date().toISOString() } : m) });
        get().addXp(mission.xp);
      },
      completeWorkout: (workout) => {
        const { workouts, profile, achievements } = get();
        if (!profile) return;
        const newTotal = profile.totalWorkouts + 1;
        const updatedAch = achievements.map((a) => ({ ...a }));
        const unlock = (id: string) => { const a = updatedAch.find((x) => x.id === id); if (a && !a.unlockedAt) a.unlockedAt = new Date().toISOString(); };
        if (newTotal === 1) unlock("a1");
        if (newTotal === 10) unlock("a3");
        if (newTotal === 25) unlock("a4");
        if (newTotal === 50) unlock("a5");
        if (newTotal === 100) unlock("a6");
        const day = daysBetween(profile.startDate.slice(0, 10), todayStr()) + 1;
        set({
          workouts: [...workouts, { ...workout, completed: true, completedAt: new Date().toISOString(), xpEarned: 50 }],
          profile: { ...profile, totalWorkouts: newTotal, dayInSystem: Math.max(profile.dayInSystem, day), stage: getStageForDay(day) },
          achievements: updatedAch,
        });
        get().addXp(50);
        get().updateStreak();
        get().toggleCheckIn("workout");
        if (newTotal === 1) get().completeMission("m1-1");
        get().syncChallengeProgress();
        if (newTotal >= 3) get().completeMission("m1-2");
        if (newTotal >= 21) get().completeMission("m2-5");
        if (newTotal >= 50) get().completeMission("m3-5");
        if (newTotal >= 100) get().completeMission("m4-3");
      },
      setCurrentWorkout: (w) => set({ currentWorkout: w }),
      addProgress: (metric) => set((s) => ({ progress: [...s.progress, { ...metric, id: crypto.randomUUID() }] })),
      addPhoto: (photo) => { set((s) => ({ photos: [...s.photos, { ...photo, id: crypto.randomUUID() }] })); if (get().photos.length <= 1) get().completeMission("m1-3"); },
      addReport: (report) => { set((s) => ({ reports: [...s.reports, { ...report, id: crypto.randomUUID() }] })); get().toggleCheckIn("report"); },
      toggleCheckIn: (field) => {
        const today = todayStr();
        const { checkIns } = get();
        const existing = checkIns.find((c) => c.date === today);
        if (existing) set({ checkIns: checkIns.map((c) => c.date === today ? { ...c, [field]: true } : c) });
        else set({ checkIns: [...checkIns, { date: today, workout: field === "workout", nutrition: field === "nutrition", water: field === "water", sleep: field === "sleep", steps: field === "steps", report: field === "report" }] });
        get().updateStreak();
      },
      setCheckInScores: (scores) => {
        const today = todayStr();
        const { checkIns } = get();
        const existing = checkIns.find((c) => c.date === today);
        if (existing) set({ checkIns: checkIns.map((c) => c.date === today ? { ...c, ...scores } : c) });
        else set({ checkIns: [...checkIns, { date: today, workout: false, nutrition: false, water: false, sleep: false, steps: false, report: false, ...scores }] });
      },
      addAIMessage: (role, content) => set((s) => ({ aiMessages: [...s.aiMessages, { id: crypto.randomUUID(), role, content, timestamp: new Date().toISOString() }] })),
      addInsight: (insight) => set((s) => ({ insights: [...s.insights, { ...insight, id: crypto.randomUUID(), createdAt: new Date().toISOString() }] })),
      dismissInsight: (id) => set((s) => ({ insights: s.insights.map((i) => i.id === id ? { ...i, dismissed: true } : i) })),
      updateStreak: () => {
        const { profile, checkIns, achievements } = get();
        if (!profile) return;
        const today = todayStr();
        const sorted = [...checkIns].sort((a, b) => b.date.localeCompare(a.date));
        let streak = 0;
        let expected = today;
        for (const c of sorted) {
          const has = c.workout || c.nutrition || c.water || c.sleep || c.steps || c.report;
          if (!has) continue;
          if (c.date === expected) {
            streak++;
            const d = new Date(expected);
            d.setDate(d.getDate() - 1);
            expected = d.toISOString().slice(0, 10);
          } else if (c.date < expected) break;
        }
        const newStreak = Math.max(streak, profile.streak);
        const updatedAch = achievements.map((a) => ({ ...a }));
        if (newStreak >= 7) {
          const a = updatedAch.find((x) => x.id === "a2");
          if (a && !a.unlockedAt) a.unlockedAt = new Date().toISOString();
        }
        set({ profile: { ...profile, streak: newStreak, lastActiveDate: today }, achievements: updatedAch });
        if (newStreak >= 7) get().completeMission("m1-5");
      },
      addNutritionLog: (log) => {
        set((s) => ({ nutritionLogs: [...s.nutritionLogs, { ...log, id: crypto.randomUUID() }] }));
        get().toggleCheckIn("nutrition");
        if (log.waterLiters >= 2) get().toggleCheckIn("water");
        get().completeMission("m3-3");
      },
      toggleWearable: (provider) => set((s) => ({ wearables: s.wearables.map((w) => w.provider === provider ? { ...w, connected: !w.connected, lastSync: !w.connected ? new Date().toISOString() : w.lastSync } : w) })),
      addRecovery: (r) => set((s) => ({ recovery: [...s.recovery.filter((x) => x.date !== r.date), r] })),
      setNotificationPrefs: (p) => set((s) => ({ notificationPrefs: { ...s.notificationPrefs, ...p } })),
      addNotification: (n) => set((s) => ({ notifications: [{ ...n, id: crypto.randomUUID(), createdAt: new Date().toISOString(), read: false }, ...s.notifications].slice(0, 40) })),
      markNotificationRead: (id) => set((s) => ({ notifications: s.notifications.map((n) => n.id === id ? { ...n, read: true } : n) })),
      setPlanTier: (tier) => set({ subscription: { tier, status: "active", source: "local", renewAt: new Date().toISOString() } }),
      joinChallenge: (id) => set((s) => ({ challenges: s.challenges.map((c) => c.id === id ? { ...c, joined: true } : c) })),
      syncChallengeProgress: () => {
        const { challenges, workouts, checkIns, profile } = get();
        if (!profile) return;
        const last7 = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - i); return d.toISOString().slice(0, 10); });
        const wCount = workouts.filter((w) => w.completed && last7.includes(w.date.slice(0, 10))).length;
        const cCount = checkIns.filter((c) => last7.includes(c.date) && (c.workout || c.nutrition || c.water || c.sleep || c.steps || c.report)).length;
        set({
          challenges: challenges.map((c) => {
            if (!c.joined || c.completed) return c;
            let progress = 0;
            if (c.unit === "workouts") progress = wCount;
            if (c.unit === "checkins") progress = cCount;
            if (c.unit === "days") progress = profile.streak;
            return { ...c, progress: Math.min(progress, c.goalCount), completed: progress >= c.goalCount || c.completed };
          }),
        });
      },
      linkTelegram: (chatId, username) => {
        const { profile } = get();
        if (!profile) return;
        set({ profile: { ...profile, telegramChatId: chatId, telegramUsername: username, telegramLinkedAt: new Date().toISOString() } });
      },
      unlinkTelegram: () => {
        const { profile } = get();
        if (!profile) return;
        set({ profile: { ...profile, telegramChatId: undefined, telegramUsername: undefined, telegramLinkedAt: undefined } });
      },
      shareProgress: (text) => {
        const { profile, shares } = get();
        if (!profile) return;
        set({ shares: [{ id: crypto.randomUUID(), createdAt: new Date().toISOString(), text: text.trim(), rank: profile.rank, stage: profile.stage, workouts: profile.totalWorkouts, streak: profile.streak, visibility: "local" }, ...shares].slice(0, 30) });
        get().completeMission("m3-4");
      },
      getBehavior: () => {
        const { profile, checkIns, workouts, reports } = get();
        const result = detectBehaviorState(profile, checkIns, workouts, reports);
        return { state: result.state, reason: result.reason, recommendation: result.recommendation, updatedAt: new Date().toISOString() };
      },
      resetAll: () => set({
        profile: null, missions: defaultMissions(), workouts: [], progress: [], photos: [], reports: [], checkIns: [],
        achievements: ACHIEVEMENTS.map((a) => ({ ...a })), aiMessages: [], insights: [], currentWorkout: null,
        nutritionLogs: [], recovery: [], notifications: [], subscription: { tier: "FREE", status: "active", source: "local" },
        challenges: seedChallenges(), shares: [],
      }),
    }),
    { name: STORAGE_KEY, onRehydrateStorage: () => (state) => { state?.setHydrated(true); } }
  )
);
