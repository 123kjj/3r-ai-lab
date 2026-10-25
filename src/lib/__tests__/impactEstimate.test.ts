import { describe, it, expect } from "vitest";
import { estimateImpact } from "../impactEstimate";

describe("estimateImpact", () => {
  it("aluminum recycling vs landfill: (-9.13-0.02)*0.5 per lb", () => {
    const r = estimateImpact("aluminum", "recycling", 1);
    expect(r.available).toBe(true);
    if (r.available) expect(r.kgCO2eSaved).toBeCloseTo(4.575, 3);
  });
  it("scales linearly with weight", () => {
    const a = estimateImpact("glass", "recycling", 1);
    const b = estimateImpact("glass", "recycling", 4);
    if (a.available && b.available) expect(b.kgCO2eSaved).toBeCloseTo(a.kgCO2eSaved * 4, 6);
  });
  it("food composting vs landfill: (-0.15-0.50)*0.5", () => {
    const r = estimateImpact("food_organic", "composting", 2);
    if (r.available) expect(r.kgCO2eSaved).toBeCloseTo(0.65, 3);
  });
  it("refuses unsourced materials", () => {
    expect(estimateImpact("textile", "recycling", 1).available).toBe(false);
    expect(estimateImpact("mixed_unknown", "recycling", 1).available).toBe(false);
  });
  it("refuses missing pathway data and bad weight", () => {
    expect(estimateImpact("aluminum", "composting", 1).available).toBe(false);
    expect(estimateImpact("aluminum", "recycling", 0).available).toBe(false);
    expect(estimateImpact("aluminum", "recycling", NaN).available).toBe(false);
  });
});
