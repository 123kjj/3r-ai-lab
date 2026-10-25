import { describe, it, expect } from "vitest";
import { generateLearningReceipt } from "../receiptGenerator";
import { buildThreeFutureScenarios } from "../scenarioEngine";
import { AnalyzeItemResult } from "../types";

function mockResult(overrides: Partial<AnalyzeItemResult> = {}): AnalyzeItemResult {
  return {
    itemName: "Aluminum Can",
    category: "Metal packaging",
    bestAction: "recycle",
    confidence: 0.97,
    explanation: "test",
    reduceAdvice: "test",
    reuseAdvice: "test",
    recycleAdvice: "test",
    reuseIdeas: ["idea 1"],
    environmentalImpact: "test",
    localRuleWarning: "test",
    ...overrides,
  };
}

describe("generateLearningReceipt", () => {
  it("produces all 8 required fields, non-empty", () => {
    const result = mockResult();
    const scenarios = buildThreeFutureScenarios(result.category, result.itemName);
    const receipt = generateLearningReceipt(result, scenarios);

    expect(receipt.itemName).toBeTruthy();
    expect(receipt.likelyMaterials).toBeTruthy();
    expect(receipt.recommendedAction).toBeTruthy();
    expect(receipt.recommendationReason).toBeTruthy();
    expect(receipt.surprisingFact).toBeTruthy();
    expect(receipt.alternativesSummary).toBeTruthy();
    expect(receipt.missingInfoNote).toBeTruthy();
    expect(receipt.concreteNextAction).toBeTruthy();
    expect(receipt.reflectionQuestion).toBeTruthy();
  });

  it("includes a real source URL when a sourced impact figure exists (aluminum)", () => {
    const result = mockResult();
    const scenarios = buildThreeFutureScenarios(result.category, result.itemName);
    const receipt = generateLearningReceipt(result, scenarios);
    expect(receipt.sources.length).toBeGreaterThan(0);
    expect(receipt.sources[0].url).toMatch(/^https:\/\/.*epa\.gov/);
  });

  it("flags missing-information when the category is unmapped", () => {
    const result = mockResult({ itemName: "Unidentifiable thing", category: "???" });
    const scenarios = buildThreeFutureScenarios(result.category, result.itemName);
    const receipt = generateLearningReceipt(result, scenarios);
    expect(receipt.missingInfoNote).toMatch(/couldn't confidently match/i);
    expect(receipt.sources.length).toBe(0);
  });

  it("flags missing-information when the AI identification itself was uncertain", () => {
    const result = mockResult({ uncertain: true });
    const scenarios = buildThreeFutureScenarios(result.category, result.itemName);
    const receipt = generateLearningReceipt(result, scenarios);
    expect(receipt.missingInfoNote).toMatch(/clearer or closer photo/i);
  });

  it("trusts the AI's own bestAction (reuse) for glass rather than re-deriving a recommendation from WARM magnitude alone", () => {
    // WARM has no quantified reuse figure at all, so a pure
    // magnitude-comparison would wrongly favor recycle (which has a
    // small but nonzero sourced figure) over reuse, even though reuse
    // is the better everyday call for glass specifically. The upstream
    // AI's bestAction already reflects that qualitative judgment.
    const result = mockResult({
      itemName: "Glass Jar",
      category: "Glass packaging",
      bestAction: "reuse",
    });
    const scenarios = buildThreeFutureScenarios(result.category, result.itemName);
    const receipt = generateLearningReceipt(result, scenarios);
    expect(receipt.recommendedAction).toBe("reuse");
  });

  it("falls back to the best SOURCED figure when bestAction is 'reduce' (no matching scenario path exists)", () => {
    const result = mockResult({
      itemName: "Plastic Water Bottle",
      category: "Plastic packaging",
      bestAction: "reduce",
    });
    const scenarios = buildThreeFutureScenarios(result.category, result.itemName);
    const receipt = generateLearningReceipt(result, scenarios);
    expect(receipt.recommendedAction).toBe("reduce");
    expect(receipt.recommendationReason).toBe(result.reduceAdvice);
  });

  it("does not fabricate a 'learning score' field anywhere on the receipt", () => {
    const result = mockResult();
    const scenarios = buildThreeFutureScenarios(result.category, result.itemName);
    const receipt = generateLearningReceipt(result, scenarios);
    expect(JSON.stringify(receipt)).not.toMatch(/learning\s*score/i);
  });
});
