"use client";

import { useState } from "react";
import { SectionLabel } from "@/components/ui/section-label";
import { CardPanel } from "@/components/ui/card-panel";
import { cn } from "@/lib/cn";
import { useTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n/en";
import {
  buildSessionSummary,
  downloadSessionSummaryJson,
  downloadSessionSummaryMarkdown,
} from "@/lib/cardio/session-export";
import { createPilotSession, saveSessionSummary, getSessionSummary, localizePersistError } from "@/lib/cardio/persistence-api-client";
import { buildPersistSessionSummaryPayload } from "@/lib/cardio/session-summary-persistence";
import type { PilotCase, ReviewerQueueItem, SessionMetrics, SessionPersistenceStatus } from "@/types";

const ACCENT_COLORS: Record<string, string> = {
  accent: "text-accent",
  routine: "text-routine",
  urgent: "text-urgent",
  emergency: "text-emergency",
  info: "text-info",
  muted: "text-muted",
};

interface PilotMetricsDashboardProps {
  completedCases: PilotCase[];
  reviewerQueue: ReviewerQueueItem[];
  metrics: SessionMetrics;
  persistedSessionId: string | null;
  persistedSessionStatus: SessionPersistenceStatus;
  persistedSessionLabel: string | null;
  persistedSessionError: string | null;
  onSetPersistedSessionId: (id: string | null) => void;
  onSetPersistedSessionStatus: (s: SessionPersistenceStatus) => void;
  onSetPersistedSessionLabel: (label: string | null) => void;
  onSetPersistedSessionError: (err: string | null) => void;
}

function formatRate(value: number | null): string {
  return value === null ? "—" : `${Math.round(value * 100)}%`;
}

function formatScore(value: number | null): string {
  return value === null ? "—" : `${value.toFixed(1)} / 5`;
}

export function PilotMetricsDashboard({
  completedCases, reviewerQueue, metrics,
  persistedSessionId, persistedSessionStatus, persistedSessionLabel, persistedSessionError,
  onSetPersistedSessionId, onSetPersistedSessionStatus, onSetPersistedSessionLabel, onSetPersistedSessionError,
}: PilotMetricsDashboardProps) {
  const { t, lang } = useTranslation();
  const [summarySaveStatus, setSummarySaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [summarySaveError, setSummarySaveError] = useState<string | null>(null);
  const [summaryLoadStatus, setSummaryLoadStatus] = useState<"idle" | "loading" | "loaded" | "error">("idle");
  const [summaryLoadError, setSummaryLoadError] = useState<string | null>(null);
  const [loadedSummaryPreview, setLoadedSummaryPreview] = useState<Record<string, unknown> | null>(null);

  async function handleCreateSession() {
    if (persistedSessionStatus === "creating" || persistedSessionStatus === "created") return;
    onSetPersistedSessionStatus("creating");
    onSetPersistedSessionError(null);
    try {
      const result = await createPilotSession({
        label: "Cardio Pilot Demo Session",
        mode: "local_demo",
        environment: "local",
      });
      if (result.ok) {
        const session = result.data.session;
        onSetPersistedSessionId(String(session.session_id ?? session.id ?? ""));
        onSetPersistedSessionLabel(String(session.label ?? "Cardio Pilot Demo Session"));
        onSetPersistedSessionStatus("created");
      } else {
        onSetPersistedSessionStatus(result.status);
        onSetPersistedSessionError(localizePersistError(result, t));
      }
    } catch {
      onSetPersistedSessionStatus("error");
      onSetPersistedSessionError(t("metrics.error_create_session"));
    }
  }

  async function handleSaveSessionSummary() {
    if (!persistedSessionId || summarySaveStatus === "saving") return;
    setSummarySaveStatus("saving");
    setSummarySaveError(null);
    try {
      const payload = buildPersistSessionSummaryPayload(completedCases, reviewerQueue, metrics, lang);
      const result = await saveSessionSummary(persistedSessionId, payload);
      setSummarySaveStatus(result.ok ? "saved" : "error");
      if (!result.ok) setSummarySaveError(localizePersistError(result, t));
    } catch {
      setSummarySaveStatus("error");
      setSummarySaveError(t("metrics.error_save_summary"));
    }
  }

  async function handleLoadSessionSummary() {
    if (!persistedSessionId || summaryLoadStatus === "loading") return;
    setSummaryLoadStatus("loading");
    setSummaryLoadError(null);
    setLoadedSummaryPreview(null);
    try {
      const result = await getSessionSummary(persistedSessionId);
      if (result.ok) {
        setLoadedSummaryPreview(result.data.summary);
        setSummaryLoadStatus("loaded");
      } else {
        setSummaryLoadStatus("error");
        setSummaryLoadError(localizePersistError(result, t));
      }
    } catch {
      setSummaryLoadStatus("error");
      setSummaryLoadError(t("metrics.error_load_summary"));
    }
  }

  const hasCases = metrics.cases_processed > 0;
  const summaryMetrics: { labelKey: TranslationKey; value: string; accent: string; noteKey?: TranslationKey }[] = [
    { labelKey: "metrics.cases_processed", value: String(metrics.cases_processed), accent: "accent" },
    { labelKey: "metrics.sent_to_reviewer", value: String(metrics.cases_sent_to_reviewer), accent: "accent" },
    { labelKey: "metrics.reviewed", value: String(metrics.cases_reviewed), accent: "routine" },
    { labelKey: "metrics.pending_review", value: String(metrics.pending_review), accent: metrics.pending_review > 0 ? "urgent" : "muted" },
    { labelKey: "metrics.agreement_rate", value: formatRate(metrics.agreement_rate), accent: metrics.agreement_rate === null ? "muted" : "routine", noteKey: metrics.cases_reviewed === 0 ? "metrics.note_populates" : undefined },
    { labelKey: "metrics.avg_usefulness", value: formatScore(metrics.average_usefulness_score), accent: metrics.average_usefulness_score === null ? "muted" : "accent" },
    { labelKey: "metrics.est_time_saved", value: metrics.average_estimated_time_saved_label ?? "—", accent: "info", noteKey: "metrics.note_reviewer_signal" },
    { labelKey: "metrics.audit_exports", value: String(metrics.audit_exports_available), accent: "routine", noteKey: "metrics.note_availability" },
    { labelKey: "metrics.autonomous_dx", value: String(metrics.governance.autonomous_diagnosis_events), accent: "muted", noteKey: "metrics.note_never_dx" },
    { labelKey: "metrics.autonomous_rx", value: String(metrics.governance.autonomous_prescription_events), accent: "muted", noteKey: "metrics.note_never_rx" },
  ];
  const totalRoutes = Math.max(metrics.cases_processed, 1);
  const routeDistribution: { routeKey: TranslationKey; count: number; total: number; color: string }[] = [
    { routeKey: "metrics.route_emergency", count: metrics.emergency_routes, total: totalRoutes, color: "bg-emergency" },
    { routeKey: "metrics.route_urgent", count: metrics.urgent_routes, total: totalRoutes, color: "bg-urgent" },
    { routeKey: "metrics.route_routine", count: metrics.routine_routes, total: totalRoutes, color: "bg-routine" },
    { routeKey: "metrics.route_needs_info", count: metrics.needs_more_info_routes, total: totalRoutes, color: "bg-info" },
    { routeKey: "metrics.route_conflict", count: metrics.conflict_routes, total: totalRoutes, color: "bg-deferred" },
  ];
  const aiIntakeMetrics: { labelKey: TranslationKey; value: string }[] = [
    { labelKey: "metrics.ai_real", value: String(metrics.ai_intake.real_ai_extractions) },
    { labelKey: "metrics.ai_mock", value: String(metrics.ai_intake.mock_extraction_fallbacks) },
    { labelKey: "metrics.ai_human_corrected", value: String(metrics.ai_intake.cases_with_human_edits) },
    { labelKey: "metrics.ai_edited_fields", value: String(metrics.ai_intake.total_human_edited_fields) },
    { labelKey: "metrics.ai_missing_info", value: String(metrics.ai_intake.cases_with_missing_information) },
    { labelKey: "metrics.ai_completion_qs", value: String(metrics.ai_intake.cases_with_completion_questions) },
    { labelKey: "metrics.ai_quality_flags", value: String(metrics.ai_intake.cases_with_quality_flags) },
    { labelKey: "metrics.ai_pii_warnings", value: String(metrics.ai_intake.cases_with_pii_warnings) },
  ];
  const safetyAuditMetrics: { labelKey: TranslationKey; value: string }[] = [
    { labelKey: "metrics.safety_trace", value: `${metrics.governance.reports_with_trace} / ${metrics.cases_processed}` },
    { labelKey: "metrics.safety_policy", value: `${metrics.governance.reports_with_policy_version} / ${metrics.cases_processed}` },
    { labelKey: "metrics.safety_ruleset", value: `${metrics.governance.reports_with_ruleset_version} / ${metrics.cases_processed}` },
    { labelKey: "metrics.safety_engine", value: `${metrics.governance.reports_with_engine_version} / ${metrics.cases_processed}` },
    { labelKey: "metrics.safety_rules", value: `${metrics.governance.reports_with_activated_rules} / ${metrics.cases_processed}` },
    { labelKey: "metrics.safety_ai_decisions", value: String(metrics.governance.ai_route_decisions) },
  ];

  function handleExportSessionJson() {
    const summary = buildSessionSummary(completedCases, reviewerQueue, metrics);
    downloadSessionSummaryJson(summary);
  }

  function handleExportSessionMarkdown() {
    const summary = buildSessionSummary(completedCases, reviewerQueue, metrics);
    downloadSessionSummaryMarkdown(summary);
  }

  return (
    <section className="mx-auto max-w-[1360px] px-6 py-10 lg:py-14">
      <SectionLabel>{t("metrics.section_label")}</SectionLabel>
      <h2 className="mt-3 font-sans text-heading-lg font-semibold leading-tight tracking-tighter text-ink">
        {t("metrics.heading")}
      </h2>

      <div className="mt-4 flex items-center gap-2 rounded-lg border border-rule-light bg-surface px-3.5 py-2">
        <span className="h-1.5 w-1.5 rounded-full bg-routine" />
        <span className="font-mono text-label text-muted">
          {t("metrics.banner")}
        </span>
      </div>

      {!hasCases && (
        <div className="mt-6 rounded-card border border-rule-light bg-warm-white shadow-card p-6">
          <p className="text-body font-medium text-ink-secondary">
            {t("metrics.empty_heading")}
          </p>
          <p className="mt-1 text-caption text-muted">
            {t("metrics.empty_hint")}
          </p>
        </div>
      )}

      <CardPanel className="mt-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="font-mono text-label font-medium uppercase tracking-label text-ink-secondary">
              {t("metrics.export_heading")}
            </h3>
            <p className="mt-2 max-w-[620px] text-body-sm leading-relaxed text-ink-secondary">
              {t("metrics.export_desc")}
            </p>
            <p className="mt-1 font-mono text-eyebrow text-muted">
              {t("metrics.export_hint")}
            </p>
            {!hasCases && (
              <p className="mt-2 text-meta text-muted">
                {t("metrics.export_no_cases")}
              </p>
            )}
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={handleExportSessionJson}
              disabled={!hasCases}
              className={cn(
                "rounded-lg border px-3.5 py-2 font-mono text-label font-medium uppercase tracking-wide transition-all",
                hasCases
                  ? "border-rule bg-warm-white text-ink-secondary hover:border-ink/30 hover:text-ink"
                  : "cursor-not-allowed border-rule-light bg-surface text-muted/60"
              )}
            >
              {t("metrics.export_json")}
            </button>
            <button
              type="button"
              onClick={handleExportSessionMarkdown}
              disabled={!hasCases}
              className={cn(
                "rounded-lg border px-3.5 py-2 font-mono text-label font-medium uppercase tracking-wide transition-all",
                hasCases
                  ? "border-ink/20 bg-warm-white text-ink-secondary hover:border-accent hover:text-accent"
                  : "cursor-not-allowed border-rule-light bg-surface text-muted/60"
              )}
            >
              {t("metrics.export_md")}
            </button>
          </div>
        </div>
      </CardPanel>

      {/* Summary metric cards */}
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {summaryMetrics.map((m) => (
          <div
            key={m.labelKey}
            className="rounded-card border border-rule-light/80 bg-warm-white shadow-card p-4"
          >
            <p className="font-mono text-eyebrow font-medium uppercase text-muted">
              {t(m.labelKey)}
            </p>
            <p className={cn("mt-2 font-sans text-display font-bold leading-none tracking-tight", ACCENT_COLORS[m.accent])}>
              {m.value}
            </p>
            {m.noteKey && (
              <p className="mt-1.5 font-mono text-eyebrow text-muted/70">{t(m.noteKey)}</p>
            )}
          </div>
        ))}
      </div>

      {metrics.cases_sent_to_reviewer > 0 && metrics.cases_reviewed === 0 && (
        <div className="mt-4 rounded-lg border border-rule-light bg-surface px-4 py-3">
          <p className="text-body-sm text-muted">
            {t("metrics.reviewer_hint")}
          </p>
        </div>
      )}

      {/* What these metrics mean */}
      <div className="mt-10">
        <h3 className="font-mono text-label font-medium uppercase tracking-label text-ink-secondary">
          {t("metrics.what_heading")}
        </h3>
        <p className="mt-3 max-w-[640px] text-body leading-relaxed text-ink-secondary">
          {t("metrics.what_desc")}
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {([
            { titleKey: "metrics.card_safety_title" as TranslationKey, bodyKey: "metrics.card_safety_body" as TranslationKey },
            { titleKey: "metrics.card_alignment_title" as TranslationKey, bodyKey: "metrics.card_alignment_body" as TranslationKey },
            { titleKey: "metrics.card_intake_title" as TranslationKey, bodyKey: "metrics.card_intake_body" as TranslationKey },
            { titleKey: "metrics.card_readiness_title" as TranslationKey, bodyKey: "metrics.card_readiness_body" as TranslationKey },
          ]).map((card) => (
            <CardPanel key={card.titleKey}>
              <h4 className="mb-1.5 font-mono text-eyebrow font-medium uppercase tracking-eyebrow text-muted">
                {t(card.titleKey)}
              </h4>
              <p className="text-body-sm leading-relaxed text-ink-secondary">{t(card.bodyKey)}</p>
            </CardPanel>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <h3 className="font-mono text-label font-medium uppercase tracking-label text-ink-secondary">
          {t("metrics.ai_heading")}
        </h3>
        <CardPanel className="mt-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {aiIntakeMetrics.map((m) => (
              <div
                key={m.labelKey}
                className="flex items-baseline justify-between gap-4 border-b border-rule-light/40 pb-2 last:border-b-0 last:pb-0 sm:[&:nth-last-child(-n+2)]:border-b-0 sm:[&:nth-last-child(-n+2)]:pb-0"
              >
                <span className="text-body-sm text-ink-secondary">{t(m.labelKey)}</span>
                <span className="shrink-0 font-mono text-body-sm font-medium text-ink">{m.value}</span>
              </div>
            ))}
          </div>
        </CardPanel>
      </div>

      {/* Route distribution */}
      <div className="mt-10">
        <h3 className="font-mono text-label font-medium uppercase tracking-label text-ink-secondary">
          {t("metrics.route_heading")}
        </h3>
        <div className="mt-4 space-y-3">
          {routeDistribution.map((r) => {
            const pct = Math.round((r.count / r.total) * 100);
            return (
              <div key={r.routeKey} className="rounded-lg border border-rule-light bg-warm-white p-3.5">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-body-sm font-medium text-ink">{t(r.routeKey)}</span>
                  <span className="font-mono text-meta text-ink-secondary">
                    {r.count} / {r.total} ({pct}%)
                  </span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-surface">
                  <div
                    className={cn("h-full rounded-full transition-all", r.color)}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Safety & audit metrics */}
      <div className="mt-10">
        <h3 className="font-mono text-label font-medium uppercase tracking-label text-ink-secondary">
          {t("metrics.safety_heading")}
        </h3>
        <CardPanel className="mt-4">
          <div className="space-y-3">
            {safetyAuditMetrics.map((m) => (
              <div
                key={m.labelKey}
                className="flex items-baseline justify-between gap-4 border-b border-rule-light/40 pb-3 last:border-b-0 last:pb-0"
              >
                <span className="text-body-sm text-ink-secondary">{t(m.labelKey)}</span>
                <span className="shrink-0 font-mono text-body-sm font-medium text-ink">{m.value}</span>
              </div>
            ))}
          </div>
        </CardPanel>
      </div>

      {/* Persistence Session card */}
      <div className="mt-10">
        <h3 className="font-mono text-label font-medium uppercase tracking-label text-ink-secondary">
          {t("metrics.persist_heading")}
        </h3>
        <CardPanel className="mt-4">
          <p className="text-body-sm text-muted">
            {t("metrics.persist_desc")}
          </p>
          <div className="mt-4 space-y-3">
            {/* Session status */}
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-body-sm text-ink-secondary">{t("metrics.persist_status")}</span>
              <span className={cn("rounded-badge border px-2 py-0.5 font-mono text-eyebrow uppercase",
                persistedSessionStatus === "created" ? "border-routine/30 bg-routine/10 text-routine" : "border-rule bg-surface text-muted"
              )}>
                {persistedSessionStatus === "created" ? t("metrics.persist_active") : persistedSessionStatus === "creating" ? t("metrics.persist_creating") : t("metrics.persist_not_created")}
              </span>
            </div>
            {persistedSessionId && (
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-body-sm text-ink-secondary">{t("metrics.persist_session_id")}</span>
                <span className="font-mono text-label text-ink-secondary">{persistedSessionId}</span>
              </div>
            )}
            {persistedSessionLabel && (
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-body-sm text-ink-secondary">{t("metrics.persist_label")}</span>
                <span className="text-body-sm text-ink-secondary">{persistedSessionLabel}</span>
              </div>
            )}
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-body-sm text-ink-secondary">{t("metrics.persist_cases_processed")}</span>
              <span className="font-mono text-label font-medium text-ink">{metrics.cases_processed}</span>
            </div>
          </div>
          {persistedSessionError && (
            <p className="mt-3 text-body-sm text-urgent">{persistedSessionError}</p>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={handleCreateSession}
              disabled={persistedSessionStatus === "creating" || persistedSessionStatus === "created"}
              className={cn(
                "rounded-btn border px-3 py-1.5 font-mono text-label uppercase tracking-wide transition-all",
                persistedSessionStatus === "created"
                  ? "cursor-default border-routine/30 bg-routine/10 text-routine"
                  : persistedSessionStatus === "creating"
                    ? "cursor-wait border-accent/30 bg-accent/5 text-accent"
                    : "border-accent bg-paper text-accent hover:bg-accent hover:text-white"
              )}
            >
              {persistedSessionStatus === "created" ? t("metrics.persist_btn_active") : persistedSessionStatus === "creating" ? t("metrics.persist_creating") : t("metrics.persist_btn_create")}
            </button>
            <button
              onClick={handleSaveSessionSummary}
              disabled={!persistedSessionId || summarySaveStatus === "saving"}
              className={cn(
                "rounded-btn border px-3 py-1.5 font-mono text-label uppercase tracking-wide transition-all",
                summarySaveStatus === "saved"
                  ? "cursor-default border-routine/30 bg-routine/10 text-routine"
                  : !persistedSessionId
                    ? "cursor-not-allowed border-rule bg-surface text-muted/50"
                    : "border-accent bg-paper text-accent hover:bg-accent hover:text-white"
              )}
            >
              {summarySaveStatus === "saving" ? t("metrics.persist_saving") : summarySaveStatus === "saved" ? t("metrics.persist_saved") : t("metrics.persist_btn_save")}
            </button>
            <button
              onClick={handleLoadSessionSummary}
              disabled={!persistedSessionId || summaryLoadStatus === "loading"}
              className={cn(
                "rounded-btn border px-3 py-1.5 font-mono text-label uppercase tracking-wide transition-all",
                !persistedSessionId
                  ? "cursor-not-allowed border-rule bg-surface text-muted/50"
                  : "border-accent bg-paper text-accent hover:bg-accent hover:text-white"
              )}
            >
              {summaryLoadStatus === "loading" ? t("metrics.persist_loading") : t("metrics.persist_btn_load")}
            </button>
          </div>
          {summarySaveError && (
            <p className="mt-2 text-body-sm text-urgent">{summarySaveError}</p>
          )}
          {summaryLoadError && (
            <p className="mt-2 text-body-sm text-urgent">{summaryLoadError}</p>
          )}
          {loadedSummaryPreview && (
            <div className="mt-4 rounded-lg border border-rule-light bg-surface/50 p-4">
              <p className="mb-2 font-mono text-eyebrow font-medium uppercase text-muted">{t("metrics.persist_summary_loaded")}</p>
              <div className="space-y-1.5 text-meta">
                <div className="flex justify-between"><span className="text-muted">{t("metrics.persist_summary_id")}</span><span className="font-mono text-ink-secondary">{String(loadedSummaryPreview.summary_id ?? "—")}</span></div>
                <div className="flex justify-between"><span className="text-muted">{t("metrics.persist_generated_at")}</span><span className="font-mono text-ink-secondary">{String(loadedSummaryPreview.created_at ?? loadedSummaryPreview.generated_at ?? "—")}</span></div>
                {loadedSummaryPreview.metrics_json && typeof loadedSummaryPreview.metrics_json === "object" ? (
                  <>
                    <div className="flex justify-between"><span className="text-muted">{t("metrics.cases_processed")}</span><span className="font-mono text-ink-secondary">{String((loadedSummaryPreview.metrics_json as Record<string, unknown>).cases_processed ?? "—")}</span></div>
                    <div className="flex justify-between"><span className="text-muted">{t("metrics.reviewed")}</span><span className="font-mono text-ink-secondary">{String((loadedSummaryPreview.metrics_json as Record<string, unknown>).cases_reviewed ?? "—")}</span></div>
                    <div className="flex justify-between"><span className="text-muted">{t("metrics.agreement_rate")}</span><span className="font-mono text-ink-secondary">{formatRate(((loadedSummaryPreview.metrics_json as Record<string, unknown>).agreement_rate as number | null) ?? null)}</span></div>
                  </>
                ) : null}
                <div className="flex justify-between"><span className="text-muted">{t("metrics.autonomous_dx")}</span><span className="font-mono text-ink-secondary">0</span></div>
                <div className="flex justify-between"><span className="text-muted">{t("metrics.autonomous_rx")}</span><span className="font-mono text-ink-secondary">0</span></div>
              </div>
              <p className="mt-2 text-eyebrow text-muted">{t("metrics.persist_disclaimer")}</p>
            </div>
          )}
        </CardPanel>
      </div>

      {/* Critical wording */}
      <div className="mt-10 rounded-card border border-rule-light bg-surface p-5">
        <p className="text-body-sm leading-relaxed text-ink-secondary">
          {t("metrics.critical_wording")}
        </p>
      </div>

      {/* Disclaimer */}
      <div className="mt-8 border-t border-rule-light pt-4">
        <p className="max-w-[560px] text-meta leading-relaxed text-muted">
          {t("metrics.footer_disclaimer")}
        </p>
      </div>
    </section>
  );
}
