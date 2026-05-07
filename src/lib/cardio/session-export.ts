import type {
  CardioPilotSessionSummary,
  PilotCase,
  ReviewerQueueItem,
  SessionMetrics,
} from "@/types";
import { getRouteLabel, getStatusLabel } from "./report-helpers";

function makeSessionId(): string {
  return `session-${new Date().toISOString().replace(/[:.]/g, "-")}`;
}

function fmtRate(value: number | null): string {
  return value === null ? "—" : `${Math.round(value * 100)}%`;
}

function fmtScore(value: number | null): string {
  return value === null ? "—" : `${value.toFixed(1)} / 5`;
}

function downloadTextFile(filename: string, content: string, type: string): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function buildSessionSummary(
  completedCases: PilotCase[],
  reviewerQueue: ReviewerQueueItem[],
  metrics: SessionMetrics,
): CardioPilotSessionSummary {
  const exportedAt = new Date().toISOString();
  const queueByCaseId = new Map(reviewerQueue.map((item) => [item.case_id, item]));

  return {
    session_id: makeSessionId(),
    created_at: completedCases[0]?.created_at ?? exportedAt,
    exported_at: exportedAt,
    pilot_mode: "local_browser_session",
    summary_scope: "local_session_only",
    completed_cases_count: completedCases.length,
    reviewer_queue_count: reviewerQueue.length,
    reviewed_cases_count: metrics.cases_reviewed,
    metrics,
    workflow_impact_signals: metrics.workflow,
    route_distribution: metrics.route_distribution,
    ai_intake_metrics: metrics.ai_intake,
    governance_metrics: metrics.governance,
    reviewer_metrics: {
      cases_sent_to_reviewer: metrics.cases_sent_to_reviewer,
      cases_reviewed: metrics.cases_reviewed,
      pending_review: metrics.pending_review,
      agreement_rate: metrics.agreement_rate,
      average_usefulness_score: metrics.average_usefulness_score,
      average_estimated_time_saved_label: metrics.average_estimated_time_saved_label,
      useful_before_consultation_rate: metrics.useful_before_consultation_rate,
    },
    case_summaries: completedCases.map((pilotCase) => {
      const review = queueByCaseId.get(pilotCase.case_id);
      return {
        case_id: pilotCase.case_id,
        route: pilotCase.engine_report?.decision.path ?? null,
        decision_status: pilotCase.engine_report?.decision.status ?? null,
        extraction_source: pilotCase.extraction?.extraction_source ?? "unknown",
        routing_source: pilotCase.report_source ?? "unknown",
        human_edits_count: pilotCase.humanCorrection?.fieldsEdited ?? 0,
        review_status: review?.review_status ?? "not_sent",
        agreement: review?.feedback?.route_appropriate,
        usefulness_score: review?.feedback?.usefulness,
        audit_export_available: !!pilotCase.engine_report,
        no_diagnosis_generated: true,
        no_prescription_generated: true,
      };
    }),
    safety_assertions: {
      autonomous_diagnosis_events: 0,
      autonomous_prescription_events: 0,
      ai_route_decisions: 0,
      physician_review_required: true,
    },
    disclaimers: [
      "This is a local demo-session summary. It is not persisted.",
      "This summary does not claim clinical validation, clinical outcome improvement, or realized cost reduction.",
      "Soficca does not diagnose, prescribe, or replace clinical judgment.",
      "AI structures the signal. Human confirms or corrects. Soficca governs the route. Physicians make the final decision.",
    ],
  };
}

