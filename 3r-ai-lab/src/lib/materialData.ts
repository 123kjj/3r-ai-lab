/**
 * ────────────────────────────────────────────────────────────────
 * MATERIAL IMPACT DATA — sourced from EPA WARM (Waste Reduction
 * Model), not invented or estimated by an LLM.
 * ────────────────────────────────────────────────────────────────
 *
 * Every number here was pulled directly from EPA's published WARM
 * documentation chapters (cited per-entry below) during this build.
 * If a material category isn't listed, we deliberately do NOT guess
 * a number for it — see `materialImpactFor()` in scenarioEngine.ts,
 * which returns an explicit "no verified figure" result instead.
 *
 * WHAT THE NUMBERS MEAN
 * Each figure is "Net GHG Emissions" in MTCO2E (metric tons of CO2
 * equivalent) PER SHORT TON of that material, for a given end-of-life
 * pathway, relative to a baseline of landfilling virgin-material
 * production avoided. A NEGATIVE number means that pathway is a net
 * emissions reduction (it avoids more emissions upstream — e.g. by
 * offsetting virgin material production — than it generates). This is
 * a national-average, material-category-level model: it is NOT a
 * measurement of the specific object in front of a user, and WARM
 * itself documents real uncertainty ranges and regional variation
 * (grid mix, transport distance, local MRF efficiency, etc.) that
 * this simplified lookup cannot capture.
 */

export type MaterialCategoryId =
  | "aluminum"
  | "glass"
  | "pet_plastic"
  | "hdpe_plastic"
  | "corrugated_cardboard"
  | "mixed_paper"
  | "food_organic";

export interface WarmPathwayFigures {
  /** MTCO2E per short ton. Negative = net emissions reduction. */
  recycling?: number;
  composting?: number;
  anaerobicDigestion?: number;
  combustion?: number;
  landfilling?: number;
}

export interface MaterialImpactEntry {
  id: MaterialCategoryId;
  label: string;
  warmFigures: WarmPathwayFigures;
  /** The exact WARM documentation chapter this was pulled from. */
  sourceTitle: string;
  sourceUrl: string;
  /** The specific exhibit/table referenced, for auditability. */
  sourceExhibit: string;
  /** Known limitations of applying this category-level figure. */
  limitations: string[];
}

