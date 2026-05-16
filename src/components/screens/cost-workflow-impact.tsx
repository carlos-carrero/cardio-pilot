"use client";

import { SectionLabel } from "@/components/ui/section-label";
import { CardPanel } from "@/components/ui/card-panel";
import { DarkPanel } from "@/components/ui/dark-panel";
import { useTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n/en";
import type { SessionMetrics } from "@/types";

interface CostWorkflowImpactDashboardProps {
  metrics: SessionMetrics;
}

function formatRate(value: number | null): string {
  return value === null ? "—" : `${Math.round(value * 100)}%`;
}

export function CostWorkflowImpactDashboard({ metrics }: CostWorkflowImpactDashboardProps) {
  const { t } = useTranslation();
  const hasReviewedCases = metrics.cases_reviewed > 0;
  const u = t("costWorkflowImpact.unit_cases");
  const allImpactCategories: { titleKey: TranslationKey; signals: { labelKey: TranslationKey; value: string }[] }[] = [
    {
      titleKey: "costWorkflowImpact.cat_fragmentation",
      signals: [
        { labelKey: "costWorkflowImpact.frag_missing", value: `${metrics.workflow.cases_with_missing_critical_information} ${u}` },
        { labelKey: "costWorkflowImpact.frag_conflicts_blocked", value: `${metrics.workflow.conflicts_detected} ${u}` },
        { labelKey: "costWorkflowImpact.frag_reconciliation", value: `${metrics.workflow.conflicts_detected} ${u}` },
        { labelKey: "costWorkflowImpact.frag_trace", value: `${metrics.governance.reports_with_trace} / ${metrics.cases_processed}` },
      ],
    },
    {
      titleKey: "costWorkflowImpact.cat_escalation",
      signals: [
        { labelKey: "costWorkflowImpact.esc_emergency", value: `${metrics.workflow.emergency_overrides_applied} ${u}` },
        { labelKey: "costWorkflowImpact.esc_urgent", value: `${metrics.urgent_routes} ${u}` },
        { labelKey: "costWorkflowImpact.esc_routine", value: `${metrics.workflow.routine_cases_not_escalated} ${u}` },
        { labelKey: "costWorkflowImpact.esc_withheld", value: `${metrics.needs_more_info_routes} ${u}` },
      ],
    },
    {
      titleKey: "costWorkflowImpact.cat_review",
      signals: [
        { labelKey: "costWorkflowImpact.rev_time_saved", value: metrics.average_estimated_time_saved_label ?? "—" },
        { labelKey: "costWorkflowImpact.rev_prepared", value: `${metrics.cases_reviewed} / ${metrics.cases_sent_to_reviewer}` },
        { labelKey: "costWorkflowImpact.rev_human_corrected", value: `${metrics.ai_intake.cases_with_human_edits} ${u}` },
        { labelKey: "costWorkflowImpact.rev_agreement", value: formatRate(metrics.agreement_rate) },
      ],
    },
    {
      titleKey: "costWorkflowImpact.cat_governance",
      signals: [
        { labelKey: "costWorkflowImpact.gov_engine", value: `${metrics.governance.reports_with_engine_version} / ${metrics.cases_processed}` },
        { labelKey: "costWorkflowImpact.gov_ruleset", value: `${metrics.governance.reports_with_ruleset_version} / ${metrics.cases_processed}` },
        { labelKey: "costWorkflowImpact.gov_policy", value: `${metrics.governance.reports_with_policy_version} / ${metrics.cases_processed}` },
        { labelKey: "costWorkflowImpact.gov_rules", value: `${metrics.governance.reports_with_activated_rules} / ${metrics.cases_processed}` },
      ],
    },
  ];
  const timeSavedDistribution: { labelKey: TranslationKey; value: number }[] = [
    { labelKey: "costWorkflowImpact.time_0", value: metrics.workflow.estimated_review_time_saved_distribution["0_minutes"] ?? 0 },
    { labelKey: "costWorkflowImpact.time_1_2", value: metrics.workflow.estimated_review_time_saved_distribution["1_2_minutes"] ?? 0 },
    { labelKey: "costWorkflowImpact.time_3_5", value: metrics.workflow.estimated_review_time_saved_distribution["3_5_minutes"] ?? 0 },
    { labelKey: "costWorkflowImpact.time_5_plus", value: metrics.workflow.estimated_review_time_saved_distribution["5_plus_minutes"] ?? 0 },
  ];
  return (
    <section className="mx-auto max-w-[1360px] px-6 py-10 lg:py-14">
      <SectionLabel>{t("costWorkflowImpact.section_label")}</SectionLabel>
      <h2 className="mt-3 font-sans text-heading-lg font-semibold leading-tight tracking-tighter text-ink">
        {t("costWorkflowImpact.heading")}
      </h2>
      <p className="mt-3 max-w-[620px] text-body leading-relaxed text-ink-secondary">
        {t("costWorkflowImpact.subtitle")}
      </p>

      {/* Important caveat */}
      <div className="mt-5 rounded-card border border-rule-light/80 bg-surface px-4 py-3">
        <p className="text-body-sm leading-relaxed text-ink-secondary">
          <span className="font-semibold text-ink">{t("costWorkflowImpact.caveat_important")}</span>{" "}
          {t("costWorkflowImpact.caveat_body")}
        </p>
      </div>

      {metrics.cases_processed === 0 && (
        <div className="mt-6 rounded-card border border-rule-light bg-warm-white shadow-card p-6">
          <p className="text-body font-medium text-ink-secondary">
            {t("costWorkflowImpact.empty_heading")}
          </p>
          <p className="mt-1 text-caption text-muted">
            {t("costWorkflowImpact.empty_hint")}
          </p>
        </div>
      )}

      {/* Why these signals matter */}
      <div className="mt-8 rounded-card border border-rule-light bg-warm-white shadow-card p-5 sm:p-6">
        <h3 className="mb-2 font-mono text-label font-medium uppercase tracking-label text-ink-secondary">
          {t("costWorkflowImpact.why_heading")}
        </h3>
        <p className="max-w-[640px] text-body leading-relaxed text-ink-secondary">
          {t("costWorkflowImpact.why_body")}
        </p>
      </div>

      {/* Two-column layout */}
      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
        {/* Left: Signal categories */}
        <div className="space-y-6">
          {allImpactCategories.map((cat) => (
            <CardPanel key={cat.titleKey}>
              <h3 className="mb-3 font-mono text-label font-medium uppercase tracking-label text-ink-secondary">
                {t(cat.titleKey)}
              </h3>
              <div className="space-y-2">
                {cat.signals.map((s) => (
                  <div
                    key={s.labelKey}
                    className="flex items-baseline justify-between gap-4 border-b border-rule-light/40 pb-2 last:border-b-0 last:pb-0"
                  >
                    <span className="text-body-sm text-ink-secondary">{t(s.labelKey)}</span>
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
              {t("costWorkflowImpact.model_title")}
            </p>
            <div className="mt-4 space-y-3">
              <div className="flex justify-between text-body-sm">
                <span className="text-ink-secondary">{t("costWorkflowImpact.model_cases_reviewed")}</span>
                <span className="font-mono font-medium text-ink">{metrics.cases_reviewed}</span>
              </div>
              <div className="flex justify-between text-body-sm">
                <span className="text-ink-secondary">{t("costWorkflowImpact.model_time_per_case")}</span>
                <span className="font-mono font-medium text-ink">{metrics.average_estimated_time_saved_label ?? "—"}</span>
              </div>
              <div className="border-t border-rule-light pt-3">
                <div className="flex justify-between text-body-sm">
                  <span className="font-medium text-ink">{t("costWorkflowImpact.model_reviewed_feedback")}</span>
                  <span className="font-mono text-body-lg font-bold text-accent">{metrics.cases_reviewed}</span>
                </div>
              </div>
            </div>

            {/* Formula */}
            <div className="mt-4 rounded-lg border border-rule-light bg-surface p-3">
              <p className="font-mono text-label leading-relaxed text-muted">
                {t("costWorkflowImpact.model_formula")}
              </p>
            </div>

            <p className="mt-3 text-caption text-muted">
              {t("costWorkflowImpact.model_caption")}
            </p>
          </div>

          {/* Cost-avoidance evidence layer — dark */}
          <DarkPanel>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span className="font-mono text-eyebrow font-medium uppercase tracking-eyebrow text-authority-text/40">
                {t("costWorkflowImpact.evidence_title")}
              </span>
            </div>
            <div className="space-y-2.5 font-mono text-meta text-authority-text/70">
              <div className="flex justify-between">
                <span>{t("costWorkflowImpact.evidence_routine")}</span>
                <span className="text-authority-text/90">{metrics.workflow.routine_cases_not_escalated} {u}</span>
              </div>
              <div className="flex justify-between">
                <span>{t("costWorkflowImpact.evidence_needs_info")}</span>
                <span className="text-authority-text/90">{metrics.needs_more_info_routes} {u}</span>
              </div>
              <div className="flex justify-between">
                <span>{t("costWorkflowImpact.evidence_conflicts")}</span>
                <span className="text-authority-text/90">{metrics.workflow.conflicts_detected} {u}</span>
              </div>
              <div className="flex justify-between">
                <span>{t("costWorkflowImpact.evidence_audit")}</span>
                <span className="text-authority-text/90">{metrics.governance.reports_with_trace} / {metrics.cases_processed}</span>
              </div>
            </div>
          </DarkPanel>

          <div className="rounded-card border border-rule-light/80 bg-warm-white shadow-card p-5">
            <p className="font-mono text-eyebrow font-medium uppercase tracking-eyebrow text-muted">
              {t("costWorkflowImpact.time_title")}
            </p>
            {!hasReviewedCases && (
              <p className="mt-2 text-meta leading-relaxed text-muted">
                {t("costWorkflowImpact.time_empty")}
              </p>
            )}
            <div className="mt-3 space-y-2">
              {timeSavedDistribution.map((item) => (
                <div key={item.labelKey} className="flex justify-between text-body-sm">
                  <span className="text-ink-secondary">{t(item.labelKey)}</span>
                  <span className="font-mono font-medium text-ink">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* What we don't claim */}
          <div className="rounded-card border border-rule-light/80 bg-warm-white shadow-card p-5">
            <p className="font-mono text-eyebrow font-medium uppercase tracking-eyebrow text-muted">
              {t("costWorkflowImpact.noclaim_title")}
            </p>
            <ul className="mt-3 space-y-1.5 text-body-sm text-muted">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 block h-1 w-1 shrink-0 rounded-full bg-muted/40" />
                {t("costWorkflowImpact.noclaim_dollars")}
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 block h-1 w-1 shrink-0 rounded-full bg-muted/40" />
                {t("costWorkflowImpact.noclaim_pct")}
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 block h-1 w-1 shrink-0 rounded-full bg-muted/40" />
                {t("costWorkflowImpact.noclaim_hospital")}
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 block h-1 w-1 shrink-0 rounded-full bg-muted/40" />
                {t("costWorkflowImpact.noclaim_government")}
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 block h-1 w-1 shrink-0 rounded-full bg-muted/40" />
                {t("costWorkflowImpact.noclaim_clinical")}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom disclaimer */}
      <div className="mt-10 border-t border-rule-light pt-4">
        <p className="max-w-[560px] text-meta leading-relaxed text-muted">
          {t("costWorkflowImpact.disclaimer")}
        </p>
      </div>
    </section>
  );
}
