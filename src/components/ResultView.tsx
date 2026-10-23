"use client";

import { useMemo, useState } from "react";
import { AnalyzeItemResult, FollowUpAnswers } from "@/lib/types";
import { Button } from "./Button";
import { LocationCheck } from "./LocationCheck";
import { ReuseIdeas } from "./ReuseIdeas";
import { ScenarioComparison } from "./ScenarioComparison";
import { LearningReceiptCard } from "./LearningReceiptCard";
import { ImpactEstimator } from "./ImpactEstimator";
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
  receiptSaved: boolean;
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
          We&rsquo;re not confident what this item is.
        </h2>
        <p className="mt-2 text-sm text-charcoal-600">
          A photo alone doesn&rsquo;t always show enough — invisible coatings, mixed materials,
          and contamination can&rsquo;t be read from an image. Describe it in a few words instead.
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
          Try a different photo instead
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Item header + confidence + manual correction */}
      <div className="text-center">
        <h2 className="font-serif text-3xl font-semibold text-forest-900">{effectiveItem}</h2>
        <p className="mt-1 text-sm text-charcoal-500">{effectiveCategory}</p>
        {result.manualSelection ? (
          <p className="mt-2 font-mono text-xs text-charcoal-400">You selected this material yourself; it was not identified from a photo.</p>
        ) : typeof result.confidence === "number" && (
          <p className="mt-2 font-mono text-xs text-charcoal-400">
            {Math.round(result.confidence * 100)}% confidence — an honest estimate, not a
            guarantee. A photo can&rsquo;t reveal exact composition or contamination.
          </p>
        )}
        <button
          onClick={() => setCorrecting((c) => !c)}
          className="mt-2 text-xs text-charcoal-500 underline decoration-charcoal-300 underline-offset-2 hover:text-forest-700"
        >
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
            <input
              value={correctedItem}
              onChange={(e) => setCorrectedItem(e.target.value)}
              placeholder="What is it actually?"
              className="border border-charcoal-300 px-3 py-2 text-sm"
            />
            <input
              value={correctedCategory}
              onChange={(e) => setCorrectedCategory(e.target.value)}
              placeholder="Material category (e.g. Glass, Cardboard)"
              className="border border-charcoal-300 px-3 py-2 text-sm"
            />
            <Button type="submit" variant="secondary" size="sm">
              Apply correction
            </Button>
          </form>
        )}
        {applied && (
          <p className="mt-2 text-xs italic text-soil-700">
            Manually corrected from the AI&rsquo;s original guess.
          </p>
        )}
      </div>

      <ScenarioComparison data={scenarios} />

      <ImpactEstimator category={effectiveCategory} itemName={effectiveItem} onEstimate={setEstimateKg} />

      <LocationCheck
        warning={result.localRuleWarning}
        item={effectiveItem}
        category={effectiveCategory}
      />

      <ReuseIdeas ideas={result.reuseIdeas} />

      <LearningReceiptCard receipt={receipt} onSaveReflection={onSaveReflection} saved={receiptSaved} />

      <div className="flex flex-col items-center gap-3 pt-2 sm:flex-row sm:justify-center">
        <Button variant="primary" size="lg" className="w-full sm:w-auto" onClick={() => onTookAction(estimateKg)} disabled={actionTaken}>
          {actionTaken ? "Action saved" : "I Took Action"}
        </Button>
        <Button variant="secondary" size="lg" className="w-full sm:w-auto" onClick={onScanAnother}>
          Scan Another Item
        </Button>
      </div>
    </div>
  );
}
