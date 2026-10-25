import { lookupItem } from "./itemLibrary";
import {
  EvidenceQuality,
  FollowUpAnswers,
  ScenarioPath,
  ScenarioResult,
  ThreeFutureScenarios,
} from "./types";
import { MATERIAL_IMPACT_DATA, MaterialCategoryId } from "./materialData";

/**
 * ────────────────────────────────────────────────────────────────
 * THREE-FUTURE SCENARIO ENGINE
 * ────────────────────────────────────────────────────────────────
 * Deliberately NOT an LLM call. This is a small, testable rules
 * engine: keyword classification -> a lookup table of qualitative
 * guidance per material category -> sourced WARM figures attached
 * where (and only where) we have them. Every function here is pure
 * and unit-tested (see src/lib/__tests__/scenarioEngine.test.ts).
 */

export type ExtendedCategoryId = MaterialCategoryId | "textile" | "mixed_unknown";

/**
 * Keyword -> category classifier. Intentionally simple and
 * inspectable (not an AI call) so the mapping from "what the vision
 * model said" to "which material bucket we reason about" is a fact
 * we can test and audit, not a black box.
 *
 * Accuracy rules (each one exists because a naive version got it wrong):
 *  - Whole-word matching, with optional plural ("peel" matches "peels").
 *    A bare substring match put "carpet" in PET plastic.
 *  - The item name is classified first; the broader category string the
 *    vision model returns is only a fallback. "Plastic food container"
 *    must not become food waste because the word "food" appears.
 *  - We never apply a sourced figure to a different material. Steel and
 *    tin cans are NOT aluminum (WARM reports them separately and we have
 *    not sourced that figure), so they stay unclassified.
 *  - Paper items that are generally not recyclable (cups, towels,
 *    napkins, tissues, plates) are left unclassified rather than being
 *    told "recycle — strong default for paper".
 */
const ITEM_KEYWORDS: Record<MaterialCategoryId | "textile", string[]> = {
  aluminum: ["aluminum", "aluminium", "aluminum can", "soda can", "beer can"],
  glass: ["glass", "mason jar", "glass jar", "glass bottle"],
  pet_plastic: ["pet", "pete", "plastic bottle", "water bottle", "soda bottle", "#1 plastic"],
  hdpe_plastic: ["hdpe", "milk jug", "detergent bottle", "#2 plastic", "plastic jug", "plastic tub"],
  corrugated_cardboard: [
    "cardboard",
    "corrugated",
    "cardboard box",
    "shipping box",
    "pizza box",
    "moving box",
  ],
  mixed_paper: ["office paper", "printer paper", "notebook paper", "newspaper", "magazine", "junk mail", "envelope"],
  food_organic: [
    "banana",
    "apple",
    "orange peel",
    "peel",
    "coffee grounds",
    "eggshell",
    "vegetable",
    "fruit",
    "produce",
    "compost",
    "food scraps",
    "leftovers",
  ],
  textile: ["shirt", "t-shirt", "fabric", "textile", "clothing", "cotton", "jeans", "sock", "pillowcase"],
};

/** Broader words that are only trusted at the category level (pass 2). */
const CATEGORY_KEYWORDS: Partial<Record<MaterialCategoryId | "textile", string[]>> = {
  glass: ["glass"],
  corrugated_cardboard: ["cardboard", "corrugated"],
  mixed_paper: ["paper"],
  food_organic: ["food", "organic"],
  textile: ["textile", "fabric", "clothing"],
  aluminum: ["aluminum", "aluminium"],
};

/** Paper-ish items that standard paper recycling generally rejects. */
const NOT_RECYCLABLE_PAPER = /\b(cup|plate|napkin|towel|tissue|wrapper|diaper|receipt|sticker|label|carton)s?\b/;

