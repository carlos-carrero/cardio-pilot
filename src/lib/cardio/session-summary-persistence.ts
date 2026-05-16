/**
 * Session summary persistence payload builder (Stage 3E.3).
 *
 * Maps local CardioPilotSessionSummary into backend SessionSummaryRequest shape.
 * Reuses buildSessionSummary() from session-export.ts.
 */

import type { PilotCase, ReviewerQueueItem, SessionMetrics } from "@/types";
import type { PersistSessionSummaryPayload } from "@/types";
import type { Language } from "@/i18n";
import { buildSessionSummary } from "./session-export";

export function buildPersistSessionSummaryPayload(
  completedCases: PilotCase[],
  reviewerQueue: ReviewerQueueItem[],
  metrics: SessionMetrics,
  locale?: Language,
): PersistSessionSummaryPayload {
  const summary = buildSessionSummary(completedCases, reviewerQueue, metrics);

  return {
    summary_id: summary.session_id,
    metrics_json: summary.metrics as unknown as Record<string, unknown>,
    route_distribution_json: summary.route_distribution as unknown as Record<string, unknown>,
    reviewer_metrics_json: summary.reviewer_metrics as unknown as Record<string, unknown>,
    workflow_impact_json: summary.workflow_impact_signals as unknown as Record<string, unknown>,
    governance_metrics_json: summary.governance_metrics as unknown as Record<string, unknown>,
    safety_assertions_json: summary.safety_assertions as unknown as Record<string, unknown>,
    case_summaries_json: summary.case_summaries as unknown[],
    ui_locale: locale ?? "en",
  };
}
