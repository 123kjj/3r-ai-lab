import { Achievement, ImpactStats } from "@/lib/types";

export function AchievementBadge({
  achievement,
  stats,
}: {
  achievement: Achievement;
  stats: ImpactStats;
}) {
  const unlocked = achievement.isUnlocked(stats);
  return (
    <div
      className={`organic-card flex flex-col items-center gap-1.5 border p-4 text-center transition-all ${
        unlocked
          ? "animate-pop border-moss-300 bg-white shadow-soft"
          : "border-moss-100 bg-moss-50/50 opacity-50"
      }`}
    >
      <span aria-hidden className={`text-2xl ${unlocked ? "" : "grayscale"}`}>
        {achievement.icon}
      </span>
      <p className="text-xs font-semibold text-ink/80">{achievement.label}</p>
      <p className="text-[11px] text-ink/50">{achievement.description}</p>
    </div>
  );
}
