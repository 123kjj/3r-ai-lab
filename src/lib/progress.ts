/**
 * Local-only progress: badges, streaks and planet stage. Stored in this
 * browser (localStorage). No names, no accounts, nothing leaves the device.
 */
export type GameEvent =
  | { type: "check"; item: string }
  | { type: "sort"; correct: boolean; ruleId: string }
  | { type: "craft" }
  | { type: "retake-improved" };

export interface Progress {
  checks: string[];            // distinct items checked
  ruleCorrect: Record<string, number>;
  bestStreak: number;
  crafts: number;
  improved: boolean;
  rulesLearned: string[];      // rule ids with >= 3 correct
  played: number;
}

export const EMPTY_PROGRESS: Progress = {
  checks: [], ruleCorrect: {}, bestStreak: 0, crafts: 0, improved: false, rulesLearned: [], played: 0,
};

const KEY = "3r-progress-v1";

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...EMPTY_PROGRESS, ...JSON.parse(raw) };
  } catch {}
  return { ...EMPTY_PROGRESS };
}

function save(p: Progress) {
  try { localStorage.setItem(KEY, JSON.stringify(p)); } catch {}
}

export function applyEvent(p: Progress, e: GameEvent, streak = 0): Progress {
  const n: Progress = { ...p, ruleCorrect: { ...p.ruleCorrect }, checks: [...p.checks], rulesLearned: [...p.rulesLearned] };
  if (e.type === "check" && !n.checks.includes(e.item)) n.checks.push(e.item);
  if (e.type === "craft") n.crafts += 1;
  if (e.type === "retake-improved") n.improved = true;
  if (e.type === "sort") {
    if (e.correct) {
      n.ruleCorrect[e.ruleId] = (n.ruleCorrect[e.ruleId] ?? 0) + 1;
      if (n.ruleCorrect[e.ruleId] >= 3 && !n.rulesLearned.includes(e.ruleId)) n.rulesLearned.push(e.ruleId);
    }
    n.bestStreak = Math.max(n.bestStreak, streak);
  }
  return n;
}

export function recordEvent(e: GameEvent, streak = 0): Progress {
  const next = applyEvent(loadProgress(), e, streak);
  save(next);
  return next;
}

export function addPlayed(): Progress {
  const p = loadProgress();
  p.played += 1;
  save(p);
  return p;
}

export function planetStage(rulesLearned: number): 0 | 1 | 2 | 3 {
  if (rulesLearned >= 12) return 3;
  if (rulesLearned >= 6) return 2;
  if (rulesLearned >= 2) return 1;
  return 0;
}
export const PLANET_NAMES = ["Dusty planet", "Sprouting planet", "Green planet", "Thriving planet"];
