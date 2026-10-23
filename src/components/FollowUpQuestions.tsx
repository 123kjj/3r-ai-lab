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
    <div className="mx-auto max-w-lg rounded-3xl border-4 border-sky-300 bg-white p-6 shadow-md">
      <p className="font-serif text-2xl font-bold text-forest-700">🤔 Quick question!</p>

      <div className="mt-5 space-y-5">
        {questions.map((q) => (
          <fieldset key={q.id}>
            <legend className="text-lg font-bold text-charcoal-800">{q.question}</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {q.options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: opt.value }))}
                  className={`rounded-full border-2 px-4 py-2 text-base font-bold transition-colors ${
                    answers[q.id] === opt.value
                      ? "border-forest-600 bg-forest-500 text-white"
                      : "border-charcoal-300 bg-white text-charcoal-700 hover:border-forest-500"
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
