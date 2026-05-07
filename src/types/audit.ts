import type { AIExtractionRecord, HumanCorrectionStatus, CardioExtractionFields, ExtractionSource } from "./extraction";
import type { CardioPayload, CardioReport } from "./cardio-report";
import type { ReportSource } from "./case";

// ── Signal chain ────────────────────────────────────────────────

export type SignalChainStepStatus = "completed" | "mock_fallback" | "pending" | "skipped";

export interface SignalChainStep {
  label: string;
  status: SignalChainStepStatus;
  detail?: string;
}

export interface SignalChain {
  ai_extraction: SignalChainStep;
  human_confirmation: SignalChainStep;
  human_edits: SignalChainStep;
  soficca_routing: SignalChainStep;
  physician_review: SignalChainStep;
}

// ── Report integrity ────────────────────────────────────────────

export interface ReportIntegrity {
  policy_version_included: boolean;
  ruleset_version_included: boolean;
  engine_version_included: boolean;
  activated_rules_included: boolean;
  audit_trace_included: boolean;
  human_review_required: boolean;
}

// ── Safety assertions ───────────────────────────────────────────

export interface SafetyAssertions {
  no_diagnosis_generated: true;
  no_prescription_generated: true;
  ai_did_not_decide_route: true;
  deterministic_engine_routed_case: true;
  physician_review_required: true;
}

// ── Pilot mode snapshot ─────────────────────────────────────────

export interface PilotModeSnapshot {
  data_source: "mock";
  extraction_source: ExtractionSource | "unknown";
  routing_source: ReportSource | "unknown";
}

// ── Full audit record ───────────────────────────────────────────

export interface CardioPilotAuditRecord {
  audit_id: string;
  case_id: string;
  created_at: string;
  exported_at?: string;
  raw_narrative: string;
  extraction_source: ExtractionSource | "unknown";
  routing_source: ReportSource | "unknown";
  ai_extraction_record: AIExtractionRecord | null;
  human_correction: HumanCorrectionStatus | null;
  final_structured_input: CardioExtractionFields | null;
  engine_input: CardioPayload | null;
  engine_report: CardioReport | null;
  signal_chain: SignalChain;
  report_integrity: ReportIntegrity;
  safety_assertions: SafetyAssertions;
  pilot_mode: PilotModeSnapshot;
  notes?: string;
}
