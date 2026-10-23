import { LocalRulesProvider, NoDataProvider } from "./provider";
import { GeminiGeneralGuidanceProvider } from "./geminiGeneralGuidanceProvider";

export * from "./provider";

/**
 * Single place that decides which provider serves a request. Adding a
 * real verified-data provider later means implementing
 * LocalRulesProvider and swapping (or layering) it in here — nothing
 * else in the app needs to change.
 */
export function getLocalRulesProvider(): LocalRulesProvider {
  if (process.env.GEMINI_API_KEY) {
    return new GeminiGeneralGuidanceProvider();
  }
  return new NoDataProvider();
}
