"use client";

import { SectionLabel } from "@/components/ui/section-label";
import { CardPanel } from "@/components/ui/card-panel";
import { DarkPanel } from "@/components/ui/dark-panel";
import type { SessionMetrics } from "@/types";

interface CostWorkflowImpactDashboardProps {
  metrics: SessionMetrics;
}

function formatRate(value: number | null): string {
  return value === null ? "—" : `${Math.round(value * 100)}%`;
}

export function CostWorkflowImpactDashboard({ metrics }: CostWorkflowImpactDashboardProps) {
  const hasReviewedCases = metrics.cases_reviewed > 0;
  const allImpactCategories = [
    {
      title: "Fragmentation signals",
      signals: [
        { label: "Missing critical information surfaced", value: `${metrics.workflow.cases_with_missing_critical_information} cases` },
        { label: "Conflicting cases blocked before routing", value: `${metrics.workflow.conflicts_detected} cases` },
        { label: "Cases requiring reconciliation", value: `${metrics.workflow.conflicts_detected} cases` },
        { label: "Reports with complete trace", value: `${metrics.governance.reports_with_trace} / ${metrics.cases_processed}` },
      ],
    },
    {
      title: "Escalation efficiency",
      signals: [
        { label: "Emergency overrides applied", value: `${metrics.workflow.emergency_overrides_applied} cases` },
        { label: "Same-day urgent cases identified", value: `${metrics.urgent_routes} cases` },
        { label: "Routine cases not unnecessarily escalated", value: `${metrics.workflow.routine_cases_not_escalated} cases` },
        { label: "Needs-more-info cases withheld from unsafe classification", value: `${metrics.needs_more_info_routes} cases` },
      ],
    },
    {
      title: "Review efficiency",
      signals: [
        { label: "Estimated review-time saved", value: metrics.average_estimated_time_saved_label ?? "—" },
        { label: "Cases prepared before consultation", value: `${metrics.cases_reviewed} / ${metrics.cases_sent_to_reviewer}` },
        { label: "Cases with human-corrected extraction", value: `${metrics.ai_intake.cases_with_human_edits} cases` },
        { label: "Reviewer agreement rate", value: formatRate(metrics.agreement_rate) },
      ],
    },
    {
      title: "Governance / audit",
      signals: [
        { label: "Reports with engine version", value: `${metrics.governance.reports_with_engine_version} / ${metrics.cases_processed}` },
        { label: "Reports with ruleset version", value: `${metrics.governance.reports_with_ruleset_version} / ${metrics.cases_processed}` },
        { label: "Reports with safety policy version", value: `${metrics.governance.reports_with_policy_version} / ${metrics.cases_processed}` },
        { label: "Reports with activated rules", value: `${metrics.governance.reports_with_activated_rules} / ${metrics.cases_processed}` },
      ],
    },
  ];
  const timeSavedDistribution = [
    { label: "0 minutes", value: metrics.workflow.estimated_review_time_saved_distribution["0_minutes"] ?? 0 },
    { label: "1–2 minutes", value: metrics.workflow.estimated_review_time_saved_distribution["1_2_minutes"] ?? 0 },
    { label: "3–5 minutes", value: metrics.workflow.estimated_review_time_saved_distribution["3_5_minutes"] ?? 0 },
    { label: "5+ minutes", value: metrics.workflow.estimated_review_time_saved_distribution["5_plus_minutes"] ?? 0 },
  ];
  return (
    <section className="mx-auto max-w-[1360px] px-6 py-10 lg:py-14">
      <SectionLabel>Operational Workflow Signals</SectionLabel>
      <h2 className="mt-3 font-sans text-heading-lg font-semibold leading-tight tracking-tighter text-ink">
        Operational indicators for clinical review efficiency
      </h2>
      <p className="mt-3 max-w-[620px] text-body leading-relaxed text-ink-secondary">
        Operational indicators related to fragmentation, routing safety, and clinical review workflow.
      </p>

      {/* Important caveat */}
      <div className="mt-5 rounded-card border border-rule-light/80 bg-surface px-4 py-3">
        <p className="text-body-sm leading-relaxed text-ink-secondary">
          <span className="font-semibold text-ink">Important:</span> This pilot
          does not claim realized cost reduction. It reports operational signals
          that may inform workflow review.
        </p>
      </div>

      {metrics.cases_processed === 0 && (
        <div className="mt-6 rounded-card border border-rule-light bg-warm-white shadow-card p-6">
          <p className="text-body font-medium text-ink-secondary">
            Run and review cases to populate this section.
          </p>
          <p className="mt-1 text-caption text-muted">
            Local workflow signals appear after completed cases, reviewer sends, and reviewer feedback.
          </p>
        </div>
      )}

      {/* Why these signals matter */}
      <div className="mt-8 rounded-card border border-rule-light bg-warm-white shadow-card p-5 sm:p-6">
        <h3 className="mb-2 font-mono text-label font-medium uppercase tracking-label text-ink-secondary">
          Why These Signals Matter
        </h3>
        <p className="max-w-[640px] text-body leading-relaxed text-ink-secondary">
          Fragmented triage creates repeated intake, delayed escalation,
          unnecessary escalation, weak continuity, and limited auditability.
            These signals indicate where governed routing may reduce operational friction
            before, during, and after clinical review.
        </p>
      </div>

      {/* Two-column layout */}
      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
        {/* Left: Signal categories */}
        <div className="space-y-6">
          {allImpactCategories.map((cat) => (
            <CardPanel key={cat.title}>
              <h3 className="mb-3 font-mono text-label font-medium uppercase tracking-label text-ink-secondary">
                {cat.title}
              </h3>
              <div className="space-y-2">
                {cat.signals.map((s) => (
                  <div
                    key={s.label}
                    className="flex items-baseline justify-between gap-4 border-b border-rule-light/40 pb-2 last:border-b-0 last:pb-0"
                  >
                    <span className="text-body-sm text-ink-secondary">{s.label}</span>
                    <span className="shrink-0 font-mono text-body-sm font-medium text-ink">{s.value}</span>
                  </div>
                ))}
              </div>
            </CardPanel>
          ))}
        </div>

        {/* Right: Model + audit */}
        <div className="space-y-5">
          {/* Workflow model card */}
          <div className="rounded-card border border-rule-light/80 bg-warm-white shadow-card p-5">
            <p className="font-mono text-eyebrow font-medium uppercase tracking-eyebrow text-muted">
              Illustrative Workflow Signal Model
            </p>
            <div className="mt-4 space-y-3">
              <div className="flex justify-between text-body-sm">
                <span className="text-ink-secondary">Cases reviewed</span>
                <span className="font-mono font-medium text-ink">{metrics.cases_reviewed}</span>
              </div>
              <div className="flex justify-between text-body-sm">
                <span className="text-ink-secondary">Est. time saved / case</span>
                <span className="font-mono font-medium text-ink">{metrics.average_estimated_time_saved_label ?? "—"}</span>
              </div>
              <div className="border-t border-rule-light pt-3">
                <div className="flex justify-between text-body-sm">
                  <span className="font-medium text-ink">Reviewed cases with feedback</span>
                  <span className="font-mono text-body-lg font-bold text-accent">{metrics.cases_reviewed}</span>
                </div>
              </div>
            </div>

            {/* Formula */}
            <div className="mt-4 rounded-lg border border-rule-light bg-surface p-3">
              <p className="font-mono text-label leading-relaxed text-muted">
                Estimated workflow time signal = cases reviewed × reviewer-reported estimated minutes saved per case
              </p>
            </div>

            <p className="mt-3 text-caption text-muted">
              This is a workflow estimate, not a financial claim.
            </p>
          </div>

          {/* Cost-avoidance evidence layer — dark */}
          <DarkPanel>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span className="font-mono text-eyebrow font-medium uppercase tracking-eyebrow text-authority-text/40">
                Operational signal evidence layer
              </span>
            </div>
            <div className="space-y-2.5 font-mono text-meta text-authority-text/70">
              <div className="flex justify-between">
                <span>Routine cases not escalated</span>
                <span className="text-authority-text/90">{metrics.workflow.routine_cases_not_escalated} cases</span>
              </div>
              <div className="flex justify-between">
                <span>Needs-more-info routes</span>
                <span className="text-authority-text/90">{metrics.needs_more_info_routes} cases</span>
              </div>
              <div className="flex justify-between">
                <span>Conflicts detected</span>
                <span className="text-authority-text/90">{metrics.workflow.conflicts_detected} cases</span>
              </div>
              <div className="flex justify-between">
                <span>Reports with full audit trace</span>
                <span className="text-authority-text/90">{metrics.governance.reports_with_trace} / {metrics.cases_processed}</span>
              </div>
            </div>
          </DarkPanel>

          <div className="rounded-card border border-rule-light/80 bg-warm-white shadow-card p-5">
            <p className="font-mono text-eyebrow font-medium uppercase tracking-eyebrow text-muted">
              Reviewer-reported time-signal distribution
            </p>
            {!hasReviewedCases && (
              <p className="mt-2 text-meta leading-relaxed text-muted">
                Run and review cases to populate this section.
              </p>
            )}
            <div className="mt-3 space-y-2">
              {timeSavedDistribution.map((item) => (
                <div key={item.label} className="flex justify-between text-body-sm">
                  <span className="text-ink-secondary">{item.label}</span>
                  <span className="font-mono font-medium text-ink">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* What we don't claim */}
          <div className="rounded-card border border-rule-light/80 bg-warm-white shadow-card p-5">
            <p className="font-mono text-eyebrow font-medium uppercase tracking-eyebrow text-muted">
              What this pilot does not claim
            </p>
            <ul className="mt-3 space-y-1.5 text-body-sm text-muted">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 block h-1 w-1 shrink-0 rounded-full bg-muted/40" />
                Dollar amounts saved
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 block h-1 w-1 shrink-0 rounded-full bg-muted/40" />
                Percentage cost reduction
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 block h-1 w-1 shrink-0 rounded-full bg-muted/40" />
                Proven hospital savings
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 block h-1 w-1 shrink-0 rounded-full bg-muted/40" />
                Proven government savings
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 block h-1 w-1 shrink-0 rounded-full bg-muted/40" />
                Clinical outcome improvement
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom disclaimer */}
      <div className="mt-10 border-t border-rule-light pt-4">
        <p className="max-w-[560px] text-meta leading-relaxed text-muted">
          Soficca does not diagnose, prescribe, or replace clinical judgment.
          These current session signals do not claim realized cost reduction, clinical validation, or outcome improvement.
        </p>
      </div>
    </section>
  );
}
