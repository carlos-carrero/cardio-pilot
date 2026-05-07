// ── Reviewer queue helpers (local session, no backend) ──────────

import type {
  PilotCase,
  ReviewerQueueItem,
  ReviewerFeedback,
  ReviewerMetrics,
  ReviewerReviewStatus,
} from "@/types";
import { getRouteLabel } from "./report-helpers";

// ── Build queue item from a completed PilotCase ─────────────────

export function buildQueueItem(pilotCase: PilotCase): ReviewerQueueItem {
  const report = pilotCase.engine_report;
  const route = report?.decision?.path ?? null;
  const routeLabel = route ? getRouteLabel(route) : "Unknown";
  const chiefComplaint = pilotCase.free_text_input.slice(0, 120) + (pilotCase.free_text_input.length > 120 ? "..." : "");
  const safetyFlags = report?.safety?.flags?.length ?? 0;
  const missingFields = report?.decision?.missing_fields?.length ?? 0;
  const humanEdits = pilotCase.humanCorrection?.fieldsEdited ?? 0;
  const extractionSource = pilotCase.extraction?.extraction_source ?? (pilotCase.report_source === "mock_fallback" ? "mock" : "ai");
  const routingSource = pilotCase.report_source ?? "unknown";

  return {
    case_id: pilotCase.case_id,
    created_at: pilotCase.created_at,
    route,
    route_label: routeLabel,
    chief_complaint: chiefComplaint,
    safety_flags_count: safetyFlags,
    missing_fields_count: missingFields,
    extraction_source: extractionSource,
    routing_source: routingSource,
    human_edits_count: humanEdits,
    review_status: "pending_review",
    feedback: null,
    pilotCase,
  };
}

// ── Add case to queue (no duplicates) ───────────────────────────

export function addCaseToQueue(
  queue: ReviewerQueueItem[],
  pilotCase: PilotCase,
): ReviewerQueueItem[] {
  if (queue.some((q) => q.case_id === pilotCase.case_id)) {
    return queue;
  }
  return [...queue, buildQueueItem(pilotCase)];
}

// ── Check if case is already queued ─────────────────────────────

export function isCaseInQueue(queue: ReviewerQueueItem[], caseId: string): boolean {
  return queue.some((q) => q.case_id === caseId);
}

// ── Update feedback on a queue item ─────────────────────────────

export function updateQueueFeedback(
  queue: ReviewerQueueItem[],
  caseId: string,
  feedback: ReviewerFeedback,
): ReviewerQueueItem[] {
  return queue.map((q) =>
    q.case_id === caseId
      ? { ...q, review_status: "reviewed" as ReviewerReviewStatus, feedback }
      : q,
  );
}

// ── Compute reviewer metrics ────────────────────────────────────

const TIME_SAVED_MAP: Record<string, number> = {
  "0_minutes": 0,
  "1_2_minutes": 1.5,
  "3_5_minutes": 4,
  "5_plus_minutes": 6,
};

export function getReviewerMetrics(queue: ReviewerQueueItem[]): ReviewerMetrics {
  const reviewed = queue.filter((q) => q.review_status === "reviewed");
  const pending = queue.filter((q) => q.review_status === "pending_review");

  const agreements = reviewed.filter((q) => q.feedback?.route_appropriate === "agree").length;
  const agreementRate = reviewed.length > 0 ? agreements / reviewed.length : null;

  const usefulnessScores = reviewed.map((q) => q.feedback?.usefulness ?? 0).filter((v) => v > 0);
  const avgUsefulness = usefulnessScores.length > 0
    ? usefulnessScores.reduce((a, b) => a + b, 0) / usefulnessScores.length
    : null;

  const timeSavedValues = reviewed
    .map((q) => TIME_SAVED_MAP[q.feedback?.estimated_time_saved ?? ""] ?? null)
    .filter((v): v is number => v !== null);
  const avgTimeSaved = timeSavedValues.length > 0
    ? timeSavedValues.reduce((a, b) => a + b, 0) / timeSavedValues.length
    : null;
  const avgTimeSavedLabel = avgTimeSaved !== null ? `~${avgTimeSaved.toFixed(1)} min` : null;

  const emergencyReviewed = reviewed.filter((q) =>
    q.route?.includes("EMERGENCY") || q.route_label.toLowerCase().includes("emergency"),
  ).length;

  const withHumanEdits = queue.filter((q) => q.human_edits_count > 0).length;
  const auditExportsAvailable = queue.filter((q) => q.pilotCase.engine_report !== null).length;

  return {
    total_in_queue: queue.length,
    pending_review: pending.length,
    reviewed: reviewed.length,
    agreement_rate: agreementRate,
    average_usefulness: avgUsefulness,
    average_time_saved: avgTimeSavedLabel,
    emergency_routes_reviewed: emergencyReviewed,
    cases_with_human_edits: withHumanEdits,
    audit_exports_available: auditExportsAvailable,
  };
}
