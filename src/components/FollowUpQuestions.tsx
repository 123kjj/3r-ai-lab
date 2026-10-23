"use client";

import { useState } from "react";
import { FollowUpAnswers, FollowUpQuestion } from "@/lib/types";
import { Button } from "./Button";

interface FollowUpQuestionsProps {
  questions: FollowUpQuestion[];
  onComplete: (answers: FollowUpAnswers) => void;
  onSkip: () => void;
}

/**
 * Shown between identification and the scenario comparison, only when
 * the identified category has questions whose answer could actually
 * change the recommendation (see src/lib/followUpQuestions.ts) — not
 * generic filler.
 */
export function FollowUpQuestions({ questions, onComplete, onSkip }: FollowUpQuestionsProps) {
  const [answers, setAnswers] = useState<FollowUpAnswers>({});

  const allAnswered = questions.every((q) => answers[q.id]);

  return (
    <div className="mx-auto max-w-lg border border-charcoal-200 bg-paper-50 p-6">
      <p className="font-serif text-lg font-semibold text-forest-900">A couple of quick questions</p>
      <p className="mt-1 text-sm text-charcoal-600">
        These answers could change which option we recommend.
      </p>

      <div className="mt-5 space-y-5">
        {questions.map((q) => (
          <fieldset key={q.id}>
            <legend className="text-sm font-medium text-charcoal-800">{q.question}</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {q.options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: opt.value }))}
                  className={`border px-3 py-1.5 text-sm transition-colors ${
                    answers[q.id] === opt.value
                      ? "border-forest-800 bg-forest-800 text-paper"
                      : "border-charcoal-300 text-charcoal-700 hover:border-forest-600"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </fieldset>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={onSkip}
          className="text-xs text-charcoal-500 underline decoration-charcoal-300 underline-offset-2 hover:text-forest-700"
        >
          Skip — use general guidance
        </button>
        <Button variant="primary" disabled={!allAnswered} onClick={() => onComplete(answers)}>
          Continue
        </Button>
      </div>
    </div>
  );
}
