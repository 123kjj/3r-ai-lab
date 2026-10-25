import { CORE_RULES } from "./rules";
import type { Progress } from "./progress";

export interface Badge {
  id: string;
  title: string;
  how: string;
  emoji: string;
  earned: (p: Progress) => boolean;
}

const RULE_BADGE_NAMES: Record<string, [string, string]> = {
  grease: ["Grease Spotter", "🍕"],
  film: ["Film Fighter", "🛍️"],
  battery: ["Battery Hero", "🔋"],
  ewaste: ["E-Waste Ace", "📱"],
  methane: ["Methane Buster", "🍌"],
  mixed: ["Layer Detective", "🥤"],
  hazard: ["Hazard Handler", "🧪"],
  dry: ["Dry Paper Pro", "📄"],
  foam: ["Foam Foe", "🥡"],
  textile: ["Cloth Saver", "👕"],
  meds: ["Safe Medicine", "💊"],
  reuse: ["Reuse Champion", "♻️"],
};

const ruleBadges: Badge[] = CORE_RULES.filter((r) => RULE_BADGE_NAMES[r.id]).map((r) => ({
  id: `rule-${r.id}`,
  title: RULE_BADGE_NAMES[r.id][0],
  emoji: RULE_BADGE_NAMES[r.id][1],
  how: `Get "${r.title}" items right 3 times in Sort Rush.`,
  earned: (p) => (p.ruleCorrect[r.id] ?? 0) >= 3,
}));

export const BADGES: Badge[] = [
  { id: "streak-3", title: "Hot Streak", emoji: "🔥", how: "3 correct in a row", earned: (p) => p.bestStreak >= 3 },
  { id: "streak-5", title: "Sorting Star", emoji: "⭐", how: "5 correct in a row", earned: (p) => p.bestStreak >= 5 },
  { id: "streak-10", title: "Unstoppable", emoji: "🚀", how: "10 correct in a row", earned: (p) => p.bestStreak >= 10 },
  { id: "explorer", title: "Explorer", emoji: "🧭", how: "Check 10 different items", earned: (p) => p.checks.length >= 10 },
  { id: "craft", title: "Craft Maker", emoji: "✂️", how: "Open 3 craft ideas", earned: (p) => p.crafts >= 3 },
  { id: "comeback", title: "Comeback", emoji: "📈", how: "Improve your score on the quiz retake", earned: (p) => p.improved },
  { id: "player", title: "First Shift", emoji: "🎮", how: "Finish a Sort Rush round", earned: (p) => p.played >= 1 },
  ...ruleBadges,
];

export function earnedBadges(p: Progress): Badge[] {
  return BADGES.filter((b) => b.earned(p));
}
