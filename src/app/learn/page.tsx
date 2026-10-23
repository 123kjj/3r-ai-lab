import { LearnSection } from "@/components/LearnSection";
import { ReuseIdeaPicker } from "@/components/ReuseIdeaPicker";

export default function LearnPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-6 py-10 sm:py-14">
      <div className="text-center">
        <h1 className="font-display text-3xl font-semibold text-moss-900 sm:text-4xl">
          Learn the 3Rs
        </h1>
        <p className="mt-2 text-ink/60">
          A quick refresher on what each R actually means in practice.
        </p>
      </div>

      <LearnSection
        icon="🟢"
        title="Reduce"
        tagline="Use less in the first place."
        accent="border-moss-200 bg-moss-50"
        examples={[
          "Avoid unnecessary packaging",
          "Choose reusable products",
          "Buy only what you need",
        ]}
      />

      <LearnSection
        icon="🔵"
        title="Reuse"
        tagline="Use something again instead of throwing it away."
        accent="border-soil-300/60 bg-soil-100/40"
        examples={["Reuse containers", "Repair items", "Repurpose materials"]}
      />

      <LearnSection
        icon="♻️"
        title="Recycle"
        tagline="Turn used materials into resources when possible."
        accent="border-moss-200 bg-moss-50"
        examples={[
          "Rinse containers before recycling",
          "Flatten cardboard to save space",
          "Separate materials your program doesn't accept",
        ]}
        note="Recycling rules vary by location — what's accepted curbside in one city may need drop-off in another. Always check with your local program."
      />

      <ReuseIdeaPicker />
    </div>
  );
}