function keywordRegex(keyword: string): RegExp {
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?:^|[^a-z0-9])${escaped}(?:e?s)?(?![a-z0-9])`, "i");
}

function firstMatch(
  text: string,
  table: Partial<Record<MaterialCategoryId | "textile", string[]>>
): { id: MaterialCategoryId | "textile"; keyword: string } | null {
  for (const [id, keywords] of Object.entries(table) as [
    MaterialCategoryId | "textile",
    string[]
  ][]) {
    const hit = keywords.find((k) => keywordRegex(k).test(text));
    if (hit) return { id, keyword: hit };
  }
  return null;
}

export function classifyMaterial(
  category: string,
  itemName: string
): { id: ExtendedCategoryId; matchedKeyword: string | null } {
  // Hand-written item library wins: it knows exactly what the item is.
  const known = lookupItem(itemName);
  if (known) return { id: known.material, matchedKeyword: known.names[0] };

  const item = itemName.toLowerCase();
  const cat = category.toLowerCase();

  // Cardboard/paper tubes and rolls are fibrous paper, not true
  // corrugated board, even though "cardboard" is attached to them.
  // Match the tube/roll *product* specifically so "tube of toothpaste"
  // and "bread roll" don't land here, and so used toilet paper or paper
  // towel (not the empty core) doesn't either.
  if (
    /\b(cardboard|paper)\b.*\b(tube|roll|core)s?\b/.test(item) ||
    /\b(toilet paper|paper towel)\s+(tube|roll|core)s?\b/.test(item)
  ) {
    return { id: "mixed_paper", matchedKeyword: "paper tube/roll" };
  }

  // Generally non-recyclable paper products: don't claim a figure.
  if (NOT_RECYCLABLE_PAPER.test(item) && /\b(paper|cardboard|paperboard)\b|\b(cup|plate|napkin|towel|tissue)\b/.test(`${item} ${cat}`)) {
    return { id: "mixed_unknown", matchedKeyword: null };
  }

  const byItem = firstMatch(item, ITEM_KEYWORDS);
  if (byItem) return { id: byItem.id, matchedKeyword: byItem.keyword };

  const byCategory = firstMatch(cat, CATEGORY_KEYWORDS);
  if (byCategory) return { id: byCategory.id, matchedKeyword: byCategory.keyword };

  return { id: "mixed_unknown", matchedKeyword: null };
}

/**
 * Qualitative guidance per category. Each entry is hand-authored,
 * reviewed text — not generated per-request — which is what makes it
 * testable and auditable rather than an LLM improvising a new answer
 * every time for the same material.
 */
interface CategoryGuidance {
  label: string;
  reuse: {
    headline: string;
    practicalNextStep: string;
    benefits: string[];
    tradeoffs: string[];
    assumptions: string[];
  };
  recycle: {
    headline: string;
    practicalNextStep: string;
    benefits: string[];
    tradeoffs: string[];
    assumptions: string[];
    /** which WARM pathway figure (if any) represents "recycle" for this material */
    warmPathway?: "recycling" | "composting" | "anaerobicDigestion";
  };
  dispose: {
    headline: string;
    practicalNextStep: string;
    benefits: string[];
    tradeoffs: string[];
    assumptions: string[];
    warmPathway?: "landfilling" | "composting" | "anaerobicDigestion";
  };
}

const GUIDANCE: Record<ExtendedCategoryId, CategoryGuidance> = {
  aluminum: {
    label: "Aluminum",
    reuse: {
      headline: "Repurpose before recycling",
      practicalNextStep:
        "Clean cans can become small planters, pen holders, or lanterns — low effort, no special tools needed.",
      benefits: ["Defers the need for either recycling or landfill entirely for this unit."],
      tradeoffs: ["Only sensible for a small number of items — reuse doesn't scale to high-volume cans."],
      assumptions: ["Can is undamaged and empty."],
    },
    recycle: {
      headline: "Recycle — this is the strong default for aluminum",
      practicalNextStep: "Rinse out residue (label can stay on) and put in curbside recycling.",
      benefits: [
        "Aluminum has the largest sourced emissions-reduction figure of any material we track.",
        "Aluminum can be recycled indefinitely without quality loss.",
      ],
      tradeoffs: ["Requires access to a program that actually accepts aluminum — true almost everywhere, but worth a quick check."],
      assumptions: ["Can is reasonably clean (no need to be spotless)."],
      warmPathway: "recycling",
    },
    dispose: {
      headline: "Landfill — avoid if at all possible",
      practicalNextStep: "If no recycling access exists, landfill is the fallback, but check for a nearby drop-off or redemption center first.",
      benefits: [],
      tradeoffs: ["Forgoes aluminum's unusually large recycling benefit — this is the material where skipping recycling costs the most."],
      assumptions: [],
      warmPathway: "landfilling",
    },
  },
  glass: {
    label: "Glass",
    reuse: {
      headline: "Reuse is often the better call for glass specifically",
      practicalNextStep: "Clean jars work well for food storage, bulk-bin shopping, or small organizing — glass doesn't absorb odors or degrade.",
      benefits: ["Glass's own recycling benefit (see Recycle tab) is comparatively small, so reuse captures more value here than it does for, say, aluminum."],
      tradeoffs: ["Only useful if you have a real use for the container — don't hoard jars you won't use."],
      assumptions: ["Jar/bottle is intact (no cracks or chips)."],
    },
    recycle: {
      headline: "Recycle if reuse isn't practical",
      practicalNextStep: "Rinse and remove the lid (metal lids are often sorted separately). Check locally — some areas require drop-off instead of curbside.",
      benefits: ["Glass can be recycled repeatedly."],
      tradeoffs: [
        "Glass's sourced emissions-reduction figure is modest — about 1/30th of aluminum's — because virgin glass production isn't as energy-intensive to begin with.",
        "A meaningful number of municipal programs don't accept glass curbside at all.",
      ],
      assumptions: ["Program accepts glass; container is empty and rinsed."],
      warmPathway: "recycling",
    },
    dispose: {
      headline: "Landfill — last resort",
      practicalNextStep: "If genuinely no recycling or reuse option exists locally, landfill is the fallback.",
      benefits: [],
      tradeoffs: ["Glass is chemically inert in a landfill (low direct harm) but permanently forgoes any recovery value."],
      assumptions: [],
      warmPathway: "landfilling",
    },
  },
  pet_plastic: {
    label: "PET plastic (#1)",
    reuse: {
      headline: "Short-term reuse is fine, long-term reuse has caveats",
      practicalNextStep: "A PET bottle can be reused briefly (e.g. as a watering can or garden spike), but isn't ideal for repeated food/drink contact long-term.",
      benefits: ["Defers immediate disposal."],
      tradeoffs: ["PET plastic isn't designed for indefinite reuse the way glass is — it can degrade and isn't as easy to fully clean."],
      assumptions: ["Bottle is intact, not used for anything hazardous."],
    },
    recycle: {
      headline: "Recycle — PET is one of the more reliably recycled plastics",
      practicalNextStep: "Empty, rinse, and recycle. Flatten to save space if your program asks for it.",
      benefits: ["PET has a meaningful net emissions-reduction figure when recycled, and is widely accepted curbside (it's the most commonly recycled plastic resin in the US)."],
      tradeoffs: ["Caps and labels are sometimes a different plastic type and may need separating depending on your program."],
      assumptions: ["Container is reasonably clean; program accepts #1 plastic."],
      warmPathway: "recycling",
    },
    dispose: {
      headline: "Landfill — avoid combustion if you have a choice",
      practicalNextStep: "If recycling isn't available, landfill rather than burn where you have the choice.",
      benefits: [],
      tradeoffs: [
        "Unlike paper, combusting plastic is a NET EMITTING pathway in sourced data (plastic is petroleum-derived), not a reduction — worth knowing if your area uses waste-to-energy incineration.",
      ],
      assumptions: [],
      warmPathway: "landfilling",
    },
  },
  hdpe_plastic: {
    label: "HDPE plastic (#2)",
    reuse: {
      headline: "Reasonable for short-term reuse",
      practicalNextStep: "HDPE jugs/tubs can be reused for storage or as scoops/funnels if cut.",
      benefits: ["Defers disposal; HDPE is a fairly sturdy, stable plastic."],
      tradeoffs: ["Not indefinitely reusable; UV exposure and repeated washing degrade it over time."],
      assumptions: ["Container didn't previously hold anything hazardous."],
    },
    recycle: {
      headline: "Recycle — also widely accepted",
      practicalNextStep: "Empty, rinse, and recycle with caps on or off per your local program's instructions.",
      benefits: ["Sourced recycling figure is a solid net reduction, and HDPE is broadly accepted curbside."],
      tradeoffs: ["Residue from non-food contents (motor oil, detergent, chemicals) can disqualify a container even though the resin itself is recyclable."],
      assumptions: ["Container is food-grade or thoroughly cleaned; program accepts #2 plastic."],
      warmPathway: "recycling",
    },
    dispose: {
      headline: "Landfill — avoid combustion if you have a choice",
      practicalNextStep: "If recycling isn't available, landfill rather than burn where you have the choice.",
      benefits: [],
      tradeoffs: ["Same as PET: combustion is a net-emitting pathway for plastics in sourced data, not a reduction."],
      assumptions: [],
      warmPathway: "landfilling",
    },
  },
  corrugated_cardboard: {
    label: "Corrugated cardboard",
    reuse: {
      headline: "Reuse strongly before recycling",
      practicalNextStep: "Sturdy boxes are good for storage, moving, or shipping again — cardboard loses structural strength each time it's pulped and remade, so reuse captures value recycling can't.",
      benefits: ["Each reuse cycle avoids both the recycling process and (eventually) landfill."],
      tradeoffs: ["Taped, heavily printed, or waterlogged boxes are poor reuse candidates."],
      assumptions: ["Box is dry and structurally intact."],
    },
    recycle: {
      headline: "Recycle if clean and dry",
      practicalNextStep: "Remove tape/labels where easy, flatten, and recycle. Keep it dry before pickup.",
      benefits: [
        "Cardboard has one of the largest sourced recycling-emissions-reduction figures we track, and landfilling paper products carries an unusually high methane penalty — so recycling vs. landfilling matters more here than for, say, glass.",
      ],
      tradeoffs: ["Grease or food contamination (classic pizza-box problem) disqualifies cardboard from standard recycling streams."],
      assumptions: ["No grease, food residue, or heavy wet-strength coating."],
      warmPathway: "recycling",
    },
    dispose: {
      headline: "Landfill is the costliest fallback for paper products",
      practicalNextStep: "If contaminated (greasy) or recycling truly isn't available, landfill — but this is the pathway to avoid most for cardboard specifically.",
      benefits: [],
      tradeoffs: ["Landfilled paper decomposes anaerobically and releases methane — this is why the sourced landfilling figure for cardboard is notably higher than for glass or metal."],
      assumptions: [],
      warmPathway: "landfilling",
    },
  },
  mixed_paper: {
    label: "Mixed paper",
    reuse: {
      headline: "Reuse where practical (scratch paper, packing material)",
      practicalNextStep: "Use the blank side for notes, or shred for use as packing material before recycling.",
      benefits: ["Extends use before the material needs processing at all."],
      tradeoffs: ["Many paper items (mail, receipts) aren't practically reusable — don't force it."],
      assumptions: ["Paper has no sensitive personal information if repurposed casually, or is shredded first."],
    },
    recycle: {
      headline: "Recycle — strong default for paper",
      practicalNextStep: "Keep dry and place in your paper/mixed-paper recycling stream.",
      benefits: ["Sourced recycling figure is a strong net reduction, among the largest we track."],
      tradeoffs: ["Thermal receipt paper (BPA-coated) and heavily laminated paper are often excluded by real programs despite being 'paper.'"],
      assumptions: ["Not laminated, waxed, or heavily soiled."],
      warmPathway: "recycling",
    },
    dispose: {
      headline: "Landfill — the pathway to avoid for paper",
      practicalNextStep: "Fallback only if contaminated or no program exists.",
      benefits: [],
      tradeoffs: ["Same methane dynamic as cardboard — paper in landfills is one of the costlier materials to send there."],
      assumptions: [],
      warmPathway: "landfilling",
    },
  },
  food_organic: {
    label: "Food scraps / organic waste",
    reuse: {
      headline: "Reuse isn't typically applicable",
      practicalNextStep: "Food scraps aren't reusable in the traditional sense — composting is the closer equivalent (see Recycle tab).",
      benefits: [],
      tradeoffs: ["Listed for completeness — this pathway rarely applies to food waste."],
      assumptions: [],
    },
    recycle: {
      headline: "Compost — the equivalent 'recycle' pathway for food waste",
      practicalNextStep: "Use a curbside organics program if available, or a home/community compost bin.",
      benefits: ["Composting shows a sourced net emissions reduction, and anaerobic digestion (where available) does too."],
      tradeoffs: ["Not all areas have curbside organics collection; home composting requires some ongoing effort."],
      assumptions: ["No meat/dairy if using a simple home compost setup (program-dependent)."],
      warmPathway: "composting",
    },
    dispose: {
      headline: "Landfill is the costliest pathway for food waste specifically",
      practicalNextStep: "If no composting/organics option exists, landfill is the fallback — but this is the material where that fallback costs the most in sourced data.",
      benefits: [],
      tradeoffs: [
        "Food waste has the highest sourced landfilling figure among all categories we track, because it decomposes anaerobically into methane, a short-lived but very potent greenhouse gas.",
      ],
      assumptions: [],
      warmPathway: "landfilling",
    },
  },
  textile: {
    label: "Textiles / fabric",
    reuse: {
      headline: "Reuse or donate — the strong default for textiles",
      practicalNextStep: "Donate wearable items; repurpose worn-out fabric as cleaning rags or craft material.",
      benefits: ["Textile production is highly resource-intensive (water, energy, chemical inputs), and most municipal programs don't accept textiles curbside at all, so reuse captures value that would otherwise be lost entirely."],
      tradeoffs: ["Stained or heavily worn items may not be donation-appropriate (check the organization's guidelines)."],
      assumptions: ["Item is dry and not contaminated with hazardous substances."],
    },
    recycle: {
      headline: "Textile recycling exists but is less accessible",
      practicalNextStep: "Look for a dedicated textile take-back program (some retailers and municipalities run them) rather than curbside bins.",
      benefits: ["Keeps fiber out of landfill when donation/reuse genuinely isn't viable."],
      tradeoffs: [
        "We don't have a sourced WARM emissions figure for textiles in this build (the relevant documentation chapter wasn't reachable while building this) — we're not going to invent one.",
      ],
      assumptions: ["A genuine textile-recycling drop-off is accessible to you."],
    },
    dispose: {
      headline: "Landfill — common but avoidable default",
      practicalNextStep: "This is where most unwanted textiles end up by default; reuse/donation avoids it with little extra effort.",
      benefits: [],
      tradeoffs: ["No sourced landfilling figure for textiles in this build either — see note on the Recycle tab."],
      assumptions: [],
    },
  },
  mixed_unknown: {
    label: "Unclassified material",
    reuse: {
      headline: "Insufficient information for a specific recommendation",
      practicalNextStep: "We couldn't confidently map this item to one of our tracked material categories — consider the general reuse ideas below, or correct the identification if it looks wrong.",
      benefits: [],
      tradeoffs: ["Generic guidance only — not specific to this item's actual material."],
      assumptions: [],
    },
    recycle: {
      headline: "Insufficient information for a specific recommendation",
      practicalNextStep: "Check your item's material markings (recycling triangle/number, if present) and consult your local program directly.",
      benefits: [],
      tradeoffs: ["We have no sourced impact figure or category-specific guidance for this item."],
      assumptions: [],
    },
    dispose: {
      headline: "Insufficient information for a specific recommendation",
      practicalNextStep: "When in doubt and no better option is identifiable, landfill is the typical default — but check local guidance first.",
      benefits: [],
      tradeoffs: [],
      assumptions: [],
    },
  },
};

function evidenceQualityFor(path: ScenarioPath, categoryId: ExtendedCategoryId): EvidenceQuality {
  if (categoryId === "mixed_unknown") return "none";
  if (path === "reuse") return "moderate"; // WARM doesn't model reuse; guidance is curated but not numerically sourced
  const isDataCategory = categoryId !== "textile";
  return isDataCategory ? "high" : "low";
}

function impactFigureFor(
  categoryId: ExtendedCategoryId,
  warmPathway: "recycling" | "landfilling" | "composting" | "anaerobicDigestion" | undefined
): ScenarioResult["impactFigure"] {
  if (!warmPathway) return undefined;
  if (categoryId === "textile" || categoryId === "mixed_unknown") return undefined;
  const entry = MATERIAL_IMPACT_DATA[categoryId as MaterialCategoryId];
  const value = entry.warmFigures[warmPathway];
  if (value === undefined) return undefined;
  return {
    value,
    unit: "MTCO2E per short ton",
    sourceTitle: entry.sourceTitle,
    sourceUrl: entry.sourceUrl,
    sourceExhibit: entry.sourceExhibit,
  };
}

/**
 * Applies follow-up answers (contamination, condition, etc.) to adjust
 * the recycle scenario when relevant. Kept as an explicit, testable
 * transform rather than baked into the base guidance table.
 */
function applyContaminationAdjustment(
  base: ScenarioResult,
  answers: FollowUpAnswers | undefined
): ScenarioResult {
  if (!answers) return base;
  const contaminated =
    answers["contamination"] === "yes" || answers["greasy"] === "yes";
  if (!contaminated || base.path !== "recycle") return base;

  return {
    ...base,
    headline: "Contaminated — recycling not recommended as-is",
    practicalNextStep:
      "Grease, food residue, or other contamination means this shouldn't go in standard recycling. Clean it first if realistic, or treat it as disposal instead.",
    tradeoffs: [
      ...base.tradeoffs,
      "Contaminated material can disqualify an entire batch at a materials recovery facility, not just this one item — this is a real, not theoretical, constraint.",
    ],
    evidenceQuality: "high",
  };
}

export function buildThreeFutureScenarios(
  category: string,
  itemName: string,
  followUpAnswers?: FollowUpAnswers
): ThreeFutureScenarios {
  const { id } = classifyMaterial(category, itemName);
  const guidance = GUIDANCE[id];

  const reuse: ScenarioResult = {
    path: "reuse",
    headline: guidance.reuse.headline,
    practicalNextStep: guidance.reuse.practicalNextStep,
    benefits: guidance.reuse.benefits,
    tradeoffs: guidance.reuse.tradeoffs,
    assumptions: guidance.reuse.assumptions,
    evidenceQuality: evidenceQualityFor("reuse", id),
    noDataReason:
      "WARM (our sourced data model) doesn't quantify reuse as an end-of-life pathway — it models recycling, composting, combustion, and landfilling only. This guidance is curated, not numerically sourced.",
  };

  const recycleRaw: ScenarioResult = {
    path: "recycle",
    headline: guidance.recycle.headline,
    practicalNextStep: guidance.recycle.practicalNextStep,
    benefits: guidance.recycle.benefits,
    tradeoffs: guidance.recycle.tradeoffs,
    assumptions: guidance.recycle.assumptions,
    evidenceQuality: evidenceQualityFor("recycle", id),
    impactFigure: impactFigureFor(id, guidance.recycle.warmPathway),
    noDataReason: !guidance.recycle.warmPathway
      ? "No sourced WARM figure available for this material/pathway combination."
      : undefined,
  };
  const recycle = applyContaminationAdjustment(recycleRaw, followUpAnswers);

  const dispose: ScenarioResult = {
    path: "dispose",
    headline: guidance.dispose.headline,
    practicalNextStep: guidance.dispose.practicalNextStep,
    benefits: guidance.dispose.benefits,
    tradeoffs: guidance.dispose.tradeoffs,
    assumptions: guidance.dispose.assumptions,
    evidenceQuality: evidenceQualityFor("dispose", id),
    impactFigure: impactFigureFor(id, guidance.dispose.warmPathway),
    noDataReason: !guidance.dispose.warmPathway
      ? "No sourced WARM figure available for this material/pathway combination."
      : undefined,
  };

  return {
    materialCategoryLabel: guidance.label,
    scenarios: [reuse, recycle, dispose],
    unmappedCategory: id === "mixed_unknown",
  };
}
