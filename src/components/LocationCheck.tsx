interface LocationCheckProps {
  warning: string;
  item: string;
  category: string;
}

/** Honest local-rules note: we have no live municipal data, so we say so and point to a lookup. */
export function LocationCheck({ warning }: LocationCheckProps) {
  return (
    <div className="border border-soil-300 bg-soil-50 p-6">
      <h3 className="font-serif text-lg font-semibold text-soil-900">Check your local rules</h3>
      <p className="mt-2 text-sm text-charcoal-700">{warning}</p>
      <p className="mt-2 text-sm text-charcoal-700">
        This app does not have live data for your city. Search your local program before using a bin:
      </p>
      <a
        href="https://search.earth911.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-block text-sm font-medium text-forest-800 underline"
      >
        Find local recycling options (Earth911)
      </a>
    </div>
  );
}
