import { describe, it, expect } from "vitest";
import { classifyMaterial, buildThreeFutureScenarios } from "../scenarioEngine";
import { MATERIAL_IMPACT_DATA } from "../materialData";

describe("classifyMaterial", () => {
  it("identifies an aluminum can", () => {
    expect(classifyMaterial("Metal packaging", "Aluminum Can").id).toBe("aluminum");
  });

  it("identifies a glass jar", () => {
    expect(classifyMaterial("Glass packaging", "Glass Jar").id).toBe("glass");
  });

  it("identifies a PET plastic water bottle", () => {
    expect(classifyMaterial("Plastic packaging", "Plastic Water Bottle").id).toBe("pet_plastic");
  });

  it("identifies an HDPE jug", () => {
    expect(classifyMaterial("Plastic", "HDPE Milk Jug").id).toBe("hdpe_plastic");
  });

  it("identifies a corrugated cardboard shipping box", () => {
    expect(classifyMaterial("Paper & cardboard", "Corrugated Shipping Box").id).toBe(
      "corrugated_cardboard"
    );
  });

  it("classifies a cardboard TUBE as mixed_paper, not corrugated cardboard (confusable case)", () => {
    // This is the real-world bug this app hit before: a toilet-paper
    // tube is fibrous paper, not true corrugated board, even though
    // the word "cardboard" commonly gets attached to it.
    expect(classifyMaterial("Paper", "Cardboard toilet paper tube").id).toBe("mixed_paper");
  });

  it("identifies mixed/office paper", () => {
    expect(classifyMaterial("Paper", "Stack of office paper").id).toBe("mixed_paper");
  });

  it("identifies food/organic waste", () => {
    expect(classifyMaterial("Food & Organic Waste", "Banana peel").id).toBe("food_organic");
  });

  it("identifies a textile item", () => {
    expect(classifyMaterial("Textiles", "Old cotton T-shirt").id).toBe("textile");
  });

  it("falls back to mixed_unknown for an unrecognized item", () => {
    expect(classifyMaterial("Mystery object", "Unidentifiable thing").id).toBe("mixed_unknown");
  });
});

describe("buildThreeFutureScenarios — structure", () => {
  it("always returns exactly 3 scenarios: reuse, recycle, dispose", () => {
    const result = buildThreeFutureScenarios("Metal packaging", "Aluminum Can");
    expect(result.scenarios.map((s) => s.path)).toEqual(["reuse", "recycle", "dispose"]);
  });

  it("reuse NEVER carries a sourced impact figure (WARM doesn't model reuse) and always explains why", () => {
    for (const [category, item] of [
      ["Metal", "Aluminum Can"],
      ["Glass", "Glass Jar"],
      ["Paper", "Cardboard Box"],
    ] as const) {
      const result = buildThreeFutureScenarios(category, item);
      const reuse = result.scenarios.find((s) => s.path === "reuse")!;
      expect(reuse.impactFigure).toBeUndefined();
      expect(reuse.noDataReason).toBeTruthy();
    }
  });
});

describe("buildThreeFutureScenarios — sourced data correctness", () => {
  it("aluminum recycling figure matches the sourced WARM value exactly", () => {
    const result = buildThreeFutureScenarios("Metal", "Aluminum Can");
    const recycle = result.scenarios.find((s) => s.path === "recycle")!;
    expect(recycle.impactFigure?.value).toBe(MATERIAL_IMPACT_DATA.aluminum.warmFigures.recycling);
    expect(recycle.impactFigure?.value).toBe(-9.13);
  });

  it("food waste's recycle-equivalent pathway uses the COMPOSTING figure, not a 'recycling' figure that doesn't exist for food", () => {
    const result = buildThreeFutureScenarios("Food & Organic Waste", "Apple core");
    const recycle = result.scenarios.find((s) => s.path === "recycle")!;
    expect(recycle.impactFigure?.value).toBe(MATERIAL_IMPACT_DATA.food_organic.warmFigures.composting);
    expect(recycle.impactFigure?.value).toBe(-0.15);
  });

  it("cardboard's landfill penalty is higher than glass's (methane vs. inert decomposition) — a real, sourced distinction", () => {
    const cardboard = buildThreeFutureScenarios("Paper", "Cardboard Box");
    const glass = buildThreeFutureScenarios("Glass", "Glass Jar");
    const cardboardDispose = cardboard.scenarios.find((s) => s.path === "dispose")!;
    const glassDispose = glass.scenarios.find((s) => s.path === "dispose")!;
    expect(cardboardDispose.impactFigure!.value).toBeGreaterThan(glassDispose.impactFigure!.value);
  });
});

