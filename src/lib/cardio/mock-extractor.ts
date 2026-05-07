import type { CardioExtraction, ExampleCaseId } from "@/types";
import { getMockExtraction } from "@/mock/mock-extractions";

/**
 * Stage 1 mock extractor.
 * In Stage 2 this will call a real LLM endpoint.
 * For now, selects a mock extraction based on example case ID.
 */
export function extractFromNarrative(
  _narrative: string,
  exampleCaseId: ExampleCaseId | null
): CardioExtraction {
  if (exampleCaseId) {
    return getMockExtraction(exampleCaseId);
  }

  // Fallback: return a minimal extraction with mostly null fields
  return {
    extraction_id: `ext-freetext-${Date.now()}`,
    model_id: "mock-extractor-v1-stage1",
    extracted_at: new Date().toISOString(),
    confidence: 0.3,
    fields: {
      age: null,
      chest_pain_present: null,
      pain_duration_minutes: null,
      pain_character: null,
      pain_severity: null,
      pain_radiation: null,
      exertional_chest_pain: null,
      diaphoresis: null,
      dyspnea: null,
      syncope: null,
      systolic_bp: null,
      heart_rate: null,
      prior_mi: null,
      known_cad: null,
      cv_risk_factors_count: null,
      current_meds_none: null,
    },
    unmapped_signals: [
      "Free-text extraction is not available in Stage 1. Use an example case.",
    ],
    warnings: ["Mock extractor active. No real LLM was called."],
  };
}
