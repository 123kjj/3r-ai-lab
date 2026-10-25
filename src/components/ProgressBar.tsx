export function ProgressBar({
  value,
  max,
  label,
}: {
  value: number;
  max: number;
  label?: string;
}) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div>
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
        className="h-3 w-full overflow-hidden rounded-full bg-moss-100"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-moss-500 to-moss-700 transition-[width] duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
