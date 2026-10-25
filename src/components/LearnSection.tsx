export function LearnSection({
  icon,
  title,
  tagline,
  examples,
  accent,
  note,
}: {
  icon: string;
  title: string;
  tagline: string;
  examples: string[];
  accent: string;
  note?: string;
}) {
  return (
    <section className={`organic-card border p-6 sm:p-8 ${accent}`}>
      <div className="flex items-start gap-4">
        <span aria-hidden className="text-4xl">
          {icon}
        </span>
        <div>
          <h2 className="font-display text-2xl font-semibold text-ink">{title}</h2>
          <p className="mt-1 text-ink/70">{tagline}</p>
        </div>
      </div>
      <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
        {examples.map((ex) => (
          <li key={ex} className="flex items-start gap-2 text-sm text-ink/80">
            <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-50" />
            {ex}
          </li>
        ))}
      </ul>
      {note && <p className="mt-4 text-sm text-ink/60">{note}</p>}
    </section>
  );
}
