"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, LinkButton } from "@/components/Button";
import { Planet } from "@/components/Planet";
import { RULES_BY_ID } from "@/lib/rules";
import { Answer, BINS, Bin, binFor, blindSpot, isCorrect, pickRound } from "@/lib/sortRush";
import { addPlayed, applyEvent, EMPTY_PROGRESS, loadProgress, planetStage, recordEvent, Progress } from "@/lib/progress";
import { BADGES, Badge } from "@/lib/badges";
import { LibraryItem } from "@/lib/itemLibrary";

const ROUND = 10;

type Phase = "intro" | "play" | "feedback" | "done";

export default function PlayPage() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [round, setRound] = useState<LibraryItem[]>([]);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [streak, setStreak] = useState(0);
  const [lastBin, setLastBin] = useState<{ bin: Bin; ok: boolean } | null>(null);
  const [dropping, setDropping] = useState(false);
  const [progress, setProgress] = useState<Progress>(EMPTY_PROGRESS);
  const [newBadges, setNewBadges] = useState<Badge[]>([]);
  const [shared, setShared] = useState(false);
  const feedbackRef = useRef<HTMLDivElement>(null);

  useEffect(() => setProgress(loadProgress()), []);

  const item = round[idx];
  const score = answers.filter((a) => a.correct).length;

  const start = useCallback(() => {
    setRound(pickRound(ROUND));
    setIdx(0);
    setAnswers([]);
    setStreak(0);
    setLastBin(null);
    setNewBadges([]);
    setShared(false);
    setPhase("play");
  }, []);

  const choose = useCallback(
    (bin: Bin) => {
      if (!item || phase !== "play" || dropping) return;
      const ok = isCorrect(item, bin);
      const nextStreak = ok ? streak + 1 : 0;
      setDropping(true);
      setLastBin({ bin, ok });
      const before = progress;
      const updated = recordEvent({ type: "sort", correct: ok, ruleId: item.rules[0] }, nextStreak);
      const earned = BADGES.filter((b) => b.earned(updated) && !b.earned(before));
      if (earned.length) setNewBadges((nb) => [...nb, ...earned]);
      setProgress(updated);
      setStreak(nextStreak);
      setAnswers((a) => [...a, { item, chosen: bin, correct: ok }]);
      window.setTimeout(() => {
        setDropping(false);
        setPhase("feedback");
      }, 520);
    },
    [item, phase, dropping, streak, progress]
  );

  useEffect(() => {
    if (phase === "feedback") feedbackRef.current?.focus();
  }, [phase]);

  const next = useCallback(() => {
    setLastBin(null);
    if (idx + 1 >= round.length) {
      const p = addPlayed();
      const before = progress;
      const earned = BADGES.filter((b) => b.earned(p) && !b.earned(before));
      if (earned.length) setNewBadges((nb) => [...nb, ...earned]);
      setProgress(p);
      setPhase("done");
    } else {
      setIdx(idx + 1);
      setPhase("play");
    }
  }, [idx, round.length, progress]);

  const stage = planetStage(progress.rulesLearned.length);
  const spot = useMemo(() => blindSpot(answers), [answers]);

  async function share() {
    const text = `I scored ${score}/${ROUND} on Sort Rush by 3R-AI. Where does a boba cup go? 🌍 https://3r-ai.vercel.app/play`;
    try {
      if (navigator.share) await navigator.share({ text });
      else await navigator.clipboard.writeText(text);
      setShared(true);
    } catch {}
  }

  if (phase === "intro") {
    return (
      <div className="mx-auto max-w-2xl px-6 py-10 text-center">
        <Planet stage={stage} />
        <p className="mt-6 font-mono text-xs uppercase tracking-[0.25em] text-charcoal-500">Sort Rush</p>
        <h1 className="mt-2 font-serif text-4xl font-semibold text-forest-900">Sort 10 items. Learn the rule behind each.</h1>
        <p className="mt-3 text-charcoal-600">
          Items ride the conveyor belt. Tap the right bin. Every answer shows the rule, so you can sort things you&rsquo;ve never seen.
          Answers follow what most U.S. curbside programs do; your city may differ.
        </p>
        <div className="mt-6"><Button size="lg" variant="primary" onClick={start}>Start sorting</Button></div>
        <p className="mt-4 text-xs text-charcoal-500">Your planet greens as you learn rules. It shows learning progress, not real emissions.</p>
      </div>
    );
  }

  if (phase === "done") {
    return (
      <div className="mx-auto max-w-2xl px-6 py-10">
        <div className="text-center">
          <Planet stage={stage} />
          <p className="mt-4 font-mono text-xs uppercase tracking-[0.25em] text-charcoal-500">Waste IQ</p>
          <h1 className="anim-pop font-serif text-6xl font-semibold text-forest-900">{score}<span className="text-3xl text-charcoal-500"> / {ROUND}</span></h1>
        </div>
        {spot ? (
          <p className="mt-6 border-l-4 border-orange-500 bg-orange-50 p-4 text-sm text-orange-900">
            <strong>Your blind spot this round:</strong> &ldquo;{spot.title}&rdquo; ({spot.misses} missed). {RULES_BY_ID[spot.ruleId]?.text}
          </p>
        ) : (
          <p className="mt-6 border-l-4 border-forest-600 bg-forest-50 p-4 text-sm text-forest-900">Perfect round. No blind spots this time.</p>
        )}
        {newBadges.length > 0 && (
          <div className="mt-6">
            <p className="font-serif text-xl font-semibold text-forest-900">New badges</p>
            <ul className="mt-2 flex flex-wrap gap-3">
              {newBadges.map((b) => (
                <li key={b.id} className="anim-pop border border-forest-600 bg-forest-50 px-4 py-2 text-center text-sm">
                  <span className="block text-3xl" aria-hidden>{b.emoji}</span><strong>{b.title}</strong>
                </li>
              ))}
            </ul>
          </div>
        )}
        <ul className="mt-6 space-y-2">
          {answers.map((a, i) => (
            <li key={i} className={`border p-3 text-sm ${a.correct ? "border-forest-300 bg-white" : "border-orange-300 bg-orange-50"}`}>
              <strong className="capitalize">{a.item.names[0]}</strong>: {a.correct ? "Correct" : `you chose ${a.chosen}, best is ${binFor(a.item.disp)}`}.
              <span className="block text-charcoal-600">{RULES_BY_ID[a.item.rules[0]]?.title}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button variant="primary" onClick={start}>Play again</Button>
          <Button variant="secondary" onClick={share}>{shared ? "Shared!" : "Share my score"}</Button>
          <LinkButton href="/impact" variant="ghost">See my badges</LinkButton>
        </div>
      </div>
    );
  }

  const bestBin = item ? binFor(item.disp) : null;
  const rule = item ? RULES_BY_ID[item.rules[0]] : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 pb-32 sm:px-6 md:pb-8">
      <div className="flex items-center justify-between text-sm">
        <span className="font-mono text-charcoal-600">Item {Math.min(idx + 1, round.length)} / {round.length}</span>
        <span className="font-mono text-charcoal-800">Score {score}</span>
        <span className="font-mono text-orange-600" aria-live="polite">{streak >= 2 ? `🔥 ${streak} streak` : " "}</span>
      </div>

      {/* Conveyor */}
      <div className="relative mt-6 h-44 overflow-hidden border border-charcoal-200 bg-gradient-to-b from-sky-100 to-paper">
        <div className="absolute inset-x-0 bottom-0 h-8 bg-charcoal-700 anim-belt-stripes" aria-hidden />
        <div className="absolute inset-x-0 bottom-8 h-1.5 bg-charcoal-900" aria-hidden />
        {item && (
          <div
            key={idx}
            className={`absolute bottom-10 left-1/2 -ml-24 w-48 border-2 border-charcoal-800 bg-amber-100 p-3 text-center shadow-lg ${dropping ? "anim-drop" : "anim-belt-in"}`}
            style={{ ["--drop" as string]: "120px" }}
          >
            <p className="font-serif text-lg font-semibold capitalize leading-tight text-charcoal-900">{item.names[0]}</p>
          </div>
        )}
      </div>

      {/* Bins */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4" role="group" aria-label="Choose a bin">
        {BINS.map((b) => {
          const state = lastBin && lastBin.bin === b.id ? (lastBin.ok ? "anim-bin-happy" : "anim-bin-wobble") : "";
          return (
            <button
              key={b.id}
              onClick={() => choose(b.id)}
              disabled={phase !== "play" || dropping}
              className={`tilt-card border-2 border-charcoal-900 px-3 py-5 text-center font-serif text-lg font-semibold text-white disabled:opacity-90 ${state}`}
              style={{ backgroundColor: b.color }}
            >
              {b.label}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {phase === "feedback" && item && lastBin && (
        <div ref={feedbackRef} tabIndex={-1} className="anim-flip mt-6 border-2 border-charcoal-900 bg-white p-5 outline-none" role="status">
          <p className={`font-serif text-2xl font-semibold ${lastBin.ok ? "text-forest-700" : "text-orange-700"}`}>
            {lastBin.ok ? "Nice sort!" : `Not quite. It goes in ${BINS.find((b) => b.id === bestBin)?.label}.`}
          </p>
          <p className="mt-2 text-sm text-charcoal-700">{item.why}</p>
          {rule && (
            <p className="mt-3 border-l-4 border-forest-600 bg-forest-50 p-3 text-sm text-forest-900">
              <strong>Rule: {rule.title}.</strong> {rule.text}
            </p>
          )}
          <p className="mt-2 text-xs text-charcoal-500">Most U.S. curbside programs; your city may differ.</p>
          <div className="mt-4"><Button variant="primary" onClick={next}>{idx + 1 >= round.length ? "See results" : "Next item"}</Button></div>
        </div>
      )}

      {newBadges.length > 0 && (
        <p className="anim-pop mt-4 text-center text-sm font-medium text-forest-800" role="status">
          New badge: {newBadges[newBadges.length - 1].emoji} {newBadges[newBadges.length - 1].title}
        </p>
      )}
    </div>
  );
}
