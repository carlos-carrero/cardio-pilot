import type {
  CardioExtraction,
  CardioExtractionFields,
  CardioFieldEvidence,
  CardioMissingInformation,
  ExtractionQualityFlag,
  PiiWarning,
  CardioReport,
  CardioPayload,
} from "@/types";

// ── Extraction ───────────────────────────────────────────────────

export interface PilotExtractResponse {
  extraction_id: string;
  model: string;
  language_detected: string;
  ai_role: string;
  confidence: number;
  fields: CardioExtractionFields;
  structured_clinical_summary: string;
  missing_fields: string[];
  missing_information: CardioMissingInformation;
  completion_questions: string[];
  possible_conflicts: string[];
  field_evidence: CardioFieldEvidence[];
  extraction_quality_flags: ExtractionQualityFlag[];
  pii_warnings: PiiWarning[];
  warnings: string[];
}

export type ExtractionResult =
  | { ok: true; data: PilotExtractResponse; source: "ai" }
  | { ok: false; error: string; source: "extraction_error" };

/**
 * Call the real Soficca AI extraction backend via the Next.js proxy.
 */
export async function callPilotExtract(
  caseText: string,
  language: string = "auto",
): Promise<ExtractionResult> {
  const body = { case_text: caseText, language, source: "free_text" };

  try {
    const res = await fetch("/api/cardio/pilot/extract", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      const detail = errData.detail ?? errData.error ?? `HTTP ${res.status}`;
      return { ok: false, error: String(detail), source: "extraction_error" };
    }

    const data: PilotExtractResponse = await res.json();
    return { ok: true, data, source: "ai" };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Network error";
    return { ok: false, error: msg, source: "extraction_error" };
  }
}

// ── Routing ──────────────────────────────────────────────────────

export interface PilotReportResponse {
  case_id: string;
  source: string;
  raw_text: string;
  engine_input: CardioPayload;
  engine_report: CardioReport;
  human_review_required: boolean;
  pilot_mode: string;
}

export type RoutingResult =
  | { ok: true; data: PilotReportResponse; source: "backend" }
  | { ok: false; error: string; source: "backend_error" };

/**
 * Call the real Soficca Cardio backend via the Next.js proxy.
 */
export async function callPilotReport(
  caseId: string,
  rawText: string,
  extraction: CardioExtraction,
): Promise<RoutingResult> {
  const body = {
    case_id: caseId,
    raw_text: rawText,
    source: extraction.model_id,
    extraction: extraction.fields,
  };

  try {
    const res = await fetch("/api/cardio/pilot/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      const detail = errData.detail ?? errData.error ?? `HTTP ${res.status}`;
      return { ok: false, error: String(detail), source: "backend_error" };
    }

    const data: PilotReportResponse = await res.json();
    return { ok: true, data, source: "backend" };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Network error";
    return { ok: false, error: msg, source: "backend_error" };
  }
}
