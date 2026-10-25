/** Materials a person can pick by hand when AI identification fails. Index = position in MOCK_RESULTS (guidance text only; no AI claim is made). */
export const MANUAL_MATERIALS = [
  { label: "Plastic bottle", index: 0 },
  { label: "Cardboard", index: 1 },
  { label: "Glass jar", index: 2 },
  { label: "Clothing / fabric", index: 3 },
  { label: "Aluminum can", index: 4 },
] as const;

import type { AnalyzeItemResult, ThreeRAction } from "./types";
import { classifyMaterial } from "./scenarioEngine";
import { lookupItem } from "./itemLibrary";

/** Hand-written "avoid it next time" tips (Reduce). No statistics. */
const REDUCE_TIPS: Record<string, string> = {
  aluminum: "Carry a refillable bottle so you need fewer single-use cans.",
  glass: "Buy in refillable or bulk containers when your store offers them, and reuse jars before recycling.",
  pet_plastic: "Carry a refillable bottle and fill it at home or at fountains.",
  hdpe_plastic: "Look for refill or concentrate options for detergents and milk alternatives with less packaging.",
  corrugated_cardboard: "Consolidate online orders into fewer shipments and keep good boxes to reuse.",
  mixed_paper: "Switch bills and subscriptions to digital and print double-sided.",
  food_organic: "Plan meals and store food so less is thrown out; compost what remains.",
  textile: "Repair small tears, buy fewer higher-quality pieces, and pass on what still fits.",
  mixed_unknown: "Ask whether you need a new one at all, or can repair, refill or borrow instead.",
};

const TYPED_DEFAULTS: Record<string, { category: string; action: ThreeRAction; note: string }> = {
  aluminum: { category: "Aluminum", action: "recycle", note: "Aluminum is widely accepted curbside. Empty it; a quick rinse is enough." },
  glass: { category: "Glass", action: "reuse", note: "Glass jars and bottles are easy to reuse; otherwise recycle if your program takes glass." },
  pet_plastic: { category: "PET plastic (#1)", action: "recycle", note: "Empty and rinse. Most curbside programs take #1 bottles." },
  hdpe_plastic: { category: "HDPE plastic (#2)", action: "recycle", note: "Empty and rinse. Most curbside programs take #2 jugs and bottles." },
  corrugated_cardboard: { category: "Corrugated cardboard", action: "reuse", note: "Keep it dry and clean; reuse for storage or shipping, then recycle. Greasy parts usually can't be recycled." },
  mixed_paper: { category: "Paper", action: "recycle", note: "Clean, dry paper is generally recyclable. Check local rules." },
  food_organic: { category: "Food scraps", action: "recycle", note: "Compost if you can; landfilled food waste produces methane." },
  textile: { category: "Textiles", action: "reuse", note: "Donate if wearable, or reuse as rags. Textiles are rarely accepted curbside." },
  mixed_unknown: { category: "Unclassified", action: "reduce", note: "We don't have sourced guidance for this item, so we won't guess. Check your local program." },
};

const DISP_ACTION: Record<string, ThreeRAction> = { recycle: "recycle", compost: "recycle", reuse: "reuse", dropoff: "recycle", trash: "reduce" };

/** Builds a result from what the person typed. No AI call; the library and rules engine supply everything. */
export function buildTypedResult(text: string): AnalyzeItemResult {
  const hit = lookupItem(text);
  const name = text.trim().replace(/^./, (c) => c.toUpperCase());
  if (hit) {
    const d = TYPED_DEFAULTS[hit.material] ?? TYPED_DEFAULTS.mixed_unknown;
    return {
      itemName: hit.names[0].replace(/^./, (c) => c.toUpperCase()),
      category: d.category,
      bestAction: DISP_ACTION[hit.disp],
      confidence: 1,
      explanation: hit.why,
      reduceAdvice: REDUCE_TIPS[hit.material] ?? REDUCE_TIPS.mixed_unknown,
      reuseAdvice: hit.why,
      recycleAdvice: hit.why,
      reuseIdeas: [],
      environmentalImpact: "",
      localRuleWarning: "Recycling rules vary by city. Check your local program before putting this in a bin.",
      manualSelection: true,
      ruleIds: hit.rules,
      disposition: hit.disp,
      craftId: hit.craft,
    };
  }
  const { id } = classifyMaterial(text, text);
  const d = TYPED_DEFAULTS[id] ?? TYPED_DEFAULTS.mixed_unknown;
  return {
    itemName: name,
    category: d.category,
    bestAction: d.action,
    confidence: 1,
    explanation: d.note,
    reduceAdvice: REDUCE_TIPS[id] ?? REDUCE_TIPS.mixed_unknown,
    reuseAdvice: d.note,
    recycleAdvice: d.note,
    reuseIdeas: [],
    environmentalImpact: "",
    localRuleWarning: "Recycling rules vary by city. Check your local program before putting this in a bin.",
    manualSelection: true,
    ruleIds: ["check"],
  };
}