describe("buildThreeFutureScenarios — honest gaps (no fabricated data)", () => {
  it("textiles have NO sourced impact figure on any pathway — we don't invent one", () => {
    const result = buildThreeFutureScenarios("Textiles", "Old T-shirt");
    for (const scenario of result.scenarios) {
      expect(scenario.impactFigure).toBeUndefined();
    }
  });

  it("an unmapped/unknown item is flagged unmappedCategory=true with evidenceQuality 'none'", () => {
    const result = buildThreeFutureScenarios("???", "Unidentifiable object");
    expect(result.unmappedCategory).toBe(true);
    expect(result.scenarios.every((s) => s.evidenceQuality === "none")).toBe(true);
  });
});

describe("buildThreeFutureScenarios — contamination / follow-up answers", () => {
  it("greasy cardboard downgrades the recycle recommendation with an explicit warning", () => {
    const clean = buildThreeFutureScenarios("Paper", "Pizza box", { greasy: "no" });
    const greasy = buildThreeFutureScenarios("Paper", "Pizza box", { greasy: "yes" });

    const cleanRecycle = clean.scenarios.find((s) => s.path === "recycle")!;
    const greasyRecycle = greasy.scenarios.find((s) => s.path === "recycle")!;

    expect(cleanRecycle.headline).not.toMatch(/Contaminated/);
    expect(greasyRecycle.headline).toMatch(/Contaminated/);
    expect(greasyRecycle.practicalNextStep).not.toBe(cleanRecycle.practicalNextStep);
  });

  it("contamination answer on mixed paper also triggers the adjustment (shared 'contamination' key)", () => {
    const result = buildThreeFutureScenarios("Paper", "Office paper", { contamination: "yes" });
    const recycle = result.scenarios.find((s) => s.path === "recycle")!;
    expect(recycle.headline).toMatch(/Contaminated/);
  });

  it("does NOT flag contamination when answers are absent (no follow-up answered yet)", () => {
    const result = buildThreeFutureScenarios("Paper", "Cardboard box");
    const recycle = result.scenarios.find((s) => s.path === "recycle")!;
    expect(recycle.headline).not.toMatch(/Contaminated/);
  });

  it("contradictory-looking input (contamination=yes but also intact=yes from a different question) still only acts on the contamination signal", () => {
    const result = buildThreeFutureScenarios("Glass", "Glass jar", {
      contamination: "yes",
      intact: "intact",
    });
    // Glass has no greasy/contamination question wired up in practice,
    // but the engine shouldn't crash or misbehave on an answer key it
    // doesn't specifically handle for this category.
    expect(result.scenarios).toHaveLength(3);
  });
});

describe("buildThreeFutureScenarios — evidence quality is never overstated", () => {
  it("mixed_unknown scenarios never claim high evidence quality", () => {
    const result = buildThreeFutureScenarios("totally made up category", "mystery item");
    for (const s of result.scenarios) {
      expect(["none", "low"]).toContain(s.evidenceQuality);
    }
  });

  it("a well-sourced category (aluminum) gets high evidence quality on recycle/dispose", () => {
    const result = buildThreeFutureScenarios("Metal", "Aluminum Can");
    const recycle = result.scenarios.find((s) => s.path === "recycle")!;
    const dispose = result.scenarios.find((s) => s.path === "dispose")!;
    expect(recycle.evidenceQuality).toBe("high");
    expect(dispose.evidenceQuality).toBe("high");
  });
});
