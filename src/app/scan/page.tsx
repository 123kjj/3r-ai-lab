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
import { getFollowUpQuestions } from "@/lib/followUpQuestions";
import { generateLearningReceipt } from "@/lib/receiptGenerator";
import { saveReceipt } from "@/lib/receiptStore";

type Status = "idle" | "followup" | "result";

const EXAMPLES = ["boba cup", "energy drink can", "disposable vape", "airpods", "pizza box", "chip bag", "hoodie", "notebook"];

export default function ScanPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [typed, setTyped] = useState("");
  const [missed, setMissed] = useState<{ text: string; suggestions: string[] } | null>(null);
  const [result, setResult] = useState<AnalyzeItemResult | null>(null);
  const [followUpAnswers, setFollowUpAnswers] = useState<FollowUpAnswers>({});
  const [actionTaken, setActionTaken] = useState(false);
  const [receiptSaved, setReceiptSaved] = useState(false);
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
    setReceiptSaved(false);
    setStatus(getFollowUpQuestions(classifyMaterial(r.category, r.itemName).id).length > 0 ? "followup" : "result");
  }, []);

  const handleTookAction = useCallback(
    async (kg?: number) => {
      if (!result) return;
      await recordAction(result, kg);
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
          <div className="mb-8 text-center">
            <h1 className="font-serif text-3xl font-semibold text-forest-900 sm:text-4xl">What are you throwing away?</h1>
            <p className="mt-2 text-charcoal-600">
              Type any item, even boba cups and AirPods. We&rsquo;ll compare reuse, recycling and disposal using sourced EPA data, and tell you when we don&rsquo;t have data.
            </p>
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
              placeholder="e.g. soda can, pizza box, banana peel"
              list="item-names"
              className="flex-1 border border-charcoal-300 px-4 py-3 text-sm focus:border-forest-600"
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
                className="border border-charcoal-300 bg-white px-3 py-1.5 text-sm text-charcoal-700 hover:border-forest-700 hover:text-forest-800"
              >
                {e}
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
