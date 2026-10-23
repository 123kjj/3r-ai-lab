export type Mood = "happy" | "oops" | "think" | "cheer";

/** Sprout, our friendly leaf buddy. Original character, drawn in SVG. */
export function Buddy({ mood = "happy", className = "w-24" }: { mood?: Mood; className?: string }) {
  const mouth =
    mood === "oops" ? <path d="M42 70q8-7 16 0" fill="none" stroke="#2B3A2E" strokeWidth="3" strokeLinecap="round" />
    : mood === "think" ? <circle cx="50" cy="70" r="3.5" fill="#2B3A2E" />
    : mood === "cheer" ? <path d="M38 64q12 18 24 0z" fill="#2B3A2E" />
    : <path d="M40 66q10 12 20 0" fill="none" stroke="#2B3A2E" strokeWidth="3" strokeLinecap="round" />;
  return (
    <svg viewBox="0 0 100 100" className={`${className} ${mood === "oops" ? "anim-bin-wobble" : mood === "cheer" ? "anim-bin-happy" : "anim-planet"}`} role="img" aria-label={`Sprout looks ${mood}`}>
      <ellipse cx="50" cy="94" rx="26" ry="4" fill="#2B3A2E" opacity="0.15" />
      {/* leaves */}
      <path d="M50 24c-4-12-14-16-24-14 2 11 12 18 24 14z" fill="#6DBB6E" stroke="#2D6A35" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M50 24c4-12 14-16 24-14-2 11-12 18-24 14z" fill="#4C9A52" stroke="#2D6A35" strokeWidth="2.5" strokeLinejoin="round" />
      {/* body */}
      <circle cx="50" cy="60" r="34" fill="#9AD87A" stroke="#2D6A35" strokeWidth="3" />
      <ellipse cx="38" cy="44" rx="9" ry="5" fill="#fff" opacity="0.35" />
      {/* eyes */}
      <g fill="#fff" stroke="#2B3A2E" strokeWidth="2.5"><ellipse cx="38" cy="56" rx="7" ry="8" /><ellipse cx="62" cy="56" rx="7" ry="8" /></g>
      <g fill="#2B3A2E"><circle cx={mood === "think" ? 40 : 39} cy={mood === "think" ? 53 : 57} r="3.5" /><circle cx={mood === "think" ? 64 : 63} cy={mood === "think" ? 53 : 57} r="3.5" /></g>
      {mood === "oops" && <path d="M30 44l12 4M70 44l-12 4" stroke="#2B3A2E" strokeWidth="3" strokeLinecap="round" />}
      {/* cheeks + mouth */}
      <g fill="#FF9AA2" opacity="0.7"><circle cx="30" cy="68" r="5" /><circle cx="70" cy="68" r="5" /></g>
      {mouth}
    </svg>
  );
}
