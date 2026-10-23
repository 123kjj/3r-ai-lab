"use client";

import { useState } from "react";
import { LocalRuleResult } from "@/lib/types";

interface LocationCheckProps {
  warning: string;
  item: string;
  category: string;
}

export function LocationCheck({ warning, item, category }: LocationCheckProps) {
  const [location, setLocation] = useState("");
  const [result, setResult] = useState<LocalRuleResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!location.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/local-rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item, category, location: location.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
      } else {
        setResult(data as LocalRuleResult);
      }
    } catch {
      setError("Something went wrong reaching the guidance service.");
    } finally {
      setLoading(false);
    }
  }

  const confidenceLabel: Record<LocalRuleResult["confidence"], string> = {
    verified: "Verified against a live source",
    general_guidance: "General guidance — not an official lookup",
    unknown: "No reliable guidance available",
  };

  return (
    <div className="organic-card border border-soil-300/60 bg-soil-100/40 p-6">
      <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-soil-900">
        <span aria-hidden>📍</span> Check Local Rules
      </h3>
      <p className="mt-2 text-sm text-ink/70">{warning}</p>

      <form className="mt-4 flex flex-col gap-2 sm:flex-row" onSubmit={handleSubmit}>
        <label htmlFor="location-input" className="sr-only">
          Your city or state
        </label>
        <input
          id="location-input"
          type="text"
          placeholder="Enter your city or state"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="flex-1 rounded-full border border-soil-300 bg-white px-4 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:border-moss-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-soil-700 px-5 py-2.5 text-sm font-semibold text-paper transition-transform hover:-translate-y-0.5 hover:bg-soil-900 disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {loading ? "Checking…" : "Check"}
        </button>
      </form>

      {error && (
        <p role="alert" className="mt-3 text-sm font-medium text-soil-800">
          {error}
        </p>
      )}

      {result && (
        <div className="mt-3 rounded-xl bg-white/70 px-4 py-3 text-sm text-ink/80">
          <p>{result.guidance}</p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-soil-700">
            {confidenceLabel[result.confidence]}
          </p>
          <p className="mt-1 text-xs text-ink/60">{result.limitationNote}</p>
          {result.source?.url && (
            <a
              href={result.source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block text-xs font-medium text-moss-700 underline"
            >
              {result.source.title}
            </a>
          )}
        </div>
      )}

      <p className="mt-3 text-xs text-ink/50">
        Recycling rules vary widely by city and hauler — always confirm before
        placing an item in a curbside bin.
      </p>
    </div>
  );
}
