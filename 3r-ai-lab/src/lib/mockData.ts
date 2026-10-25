import { Achievement, AnalyzeItemResult, ImpactStats, UserAction } from "./types";

/**
 * Demo/mock analysis results.
 * These stand in for the real AI vision response so the whole app can be
 * demoed end-to-end with zero API keys configured. See src/lib/ai.ts.
 */
export const MOCK_RESULTS: AnalyzeItemResult[] = [
  {
    itemName: "Plastic Water Bottle",
    category: "Plastic packaging",
    bestAction: "reduce",
    confidence: 0.94,
    explanation:
      "Single-use bottles add up fast. A refillable bottle prevents the need for many disposable ones over time.",
    reduceAdvice:
      "Carry a refillable bottle and fill it at water fountains, cafes, or home.",
    reuseAdvice:
      "Before recycling, this bottle can get a second life as a watering can, a small planter with drainage holes, or a bird feeder.",
    recycleAdvice:
      "Empty and rinse the bottle, then flatten it to save space. Most curbside programs accept #1 PET bottles — leave the cap on if your program says to.",
    reuseIdeas: [
      "Cut the bottom off and use it as a seedling starter pot",
      "Turn it into a self-watering planter for herbs",
      "Use as a portable pencil or brush holder for kids' desks",
      "Make a simple drip-irrigation spike for potted plants",
    ],
    environmentalImpact:
      "",
    localRuleWarning:
      "Curbside plastic recycling accepts #1 and #2 plastics in most areas, but rules vary — check your city's program before recycling.",
  },
  {
    itemName: "Cardboard Box",
    category: "Paper & cardboard",
    bestAction: "reuse",
    confidence: 0.91,
    explanation:
      "Cardboard is sturdy and easy to reuse several times before it needs to be recycled, especially for storage or shipping.",
    reduceAdvice:
      "When ordering online, choose consolidated shipping where possible to reduce the number of boxes that arrive at your door.",
    reuseAdvice:
      "Sturdy boxes are great for storage, moving, gifting, or as a base for a kids' craft project. Keep a few flattened for future shipping needs.",
    recycleAdvice:
      "Remove tape and labels, flatten completely, and keep dry. Wet or greasy cardboard (like pizza boxes) usually can't be recycled.",
    reuseIdeas: [
      "Flatten and use as a weed barrier under mulch in the garden",
      "Turn into a cat scratcher or play cave",
      "Use as drawer dividers or closet organizers",
      "Build a kids' fort, playhouse, or diorama",
      "Cut into shipping padding for your next package",
    ],
    environmentalImpact:
      "",
    localRuleWarning:
      "Most municipal programs accept clean, dry cardboard — but sizes and pickup rules (like requiring it cut down) vary by location.",
  },
  {
    itemName: "Glass Jar",
    category: "Glass packaging",
    bestAction: "reuse",
    confidence: 0.96,
    explanation:
      "Glass jars are durable, don't absorb odors, and can be reused indefinitely at home before recycling is ever needed.",
    reduceAdvice:
      "Buy pantry staples like grains, nuts, or spices from bulk bins using your own jars where stores allow it.",
    reuseAdvice:
      "Once cleaned, glass jars work well for food storage, homemade gifts, or organizing small household items.",
    recycleAdvice:
      "Rinse thoroughly and remove the lid (metal lids are often recycled separately). Glass can be recycled repeatedly.",
    reuseIdeas: [
      "Use as an airtight container for pantry staples like rice or pasta",
      "Turn into a candle holder or small vase",
      "Fill with layered dry ingredients as a homemade gift",
      "Use as a bathroom organizer for cotton balls or Q-tips",
    ],
    environmentalImpact:
      "",
    localRuleWarning:
      "Some curbside programs don't accept glass at all and require drop-off instead — this varies significantly by city.",
  },
  {
    itemName: "Old T-Shirt",
    category: "Textiles",
    bestAction: "reuse",
    confidence: 0.89,
    explanation:
      "Textiles are resource-intensive to produce and are not accepted in most curbside recycling, so reuse is almost always the better option.",
    reduceAdvice:
      "Buying fewer, higher-quality garments and repairing small tears extends a shirt's life and reduces textile waste overall.",
    reuseAdvice:
      "A shirt in good shape can be donated. If it's worn out, it still has plenty of life left as cleaning rags or craft material.",
    recycleAdvice:
      "Look for a textile recycling drop-off point — many clothing retailers and municipalities run take-back programs for worn-out fabric.",
    reuseIdeas: [
      "Cut into reusable cleaning rags or dust cloths",
      "Turn into a tote bag with a few simple stitches",
      "Repurpose into a pillow cover or quilt square",
      "Use strips as garden ties for climbing plants",
    ],
    environmentalImpact:
      "",
    localRuleWarning:
      "Textiles rarely belong in curbside bins. Check for a dedicated fabric recycling or donation drop-off near you.",
  },
  {
    itemName: "Aluminum Can",
    category: "Metal packaging",
    bestAction: "recycle",
    confidence: 0.97,
    explanation:
      "Aluminum is one of the most efficiently recyclable materials and can be back on shelves as a new can within weeks.",
    reduceAdvice:
      "Buying beverages in larger, multi-serving containers can reduce the total number of single-use cans used over time.",
    reuseAdvice:
      "Clean cans can be repurposed as small planters, pen holders, or lanterns before recycling if you want a craft project first.",
    recycleAdvice:
      "Rinse out any residue — you don't need to remove the label.",
    reuseIdeas: [
      "Turn into a small herb planter with drainage holes punched in the bottom",
      "Use as a pencil or utensil holder",
      "Make a simple tealight lantern by punching a pattern into the sides",
    ],
    environmentalImpact:
      "",
    localRuleWarning:
      "Aluminum is widely accepted curbside, but a few areas require cans to be taken to a redemption center instead — worth a quick check.",
  },
];

