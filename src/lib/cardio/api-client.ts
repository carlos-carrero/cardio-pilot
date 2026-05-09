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

export type ExtractionErrorType =
  | "timeout"
  | "network"
  | "backend_error"
  | "backend_unavailable"
  | "unknown";

export type ExtractionResult =
  | { ok: true; data: PilotExtractResponse; source: "ai" }
  | {
      ok: false;
      error: string;
      source: "extraction_error";
      errorType: ExtractionErrorType;
      status?: number;
      elapsedMs?: number;
      retried: boolean;
      requestId?: string;
    };

/** Status codes worth retrying once (transient infrastructure errors). */
const RETRYABLE_STATUSES = new Set([502, 503, 504]);

/** Classify a caught fetch error. */
function classifyFetchError(err: unknown): ExtractionErrorType {
  if (err instanceof Error) {
    const msg = err.message.toLowerCase();
    if (msg.includes("abort") || msg.includes("timeout")) return "timeout";
    if (msg.includes("fetch") || msg.includes("network") || msg.includes("econnrefused")) return "network";
  }
  return "unknown";
}

/**
 * Call the real Soficca AI extraction backend via the Next.js proxy.
 * Includes a 65 s browser-side timeout and one automatic retry on transient failures.
 */
export async function callPilotExtract(
  caseText: string,
  language: string = "auto",
): Promise<ExtractionResult> {
  const body = { case_text: caseText, language, source: "free_text" };

  async function attempt(): Promise<{
    res?: Response;
    err?: unknown;
    elapsedMs: number;
  }> {
    const startMs = performance.now();
    try {
      const res = await fetch("/api/cardio/pilot/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(65_000),
      });
      return { res, elapsedMs: Math.round(performance.now() - startMs) };
    } catch (err) {
      return { err, elapsedMs: Math.round(performance.now() - startMs) };
    }
  }

  function isRetryable(res?: Response, err?: unknown): boolean {
    if (err) {
      const t = classifyFetchError(err);
      return t === "timeout" || t === "network";
    }
    if (res && RETRYABLE_STATUSES.has(res.status)) return true;
    return false;
  }

  // First attempt
  let { res, err, elapsedMs } = await attempt();
  let retried = false;

  // Single retry for transient failures
  if (isRetryable(res, err)) {
    retried = true;
    ({ res, err, elapsedMs } = await attempt());
  }

  // Handle fetch-level errors (network, timeout, abort)
  if (err || !res) {
    const errorType = classifyFetchError(err);
    const msg = err instanceof Error ? err.message : "Network error";
    return {
      ok: false,
      error: msg,
      source: "extraction_error",
      errorType,
      elapsedMs,
      retried,
    };
  }

  // Handle non-ok HTTP responses
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    const detail = errData.detail ?? errData.error ?? `HTTP ${res.status}`;
    const errorType: ExtractionErrorType =
      errData.error_type ?? (RETRYABLE_STATUSES.has(res.status) ? "backend_unavailable" : "backend_error");
    return {
      ok: false,
      error: String(detail),
      source: "extraction_error",
      errorType,
      status: res.status,
      elapsedMs: errData.elapsed_ms ?? elapsedMs,
      retried,
      requestId: errData.request_id,
    };
  }

  // Success
  const data: PilotExtractResponse = await res.json();
  return { ok: true, data, source: "ai" };
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
