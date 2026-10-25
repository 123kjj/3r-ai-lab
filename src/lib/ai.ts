import { AnalyzeItemResult } from "./types";
import { MOCK_RESULTS, UNCERTAIN_RESULT } from "./mockData";

/**
 * ────────────────────────────────────────────────────────────────
 * analyzeItem(image)
 * ────────────────────────────────────────────────────────────────
 * Single entry point used by the Scan page. It automatically uses
 * the real AI vision API when ANTHROPIC_API_KEY is configured on
 * the server, and falls back to realistic mock data otherwise so
 * the whole app can be demoed with zero setup.
 *
 * image: a base64 data URL (e.g. "data:image/jpeg;base64,...")
 */
export async function analyzeItem(image: string): Promise<AnalyzeItemResult> {
  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image }),
    });

    if (!response.ok) {
      throw new Error(`Analyze request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data as AnalyzeItemResult;
  } catch (err) {
    console.error("analyzeItem failed:", err);
    throw err;
  }
}

/**
 * ────────────────────────────────────────────────────────────────
 * MOCK AI FUNCTION (demo mode)
 * ────────────────────────────────────────────────────────────────
 * Used automatically by the /api/analyze route whenever
 * ANTHROPIC_API_KEY is not configured. Picks a realistic example so
 * the entire scan → result → action flow can be demoed reliably.
 *
 * This function never calls a network API — it's pure and instant,
 * which is also useful for local development and tests.
 */
export function mockAnalyzeItem(image: string): AnalyzeItemResult {
  // Roughly 1-in-8 chance of an "uncertain" result so that flow is
  // demoable too, unless the image is empty.
  if (!image) return UNCERTAIN_RESULT;

  const shouldBeUncertain = Math.random() < 0.12;
  if (shouldBeUncertain) return UNCERTAIN_RESULT;

  // Deterministic-ish pick based on a simple hash of the image string
  // length, so repeated uploads of the same image feel consistent
  // during a demo instead of fully random each time.
  const index = Math.abs(hashCode(image)) % MOCK_RESULTS.length;
  return MOCK_RESULTS[index];
}

function hashCode(str: string): number {
  let hash = 0;
  // Sampling every 97th character keeps this fast on large data URLs.
  for (let i = 0; i < str.length; i += 97) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

/**
 * ────────────────────────────────────────────────────────────────
 * REAL AI FUNCTION (production)
 * ────────────────────────────────────────────────────────────────
 * This is called server-side from src/app/api/analyze/route.ts, never
 * directly from the browser, so the API key stays secret.
 *
 * Uses Google's Gemini API (gemini-3.6-flash) with vision. Get a free key
 * at https://aistudio.google.com/apikey and set GEMINI_API_KEY in .env.local.
 * Swap the model/provider here if you prefer a different vision API —
 * this is the only place that needs to change.
 */
export async function realAnalyzeItem(
  imageBase64: string,
  mediaType: string,
  locationHint?: string
): Promise<AnalyzeItemResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  return callGemini(apiKey, imageBase64, mediaType, locationHint);
}

async function callGemini(
  apiKey: string,
  imageBase64: string,
  mediaType: string,
  locationHint?: string
): Promise<AnalyzeItemResult> {
  const prompt = `You are the vision engine behind 3R AI, an app that helps people
decide whether to REDUCE, REUSE, or RECYCLE an everyday item, based on a photo they took.

FIRST, look carefully at the actual photo before answering. Note to yourself (silently,
do not include this in your output):
- Shape and proportions (tall and narrow? flat? tube-shaped? boxy?)
- Material and texture (glossy plastic, matte cardboard/paper, glass, fabric, metal, etc.)
- Color and any visible printing, labels, or text
- Whether it has an opening, cap, lid, seam, or is hollow

Do NOT default to a generic guess (like "plastic water bottle" or "aluminum can") unless
the photo actually shows that shape and material combination clearly. A cardboard tube,
for example, is a hollow paper cylinder with no cap and a matte, fibrous texture — visibly
different from a rigid, glossy plastic bottle. Base your answer only on what is visibly in
THIS photo, not on what is statistically common.

Respond with ONLY a JSON object (no prose, no markdown fences) matching exactly this shape:

{
  "itemName": string (be specific and describe what you actually see, e.g. "Cardboard toilet paper tube" not just "Cardboard"),
  "category": string,
  "bestAction": "reduce" | "reuse" | "recycle",
  "confidence": number between 0 and 1 (your genuine confidence based on what's visible — do not inflate it),
  "explanation": string (1-2 sentences, referencing what you actually observed in the photo),
  "reduceAdvice": string,
  "reuseAdvice": string,
  "recycleAdvice": string,
  "reuseIdeas": string[] (3 to 5 short practical ideas specific to this item's actual shape/material),
  "environmentalImpact": string (1 short sentence with a concrete comparison),
  "localRuleWarning": string (1 short sentence noting that recycling rules vary by location;
    if a location was provided, tailor it lightly but do not invent specific municipal rules
    you are not certain about)
}

If you genuinely cannot tell what the item is from the photo, set "confidence" below 0.5 and
set "itemName" to "Unknown item" — do not guess wildly. Never claim an item is recyclable
everywhere; recycling rules vary by location and you do not have live local data.
${locationHint ? `The user's general location is: ${locationHint}.` : "No location was provided."}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Newer "AQ."-prefixed Google AI Studio keys are rejected when
        // passed as a ?key= query param — they must go in this header.
        // Older "AIzaSy"-prefixed keys accept this header too, so this
        // works for both key formats.
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { inline_data: { mime_type: mediaType, data: imageBase64 } },
              { text: prompt },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          // responseSchema forces Gemini to emit strictly valid JSON
          // matching this exact shape (constrained decoding on Google's
          // side), instead of just being asked nicely in the prompt.
          // Without this, free-text fields occasionally contain an
          // unescaped quote that breaks JSON.parse — this fixes that.
          responseSchema: {
            type: "OBJECT",
            properties: {
              itemName: { type: "STRING" },
              category: { type: "STRING" },
              bestAction: { type: "STRING", enum: ["reduce", "reuse", "recycle"] },
              confidence: { type: "NUMBER" },
              explanation: { type: "STRING" },
              reduceAdvice: { type: "STRING" },
              reuseAdvice: { type: "STRING" },
              recycleAdvice: { type: "STRING" },
              reuseIdeas: { type: "ARRAY", items: { type: "STRING" } },
              environmentalImpact: { type: "STRING" },
              localRuleWarning: { type: "STRING" },
            },
            required: [
              "itemName",
              "category",
              "bestAction",
              "confidence",
              "explanation",
              "reduceAdvice",
              "reuseAdvice",
              "recycleAdvice",
              "reuseIdeas",
              "environmentalImpact",
              "localRuleWarning",
            ],
          },
          // Lower temperature = less "creative"/random guessing, more
          // grounded in what's actually visible in the photo.
          temperature: 0.15,
          // Raised from 1024: with responseSchema enforcing several
          // multi-sentence fields plus a 3-5 item reuseIdeas array, 1024
          // tokens was sometimes hit before the JSON object finished,
          // producing a truncated/unterminated-string JSON parse error.
          maxOutputTokens: 2048,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new Error(
      `AI vision API error: ${response.status} ${errorBody.slice(0, 300)}`
    );
  }

  const data = await response.json();
  const raw: string =
    data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  const cleaned = raw.replace(/```json|```/g, "").trim();

  // Log what Gemini actually returned so failures/misidentifications can
  // be diagnosed from the terminal instead of guessed at.
  console.log(
    "[realAnalyzeItem] raw Gemini text (first 500 chars):",
    raw.slice(0, 500)
  );

  if (!cleaned) {
    throw new Error(
      "Gemini returned an empty response (no candidates/text) — possibly blocked or an unsupported image."
    );
  }

  let parsed: AnalyzeItemResult;
  try {
    parsed = JSON.parse(cleaned) as AnalyzeItemResult;
  } catch (parseErr) {
    throw new Error(
      `Failed to parse Gemini's response as JSON: ${
        (parseErr as Error).message
      }. Raw response started with: ${cleaned.slice(0, 200)}`
    );
  }

  console.log(
    `[realAnalyzeItem] parsed itemName="${parsed.itemName}" confidence=${parsed.confidence}`
  );

  if (parsed.confidence < 0.5) parsed.uncertain = true;
  return parsed;
}
