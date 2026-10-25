import { PLANET_NAMES } from "@/lib/progress";

/** Progress visual only. It shows how many rules you've learned, not real emissions. */
export function Planet({ stage }: { stage: 0 | 1 | 2 | 3 }) {
  const ocean = ["#B9A88A", "#8FBF9A", "#4FA3C7", "#2E8FD0"][stage];
  const land = ["#A58F6A", "#7FB069", "#4C9A52", "#3C8D45"][stage];
  return (
    <figure className="anim-planet mx-auto w-28" aria-label={PLANET_NAMES[stage]}>
      <svg viewBox="0 0 120 120" className="w-full">
        <defs>
          <clipPath id="pl"><circle cx="60" cy="60" r="50" /></clipPath>
          <radialGradient id="shine" cx="35%" cy="30%"><stop offset="0" stopColor="#fff" stopOpacity="0.45" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></radialGradient>
        </defs>
        <circle cx="60" cy="60" r="50" fill={ocean} />
        <g clipPath="url(#pl)">
          <path d="M20 50c14-14 30-8 34 4s-10 18-22 14-22-6-12-18z" fill={land} />
          <path d="M70 76c10-10 30-6 34 6s-14 20-26 14-18-10-8-20z" fill={land} />
          {stage === 0 && <g stroke="#7a6a4c" strokeWidth="1.5" fill="none"><path d="M28 56l8 6-4 8" /><path d="M78 84l8 4" /></g>}
          {stage >= 1 && <g fill="#2D6A35"><circle cx="36" cy="54" r="3" /><circle cx="84" cy="82" r="3" /></g>}
          {stage >= 2 && <g fill="#2D6A35"><circle cx="28" cy="60" r="4" /><circle cx="94" cy="88" r="4" /><circle cx="42" cy="64" r="3.5" /></g>}
          {stage >= 3 && <g fill="#F5B83D"><circle cx="46" cy="52" r="2.5" /><circle cx="88" cy="76" r="2.5" /><circle cx="76" cy="90" r="2.5" /></g>}
        </g>
        <circle cx="60" cy="60" r="50" fill="url(#shine)" />
        <circle cx="60" cy="60" r="50" fill="none" stroke="#2B3A2E" strokeWidth="2.5" />
      </svg>
      <figcaption className="mt-1 text-center text-xs text-charcoal-600">{PLANET_NAMES[stage]}</figcaption>
    </figure>
  );
}
