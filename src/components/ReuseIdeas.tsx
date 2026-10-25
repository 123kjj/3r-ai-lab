export function ReuseIdeas({ ideas }: { ideas: string[] }) {
  if (ideas.length === 0) return null;
  return (
    <div className="organic-card border border-moss-100 bg-white p-6">
      <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-moss-900">
        <span aria-hidden>💡</span> Creative Reuse Ideas
      </h3>
      <ul className="mt-4 space-y-2.5">
        {ideas.map((idea, i) => (
          <li
            key={idea}
            className="flex animate-rise-in items-start gap-3 text-sm text-ink/80"
            style={{ animationDelay: `${i * 70}ms` }}
          >
            <span
              aria-hidden
              className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-moss-100 text-xs text-moss-700"
            >
              {i + 1}
            </span>
            {idea}
          </li>
        ))}
      </ul>
    </div>
  );
}
