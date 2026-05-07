import type { ExampleCaseId } from "@/types";

export type ReviewStatus = "pending" | "reviewed";
export type ReviewerAgreement = "agree" | "partial" | "disagree" | "not_reviewed";

export interface ReviewerCase {
  case_id: string;
  example_id: ExampleCaseId;
  created_at: string;
  chief_complaint: string;
  route: string | null;
  route_label: string;
  status: string;
  safety_flags_count: number;
  missing_fields_count: number;
  review_status: ReviewStatus;
  reviewer_agreement: ReviewerAgreement;
}

export const reviewerCases: ReviewerCase[] = [
  {
    case_id: "CP-R1A4-X9KZ",
    example_id: "NEEDS_MORE_INFO",
    created_at: "2026-05-04T09:12:00Z",
    chief_complaint: "62-year-old with chest pain, incomplete clinical data",
    route: null,
    route_label: "Needs more information",
    status: "PENDING_DATA",
    safety_flags_count: 0,
    missing_fields_count: 4,
    review_status: "pending",
    reviewer_agreement: "not_reviewed",
  },
  {
    case_id: "CP-R1B7-M3TP",
    example_id: "ROUTINE_REVIEW",
    created_at: "2026-05-04T09:28:00Z",
    chief_complaint: "60-year-old with low-grade pressure-like chest pain, stable presentation",
    route: "PATH_ROUTINE",
    route_label: "Routine review",
    status: "TRIAGED",
    safety_flags_count: 0,
    missing_fields_count: 0,
    review_status: "reviewed",
    reviewer_agreement: "agree",
  },
  {
    case_id: "CP-R1C2-W8LP",
    example_id: "URGENT_ESCALATION",
    created_at: "2026-05-04T10:05:00Z",
    chief_complaint: "63-year-old with moderate pressure-like chest pain, jaw radiation, exertional",
    route: "PATH_URGENT_SAME_DAY",
    route_label: "Same-day urgent review",
    status: "TRIAGED",
    safety_flags_count: 0,
    missing_fields_count: 0,
    review_status: "reviewed",
    reviewer_agreement: "agree",
  },
  {
    case_id: "CP-R1D5-Q4NB",
    example_id: "EMERGENCY_ROUTE",
    created_at: "2026-05-04T10:32:00Z",
    chief_complaint: "64-year-old with severe chest pain, syncope, left arm radiation",
    route: "PATH_EMERGENCY_NOW",
    route_label: "Emergency red-flag",
    status: "TRIAGED",
    safety_flags_count: 1,
    missing_fields_count: 0,
    review_status: "reviewed",
    reviewer_agreement: "agree",
  },
  {
    case_id: "CP-R1E8-J6FH",
    example_id: "DEFERRED_PENDING_DATA",
    created_at: "2026-05-04T11:14:00Z",
    chief_complaint: "59-year-old with contradictory chest pain data requiring reconciliation",
    route: null,
    route_label: "Conflicting data",
    status: "PENDING_DATA",
    safety_flags_count: 0,
    missing_fields_count: 0,
    review_status: "pending",
    reviewer_agreement: "not_reviewed",
  },
];
