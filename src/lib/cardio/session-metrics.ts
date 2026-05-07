// ── Local session metrics helper ────────────────────────────────

import type { PilotCase, ReviewerQueueItem, SessionMetrics } from "@/types";

const TIME_SAVED_VALUES: Record<string, number> = {
  "0_minutes": 0,
  "1_2_minutes": 1.5,
  "3_5_minutes": 4,
  "5_plus_minutes": 6,
};

export function upsertCompletedCase(cases: PilotCase[], pilotCase: PilotCase): PilotCase[] {
  if (!pilotCase.extraction || !pilotCase.engine_report) return cases;

  const existingIndex = cases.findIndex((c) => c.case_id === pilotCase.case_id);
  if (existingIndex === -1) return [...cases, pilotCase];

  return cases.map((c) => (c.case_id === pilotCase.case_id ? pilotCase : c));
}

export function getSessionMetrics(
  completedCases: PilotCase[],
  reviewerQueue: ReviewerQueueItem[],
): SessionMetrics {
  const reviewedQueue = reviewerQueue.filter((q) => q.review_status === "reviewed");
  const pendingQueue = reviewerQueue.filter((q) => q.review_status === "pending_review");
  const agreements = reviewedQueue.filter((q) => q.feedback?.route_appropriate === "agree").length;
  const usefulnessScores = reviewedQueue
    .map((q) => q.feedback?.usefulness ?? 0)
    .filter((score) => score > 0);
  const usefulBefore = reviewedQueue.filter((q) => q.feedback?.useful_before_consultation === "yes").length;
  const timeSavedValues = reviewedQueue
    .map((q) => TIME_SAVED_VALUES[q.feedback?.estimated_time_saved ?? ""] ?? null)
    .filter((value): value is number => value !== null);

  const routeCounts = completedCases.reduce(
    (acc, c) => {
      const report = c.engine_report;
      const status = report?.decision.status;
      const path = report?.decision.path;
      const conflicts = report?.trace.conflicts_detected ?? [];

      if (status === "CONFLICT" || conflicts.length > 0) acc.conflict += 1;
      else if (status === "NEEDS_MORE_INFO" || path === "PATH_MORE_QUESTIONS") acc.needs_more_info += 1;
      else if (path === "PATH_EMERGENCY_NOW") acc.emergency += 1;
      else if (path === "PATH_URGENT_SAME_DAY") acc.urgent += 1;
      else if (path === "PATH_ROUTINE") acc.routine += 1;
      else acc.needs_more_info += 1;

      return acc;
    },
    { emergency: 0, urgent: 0, routine: 0, needs_more_info: 0, conflict: 0 },
  );

  const reportsWithTrace = completedCases.filter((c) => !!c.engine_report?.trace).length;
  const reportsWithPolicyVersion = completedCases.filter((c) => !!c.engine_report?.versions?.safety_policy).length;
  const reportsWithRulesetVersion = completedCases.filter((c) => !!c.engine_report?.versions?.ruleset).length;
  const reportsWithEngineVersion = completedCases.filter((c) => !!c.engine_report?.versions?.engine).length;
  const reportsWithActivatedRules = completedCases.filter((c) => (c.engine_report?.trace.activated_rules?.length ?? 0) > 0).length;

  const realAiExtractions = completedCases.filter((c) => c.extraction?.extraction_source === "ai").length;
  const mockExtractions = completedCases.filter((c) => c.extraction?.extraction_source === "mock").length;
  const casesWithHumanEdits = completedCases.filter((c) => (c.humanCorrection?.fieldsEdited ?? 0) > 0).length;
  const totalEditedFields = completedCases.reduce((sum, c) => sum + (c.humanCorrection?.fieldsEdited ?? 0), 0);
  const casesWithMissingInformation = completedCases.filter((c) => {
    const extractionMissing = (c.extraction?.missing_fields?.length ?? 0) > 0;
    const reportMissing = (c.engine_report?.decision.missing_fields?.length ?? 0) > 0;
    const structuredMissing = !!c.extraction?.missing_information && Object.values(c.extraction.missing_information).some((items) => items.length > 0);
    return extractionMissing || reportMissing || structuredMissing;
  }).length;
  const casesWithCompletionQuestions = completedCases.filter((c) => (c.extraction?.completion_questions?.length ?? 0) > 0).length;
  const casesWithQualityFlags = completedCases.filter((c) => (c.extraction?.extraction_quality_flags?.length ?? 0) > 0).length;
  const casesWithPiiWarnings = completedCases.filter((c) => (c.extraction?.pii_warnings?.length ?? 0) > 0).length;

  const missingCritical = completedCases.filter((c) =>
    c.extraction?.extraction_quality_flags?.includes("critical_missing_fields") ||
    (c.engine_report?.decision.missing_fields?.length ?? 0) > 0,
  ).length;
  const conflictsDetected = completedCases.filter((c) =>
    (c.extraction?.possible_conflicts?.length ?? 0) > 0 ||
    (c.engine_report?.trace.conflicts_detected?.length ?? 0) > 0,
  ).length;
  const emergencyOverrides = completedCases.filter((c) => c.engine_report?.safety.override_applied === true).length;
  const routineNotEscalated = completedCases.filter((c) =>
    c.engine_report?.decision.path === "PATH_ROUTINE" && c.engine_report?.safety.override_applied !== true,
  ).length;
  const humanReviewRequired = completedCases.filter((c) => !!c.engine_report).length;

  const timeSavedDistribution = reviewerQueue.reduce<Record<string, number>>((acc, q) => {
    const key = q.feedback?.estimated_time_saved ?? "not_reviewed";
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  const averageUsefulness = usefulnessScores.length > 0
    ? usefulnessScores.reduce((sum, score) => sum + score, 0) / usefulnessScores.length
    : null;
  const averageTimeSaved = timeSavedValues.length > 0
    ? timeSavedValues.reduce((sum, value) => sum + value, 0) / timeSavedValues.length
    : null;

  return {
    cases_processed: completedCases.length,
    cases_sent_to_reviewer: reviewerQueue.length,
    cases_reviewed: reviewedQueue.length,
    pending_review: pendingQueue.length,
    audit_exports_available: completedCases.filter((c) => !!c.engine_report).length,
    agreement_rate: reviewedQueue.length > 0 ? agreements / reviewedQueue.length : null,
    average_usefulness_score: averageUsefulness,
    average_estimated_time_saved_label: averageTimeSaved !== null ? `~${averageTimeSaved.toFixed(1)} min` : null,
    useful_before_consultation_rate: reviewedQueue.length > 0 ? usefulBefore / reviewedQueue.length : null,
    emergency_routes: routeCounts.emergency,
    urgent_routes: routeCounts.urgent,
    routine_routes: routeCounts.routine,
    needs_more_info_routes: routeCounts.needs_more_info,
    conflict_routes: routeCounts.conflict,
    route_distribution: routeCounts,
    ai_intake: {
      real_ai_extractions: realAiExtractions,
      mock_extraction_fallbacks: mockExtractions,
      cases_with_human_edits: casesWithHumanEdits,
      total_human_edited_fields: totalEditedFields,
      cases_with_missing_information: casesWithMissingInformation,
      cases_with_completion_questions: casesWithCompletionQuestions,
      cases_with_quality_flags: casesWithQualityFlags,
      cases_with_pii_warnings: casesWithPiiWarnings,
    },
    governance: {
      reports_with_trace: reportsWithTrace,
      reports_with_policy_version: reportsWithPolicyVersion,
      reports_with_ruleset_version: reportsWithRulesetVersion,
      reports_with_engine_version: reportsWithEngineVersion,
      reports_with_activated_rules: reportsWithActivatedRules,
      autonomous_diagnosis_events: 0,
      autonomous_prescription_events: 0,
      ai_route_decisions: 0,
    },
    workflow: {
      estimated_review_time_saved_distribution: timeSavedDistribution,
      cases_with_missing_critical_information: missingCritical,
      conflicts_detected: conflictsDetected,
      emergency_overrides_applied: emergencyOverrides,
      routine_cases_not_escalated: routineNotEscalated,
      human_review_required_cases: humanReviewRequired,
    },
  };
}