export function buildSessionSummaryMarkdown(summary: CardioPilotSessionSummary): string {
  const L: string[] = [];
  const push = (...lines: string[]) => L.push(...lines, "");
  const m = summary.metrics;

  push(
    "# Soficca Cardio Pilot — Local Session Summary",
    "",
    "## Session",
    `- **Session ID:** ${summary.session_id}`,
    `- **Exported:** ${summary.exported_at}`,
    "- **Scope:** Local session only",
    `- **Pilot mode:** ${summary.pilot_mode}`,
  );

  push(
    "## Important disclaimer",
    "This is a local demo-session summary. It does not claim clinical validation, clinical outcome improvement, or realized cost reduction. Soficca does not diagnose, prescribe, or replace clinical judgment.",
  );

  push(
    "## Executive summary",
    `- **Cases processed:** ${m.cases_processed}`,
    `- **Cases sent to reviewer:** ${m.cases_sent_to_reviewer}`,
    `- **Cases reviewed:** ${m.cases_reviewed}`,
    `- **Agreement rate:** ${fmtRate(m.agreement_rate)}`,
    `- **Average usefulness:** ${fmtScore(m.average_usefulness_score)}`,
    `- **Estimated review-time saved:** ${m.average_estimated_time_saved_label ?? "—"}`,
    `- **Audit exports available:** ${m.audit_exports_available}`,
    `- **Autonomous diagnosis events:** ${m.governance.autonomous_diagnosis_events}`,
    `- **Autonomous prescription events:** ${m.governance.autonomous_prescription_events}`,
    `- **AI route decisions:** ${m.governance.ai_route_decisions}`,
  );

  push(
    "## Route distribution",
    `- **Emergency:** ${m.route_distribution.emergency}`,
    `- **Same-day urgent:** ${m.route_distribution.urgent}`,
    `- **Routine:** ${m.route_distribution.routine}`,
    `- **Needs more info:** ${m.route_distribution.needs_more_info}`,
    `- **Conflict:** ${m.route_distribution.conflict}`,
  );

  push(
    "## AI / intake metrics",
    `- **Real AI extractions:** ${m.ai_intake.real_ai_extractions}`,
    `- **Mock extraction fallbacks:** ${m.ai_intake.mock_extraction_fallbacks}`,
    `- **Human-corrected cases:** ${m.ai_intake.cases_with_human_edits}`,
    `- **Total edited fields:** ${m.ai_intake.total_human_edited_fields}`,
    `- **Missing information surfaced:** ${m.ai_intake.cases_with_missing_information}`,
    `- **Completion questions generated:** ${m.ai_intake.cases_with_completion_questions}`,
    `- **Quality flags:** ${m.ai_intake.cases_with_quality_flags}`,
    `- **PII warnings:** ${m.ai_intake.cases_with_pii_warnings}`,
  );

  push(
    "## Reviewer feedback",
    `- **Reviewed cases:** ${m.cases_reviewed}`,
    `- **Agreement rate:** ${fmtRate(m.agreement_rate)}`,
    `- **Average usefulness:** ${fmtScore(m.average_usefulness_score)}`,
    `- **Useful before consultation rate:** ${fmtRate(m.useful_before_consultation_rate)}`,
    "- **Estimated review-time saved distribution:**",
    `  - 0 minutes: ${m.workflow.estimated_review_time_saved_distribution["0_minutes"] ?? 0}`,
    `  - 1–2 minutes: ${m.workflow.estimated_review_time_saved_distribution["1_2_minutes"] ?? 0}`,
    `  - 3–5 minutes: ${m.workflow.estimated_review_time_saved_distribution["3_5_minutes"] ?? 0}`,
    `  - 5+ minutes: ${m.workflow.estimated_review_time_saved_distribution["5_plus_minutes"] ?? 0}`,
  );

  if (m.cases_reviewed === 0) {
    push("Reviewer feedback not yet available.");
  }

  push(
    "## Workflow impact signals",
    `- **Missing critical information surfaced:** ${m.workflow.cases_with_missing_critical_information}`,
    `- **Conflicts detected:** ${m.workflow.conflicts_detected}`,
    `- **Emergency overrides applied:** ${m.workflow.emergency_overrides_applied}`,
    `- **Routine cases not escalated:** ${m.workflow.routine_cases_not_escalated}`,
    `- **Human review required cases:** ${m.workflow.human_review_required_cases}`,
    `- **Reports with full trace:** ${m.governance.reports_with_trace}`,
    "",
    "**Caveat:** This pilot does not claim realized cost reduction. It measures operational signals associated with cost avoidance.",
  );

  push(
    "## Governance / audit",
    `- **Reports with trace:** ${m.governance.reports_with_trace}`,
    `- **Reports with policy version:** ${m.governance.reports_with_policy_version}`,
    `- **Reports with ruleset version:** ${m.governance.reports_with_ruleset_version}`,
    `- **Reports with engine version:** ${m.governance.reports_with_engine_version}`,
    `- **Reports with activated rules:** ${m.governance.reports_with_activated_rules}`,
    "- **No autonomous diagnosis:** Yes",
    "- **No autonomous prescription:** Yes",
    "- **AI did not decide route:** Yes",
  );

  push("## Case summaries");
  if (summary.case_summaries.length === 0) {
    push("No completed cases in this local session.");
  } else {
    for (const c of summary.case_summaries) {
      push(
        `### ${c.case_id}`,
        `- **Case ID:** ${c.case_id}`,
        `- **Route:** ${getRouteLabel(c.route)}`,
        `- **Decision status:** ${c.decision_status ? getStatusLabel(c.decision_status) : "Unavailable"}`,
        `- **Extraction source:** ${c.extraction_source}`,
        `- **Routing source:** ${c.routing_source}`,
        `- **Human edits:** ${c.human_edits_count}`,
        `- **Review status:** ${c.review_status}`,
        `- **Reviewer agreement:** ${c.agreement ?? "Not available"}`,
        `- **Usefulness score:** ${c.usefulness_score ?? "Not available"}`,
        `- **Audit export available:** ${c.audit_export_available ? "Yes" : "No"}`,
        "- **No diagnosis/prescription assertion:** Yes",
      );
    }
  }

  push(
    "## Next recommended step",
    "Local session complete. Next step: database persistence or controlled physician pilot.",
    "",
    "---",
    "",
    "*Local export only. No session data is persisted in Stage 2B.8.*",
    "*AI structures the signal. Human confirms or corrects. Soficca governs the route. Physicians make the final decision.*",
  );

  return L.join("\n");
}

export function downloadSessionSummaryJson(summary: CardioPilotSessionSummary): void {
  downloadTextFile(
    `soficca-cardio-session-summary-${summary.session_id}.json`,
    JSON.stringify(summary, null, 2),
    "application/json",
  );
}

export function downloadSessionSummaryMarkdown(summary: CardioPilotSessionSummary): void {
  downloadTextFile(
    `soficca-cardio-session-summary-${summary.session_id}.md`,
    buildSessionSummaryMarkdown(summary),
    "text/markdown",
  );
}
