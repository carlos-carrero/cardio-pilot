import type { PathId, DecisionStatus, ReportSource, SessionMetrics } from "@/types";
import type { ExtractionSource } from "./extraction";

export interface CardioPilotSessionCaseSummary {
  case_id: string;
  route: PathId | null;
  decision_status: DecisionStatus | null;
  extraction_source: ExtractionSource | "unknown";
  routing_source: ReportSource | "unknown";
  human_edits_count: number;
  review_status: "not_sent" | "pending_review" | "reviewed";
  agreement?: string;
  usefulness_score?: number;
  audit_export_available: boolean;
  no_diagnosis_generated: true;
  no_prescription_generated: true;
}

export interface CardioPilotSessionSafetyAssertions {
  autonomous_diagnosis_events: 0;
  autonomous_prescription_events: 0;
  ai_route_decisions: 0;
  physician_review_required: true;
}

export interface CardioPilotSessionSummary {
  session_id: string;
  created_at: string;
  exported_at: string;
  pilot_mode: string;
  summary_scope: "local_session_only";
  completed_cases_count: number;
  reviewer_queue_count: number;
  reviewed_cases_count: number;
  metrics: SessionMetrics;
  workflow_impact_signals: SessionMetrics["workflow"];
  route_distribution: SessionMetrics["route_distribution"];
  ai_intake_metrics: SessionMetrics["ai_intake"];
  governance_metrics: SessionMetrics["governance"];
  reviewer_metrics: {
    cases_sent_to_reviewer: number;
    cases_reviewed: number;
    pending_review: number;
    agreement_rate: number | null;
    average_usefulness_score: number | null;
    average_estimated_time_saved_label: string | null;
    useful_before_consultation_rate: number | null;
  };
  case_summaries: CardioPilotSessionCaseSummary[];
  safety_assertions: CardioPilotSessionSafetyAssertions;
  disclaimers: string[];
}
