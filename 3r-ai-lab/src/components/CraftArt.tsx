/** Hand-drawn illustrations of finished crafts. These are drawings, not photos. */
const W = "#FFF8E7";
const GREEN = "#4C9A52";
const DGREEN = "#2D6A35";
const SUN = "#F5B83D";
const SKY = "#BFE3F2";
const CORAL = "#EF7B5B";
const BROWN = "#9A6B3D";
const INK = "#2B3A2E";

function Frame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <svg viewBox="0 0 200 160" role="img" aria-label={label} className="h-full w-full">
      <rect width="200" height="160" fill={SKY} opacity="0.5" />
      <ellipse cx="100" cy="146" rx="70" ry="8" fill={INK} opacity="0.12" />
      {children}
    </svg>
  );
}

const ART: Record<string, () => React.ReactElement> = {
  "jar-pencil-holder": () => (
    <Frame label="A jar decorated with paper and filled with pencils">
      <g stroke={INK} strokeWidth="2">
        <path d="M64 70h72l-4 74H68z" fill={W} />
        <path d="M64 96h72v28H66z" fill={SUN} />
        <rect x="64" y="66" width="72" height="8" rx="3" fill="#E7DDC4" />
      </g>
      <g strokeWidth="5" strokeLinecap="round">
        <path d="M82 70L74 24" stroke={CORAL} /><path d="M96 70L96 18" stroke={GREEN} />
        <path d="M110 70L118 22" stroke="#4B8FE0" /><path d="M122 70L136 30" stroke={SUN} />
      </g>
      <circle cx="100" cy="110" r="6" fill={W} stroke={INK} strokeWidth="2" />
    </Frame>
  ),
  "jar-led-lantern": () => (
    <Frame label="A decorated jar glowing with a battery tea light">
      <circle cx="100" cy="92" r="44" fill={SUN} opacity="0.28" />
      <g stroke={INK} strokeWidth="2">
        <path d="M70 58h60l4 80H66z" fill="#FFF4C8" />
        <rect x="68" y="52" width="64" height="10" rx="3" fill="#C9A66B" />
        <ellipse cx="100" cy="128" rx="14" ry="6" fill={W} />
      </g>
      <path d="M100 98c-9 8-5 18 0 22 5-4 9-14 0-22z" fill={SUN} stroke={CORAL} strokeWidth="2" />
      <g fill={CORAL} opacity="0.7"><rect x="74" y="70" width="10" height="10" rx="2" /><rect x="116" y="84" width="10" height="10" rx="2" /><rect x="78" y="104" width="10" height="10" rx="2" /></g>
    </Frame>
  ),
  "bottle-bird-feeder": () => (
    <Frame label="A plastic bottle bird feeder with a spoon perch">
      <path d="M100 8v22" stroke={INK} strokeWidth="2" />
      <g stroke={INK} strokeWidth="2">
        <path d="M90 30h20l4 18 8 12v66H78V60l8-12z" fill="#CDEFF6" />
        <rect x="92" y="26" width="16" height="8" rx="2" fill={CORAL} />
        <rect x="96" y="104" width="8" height="12" fill={INK} opacity="0.2" />
      </g>
      <path d="M78 104h-30" stroke={BROWN} strokeWidth="7" strokeLinecap="round" />
      <ellipse cx="48" cy="104" rx="12" ry="6" fill={BROWN} />
      <g fill={SUN}><circle cx="88" cy="126" r="3" /><circle cx="100" cy="130" r="3" /><circle cx="112" cy="124" r="3" /></g>
      <g transform="translate(34 78)"><ellipse cx="14" cy="14" rx="12" ry="9" fill={CORAL} /><circle cx="24" cy="9" r="5" fill={CORAL} /><path d="M29 9l6 2-6 2z" fill={SUN} /><circle cx="25" cy="8" r="1.4" fill={INK} /></g>
    </Frame>
  ),
  "bottle-planter": () => (
    <Frame label="A half plastic bottle used as a planter with a seedling">
      <g stroke={INK} strokeWidth="2">
        <path d="M66 86h68l-6 52H72z" fill="#CDEFF6" />
        <path d="M70 100h60l-3 38H73z" fill={BROWN} />
      </g>
      <path d="M100 100V62" stroke={DGREEN} strokeWidth="4" />
      <path d="M100 72c-18-2-26-12-26-22 16 0 26 8 26 22z" fill={GREEN} stroke={DGREEN} strokeWidth="2" />
      <path d="M100 66c16-2 24-10 24-20-14 0-24 8-24 20z" fill="#6DBB6E" stroke={DGREEN} strokeWidth="2" />
    </Frame>
  ),
  "jug-watering-can": () => (
    <Frame label="A plastic jug with a holey cap used as a watering can">
      <g stroke={INK} strokeWidth="2">
        <path d="M74 52h52l8 14v70H66V66z" fill="#E8F4FA" />
        <path d="M134 80c20 0 20 38 0 38" fill="none" />
        <rect x="84" y="40" width="32" height="14" rx="3" fill={CORAL} />
      </g>
      <g fill="#6AB7E8"><path d="M96 28l-3 10h6z" /><path d="M104 22l-3 10h6z" /><path d="M112 28l-3 10h6z" /></g>
      <path d="M72 100h56v32H70z" fill="#6AB7E8" opacity="0.55" />
    </Frame>
  ),
  "can-planter": () => (
    <Frame label="A painted metal can used as a herb planter">
      <g stroke={INK} strokeWidth="2">
        <path d="M70 72h60v68H70z" fill={CORAL} />
        <ellipse cx="100" cy="72" rx="30" ry="7" fill="#F4D6CC" />
      </g>
      <path d="M72 100h56" stroke={W} strokeWidth="6" />
      <g fill={W}><circle cx="86" cy="118" r="4" /><circle cx="100" cy="118" r="4" /><circle cx="114" cy="118" r="4" /></g>
      <g fill={GREEN} stroke={DGREEN} strokeWidth="2"><path d="M100 70c-14-6-18-22-14-34 12 6 18 20 14 34z" /><path d="M100 70c12-4 20-18 18-30-12 4-20 16-18 30z" /><path d="M100 70c-2-14 0-28 0-36 6 8 6 24 0 36z" /></g>
    </Frame>
  ),
  "cardboard-organizer": () => (
    <Frame label="A cardboard desk organizer with compartments holding supplies">
      <g stroke={INK} strokeWidth="2">
        <path d="M50 80h100v58H50z" fill="#D9A86B" />
        <path d="M83 80v58M117 80v58" />
        <path d="M50 80l12-12h100l-12 12" fill="#E6BD86" />
      </g>
      <g strokeWidth="5" strokeLinecap="round"><path d="M64 80L60 44" stroke={CORAL} /><path d="M72 80L78 40" stroke="#4B8FE0" /></g>
      <rect x="92" y="52" width="16" height="28" rx="2" fill={W} stroke={INK} strokeWidth="2" />
      <path d="M126 80l6-32 10 4-6 28z" fill={GREEN} stroke={INK} strokeWidth="2" />
    </Frame>
  ),
  "cereal-box-holder": () => (
    <Frame label="A cut cereal box wrapped in paper holding notebooks">
      <g stroke={INK} strokeWidth="2">
        <path d="M60 138V62l60 20v56z" fill={SUN} />
        <path d="M120 138V82l24-10v66z" fill="#F7CF6B" />
      </g>
      <g stroke={INK} strokeWidth="2"><rect x="74" y="44" width="24" height="46" transform="rotate(8 86 67)" fill="#4B8FE0" /><rect x="96" y="40" width="22" height="46" transform="rotate(8 107 63)" fill={CORAL} /></g>
      <g fill={W}><circle cx="82" cy="112" r="4" /><circle cx="98" cy="118" r="4" /></g>
    </Frame>
  ),
  "tube-cable-organizer": () => (
    <Frame label="Cardboard tube pieces each holding a coiled cable">
      <g stroke={INK} strokeWidth="2">
        <rect x="42" y="78" width="38" height="56" rx="4" fill="#D9A86B" />
        <rect x="84" y="78" width="38" height="56" rx="4" fill="#E6BD86" />
        <rect x="126" y="78" width="38" height="56" rx="4" fill="#D9A86B" />
      </g>
      <g fill="none" strokeWidth="4" strokeLinecap="round"><path d="M61 78c-8-14 10-18 4-32" stroke={INK} /><path d="M103 78c8-16-10-20-2-36" stroke={CORAL} /><path d="M145 78c-8-12 8-18 2-30" stroke="#4B8FE0" /></g>
      <g fill={W}><rect x="52" y="96" width="18" height="10" rx="2" /><rect x="94" y="96" width="18" height="10" rx="2" /><rect x="136" y="96" width="18" height="10" rx="2" /></g>
    </Frame>
  ),
  "egg-carton-seed-starter": () => (
    <Frame label="An egg carton with seedlings growing in each cup">
      <g stroke={INK} strokeWidth="2">
        <path d="M34 98h132l-8 36H42z" fill="#CFC0A0" />
        <path d="M34 98l8-8h116l8 8" fill="#E2D6BA" />
      </g>
      {[52, 80, 108, 136].map((x, i) => (
        <g key={x}>
          <path d={`M${x} 98V${74 - (i % 2) * 8}`} stroke={DGREEN} strokeWidth="3" />
          <path d={`M${x} ${80 - (i % 2) * 8}c-10 0-14-8-14-14 10 0 14 6 14 14z`} fill={GREEN} stroke={DGREEN} strokeWidth="1.5" />
          <path d={`M${x} ${76 - (i % 2) * 8}c10 0 14-8 14-14-10 0-14 6-14 14z`} fill="#6DBB6E" stroke={DGREEN} strokeWidth="1.5" />
        </g>
      ))}
    </Frame>
  ),
  "tshirt-tote": () => (
    <Frame label="A t-shirt turned into a tote bag with a fringe bottom">
      <g stroke={INK} strokeWidth="2">
        <path d="M60 44c10 24 70 24 80 0l8 8-8 8v66H60V60l-8-8z" fill={CORAL} />
        <path d="M60 126h80v14H60z" fill={CORAL} />
      </g>
      <path d="M68 44C80 20 120 20 132 44" fill="none" stroke={INK} strokeWidth="2" />
      <g stroke={INK} strokeWidth="2">{[66, 78, 90, 102, 114, 126].map((x) => <path key={x} d={`M${x} 136v10`} />)}</g>
      <circle cx="100" cy="94" r="14" fill={W} />
      <path d="M94 94l5 5 8-10" fill="none" stroke={DGREEN} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </Frame>
  ),
  "paper-bag-book-cover": () => (
    <Frame label="A textbook covered in a decorated brown paper bag">
      <g stroke={INK} strokeWidth="2">
        <rect x="56" y="30" width="88" height="108" rx="4" fill="#C79A63" />
        <rect x="56" y="30" width="10" height="108" fill="#A67C48" />
      </g>
      <rect x="78" y="48" width="48" height="22" rx="2" fill={W} stroke={INK} strokeWidth="2" />
      <path d="M84 59h36" stroke={INK} strokeWidth="2" />
      <g fill={GREEN}><circle cx="84" cy="106" r="7" /><circle cx="104" cy="112" r="7" fill={SUN} /><circle cx="124" cy="104" r="7" fill={CORAL} /></g>
    </Frame>
  ),
};

export function hasCraftArt(id: string): boolean {
  return id in ART;
}

export function CraftArt({ id }: { id: string }) {
  const draw = ART[id];
  if (!draw) return null;
  return <div className="aspect-[5/4] w-full overflow-hidden rounded-lg border border-charcoal-200">{draw()}</div>;
}
