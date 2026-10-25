/**
 * "Test your instincts" quiz. Ground truth = what MOST U.S. curbside
 * programs do. It varies by city, which the UI says plainly. No
 * statistics are invented: results shown are only what people actually
 * submitted.
 */
export type BinChoice = "recycling" | "trash" | "compost" | "dropoff";

export const BIN_LABELS: Record<BinChoice, string> = {
  recycling: "Recycling bin",
  trash: "Trash",
  compost: "Compost / food waste",
  dropoff: "Special drop-off",
};

export interface QuizItem {
  id: string;
  name: string;
  answer: BinChoice;
  why: string;
}

export const QUIZ_ITEMS: QuizItem[] = [
  { id: "pizza-box-greasy", name: "Greasy pizza box (the soiled part)", answer: "compost", why: "Grease soaks into paper fibers and contaminates recycling. Tear off the clean top for recycling; compost the greasy part where accepted, otherwise trash." },
  { id: "plastic-bag", name: "Plastic grocery bag", answer: "dropoff", why: "Thin film jams sorting machinery, so most curbside programs reject it. Many grocery stores collect clean bags." },
  { id: "aluminum-can", name: "Empty soda can", answer: "recycling", why: "Aluminum is accepted nearly everywhere and has the largest recycling savings in EPA WARM (−9.13 vs +0.02 MTCO₂E/short ton landfilled)." },
  { id: "banana-peel", name: "Banana peel", answer: "compost", why: "Landfilled food waste produces methane. EPA WARM: landfill +0.50 vs composting −0.15 MTCO₂E/short ton." },
  { id: "lithium-battery", name: "Old phone or laptop battery", answer: "dropoff", why: "Lithium batteries can start fires in trucks and facilities. Use a battery or electronics drop-off." },
  { id: "foam-container", name: "Styrofoam takeout container", answer: "trash", why: "Foam is rarely accepted curbside. Best fix: avoid it when you can." },
  { id: "coffee-cup", name: "Paper coffee cup", answer: "trash", why: "The plastic lining makes most paper cups unrecyclable in standard programs." },
  { id: "chip-bag", name: "Empty chip bag", answer: "trash", why: "Snack bags are layers of plastic and foil, so most programs can't recycle them." },
  { id: "disposable-vape", name: "Disposable vape", answer: "dropoff", why: "It contains a lithium battery and is electronics, so it needs hazardous or e-waste drop-off." },
  { id: "notebook-paper", name: "Old notebook paper", answer: "recycling", why: "Plain, dry paper is one of the most recycled items." },
  { id: "coffee-grounds", name: "Used coffee grounds", answer: "compost", why: "Coffee grounds compost well; in a landfill, food waste makes methane." },
  { id: "plastic-bottle", name: "Empty plastic water bottle", answer: "recycling", why: "#1 PET bottles are accepted by most curbside programs. EPA WARM: recycling −1.13 vs landfill +0.04 MTCO₂E/short ton." },
];

export function scoreQuiz(answers: Record<string, BinChoice>): number {
  return QUIZ_ITEMS.filter((q) => answers[q.id] === q.answer).length;
}

export interface QuizAggregate {
  participants: number;
  meanScore: number;
  perItemCorrect: Record<string, number>; // item id -> count correct
}

export function aggregateQuiz(responses: { answers: Record<string, BinChoice> }[]): QuizAggregate {
  const perItemCorrect: Record<string, number> = {};
  QUIZ_ITEMS.forEach((q) => (perItemCorrect[q.id] = 0));
  let total = 0;
  for (const r of responses) {
    total += scoreQuiz(r.answers);
    for (const q of QUIZ_ITEMS) if (r.answers[q.id] === q.answer) perItemCorrect[q.id]++;
  }
  return {
    participants: responses.length,
    meanScore: responses.length ? total / responses.length : 0,
    perItemCorrect,
  };
}

export interface RetestSummary {
  pairs: number;
  meanFirst: number;
  meanRetest: number;
}

/** Pairs each participant's first attempt with their LATEST later attempt. Only real pairs count. */
export function summarizeRetests(
  responses: { answers: Record<string, BinChoice>; pid?: string; attempt?: number }[]
): RetestSummary {
  const first = new Map<string, number>();
  const last = new Map<string, { attempt: number; score: number }>();
  for (const r of responses) {
    if (!r.pid || r.pid === "unknown" || !r.attempt) continue;
    const score = scoreQuiz(r.answers);
    if (r.attempt === 1) first.set(r.pid, score);
    else if (!last.has(r.pid) || r.attempt > last.get(r.pid)!.attempt) last.set(r.pid, { attempt: r.attempt, score });
  }
  let n = 0, a = 0, b = 0;
  first.forEach((fs, pid) => {
    const l = last.get(pid);
    if (l) { n++; a += fs; b += l.score; }
  });
  return { pairs: n, meanFirst: n ? a / n : 0, meanRetest: n ? b / n : 0 };
}
