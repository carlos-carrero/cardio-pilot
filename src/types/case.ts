import type { CardioExtraction, HumanCorrectionStatus } from "./extraction";
import type { CardioPayload, CardioReport } from "./cardio-report";

export type CaseStatus =
  | "pending_intake"
  | "pending_extraction"
  | "pending_routing"
  | "routed"
  | "reviewed"
  | "exported";

export type ExampleCaseId =
  | "NEEDS_MORE_INFO"
  | "ROUTINE_REVIEW"
  | "URGENT_ESCALATION"
  | "EMERGENCY_ROUTE"
  | "DEFERRED_PENDING_DATA";

export type ReportSource = "backend" | "mock_fallback";

export interface PilotCase {
  case_id: string;
  created_at: string;
  free_text_input: string;
  extraction: CardioExtraction | null;
  extraction_confirmed: boolean;
  engine_input: CardioPayload | null;
  engine_report: CardioReport | null;
  status: CaseStatus;
  report_source?: ReportSource;
  humanCorrection?: HumanCorrectionStatus;
}

export interface ExampleCase {
  id: ExampleCaseId;
  label: string;
  short_description: string;
  narrative: string;
  expectedRoute?: string;
  signalsPreview?: string[];
}
