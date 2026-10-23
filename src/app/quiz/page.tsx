"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, LinkButton } from "@/components/Button";
import { BIN_LABELS, BinChoice, QUIZ_ITEMS, scoreQuiz } from "@/lib/quiz";
import { submitQuiz } from "@/lib/quizStore";
import { recordEvent } from "@/lib/progress";

export default function QuizPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, BinChoice>>({});
  const [picked, setPicked] = useState<BinChoice | null>(null);
  const [saved, setSaved] = useState<boolean | null>(null);
  const done = step >= QUIZ_ITEMS.length;
  const item = QUIZ_ITEMS[step];

  async function next() {
    if (!picked) return;
    const updated = { ...answers, [item.id]: picked };
    setAnswers(updated);
    setPicked(null);
    if (step + 1 >= QUIZ_ITEMS.length) {
      setStep(step + 1);
      const sc = scoreQuiz(updated);
      try {
        const first = localStorage.getItem("3r-firstscore");
        if (first === null) localStorage.setItem("3r-firstscore", String(sc));
        else if (sc > parseInt(first, 10)) recordEvent({ type: "retake-improved" });
      } catch {}
      setSaved(await submitQuiz(updated));
    } else setStep(step + 1);
  }

  if (done) {
    const score = scoreQuiz(answers);
    return (
      <div className="mx-auto max-w-2xl px-6 py-10">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-charcoal-500">Your result</p>
        <h1 className="mt-1 font-serif text-4xl font-semibold text-forest-900">
          {score} / {QUIZ_ITEMS.length}
        </h1>
        <p className="mt-2 text-sm text-charcoal-600">
          Answers reflect what most U.S. curbside programs do; your city may differ.{" "}
          {saved ? "Your anonymous answers were saved." : "Your answers were not saved."}
        </p>
        <ul className="mt-6 space-y-4">
          {QUIZ_ITEMS.map((q) => {
            const ok = answers[q.id] === q.answer;
            return (
              <li key={q.id} className="border border-charcoal-200 bg-white p-4">
                <p className="font-medium text-forest-900">
                  {q.name} — <span className={ok ? "text-forest-700" : "text-soil-700"}>{ok ? "Correct" : "Not quite"}</span>
                </p>
                <p className="mt-1 text-sm text-charcoal-700">
                  Best answer: <strong>{BIN_LABELS[q.answer]}</strong>
                  {!ok && <> (you chose {BIN_LABELS[answers[q.id]]})</>}. {q.why}
                </p>
              </li>
            );
          })}
        </ul>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <LinkButton href="/quiz/results" variant="primary">See everyone&rsquo;s results</LinkButton>
          <LinkButton href="/scan" variant="secondary">Check an item, then retake the quiz</LinkButton>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-10">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-charcoal-500">
        Question {step + 1} of {QUIZ_ITEMS.length}
      </p>
      <h1 className="mt-2 font-serif text-3xl font-semibold text-forest-900">Where does this go?</h1>
      <p className="mt-4 text-xl text-charcoal-800">{item.name}</p>
      <div className="mt-6 grid gap-3">
        {(Object.keys(BIN_LABELS) as BinChoice[]).map((c) => (
          <button
            key={c}
            onClick={() => setPicked(c)}
            aria-pressed={picked === c}
            className={`border px-4 py-3 text-left text-sm ${
              picked === c ? "border-forest-800 bg-forest-50 text-forest-900" : "border-charcoal-300 bg-white text-charcoal-800 hover:border-forest-700"
            }`}
          >
            {BIN_LABELS[c]}
          </button>
        ))}
      </div>
      <div className="mt-6">
        <Button variant="primary" onClick={next} disabled={!picked}>
          {step + 1 === QUIZ_ITEMS.length ? "See results" : "Next"}
        </Button>
      </div>
      <p className="mt-6 text-xs text-charcoal-500">
        Anonymous. <Link href="/problem" className="underline">Why this matters</Link>
      </p>
    </div>
  );
}
