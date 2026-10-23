"use client";

import { useEffect, useState } from "react";
import { LinkButton } from "@/components/Button";
import { StatCard } from "@/components/StatCard";
import { TipCard } from "@/components/TipCard";
import { ChallengeCard } from "@/components/ChallengeCard";
import { useImpact } from "@/context/ImpactContext";
import { DAILY_TIPS } from "@/lib/mockData";

export default function HomePage() {
  const { stats, isDemo } = useImpact();

  // Computing this from `new Date()` directly during render caused a
  // React hydration mismatch in production: Vercel can statically
  // pre-render this page at build time, so the server-rendered HTML's
  // date and the client's live date can disagree (even just by crossing
  // midnight), producing "today's date changed" hydration errors.
  // Fix: render a fixed value on both the server and the first client
  // pass (index 0), then update it client-side only after mount.
  const [tipIndex, setTipIndex] = useState(0);
  useEffect(() => {
    setTipIndex(new Date().getDate() % DAILY_TIPS.length);
  }, []);

  return (
    <div>
      {/* Hero: problem first */}
      <section className="border-b border-charcoal-200 bg-gradient-to-b from-sky-100 via-paper to-paper px-6 pb-14 pt-14 sm:pt-20">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-charcoal-500">
            3R-AI · Material Afterlife Lab
          </p>
          <h1 className="mt-3 font-serif text-4xl font-semibold leading-[1.1] text-forest-900 sm:text-5xl">
            Only about 21% of household recyclables actually get recycled.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-charcoal-600">
            Wrong end-of-life decisions at home — landfilling what could be composted or recycled,
            and contaminating what can&rsquo;t — add up. 3R-AI gives an honest, sourced answer for the
            item you're holding: reuse, recycle or dispose, with the evidence quality shown.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <LinkButton href="/scan" size="lg" variant="primary">Check an item</LinkButton>
            <LinkButton href="/play" size="lg" variant="secondary">Play Sort Rush</LinkButton>
          </div>
          <p className="mt-4 text-xs text-charcoal-500">
            Source: Recycling Partnership 2024 residential recycling report; EPA WARM for emissions
            data. See <a className="underline" href="/methodology">Methodology</a>.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl space-y-10 px-6 pb-16 pt-10">
        {/* Your Impact */}
        <section aria-labelledby="your-impact-heading">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 id="your-impact-heading" className="font-serif text-2xl font-semibold text-forest-900">
              Your Impact
            </h2>
            {isDemo && (
              <span className="text-xs font-medium text-soil-700">Demo data</span>
            )}
          </div>
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <StatCard value={stats.reusedCount} label="Items Reused" icon="🔵" />
            <StatCard value={stats.recycledCount} label="Items Recycled" icon="♻️" />
            <StatCard value={stats.reducedCount} label="Items Reduced" icon="🟢" />
          </div>
        </section>

        {/* Today's tip */}
        <section aria-label="Today's 3R tip">
          <TipCard tip={DAILY_TIPS[tipIndex]} />
        </section>

        {/* Challenge */}
        <section aria-label="7-day 3R challenge">
          <ChallengeCard day={stats.challengeDay} />
        </section>
      </div>
    </div>
  );
}
