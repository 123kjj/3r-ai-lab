"use client";

import { useCountUp } from "@/hooks/useCountUp";

export function StatCard({
  value,
  label,
  icon,
}: {
  value: number;
  label: string;
  icon: string;
}) {
  const displayValue = useCountUp(value);
  return (
    <div className="organic-card flex flex-col items-center gap-1 border border-moss-100 bg-white px-4 py-6 text-center shadow-soft">
      <span aria-hidden className="text-2xl">
        {icon}
      </span>
      <span className="font-display text-3xl font-semibold text-moss-900">
        {displayValue}
      </span>
      <span className="text-sm text-ink/60">{label}</span>
    </div>
  );
}
