// ── Reviewer queue types (local session, no backend persistence) ─

import type { PilotCase } from "./case";

export type ReviewerReviewStatus = "pending_review" | "reviewed";

export type ReviewerAgreement = "agree" | "partially_agree" | "disagree";

export type ReviewerMissingInfoResponse = "yes" | "partially" | "no" | "not_applicable";

export type ReviewerFlagIssue = "no" | "missing_flag" | "incorrect_flag" | "unsure";

export type ReviewerTimeSaved = "0_minutes" | "1_2_minutes" | "3_5_minutes" | "5_plus_minutes";

export type ReviewerUsefulBefore = "yes" | "maybe" | "no";

export interface ReviewerFeedback {
  route_appropriate: ReviewerAgreement;
  usefulness: number;
  missing_info_surfaced: ReviewerMissingInfoResponse;
  safety_flags_issue: ReviewerFlagIssue;
  estimated_time_saved: ReviewerTimeSaved;
  useful_before_consultation: ReviewerUsefulBefore;
  comments: string;
  submitted_at: string;
}

export interface ReviewerQueueItem {
  case_id: string;
  created_at: string;
  route: string | null;
  route_label: string;
  chief_complaint: string;
  safety_flags_count: number;
  missing_fields_count: number;
  extraction_source: string;
  routing_source: string;
  human_edits_count: number;
  review_status: ReviewerReviewStatus;
  feedback: ReviewerFeedback | null;
  pilotCase: PilotCase;
  persisted?: boolean;
  persistence_status?: "saved" | "not_saved";
}

export interface ReviewerMetrics {
  total_in_queue: number;
  pending_review: number;
  reviewed: number;
  agreement_rate: number | null;
  average_usefulness: number | null;
  average_time_saved: string | null;
  emergency_routes_reviewed: number;
  cases_with_human_edits: number;
  audit_exports_available: number;
}
