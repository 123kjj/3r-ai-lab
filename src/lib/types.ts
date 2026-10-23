export type ThreeRAction = "reduce" | "reuse" | "recycle";

export interface AnalyzeItemResult {
  itemName: string;
  category: string;
  bestAction: ThreeRAction;
  confidence: number; // 0–1
  explanation: string;
  reduceAdvice: string;
  reuseAdvice: string;
  recycleAdvice: string;
  reuseIdeas: string[];
  environmentalImpact: string;
  localRuleWarning: string;
  /** true when the model could not confidently identify the item */
  uncertain?: boolean;
  /** true when this result is a demo fallback because the real AI call failed */
  isFallback?: boolean;
  /** true when the person picked the material themselves (not AI-identified) */
  manualSelection?: boolean;
  /**
   * Follow-up questions the Material Detective wants answered before it
   * can give a confident scenario comparison (e.g. "is it empty?",
   * "is there grease residue?"). Populated by src/lib/followUpQuestions.ts
   * based on the identified category — not invented per-call by the AI.
   */
  followUpQuestions?: FollowUpQuestion[];
}

/**
 * ────────────────────────────────────────────────────────────────
 * MATERIAL DETECTIVE — follow-up questions & manual correction
 * ────────────────────────────────────────────────────────────────
 */
export interface FollowUpQuestion {
  id: string;
  question: string;
  options: { value: string; label: string }[];
}

/** The person's answers, keyed by FollowUpQuestion.id */
export type FollowUpAnswers = Record<string, string>;

/**
 * ────────────────────────────────────────────────────────────────
 * THREE-FUTURE SCENARIO ENGINE
 * ────────────────────────────────────────────────────────────────
 * Structured, rules-engine output — never free-text invented by an
 * LLM. See src/lib/scenarioEngine.ts.
 */
export type EvidenceQuality = "high" | "moderate" | "low" | "none";
export type ScenarioPath = "reuse" | "recycle" | "dispose";

export interface ImpactFigure {
  /** MTCO2E per short ton, from EPA WARM. Negative = net reduction. */
  value: number;
  unit: "MTCO2E per short ton";
  sourceTitle: string;
  sourceUrl: string;
  sourceExhibit: string;
}

export interface ScenarioResult {
  path: ScenarioPath;
  headline: string;
  practicalNextStep: string;
  benefits: string[];
  tradeoffs: string[];
  assumptions: string[];
  evidenceQuality: EvidenceQuality;
  /** Populated only when a sourced WARM figure exists for this pathway. */
  impactFigure?: ImpactFigure;
  /** Shown when we deliberately do NOT have a number to show. */
  noDataReason?: string;
}

export interface ThreeFutureScenarios {
  materialCategoryLabel: string;
  scenarios: ScenarioResult[];
  /** true if the item's category couldn't be mapped to a known material */
  unmappedCategory: boolean;
}

/**
 * ────────────────────────────────────────────────────────────────
 * LOCAL REALITY CHECK — provider interface
 * ────────────────────────────────────────────────────────────────
 * See src/lib/localRules/provider.ts. Distinguishes verified,
 * sourced guidance from general/unverified guidance from an honest
 * fallback provider, so the UI never implies a live lookup that
 * didn't happen.
 */
export type LocalRuleConfidence = "verified" | "general_guidance" | "unknown";

export interface LocalRuleSource {
  title: string;
  url?: string;
  lastChecked?: string; // ISO date
}

export interface LocalRuleResult {
  confidence: LocalRuleConfidence;
  guidance: string;
  source?: LocalRuleSource;
  /** Explains why confidence isn't "verified" when it isn't. */
  limitationNote: string;
}

/**
 * ────────────────────────────────────────────────────────────────
 * THE LEARNING RECEIPT
 * ────────────────────────────────────────────────────────────────
 */
export interface LearningReceipt {
  id: string;
  createdAt: string; // ISO date
  itemName: string;
  likelyMaterials: string;
  recommendedAction: ThreeRAction;
  recommendationReason: string;
  surprisingFact: string;
  alternativesSummary: string; // short comparison of realistic alternatives
  sources: LocalRuleSource[];
  missingInfoNote: string;
  concreteNextAction: string;
  reflectionQuestion: string;
  /** The person's own answer, if they engaged with the reflection prompt. */
  reflectionAnswer?: string;
}

export interface UserAction {
  id: string;
  itemName: string;
  category: string;
  action: ThreeRAction;
  explanation: string;
  createdAt: string; // ISO date
  /** Sourced EPA WARM estimate vs landfilling; only set if the person entered a weight and WARM has data. */
  estimatedKgCO2e?: number;
}

export interface ImpactStats {
  totalActions: number;
  reusedCount: number;
  recycledCount: number;
  reducedCount: number;
  challengeDay: number; // 1–7
  /** Sum of per-item WARM-based estimates (only for items where one could be computed). */
  estimatedKgCO2e?: number;
}

export interface Achievement {
  id: string;
  icon: string;
  label: string;
  description: string;
  isUnlocked: (stats: ImpactStats) => boolean;
}
