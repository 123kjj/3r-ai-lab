"use client";

import { useMemo, useState } from "react";
import { AnalyzeItemResult, FollowUpAnswers } from "@/lib/types";
import { Button } from "./Button";
import { LocationCheck } from "./LocationCheck";
import { ReuseIdeas } from "./ReuseIdeas";
import { ScenarioComparison } from "./ScenarioComparison";
import { LearningReceiptCard } from "./LearningReceiptCard";
import { ImpactEstimator } from "./ImpactEstimator";
import { CraftCard } from "./CraftCard";
import { RULES_BY_ID } from "@/lib/rules";
import { lookupItem } from "@/lib/itemLibrary";
import { emojiFor } from "@/lib/itemEmoji";
import { buildThreeFutureScenarios } from "@/lib/scenarioEngine";
import { generateLearningReceipt } from "@/lib/receiptGenerator";

interface ResultViewProps {
  result: AnalyzeItemResult;
  followUpAnswers: FollowUpAnswers;
  onTookAction: (estimatedKgCO2e?: number) => void;
  onScanAnother: () => void;
  onDescribe: (description: string) => void;
  onSaveReflection: (answer: string) => void;
  actionTaken: boolean;
  receiptSaved: import("@/lib/receiptStore").SaveStatus;
}

export function ResultView({
  result,
  followUpAnswers,
  onTookAction,
  onScanAnother,
  onDescribe,
  onSaveReflection,
  actionTaken,
  receiptSaved,
}: ResultViewProps) {
  const [description, setDescription] = useState("");
  const [estimateKg, setEstimateKg] = useState<number | undefined>(undefined);
  const [correcting, setCorrecting] = useState(false);
  const [correctedItem, setCorrectedItem] = useState(result.itemName);
  const [correctedCategory, setCorrectedCategory] = useState(result.category);
  const [applied, setApplied] = useState<{ itemName: string; category: string } | null>(null);

  const effectiveItem = applied?.itemName ?? result.itemName;
  const effectiveCategory = applied?.category ?? result.category;

  const scenarios = useMemo(
    () => buildThreeFutureScenarios(effectiveCategory, effectiveItem, followUpAnswers),
    [effectiveCategory, effectiveItem, followUpAnswers]
  );

  const receipt = useMemo(
    () => generateLearningReceipt({ ...result, itemName: effectiveItem, category: effectiveCategory }, scenarios),
    [result, effectiveItem, effectiveCategory, scenarios]
  );

  if (result.uncertain) {
    return (
      <div className="mx-auto max-w-lg border border-charcoal-200 bg-paper-50 p-8 text-center">
        <h2 className="font-serif text-2xl font-semibold text-forest-900">
          Tell us what the item is.
        </h2>
        <p className="mt-2 text-sm text-charcoal-600">
          Describe it in a few words.
        </p>
        <form
          className="mt-5 flex flex-col gap-3 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            if (description.trim()) onDescribe(description.trim());
          }}
        >
          <label htmlFor="describe-input" className="sr-only">
            Describe the item
          </label>
          <input
            id="describe-input"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. a foam takeout container"
            className="flex-1 border border-charcoal-300 px-4 py-2.5 text-sm focus:border-forest-600"
          />
          <Button type="submit" variant="primary">
            Continue
          </Button>
        </form>
        <button
          onClick={onScanAnother}
          className="mt-4 text-sm text-charcoal-500 underline decoration-charcoal-300 underline-offset-2 hover:text-forest-700"
        >
          Start over
        </button>
      </div>
    );
  }

  const lib = lookupItem(result.itemName);
  const emoji = lib ? emojiFor(lib) : "🔎";
  const mainRule = result.ruleIds?.[0] ? RULES_BY_ID[result.ruleIds[0]] : null;

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      {/* Item header */}
      <div className="text-center">
        <div className="anim-pop text-8xl leading-none drop-shadow-md" aria-hidden>{emoji}</div>
        <h2 className="mt-2 font-serif text-4xl font-bold capitalize text-forest-700">{effectiveItem}</h2>
        {applied && <p className="mt-1 text-xs italic text-soil-700">Manually corrected.</p>}
      </div>

      {result.disposition && <DispositionBanner disp={result.disposition} />}

      {mainRule && (
        <section className="anim-flip rounded-3xl border-4 border-forest-500 bg-white p-5 text-center shadow-md" aria-label="The rule to remember">
          <p className="text-sm font-extrabold uppercase tracking-widest text-forest-600">💡 Rule to remember</p>
          <p className="mt-1 font-serif text-3xl font-bold text-forest-800">{mainRule.title}</p>
          <p className="mt-1 text-base text-charcoal-700">{mainRule.text}</p>
        </section>
      )}

      <section className="rounded-3xl bg-forest-100 p-4 text-center">
        <p className="text-sm font-extrabold uppercase tracking-widest text-forest-700">🌱 Next time</p>
        <p className="mt-1 text-base font-semibold text-forest-900">{result.reduceAdvice}</p>
      </section>

      {result.craftId && <CraftCard craftId={result.craftId} />}

      <details className="rounded-3xl border-2 border-charcoal-200 bg-white p-4">
        <summary className="cursor-pointer text-center font-serif text-lg font-bold text-forest-700">🔬 Show the science</summary>
        <div className="mt-4 space-y-6">
          {result.ruleIds && result.ruleIds.length > 1 && (
            <ul className="space-y-1 text-sm text-charcoal-700">
              {result.ruleIds.slice(1).map((id) => RULES_BY_ID[id] && (
                <li key={id}><strong>{RULES_BY_ID[id].title}.</strong> {RULES_BY_ID[id].text}</li>
              ))}
            </ul>
          )}
          <ScenarioComparison data={scenarios} />
          <ImpactEstimator category={effectiveCategory} itemName={effectiveItem} onEstimate={setEstimateKg} />
          <LocationCheck warning={result.localRuleWarning} item={effectiveItem} category={effectiveCategory} />
          <ReuseIdeas ideas={result.reuseIdeas} />
          <LearningReceiptCard receipt={receipt} onSaveReflection={onSaveReflection} saved={receiptSaved} />
          <div className="text-center">
            <button onClick={() => setCorrecting((c) => !c)} className="text-xs text-charcoal-500 underline">
              {correcting ? "Cancel" : "This isn't right? Correct it"}
            </button>
            {correcting && (
              <form
                className="mx-auto mt-3 flex max-w-sm flex-col gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  setApplied({ itemName: correctedItem.trim(), category: correctedCategory.trim() });
                  setCorrecting(false);
                }}
              >
                <input value={correctedItem} onChange={(e) => setCorrectedItem(e.target.value)} placeholder="What is it actually?" className="rounded-lg border border-charcoal-300 px-3 py-2 text-sm" />
                <input value={correctedCategory} onChange={(e) => setCorrectedCategory(e.target.value)} placeholder="Material (e.g. Glass, Cardboard)" className="rounded-lg border border-charcoal-300 px-3 py-2 text-sm" />
                <Button type="submit" variant="secondary" size="sm">Apply correction</Button>
              </form>
            )}
          </div>
        </div>
      </details>

      <div className="flex flex-col items-center gap-3 pt-2 sm:flex-row sm:justify-center">
        <Button variant="primary" size="lg" className="w-full sm:w-auto" onClick={onScanAnother}>
          Check another 🔍
        </Button>
      </div>
    </div>
  );
}

