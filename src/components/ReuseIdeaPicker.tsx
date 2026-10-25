"use client";

import { useState } from "react";
import { Button } from "./Button";
import { REUSE_LIBRARY } from "@/lib/mockData";

const ITEMS = Object.keys(REUSE_LIBRARY);

export function ReuseIdeaPicker() {
  const [selected, setSelected] = useState(ITEMS[0]);
  const [ideas, setIdeas] = useState<string[]>(REUSE_LIBRARY[ITEMS[0]].slice(0, 4));
  const [loading, setLoading] = useState(false);

  function selectItem(item: string) {
    setSelected(item);
    setIdeas(REUSE_LIBRARY[item].slice(0, 4));
  }

  async function generateMore() {
    setLoading(true);
    try {
      const res = await fetch("/api/reuse-ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item: selected, exclude: ideas }),
      });
      const data = await res.json();
      if (Array.isArray(data.ideas) && data.ideas.length > 0) {
        setIdeas(data.ideas);
      } else {
        // Fallback: reshuffle the local library if the API returned nothing new
        const pool = REUSE_LIBRARY[selected];
        setIdeas([...pool].sort(() => Math.random() - 0.5).slice(0, 4));
      }
    } catch {
      const pool = REUSE_LIBRARY[selected];
      setIdeas([...pool].sort(() => Math.random() - 0.5).slice(0, 4));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="organic-card border border-moss-100 bg-white p-6 shadow-soft sm:p-8">
      <h2 className="font-display text-2xl font-semibold text-moss-900">
        Creative Reuse Ideas
      </h2>
      <p className="mt-1 text-ink/60">Pick an item to see what it could become.</p>

      <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Choose an item">
        {ITEMS.map((item) => (
          <button
            key={item}
            onClick={() => selectItem(item)}
            aria-pressed={selected === item}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              selected === item
                ? "border-moss-700 bg-moss-800 text-paper"
                : "border-moss-200 bg-white text-ink/70 hover:bg-moss-50"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <ul className="mt-5 space-y-2.5">
        {ideas.map((idea, i) => (
          <li
            key={idea + i}
            className="flex animate-rise-in items-start gap-3 text-sm text-ink/80"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <span
              aria-hidden
              className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-moss-100 text-xs text-moss-700"
            >
              {i + 1}
            </span>
            {idea}
          </li>
        ))}
      </ul>

      <div className="mt-5">
        <Button variant="secondary" onClick={generateMore} disabled={loading}>
          {loading ? "Thinking…" : "Generate More Ideas"}
        </Button>
      </div>
    </section>
  );
}