export const MATERIAL_IMPACT_DATA: Record<MaterialCategoryId, MaterialImpactEntry> = {
  aluminum: {
    id: "aluminum",
    label: "Aluminum (cans/containers)",
    warmFigures: { recycling: -9.13, combustion: 0.03, landfilling: 0.02 },
    sourceTitle:
      "EPA WARM v15 — Containers, Packaging, and Non-Durable Goods Materials Chapter",
    sourceUrl:
      "https://www.epa.gov/sites/default/files/2020-12/documents/warm_containers_packaging_and_non-durable_goods_materials_v15_10-29-2020.pdf",
    sourceExhibit: "Exhibit 2-7: Net Emissions for Metals (Aluminum Cans)",
    limitations: [
      "Aluminum's large negative (beneficial) recycling figure is driven mostly by how energy-intensive virgin aluminum smelting is — it does not mean every recycling program near you captures this benefit equally.",
      "Figure assumes cans are reasonably clean; heavy contamination can affect real-world MRF (materials recovery facility) processing.",
    ],
  },
  glass: {
    id: "glass",
    label: "Glass",
    warmFigures: { recycling: -0.28, combustion: 0.03, landfilling: 0.02 },
    sourceTitle: "EPA WARM v15 — Containers, Packaging, and Non-Durable Goods Materials Chapter",
    sourceUrl:
      "https://www.epa.gov/sites/default/files/2020-12/documents/warm_containers_packaging_and_non-durable_goods_materials_v15_10-29-2020.pdf",
    sourceExhibit: "Exhibit 1-4: Net Emissions for Glass",
    limitations: [
      "Glass's recycling benefit is modest compared to metals, because glass manufacturing from virgin sand is less energy-intensive than virgin metal smelting — this is why reuse is often emphasized over recycling for glass specifically.",
      "Many curbside programs do not accept glass at all (collection logistics, breakage, contamination risk), which this category-level figure does not account for.",
    ],
  },
  pet_plastic: {
    id: "pet_plastic",
    label: "PET plastic (#1, bottles)",
    warmFigures: { recycling: -1.13, combustion: 1.24, landfilling: 0.04 },
    sourceTitle: "EPA WARM — Plastics Chapter",
    sourceUrl: "https://archive.epa.gov/epawaste/conserve/tools/warm/pdfs/Plastics.pdf",
    sourceExhibit: "Exhibit 4: Net Emissions for Plastics — PET",
    limitations: [
      "Combustion shows a positive (net-emitting) figure for plastics, unlike paper — plastic is petroleum-derived, so burning it releases fossil carbon rather than displacing it.",
      "This figure is for PET resin generally; a bottle's cap, label, or sleeve may be a different plastic type not reflected here.",
    ],
  },
  hdpe_plastic: {
    id: "hdpe_plastic",
    label: "HDPE plastic (#2, jugs/tubs)",
    warmFigures: { recycling: -0.88, combustion: 1.27, landfilling: 0.04 },
    sourceTitle: "EPA WARM — Plastics Chapter",
    sourceUrl: "https://archive.epa.gov/epawaste/conserve/tools/warm/pdfs/Plastics.pdf",
    sourceExhibit: "Exhibit 4: Net Emissions for Plastics — HDPE",
    limitations: [
      "Same caveat as PET: combustion is net-emitting because the carbon is fossil-derived.",
      "Figure assumes food-grade/clean HDPE; residue (e.g. motor oil, detergent) can disqualify a container from standard recycling streams even though the resin itself is this type.",
    ],
  },
  corrugated_cardboard: {
    id: "corrugated_cardboard",
    label: "Corrugated cardboard",
    warmFigures: { recycling: -3.12, combustion: -0.48, landfilling: 0.45 },
    sourceTitle: "EPA WARM — Paper Products Chapter",
    sourceUrl: "https://archive.epa.gov/epawaste/conserve/tools/warm/pdfs/Paper_Products.pdf",
    sourceExhibit: "Exhibit 8: Net Emissions for Paper Products — Corrugated Containers",
    limitations: [
      "Landfilling paper products shows a relatively high positive (emitting) figure compared to other materials, because paper decomposes anaerobically in landfills and releases methane — this is why 'just landfill it' is a worse option for paper specifically than it looks for, say, glass.",
      "Grease or food contamination (e.g. pizza boxes) is excluded from standard recycling streams regardless of what this category figure says — WARM models clean material.",
    ],
  },
  mixed_paper: {
    id: "mixed_paper",
    label: "Mixed paper (office paper, mail, etc.)",
    warmFigures: { recycling: -3.53, combustion: -0.49, landfilling: 0.4 },
    sourceTitle: "EPA WARM — Paper Products Chapter",
    sourceUrl: "https://archive.epa.gov/epawaste/conserve/tools/warm/pdfs/Paper_Products.pdf",
    sourceExhibit: "Exhibit 8: Net Emissions for Paper Products — Mixed Paper (general)",
    limitations: [
      "Same landfill-methane dynamic as cardboard applies.",
      "'Mixed paper' is a broad WARM category; glossy/coated or laminated paper can behave differently in real recycling streams.",
    ],
  },
  food_organic: {
    id: "food_organic",
    label: "Food scraps / organic waste",
    warmFigures: { composting: -0.15, anaerobicDigestion: -0.04, landfilling: 0.5 },
    sourceTitle: "EPA WARM v16 — Organic Materials Chapter",
    sourceUrl: "https://www.epa.gov/system/files/documents/2023-12/warm_organic_materials_v16_dec.pdf",
    sourceExhibit: "Exhibit 1-10: Net Emissions for Food Waste",
    limitations: [
      "Food waste has the highest landfill penalty of the categories we track, because landfilled organics decompose anaerobically into methane — a far more potent greenhouse gas than CO2 over a 20-year window.",
      "Composting's benefit depends heavily on the composting method and whether the resulting compost is actually used (displacing synthetic fertilizer) — WARM's figure is a national-average estimate, not a guarantee.",
    ],
  },
};

/**
 * Material categories we explicitly do NOT have a sourced WARM figure
 * for yet (e.g. textiles — WARM's textiles chapter wasn't reachable
 * during this build). Listed here so the UI can say so honestly
 * instead of silently having no entry.
 */
export const UNSOURCED_CATEGORIES = ["textile", "mixed_unknown"] as const;
