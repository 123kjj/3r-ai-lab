import { NextRequest, NextResponse } from "next/server";
import { getLocalRulesProvider } from "@/lib/localRules";
import { LocalRuleResult } from "@/lib/types";

export const runtime = "nodejs";

/**
 * POST /api/local-rules
 * body: { item: string, category: string, location: string }
 *
 * Delegates to whichever LocalRulesProvider is configured (see
 * src/lib/localRules/index.ts). Currently that's always a
 * general-guidance provider, never a verified live municipal lookup —
 * the response's `confidence` field makes that distinction explicit
 * so the UI never overstates what it actually knows.
 */
export async function POST(req: NextRequest) {
  try {
    const { item, category, location } = await req.json();

    if (!location || typeof location !== "string" || !location.trim()) {
      return NextResponse.json({ error: "Please enter a city or state." }, { status: 400 });
    }

    const provider = getLocalRulesProvider();
    const result = await provider.lookup({ item, category, location });
    return NextResponse.json(result);
  } catch (err) {
    console.error("/api/local-rules error:", err);
    const fallback: LocalRuleResult = {
      confidence: "unknown",
      guidance:
        "We couldn't reach the guidance service right now. Most local programs post accepted materials on their city or waste-hauler website.",
      limitationNote: "The guidance provider threw an error; see server logs for details.",
    };
    return NextResponse.json(fallback);
  }
}
