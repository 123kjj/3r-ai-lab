"use client";

import { useEffect } from "react";
import { recordEvent } from "@/lib/progress";
import { CRAFTS_BY_ID } from "@/lib/crafts";
import { CraftArt, hasCraftArt } from "./CraftArt";

export function CraftCard({ craftId }: { craftId: string }) {
  const c = CRAFTS_BY_ID[craftId];
  useEffect(() => {
    if (!c) return;
    try {
      const k = "3r-crafts-seen";
      const seen: string[] = JSON.parse(sessionStorage.getItem(k) ?? "[]");
      if (!seen.includes(c.id)) {
        seen.push(c.id);
        sessionStorage.setItem(k, JSON.stringify(seen));
        recordEvent({ type: "craft" });
      }
    } catch {}
  }, [c]);
  if (!c) return null;
  return (
    <section className="rounded-3xl border-4 border-amber-200 bg-white p-5 shadow-md" aria-labelledby={`craft-${c.id}`}>
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-charcoal-500">Make something</p>
      <h3 id={`craft-${c.id}`} className="mt-1 font-serif text-xl font-semibold text-forest-900">{c.title}</h3>
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        {hasCraftArt(c.id) ? (
          <div>
            <CraftArt id={c.id} />
            <p className="mt-1 text-center text-xs text-charcoal-500">Illustration of the finished craft</p>
          </div>
        ) : null}
        <div className="text-sm text-charcoal-700">
          <p className="font-medium text-forest-900">You&rsquo;ll need</p>
          <ul className="mt-1 list-disc pl-5">{c.materials.map((m) => <li key={m}>{m}</li>)}</ul>
          <p className="mt-3 font-medium text-forest-900">Steps</p>
          <ol className="mt-1 list-decimal pl-5">{c.steps.map((s) => <li key={s}>{s}</li>)}</ol>
        </div>
      </div>
      {c.safety && <p className="mt-3 border-l-4 border-soil-500 bg-soil-50 px-3 py-2 text-sm text-soil-900"><strong>Safety:</strong> {c.safety}</p>}
    </section>
  );
}
