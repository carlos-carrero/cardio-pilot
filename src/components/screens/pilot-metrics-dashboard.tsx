"use client";

import { useState } from "react";
import { SectionLabel } from "@/components/ui/section-label";
import { CardPanel } from "@/components/ui/card-panel";
import { cn } from "@/lib/cn";
import {
  buildSessionSummary,
  downloadSessionSummaryJson,
  downloadSessionSummaryMarkdown,
} from "@/lib/cardio/session-export";
import { createPilotSession, saveSessionSummary, getSessionSummary } from "@/lib/cardio/persistence-api-client";
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
        onSetPersistedSessionError(result.error);
      }
    } catch {
      onSetPersistedSessionStatus("error");
      onSetPersistedSessionError("Unexpected error creating session.");
    }
  }

  async function handleSaveSessionSummary() {
    if (!persistedSessionId || summarySaveStatus === "saving") return;
    setSummarySaveStatus("saving");
    setSummarySaveError(null);
    try {
      const payload = buildPersistSessionSummaryPayload(completedCases, reviewerQueue, metrics);
      const result = await saveSessionSummary(persistedSessionId, payload);
      setSummarySaveStatus(result.ok ? "saved" : "error");
      if (!result.ok) setSummarySaveError(result.error);
    } catch {
      setSummarySaveStatus("error");
      setSummarySaveError("Unexpected error saving session summary.");
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
        setSummaryLoadError(result.error);
      }
    } catch {
      setSummaryLoadStatus("error");
      setSummaryLoadError("Unexpected error loading session summary.");
    }
  }

  const hasCases = metrics.cases_processed > 0;
  const summaryMetrics = [
    { label: "Cases processed", value: String(metrics.cases_processed), accent: "accent" },
    { label: "Sent to reviewer", value: String(metrics.cases_sent_to_reviewer), accent: "accent" },
    { label: "Reviewed", value: String(metrics.cases_reviewed), accent: "routine" },
    { label: "Pending review", value: String(metrics.pending_review), accent: metrics.pending_review > 0 ? "urgent" : "muted" },
    { label: "Agreement rate", value: formatRate(metrics.agreement_rate), accent: metrics.agreement_rate === null ? "muted" : "routine", note: metrics.cases_reviewed === 0 ? "Populates after review" : undefined },
    { label: "Average usefulness", value: formatScore(metrics.average_usefulness_score), accent: metrics.average_usefulness_score === null ? "muted" : "accent" },
    { label: "Estimated review-time saved", value: metrics.average_estimated_time_saved_label ?? "—", accent: "info", note: "Reviewer-reported signal" },
    { label: "Audit exports available", value: String(metrics.audit_exports_available), accent: "routine", note: "Availability, not downloads" },
    { label: "Autonomous diagnosis events", value: String(metrics.governance.autonomous_diagnosis_events), accent: "muted", note: "Soficca never diagnoses" },
    { label: "Autonomous prescription events", value: String(metrics.governance.autonomous_prescription_events), accent: "muted", note: "Soficca never prescribes" },
  ];
  const totalRoutes = Math.max(metrics.cases_processed, 1);
  const routeDistribution = [
    { route: "Emergency", count: metrics.emergency_routes, total: totalRoutes, color: "bg-emergency" },
    { route: "Same-day urgent", count: metrics.urgent_routes, total: totalRoutes, color: "bg-urgent" },
    { route: "Routine review", count: metrics.routine_routes, total: totalRoutes, color: "bg-routine" },
    { route: "Needs more info", count: metrics.needs_more_info_routes, total: totalRoutes, color: "bg-info" },
    { route: "Conflict", count: metrics.conflict_routes, total: totalRoutes, color: "bg-deferred" },
  ];
  const aiIntakeMetrics = [
    { label: "Real AI extractions", value: String(metrics.ai_intake.real_ai_extractions) },
    { label: "Mock extraction fallbacks", value: String(metrics.ai_intake.mock_extraction_fallbacks) },
    { label: "Human-corrected cases", value: String(metrics.ai_intake.cases_with_human_edits) },
    { label: "Edited fields", value: String(metrics.ai_intake.total_human_edited_fields) },
    { label: "Missing info surfaced", value: String(metrics.ai_intake.cases_with_missing_information) },
    { label: "Completion questions generated", value: String(metrics.ai_intake.cases_with_completion_questions) },
    { label: "Cases with quality flags", value: String(metrics.ai_intake.cases_with_quality_flags) },
    { label: "Cases with PII warnings", value: String(metrics.ai_intake.cases_with_pii_warnings) },
  ];
  const safetyAuditMetrics = [
    { label: "Reports with trace", value: `${metrics.governance.reports_with_trace} / ${metrics.cases_processed}` },
    { label: "Reports with policy version", value: `${metrics.governance.reports_with_policy_version} / ${metrics.cases_processed}` },
    { label: "Reports with ruleset version", value: `${metrics.governance.reports_with_ruleset_version} / ${metrics.cases_processed}` },
    { label: "Reports with engine version", value: `${metrics.governance.reports_with_engine_version} / ${metrics.cases_processed}` },
    { label: "Reports with activated rules", value: `${metrics.governance.reports_with_activated_rules} / ${metrics.cases_processed}` },
    { label: "AI route decisions", value: String(metrics.governance.ai_route_decisions) },
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
      <SectionLabel>Pilot Metrics Dashboard</SectionLabel>
      <h2 className="mt-3 font-sans text-heading-lg font-semibold leading-tight tracking-tighter text-ink">
        Aggregate signals from routed cases and physician review
      </h2>

      <div className="mt-4 flex items-center gap-2 rounded-lg border border-rule-light bg-surface px-3.5 py-2">
        <span className="h-1.5 w-1.5 rounded-full bg-muted/50" />
        <span className="font-mono text-label text-muted">
          Local session metrics · not persisted
        </span>
      </div>

      {!hasCases && (
        <div className="mt-6 rounded-card border border-rule-light bg-warm-white shadow-card p-6">
          <p className="text-body font-medium text-ink-secondary">
            No completed cases yet. Run a pilot case to populate local session metrics.
          </p>
          <p className="mt-1 text-caption text-muted">
            Audit export availability is based on completed cases with reports.
          </p>
        </div>
      )}

      <CardPanel className="mt-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="font-mono text-label font-medium uppercase tracking-label text-ink-secondary">
              Session export
            </h3>
            <p className="mt-2 max-w-[620px] text-body-sm leading-relaxed text-ink-secondary">
              Exports the current local session summary: processed cases, reviewer feedback, metrics, workflow signals, and governance assertions.
            </p>
            <p className="mt-1 font-mono text-eyebrow text-muted">
              Local export only. No session data is persisted in Stage 2B.8.
            </p>
            {!hasCases && (
              <p className="mt-2 text-meta text-muted">
                Run at least one completed case to export a session summary.
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
              Export Session JSON
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
              Export Session Markdown
            </button>
          </div>
        </div>
      </CardPanel>

      {/* Summary metric cards */}
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {summaryMetrics.map((m) => (
          <div
            key={m.label}
            className="rounded-card border border-rule-light/80 bg-warm-white shadow-card p-4"
          >
            <p className="font-mono text-eyebrow font-medium uppercase text-muted">
              {m.label}
            </p>
            <p className={cn("mt-2 font-sans text-display font-bold leading-none tracking-tight", ACCENT_COLORS[m.accent])}>
              {m.value}
            </p>
            {m.note && (
              <p className="mt-1.5 font-mono text-eyebrow text-muted/70">{m.note}</p>
            )}
          </div>
        ))}
      </div>

      {metrics.cases_sent_to_reviewer > 0 && metrics.cases_reviewed === 0 && (
        <div className="mt-4 rounded-lg border border-rule-light bg-surface px-4 py-3">
          <p className="text-body-sm text-muted">
            Reviewer metrics will populate after cases are reviewed.
          </p>
        </div>
      )}

      {/* What these metrics mean */}
      <div className="mt-10">
        <h3 className="font-mono text-label font-medium uppercase tracking-label text-ink-secondary">
          What These Metrics Mean
        </h3>
        <p className="mt-3 max-w-[640px] text-body leading-relaxed text-ink-secondary">
          The pilot measures whether Soficca consistently surfaces missing
          information, blocks unsafe classification, preserves traceability,
          and aligns with physician review.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {[
            {
              title: "Safety coverage",
              body: "Percentage of cases where safety policies were evaluated and, when triggered, correctly overrode the preliminary route.",
            },
            {
              title: "Review alignment",
              body: "How often physician reviewers agree with the Soficca-suggested route. Higher alignment indicates routing coherence, not diagnostic accuracy.",
            },
            {
              title: "Intake quality",
              body: "The proportion of cases where all required clinical fields were present. Higher intake quality means fewer deferrals and better routing confidence.",
            },
            {
              title: "Operational readiness",
              body: "Whether every report includes engine version, ruleset version, safety policy version, and activated rules — the minimum for institutional auditability.",
            },
          ].map((card) => (
            <CardPanel key={card.title}>
              <h4 className="mb-1.5 font-mono text-eyebrow font-medium uppercase tracking-eyebrow text-muted">
                {card.title}
              </h4>
              <p className="text-body-sm leading-relaxed text-ink-secondary">{card.body}</p>
            </CardPanel>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <h3 className="font-mono text-label font-medium uppercase tracking-label text-ink-secondary">
          AI Extraction & Human Confirmation
        </h3>
        <CardPanel className="mt-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {aiIntakeMetrics.map((m) => (
              <div
                key={m.label}
                className="flex items-baseline justify-between gap-4 border-b border-rule-light/40 pb-2 last:border-b-0 last:pb-0 sm:[&:nth-last-child(-n+2)]:border-b-0 sm:[&:nth-last-child(-n+2)]:pb-0"
              >
                <span className="text-body-sm text-ink-secondary">{m.label}</span>
                <span className="shrink-0 font-mono text-body-sm font-medium text-ink">{m.value}</span>
              </div>
            ))}
          </div>
        </CardPanel>
      </div>

      {/* Route distribution */}
      <div className="mt-10">
        <h3 className="font-mono text-label font-medium uppercase tracking-label text-ink-secondary">
          Route Distribution
        </h3>
        <div className="mt-4 space-y-3">
          {routeDistribution.map((r) => {
            const pct = Math.round((r.count / r.total) * 100);
            return (
              <div key={r.route} className="rounded-lg border border-rule-light bg-warm-white p-3.5">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-body-sm font-medium text-ink">{r.route}</span>
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
          Safety & Audit Signals
        </h3>
        <CardPanel className="mt-4">
          <div className="space-y-3">
            {safetyAuditMetrics.map((m) => (
              <div
                key={m.label}
                className="flex items-baseline justify-between gap-4 border-b border-rule-light/40 pb-3 last:border-b-0 last:pb-0"
              >
                <span className="text-body-sm text-ink-secondary">{m.label}</span>
                <span className="shrink-0 font-mono text-body-sm font-medium text-ink">{m.value}</span>
              </div>
            ))}
          </div>
        </CardPanel>
      </div>

      {/* Persistence Session card */}
      <div className="mt-10">
        <h3 className="font-mono text-label font-medium uppercase tracking-label text-ink-secondary">
          Persisted Pilot Session
        </h3>
        <CardPanel className="mt-4">
          <p className="text-body-sm text-muted">
            Groups saved cases and reviewer feedback under a persisted pilot session. Backend-mediated persistence. No database secrets are stored in the frontend.
          </p>
          <div className="mt-4 space-y-3">
            {/* Session status */}
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-body-sm text-ink-secondary">Session status</span>
              <span className={cn("rounded-badge border px-2 py-0.5 font-mono text-eyebrow uppercase",
                persistedSessionStatus === "created" ? "border-routine/30 bg-routine/10 text-routine" : "border-rule bg-surface text-muted"
              )}>
                {persistedSessionStatus === "created" ? "Active" : persistedSessionStatus === "creating" ? "Creating..." : "Not created"}
              </span>
            </div>
            {persistedSessionId && (
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-body-sm text-ink-secondary">Session ID</span>
                <span className="font-mono text-label text-ink-secondary">{persistedSessionId}</span>
              </div>
            )}
            {persistedSessionLabel && (
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-body-sm text-ink-secondary">Label</span>
                <span className="text-body-sm text-ink-secondary">{persistedSessionLabel}</span>
              </div>
            )}
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-body-sm text-ink-secondary">Cases processed locally</span>
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
              {persistedSessionStatus === "created" ? "Session active" : persistedSessionStatus === "creating" ? "Creating..." : "Create Persisted Session"}
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
              {summarySaveStatus === "saving" ? "Saving..." : summarySaveStatus === "saved" ? "Summary saved" : "Save Session Summary"}
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
              {summaryLoadStatus === "loading" ? "Loading..." : "Load Latest Persisted Summary"}
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
              <p className="mb-2 font-mono text-eyebrow font-medium uppercase text-muted">Persisted summary loaded</p>
              <div className="space-y-1.5 text-meta">
                <div className="flex justify-between"><span className="text-muted">Summary ID</span><span className="font-mono text-ink-secondary">{String(loadedSummaryPreview.summary_id ?? "—")}</span></div>
                <div className="flex justify-between"><span className="text-muted">Generated at</span><span className="font-mono text-ink-secondary">{String(loadedSummaryPreview.created_at ?? loadedSummaryPreview.generated_at ?? "—")}</span></div>
                {loadedSummaryPreview.metrics_json && typeof loadedSummaryPreview.metrics_json === "object" ? (
                  <>
                    <div className="flex justify-between"><span className="text-muted">Cases processed</span><span className="font-mono text-ink-secondary">{String((loadedSummaryPreview.metrics_json as Record<string, unknown>).cases_processed ?? "—")}</span></div>
                    <div className="flex justify-between"><span className="text-muted">Cases reviewed</span><span className="font-mono text-ink-secondary">{String((loadedSummaryPreview.metrics_json as Record<string, unknown>).cases_reviewed ?? "—")}</span></div>
                    <div className="flex justify-between"><span className="text-muted">Agreement rate</span><span className="font-mono text-ink-secondary">{formatRate(((loadedSummaryPreview.metrics_json as Record<string, unknown>).agreement_rate as number | null) ?? null)}</span></div>
                  </>
                ) : null}
                <div className="flex justify-between"><span className="text-muted">Autonomous diagnosis events</span><span className="font-mono text-ink-secondary">0</span></div>
                <div className="flex justify-between"><span className="text-muted">Autonomous prescription events</span><span className="font-mono text-ink-secondary">0</span></div>
              </div>
              <p className="mt-2 text-eyebrow text-muted">Persisted summary loaded from backend. Simulated/anonymized cases only.</p>
            </div>
          )}
        </CardPanel>
      </div>

      {/* Critical wording */}
      <div className="mt-10 rounded-card border border-rule-light bg-surface p-5">
        <p className="text-body-sm leading-relaxed text-ink-secondary">
          This dashboard does not claim clinical outcome improvement. It shows the
          operational signals this local session produced.
        </p>
      </div>

      {/* Disclaimer */}
      <div className="mt-8 border-t border-rule-light pt-4">
        <p className="max-w-[560px] text-meta leading-relaxed text-muted">
          Soficca does not diagnose, prescribe, or replace clinical judgment.
          These are local session metrics. They do not represent clinical validation or outcome improvement.
        </p>
      </div>
    </section>
  );
}