const DISP_STYLE: Record<string, { label: string; emoji: string; text: string; cls: string }> = {
  recycle: { label: "Recycle it!", emoji: "♻️", text: "Empty it, then into the recycling bin.", cls: "bg-sky-100 border-sky-500 text-sky-900" },
  compost: { label: "Compost it!", emoji: "🍃", text: "Food scraps bin or compost pile.", cls: "bg-forest-100 border-forest-500 text-forest-900" },
  reuse: { label: "Reuse it first!", emoji: "✨", text: "Still useful. Reuse, donate or craft it.", cls: "bg-amber-100 border-amber-500 text-amber-900" },
  dropoff: { label: "Special drop-off!", emoji: "⚡", text: "Not for any bin. Use a drop-off.", cls: "bg-orange-100 border-orange-500 text-orange-900" },
  trash: { label: "Trash (and skip it next time)", emoji: "🗑️", text: "Most programs can't recycle this.", cls: "bg-charcoal-100 border-charcoal-500 text-charcoal-900" },
};

function DispositionBanner({ disp }: { disp: string }) {
  const d = DISP_STYLE[disp];
  if (!d) return null;
  return (
    <div className={`flex items-center gap-4 rounded-3xl border-4 p-4 ${d.cls}`} role="status">
      <span className="text-5xl" aria-hidden>{d.emoji}</span>
      <div>
        <p className="font-serif text-2xl font-bold leading-tight">{d.label}</p>
        <p className="text-sm font-semibold">{d.text} <span className="opacity-70">(Rules vary by city.)</span></p>
      </div>
    </div>
  );
}
