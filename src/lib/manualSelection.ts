/** Materials a person can pick by hand when AI identification fails. Index = position in MOCK_RESULTS (guidance text only; no AI claim is made). */
export const MANUAL_MATERIALS = [
  { label: "Plastic bottle", index: 0 },
  { label: "Cardboard", index: 1 },
  { label: "Glass jar", index: 2 },
  { label: "Clothing / fabric", index: 3 },
  { label: "Aluminum can", index: 4 },
] as const;
