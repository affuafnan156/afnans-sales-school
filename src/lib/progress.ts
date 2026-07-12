// Client-side progress store. localStorage-backed. No server persistence.
import { useEffect, useState, useCallback } from "react";

export type Tier = "none" | "free" | "pro";
export type AgeGroup = "under18" | "18-24" | "25-34" | "35-49" | "50+";
export type Goal =
  | "get_first_sales_job"
  | "close_more_deals"
  | "start_a_business"
  | "grow_my_business"
  | "career_switch"
  | "learn_basics";

export type SkillScores = {
  confidence: number; // 0-100
  closing: number;
  objections: number;
  discovery: number;
};

export type Progress = {
  xp: number;
  level: number;
  streakDays: number;
  lastActiveDate: string | null; // ISO date
  completedDays: number[]; // 1..30
  badges: string[];
  skills: SkillScores;
  unlockedTier: Tier; // set to "free" or "pro" when they email us
  ageGroup: AgeGroup | null;
  goal: Goal | null;
  name: string | null;
  email: string | null;
  pendingEnrollment: boolean;
};

const KEY = "afnan_progress_v1";

const DEFAULT: Progress = {
  xp: 0,
  level: 1,
  streakDays: 0,
  lastActiveDate: null,
  completedDays: [],
  badges: [],
  skills: { confidence: 20, closing: 15, objections: 20, discovery: 25 },
  unlockedTier: "none",
  ageGroup: null,
  goal: null,
  name: null,
  email: null,
  pendingEnrollment: false,
};

function read(): Progress {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT;
    return { ...DEFAULT, ...(JSON.parse(raw) as Progress) };
  } catch {
    return DEFAULT;
  }
}

function write(p: Progress) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(p));
  window.dispatchEvent(new CustomEvent("afnan:progress"));
}

export function xpForLevel(level: number) {
  return level * 100;
}

export function levelFromXp(xp: number) {
  let lvl = 1;
  let need = 0;
  while (xp >= need + xpForLevel(lvl)) {
    need += xpForLevel(lvl);
    lvl += 1;
  }
  return lvl;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string) {
  const ms = new Date(b).getTime() - new Date(a).getTime();
  return Math.round(ms / 86400000);
}

export function useProgress() {
  const [p, setP] = useState<Progress>(DEFAULT);

  useEffect(() => {
    setP(read());
    const on = () => setP(read());
    window.addEventListener("afnan:progress", on);
    window.addEventListener("storage", on);
    return () => {
      window.removeEventListener("afnan:progress", on);
      window.removeEventListener("storage", on);
    };
  }, []);

  const update = useCallback((patch: Partial<Progress> | ((prev: Progress) => Partial<Progress>)) => {
    const prev = read();
    const next: Progress = {
      ...prev,
      ...(typeof patch === "function" ? patch(prev) : patch),
    };
    next.level = levelFromXp(next.xp);
    write(next);
  }, []);

  const addXp = useCallback((amount: number, reason?: string) => {
    const prev = read();
    const today = todayISO();
    let streak = prev.streakDays;
    if (prev.lastActiveDate !== today) {
      const diff = prev.lastActiveDate ? daysBetween(prev.lastActiveDate, today) : 999;
      streak = diff === 1 ? prev.streakDays + 1 : 1;
    }
    const next: Progress = {
      ...prev,
      xp: prev.xp + amount,
      lastActiveDate: today,
      streakDays: streak,
    };
    next.level = levelFromXp(next.xp);
    // Streak badges
    if (streak >= 7 && !next.badges.includes("streak_7")) next.badges.push("streak_7");
    if (streak >= 30 && !next.badges.includes("streak_30")) next.badges.push("streak_30");
    if (next.level >= 5 && !next.badges.includes("level_5")) next.badges.push("level_5");
    if (next.level >= 10 && !next.badges.includes("level_10")) next.badges.push("level_10");
    write(next);
    if (reason && typeof window !== "undefined") {
      // lightweight console log for feedback
      console.log(`[XP] +${amount} — ${reason}`);
    }
  }, []);

  const bumpSkill = useCallback((skill: keyof SkillScores, delta: number) => {
    const prev = read();
    const val = Math.max(0, Math.min(100, prev.skills[skill] + delta));
    write({ ...prev, skills: { ...prev.skills, [skill]: val } });
  }, []);

  const completeDay = useCallback((day: number) => {
    const prev = read();
    if (prev.completedDays.includes(day)) return;
    write({ ...prev, completedDays: [...prev.completedDays, day] });
    addXp(25, `Day ${day} complete`);
  }, [addXp]);

  return { p, update, addXp, bumpSkill, completeDay };
}

// XP thresholds to unlock free-mode info tiles
export const XP_UNLOCKS: { xp: number; label: string; content: string }[] = [
  { xp: 0, label: "The 3 Pillars", content: "Sidq (truth), Amanah (trust), Ihsan (excellence) — every deal passes all three." },
  { xp: 50, label: "The One-Line Opener", content: "'Hey — quick one, do you handle X at [company]? Not selling, just checking.'" },
  { xp: 150, label: "The Silence Rule", content: "After you ask a discovery question, shut up. First to talk loses." },
  { xp: 300, label: "The 3-Why Method", content: "Ask 'why does that matter?' three times to reach the real pain." },
  { xp: 500, label: "The Ethical Close", content: "'Based on what you told me, this fits. Want to move forward or is there a reason not to?'" },
  { xp: 800, label: "The Follow-Up Formula", content: "Day 1, Day 3, Day 7, Day 14, Day 30 — value in every touch, never guilt." },
];
