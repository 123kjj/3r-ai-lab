"use client";

import { useEffect, useState } from "react";

const STEPS = [
  { icon: "🔍", label: "Identifying item..." },
  { icon: "🌎", label: "Evaluating environmental impact..." },
  { icon: "♻️", label: "Comparing 3R options..." },
];

export function AnalyzingLoader() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((s) => (s < STEPS.length - 1 ? s + 1 : s));
    }, 1100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="organic-card mx-auto flex max-w-md flex-col items-center gap-6 border border-moss-100 bg-white px-8 py-12 text-center shadow-soft"
      role="status"
      aria-live="polite"
    >
      <span aria-hidden className="animate-sway text-5xl">
        🌿
      </span>
      <div className="w-full space-y-3">
        {STEPS.map((step, i) => (
          <div
            key={step.label}
            className={`flex items-center gap-3 rounded-2xl px-4 py-2.5 transition-all duration-300 ${
              i === activeStep
                ? "bg-moss-50 opacity-100"
                : i < activeStep
                ? "opacity-50"
                : "opacity-30"
            }`}
          >
            <span aria-hidden className={i === activeStep ? "animate-pulse-soft" : ""}>
              {step.icon}
            </span>
            <span className="text-sm font-medium text-ink/80">{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
