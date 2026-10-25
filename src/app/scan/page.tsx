"use client";

import { useCallback, useMemo, useState } from "react";
import { ResultView } from "@/components/ResultView";
import { FollowUpQuestions } from "@/components/FollowUpQuestions";
import { Button } from "@/components/Button";
import { AnalyzeItemResult, FollowUpAnswers } from "@/lib/types";
import { buildTypedResult } from "@/lib/manualSelection";
import { useImpact } from "@/context/ImpactContext";
import { useAuth } from "@/context/AuthContext";
import { classifyMaterial, buildThreeFutureScenarios } from "@/lib/scenarioEngine";
import { lookupItem, suggestItems, allItemNames } from "@/lib/itemLibrary";
import { recordEvent } from "@/lib/progress";
import { Buddy } from "@/components/Buddy";
import { emojiFor } from "@/lib/itemEmoji";
import { getFollowUpQuestions } from "@/lib/followUpQuestions";
import { generateLearningReceipt } from "@/lib/receiptGenerator";
import { saveReceipt, SaveStatus } from "@/lib/receiptStore";

type Status = "idle" | "followup" | "result";

const EXAMPLES = ["boba cup", "energy drink can", "disposable vape", "airpods", "pizza box", "chip bag", "hoodie", "notebook"];

export default function ScanPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [typed, setTyped] = useState("");
  const [missed, setMissed] = useState<{ text: string; suggestions: string[] } | null>(null);
  const [result, setResult] = useState<AnalyzeItemResult | null>(null);
  const [followUpAnswers, setFollowUpAnswers] = useState<FollowUpAnswers>({});
  const [actionTaken, setActionTaken] = useState(false);
  const [receiptSaved, setReceiptSaved] = useState<SaveStatus>("none");
  const { recordAction } = useImpact();
  const { user } = useAuth();

  const pendingQuestions = useMemo(() => {
    if (!result) return [];
    return getFollowUpQuestions(classifyMaterial(result.category, result.itemName).id);
  }, [result]);

  const explore = useCallback((text: string, force = false) => {
    const t = text.trim();
    if (!t) return;
    if (!force && !lookupItem(t) && classifyMaterial(t, t).id === "mixed_unknown") {
      setMissed({ text: t, suggestions: suggestItems(t) });
      return;
    }
    setMissed(null);
    recordEvent({ type: "check", item: lookupItem(t)?.names[0] ?? t });
    const r = buildTypedResult(t);
    setResult(r);
    setFollowUpAnswers({});
    setActionTaken(false);
    setReceiptSaved("none");
    setStatus(getFollowUpQuestions(classifyMaterial(r.category, r.itemName).id).length > 0 ? "followup" : "result");
  }, []);

  const handleTookAction = useCallback(
    async (kg?: number) => {
      if (!result) return;
      try {
        await recordAction(result, kg);
      } catch (e) {
        console.error(e);
      }
      setActionTaken(true);
    },
    [result, recordAction]
  );

  const handleSaveReflection = useCallback(
    async (answer: string) => {
      if (!result) return;
      const scenarios = buildThreeFutureScenarios(result.category, result.itemName, followUpAnswers);
      const receipt = generateLearningReceipt(result, scenarios);
      receipt.reflectionAnswer = answer;
      setReceiptSaved(await saveReceipt(user?.uid ?? null, receipt));
    },
    [result, followUpAnswers, user]
  );

  const reset = useCallback(() => {
    setStatus("idle");
    setTyped("");
    setResult(null);
    setFollowUpAnswers({});
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      {status === "idle" && (
        <div>
          <div className="mb-6 text-center">
            <Buddy mood="think" className="mx-auto w-24" />
            <h1 className="mt-2 font-serif text-4xl font-bold text-forest-700">What is it? 🤔</h1>
            <p className="mt-1 text-lg text-charcoal-600">Type an item to find out where it goes.</p>
          </div>
          <form
            className="mx-auto flex max-w-lg flex-col gap-3 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              explore(typed);
            }}
          >
            <label htmlFor="typed-item" className="sr-only">Type what the item is</label>
            <input
              id="typed-item"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder="boba cup, airpods, pizza box…"
              list="item-names"
              className="flex-1 rounded-full border-4 border-forest-300 bg-white px-5 py-3 text-lg focus:border-forest-500"
            />
            <Button type="submit" variant="primary">Explore</Button>
            <datalist id="item-names">
              {allItemNames().map((n) => <option key={n} value={n} />)}
            </datalist>
          </form>
          {missed && (
            <div role="status" className="mx-auto mt-5 max-w-lg border border-soil-300 bg-soil-50 p-4 text-sm text-soil-900">
              <p>We don&rsquo;t have &ldquo;{missed.text}&rdquo; yet, and we won&rsquo;t guess.</p>
              {missed.suggestions.length > 0 && (
                <>
                  <p className="mt-2 font-medium">Did you mean:</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {missed.suggestions.map((n) => (
                      <button key={n} onClick={() => { setTyped(n); explore(n); }} className="border border-charcoal-300 bg-white px-3 py-1.5 hover:border-forest-700">{n}</button>
                    ))}
                  </div>
                </>
              )}
              <button onClick={() => explore(missed.text, true)} className="mt-3 text-xs underline">Show general guidance anyway</button>
            </div>
          )}
          <div className="mx-auto mt-5 flex max-w-lg flex-wrap justify-center gap-2">
            {EXAMPLES.map((e) => (
              <button
                key={e}
                onClick={() => explore(e)}
                className="rounded-full border-2 border-forest-200 bg-white px-4 py-2 text-base font-bold text-charcoal-700 shadow-sm hover:border-forest-500"
              >
                {(() => { const it = lookupItem(e); return it ? emojiFor(it) : "🔎"; })()} {e}
              </button>
            ))}
          </div>
        </div>
      )}

      {status === "followup" && result && (
        <FollowUpQuestions
          questions={pendingQuestions}
          onComplete={(a) => {
            setFollowUpAnswers(a);
            setStatus("result");
          }}
          onSkip={() => setStatus("result")}
        />
      )}

      {status === "result" && result && (
        <ResultView
          result={result}
          followUpAnswers={followUpAnswers}
          onTookAction={handleTookAction}
          onScanAnother={reset}
          onDescribe={explore}
          onSaveReflection={handleSaveReflection}
          actionTaken={actionTaken}
          receiptSaved={receiptSaved}
        />
      )}
    </div>
  );
}
