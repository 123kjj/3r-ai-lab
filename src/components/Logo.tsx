export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-serif text-xl font-bold tracking-tight text-forest-700 ${className}`}>
      <span aria-hidden className="grid h-9 w-9 place-items-center rounded-full bg-forest-500 text-lg shadow-[0_3px_0_0_#2D5323]">♻️</span>
      <span>3R-AI</span>
    </span>
  );
}
