import { LocalRuleResult } from "../types";
import { LocalRulesProvider, LocalRulesQuery } from "./provider";

/**
 * Honest, explicitly-labeled fallback provider: asks Gemini for
 * general, typical guidance (not a live municipal lookup). Always
 * returns confidence: "general_guidance", never "verified" — there is
 * no live source backing this, by design.
 */
export class GeminiGeneralGuidanceProvider implements LocalRulesProvider {
  readonly name = "General guidance (not a live municipal lookup)";

  async lookup(query: LocalRulesQuery): Promise<LocalRuleResult> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return {
        confidence: "unknown",
        guidance: `We don't have live recycling data for ${query.location} yet, but most local programs post accepted materials on their city or waste-hauler website — search "${query.location} recycling guide" to confirm.`,
        limitationNote: "No GEMINI_API_KEY configured on this deployment.",
      };
    }

    const prompt = `A person in ${query.location} wants to know how a "${query.item}" (category: ${query.category}) is
typically handled by local waste/recycling programs in that area.

Give general, typical guidance in 2-3 short sentences — e.g. whether this type of item is
usually accepted curbside, needs drop-off, or is commonly excluded in that region. Do NOT invent
specific municipal program names, exact bin colors, or pickup schedules you cannot verify.
Be honest that this is general/typical guidance, not an official lookup, and that the person
should confirm with their local hauler or city website.

Respond with ONLY a JSON object, no prose, no markdown fences:
{ "guidance": string }`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: { guidance: { type: "STRING" } },
              required: ["guidance"],
            },
            temperature: 0.3,
            maxOutputTokens: 400,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      throw new Error(`Gemini API error: ${response.status} ${errorBody.slice(0, 300)}`);
    }

    const data = await response.json();
    const raw: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
    const cleaned = raw.replace(/```json|```/g, "").trim();

    console.log("[local-rules] raw Gemini text:", raw.slice(0, 500));

    if (!cleaned) {
      throw new Error("Gemini returned an empty response for local-rules guidance.");
    }

    let parsed: { guidance?: string };
    try {
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      throw new Error(
        `Failed to parse Gemini's local-rules response as JSON: ${
          (parseErr as Error).message
        }. Raw: ${cleaned.slice(0, 200)}`
      );
    }

    return {
      confidence: "general_guidance",
      guidance:
        parsed.guidance ||
        `We couldn't generate specific guidance for ${query.location} — check your local hauler's website to confirm.`,
      limitationNote:
        "This is AI-generated general/typical guidance based on common patterns, not a live lookup against your city's actual program. We don't have an integration with an official municipal or waste-provider data source in this deployment — see the Methodology page for what would be needed to add one.",
    };
  }
}
