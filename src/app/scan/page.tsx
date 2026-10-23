"use client";

import { useCallback, useMemo, useState } from "react";
import { UploadArea } from "@/components/UploadArea";
import { AnalyzingLoader } from "@/components/AnalyzingLoader";
import { ResultView } from "@/components/ResultView";
import { FollowUpQuestions } from "@/components/FollowUpQuestions";
import { Button } from "@/components/Button";
import { analyzeItem } from "@/lib/ai";
import { fileToDataUrl } from "@/lib/utils";
import { AnalyzeItemResult, FollowUpAnswers } from "@/lib/types";
import { MOCK_RESULTS } from "@/lib/mockData";
import { MANUAL_MATERIALS } from "@/lib/manualSelection";
import { useImpact } from "@/context/ImpactContext";
import { useAuth } from "@/context/AuthContext";
import { classifyMaterial, buildThreeFutureScenarios } from "@/lib/scenarioEngine";
import { getFollowUpQuestions } from "@/lib/followUpQuestions";
import { generateLearningReceipt } from "@/lib/receiptGenerator";
import { saveReceipt } from "@/lib/receiptStore";

type Status = "idle" | "preview" | "analyzing" | "followup" | "result" | "error";

// Keyword aliases for each demo item, used only when the person types a
// description after an "uncertain" result. Plain local text matching
// (no AI call).
const DESCRIBE_ALIASES: Record<number, string[]> = {
  0: ["plastic", "bottle", "water bottle"],
  1: ["cardboard", "box", "tube", "roll", "toilet paper", "paper towel", "paper roll"],
  2: ["glass", "jar", "mason jar"],
  3: ["shirt", "t-shirt", "tshirt", "clothing", "fabric", "textile"],
  4: ["aluminum", "aluminium", "can", "tin", "metal can"],
};

