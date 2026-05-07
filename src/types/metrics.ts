// ── Local session metrics types ─────────────────────────────────

export interface RouteDistribution {
  emergency: number;
  urgent: number;
  routine: number;
  needs_more_info: number;
  conflict: number;
}

export interface AIIntakeMetrics {
  real_ai_extractions: number;
  mock_extraction_fallbacks: number;
  cases_with_human_edits: number;
  total_human_edited_fields: number;
  cases_with_missing_information: number;
  cases_with_completion_questions: number;
  cases_with_quality_flags: number;
  cases_with_pii_warnings: number;
}

export interface GovernanceMetrics {
  reports_with_trace: number;
  reports_with_policy_version: number;
  reports_with_ruleset_version: number;
  reports_with_engine_version: number;
  reports_with_activated_rules: number;
  autonomous_diagnosis_events: number;
  autonomous_prescription_events: number;
  ai_route_decisions: number;
}

export interface WorkflowImpactSignals {
  estimated_review_time_saved_distribution: Record<string, number>;
  cases_with_missing_critical_information: number;
  conflicts_detected: number;
  emergency_overrides_applied: number;
  routine_cases_not_escalated: number;
  human_review_required_cases: number;
}

export interface SessionMetrics {
  cases_processed: number;
  cases_sent_to_reviewer: number;
  cases_reviewed: number;
  pending_review: number;
  audit_exports_available: number;
  agreement_rate: number | null;
  average_usefulness_score: number | null;
  average_estimated_time_saved_label: string | null;
  useful_before_consultation_rate: number | null;
  emergency_routes: number;
  urgent_routes: number;
  routine_routes: number;
  needs_more_info_routes: number;
  conflict_routes: number;
  route_distribution: RouteDistribution;
  ai_intake: AIIntakeMetrics;
  governance: GovernanceMetrics;
  workflow: WorkflowImpactSignals;
}
