"use client";

import { useState } from "react";
import { SectionLabel } from "@/components/ui/section-label";
import { CardPanel } from "@/components/ui/card-panel";
import { cn } from "@/lib/cn";
import { goldenScenarios } from "@/data/golden-scenarios";
import { useTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n/en";
import type { SessionMetrics } from "@/types";

// ── Types ───────────────────────────────────────────────────────

type CheckPhase = "before" | "during" | "after";

interface CheckItem {
  id: string;
  labelKey: TranslationKey;
  phase: CheckPhase;
}

const CHECKLIST: CheckItem[] = [
  // Before
  { id: "be_backend", labelKey: "demoGuide.ck_backend", phase: "before" },
  { id: "be_frontend", labelKey: "demoGuide.ck_frontend", phase: "before" },
  { id: "be_openai", labelKey: "demoGuide.ck_openai", phase: "before" },
  { id: "be_db", labelKey: "demoGuide.ck_db", phase: "before" },
  { id: "be_ai_extraction", labelKey: "demoGuide.ck_ai_extraction", phase: "before" },
  { id: "be_backend_routing", labelKey: "demoGuide.ck_backend_routing", phase: "before" },
  { id: "be_reviewer_empty", labelKey: "demoGuide.ck_reviewer_empty", phase: "before" },
  { id: "be_metrics_reset", labelKey: "demoGuide.ck_metrics_reset", phase: "before" },
  { id: "be_simulated_only", labelKey: "demoGuide.ck_simulated", phase: "before" },
  { id: "be_no_clinical", labelKey: "demoGuide.ck_no_clinical", phase: "before" },
  // During
  { id: "du_intake", labelKey: "demoGuide.ck_intake", phase: "during" },
  { id: "du_extraction", labelKey: "demoGuide.ck_extraction", phase: "during" },
  { id: "du_correction", labelKey: "demoGuide.ck_correction", phase: "during" },
  { id: "du_routing", labelKey: "demoGuide.ck_routing", phase: "during" },
  { id: "du_report", labelKey: "demoGuide.ck_report", phase: "during" },
  { id: "du_reviewer", labelKey: "demoGuide.ck_reviewer", phase: "during" },
  { id: "du_feedback", labelKey: "demoGuide.ck_feedback", phase: "during" },
  { id: "du_metrics", labelKey: "demoGuide.ck_metrics", phase: "during" },
  { id: "du_export", labelKey: "demoGuide.ck_export", phase: "during" },
  // After
  { id: "af_audit", labelKey: "demoGuide.ck_af_audit", phase: "after" },
  { id: "af_session", labelKey: "demoGuide.ck_af_session", phase: "after" },
  { id: "af_persist_session", labelKey: "demoGuide.ck_af_persist_session", phase: "after" },
  { id: "af_persist_case", labelKey: "demoGuide.ck_af_persist_case", phase: "after" },
  { id: "af_persist_feedback", labelKey: "demoGuide.ck_af_persist_feedback", phase: "after" },
  { id: "af_persist_summary", labelKey: "demoGuide.ck_af_persist_summary", phase: "after" },
  { id: "af_persist_load", labelKey: "demoGuide.ck_af_persist_load", phase: "after" },
  { id: "af_reset", labelKey: "demoGuide.ck_af_reset", phase: "after" },
];

const PHASE_LABEL_KEYS: Record<CheckPhase, TranslationKey> = {
  before: "demoGuide.phase_before",
  during: "demoGuide.phase_during",
  after: "demoGuide.phase_after",
};

interface DemoGuideProps {
  metrics: SessionMetrics;
  onLoadScenario: (narrative: string) => void;
  onResetSession: () => void;
}

// ── Component ───────────────────────────────────────────────────

export function DemoGuide({ metrics, onLoadScenario, onResetSession }: DemoGuideProps) {
  const { t } = useTranslation();
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [resetConfirm, setResetConfirm] = useState(false);
  const [copyMsg, setCopyMsg] = useState<string | null>(null);

  function toggle(id: string) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function handleReset() {
    if (!resetConfirm) {
      setResetConfirm(true);
      return;
    }
    onResetSession();
    setChecked({});
    setResetConfirm(false);
  }

  function handleLoadScenario(narrative: string, label: string) {
    onLoadScenario(narrative);
    setCopyMsg(label);
    setTimeout(() => setCopyMsg(null), 2000);
  }

  const demoScenarios = goldenScenarios.filter((s) =>
    ["gs_emergency", "gs_urgent", "gs_conflict"].includes(s.id),
  );

  return (
    <section className="mx-auto max-w-[1360px] px-6 py-10 lg:py-14">
      <SectionLabel>{t("demoGuide.section_label")}</SectionLabel>
      <h2 className="mt-3 font-sans text-heading-lg font-semibold leading-tight tracking-tighter text-ink">
        {t("demoGuide.heading")}
      </h2>

      <div className="mt-4 flex items-center gap-2 rounded-lg border border-rule-light bg-surface px-3.5 py-2">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        <span className="font-mono text-label text-muted">
          {t("demoGuide.banner")}
        </span>
      </div>

      {/* ── Two-column layout ── */}
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        {/* ─── Main column ─── */}
        <div className="space-y-8">
          {/* Suggested opening */}
          <CardPanel>
            <h3 className="font-mono text-label font-medium uppercase tracking-label text-ink-secondary">
              {t("demoGuide.opening_heading")}
            </h3>
            <blockquote className="mt-3 border-l-2 border-rule pl-4 text-body leading-relaxed text-ink italic">
              &ldquo;{t("demoGuide.opening_quote")}&rdquo;
            </blockquote>
          </CardPanel>

          {/* Demo objective */}
          <CardPanel>
            <h3 className="font-mono text-label font-medium uppercase tracking-label text-ink-secondary">
              {t("demoGuide.objective_heading")}
            </h3>
            <p className="mt-3 text-body leading-relaxed text-ink-secondary">
              {t("demoGuide.objective_body")}
            </p>
          </CardPanel>

          {/* Recommended 3-minute demo flow */}
          <CardPanel>
            <h3 className="font-mono text-label font-medium uppercase tracking-label text-ink-secondary">
              {t("demoGuide.flow_heading")}
            </h3>
            <div className="mt-4 space-y-2.5">
              {([
                "demoGuide.flow_1" as TranslationKey,
                "demoGuide.flow_2" as TranslationKey,
                "demoGuide.flow_3" as TranslationKey,
                "demoGuide.flow_4" as TranslationKey,
                "demoGuide.flow_5" as TranslationKey,
                "demoGuide.flow_6" as TranslationKey,
                "demoGuide.flow_7" as TranslationKey,
                "demoGuide.flow_8" as TranslationKey,
                "demoGuide.flow_9" as TranslationKey,
                "demoGuide.flow_10" as TranslationKey,
                "demoGuide.flow_11" as TranslationKey,
                "demoGuide.flow_12" as TranslationKey,
              ]).map((key, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-rule bg-surface font-mono text-eyebrow font-bold text-muted">
                    {i + 1}
                  </span>
                  <span className="text-body-sm leading-snug text-ink-secondary">{t(key)}</span>
                </div>
              ))}
            </div>
          </CardPanel>

          {/* What to say */}
          <CardPanel>
            <h3 className="font-mono text-label font-medium uppercase tracking-label text-ink-secondary">
              {t("demoGuide.core_heading")}
            </h3>
            <blockquote className="mt-3 border-l-2 border-rule pl-4 text-body leading-relaxed text-ink-secondary italic">
              &ldquo;{t("demoGuide.core_quote")}&rdquo;
            </blockquote>
          </CardPanel>

          {/* What not to claim */}
          <CardPanel>
            <h3 className="font-mono text-label font-medium uppercase tracking-label text-ink-secondary">
              {t("demoGuide.noclaim_heading")}
            </h3>
            <ul className="mt-3 space-y-1.5 text-body-sm text-ink-secondary">
              {([
                "demoGuide.noclaim_1" as TranslationKey,
                "demoGuide.noclaim_2" as TranslationKey,
                "demoGuide.noclaim_3" as TranslationKey,
                "demoGuide.noclaim_4" as TranslationKey,
                "demoGuide.noclaim_5" as TranslationKey,
              ]).map((key) => (
                <li key={key} className="flex items-start gap-2">
                  <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-emergency/60" />
                  {t(key)}
                </li>
              ))}
            </ul>
          </CardPanel>

          {/* Golden scenario shortcuts */}
          <CardPanel>
            <h3 className="font-mono text-label font-medium uppercase tracking-label text-ink-secondary">
              {t("demoGuide.shortcuts_heading")}
            </h3>
            <p className="mt-2 text-meta text-muted">
              {t("demoGuide.shortcuts_hint")}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {demoScenarios.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    const key = `goldenScenario.${s.id}.label` as TranslationKey;
                    const lbl = t(key) !== key ? t(key) : s.label;
                    handleLoadScenario(s.narrative, lbl);
                  }}
                  className="inline-flex h-9 items-center rounded-btn border border-rule bg-warm-white px-3.5 font-mono text-eyebrow uppercase tracking-wide text-ink-secondary transition-all hover:border-ink/30 hover:text-ink"
                >
                  {(() => { const key = `goldenScenario.${s.id}.label` as TranslationKey; const v = t(key); return v !== key ? v : s.label; })()}
                </button>
              ))}
            </div>
            {copyMsg && (
              <p className="mt-2 font-mono text-eyebrow text-routine">
                {t("demoGuide.loaded_prefix")} {copyMsg} — {t("demoGuide.loaded_suffix")}
              </p>
            )}
          </CardPanel>

          {/* Demo readiness checklist */}
          <div className="space-y-5">
            {(["before", "during", "after"] as CheckPhase[]).map((phase) => {
              const items = CHECKLIST.filter((c) => c.phase === phase);
              return (
                <CardPanel key={phase}>
                  <h3 className="font-mono text-label font-medium uppercase tracking-label text-ink-secondary">
                    {t(PHASE_LABEL_KEYS[phase])}
                  </h3>
                  <div className="mt-3 space-y-2">
                    {items.map((item) => (
                      <label
                        key={item.id}
                        className="flex cursor-pointer items-center gap-3 rounded-md px-1 py-0.5 transition-colors hover:bg-surface/40"
                      >
                        <input
                          type="checkbox"
                          checked={!!checked[item.id]}
                          onChange={() => toggle(item.id)}
                          className="h-3.5 w-3.5 shrink-0 rounded border-rule-light accent-accent"
                        />
                        <span className={cn(
                          "text-body-sm",
                          checked[item.id] ? "text-ink-secondary line-through" : "text-ink-secondary",
                        )}>
                          {t(item.labelKey)}
                        </span>
                      </label>
                    ))}
                  </div>
                </CardPanel>
              );
            })}
          </div>
        </div>

        {/* ─── Sidebar ─── */}
        <aside className="space-y-5 lg:sticky lg:top-header lg:self-start">
          {/* Demo mode status */}
          <div className="rounded-card border border-rule-light/80 bg-warm-white shadow-card p-5">
            <p className="font-mono text-eyebrow font-medium uppercase tracking-eyebrow text-muted">
              {t("demoGuide.status_heading")}
            </p>
            <div className="mt-3 space-y-2 text-meta">
              <StatusRow label={t("demoGuide.status_data_mode")} value={t("demoGuide.status_data_value")} />
              <StatusRow label={t("demoGuide.status_ai")} value={t("demoGuide.status_ai_value")} />
              <StatusRow label={t("demoGuide.status_routing")} value={t("demoGuide.status_routing_value")} />
              <StatusRow label={t("demoGuide.status_reviewer")} value={t("demoGuide.status_reviewer_value")} />
              <StatusRow label={t("demoGuide.status_metrics")} value={t("demoGuide.status_metrics_value")} />
              <StatusRow label={t("demoGuide.status_persistence")} value={t("demoGuide.status_persistence_value")} />
              <StatusRow label={t("demoGuide.status_clinical")} value={t("demoGuide.status_clinical_value")} />
            </div>
          </div>

          {/* Session snapshot */}
          <div className="rounded-card border border-rule-light/80 bg-warm-white shadow-card p-5">
            <p className="font-mono text-eyebrow font-medium uppercase tracking-eyebrow text-muted">
              {t("demoGuide.snapshot_heading")}
            </p>
            <div className="mt-3 space-y-2 text-meta">
              <StatusRow label={t("demoGuide.snapshot_processed")} value={String(metrics.cases_processed)} />
              <StatusRow label={t("demoGuide.snapshot_sent")} value={String(metrics.cases_sent_to_reviewer)} />
              <StatusRow label={t("demoGuide.snapshot_reviewed")} value={String(metrics.cases_reviewed)} />
              <StatusRow label={t("demoGuide.snapshot_pending")} value={String(metrics.pending_review)} />
            </div>
          </div>

          {/* Demo outputs */}
          <div className="rounded-card border border-rule-light/80 bg-warm-white shadow-card p-5">
            <p className="font-mono text-eyebrow font-medium uppercase tracking-eyebrow text-muted">
              {t("demoGuide.outputs_heading")}
            </p>
            <ul className="mt-3 space-y-1.5 text-meta text-ink-secondary">
              <li>{t("demoGuide.output_audit_json")}</li>
              <li>{t("demoGuide.output_audit_md")}</li>
              <li>{t("demoGuide.output_session_json")}</li>
              <li>{t("demoGuide.output_session_md")}</li>
              <li>{t("demoGuide.output_feedback")}</li>
              <li>{t("demoGuide.output_metrics")}</li>
            </ul>
            <p className="mt-3 border-t border-rule-light pt-2 font-mono text-eyebrow text-muted">
              {t("demoGuide.outputs_disclaimer")}
            </p>
          </div>

          {/* Reset local session */}
          <div className="rounded-card border border-rule-light/80 bg-warm-white shadow-card p-5">
            <p className="font-mono text-eyebrow font-medium uppercase tracking-eyebrow text-muted">
              {t("demoGuide.reset_heading")}
            </p>
            <p className="mt-2 text-caption leading-relaxed text-muted">
              {t("demoGuide.reset_desc")}
            </p>
            <p className="mt-1 font-mono text-eyebrow text-muted">
              {t("demoGuide.reset_note")}
            </p>
            <button
              onClick={handleReset}
              className={cn(
                "mt-3 w-full rounded-lg border px-3.5 py-2 font-mono text-label font-medium uppercase tracking-wide transition-all",
                resetConfirm
                  ? "border-emergency bg-emergency/10 text-emergency hover:bg-emergency hover:text-white"
                  : "border-rule bg-paper text-muted hover:border-accent hover:text-accent",
              )}
            >
              {resetConfirm ? t("demoGuide.reset_confirm") : t("demoGuide.reset_btn")}
            </button>
            {resetConfirm && (
              <button
                onClick={() => setResetConfirm(false)}
                className="mt-1.5 w-full rounded-btn border border-rule-light px-3.5 py-1.5 font-mono text-eyebrow text-muted transition-all hover:text-ink"
              >
                {t("demoGuide.reset_cancel")}
              </button>
            )}
          </div>

          {/* Governance */}
          <div className="rounded-xl border border-rule-light bg-surface p-5">
            <p className="text-meta leading-relaxed text-muted">
              {t("demoGuide.disclaimer")}
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

// ── Sub-components ──────────────────────────────────────────────

function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[minmax(0,110px)_minmax(0,1fr)] gap-x-3 gap-y-0.5">
      <span className="text-muted">{label}</span>
      <span className="min-w-0 break-words font-mono text-label font-medium text-ink-secondary">{value}</span>
    </div>
  );
}
