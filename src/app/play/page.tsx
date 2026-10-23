"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, LinkButton } from "@/components/Button";
import { Buddy, Mood } from "@/components/Buddy";
import { Planet } from "@/components/Planet";
import { RULES_BY_ID } from "@/lib/rules";
import { Answer, BINS, Bin, ROUND_SIZE, START_LIVES, beltSeconds, binFor, blindSpot, isCorrect, pickRound, starsFor } from "@/lib/sortRush";
import { addPlayed, EMPTY_PROGRESS, loadProgress, planetStage, recordEvent, Progress } from "@/lib/progress";
import { BADGES, Badge } from "@/lib/badges";
import { LibraryItem } from "@/lib/itemLibrary";
import { emojiFor } from "@/lib/itemEmoji";

type Phase = "intro" | "play" | "feedback" | "done";
const BIN_ICON: Record<Bin, string> = { recycling: "♻️", compost: "🍃", trash: "🗑️", dropoff: "⚡" };

export default function PlayPage() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [relaxed, setRelaxed] = useState(false);
  const [round, setRound] = useState<LibraryItem[]>([]);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [lives, setLives] = useState(START_LIVES);
  const [streak, setStreak] = useState(0);
  const [mood, setMood] = useState<Mood>("happy");
  const [fb, setFb] = useState<{ ok: boolean; missed?: boolean; bin: Bin | null } | null>(null);
  const [hover, setHover] = useState<Bin | null>(null);
  const [popBin, setPopBin] = useState<{ bin: Bin; ok: boolean } | null>(null);
  const [progress, setProgress] = useState<Progress>(EMPTY_PROGRESS);
  const [newBadges, setNewBadges] = useState<Badge[]>([]);
  const [shared, setShared] = useState(false);

  const beltRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const pRef = useRef(-0.15);
  const dragRef = useRef<{ sx: number; sy: number } | null>(null);
  const busyRef = useRef(false);
  const autoRef = useRef<number | null>(null);

  useEffect(() => setProgress(loadProgress()), []);
  const item = round[idx];
  const score = answers.filter((a) => a.correct).length;
  const stage = planetStage(progress.rulesLearned.length);

  const start = useCallback(() => {
    setRound(pickRound(ROUND_SIZE));
    setIdx(0); setAnswers([]); setLives(START_LIVES); setStreak(0); setMood("happy");
    setFb(null); setNewBadges([]); setShared(false); setPopBin(null);
    pRef.current = -0.15; busyRef.current = false;
    setPhase("play");
  }, []);

  const finish = useCallback((progressNow: Progress) => {
    const p = addPlayed();
    const earned = BADGES.filter((b) => b.earned(p) && !b.earned(progressNow));
    if (earned.length) setNewBadges((nb) => [...nb, ...earned]);
    setProgress(p);
    setPhase("done");
  }, []);

  const resolve = useCallback(
    (bin: Bin | null) => {
      if (!item || busyRef.current) return;
      busyRef.current = true;
      const ok = bin !== null && isCorrect(item, bin);
      const nextStreak = ok ? streak + 1 : 0;
      const before = progress;
      const updated = recordEvent({ type: "sort", correct: ok, ruleId: item.rules[0] }, nextStreak);
      const earned = BADGES.filter((b) => b.earned(updated) && !b.earned(before));
      if (earned.length) setNewBadges((nb) => [...nb, ...earned]);
      setProgress(updated);
      setStreak(nextStreak);
      setAnswers((a) => [...a, { item, chosen: bin ?? ("trash" as Bin), correct: ok }]);
      if (!ok) setLives((l) => l - 1);
      setMood(ok ? (nextStreak >= 3 ? "cheer" : "happy") : "oops");
      setFb({ ok, missed: bin === null, bin });
      if (bin) setPopBin({ bin, ok });
      setPhase("feedback");
      if (ok) autoRef.current = window.setTimeout(() => nextRef.current(), 1500);
    },
    [item, streak, progress]
  );

  const next = useCallback(() => {
    if (autoRef.current) { window.clearTimeout(autoRef.current); autoRef.current = null; }
    setFb(null); setPopBin(null); setHover(null);
    const done = idx + 1 >= round.length || lives <= 0;
    if (done) { finish(progress); return; }
    setIdx(idx + 1);
    pRef.current = -0.15;
    busyRef.current = false;
    setMood("happy");
    setPhase("play");
  }, [idx, round.length, lives, progress, finish]);
  const nextRef = useRef(next);
  useEffect(() => { nextRef.current = next; }, [next]);

  // Belt motion
  useEffect(() => {
    if (phase !== "play" || !item) return;
    let raf = 0;
    let last = performance.now();
    const dur = beltSeconds(idx);
    const tick = (now: number) => {
      const dt = now - last; last = now;
      if (!dragRef.current && !busyRef.current) {
        if (relaxed) pRef.current = Math.min(0.5, pRef.current + dt / 700 / 1.2);
        else pRef.current += dt / (dur * 1000);
      }
      if (outerRef.current) outerRef.current.style.left = `${pRef.current * 100}%`;
      if (!relaxed && pRef.current >= 1.05 && !busyRef.current) { resolve(null); return; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase, item, idx, relaxed, resolve]);

  useEffect(() => () => { if (autoRef.current) window.clearTimeout(autoRef.current); }, []);

  const binAt = (x: number, y: number): Bin | null => {
    const el = document.elementsFromPoint(x, y).find((e) => (e as HTMLElement).dataset?.bin) as HTMLElement | undefined;
    return (el?.dataset.bin as Bin) ?? null;
  };

  function flyTo(bin: Bin) {
    const inner = innerRef.current;
    const target = document.querySelector<HTMLElement>(`[data-bin="${bin}"]`);
    if (!inner || !target) { resolve(bin); return; }
    const a = inner.getBoundingClientRect();
    const b = target.getBoundingClientRect();
    const dx = b.left + b.width / 2 - (a.left + a.width / 2);
    const dy = b.top + 10 - (a.top + a.height / 2);
    busyRef.current = true;
    inner.style.transition = "transform 0.42s cubic-bezier(.5,-0.3,.7,1)";
    inner.style.transform = `translate(${dx}px, ${dy}px) scale(0.35) rotate(25deg)`;
    window.setTimeout(() => { inner.style.opacity = "0"; busyRef.current = false; resolve(bin); }, 430);
  }

  function onDown(e: React.PointerEvent) {
    if (phase !== "play" || busyRef.current) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = { sx: e.clientX, sy: e.clientY };
    if (innerRef.current) innerRef.current.style.transition = "none";
  }
  function onMove(e: React.PointerEvent) {
    const d = dragRef.current;
    if (!d || !innerRef.current) return;
    innerRef.current.style.transform = `translate(${e.clientX - d.sx}px, ${e.clientY - d.sy}px) scale(1.15) rotate(-6deg)`;
    setHover(binAt(e.clientX, e.clientY));
  }
  function onUp(e: React.PointerEvent) {
    const d = dragRef.current;
    if (!d) return;
    const bin = binAt(e.clientX, e.clientY);
    dragRef.current = null;
    setHover(null);
    if (bin) flyTo(bin);
    else if (innerRef.current) {
      innerRef.current.style.transition = "transform 0.25s ease";
      innerRef.current.style.transform = "translate(0,0)";
    }
  }
  function tapBin(bin: Bin) {
    if (phase !== "play" || busyRef.current || dragRef.current) return;
    flyTo(bin);
  }

  const spot = useMemo(() => blindSpot(answers), [answers]);
  const stars = starsFor(score, answers.length || ROUND_SIZE);

  async function share() {
    const text = `I scored ${score}/${answers.length} on Sort Rush by 3R-AI! Where does a boba cup go? 🌍 https://3r-ai.vercel.app/play`;
    try {
      if (navigator.share) await navigator.share({ text });
      else await navigator.clipboard.writeText(text);
      setShared(true);
    } catch {}
  }

  if (phase === "intro") {
    return (
      <div className="mx-auto max-w-xl px-6 py-8 text-center">
        <Buddy mood="cheer" className="mx-auto w-32" />
        <h1 className="mt-3 font-serif text-5xl font-bold text-forest-700">Sort Rush!</h1>
        <p className="mt-2 text-xl text-charcoal-700">Drag each item into the right bin.</p>
        <div className="mt-5 flex justify-center gap-3 text-4xl" aria-hidden>
          <span className="anim-bin-happy">♻️</span><span className="anim-bin-happy" style={{ animationDelay: ".15s" }}>🍃</span>
          <span className="anim-bin-happy" style={{ animationDelay: ".3s" }}>🗑️</span><span className="anim-bin-happy" style={{ animationDelay: ".45s" }}>⚡</span>
        </div>
        <div className="mt-6"><Button size="lg" variant="primary" onClick={start} className="px-12 text-xl">Play!</Button></div>
        <label className="mt-5 inline-flex cursor-pointer items-center gap-2 text-sm text-charcoal-700">
          <input type="checkbox" checked={relaxed} onChange={(e) => setRelaxed(e.target.checked)} className="h-5 w-5" /> Relaxed mode (no timer)
        </label>
        <div className="mt-6"><Planet stage={stage} /></div>
        <p className="mt-2 text-xs text-charcoal-500">Answers follow most U.S. curbside programs. Your city may differ.</p>
      </div>
    );
  }

  if (phase === "done") {
    return (
      <div className="mx-auto max-w-xl px-6 py-8 text-center">
        <Buddy mood={score >= answers.length * 0.65 ? "cheer" : "happy"} className="mx-auto w-28" />
        <div className="mt-2 text-5xl" aria-label={`${stars} stars`}>
          {[0, 1, 2].map((i) => <span key={i} className={`inline-block ${i < stars ? "anim-pop" : "opacity-25 grayscale"}`} style={{ animationDelay: `${i * 0.2}s` }}>⭐</span>)}
        </div>
        <h1 className="mt-2 font-serif text-6xl font-bold text-forest-700">{score}<span className="text-3xl text-charcoal-500"> / {answers.length}</span></h1>
        {spot ? (
          <p className="mx-auto mt-4 max-w-sm rounded-2xl bg-orange-100 p-3 text-sm font-semibold text-orange-900">Practice next: {spot.title}</p>
        ) : (
          <p className="mx-auto mt-4 max-w-sm rounded-2xl bg-forest-100 p-3 text-sm font-semibold text-forest-900">Perfect! No weak spots.</p>
        )}
        {newBadges.length > 0 && (
          <ul className="mt-4 flex flex-wrap justify-center gap-3">
            {newBadges.map((b) => (
              <li key={b.id} className="anim-pop rounded-2xl border-2 border-amber-400 bg-amber-50 px-4 py-2 text-sm font-bold text-amber-900">
                <span className="block text-3xl" aria-hidden>{b.emoji}</span>{b.title}
              </li>
            ))}
          </ul>
        )}
        <details className="mx-auto mt-5 max-w-sm text-left text-sm">
          <summary className="cursor-pointer text-center font-semibold text-forest-700">See every item</summary>
          <ul className="mt-2 space-y-1">
            {answers.map((a, i) => (
              <li key={i} className={`flex items-center gap-2 rounded-xl px-3 py-1.5 ${a.correct ? "bg-forest-50" : "bg-orange-50"}`}>
                <span className="text-xl" aria-hidden>{emojiFor(a.item)}</span>
                <span className="capitalize">{a.item.names[0]}</span>
                <span className="ml-auto">{a.correct ? "✅" : `→ ${BIN_ICON[binFor(a.item.disp)!]}`}</span>
              </li>
            ))}
          </ul>
        </details>
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button variant="primary" size="lg" onClick={start}>Play again</Button>
          <Button variant="secondary" size="lg" onClick={share}>{shared ? "Shared!" : "Share 📣"}</Button>
          <LinkButton href="/impact" variant="ghost">My badges</LinkButton>
        </div>
      </div>
    );
  }

  const rule = item ? RULES_BY_ID[item.rules[0]] : null;
  const best = item ? binFor(item.disp) : null;

  return (
    <div className="mx-auto max-w-2xl select-none px-3 py-4 pb-32 sm:px-6 md:pb-8" style={{ touchAction: "none" }}>
      {/* HUD */}
      <div className="flex items-center justify-between rounded-2xl bg-white/80 px-4 py-2 text-lg font-bold shadow-sm">
        <span aria-label={`${lives} lives left`}>{Array.from({ length: START_LIVES }, (_, i) => <span key={i} className={i < lives ? "" : "opacity-25 grayscale"}>❤️</span>)}</span>
        <span className="font-serif text-forest-700">⭐ {score}</span>
        <span className="min-w-[4.5rem] text-right text-orange-600" aria-live="polite">{streak >= 2 ? `🔥 ${streak}` : `${Math.min(idx + 1, round.length)}/${round.length}`}</span>
      </div>

      {/* Sorting center */}
      <div className="relative mt-3 h-56 overflow-hidden rounded-3xl border-4 border-charcoal-800 bg-gradient-to-b from-sky-200 to-sky-50 shadow-lg sm:h-64">
        <div className="absolute left-5 top-4 h-10 w-10 rounded-full bg-amber-300 shadow-[0_0_30px_8px_rgba(252,211,77,0.6)]" aria-hidden />
        <div className="absolute right-6 top-5 text-3xl opacity-80" aria-hidden>☁️</div>
        <div className="absolute left-1/3 top-8 text-2xl opacity-70" aria-hidden>☁️</div>
        <div className="absolute inset-x-0 top-0 mx-auto w-44 rounded-b-2xl bg-forest-600 py-1 text-center font-serif text-sm font-bold tracking-wide text-white shadow-md">SORTING CENTER</div>
        {/* belt */}
        <div ref={beltRef} className="absolute inset-x-0 bottom-0 h-16 border-t-4 border-charcoal-900 bg-charcoal-700">
          <div className="anim-belt-stripes absolute inset-0" aria-hidden />
          <div className="absolute inset-x-0 top-0 h-2 bg-charcoal-500/70" aria-hidden />
        </div>
        {/* item */}
        {item && (
          <div ref={outerRef} className="absolute bottom-[4.1rem]" style={{ left: "-15%", transform: "translateX(-50%)" }}>
            <div
              ref={innerRef}
              key={idx}
              onPointerDown={onDown}
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerCancel={onUp}
              role="button"
              tabIndex={0}
              aria-label={`${item.names[0]}. Drag to a bin, or tap a bin.`}
              className="cursor-grab touch-none text-center active:cursor-grabbing"
            >
              <div className="text-7xl leading-none drop-shadow-lg sm:text-8xl">{emojiFor(item)}</div>
              <div className="mx-auto mt-1 w-max max-w-[9rem] rounded-full border-2 border-charcoal-800 bg-white px-3 py-0.5 text-xs font-bold capitalize text-charcoal-900">{item.names[0]}</div>
            </div>
          </div>
        )}
        {/* helper */}
        {phase === "play" && idx === 0 && (
          <p className="absolute inset-x-0 top-12 text-center text-sm font-bold text-charcoal-700">Drag the item to a bin 👇</p>
        )}
      </div>

      {/* Bins */}
      <div className="mt-4 grid grid-cols-4 gap-2 sm:gap-3" role="group" aria-label="Bins">
        {BINS.map((b) => {
          const open = hover === b.id || (popBin?.bin === b.id);
          const anim = popBin?.bin === b.id ? (popBin.ok ? "anim-bin-happy" : "anim-bin-wobble") : "";
          return (
            <button key={b.id} data-bin={b.id} onClick={() => tapBin(b.id)} disabled={phase !== "play"} aria-label={b.label}
              className={`relative flex flex-col items-center justify-end pt-5 ${anim} ${hover === b.id ? "scale-110" : ""} transition-transform`}>
              {/* lid */}
              <span aria-hidden className="absolute top-2 h-3 w-[92%] origin-left rounded-full border-2 border-charcoal-900 transition-transform duration-200"
                style={{ backgroundColor: b.color, filter: "brightness(1.15)", transform: open ? "rotate(-28deg) translateY(-3px)" : "rotate(0)" }} />
              <span className="flex h-24 w-full flex-col items-center justify-center rounded-b-2xl border-4 border-charcoal-900 text-white shadow-md sm:h-28" style={{ backgroundColor: b.color, clipPath: "polygon(0 0,100% 0,92% 100%,8% 100%)", borderRadius: 0 }}>
                <span className="text-3xl sm:text-4xl" aria-hidden>{BIN_ICON[b.id]}</span>
                <span className="mt-1 text-[11px] font-extrabold uppercase tracking-wide sm:text-xs">{b.label}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Buddy + feedback */}
      <div className="mt-4 flex items-start gap-3">
        <Buddy mood={mood} className="w-16 shrink-0 sm:w-20" />
        <div className="min-h-[5rem] flex-1">
          {phase === "feedback" && fb && item ? (
            <div className="anim-flip rounded-2xl border-4 border-charcoal-900 bg-white p-3" role="status">
              <p className={`font-serif text-xl font-bold ${fb.ok ? "text-forest-700" : "text-orange-700"}`}>
                {fb.ok ? "Yes! 🎉" : fb.missed ? "Too slow! ⏰" : "Oops! 😅"}
              </p>
              {!fb.ok && best && <p className="text-sm font-bold">Goes in {BIN_ICON[best]} {BINS.find((b) => b.id === best)?.label}</p>}
              {rule && <p className="mt-1 text-sm text-charcoal-700"><strong>{rule.title}.</strong> {fb.ok ? "" : rule.text}</p>}
              {!fb.ok && <div className="mt-2"><Button size="sm" variant="primary" onClick={next}>Got it</Button></div>}
            </div>
          ) : (
            <p className="rounded-2xl bg-white/70 p-3 text-sm font-semibold text-charcoal-600">{relaxed ? "Take your time!" : "Quick! Sort it before it leaves the belt."}</p>
          )}
        </div>
      </div>
      {newBadges.length > 0 && (
        <p className="anim-pop mt-3 text-center text-sm font-bold text-forest-700" role="status">
          New badge: {newBadges[newBadges.length - 1].emoji} {newBadges[newBadges.length - 1].title}
        </p>
      )}
    </div>
  );
}
