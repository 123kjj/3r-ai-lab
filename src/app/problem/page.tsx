import Link from "next/link";
import { LinkButton } from "@/components/Button";

export const metadata = { title: "The Problem — 3R-AI" };

const SOURCES = {
  epa: "https://www.epa.gov/facts-and-figures-about-materials-waste-and-recycling/national-overview-facts-and-figures-materials",
  rp: "https://recyclingpartnership.org/residential-recycling-report/",
  warm: "https://www.epa.gov/warm",
};

function Section({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-charcoal-200 py-8">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-charcoal-500">{n}</p>
      <h2 className="mt-1 font-serif text-2xl font-semibold text-forest-900">{title}</h2>
      <div className="mt-3 space-y-3 text-charcoal-700">{children}</div>
    </section>
  );
}

export default function ProblemPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-charcoal-500">Problem &amp; Solution</p>
      <h1 className="mt-2 font-serif text-4xl font-semibold leading-tight text-forest-900">
        Households throw away the wrong way — because nobody tells them the honest answer.
      </h1>

      <Section n="01" title="The problem">
        <p>
          Most waste decisions happen at home, in seconds, with no good information. Items get
          landfilled that could have been reused, composted or recycled — and contaminated items get
          tossed into recycling bins, which can spoil whole loads.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Only about <strong>21%</strong> of recyclable material households put out is actually
            recycled (Recycling Partnership, 2024) —{" "}
            <a className="underline" href={SOURCES.rp} target="_blank" rel="noopener noreferrer">source</a>.
          </li>
          <li>
            The U.S. recycled and composted about <strong>32%</strong> of municipal solid waste (EPA, 2018 data); roughly half
            was landfilled, and food was the largest single landfilled material —{" "}
            <a className="underline" href={SOURCES.epa} target="_blank" rel="noopener noreferrer">source</a>.
          </li>
          <li>
            Landfilled food and paper emit methane. In EPA WARM, landfilling food waste is a net{" "}
            <em>increase</em> (+0.50 MTCO₂E/short ton) while composting is a net decrease (−0.15) —{" "}
            <a className="underline" href={SOURCES.warm} target="_blank" rel="noopener noreferrer">source</a>.
          </li>
        </ul>
      </Section>

      <Section n="02" title="Who is affected">
        <p>
          Every household that sorts waste — especially renters, students and families without access
          to clear local guidance — plus the municipal recycling facilities that pay to sort
          contaminated loads, and communities living near landfills. Climate impact is global; the
          decisions that drive it are made one item at a time.
        </p>
      </Section>

      <Section n="03" title="What current approaches miss">
        <ul className="list-disc space-y-2 pl-5">
          <li>City flyers and charts are generic: they don&rsquo;t answer &ldquo;what about <em>this</em> item?&rdquo;</li>
          <li>&ldquo;Is it recyclable?&rdquo; AI tools tend to give a confident answer from a photo, hiding that grease, coatings and local rules change the answer.</li>
          <li>Almost none compare reuse vs. recycling vs. disposal side by side, or show how strong the evidence is.</li>
        </ul>
      </Section>

      <Section n="04" title="The solution: an honest decision aid">
        <p>
          3R-AI identifies the item from a photo, then <strong>asks the questions a photo can&rsquo;t answer</strong> (is it
          empty? greasy?). A transparent rules engine — not the AI — compares three futures: reuse,
          recycle, dispose. Emission figures come only from EPA WARM; where no sourced figure exists,
          the app says so instead of inventing one. A Learning Receipt turns each decision into a
          lesson, and an optional weight input estimates the CO₂e difference versus landfilling.
        </p>
      </Section>

      <Section n="05" title="Research & development">
        <p>
          We built the data layer from EPA WARM documentation (per-entry citations are in the code),
          designed the rules engine to be deterministic and unit-tested (35 automated tests), and
          kept AI to what it is good at: identifying objects. Bugs found by the tests (e.g. a
          cardboard tube misclassified as corrugated, a carpet matching &ldquo;PET&rdquo;) were fixed and
          are now regression tests. See <Link className="underline" href="/methodology">Methodology</Link>.
        </p>
      </Section>

      <Section n="06" title="Impact & feasibility">
        <p>
          <strong>Impact model:</strong> each logged decision can record an estimated kg CO₂e avoided versus
          landfilling = (WARM pathway − WARM landfill) × 0.5 kg per lb × weight. These are
          category-level national averages, not measurements. We have <strong>not</strong> measured real-world
          impact yet and make no claim of it.
        </p>
        <p>
          <strong>Feasibility:</strong> runs on a free-tier stack (Next.js, Vercel, Firebase, Gemini) with no hardware.
          Next step: a school or classroom pilot, measuring decisions logged and reflection answers.
          City-specific rules can plug into the existing provider interface; no municipal partnership is claimed.
        </p>
      </Section>

      <Section n="07" title="Limitations">
        <ul className="list-disc space-y-2 pl-5">
          <li>Vision AI can misidentify items; users can correct or choose the material manually.</li>
          <li>WARM figures are national averages and exclude reuse; textiles have no sourced figure here.</li>
          <li>Local recycling rules vary; the app gives general guidance and says when it can&rsquo;t verify local rules.</li>
        </ul>
      </Section>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <LinkButton href="/scan" size="lg" variant="primary">Try the Material Detective</LinkButton>
        <LinkButton href="/methodology" size="lg" variant="secondary">Read the methodology</LinkButton>
      </div>
    </div>
  );
}
