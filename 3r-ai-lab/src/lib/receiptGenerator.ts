import { AnalyzeItemResult, LearningReceipt, LocalRuleResult, ThreeFutureScenarios } from "./types";

/**
 * Builds the Learning Receipt from already-computed, already-sourced
 * data (the AI identification, the rules-engine scenarios, and
 * whatever local-rules result exists). This function does NOT call
 * an LLM and does NOT invent a "learning score" — it assembles facts
 * that were already generated elsewhere, deterministically.
 */
export function generateLearningReceipt(
  result: AnalyzeItemResult,
  scenarios: ThreeFutureScenarios,
  localRule?: LocalRuleResult | null
): LearningReceipt {
  const recommended = scenarios.scenarios.find((s) => s.path === "recycle")!;
  const reuse = scenarios.scenarios.find((s) => s.path === "reuse")!;
  const dispose = scenarios.scenarios.find((s) => s.path === "dispose")!;

  // Trust the AI's own bestAction (reduce/reuse/recycle) as the primary
  // recommendation signal — it already weighs qualitative factors (e.g.
  // "glass recycling's sourced benefit is small, so reuse is the better
  // everyday call") that a pure WARM-magnitude comparison can't see,
  // since WARM doesn't quantify reuse at all. Map it to the matching
  // scenario for its supporting evidence; "reduce" has no scenario path
  // (reduce means "don't generate this waste at all"), so fall back to
  // whichever scenario has the strongest SOURCED figure in that case.
  const matchingScenario =
    result.bestAction === "reuse" ? reuse : result.bestAction === "recycle" ? recommended : null;

  const best =
    matchingScenario ??
    [reuse, recommended, dispose]
      .filter((s) => s.evidenceQuality !== "none")
      .sort((a, b) => {
        const score = (s: typeof a) => (s.impactFigure ? -s.impactFigure.value : 0);
        return score(b) - score(a);
      })[0] ??
    recommended;

  const missingInfoParts: string[] = [];
  if (result.uncertain) {
    missingInfoParts.push("A clearer or closer photo could improve the identification itself.");
  }
  if (scenarios.unmappedCategory) {
    missingInfoParts.push(
      "We couldn't confidently match this item to one of our tracked material categories, so this guidance is generic rather than material-specific."
    );
  }
  if (!best.impactFigure) {
    missingInfoParts.push(
      "We don't have a sourced quantitative emissions figure for this specific pathway — see the Evidence tab for why."
    );
  }
  if (missingInfoParts.length === 0) {
    missingInfoParts.push(
      "Local program rules can still override general guidance — confirm with your hauler if uncertain."
    );
  }

  const sources = [
    ...(best.impactFigure
      ? [{ title: best.impactFigure.sourceTitle, url: best.impactFigure.sourceUrl }]
      : []),
    ...(localRule?.source ? [localRule.source] : []),
  ];

  return {
    id: `receipt-${Date.now()}`,
    createdAt: new Date().toISOString(),
    itemName: result.itemName,
    likelyMaterials: scenarios.materialCategoryLabel,
    recommendedAction:
      result.bestAction === "reduce"
        ? "reduce"
        : best.path === "dispose"
        ? "recycle"
        : (best.path as "reuse" | "recycle"),
    recommendationReason:
      result.bestAction === "reduce" ? result.reduceAdvice : best.practicalNextStep,
    surprisingFact: pickSurprisingFact(scenarios),
    alternativesSummary: `${reuse.headline} vs. ${recommended.headline} vs. ${dispose.headline}.`,
    sources,
    missingInfoNote: missingInfoParts.join(" "),
    concreteNextAction: best.practicalNextStep,
    reflectionQuestion: buildReflectionQuestion(scenarios),
  };
}

function pickSurprisingFact(scenarios: ThreeFutureScenarios): string {
  const withFigures = scenarios.scenarios.filter((s) => s.impactFigure);
  if (withFigures.length >= 2) {
    const sorted = [...withFigures].sort(
      (a, b) => (a.impactFigure!.value) - (b.impactFigure!.value)
    );
    const best = sorted[0];
    const worst = sorted[sorted.length - 1];
    const ratio =
      worst.impactFigure!.value !== 0
        ? Math.abs(best.impactFigure!.value / worst.impactFigure!.value)
        : null;
    if (ratio && ratio > 1.5) {
      return `${best.path === "recycle" ? "Recycling" : best.path === "dispose" ? "Landfilling" : "This pathway"} this material (${best.impactFigure!.value} MTCO2E/ton) differs from ${worst.path} (${worst.impactFigure!.value} MTCO2E/ton) by roughly ${ratio.toFixed(1)}x in sourced EPA WARM data — the gap between disposal choices isn't small for this material.`;
    }
  }
  const tradeoff = scenarios.scenarios.find((s) => s.tradeoffs.length > 0);
  return tradeoff?.tradeoffs[0] ?? "Every material category behaves differently — there's no universal 'best' disposal pathway across all items.";
}

function buildReflectionQuestion(scenarios: ThreeFutureScenarios): string {
  const recommended = scenarios.scenarios.find((s) => s.path === "recycle");
  if (recommended?.impactFigure && recommended.impactFigure.value < 0) {
    return `Why does recycling ${scenarios.materialCategoryLabel.toLowerCase()} show a negative (reduction) emissions figure instead of a positive one?`;
  }
  return `Based on what you just read, what's one thing that could change which option is actually best for this specific item?`;
}
