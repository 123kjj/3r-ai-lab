"use client";

import { useEffect, useState } from "react";
import { BADGES } from "@/lib/badges";
import { EMPTY_PROGRESS, loadProgress, planetStage, Progress } from "@/lib/progress";
import { Planet } from "./Planet";

export function BadgeShelf() {
  const [p, setP] = useState<Progress>(EMPTY_PROGRESS);
  useEffect(() => setP(loadProgress()), []);
  const earned = BADGES.filter((b) => b.earned(p));
  return (
    <section className="mt-10" aria-labelledby="badges-h">
      <h2 id="badges-h" className="font-serif text-xl font-semibold text-forest-900">Badges &amp; planet</h2>
      <div className="mt-4 grid gap-6 border border-charcoal-200 bg-white p-5 sm:grid-cols-[9rem,1fr]">
        <div>
          <Planet stage={planetStage(p.rulesLearned.length)} />
          <p className="mt-2 text-center text-xs text-charcoal-500">{p.rulesLearned.length} rules learned</p>
        </div>
        <div>
          <p className="text-sm text-charcoal-600">{earned.length} of {BADGES.length} earned. Stored only in this browser.</p>
          <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {BADGES.map((b) => {
              const on = b.earned(p);
              return (
                <li key={b.id} title={b.how} className={`border p-2 text-center text-xs ${on ? "border-forest-600 bg-forest-50 text-forest-900" : "border-charcoal-200 text-charcoal-400"}`}>
                  <span className={`block text-2xl ${on ? "" : "opacity-30 grayscale"}`} aria-hidden>{b.emoji}</span>
                  <span className="font-medium">{b.title}</span>
                  <span className="mt-0.5 block">{on ? "Earned" : b.how}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
