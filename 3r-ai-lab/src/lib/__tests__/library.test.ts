import { describe, it, expect } from "vitest";
import { ITEM_LIBRARY, lookupItem, suggestItems } from "../itemLibrary";
import { RULES, RULES_BY_ID, CORE_RULES } from "../rules";
import { CRAFTS_BY_ID } from "../crafts";
import { hasCraftArt } from "../../components/CraftArt";
import { binFor, GAME_ITEMS, pickRound, blindSpot, isCorrect, beltSeconds, starsFor } from "../sortRush";
import { applyEvent, EMPTY_PROGRESS, planetStage } from "../progress";
import { BADGES } from "../badges";
import { buildTypedResult } from "../manualSelection";

describe("rules + library integrity", () => {
  it("has 18 core rules and unique rule ids", () => {
    expect(CORE_RULES.length).toBe(18);
    expect(new Set(RULES.map((r) => r.id)).size).toBe(RULES.length);
  });
  it("every item references real rules and real crafts", () => {
    for (const i of ITEM_LIBRARY) {
      expect(i.rules.length).toBeGreaterThan(0);
      for (const r of i.rules) expect(RULES_BY_ID[r], `${i.names[0]} -> ${r}`).toBeTruthy();
      if (i.craft) expect(CRAFTS_BY_ID[i.craft], `${i.names[0]} -> ${i.craft}`).toBeTruthy();
      expect(i.why.length).toBeGreaterThan(10);
    }
  });
  it("crafts flagged with art actually have art", () => {
    for (const c of Object.values(CRAFTS_BY_ID)) expect(hasCraftArt(c.id), c.id).toBe(c.art);
  });
  it("has 200+ distinct typeable names", () => {
    const names = new Set(ITEM_LIBRARY.flatMap((i) => i.names.map((n) => n.toLowerCase())));
    expect(names.size).toBeGreaterThan(200);
  });
});

describe("lookup", () => {
  it("finds student items and aliases", () => {
    expect(lookupItem("boba cup")?.disp).toBe("trash");
    expect(lookupItem("AirPods")?.disp).toBe("dropoff");
    expect(lookupItem("a disposable vape")?.disp).toBe("dropoff");
    expect(lookupItem("Energy drink cans")?.material).toBe("aluminum");
    expect(lookupItem("my old hoodie")?.disp).toBe("reuse");
  });
  it("doesn't guess for unknown things", () => {
    expect(lookupItem("flux capacitor")).toBeNull();
    expect(lookupItem("")).toBeNull();
  });
  it("suggests close items", () => {
    expect(suggestItems("bobba tea")).toContain("boba cup");
  });
  it("gives no junk suggestions for nonsense", () => {
    expect(suggestItems("flux capacitor")).toEqual([]);
  });
  it("typed result carries rule, disposition and craft", () => {
    const r = buildTypedResult("glass jar");
    expect(r.ruleIds?.length).toBeGreaterThan(0);
    expect(r.disposition).toBe("reuse");
    expect(r.craftId).toBe("jar-pencil-holder");
  });
});

describe("sort rush + progress", () => {
  it("game items all map to a bin and have rules", () => {
    expect(GAME_ITEMS.length).toBeGreaterThanOrEqual(30);
    for (const i of GAME_ITEMS) expect(binFor(i.disp)).not.toBeNull();
  });
  it("rounds are varied and sized", () => {
    const r = pickRound(10);
    expect(r.length).toBe(10);
    expect(new Set(r.map((x) => x.names[0])).size).toBe(10);
  });
  it("blind spot comes from actual misses", () => {
    const item = GAME_ITEMS[0];
    expect(blindSpot([{ item, chosen: "trash", correct: false }])?.ruleId).toBe(item.rules[0]);
    expect(blindSpot([{ item, chosen: binFor(item.disp)!, correct: isCorrect(item, binFor(item.disp)!) }])).toBeNull();
  });
  it("learning a rule needs 3 correct, badges follow", () => {
    let p = EMPTY_PROGRESS;
    for (let i = 0; i < 3; i++) p = applyEvent(p, { type: "sort", correct: true, ruleId: "grease" }, i + 1);
    expect(p.rulesLearned).toContain("grease");
    expect(BADGES.find((b) => b.id === "rule-grease")!.earned(p)).toBe(true);
    expect(BADGES.find((b) => b.id === "streak-5")!.earned(p)).toBe(false);
    expect(planetStage(0)).toBe(0);
    expect(planetStage(12)).toBe(3);
  });
  it("belt speeds up but never below the floor; stars scale with score", () => {
    expect(beltSeconds(0)).toBeGreaterThan(beltSeconds(5));
    expect(beltSeconds(50)).toBe(3.2);
    expect(starsFor(12, 12)).toBe(3);
    expect(starsFor(0, 12)).toBe(0);
    expect(starsFor(8, 12)).toBe(2);
  });
});
