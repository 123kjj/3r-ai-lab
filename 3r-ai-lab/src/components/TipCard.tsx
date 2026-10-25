export function TipCard({ tip }: { tip: string }) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-moss-800 px-6 py-7 text-paper shadow-lift sm:px-8">
      <div
        aria-hidden
        className="absolute -right-8 -top-10 h-32 w-32 rounded-blob bg-moss-700/60 animate-sway"
      />
      <p className="relative mb-2 text-sm font-medium text-moss-200">
        Today&rsquo;s 3R tip
      </p>
      <p className="relative max-w-xl font-display text-xl leading-snug sm:text-2xl">
        {tip}
      </p>
    </div>
  );
}