export default function ScanPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [image, setImage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeItemResult | null>(null);
  const [followUpAnswers, setFollowUpAnswers] = useState<FollowUpAnswers>({});
  const [actionTaken, setActionTaken] = useState(false);
  const [receiptSaved, setReceiptSaved] = useState(false);
  const { recordAction } = useImpact();
  const { user } = useAuth();

  const pendingQuestions = useMemo(() => {
    if (!result) return [];
    const { id } = classifyMaterial(result.category, result.itemName);
    return getFollowUpQuestions(id);
  }, [result]);

  const handleFile = useCallback(async (file: File) => {
    setUploadError(null);
    if (!file.type.startsWith("image/")) {
      setUploadError("That file type isn't supported. Please upload a JPG or PNG photo.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("That image is too large. Please use a photo under 10MB.");
      return;
    }
    try {
      const dataUrl = await fileToDataUrl(file);
      setImage(dataUrl);
      setStatus("preview");
    } catch {
      setUploadError("We couldn't read that photo. Please try another one.");
    }
  }, []);

  const proceedPastIdentification = useCallback((outcome: AnalyzeItemResult) => {
    const { id } = classifyMaterial(outcome.category, outcome.itemName);
    const questions = getFollowUpQuestions(id);
    setFollowUpAnswers({});
    setResult(outcome);
    setStatus(questions.length > 0 && !outcome.uncertain ? "followup" : "result");
  }, []);

  const runAnalysis = useCallback(async () => {
    if (!image) {
      setUploadError("Please select a photo before analyzing.");
      return;
    }
    setStatus("analyzing");
    setAnalysisError(null);
    setActionTaken(false);
    setReceiptSaved(false);

    const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), 28000));

    try {
      const outcome = await Promise.race([analyzeItem(image), timeout]);
      if (!outcome) throw new Error("timeout");
      proceedPastIdentification(outcome);
    } catch {
      setAnalysisError(
        "The AI couldn't identify that photo right now. You can retry, or pick the material yourself below."
      );
      setStatus("error");
    }
  }, [image, proceedPastIdentification]);

  const handleDescribe = useCallback(
    (description: string) => {
      const lower = description.toLowerCase();
      const matchedIndex = Object.entries(DESCRIBE_ALIASES).find(([, aliases]) =>
        aliases.some((alias) => lower.includes(alias))
      )?.[0];

      if (matchedIndex === undefined) {
        setAnalysisError("We couldn't match that description. Pick the closest material below.");
        setStatus("error");
        return;
      }
      proceedPastIdentification({ ...MOCK_RESULTS[Number(matchedIndex)], uncertain: false, manualSelection: true });
    },
    [proceedPastIdentification]
  );

  const handleTookAction = useCallback(async (estimatedKgCO2e?: number) => {
    if (!result) return;
    await recordAction(result, estimatedKgCO2e);
    setActionTaken(true);
  }, [result, recordAction]);

  const handleSaveReflection = useCallback(
    async (answer: string) => {
      if (!result) return;
      const scenarios = buildThreeFutureScenarios(result.category, result.itemName, followUpAnswers);
      const receipt = generateLearningReceipt(result, scenarios);
      receipt.reflectionAnswer = answer;
      const saved = await saveReceipt(user?.uid ?? null, receipt);
      setReceiptSaved(saved);
    },
    [result, followUpAnswers, user]
  );

  const reset = useCallback(() => {
    setStatus("idle");
    setImage(null);
    setResult(null);
    setUploadError(null);
    setAnalysisError(null);
    setActionTaken(false);
    setFollowUpAnswers({});
    setReceiptSaved(false);
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      {status !== "result" && (
        <div className="mb-8 text-center">
          <h1 className="font-serif text-3xl font-semibold text-forest-900 sm:text-4xl">
            What are you throwing away?
          </h1>
          <p className="mt-2 text-charcoal-600">
            Upload a photo and explore its reuse, recycling, and disposal futures.
          </p>
        </div>
      )}

      {status === "idle" && <UploadArea onFile={handleFile} error={uploadError} />}

      {status === "preview" && image && (
        <div className="mx-auto max-w-md text-center">
          <div className="border border-charcoal-200 bg-white p-3">
            <div className="relative aspect-square w-full overflow-hidden bg-paper-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt="Selected item to analyze" className="h-full w-full object-cover" />
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button variant="primary" size="lg" onClick={runAnalysis}>
              Analyze Item
            </Button>
            <Button variant="secondary" size="lg" onClick={reset}>
              Choose a different photo
            </Button>
          </div>
        </div>
      )}

      {status === "analyzing" && <AnalyzingLoader />}

      {status === "error" && (
        <div className="mx-auto max-w-lg border border-charcoal-200 bg-paper-50 p-6 text-center">
          <p role="alert" className="text-charcoal-800">{analysisError}</p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-center">
            {image && <Button variant="primary" onClick={runAnalysis}>Retry analysis</Button>}
            <Button variant="secondary" onClick={reset}>Choose a different photo</Button>
          </div>
          <p className="mt-6 text-sm font-medium text-forest-900">Or pick the material yourself:</p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {MANUAL_MATERIALS.map((m) => (
              <button
                key={m.label}
                onClick={() => proceedPastIdentification({ ...MOCK_RESULTS[m.index], uncertain: false, manualSelection: true })}
                className="border border-charcoal-300 bg-white px-3 py-2 text-sm text-charcoal-800 hover:border-forest-700 hover:text-forest-800"
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {status === "followup" && result && (
        <FollowUpQuestions
          questions={pendingQuestions}
          onComplete={(answers) => {
            setFollowUpAnswers(answers);
            setStatus("result");
          }}
          onSkip={() => setStatus("result")}
        />
      )}

      {status === "result" && result && (
        <div>
          {analysisError && (
            <p role="status" className="mx-auto mb-6 max-w-lg border border-soil-300 bg-soil-50 px-4 py-3 text-center text-sm text-soil-800">
              {analysisError}
            </p>
          )}
          <ResultView
            result={result}
            followUpAnswers={followUpAnswers}
            onTookAction={handleTookAction}
            onScanAnother={reset}
            onDescribe={handleDescribe}
            onSaveReflection={handleSaveReflection}
            actionTaken={actionTaken}
            receiptSaved={receiptSaved}
          />
        </div>
      )}
    </div>
  );
}
