"use client";

import { useEffect, useState } from "react";
import { LinkButton } from "@/components/Button";
import { QUIZ_ITEMS, aggregateQuiz, summarizeRetests, QuizAggregate, RetestSummary } from "@/lib/quiz";
import { fetchQuizResponses } from "@/lib/quizStore";

export default function QuizResultsPage() {
  const [agg, setAgg] = useState<QuizAggregate | null | undefined>(undefined);
  const [retest, setRetest] = useState<RetestSummary | null>(null);

  useEffect(() => {
    fetchQuizResponses().then((r) => {
      setAgg(r ? aggregateQuiz(r) : null);
      if (r) setRetest(summarizeRetests(r));
    });
  }, []);

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-charcoal-500">Measured, not estimated</p>
      <h1 className="mt-1 font-serif text-3xl font-semibold text-forest-900">How people actually sort</h1>

      {agg === undefined && <p className="mt-4 text-charcoal-600">Loading…</p>}
      {agg === null && <p className="mt-4 text-charcoal-600">Results are unavailable right now.</p>}
      {agg && agg.participants === 0 && <p className="mt-4 text-charcoal-600">No responses yet. Be the first.</p>}
      {agg && agg.participants > 0 && (
        <>
          <p className="mt-3 text-charcoal-700">
            <strong>{agg.participants}</strong> {agg.participants === 1 ? "person" : "people"} took the quiz. Average score:{" "}
            <strong>{agg.meanScore.toFixed(1)} / {QUIZ_ITEMS.length}</strong>. This is a small, self-selected sample, not a study.
          </p>
          {retest && retest.pairs > 0 && (
            <p className="mt-4 border border-forest-200 bg-forest-50 p-4 text-sm text-charcoal-800">
              <strong>{retest.pairs}</strong> {retest.pairs === 1 ? "person" : "people"} retook the quiz after using the item checker.
              Average score: <strong>{retest.meanFirst.toFixed(1)}</strong> first try, <strong>{retest.meanRetest.toFixed(1)}</strong> on retake
              (out of {QUIZ_ITEMS.length}). Tiny sample, no control group: suggestive, not proof, and people may remember the answers.
            </p>
          )}
          <ul className="mt-6 space-y-3">
            {QUIZ_ITEMS.map((q) => {
              const pct = Math.round((agg.perItemCorrect[q.id] / agg.participants) * 100);
              return (
                <li key={q.id}>
                  <div className="flex justify-between text-sm text-charcoal-800">
                    <span>{q.name}</span>
                    <span className="font-mono">{pct}% correct</span>
                  </div>
                  <div className="mt-1 h-2 bg-paper-100">
                    <div className="h-2 bg-forest-700" style={{ width: `${pct}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
      <div className="mt-8"><LinkButton href="/quiz" variant="primary">Take the quiz</LinkButton></div>
    </div>
  );
}
