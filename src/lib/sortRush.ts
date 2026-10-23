import { ITEM_LIBRARY, LibraryItem, Disposition } from "./itemLibrary";
import { RULES_BY_ID } from "./rules";

export type Bin = "recycling" | "compost" | "trash" | "dropoff";
export const BINS: { id: Bin; label: string; color: string }[] = [
  { id: "recycling", label: "Recycling", color: "#3B82C4" },
  { id: "compost", label: "Compost", color: "#4C9A52" },
  { id: "trash", label: "Trash", color: "#6B7280" },
  { id: "dropoff", label: "Drop-off", color: "#E8833A" },
];

export function binFor(d: Disposition): Bin | null {
  if (d === "recycle") return "recycling";
  if (d === "compost") return "compost";
  if (d === "trash") return "trash";
  if (d === "dropoff") return "dropoff";
  return null; // "reuse" items aren't used in the sorting game
}

export const GAME_ITEMS: LibraryItem[] = ITEM_LIBRARY.filter((i) => i.game && binFor(i.disp) !== null);

export function pickRound(n: number, rng: () => number = Math.random): LibraryItem[] {
  const pool = [...GAME_ITEMS];
  const out: LibraryItem[] = [];
  const seenBins: Record<string, number> = {};
  while (out.length < n && pool.length) {
    const i = Math.floor(rng() * pool.length);
    const item = pool.splice(i, 1)[0];
    const b = binFor(item.disp)!;
    // keep rounds varied: no more than ceil(n/2) from one bin
    if ((seenBins[b] ?? 0) >= Math.ceil(n / 2)) continue;
    seenBins[b] = (seenBins[b] ?? 0) + 1;
    out.push(item);
  }
  return out;
}

export interface Answer { item: LibraryItem; chosen: Bin; correct: boolean; }

export function isCorrect(item: LibraryItem, chosen: Bin): boolean {
  return binFor(item.disp) === chosen;
}

/** The rule you missed most often this round (real data from your own answers). */
export function blindSpot(answers: Answer[]): { ruleId: string; title: string; misses: number } | null {
  const misses: Record<string, number> = {};
  for (const a of answers) if (!a.correct) misses[a.item.rules[0]] = (misses[a.item.rules[0]] ?? 0) + 1;
  const top = Object.entries(misses).sort((a, b) => b[1] - a[1])[0];
  if (!top) return null;
  return { ruleId: top[0], title: RULES_BY_ID[top[0]]?.title ?? top[0], misses: top[1] };
}
