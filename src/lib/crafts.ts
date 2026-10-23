export interface Craft {
  id: string;
  title: string;
  from: string;
  materials: string[];
  steps: string[];
  /** Shown for crafts that involve cutting, heat or sharp edges. */
  safety?: string;
  /** True when an illustration exists in CraftArt. */
  art: boolean;
}

export const CRAFTS: Craft[] = [
  { id: "jar-pencil-holder", title: "Jar pencil holder", from: "glass jar", art: true,
    materials: ["clean glass jar", "paper, fabric scraps or washi tape", "glue or clear tape"],
    steps: ["Wash the jar and let it dry.", "Wrap and glue paper or fabric around the outside.", "Add a label or doodles.", "Fill with pens and pencils."] },
  { id: "jar-led-lantern", title: "Jar lantern (LED)", from: "glass jar or bottle", art: true,
    materials: ["clean jar", "battery tea light or string of fairy lights", "tissue paper or paint markers (optional)"],
    steps: ["Wash and dry the jar.", "Decorate the outside with tissue paper and glue or paint markers.", "Drop in a battery LED tea light.", "Use LEDs only. No real flames in a decorated jar."],
    safety: "Use battery LEDs only, never a real candle." },
  { id: "bottle-bird-feeder", title: "Bottle bird feeder", from: "plastic bottle", art: true,
    materials: ["clean 1-2 L plastic bottle with cap", "two wooden spoons or sticks", "string", "birdseed", "scissors or craft knife (adult)"],
    steps: ["Ask an adult to cut a small hole near the bottom, just above the base, and a smaller one just under it for the spoon handle.", "Push a spoon through so it forms a perch and a seed tray.", "Fill with birdseed and screw the cap on.", "Tie string around the neck and hang it from a branch."],
    safety: "Ask an adult to do the cutting." },
  { id: "bottle-planter", title: "Bottle planter", from: "plastic bottle", art: true,
    materials: ["clean plastic bottle", "scissors (adult for the first cut)", "soil and seeds", "paint markers"],
    steps: ["Ask an adult to cut the bottle in half across the middle.", "Poke a few drainage holes in the bottom half with a nail or pin.", "Decorate the outside.", "Fill with soil and plant seeds or herbs."],
    safety: "Ask an adult to cut the bottle." },
  { id: "jug-watering-can", title: "Jug watering can", from: "milk or detergent jug", art: true,
    materials: ["very well-rinsed jug with cap", "nail or push pin", "scissors"],
    steps: ["Rinse the jug thoroughly, especially if it held detergent.", "Poke 6 to 10 small holes in the cap with a nail.", "Fill with water and screw the cap on.", "Tip and water your plants."],
    safety: "Ask an adult to poke the holes. Only use a jug that held milk, juice or water, not chemicals." },
  { id: "can-planter", title: "Can planter", from: "metal can", art: true,
    materials: ["clean can with a smooth rim", "hammer and nail or drill (adult)", "paint or paper wrap", "soil and herbs"],
    steps: ["Rinse the can and check for sharp edges. Ask an adult to flatten or sand any rough rim.", "Have an adult punch drainage holes in the bottom.", "Wrap or paint the outside.", "Add soil and herbs."],
    safety: "Cans can have sharp edges. Ask an adult and sand or tape the rim." },
  { id: "cardboard-organizer", title: "Cardboard desk organizer", from: "cardboard box", art: true,
    materials: ["sturdy box", "scissors", "glue or tape", "paper or paint"],
    steps: ["Cut a box down to desk height.", "Cut strips of cardboard to make dividers.", "Glue dividers in to make compartments.", "Cover with paper or paint."] },
  { id: "cereal-box-holder", title: "Cereal-box magazine holder", from: "cereal box", art: true,
    materials: ["cereal box", "scissors", "paper, wrapping paper or paint", "glue"],
    steps: ["Cut the box diagonally from one top corner to the opposite side on the front and back.", "Wrap the whole piece in paper.", "Use it on a shelf for notebooks or magazines."] },
  { id: "tube-cable-organizer", title: "Tube cable organizer", from: "cardboard tube", art: true,
    materials: ["cardboard tubes", "scissors", "paper or markers"],
    steps: ["Cut tubes into 3 to 4 inch pieces.", "Decorate them.", "Coil each charger or cable and slide it in.", "Label each tube and keep them in a drawer."] },
  { id: "egg-carton-seed-starter", title: "Egg carton seed starter", from: "paper egg carton", art: true,
    materials: ["paper egg carton", "potting soil", "seeds", "a tray or lid to catch water"],
    steps: ["Poke a small hole in the bottom of each cup.", "Fill with soil and plant 1 to 2 seeds in each.", "Water lightly and keep it in a sunny spot.", "When seedlings are big, plant the cups straight into the ground."] },
  { id: "tshirt-tote", title: "No-sew t-shirt tote", from: "old t-shirt", art: true,
    materials: ["old t-shirt", "scissors"],
    steps: ["Cut off the sleeves and make a wide scoop at the neck.", "Turn it inside out and cut 4 to 5 inch fringe along the bottom hem.", "Tie the front and back fringe pieces together in pairs.", "Turn right-side out and use as a bag."] },
  { id: "paper-bag-book-cover", title: "Paper bag book cover", from: "paper bag", art: true,
    materials: ["brown paper bag", "scissors", "tape", "markers"],
    steps: ["Cut the bag open flat.", "Place your textbook in the middle and fold the edges over the cover.", "Tape the flaps and the corners.", "Decorate it."] },
  { id: "jeans-pouch", title: "Jeans pocket pouch", from: "old jeans", art: false,
    materials: ["old jeans", "scissors", "needle and thread or fabric glue"],
    steps: ["Cut around a back pocket, leaving about an inch of fabric.", "Sew or glue the edges to stop fraying.", "Use it for pens, earbuds or small items."] },
  { id: "tshirt-rags", title: "T-shirt cleaning rags", from: "worn-out cotton clothes", art: false,
    materials: ["worn-out cotton clothes", "scissors"],
    steps: ["Cut into squares of about 10 inches.", "Wash them.", "Keep a stack for cleaning instead of paper towels."] },
];

export const CRAFTS_BY_ID: Record<string, Craft> = Object.fromEntries(CRAFTS.map((c) => [c.id, c]));
