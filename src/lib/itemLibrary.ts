import type { MaterialCategoryId } from "./materialData";

export type Material = MaterialCategoryId | "textile" | "mixed_unknown";
export type Disposition = "recycle" | "compost" | "reuse" | "dropoff" | "trash";

export interface LibraryItem {
  /** First name is the display name; the rest are aliases people might type. */
  names: string[];
  material: Material;
  disp: Disposition;
  /** Rule ids from rules.ts (core or type rules). First one is the headline rule. */
  rules: string[];
  /** One to three sentences on why. General guidance; "most programs", never a city claim. */
  why: string;
  craft?: string;
  /** Unambiguous enough to use in Sort Rush / quiz. */
  game?: boolean;
}

type X = { craft?: string; game?: boolean };
const I = (names: string[], material: Material, disp: Disposition, rules: string[], why: string, x: X = {}): LibraryItem => ({
  names, material, disp, rules, why, ...x,
});

export const ITEM_LIBRARY: LibraryItem[] = [
  // ── Drinks & containers ──
  I(["soda can", "coke can", "pop can", "can of soda", "sprite can"], "aluminum", "recycle", ["metal-cans", "empty"], "Aluminum cans are accepted nearly everywhere and have the biggest recycling savings in EPA WARM. Empty it; a quick rinse is enough.", { game: true, craft: "can-planter" }),
  I(["energy drink can", "monster can", "red bull can", "celsius can", "prime can"], "aluminum", "recycle", ["metal-cans", "empty"], "Energy drink cans are aluminum, so they go in recycling once empty.", { game: true, craft: "can-planter" }),
  I(["beer can", "seltzer can", "white claw can", "sparkling water can"], "aluminum", "recycle", ["metal-cans", "empty"], "Aluminum beverage cans are recycled almost everywhere. Empty them first.", { craft: "can-planter" }),
  I(["aluminum can", "aluminium can", "drink can"], "aluminum", "recycle", ["metal-cans", "empty"], "Drink cans are top recyclables. Empty, then recycle.", { craft: "can-planter" }),
  I(["water bottle", "plastic water bottle", "disposable water bottle", "bottled water"], "pet_plastic", "recycle", ["plastic-bottles", "empty", "plastic-caps"], "Most programs accept PET bottles. Empty it, and check whether to leave the cap on.", { game: true, craft: "bottle-planter" }),
  I(["soda bottle", "coke bottle", "2 liter", "2-liter bottle", "pepsi bottle"], "pet_plastic", "recycle", ["plastic-bottles", "empty"], "Soda bottles are PET, one of the most accepted plastics.", { game: true, craft: "bottle-bird-feeder" }),
  I(["gatorade bottle", "sports drink bottle", "powerade bottle", "juice bottle", "iced tea bottle", "lemonade bottle"], "pet_plastic", "recycle", ["plastic-bottles", "empty"], "Drink bottles with a neck are widely accepted. Empty and recycle.", { craft: "bottle-planter" }),
  I(["milk jug", "gallon jug", "plastic milk jug", "jug"], "hdpe_plastic", "recycle", ["plastic-bottles", "shape", "empty"], "Milk jugs are HDPE (#2), widely accepted. Rinse out the milk.", { game: true, craft: "jug-watering-can" }),
  I(["laundry detergent bottle", "detergent jug", "laundry jug", "fabric softener bottle"], "hdpe_plastic", "recycle", ["care-bottles", "empty"], "Most detergent jugs are HDPE and accepted. Empty them first.", { craft: "jug-watering-can" }),
  I(["shampoo bottle", "conditioner bottle", "body wash bottle", "lotion bottle", "hand soap bottle"], "hdpe_plastic", "recycle", ["care-bottles", "plastic-number"], "Bathroom bottles are often #1 or #2 plastic. Empty, and check the number on the bottom.", { craft: "bottle-planter" }),
  I(["glass bottle", "juice glass bottle", "glass soda bottle", "kombucha bottle"], "glass", "recycle", ["glass-bottles", "glass-lids"], "Glass bottles are accepted by many programs; some need drop-off. Remove the lid.", { game: true, craft: "jar-led-lantern" }),
  I(["wine bottle", "liquor bottle", "beer bottle", "champagne bottle"], "glass", "recycle", ["glass-bottles", "glass-lids"], "Glass bottles go in glass recycling where accepted. Empty and remove the cap.", { craft: "jar-led-lantern" }),
  I(["glass jar", "mason jar", "pickle jar", "jam jar", "salsa jar", "pasta sauce jar", "spaghetti sauce jar", "peanut butter jar glass", "baby food jar"], "glass", "reuse", ["glass-reuse", "glass-bottles", "rinse"], "A washed jar is a free container for food or crafts. When done, recycle it where glass is accepted.", { game: true, craft: "jar-pencil-holder" }),
  I(["coffee cup", "paper coffee cup", "starbucks cup", "dunkin cup", "iced coffee cup", "hot cup", "to go cup"], "mixed_unknown", "trash", ["paper-cups", "mixed", "reduce"], "The plastic lining keeps most paper cups out of standard recycling. A reusable cup is the real fix.", { game: true }),
  I(["boba cup", "bubble tea cup", "plastic cup with dome lid", "smoothie cup"], "mixed_unknown", "trash", ["plastic-tubs", "mixed", "reduce"], "Boba cups are usually thin, flexible or #5/#6 plastic that most programs don't want, and the straw and tapioca add to the problem. Bring a reusable cup.", { game: true }),
  I(["plastic cup", "solo cup", "red cup", "party cup"], "mixed_unknown", "trash", ["plastic-tubs", "check"], "Most single-use cups aren't accepted by curbside programs. Check yours; reuse is better.", { }),
  I(["straw", "plastic straw", "paper straw", "bubble tea straw"], "mixed_unknown", "trash", ["plastic-utensils", "small", "reduce"], "Straws are too small for sorting equipment. Skip them or carry a reusable one.", { game: true }),
  I(["plastic fork", "plastic spoon", "plastic knife", "plastic utensils", "disposable cutlery", "plastic cutlery", "plastic silverware"], "mixed_unknown", "trash", ["plastic-utensils", "small", "reduce"], "Plastic cutlery is generally not recycled. Keep a reusable set in your bag.", { game: true }),
  I(["capri sun pouch", "juice pouch", "drink pouch", "capri sun", "squeeze pouch"], "mixed_unknown", "trash", ["pack-pouch", "mixed"], "Drink pouches are layers of plastic and foil, so they usually can't be recycled.", { game: true }),
  I(["juice box", "milk carton", "juice carton", "carton", "soy milk carton", "broth carton"], "mixed_unknown", "recycle", ["pack-carton", "empty", "check"], "Cartons are accepted by some programs and not others. Check yours before putting them in the bin.", { }),
  I(["hydro flask", "stanley cup", "reusable water bottle", "yeti", "tumbler", "thermos", "nalgene", "metal water bottle"], "mixed_unknown", "reuse", ["reduce", "reuse"], "A reusable bottle is one of the best swaps for single-use bottles. Keep using it, and donate it if you don't.", { }),

  // ── Food packaging & takeout ──
  I(["pizza box", "greasy pizza box", "pizza"], "corrugated_cardboard", "recycle", ["grease", "card-flatten", "dry"], "Clean parts of a pizza box can be recycled. The greasy part usually can't, so tear it off and compost or trash it.", { game: true }),
  I(["takeout container", "takeout box", "to go box", "chinese takeout box", "paper takeout box", "clamshell"], "mixed_unknown", "trash", ["pack-takeout", "grease"], "Food-soiled takeout containers usually can't be recycled. Clean, unsoiled paper ones may be accepted in some programs.", { }),
  I(["styrofoam", "styrofoam container", "foam container", "foam takeout box", "foam cup", "styrofoam cup", "foam plate", "packing foam", "foam"], "mixed_unknown", "trash", ["foam", "reduce"], "Foam is rarely accepted. Avoid it when you can.", { game: true }),
  I(["chip bag", "takis bag", "doritos bag", "snack bag", "candy wrapper", "granola bar wrapper", "cheetos bag", "popcorn bag", "chip bags", "candy bag"], "mixed_unknown", "trash", ["pack-pouch", "mixed"], "Snack bags are layers of plastic and foil, so they usually can't be recycled. Buy bigger bags or bulk when you can.", { game: true }),
  I(["ramen cup", "cup noodles", "instant noodle cup", "microwave cup", "yogurt cup"], "mixed_unknown", "trash", ["plastic-tubs", "foam", "check"], "Noodle cups are often foam or lined paper. Yogurt cups vary by program. Check yours.", { }),
  I(["lunchable", "lunch tray", "cafeteria tray", "school lunch tray", "plastic tray", "microwave tray", "tv dinner tray"], "mixed_unknown", "trash", ["plastic-tubs", "mixed", "check"], "Trays are often mixed or non-bottle plastic that many programs reject. Check the number and your program.", { }),
  I(["cookie box", "crumbl box", "bakery box", "donut box", "cake box", "pastry box"], "mixed_unknown", "recycle", ["grease", "card-flatten", "dry"], "Clean paperboard boxes can go in recycling. Greasy parts can't.", { }),
  I(["cereal box", "cracker box", "pasta box", "mac and cheese box", "granola box", "tissue box", "paperboard box", "shoe box", "shoebox"], "mixed_paper", "recycle", ["paper-office", "card-flatten", "dry"], "Paperboard boxes are widely recycled. Remove any plastic liner and flatten the box.", { game: true, craft: "cereal-box-holder" }),
  I(["egg carton", "paper egg carton", "cardboard egg carton"], "mixed_paper", "recycle", ["paper-office", "dry"], "Paper egg cartons are accepted by many programs and compost well. Foam ones are trash.", { craft: "egg-carton-seed-starter" }),
  I(["foam egg carton", "styrofoam egg carton"], "mixed_unknown", "trash", ["foam"], "Foam egg cartons aren't recyclable in most programs.", { }),
  I(["aluminum foil", "tin foil", "foil", "foil wrap", "baking foil"], "mixed_unknown", "recycle", ["metal-foil", "grease"], "Clean foil is accepted by some programs, usually balled up. Greasy foil is trash. Check yours.", { }),
  I(["tin can", "soup can", "food can", "bean can", "tuna can", "vegetable can", "steel can", "canned food can", "pet food can", "dog food can", "cat food can"], "mixed_unknown", "recycle", ["metal-steel", "rinse", "metal-sharp"], "Steel food cans are usually accepted. Rinse them out. EPA WARM doesn't publish a figure we sourced for steel, so we don't show a number.", { craft: "can-planter" }),
  I(["aerosol can", "spray can", "hairspray can", "deodorant spray", "whipped cream can", "cooking spray can", "spray paint can"], "mixed_unknown", "dropoff", ["metal-aerosol", "hazard"], "Empty aerosols are accepted by some programs. Cans with product left or paint need hazardous-waste drop-off.", { }),
  I(["plastic wrap", "cling wrap", "saran wrap", "ziploc bag", "sandwich bag", "freezer bag", "zip bag"], "mixed_unknown", "trash", ["film", "reduce"], "Thin plastic film jams machines. Use reusable containers when you can.", { }),
  I(["plastic bag", "grocery bag", "shopping bag", "plastic grocery bag", "bag", "produce bag", "bread bag"], "mixed_unknown", "dropoff", ["film", "reuse"], "Most curbside programs reject bags. Many stores collect clean, dry ones, and a reusable bag is better.", { game: true }),
  I(["bubble wrap", "air pillow", "packing peanuts", "packing material"], "mixed_unknown", "dropoff", ["pack-bubble", "film", "reuse"], "Bubble wrap and air pillows are film. Reuse for shipping or find a store drop-off. Foam peanuts can often be returned to shipping stores.", { }),
  I(["pill bottle", "prescription bottle", "medicine bottle", "vitamin bottle", "supplement bottle"], "mixed_unknown", "recycle", ["plastic-number", "meds", "check"], "Empty bottles with labels removed are accepted by some programs. Take unused medicine to a take-back program.", { }),
  I(["peanut butter jar", "plastic jar", "mayo jar", "condiment bottle", "ketchup bottle", "squeeze bottle", "syrup bottle", "salad dressing bottle"], "mixed_unknown", "recycle", ["plastic-number", "rinse", "empty"], "Plastic jars and bottles are widely accepted if they're #1 or #2. Scrape out and rinse.", { craft: "bottle-planter" }),
  I(["yogurt tub", "butter tub", "margarine tub", "cottage cheese tub", "hummus tub", "deli container", "plastic tub", "sour cream tub"], "mixed_unknown", "recycle", ["plastic-tubs", "plastic-number", "check"], "Tubs are accepted by some programs and rejected by others. Check yours and the number on the bottom.", { }),
  I(["pizza grease", "cooking oil", "frying oil", "bacon grease", "used cooking oil", "oil"], "mixed_unknown", "dropoff", ["haz-oil", "hazard"], "Never pour grease down the drain. Let it cool, then use a local collection program or trash it in a sealed container.", { }),
  I(["paper plate", "paper bowl", "greasy paper plate", "paper tray", "paper towel", "napkin", "paper napkin", "tissue", "used tissue", "kleenex", "wet wipe", "baby wipe", "makeup wipe", "cleaning wipe"], "mixed_unknown", "trash", ["paper-wet", "care-wipes", "reduce"], "Used paper products and wipes aren't recycled. Compost plain napkins and tissues if your program accepts them; wipes always go in the trash, never the toilet.", { game: true }),

  // ── Food & compost ──
  I(["banana peel", "banana"], "food_organic", "compost", ["methane", "food-compost"], "Landfilled food produces methane. EPA WARM: landfill +0.50 vs composting −0.15 MTCO₂E per short ton.", { game: true }),
  I(["apple core", "apple", "orange peel", "fruit scraps", "fruit peel", "pear core", "grape stems", "melon rind", "watermelon rind", "strawberry tops", "lemon peel", "avocado pit", "avocado peel", "mango peel", "pineapple top", "peach pit"], "food_organic", "compost", ["methane", "food-compost"], "Fruit scraps compost well. In a landfill they make methane.", { game: true }),
  I(["vegetable scraps", "veggie scraps", "carrot peel", "potato peel", "onion peel", "lettuce", "salad", "celery ends", "broccoli stalk", "corn cob", "pepper seeds", "cucumber peel", "vegetables"], "food_organic", "compost", ["methane", "food-compost"], "Vegetable scraps are standard compost. Planning meals to use more of the vegetable is better still.", { game: true }),
  I(["coffee grounds", "used coffee grounds", "coffee filter", "tea leaves", "loose tea"], "food_organic", "compost", ["food-compost", "methane"], "Coffee grounds and paper filters compost well.", { game: true }),
  I(["tea bag", "teabag"], "food_organic", "compost", ["food-compost", "check"], "Many tea bags contain a little plastic. Compost paper-only ones, otherwise trash.", { }),
  I(["eggshell", "egg shells", "eggshells"], "food_organic", "compost", ["food-compost"], "Eggshells are a standard compost item.", { game: true }),
  I(["bread", "stale bread", "toast", "pizza crust", "bagel", "tortilla", "cereal", "pasta", "rice", "leftovers", "leftover food", "cooked food", "food scraps", "food waste", "spoiled food", "moldy food", "oatmeal", "nut shells", "peanut shells", "popcorn"], "food_organic", "compost", ["food-plan", "methane", "food-meat"], "Cooked food and grains need a city compost program, not a home pile. Better yet, plan so less is wasted.", { }),
  I(["meat scraps", "chicken bones", "fish bones", "bones", "cheese", "dairy", "milk", "yogurt", "cooked meat"], "food_organic", "compost", ["food-meat", "methane"], "Meat and dairy need a city compost program. Home compost usually can't take them. In a landfill they make methane.", { }),
  I(["yard waste", "leaves", "grass clippings", "branches", "twigs", "weeds", "flowers", "dead plants", "garden waste", "mulch"], "mixed_unknown", "compost", ["home-yard", "methane"], "Yard waste usually has its own collection or compost stream.", { }),

  // ── Paper ──
  I(["notebook", "spiral notebook", "composition notebook", "school notebook", "old notebook"], "mixed_paper", "recycle", ["school-notebook", "paper-office"], "Paper pages are recyclable. Take off plastic covers, and metal spirals if your program says so.", { }),
  I(["loose leaf paper", "notebook paper", "binder paper", "printer paper", "homework", "worksheet", "old homework", "copy paper", "scrap paper", "office paper", "paper"], "mixed_paper", "recycle", ["paper-office", "dry"], "Plain paper is among the most recycled items. Use both sides first.", { game: true }),
  I(["newspaper", "magazine", "catalog", "junk mail", "flyer", "brochure", "envelope", "mail", "phone book", "greeting card"], "mixed_paper", "recycle", ["paper-office", "paper-shiny"], "Paper mail and magazines are widely accepted. Glitter, foil or plastic windows are trash.", { }),
  I(["paper bag", "brown paper bag", "grocery paper bag", "lunch bag"], "mixed_paper", "reuse", ["reuse", "paper-office"], "Paper bags can be reused or recycled when clean and dry.", { craft: "paper-bag-book-cover" }),
  I(["receipt", "receipts", "thermal receipt"], "mixed_unknown", "trash", ["paper-receipts"], "Thermal receipt paper is coated, so it's usually not recycled.", { game: true }),
  I(["sticky note", "sticky notes", "post it", "post-it", "index card", "index cards", "file folder", "manila folder", "construction paper"], "mixed_paper", "recycle", ["paper-office"], "Most programs accept these mixed-paper items. Remove any plastic.", { }),
  I(["cardboard tube", "toilet paper tube", "paper towel tube", "toilet paper roll", "paper towel roll", "wrapping paper tube", "cardboard roll"], "mixed_paper", "recycle", ["paper-office", "dry"], "Cardboard tubes are paper fiber and widely accepted. They also make great crafts.", { craft: "tube-cable-organizer" }),
  I(["wrapping paper", "gift wrap", "gift bag", "tissue paper", "birthday wrapping paper"], "mixed_unknown", "trash", ["paper-shiny", "reuse"], "Plain wrapping paper may be accepted; glittery, foil or laminated paper isn't. Reuse gift bags.", { }),
  I(["shredded paper", "paper shreds"], "mixed_unknown", "recycle", ["small", "check"], "Shreds are tiny and fall through sorting equipment. Some programs want them bagged in paper. Check yours.", { }),
  I(["textbook", "old textbook", "book", "novel", "paperback", "hardcover book"], "mixed_unknown", "reuse", ["reuse", "school-supplies"], "Books are best donated, sold or passed on. Recycling a book is a last resort.", { }),

  // ── Cardboard ──
  I(["cardboard box", "cardboard", "shipping box", "amazon box", "moving box", "delivery box", "package", "brown box", "corrugated box", "box"], "corrugated_cardboard", "reuse", ["card-reuse", "card-flatten", "dry"], "Reuse a good box for storage or shipping, then flatten and recycle it when it's clean and dry.", { game: true, craft: "cardboard-organizer" }),
  I(["packing box", "appliance box", "large cardboard box"], "corrugated_cardboard", "recycle", ["card-flatten", "dry"], "Flatten big boxes and cut them down to fit your bin or collection rules.", { craft: "cardboard-organizer" }),

  // ── Glass & ceramics (not bottles) ──
  I(["drinking glass", "broken glass", "wine glass", "pyrex", "baking dish glass", "glass cup", "mug glass", "glass plate", "vase"], "mixed_unknown", "trash", ["glass-not", "reuse"], "These melt at different temperatures from bottles, so they don't go with bottle glass. Wrap broken pieces safely before trashing.", { }),
  I(["mirror", "window glass", "light glass", "glass window"], "mixed_unknown", "trash", ["glass-not"], "Mirrors and window glass aren't accepted in bottle glass recycling.", { }),
  I(["plate", "bowl", "mug", "ceramic mug", "ceramic plate", "dish", "dishes", "coffee mug", "cup", "pottery", "porcelain"], "mixed_unknown", "reuse", ["home-ceramics", "reuse"], "Ceramics can't be recycled like glass. Donate usable ones, or trash broken pieces safely.", { }),

  // ── Textiles & clothes ──
  I(["t-shirt", "tshirt", "old t-shirt", "old shirt", "shirt", "tee", "tank top", "polo", "uniform shirt", "gym shirt", "sports jersey", "jersey"], "textile", "reuse", ["textile-donate", "textile-rags", "textile"], "Wearable shirts can be donated. Worn-out cotton makes rags or a tote bag. There's no sourced WARM figure for textiles here, so we show none.", { game: true, craft: "tshirt-tote" }),
  I(["jeans", "pants", "shorts", "leggings", "sweatpants", "skirt", "dress", "joggers", "khakis", "old jeans"], "textile", "reuse", ["textile-donate", "textile-rags", "textile"], "Donate wearable clothes. Worn-out denim can become pouches or patches.", { craft: "jeans-pouch" }),
  I(["hoodie", "sweatshirt", "sweater", "jacket", "coat", "fleece", "cardigan", "puffer jacket", "old hoodie"], "textile", "reuse", ["textile-donate", "textile", "reuse"], "Outerwear is in demand at donation centers if it's clean and wearable.", { }),
  I(["socks", "sock", "underwear", "bra", "tights", "stockings", "worn out socks"], "textile", "reuse", ["textile-rags", "textile", "textile-donate"], "Worn-out socks make cleaning rags or dusting mitts. Donate if still wearable.", { }),
  I(["towel", "towels", "bath towel", "dish towel", "blanket", "bed sheet", "sheets", "pillowcase", "pillow case", "curtain"], "textile", "reuse", ["textile-rags", "textile-donate", "textile"], "Old towels and linens make good rags, and animal shelters often accept them.", { }),
  I(["sneakers", "shoes", "old shoes", "worn shoes", "boots", "sandals", "cleats", "slides", "flip flops", "running shoes", "old sneakers"], "mixed_unknown", "reuse", ["textile-shoes", "textile-donate"], "Donate wearable pairs. Worn-out shoes are usually trash unless a take-back program exists.", { }),
  I(["backpack", "old backpack", "book bag", "bookbag", "tote bag", "duffel bag", "purse", "bag with zipper"], "mixed_unknown", "reuse", ["school-backpack", "reuse", "textile-donate"], "Repair, pass on or donate before replacing.", { }),
  I(["hat", "baseball cap", "beanie", "scarf", "gloves", "mittens", "belt", "tie"], "textile", "reuse", ["textile-donate", "textile-rags"], "Donate wearable accessories. Fabric scraps can be crafts or rags.", { }),
  I(["hanger", "clothes hanger", "wire hanger", "plastic hanger", "hangers"], "mixed_unknown", "reuse", ["reuse", "check"], "Return hangers to a store or donate them. Many curbside programs don't accept them.", { }),

  // ── Electronics & batteries ──
  I(["disposable vape", "vape", "puff bar", "elf bar", "e-cigarette", "vape pen", "juul", "vape cartridge"], "mixed_unknown", "dropoff", ["elec-vape", "battery", "hazard"], "Disposable vapes contain lithium batteries and are electronics, so they need hazardous or e-waste drop-off, never the bin.", { game: true }),
  I(["phone", "old phone", "iphone", "android phone", "cell phone", "smartphone", "broken phone"], "mixed_unknown", "dropoff", ["ewaste", "elec-data", "battery"], "Phones contain batteries and valuable materials. Wipe it, then use an e-waste or trade-in drop-off.", { game: true }),
  I(["laptop", "chromebook", "old laptop", "tablet", "ipad", "kindle", "computer", "desktop computer", "monitor", "keyboard", "mouse", "computer mouse", "webcam"], "mixed_unknown", "dropoff", ["ewaste", "elec-data", "battery"], "Electronics need e-waste collection. Wipe your data, and consider donating working devices.", { game: true }),
  I(["airpods", "earbuds", "headphones", "earphones", "airpod case", "wireless earbuds", "bluetooth speaker", "speaker", "smartwatch", "apple watch", "fitbit"], "mixed_unknown", "dropoff", ["battery", "ewaste"], "Small electronics hold batteries that can't be removed or replaced easily. Use an e-waste drop-off.", { game: true }),
  I(["charger", "phone charger", "usb cable", "charging cable", "cable", "cord", "extension cord", "power cord", "lightning cable", "usb c cable", "adapter", "power adapter", "wires", "hdmi cable", "aux cable"], "mixed_unknown", "dropoff", ["elec-cables", "ewaste"], "Cables and chargers are e-waste. Tangled cords jam sorting equipment.", { craft: "tube-cable-organizer" }),
  I(["battery", "batteries", "aa battery", "aaa battery", "alkaline battery", "9 volt battery", "button battery", "coin battery"], "mixed_unknown", "dropoff", ["battery", "small"], "Use a battery drop-off at a store or collection site. Tape the ends of lithium or button batteries first.", { game: true }),
  I(["lithium battery", "phone battery", "laptop battery", "rechargeable battery", "power bank", "portable charger", "e-bike battery", "scooter battery", "swollen battery"], "mixed_unknown", "dropoff", ["battery", "hazard"], "Lithium batteries can start fires. Never put them in any bin; use a drop-off that takes them, and tape the terminals.", { game: true }),
  I(["light bulb", "lightbulb", "led bulb", "incandescent bulb", "cfl bulb", "fluorescent tube", "halogen bulb"], "mixed_unknown", "dropoff", ["haz-bulbs", "hazard"], "CFL and fluorescent bulbs contain mercury and need special drop-off. LED and incandescent rules vary, so check locally.", { }),
  I(["calculator", "graphing calculator", "ti-84", "old calculator", "remote", "tv remote", "game controller", "controller", "nintendo switch", "console", "video game console", "toy with batteries", "electronic toy", "clock", "alarm clock", "radio"], "mixed_unknown", "dropoff", ["ewaste", "battery", "elec-data"], "Anything with a circuit board or batteries is e-waste. Donate if it still works; otherwise use an e-waste drop-off.", { }),
  I(["tv", "television", "old tv", "microwave", "toaster", "printer", "old printer", "scanner", "fan", "hair dryer", "blender", "small appliance"], "mixed_unknown", "dropoff", ["ewaste", "reuse"], "Appliances and screens need e-waste collection. Repair or donate working ones first.", { }),
  I(["ink cartridge", "printer ink", "toner cartridge", "ink"], "mixed_unknown", "dropoff", ["ewaste", "check"], "Many office stores take empty cartridges back. Check before binning.", { }),
  I(["cd", "dvd", "blu-ray", "cassette", "vhs tape", "disc", "cd case", "dvd case", "jewel case"], "mixed_unknown", "trash", ["mixed", "check"], "Discs are mixed plastic and metal and rarely accepted curbside. Donate working ones and check for mail-back programs.", { }),

  // ── Hazardous & medical ──
  I(["paint", "paint can", "house paint", "spray paint", "stain", "varnish", "wood stain", "paint thinner", "solvent"], "mixed_unknown", "dropoff", ["haz-paint", "hazard"], "Paint and solvents go to household hazardous waste collection. Dried latex paint is trash in some places. Check locally.", { }),
  I(["motor oil", "car oil", "antifreeze", "car battery", "brake fluid", "gasoline", "gas can", "propane tank", "propane canister", "lighter fluid"], "mixed_unknown", "dropoff", ["hazard", "haz-oil"], "These need household hazardous waste or an auto shop. Never put them in a bin or drain.", { }),
  I(["medicine", "medication", "pills", "expired medicine", "prescription", "ibuprofen", "tylenol", "antibiotics", "cough syrup", "old medicine", "vitamins", "expired pills"], "mixed_unknown", "dropoff", ["meds", "hazard"], "Use a pharmacy take-back box or a take-back event, not the trash or toilet.", { }),
  I(["needle", "syringe", "sharps", "insulin pen", "lancet", "epipen", "razor blade", "used needle"], "mixed_unknown", "dropoff", ["haz-sharps", "meds"], "Put sharps in a rigid sharps container and use a take-back option.", { }),
  I(["bleach", "cleaning chemicals", "drain cleaner", "pesticide", "weed killer", "fertilizer", "oven cleaner", "household cleaner", "pool chemicals", "mercury thermometer", "thermometer"], "mixed_unknown", "dropoff", ["hazard", "check"], "Household chemicals go to hazardous waste collection. Don't mix or pour them out.", { }),
  I(["sunscreen", "nail polish", "nail polish remover", "perfume", "hair dye", "makeup", "lipstick", "mascara", "foundation", "lip balm", "cosmetics"], "mixed_unknown", "trash", ["care-small", "check"], "Small cosmetics are usually trash. Nail polish and remover are hazardous and need drop-off. Use up what you have before buying more.", { }),

  // ── Personal care & bathroom ──
  I(["toothbrush", "old toothbrush", "electric toothbrush head", "toothpaste tube", "toothpaste", "floss", "dental floss", "mouthwash bottle", "razor", "disposable razor", "razors", "q-tip", "cotton swab", "cotton ball", "cotton pad", "bandaid", "band-aid", "bandage", "hair tie", "comb", "hairbrush"], "mixed_unknown", "trash", ["care-small", "small", "reduce"], "Small, mixed-material bathroom items are usually trash. Choose longer-lasting or refillable versions when you can.", { }),
  I(["deodorant stick", "deodorant", "soap bar", "bar soap", "tampon", "pad", "period pad", "diaper", "contact lens", "contacts", "face mask", "disposable mask", "mask", "glove", "disposable gloves", "hand sanitizer bottle", "sanitizer"], "mixed_unknown", "trash", ["care-small", "care-wipes", "reduce"], "These personal items are generally trash. Never flush them. Hand sanitizer is flammable and best used up.", { }),
  I(["floss pick", "dental pick", "retainer", "braces", "mouthguard"], "mixed_unknown", "trash", ["care-small", "small"], "Small, mixed dental items are usually trash.", { }),

  // ── School & office supplies ──
  I(["pen", "ballpoint pen", "marker", "sharpie", "highlighter", "dry erase marker", "whiteboard marker", "crayon", "colored pencil", "pencil", "pencil stub", "mechanical pencil", "eraser", "pen cap"], "mixed_unknown", "trash", ["school-pens", "mixed", "reduce"], "Pens and markers are mixed plastic, metal and ink, so they're usually trash. Refillable pens cut the waste, and some brands run take-back programs.", { game: true }),
  I(["glue stick", "glue", "elmer's glue", "tape", "scotch tape", "masking tape", "duct tape", "stapler", "staples", "paper clip", "binder clip", "rubber band", "thumbtack", "push pin", "scissors", "ruler", "protractor", "compass", "pencil sharpener", "whiteout", "correction tape"], "mixed_unknown", "trash", ["school-supplies", "small", "mixed"], "Small mixed-material supplies are usually trash. Reuse them as long as they work, and pass spares on to a classroom.", { }),
  I(["binder", "three ring binder", "3 ring binder", "folder", "plastic folder", "plastic binder", "pocket folder", "report cover", "lanyard", "id badge", "planner", "agenda"], "mixed_unknown", "reuse", ["school-supplies", "reuse", "mixed"], "Binders and folders are best reused year after year. Plastic ones rarely go in curbside recycling.", { }),
  I(["pencil case", "pencil pouch", "lunchbox", "lunch box", "lunch bag insulated", "water bottle holder", "locker organizer", "locker mirror"], "mixed_unknown", "reuse", ["school-backpack", "reuse"], "Repair or pass these on before replacing.", { }),
  I(["poster", "posters", "poster board", "science fair board", "tri-fold board", "foam board", "presentation board", "construction paper scraps", "craft paper", "glitter", "craft supplies", "pipe cleaner", "pom pom"], "mixed_unknown", "reuse", ["school-supplies", "paper-shiny", "reuse"], "Pass craft materials on to a classroom or art room. Glitter and foam board are trash.", { }),

  // ── Home, dorm & bulky ──
  I(["string lights", "christmas lights", "fairy lights", "led strip", "led lights", "led light strip", "holiday lights", "extension light"], "mixed_unknown", "dropoff", ["ewaste", "elec-cables"], "Light strings are small electronics with wiring. Use e-waste collection or a holiday-light recycler.", { }),
  I(["mini fridge", "fridge", "refrigerator", "microwave oven", "air conditioner", "ac unit", "water heater"], "mixed_unknown", "dropoff", ["ewaste", "home-furniture", "hazard"], "Appliances with refrigerants need special pickup or a retailer take-back. Don't put them out with the trash.", { }),
  I(["furniture", "chair", "desk", "couch", "sofa", "bookshelf", "table", "dresser", "bed frame", "mattress", "box spring", "futon", "bean bag", "rug", "carpet", "dorm furniture"], "mixed_unknown", "reuse", ["home-furniture", "reuse"], "Donate or sell usable furniture. Mattresses and large items need special pickup or drop-off.", { }),
  I(["shower caddy", "laundry basket", "storage bin", "plastic bin", "plastic storage bin", "bucket", "plastic bucket", "trash can", "plastic hanger", "clothes basket"], "mixed_unknown", "reuse", ["reuse", "check"], "Durable plastic housewares are best reused or donated. Some programs accept rigid plastic; check yours.", { }),
  I(["cat litter", "kitty litter", "pet waste", "dog poop", "dog waste", "bird seed", "hamster bedding", "pet bedding"], "mixed_unknown", "trash", ["check", "food-bags"], "Pet waste and litter are generally trash in a bag. Don't flush clumping litter.", { }),
  I(["cigarette butt", "cigarette", "cigar", "ashes", "ash", "charcoal", "bbq ash"], "mixed_unknown", "trash", ["check", "small"], "Cigarette butts contain plastic filters and are trash. Make sure ashes are fully cooled first.", { }),
  I(["wood", "lumber", "pallet", "plywood", "treated wood", "firewood", "popsicle stick", "chopsticks", "toothpick", "wooden spoon", "wooden utensil", "bamboo utensil", "skewer"], "mixed_unknown", "trash", ["reuse", "check"], "Clean wood can often be reused or taken to wood-waste collection. Small wooden utensils are usually trash.", { }),
  I(["sponge", "kitchen sponge", "scrub brush", "dish brush", "steel wool", "scouring pad", "mop head", "broom", "dust pan", "rag", "cleaning rag"], "mixed_unknown", "trash", ["care-small", "reuse"], "Used sponges and brushes are trash. Cloth rags can be washed and reused.", { }),
  I(["trash bag", "garbage bag", "bin liner", "compost bag", "compostable bag", "biodegradable bag"], "mixed_unknown", "trash", ["film", "food-bags"], "Garbage bags are trash. Compostable bags only work in programs that accept them.", { }),
  I(["toy", "stuffed animal", "plush", "lego", "legos", "board game", "puzzle", "doll", "action figure", "plastic toy", "sports ball", "basketball", "soccer ball", "football", "tennis ball", "tennis racket", "bike helmet", "skateboard", "bike", "scooter"], "mixed_unknown", "reuse", ["reuse", "school-supplies", "check"], "Toys and gear are best donated, sold or passed on. Helmets expire and should be replaced and trashed.", { }),
  I(["tire", "tires", "car tire", "bike tire", "bike tube", "tube", "bicycle tire"], "mixed_unknown", "dropoff", ["check", "hazard"], "Tires usually need a tire retailer or special collection and aren't accepted in bins.", { }),
  I(["styrofoam packing", "foam packing", "foam sheet", "foam insert", "polystyrene"], "mixed_unknown", "trash", ["foam"], "Foam packing is rarely accepted. Some shippers take packing peanuts back.", { }),
];

