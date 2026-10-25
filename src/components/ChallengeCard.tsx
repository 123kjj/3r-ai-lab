import { Button } from "./Button";
import { ProgressBar } from "./ProgressBar";

export function ChallengeCard({ day }: { day: number }) {
  return (
    <div className="organic-card border border-moss-100 bg-white p-6 shadow-soft sm:p-8">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h3 className="font-display text-xl font-semibold text-moss-900">
            7-Day 3R Challenge
          </h3>
          <p className="mt-1 text-sm text-ink/60">
            Day {day} of 7 — one small action a day adds up fast.
          </p>
        </div>
        <span aria-hidden className="text-3xl">
          🌱
        </span>
      </div>
      <ProgressBar value={day} max={7} label={`Challenge progress: day ${day} of 7`} />
      <div className="mt-5">
        <Button variant="secondary">Continue Challenge</Button>
      </div>
    </div>
  );
}
