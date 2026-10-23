export function Logo({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-baseline gap-2 font-serif text-lg font-semibold tracking-tight text-forest-900 ${className}`}
    >
      <span
        aria-hidden
        className="grid h-7 w-7 place-items-center border border-forest-800 font-mono text-[11px] font-semibold text-forest-800"
      >
        3R
      </span>
      <span>
        Material Afterlife Lab
        <span className="ml-1.5 align-top text-[10px] font-sans font-medium uppercase tracking-wide text-charcoal-400">
          3R-AI
        </span>
      </span>
    </span>
  );
}
