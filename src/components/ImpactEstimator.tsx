"use client";

import { useMemo, useState } from "react";
import { classifyMaterial } from "@/lib/scenarioEngine";
import { estimateImpact, type ImpactPathway } from "@/lib/impactEstimate";

interface Props {
  category: string;
  itemName: string;
  /** Reports the estimate (kg CO2e avoided vs landfill) or undefined when none. */
  onEstimate: (kg: number | undefined) => void;
}

export function ImpactEstimator({ category, itemName, onEstimate }: Props) {
  const [ounces, setOunces] = useState("");
  const { id } = classifyMaterial(category, itemName);
  const pathway: ImpactPathway = id === "food_organic" ? "composting" : "recycling";

  const estimate = useMemo(() => {
    const oz = parseFloat(ounces);
    return estimateImpact(id, pathway, oz / 16);
  }, [id, pathway, ounces]);

  const noData = id === "textile" || id === "mixed_unknown";

  return (
    <section className="border border-charcoal-200 bg-white p-5" aria-labelledby="estimator-heading">
      <h3 id="estimator-heading" className="font-serif text-xl font-semibold text-forest-900">
        Estimate the emissions difference
      </h3>
      {noData ? (
        <p className="mt-2 text-sm text-charcoal-600">
          EPA WARM has no figure we could source for this material, so we don&rsquo;t estimate one.
          Showing no number is better than showing a made-up one.
        </p>
      ) : (
        <>
          <p className="mt-1 text-sm text-charcoal-600">
            Weigh it (or guess) in ounces to see the {pathway === "composting" ? "composting" : "recycling"} vs.
            landfill difference for this material category.
          </p>
          <div className="mt-3 flex items-center gap-3">
            <label htmlFor="oz" className="text-sm text-charcoal-700">Weight (oz)</label>
            <input
              id="oz"
              type="number"
              min="0"
              step="0.1"
              inputMode="decimal"
              value={ounces}
              onChange={(e) => {
                setOunces(e.target.value);
                const r = estimateImpact(id, pathway, parseFloat(e.target.value) / 16);
                onEstimate(r.available ? r.kgCO2eSaved : undefined);
              }}
              className="w-28 border border-charcoal-300 px-3 py-2 text-sm"
            />
          </div>
          {estimate.available && (
            <p className="mt-3 text-sm text-charcoal-800" role="status">
              <span className="font-mono text-lg font-semibold text-forest-900">
                ≈ {estimate.kgCO2eSaved < 0.01 ? "<0.01" : estimate.kgCO2eSaved.toFixed(2)} kg CO₂e
              </span>{" "}
              avoided vs. landfilling.{" "}
              <a href={estimate.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline">
                EPA WARM source
              </a>
              <span className="mt-1 block text-xs text-charcoal-500">{estimate.caveat}</span>
            </p>
          )}
        </>
      )}
    </section>
  );
}
