"use client";

import { SectionLabel } from "@/components/ui/section-label";
import { CardPanel } from "@/components/ui/card-panel";
import { useTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n/en";

const SECTIONS: { titleKey: TranslationKey; itemKeys: TranslationKey[] }[] = [
  {
    titleKey: "pilotSummary.sec_demonstrates",
    itemKeys: [
      "pilotSummary.demo_intake",
      "pilotSummary.demo_extraction",
      "pilotSummary.demo_confirmed",
      "pilotSummary.demo_routing",
      "pilotSummary.demo_report",
      "pilotSummary.demo_feedback",
      "pilotSummary.demo_metrics",
      "pilotSummary.demo_audit",
      "pilotSummary.demo_persistence",
    ],
  },
  {
    titleKey: "pilotSummary.sec_governs",
    itemKeys: [
      "pilotSummary.gov_routing",
      "pilotSummary.gov_safety",
      "pilotSummary.gov_versioned",
      "pilotSummary.gov_missing",
      "pilotSummary.gov_conflict",
      "pilotSummary.gov_integrity",
    ],
  },
  {
    titleKey: "pilotSummary.sec_ai_does",
    itemKeys: [
      "pilotSummary.ai_structures",
      "pilotSummary.ai_evidence",
      "pilotSummary.ai_summarizes",
      "pilotSummary.ai_questions",
      "pilotSummary.ai_flags",
    ],
  },
  {
    titleKey: "pilotSummary.sec_ai_not",
    itemKeys: [
      "pilotSummary.ainot_diagnose",
      "pilotSummary.ainot_prescribe",
      "pilotSummary.ainot_route",
      "pilotSummary.ainot_replace",
    ],
  },
];

const READINESS_ITEMS: { labelKey: TranslationKey; status: "ready" | "next" | "scope" }[] = [
  { labelKey: "pilotSummary.rdy_routing_engine", status: "ready" },
  { labelKey: "pilotSummary.rdy_safety_policy", status: "ready" },
  { labelKey: "pilotSummary.rdy_ai_extraction", status: "ready" },
  { labelKey: "pilotSummary.rdy_backend_routing", status: "ready" },
  { labelKey: "pilotSummary.rdy_schema", status: "ready" },
  { labelKey: "pilotSummary.rdy_audit_trace", status: "ready" },
  { labelKey: "pilotSummary.rdy_feedback", status: "ready" },
  { labelKey: "pilotSummary.rdy_persistence", status: "ready" },
  { labelKey: "pilotSummary.rdy_persisted_feedback", status: "ready" },
  { labelKey: "pilotSummary.rdy_persisted_summaries", status: "ready" },
  { labelKey: "pilotSummary.rdy_metrics_dashboard", status: "ready" },
  { labelKey: "pilotSummary.rdy_audit_export", status: "ready" },
  { labelKey: "pilotSummary.rdy_demo_guide", status: "ready" },
  { labelKey: "pilotSummary.rdy_controlled_pilot", status: "next" },
  { labelKey: "pilotSummary.rdy_aggregated_metrics", status: "next" },
  { labelKey: "pilotSummary.rdy_auth", status: "next" },
  { labelKey: "pilotSummary.rdy_multisite", status: "scope" },
];

function statusColor(s: "ready" | "next" | "scope"): string {
  if (s === "ready") return "bg-routine";
  if (s === "next") return "bg-urgent";
  return "bg-muted/30";
}

function statusLabelKey(s: "ready" | "next" | "scope"): TranslationKey {
  if (s === "ready") return "pilotSummary.status_ready";
  if (s === "next") return "pilotSummary.status_next";
  return "pilotSummary.status_scope";
}

export function PilotSummary() {
  const { t } = useTranslation();
  return (
    <section className="mx-auto max-w-[1360px] px-6 py-10 lg:py-14">
      <SectionLabel>{t("pilotSummary.section_label")}</SectionLabel>
      <h2 className="mt-3 font-sans text-heading-lg font-semibold leading-tight tracking-tighter text-ink">
        {t("pilotSummary.heading")}
      </h2>
      <p className="mt-3 max-w-[640px] text-body leading-relaxed text-ink-secondary">
        {t("pilotSummary.subtitle")}
      </p>

      <div className="mt-4 flex items-center gap-2 rounded-lg border border-rule-light bg-surface px-3.5 py-2">
        <span className="h-1.5 w-1.5 rounded-full bg-routine" />
        <span className="font-mono text-label text-muted">
          {t("pilotSummary.banner")}
        </span>
      </div>

      {/* Section cards */}
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {SECTIONS.map((sec) => (
          <CardPanel key={sec.titleKey}>
            <h3 className="mb-3 font-mono text-label font-medium uppercase tracking-label text-ink-secondary">
              {t(sec.titleKey)}
            </h3>
            <ul className="space-y-2">
              {sec.itemKeys.map((key) => (
                <li key={key} className="flex items-start gap-2 text-body-sm leading-relaxed text-ink-secondary">
                  <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-accent/40" />
                  {t(key)}
                </li>
              ))}
            </ul>
          </CardPanel>
        ))}
      </div>

      {/* Current stage + next stage */}
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <CardPanel>
          <h3 className="mb-3 font-mono text-label font-medium uppercase tracking-label text-ink-secondary">
            {t("pilotSummary.current_stage")}
          </h3>
          <ul className="space-y-2">
            {([
              "pilotSummary.cur_backend" as TranslationKey,
              "pilotSummary.cur_ai" as TranslationKey,
              "pilotSummary.cur_routing" as TranslationKey,
              "pilotSummary.cur_reviewer" as TranslationKey,
              "pilotSummary.cur_summaries" as TranslationKey,
              "pilotSummary.cur_reset" as TranslationKey,
            ]).map((key) => (
              <li key={key} className="flex items-start gap-2 text-body-sm leading-relaxed text-ink-secondary">
                <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-routine" />
                {t(key)}
              </li>
            ))}
          </ul>
        </CardPanel>
        <CardPanel>
          <h3 className="mb-3 font-mono text-label font-medium uppercase tracking-label text-ink-secondary">
            {t("pilotSummary.next_stage")}
          </h3>
          <ul className="space-y-2">
            {([
              "pilotSummary.nxt_pilot" as TranslationKey,
              "pilotSummary.nxt_aggregated" as TranslationKey,
              "pilotSummary.nxt_auth" as TranslationKey,
              "pilotSummary.nxt_restore" as TranslationKey,
            ]).map((key) => (
              <li key={key} className="flex items-start gap-2 text-body-sm leading-relaxed text-ink-secondary">
                <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-urgent" />
                {t(key)}
              </li>
            ))}
          </ul>
        </CardPanel>
      </div>

      {/* Readiness for next stage */}
      <div className="mt-10">
        <h3 className="font-mono text-label font-medium uppercase tracking-label text-ink-secondary">
          {t("pilotSummary.readiness_heading")}
        </h3>
        <CardPanel className="mt-4">
          <div className="space-y-2">
            {READINESS_ITEMS.map((item) => (
              <div
                key={item.labelKey}
                className="flex items-center justify-between gap-4 border-b border-rule-light/40 pb-2.5 last:border-b-0 last:pb-0"
              >
                <div className="flex items-center gap-2.5">
                  <span className={`block h-2 w-2 shrink-0 rounded-full ${statusColor(item.status)}`} />
                  <span className="text-body-sm text-ink-secondary">{t(item.labelKey)}</span>
                </div>
                <span className="shrink-0 font-mono text-label uppercase tracking-wide text-muted">
                  {t(statusLabelKey(item.status))}
                </span>
              </div>
            ))}
          </div>
        </CardPanel>
      </div>

      {/* Disclaimer */}
      <div className="mt-10 border-t border-rule-light pt-4">
        <p className="max-w-[560px] text-meta leading-relaxed text-muted">
          {t("pilotSummary.disclaimer")}
        </p>
      </div>
    </section>
  );
}
