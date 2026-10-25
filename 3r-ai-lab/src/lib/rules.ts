/**
 * Hand-written sorting rules. Wording is deliberately hedged ("most
 * programs", "usually") because recycling rules vary by city. No
 * statistics here; sourced numbers live in materialData.ts.
 */
export interface Rule {
  id: string;
  group: string;
  title: string;
  text: string;
  /** Core rules drive badges and the Sort Rush lesson cards. */
  core?: boolean;
}

export const RULES: Rule[] = [
  // ── 18 core rules ──
  { id: "empty", group: "Core", core: true, title: "Empty it first", text: "Leftover liquid and food contaminate other recyclables in the same bin." },
  { id: "grease", group: "Core", core: true, title: "Grease ruins paper", text: "Food grease soaks into paper fibers and usually keeps that part out of recycling. Clean parts can still go." },
  { id: "rinse", group: "Core", core: true, title: "Rinse, don't scrub", text: "A quick rinse is enough for most containers. They don't need to be spotless." },
  { id: "film", group: "Core", core: true, title: "Film jams machines", text: "Plastic bags and wrap tangle sorting equipment, so most curbside programs reject them. Many stores collect clean bags." },
  { id: "battery", group: "Core", core: true, title: "Batteries never go curbside", text: "Anything with a battery can start fires in trucks and facilities. Use a battery or electronics drop-off." },
  { id: "ewaste", group: "Core", core: true, title: "Electronics aren't trash", text: "Phones, chargers and cables have valuable materials and usually need an e-waste drop-off." },
  { id: "mixed", group: "Core", core: true, title: "Mixed materials are hard", text: "Items glued or lined from several materials (lined cups, chip bags, pouches) usually can't be recycled. Avoiding them is the best fix." },
  { id: "methane", group: "Core", core: true, title: "Landfilled food makes methane", text: "Food rotting in a landfill releases methane. Composting avoids that where it's available." },
  { id: "small", group: "Core", core: true, title: "Tiny things fall through", text: "Very small items slip through sorting equipment and end up as trash." },
  { id: "hazard", group: "Core", core: true, title: "Hazardous needs special drop-off", text: "Paint, oil, chemicals and similar items should go to a hazardous-waste collection, never the bin or the drain." },
  { id: "dry", group: "Core", core: true, title: "Keep paper clean and dry", text: "Wet or soiled paper and cardboard usually can't be recycled." },
  { id: "reuse", group: "Core", core: true, title: "Reuse beats recycling", text: "If an item still has life in it, using it again is usually better than breaking it down." },
  { id: "shape", group: "Core", core: true, title: "Bottles and jugs win", text: "Most programs accept bottles, jugs and jars. Tubs, trays and clamshells vary a lot, so check." },
  { id: "textile", group: "Core", core: true, title: "Clothes aren't curbside", text: "Donate wearable clothes, and use worn-out ones as rags. Most curbside programs don't take textiles." },
  { id: "meds", group: "Core", core: true, title: "Medicine needs take-back", text: "Use a pharmacy or take-back program for medicines and sharps. Don't flush or bin them." },
  { id: "foam", group: "Core", core: true, title: "Foam is rarely accepted", text: "Most programs don't take foam. The easiest fix is to avoid it." },
  { id: "check", group: "Core", core: true, title: "When unsure, check locally", text: "Wishful recycling can spoil a whole load. Your local program's list beats a guess." },
  { id: "reduce", group: "Core", core: true, title: "Reduce first", text: "The best waste is the item you didn't need. Refill, repair, borrow or skip it." },

  // ── Type rules ──
  { id: "plastic-bottles", group: "Plastic", title: "Bottles with necks are widely accepted", text: "Water, soda and juice bottles are the plastic most programs want." },
  { id: "plastic-number", group: "Plastic", title: "Numbers #1 and #2 are the safest", text: "The number in the triangle shows the resin. #1 and #2 are accepted most often." },
  { id: "plastic-tubs", group: "Plastic", title: "Tubs and clamshells vary", text: "Some programs take them and some don't. Check your list." },
  { id: "plastic-caps", group: "Plastic", title: "Cap rules differ", text: "Many programs now say to leave caps on, but not all. Check yours." },
  { id: "plastic-utensils", group: "Plastic", title: "Utensils and straws are too small", text: "Cutlery and straws are usually trash. Carry reusable ones." },
  { id: "paper-office", group: "Paper", title: "Plain paper is easy", text: "Office paper, notebook paper and newspaper are among the most recycled items." },
  { id: "paper-receipts", group: "Paper", title: "Receipts are usually trash", text: "Thermal receipt paper is coated and typically isn't recycled." },
  { id: "paper-cups", group: "Paper", title: "Paper cups are lined with plastic", text: "That lining keeps most paper cups out of standard recycling." },
  { id: "paper-wet", group: "Paper", title: "Napkins and tissues are used paper", text: "They're too short-fibered and soiled for recycling. Compost them if your program accepts it, otherwise trash." },
  { id: "paper-shiny", group: "Paper", title: "Glitter and foil wrap is trash", text: "Metallic or glittery paper can't be recycled with plain paper." },
  { id: "card-flatten", group: "Cardboard", title: "Flatten boxes", text: "Flat boxes save space in trucks and bins." },
  { id: "card-tape", group: "Cardboard", title: "Small amounts of tape are okay", text: "Most programs accept boxes with a little tape. Peel big plastic parts off." },
  { id: "card-reuse", group: "Cardboard", title: "Boxes are great to reuse", text: "Reuse for storage or shipping before recycling." },
  { id: "glass-bottles", group: "Glass", title: "Bottles and jars are widely accepted", text: "Many programs take them, though some require drop-off." },
  { id: "glass-not", group: "Glass", title: "Other glass is different", text: "Drinking glasses, mirrors and window glass melt differently and don't go with bottles." },
  { id: "glass-lids", group: "Glass", title: "Lids are separate", text: "Take lids off. Metal lids often go in the metal stream." },
  { id: "glass-reuse", group: "Glass", title: "Jars are free containers", text: "A washed jar is useful for food, crafts and storage." },
  { id: "metal-cans", group: "Metal", title: "Drink cans are top recyclables", text: "Aluminum cans are accepted almost everywhere." },
  { id: "metal-steel", group: "Metal", title: "Food cans are accepted too", text: "Steel and tin food cans are usually accepted. Rinse them." },
  { id: "metal-foil", group: "Metal", title: "Foil should be clean", text: "Clean foil is accepted by some programs, often balled up. Greasy foil is trash." },
  { id: "metal-aerosol", group: "Metal", title: "Empty aerosol cans vary", text: "Some programs take them when fully empty. Check yours." },
  { id: "metal-sharp", group: "Metal", title: "Mind sharp edges", text: "Cut cans have sharp edges. Ask an adult and sand rough edges before crafts." },
  { id: "food-compost", group: "Food", title: "Plant scraps compost well", text: "Fruit and vegetable scraps, coffee grounds and eggshells are standard compost." },
  { id: "food-meat", group: "Food", title: "Meat and dairy need a program", text: "Home compost usually can't take them. Some city programs can." },
  { id: "food-bags", group: "Food", title: "Skip plastic bags in compost", text: "Use paper or certified compostable liners, and only where accepted." },
  { id: "food-plan", group: "Food", title: "Plan to waste less", text: "Storing and planning food well beats composting it." },
  { id: "textile-donate", group: "Textiles", title: "Wearable clothes can be donated", text: "Clean, wearable items go to donation or resale." },
  { id: "textile-rags", group: "Textiles", title: "Worn-out cloth becomes rags", text: "Cotton and similar fabrics make good cleaning rags." },
  { id: "textile-shoes", group: "Textiles", title: "Shoes are tricky", text: "Donate wearable pairs. Worn-out ones are usually trash unless a take-back program exists." },
  { id: "elec-dropoff", group: "Electronics", title: "Use e-waste collection", text: "Retailers and city events often take old electronics." },
  { id: "elec-data", group: "Electronics", title: "Wipe your data first", text: "Erase phones and laptops before handing them over." },
  { id: "elec-vape", group: "Electronics", title: "Vapes contain lithium batteries", text: "Disposable vapes are electronics with batteries, not trash." },
  { id: "elec-cables", group: "Electronics", title: "Cables and chargers are e-waste", text: "Tangled cords still belong at e-waste drop-off." },
  { id: "haz-paint", group: "Hazardous", title: "Paint needs household hazardous waste", text: "Many areas have paint drop-off. Don't pour it down a drain." },
  { id: "haz-bulbs", group: "Hazardous", title: "Some bulbs contain mercury", text: "CFL tubes need special drop-off. LED rules vary." },
  { id: "haz-oil", group: "Hazardous", title: "Cooking and motor oil are separate problems", text: "Don't pour either down a drain. Look for local collection." },
  { id: "haz-sharps", group: "Hazardous", title: "Sharps need safe containers", text: "Use a rigid container and a take-back option." },
  { id: "pack-pouch", group: "Packaging", title: "Pouches are mixed layers", text: "Snack bags and drink pouches are usually trash." },
  { id: "pack-bubble", group: "Packaging", title: "Bubble wrap is film", text: "Treat it like plastic bags: store drop-off if clean." },
  { id: "pack-carton", group: "Packaging", title: "Cartons vary", text: "Juice and milk cartons are accepted in some programs. Check yours." },
  { id: "pack-takeout", group: "Packaging", title: "Greasy takeout containers are trash", text: "Food-soiled containers usually can't be recycled." },
  { id: "school-pens", group: "School", title: "Pens and markers are small and mixed", text: "They're usually trash, so use refillable ones." },
  { id: "school-notebook", group: "School", title: "Notebooks can be recycled", text: "Remove covers if they're plastic, and recycle the paper." },
  { id: "school-backpack", group: "School", title: "Backpacks should be reused", text: "Repair, pass on or donate before replacing." },
  { id: "school-supplies", group: "School", title: "Pass supplies on", text: "Unused supplies can go to a classroom or donation bin." },
  { id: "care-bottles", group: "Personal care", title: "Bathroom plastic bottles are often accepted", text: "Rinse and put in recycling where bottles are accepted." },
  { id: "care-small", group: "Personal care", title: "Tiny items are trash", text: "Razors, brushes and toothpaste tubes are usually trash." },
  { id: "care-wipes", group: "Personal care", title: "Wipes are not flushable", text: "Even the 'flushable' kind clogs pipes. Put them in the trash." },
  { id: "home-furniture", group: "Home", title: "Bulky items need pickup or donation", text: "Furniture and mattresses go to donation or special pickup." },
  { id: "home-yard", group: "Home", title: "Yard waste has its own stream", text: "Leaves and trimmings go to yard waste or compost, not the trash." },
  { id: "home-ceramics", group: "Home", title: "Ceramics aren't recyclable like glass", text: "Plates and mugs should be reused, donated or trashed." },
];

export const RULES_BY_ID: Record<string, Rule> = Object.fromEntries(RULES.map((r) => [r.id, r]));
export const CORE_RULES = RULES.filter((r) => r.core);
