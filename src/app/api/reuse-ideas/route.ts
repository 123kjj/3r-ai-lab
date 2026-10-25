import { NextRequest, NextResponse } from "next/server";
import { REUSE_LIBRARY } from "@/lib/mockData";

export const runtime = "nodejs";

/**
 * POST /api/reuse-ideas
 * body: { item: string, exclude?: string[] }
 *
 * Uses the real AI text API when ANTHROPIC_API_KEY is configured,
 * otherwise returns fresh picks from the local mock idea library.
 */
export async function POST(req: NextRequest) {
  try {
    const { item, exclude = [] } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      const pool = REUSE_LIBRARY[item] ?? [];
      const fresh = pool.filter((idea: string) => !exclude.includes(idea));
      const ideas = (fresh.length ? fresh : pool).slice(0, 4);
      return NextResponse.json({ ideas });
    }

    const prompt = `You suggest creative, safe, practical household reuse ideas for the 3R AI app.
Give 4 new creative reuse ideas for a "${item}". Do not repeat any of these already-shown ideas: ${exclude.join(
      "; "
    )}
Respond with ONLY a JSON array of 4 short strings, no prose, no markdown fences.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // "AQ."-prefixed keys are rejected as a ?key= query param; must
          // go in this header (works for "AIzaSy" keys too).
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            // Forces a strictly valid JSON array of strings, avoiding
            // stray-quote JSON parse failures seen elsewhere in this app.
            responseSchema: { type: "ARRAY", items: { type: "STRING" } },
          },
        }),
      }
    );

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      throw new Error(`AI text API error: ${response.status} ${errorBody.slice(0, 300)}`);
    }

    const data = await response.json();
    const raw: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "[]";
    const cleaned = raw.replace(/```json|```/g, "").trim();

    console.log("[reuse-ideas] raw Gemini text:", raw.slice(0, 500));

    let ideas: string[];
    try {
      ideas = JSON.parse(cleaned);
    } catch (parseErr) {
      throw new Error(
        `Failed to parse Gemini's reuse-ideas response as JSON: ${
          (parseErr as Error).message
        }. Raw: ${cleaned.slice(0, 200)}`
      );
    }
    return NextResponse.json({ ideas });
  } catch (err) {
    console.error("/api/reuse-ideas error:", err);
    return NextResponse.json({ ideas: [] });
  }
}
