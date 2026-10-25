"use client";

import { useState } from "react";
import { LearningReceipt } from "@/lib/types";
import { Button } from "./Button";

const ACTION_LABEL: Record<LearningReceipt["recommendedAction"], string> = {
  reduce: "Reduce",
  reuse: "Reuse",
  recycle: "Recycle",
};

interface LearningReceiptCardProps {
  receipt: LearningReceipt;
  onSaveReflection?: (answer: string) => void;
  saved?: "none" | "cloud" | "local" | "failed";
}

/**
 * The Learning Receipt — the most distinctive single artifact the app
 * produces. Styled like a printed field-lab receipt rather than
 * another rounded "card," per the design brief.
 */
export function LearningReceiptCard({ receipt, onSaveReflection, saved }: LearningReceiptCardProps) {
  const [reflection, setReflection] = useState(receipt.reflectionAnswer ?? "");
  const [submitted, setSubmitted] = useState(Boolean(receipt.reflectionAnswer));

  return (
    <div className="mx-auto max-w-xl border border-charcoal-300 bg-paper-50 font-mono text-xs text-charcoal-700 shadow-sm">
      <div className="border-b border-dashed border-charcoal-300 px-6 py-4 text-center">
        <p className="font-serif text-sm font-semibold uppercase tracking-[0.2em] text-forest-900">
          Learning Receipt
        </p>
        <p className="mt-1 text-[11px] text-charcoal-500">
          {new Date(receipt.createdAt).toLocaleString()}
        </p>
      </div>

      <div className="space-y-4 px-6 py-5">
        <Row label="01 — Object & likely materials">
          <p className="font-sans text-sm text-charcoal-800">{receipt.itemName}</p>
          <p className="font-sans text-sm text-charcoal-600">{receipt.likelyMaterials}</p>
        </Row>

        <Row label="02 — Recommended next action">
          <p className="font-sans text-sm font-semibold text-forest-800">
            {ACTION_LABEL[receipt.recommendedAction]}
          </p>
          <p className="font-sans text-sm text-charcoal-700">{receipt.recommendationReason}</p>
        </Row>

        <Row label="03 — Surprising fact">
          <p className="font-sans text-sm text-charcoal-700">{receipt.surprisingFact}</p>
        </Row>

        <Row label="04 — Realistic alternatives">
          <p className="font-sans text-sm text-charcoal-700">{receipt.alternativesSummary}</p>
        </Row>

        <Row label="05 — Sources & evidence quality">
          {receipt.sources.length > 0 ? (
            <ul className="space-y-1">
              {receipt.sources.map((s, i) => (
                <li key={i}>
                  {s.url ? (
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-sans text-sm text-forest-700 underline decoration-forest-300 underline-offset-2"
                    >
                      {s.title}
                    </a>
                  ) : (
                    <span className="font-sans text-sm text-charcoal-700">{s.title}</span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="font-sans text-sm italic text-charcoal-500">
              No sourced citation available for this item — see note below.
            </p>
          )}
        </Row>

        <Row label="06 — What could change this answer">
          <p className="font-sans text-sm text-charcoal-700">{receipt.missingInfoNote}</p>
        </Row>

        <Row label="07 — One thing you can do now">
          <p className="font-sans text-sm font-medium text-charcoal-800">
            {receipt.concreteNextAction}
          </p>
        </Row>

        <Row label="08 — Reflection">
          <p className="font-sans text-sm text-charcoal-700">{receipt.reflectionQuestion}</p>
          {!submitted ? (
            <form
              className="mt-2 flex flex-col gap-2 sm:flex-row"
              onSubmit={(e) => {
                e.preventDefault();
                if (!reflection.trim()) return;
                onSaveReflection?.(reflection.trim());
                setSubmitted(true);
              }}
            >
              <input
                type="text"
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="Your answer…"
                className="flex-1 border border-charcoal-300 bg-white px-3 py-2 font-sans text-sm text-charcoal-800 focus:border-forest-600"
              />
              <Button type="submit" variant="primary" size="sm">
                Save
              </Button>
            </form>
          ) : (
            <p className="mt-2 font-sans text-sm italic text-forest-700">
              &ldquo;{reflection}&rdquo; — recorded.
            </p>
          )}
        </Row>
      </div>

      <div className="border-t border-dashed border-charcoal-300 px-6 py-3 text-center text-[10px] uppercase tracking-wide text-charcoal-400">
        {saved === "cloud" ? "Saved to your account ✅" : saved === "local" ? "Saved on this device ✅ (sign in to keep it everywhere)" : saved === "failed" ? "Couldn't save — your browser blocked storage" : "Write your answer and press Save"}
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wide text-charcoal-400">{label}</p>
      <div className="mt-1">{children}</div>
    </div>
  );
}
