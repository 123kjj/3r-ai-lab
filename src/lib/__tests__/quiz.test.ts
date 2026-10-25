import { describe, it, expect } from "vitest";
import { QUIZ_ITEMS, scoreQuiz, aggregateQuiz, summarizeRetests, BinChoice } from "../quiz";

const perfect = Object.fromEntries(QUIZ_ITEMS.map((q) => [q.id, q.answer])) as Record<string, BinChoice>;
const allTrash = Object.fromEntries(QUIZ_ITEMS.map((q) => [q.id, "trash"])) as Record<string, BinChoice>;

describe("quiz", () => {
  it("scores perfect answers", () => expect(scoreQuiz(perfect)).toBe(QUIZ_ITEMS.length));
  it("scores wrong/missing answers", () => {
    expect(scoreQuiz({})).toBe(0);
    expect(scoreQuiz(allTrash)).toBe(QUIZ_ITEMS.filter((q) => q.answer === "trash").length);
  });
  it("aggregates only real responses", () => {
    expect(aggregateQuiz([]).participants).toBe(0);
    expect(aggregateQuiz([]).meanScore).toBe(0);
    const a = aggregateQuiz([{ answers: perfect }, { answers: {} }]);
    expect(a.participants).toBe(2);
    expect(a.meanScore).toBe(QUIZ_ITEMS.length / 2);
    expect(a.perItemCorrect[QUIZ_ITEMS[0].id]).toBe(1);
  });
  it("pairs retests only for the same participant", () => {
    const r = summarizeRetests([
      { answers: {}, pid: "a", attempt: 1 },
      { answers: perfect, pid: "a", attempt: 2 },
      { answers: perfect, pid: "b", attempt: 1 },
    ]);
    expect(r.pairs).toBe(1);
    expect(r.meanFirst).toBe(0);
    expect(r.meanRetest).toBe(QUIZ_ITEMS.length);
    expect(summarizeRetests([]).pairs).toBe(0);
  });
});
