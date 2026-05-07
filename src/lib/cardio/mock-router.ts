import type { CardioExtraction, CardioPayload, CardioReport, ExampleCaseId } from "@/types";
import { getMockReport } from "@/mock/mock-reports";

/**
 * Stage 1 mock router.
 * In Stage 2 this will call POST /v1/cardio/report on the real backend.
 * For now, returns a pre-built mock report matched to the example case.
 */
export function routeExtraction(
  extraction: CardioExtraction,
  exampleCaseId: ExampleCaseId | null
): { payload: CardioPayload; report: CardioReport } {
  const payload = buildPayloadFromExtraction(extraction);

  if (exampleCaseId) {
    return { payload, report: getMockReport(exampleCaseId) };
  }

  // Fallback: needs more info since free-text extraction has null fields
  return { payload, report: getMockReport("NEEDS_MORE_INFO") };
}

function buildPayloadFromExtraction(extraction: CardioExtraction): CardioPayload {
  const f = extraction.fields;
  const state: Record<string, unknown> = {};

  if (f.age !== null) state.age = f.age;
  if (f.chest_pain_present !== null) state.chest_pain_present = f.chest_pain_present;
  if (f.pain_duration_minutes !== null) state.pain_duration_minutes = f.pain_duration_minutes;
  if (f.pain_character !== null) state.pain_character = f.pain_character;
  if (f.pain_severity !== null) state.pain_severity = f.pain_severity;
  if (f.pain_radiation !== null) state.pain_radiation = f.pain_radiation;
  if (f.exertional_chest_pain !== null) state.exertional_chest_pain = f.exertional_chest_pain;
  if (f.diaphoresis !== null) state.diaphoresis = f.diaphoresis;
  if (f.dyspnea !== null) state.dyspnea = f.dyspnea;
  if (f.syncope !== null) state.syncope = f.syncope;
  if (f.systolic_bp !== null) state.systolic_bp = f.systolic_bp;
  if (f.heart_rate !== null) state.heart_rate = f.heart_rate;
  if (f.prior_mi !== null) state.prior_mi = f.prior_mi;
  if (f.known_cad !== null) state.known_cad = f.known_cad;
  if (f.cv_risk_factors_count !== null) state.cv_risk_factors_count = f.cv_risk_factors_count;
  if (f.current_meds_none !== null) state.current_meds_none = f.current_meds_none;

  return { state, context: { source: "USER" } };
}
