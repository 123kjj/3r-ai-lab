"use client";

import { ScenarioResult, ThreeFutureScenarios } from "@/lib/types";

const PATH_META: Record<ScenarioResult["path"], { title: string }> = {
  reuse: { title: "Reuse" },
  recycle: { title: "Recycle" },
  dispose: { title: "Dispose" },
};

const EVIDENCE_LABEL: Record<ScenarioResult["evidenceQuality"], string> = {
  high: "High — sourced, material-specific data",
  moderate: "Moderate — curated guidance, not independently quantified",
  low: "Low — limited sourced data available",
  none: "None — item couldn't be confidently classified",
};

function ScenarioCard({ scenario }: { scenario: ScenarioResult }) {
  const meta = PATH_META[scenario.path];
  return (
    <article className="flex flex-col border border-charcoal-200 bg-paper-50 p-5">
      <header className="flex items-baseline justify-between border-b border-charcoal-100 pb-3">
        <h3 className="font-serif text-lg font-semibold text-forest-900">{meta.title}</h3>
        <span className="text-[11px] uppercase tracking-wide text-charcoal-500">
          {scenario.path}
        </span>
      </header>

      <p className="mt-3 text-sm font-medium text-forest-800">{scenario.headline}</p>
      <p className="mt-2 text-sm leading-relaxed text-charcoal-700">{scenario.practicalNextStep}</p>

      {scenario.impactFigure ? (
        <div className="mt-4 border-t border-dashed border-charcoal-200 pt-3">
          <p className="font-mono text-sm text-forest-900">
            {scenario.impactFigure.value > 0 ? "+" : ""}
            {scenario.impactFigure.value} {scenario.impactFigure.unit}
          </p>
          <a
            href={scenario.impactFigure.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-block text-xs text-charcoal-500 underline decoration-charcoal-300 underline-offset-2 hover:text-forest-700"
          >
            {scenario.impactFigure.sourceTitle} — {scenario.impactFigure.sourceExhibit}
          </a>
        </div>
      ) : (
        scenario.noDataReason && (
          <p className="mt-4 border-t border-dashed border-charcoal-200 pt-3 text-xs italic text-charcoal-500">
            {scenario.noDataReason}
          </p>
        )
      )}

      {scenario.benefits.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-forest-700">Benefits</p>
          <ul className="mt-1 space-y-1 text-sm text-charcoal-700">
            {scenario.benefits.map((b, i) => (
              <li key={i}>— {b}</li>
            ))}
          </ul>
        </div>
      )}

      {scenario.tradeoffs.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-soil-700">Trade-offs</p>
          <ul className="mt-1 space-y-1 text-sm text-charcoal-700">
            {scenario.tradeoffs.map((t, i) => (
              <li key={i}>— {t}</li>
            ))}
          </ul>
        </div>
      )}

      {scenario.assumptions.length > 0 && (
        <p className="mt-3 text-xs text-charcoal-500">
          Assumes: {scenario.assumptions.join("; ")}
        </p>
      )}

      <p className="mt-4 text-[11px] uppercase tracking-wide text-charcoal-400">
        Evidence quality: {EVIDENCE_LABEL[scenario.evidenceQuality]}
      </p>
    </article>
  );
}

export function ScenarioComparison({ data }: { data: ThreeFutureScenarios }) {
  return (
    <section aria-labelledby="scenario-heading">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 id="scenario-heading" className="font-serif text-xl font-semibold text-forest-900">
          Three Futures: {data.materialCategoryLabel}
        </h2>
      </div>
      {data.unmappedCategory && (
        <p className="mb-4 border border-soil-300 bg-soil-50 px-4 py-3 text-sm text-soil-800">
          We couldn&rsquo;t confidently match this item to one of our tracked material
          categories, so the comparison below is generic rather than material-specific.
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-3">
        {data.scenarios.map((s) => (
          <ScenarioCard key={s.path} scenario={s} />
        ))}
      </div>
      <p className="mt-3 text-xs text-charcoal-500">
        These are scenarios built from category-level data, not a guaranteed prediction of what
        happens to this specific object. See the{" "}
        <a href="/methodology" className="underline decoration-charcoal-300 underline-offset-2">
          Methodology
        </a>{" "}
        page for how this comparison is generated.
      </p>
    </section>
  );
}
