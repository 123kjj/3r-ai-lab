import type { LibraryItem } from "./itemLibrary";

/** First matching pattern wins. Defaults by material/disposition below. */
const RULES_EMOJI: [RegExp, string][] = [
  [/soda|coke|pop can|energy|beer can|seltzer|aluminum|drink can/, "🥫"], [/tin can|soup|food can/, "🥫"],
  [/water bottle|soda bottle|gatorade|sports drink|juice bottle|bottle/, "🧴"], [/milk jug|jug/, "🥛"],
  [/detergent|laundry/, "🧴"], [/shampoo|conditioner|lotion|body wash|soap bottle/, "🧴"],
  [/wine|liquor|champagne|beer bottle/, "🍾"], [/jar/, "🫙"],
  [/boba|bubble tea/, "🧋"], [/coffee cup|starbucks|hot cup|to go cup/, "☕"], [/cup/, "🥤"], [/straw/, "🥤"],
  [/fork|spoon|knife|utensil|cutlery|silverware/, "🍴"], [/pouch|capri|juice box|carton/, "🧃"],
  [/hydro|stanley|reusable|tumbler|thermos|yeti|nalgene/, "🫗"],
  [/pizza/, "🍕"], [/takeout|to go box|clamshell/, "🥡"], [/styrofoam|foam/, "🧊"], [/chip|snack|candy|wrapper|takis|doritos/, "🍟"],
  [/ramen|noodle/, "🍜"], [/lunch|tray/, "🍱"], [/cookie|crumbl|donut|bakery|cake box/, "🍪"], [/cereal|cracker|pasta box|paperboard|shoe ?box/, "📦"],
  [/egg carton/, "🥚"], [/foil/, "🪩"], [/aerosol|spray/, "🧴"], [/wrap|ziploc|sandwich bag|freezer bag/, "🧻"], [/bag/, "🛍️"],
  [/bubble wrap|air pillow|packing/, "📦"], [/pill|prescription|vitamin|medicine|medication/, "💊"], [/needle|syringe|sharps/, "💉"],
  [/oil|grease/, "🛢️"], [/plate|napkin|towel|tissue|wipe/, "🧻"],
  [/banana/, "🍌"], [/apple/, "🍎"], [/orange|lemon|citrus/, "🍊"], [/fruit|melon|grape|peach|mango|pineapple|avocado|strawberr/, "🍓"],
  [/vegetable|veggie|carrot|potato|onion|lettuce|salad|broccoli|corn|pepper|cucumber|celery/, "🥕"], [/coffee grounds|coffee filter/, "☕"],
  [/tea/, "🍵"], [/egg/, "🥚"], [/bread|toast|bagel|tortilla/, "🍞"], [/meat|chicken|fish|bone/, "🍗"], [/cheese|dairy|milk|yogurt/, "🧀"],
  [/leftover|food|rice|pasta|cereal|popcorn|nut/, "🍝"], [/yard|leaves|grass|branch|weed|flower|plant|mulch/, "🍃"],
  [/notebook|binder paper|loose|printer|homework|worksheet|paper|index|sticky/, "📄"], [/newspaper|magazine|catalog|mail|flyer|brochure|envelope/, "📰"],
  [/receipt/, "🧾"], [/tube|roll/, "🧻"], [/wrapping|gift/, "🎁"], [/book|textbook|novel/, "📚"],
  [/cardboard|box|package|delivery/, "📦"],
  [/glass|mirror|window|vase/, "🪟"], [/mug|plate|bowl|dish|ceramic|pottery/, "🍽️"],
  [/t-shirt|tshirt|shirt|tee|jersey|polo|tank/, "👕"], [/jeans|pants|shorts|leggings|skirt|dress/, "👖"], [/hoodie|sweater|jacket|coat|fleece|sweatshirt/, "🧥"],
  [/sock/, "🧦"], [/towel|blanket|sheet|pillowcase|curtain/, "🛏️"], [/shoe|sneaker|boot|sandal|cleat|slide|flip/, "👟"],
  [/backpack|book ?bag|duffel|purse|tote/, "🎒"], [/hat|cap|beanie|scarf|glove|mitten/, "🧢"], [/hanger/, "🧷"],
  [/vape|puff|e-cig|juul/, "💨"], [/phone|iphone|android/, "📱"], [/laptop|chromebook|tablet|ipad|computer|monitor|keyboard|mouse/, "💻"],
  [/airpod|earbud|headphone|earphone|speaker|watch|fitbit/, "🎧"], [/charger|cable|cord|usb|adapter|wire/, "🔌"],
  [/battery|power bank/, "🔋"], [/bulb|light bulb|fluorescent/, "💡"], [/calculator/, "🧮"], [/controller|console|remote|game/, "🎮"],
  [/tv|television|microwave|toaster|printer|appliance|fridge/, "📺"], [/ink|toner/, "🖨️"], [/cd|dvd|disc/, "💿"],
  [/paint|stain|solvent|thinner/, "🎨"], [/gas|propane|antifreeze|motor/, "⛽"], [/bleach|cleaner|chemical|pesticide/, "🧪"],
  [/toothbrush|toothpaste|floss/, "🪥"], [/razor|blade/, "🪒"], [/diaper|tampon|pad/, "🩹"], [/mask/, "😷"], [/makeup|lipstick|mascara|nail/, "💄"], [/sunscreen/, "🧴"],
  [/pen|marker|sharpie|highlighter|crayon|pencil/, "🖍️"], [/glue|tape|stapler|staple|clip|rubber band|scissors|ruler/, "✂️"], [/binder|folder|lanyard|planner/, "📁"],
  [/poster|board|craft|glitter/, "🖼️"], [/string lights|christmas lights|fairy lights|led strip/, "✨"],
  [/furniture|chair|desk|couch|sofa|bookshelf|table|dresser|mattress|futon/, "🛋️"], [/toy|stuffed|plush|lego|puzzle|doll|ball|helmet|skate|bike|scooter/, "🧸"],
  [/tire/, "🛞"], [/litter|pet|poop/, "🐾"], [/cigarette|ash|charcoal/, "🚬"], [/wood|pallet|lumber|popsicle|chopstick|toothpick/, "🪵"], [/sponge|brush|mop|broom|rag/, "🧽"],
];

export function emojiFor(item: LibraryItem): string {
  const n = item.names[0].toLowerCase();
  for (const [re, e] of RULES_EMOJI) if (re.test(n)) return e;
  switch (item.disp) {
    case "compost": return "🍃";
    case "dropoff": return "⚡";
    case "recycle": return "♻️";
    case "reuse": return "✨";
    default: return "🗑️";
  }
}
