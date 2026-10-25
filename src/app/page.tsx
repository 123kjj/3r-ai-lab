import Link from "next/link";
import { Buddy } from "@/components/Buddy";

const TILES = [
  { href: "/play", emoji: "🎮", title: "Sort Rush", sub: "Drag items into bins", cls: "from-orange-300 to-orange-400 shadow-[0_6px_0_0_#C2410C]" },
  { href: "/scan", emoji: "🔍", title: "Check an item", sub: "Where does it go?", cls: "from-forest-300 to-forest-400 shadow-[0_6px_0_0_#2D5323]" },
  { href: "/quiz", emoji: "⭐", title: "Quiz", sub: "How good is your aim?", cls: "from-sky-300 to-sky-400 shadow-[0_6px_0_0_#0369A1]" },
];

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span className="anim-planet absolute left-[8%] top-12 text-4xl opacity-70">☁️</span>
        <span className="anim-planet absolute right-[10%] top-24 text-5xl opacity-60" style={{ animationDelay: "1s" }}>☁️</span>
        <span className="anim-planet absolute left-[15%] top-[26rem] text-3xl" style={{ animationDelay: ".5s" }}>🍃</span>
        <span className="anim-planet absolute right-[14%] top-[30rem] text-3xl" style={{ animationDelay: "1.5s" }}>🌱</span>
      </div>

      <section className="relative mx-auto max-w-3xl px-6 pb-6 pt-10 text-center sm:pt-14">
        <Buddy mood="cheer" className="mx-auto w-32 sm:w-40" />
        <h1 className="mt-3 font-serif text-5xl font-bold leading-tight text-forest-700 sm:text-6xl">Sort it right!</h1>
        <p className="mt-2 text-xl text-charcoal-700">Learn where things go. Help the planet. 🌍</p>
      </section>

      <section className="relative mx-auto grid max-w-3xl gap-5 px-6 pb-8 sm:grid-cols-3" aria-label="Choose an activity">
        {TILES.map((t) => (
          <Link key={t.href} href={t.href} className={`tilt-card group rounded-3xl bg-gradient-to-b ${t.cls} p-6 text-center text-white transition-transform active:translate-y-1`}>
            <span className="block text-6xl transition-transform group-hover:scale-110" aria-hidden>{t.emoji}</span>
            <span className="mt-2 block font-serif text-2xl font-bold">{t.title}</span>
            <span className="block text-sm font-semibold opacity-95">{t.sub}</span>
          </Link>
        ))}
      </section>

      <section className="relative mx-auto max-w-xl px-6 pb-16 text-center">
        <div className="rounded-3xl border-4 border-white bg-white/80 p-5 shadow-md">
          <p className="text-4xl" aria-hidden>♻️</p>
          <p className="mt-1 text-lg font-bold text-charcoal-800">Only about <span className="text-forest-600">21%</span> of household recyclables get recycled.</p>
          <p className="mt-1 text-xs text-charcoal-500">Recycling Partnership, 2024 · Sorting rules vary by city</p>
          <Link href="/problem" className="mt-3 inline-block rounded-full bg-forest-100 px-4 py-1.5 text-sm font-bold text-forest-700 hover:bg-forest-200">Why this matters →</Link>
        </div>
      </section>
    </div>
  );
}
