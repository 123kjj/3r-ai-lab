import { LocalRuleResult } from "../types";

/**
 * ────────────────────────────────────────────────────────────────
 * LOCAL REALITY CHECK — provider interface
 * ────────────────────────────────────────────────────────────────
 * This is the extensibility point the spec asks for: a real,
 * live-municipal-data provider (e.g. a partnership with Earth911,
 * Recycle Coach, or a city's own open-data API) can be added later
 * by implementing this same interface and registering it in
 * `getLocalRulesProvider()` below — no other code needs to change.
 *
 * As of this build, no such live-data account/API key is available,
 * so the only registered provider is `GeminiGeneralGuidanceProvider`,
 * which is explicitly NOT a live municipal lookup and labels its
 * output `confidence: "general_guidance"` accordingly. The UI must
 * never present general_guidance output as if it were verified.
 */
export interface LocalRulesQuery {
  item: string;
  category: string;
  location: string;
}

export interface LocalRulesProvider {
  /** Human-readable name shown in "what source gave us this" contexts. */
  readonly name: string;
  lookup(query: LocalRulesQuery): Promise<LocalRuleResult>;
}

/**
 * A provider that always returns an honest "we don't have a verified
 * local source for this" result. Used if no API key is configured at
 * all, so the app never silently pretends to have guidance.
 */
export class NoDataProvider implements LocalRulesProvider {
  readonly name = "No data source configured";
  async lookup(query: LocalRulesQuery): Promise<LocalRuleResult> {
    return {
      confidence: "unknown",
      guidance: `We don't have a configured guidance source for ${query.location} right now.`,
      limitationNote:
        "No live municipal data source or general-guidance model is configured for this deployment.",
    };
  }
}