// ── Lookup ──
function norm(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9#\-' ]+/g, " ")
    .replace(/\b(a|an|the|my|some|old|used|empty|dirty|broken|big|small|plastic|disposable)\b/g, (m) => (m === "plastic" || m === "disposable" ? m : " "))
    .replace(/\s+/g, " ")
    .trim();
}

function singular(s: string): string {
  return s.replace(/(ches|shes|sses|xes)$/, (m) => m.slice(0, -2)).replace(/ies$/, "y").replace(/([^s])s$/, "$1");
}

const INDEX: { name: string; item: LibraryItem }[] = ITEM_LIBRARY.flatMap((item) =>
  item.names.map((n) => ({ name: norm(n), item }))
).sort((a, b) => b.name.length - a.name.length);

/** Exact (normalised, singularised) match first, then the longest library name found as whole words in the text. */
export function lookupItem(text: string): LibraryItem | null {
  const t = norm(text);
  if (!t) return null;
  const ts = singular(t);
  for (const e of INDEX) {
    if (e.name === t || e.name === ts || singular(e.name) === ts) return e.item;
  }
  const padded = ` ${t} `;
  const padS = ` ${ts} `;
  for (const e of INDEX) {
    if (e.name.length < 4) continue;
    const needle = ` ${e.name} `;
    if (padded.includes(needle) || padS.includes(needle)) return e.item;
    const ns = ` ${singular(e.name)} `;
    if (padS.includes(ns)) return e.item;
  }
  return null;
}

function lev(a: string, b: string): number {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return dp[a.length][b.length];
}

/** Library names sharing a whole word (or a near-typo of one) with the text, for "did you mean" chips. */
export function suggestItems(text: string, limit = 6): string[] {
  const t = norm(text);
  if (!t) return [];
  const words = t.split(" ").filter((w) => w.length >= 3);
  const scored = ITEM_LIBRARY.map((item) => {
    let best = 0;
    for (const n of item.names) {
      const parts = norm(n).split(" ");
      let s = 0;
      for (const w of words) {
        if (parts.includes(w) || parts.includes(singular(w))) s += 3;
        else if (w.length >= 4 && parts.some((x) => x.length >= 4 && lev(w, x) <= 1)) s += 2;
      }
      best = Math.max(best, s);
    }
    return { name: item.names[0], score: best };
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((x) => x.name);
}

export function allItemNames(): string[] {
  return ITEM_LIBRARY.map((i) => i.names[0]).sort();
}
