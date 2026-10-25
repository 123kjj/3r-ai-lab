import { MATERIAL_IMPACT_DATA, type MaterialCategoryId } from "./materialData";

/**
 * Sourced, per-item emissions estimate.
 *
 * Method: EPA WARM net GHG figures are MTCO2E per SHORT TON. Convert to
 * kg CO2e per pound (1 short ton = 2000 lb; 1 MT = 1000 kg => x 0.5),
 * then report the DIFFERENCE between landfilling the item and the
 * chosen pathway. Only computed when WARM publishes both figures.
 * Reuse is never quantified (WARM does not model it).
 */
export type ImpactPathway = "recycling" | "composting" | "anaerobicDigestion";

export interface ImpactEstimate {
  available: true;
  kgCO2ePerLb: number;      // pathway - landfill, negative = savings
  kgCO2eSaved: number;      // positive number = emissions avoided vs landfill
  weightLb: number;
  pathway: ImpactPathway;
  sourceUrl: string;
  caveat: string;
}
export interface ImpactUnavailable {
  available: false;
  reason: string;
}

export const KG_PER_LB_FACTOR = 0.5;

export function estimateImpact(
  materialId: MaterialCategoryId | "textile" | "mixed_unknown",
  pathway: ImpactPathway,
  weightLb: number
): ImpactEstimate | ImpactUnavailable {
  if (!Number.isFinite(weightLb) || weightLb <= 0) {
    return { available: false, reason: "Enter a weight above zero." };
  }
  if (materialId === "textile" || materialId === "mixed_unknown") {
    return { available: false, reason: "No sourced EPA WARM figure for this material, so we don't estimate." };
  }
  const entry = MATERIAL_IMPACT_DATA[materialId];
  const chosen = entry.warmFigures[pathway];
  const landfill = entry.warmFigures.landfilling;
  if (chosen === undefined || landfill === undefined) {
    return { available: false, reason: "WARM doesn't publish both figures needed for this comparison." };
  }
  const perLb = (chosen - landfill) * KG_PER_LB_FACTOR;
  return {
    available: true,
    kgCO2ePerLb: perLb,
    kgCO2eSaved: -perLb * weightLb,
    weightLb,
    pathway,
    sourceUrl: entry.sourceUrl,
    caveat:
      "National-average category estimate vs. landfilling, not a measurement of your item. Actual results vary by local facility and contamination.",
  };
}
