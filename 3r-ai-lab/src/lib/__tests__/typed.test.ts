import { describe, it, expect } from "vitest";
import { buildTypedResult } from "../manualSelection";
describe("buildTypedResult", () => {
  it("maps typed items to sourced categories", () => {
    expect(buildTypedResult("soda can").category).toBe("Aluminum");
    expect(buildTypedResult("banana peel").category).toBe("Food scraps");
  });
  it("does not guess unknown items", () => {
    expect(buildTypedResult("flux capacitor").category).toBe("Unclassified");
  });
});