export const UNCERTAIN_RESULT: AnalyzeItemResult = {
  itemName: "Unknown item",
  category: "Unclear",
  bestAction: "reduce",
  confidence: 0.28,
  explanation: "",
  reduceAdvice: "",
  reuseAdvice: "",
  recycleAdvice: "",
  reuseIdeas: [],
  environmentalImpact: "",
  localRuleWarning: "",
  uncertain: true,
};

export const DEMO_IMPACT_STATS: ImpactStats = {
  totalActions: 0,
  reusedCount: 0,
  recycledCount: 0,
  reducedCount: 0,
  challengeDay: 0,
};

export const DEMO_RECENT_ACTIONS: UserAction[] = [];

export const DAILY_TIPS = [
  "Before buying something new, check whether you can repair or reuse something you already own.",
  "A rinsed jar is a free container — reach for one before buying plastic storage.",
  "Most curbside programs reject greasy cardboard, so tear off the soiled parts of pizza boxes first.",
  "Batteries and electronics never belong in curbside bins — look for a local drop-off point.",
  "Buying in bulk with your own containers cuts packaging waste before it ever starts.",
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-action",
    icon: "🌱",
    label: "First Action",
    description: "Logged your first 3R action.",
    isUnlocked: (s) => s.totalActions >= 1,
  },
  {
    id: "ten-items",
    icon: "♻️",
    label: "10 Items Saved",
    description: "Kept 10 items out of the trash.",
    isUnlocked: (s) => s.totalActions >= 10,
  },
  {
    id: "twentyfive-actions",
    icon: "🌎",
    label: "25 Actions",
    description: "Took 25 environmental actions.",
    isUnlocked: (s) => s.totalActions >= 25,
  },
  {
    id: "week-streak",
    icon: "🔥",
    label: "7-Day Streak",
    description: "Completed the 7-day 3R challenge.",
    isUnlocked: (s) => s.challengeDay >= 7,
  },
];

export const REUSE_LIBRARY: Record<string, string[]> = {
  "Plastic bottle": [
    "Cut the bottom off and use it as a seedling starter pot",
    "Turn it into a self-watering planter for herbs",
    "Use as a portable pencil or brush holder",
    "Make a simple drip-irrigation spike for potted plants",
    "Turn into a bird feeder with a few small holes",
  ],
  "Cardboard box": [
    "Flatten and use as a weed barrier under mulch",
    "Turn into a cat scratcher or play cave",
    "Use as drawer dividers or closet organizers",
    "Build a kids' fort or diorama",
    "Cut into padding for your next shipped package",
  ],
  "Glass jar": [
    "Use as an airtight pantry container",
    "Turn into a candle holder or small vase",
    "Fill with layered dry ingredients as a gift",
    "Use as a bathroom organizer",
    "Repurpose as a drinking glass",
  ],
  "Old shirt": [
    "Cut into reusable cleaning rags",
    "Turn into a simple tote bag",
    "Repurpose into a pillow cover or quilt square",
    "Use strips as garden ties for climbing plants",
    "Braid into a pet toy",
  ],
  "Tin can": [
    "Turn into a small herb planter",
    "Use as a pencil or utensil holder",
    "Make a punched-pattern tealight lantern",
    "Use as a camping stove (with adult supervision)",
    "Turn into a wind chime piece",
  ],
};
