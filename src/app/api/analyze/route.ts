import { NextRequest, NextResponse } from "next/server";
import { realAnalyzeItem } from "@/lib/ai";

export const runtime = "nodejs";
export const maxDuration = 30;

/**
 * POST /api/analyze
 * body: { image: string (data URL), location?: string }
 *
 * Real Gemini vision call, with one retry on transient failure. On
 * failure we return an honest error (never a fake "example" result);
 * the UI then offers Retry and a manual material picker.
 */
export async function POST(req: NextRequest) {
  try {
    const { image, location } = await req.json();

    if (!image || typeof image !== "string") {
      return NextResponse.json({ error: "No image was provided." }, { status: 400 });
    }
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "AI analysis is not configured on this server." }, { status: 503 });
    }
    const match = image.match(/^data:(.+);base64,(.*)$/);
    if (!match) {
      return NextResponse.json({ error: "Unsupported image format." }, { status: 400 });
    }
    const [, mediaType, base64Data] = match;

    let lastErr: unknown;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const result = await realAnalyzeItem(base64Data, mediaType, location);
        return NextResponse.json(result);
      } catch (err) {
        lastErr = err;
        console.error(`/api/analyze attempt ${attempt + 1} failed:`, err);
        if (attempt === 0) await new Promise((r) => setTimeout(r, 800));
      }
    }
    throw lastErr;
  } catch (err) {
    console.error("/api/analyze error:", err);
    return NextResponse.json({ error: "AI analysis is temporarily unavailable." }, { status: 502 });
  }
}
