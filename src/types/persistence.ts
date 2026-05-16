/**
 * Types for backend persistence (Stage 3E.1).
 *
 * Aligned with FastAPI PersistCaseBundleRequest/Response.
 * Frontend-safe — no DB secrets or internal IDs exposed.
 */

// ── Persistence status ──────────────────────────────────────────

export type PersistenceStatus =
  | "idle"
  | "saving"
  | "saved"
  | "already_exists"
  | "error"
  | "unavailable";

// ── Nested payloads for case bundle ─────────────────────────────

export interface AIExtractionPayload {
  extraction_id: string;
  model: string;
  extraction_source: string;
  confidence: number;
  structured_summary?: string | null;
  fields_json: Record<string, unknown>;
  field_evidence_json?: unknown[] | null;
  missing_information_json?: Record<string, unknown> | null;
  completion_questions_json?: string[] | null;
  quality_flags_json?: string[] | null;
  pii_warnings_json?: string[] | null;
  warnings_json?: string[] | null;
  unmapped_signals_json?: string[] | null;
  possible_conflicts_json?: string[] | null;
  raw_response_json?: Record<string, unknown> | null;
}

export interface HumanCorrectionPayload {
  human_edits_applied: boolean;
  fields_edited_count: number;
  diffs_json?: unknown[] | null;
  final_structured_input_json: Record<string, unknown>;
  reviewer_label?: string | null;
}

export interface EngineReportPayload {
  route?: string | null;
  decision_status?: string | null;
  report_json: Record<string, unknown>;
  engine_input_json: Record<string, unknown>;
  safety_json?: Record<string, unknown> | null;
  trace_json?: Record<string, unknown> | null;
  activated_rules_json?: string[] | null;
  engine_version?: string | null;
  ruleset_version?: string | null;
  safety_policy_version?: string | null;
  contract_version?: string | null;
}

export interface AuditRecordPayload {
  audit_id: string;
  audit_json: Record<string, unknown>;
  markdown_snapshot?: string | null;
}

// ── Top-level request / response ────────────────────────────────

export interface PersistCaseBundlePayload {
  session_id?: string | null;
  case_id: string;
  source?: string;
  raw_narrative: string;
  chief_complaint_summary?: string | null;
  current_status?: string;
  final_route?: string | null;
  decision_status?: string | null;
  human_review_required?: boolean;
  extraction_source?: string | null;
  routing_source?: string | null;
  is_simulated?: boolean;
  contains_pii_warning?: boolean;
  metadata_json?: Record<string, unknown> | null;

  ai_extraction?: AIExtractionPayload | null;
  human_correction?: HumanCorrectionPayload | null;
  engine_report?: EngineReportPayload | null;
  audit_record?: AuditRecordPayload | null;
}

export interface PersistCaseBundleResponse {
  case_id: string;
  case_uuid: string;
  saved: {
    case: boolean;
    ai_extraction: boolean;
    human_correction: boolean;
    engine_report: boolean;
    audit_record: boolean;
    reviewer_feedback: boolean;
  };
}

export interface PersistedCaseBundle {
  case: Record<string, unknown>;
  ai_extraction?: Record<string, unknown> | null;
  human_correction?: Record<string, unknown> | null;
  engine_report?: Record<string, unknown> | null;
  audit_record?: Record<string, unknown> | null;
  reviewer_feedback?: Record<string, unknown>[];
}

// ── Reviewer feedback persistence ───────────────────────────────

export type ReviewerPersistenceStatus =
  | "idle"
  | "saving"
  | "saved"
  | "error"
  | "unavailable";

export interface PersistReviewerFeedbackPayload {
  reviewer_name?: string | null;
  reviewer_role?: string | null;
  route_appropriate: string;
  usefulness_score: number;
  missing_info_surfaced?: string | null;
  safety_flags_assessment?: string | null;
  estimated_review_time_saved?: string | null;
  useful_before_consultation?: string | null;
  comments?: string | null;
  ui_locale?: "en" | "es";
}

export interface PersistReviewerFeedbackResponse {
  feedback: Record<string, unknown>;
  case_status_updated: boolean;
}

export interface PersistedReviewerCaseSummary {
  case_id: string;
  created_at: string;
  final_route: string | null;
  decision_status: string | null;
  extraction_source: string | null;
  routing_source: string | null;
  current_status: string;
  chief_complaint_summary: string | null;
  is_simulated: boolean;
}

export interface PersistedCaseListResponse {
  cases: PersistedReviewerCaseSummary[];
  count: number;
}

// ── Session persistence ─────────────────────────────────────────

export type SessionPersistenceStatus =
  | "not_created"
  | "creating"
  | "created"
  | "unavailable"
  | "error";

export interface CreatePilotSessionPayload {
  label?: string | null;
  mode?: string;
  notes?: string | null;
  environment?: string;
  created_by?: string | null;
}

export interface CreatePilotSessionResponse {
  session: Record<string, unknown>;
}

export interface PersistedPilotSession {
  id: string;
  session_id: string;
  label: string | null;
  mode: string;
  environment: string;
  created_at: string;
}

export interface SessionListResponse {
  sessions: Record<string, unknown>[];
  count: number;
}

// ── Session summary persistence ─────────────────────────────────

export interface PersistSessionSummaryPayload {
  summary_id: string;
  metrics_json: Record<string, unknown>;
  route_distribution_json?: Record<string, unknown> | null;
  reviewer_metrics_json?: Record<string, unknown> | null;
  workflow_impact_json?: Record<string, unknown> | null;
  governance_metrics_json?: Record<string, unknown> | null;
  safety_assertions_json?: Record<string, unknown> | null;
  case_summaries_json?: unknown[] | null;
  ui_locale?: "en" | "es";
}

export interface PersistSessionSummaryResponse {
  summary: Record<string, unknown>;
}

export interface PersistedSessionSummaryResponse {
  summary: Record<string, unknown>;
}
