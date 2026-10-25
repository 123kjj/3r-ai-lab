import { FollowUpQuestion } from "./types";
import { ExtendedCategoryId } from "./scenarioEngine";

/**
 * Follow-up questions are keyed by material category and only shown
 * when the answer could realistically change the recommendation —
 * per the spec's instruction not to ask generic filler questions.
 * This is a static table (testable, auditable), not AI-generated
 * per request.
 */
const QUESTIONS_BY_CATEGORY: Partial<Record<ExtendedCategoryId, FollowUpQuestion[]>> = {
  corrugated_cardboard: [
    {
      id: "greasy",
      question: "Is there grease or food residue on it (e.g. a pizza box)?",
      options: [
        { value: "yes", label: "Yes, it's greasy or food-stained" },
        { value: "no", label: "No, it's clean and dry" },
      ],
    },
  ],
  mixed_paper: [
    {
      id: "contamination",
      question: "Is it laminated, waxed, or heavily soiled?",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No, it's plain paper" },
      ],
    },
  ],
  pet_plastic: [
    {
      id: "contamination",
      question: "Did it contain anything other than food or drink (e.g. chemicals, motor oil)?",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No, just food/drink" },
      ],
    },
  ],
  hdpe_plastic: [
    {
      id: "contamination",
      question: "Did it contain anything other than food or drink (e.g. chemicals, motor oil)?",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No, just food/drink" },
      ],
    },
  ],
  glass: [
    {
      id: "intact",
      question: "Is it intact, or is it cracked/broken?",
      options: [
        { value: "intact", label: "Intact" },
        { value: "broken", label: "Cracked or broken" },
      ],
    },
  ],
};

export function getFollowUpQuestions(categoryId: ExtendedCategoryId): FollowUpQuestion[] {
  return QUESTIONS_BY_CATEGORY[categoryId] ?? [];
}
