"use client";

import { useState, useMemo } from "react";
import { SectionLabel } from "@/components/ui/section-label";
import { cn } from "@/lib/cn";
import { goldenScenarios, type GoldenScenario } from "@/data/golden-scenarios";
import { useTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n/en";

type CheckResult = "pass" | "fail" | "untested";

interface ScenarioState {
  results: Record<string, CheckResult>;
}

const CATEGORY_LABEL_KEYS: Record<string, TranslationKey> = {
  intake: "qaScreen.cat_intake",
  extraction: "qaScreen.cat_extraction",
  correction: "qaScreen.cat_correction",
  routing: "qaScreen.cat_routing",
  report: "qaScreen.cat_report",
  audit: "qaScreen.cat_audit",
  safety: "qaScreen.cat_safety",
};

const CATEGORY_ORDER = ["intake", "extraction", "correction", "routing", "report", "audit", "safety"];

interface QaScreenProps {
  onLoadScenario?: (narrative: string) => void;
}

export function QaScreen({ onLoadScenario }: QaScreenProps) {
  const { t } = useTranslation();
  const [selectedId, setSelectedId] = useState<string>(goldenScenarios[0].id);
  const [scenarioStates, setScenarioStates] = useState<Record<string, ScenarioState>>({});
  const [copyMsg, setCopyMsg] = useState<string | null>(null);

  const selected = goldenScenarios.find((s) => s.id === selectedId) ?? goldenScenarios[0];

  function gsLabel(id: string, fallback: string): string {
    const key = `goldenScenario.${id}.label` as TranslationKey;
    const v = t(key);
    return v !== key ? v : fallback;
  }

  function getState(scenarioId: string): ScenarioState {
    return scenarioStates[scenarioId] ?? { results: {} };
  }

  function setCheckResult(scenarioId: string, checkId: string, result: CheckResult) {
    setScenarioStates((prev) => {
      const current = prev[scenarioId] ?? { results: {} };
      return {
        ...prev,
        [scenarioId]: {
          results: { ...current.results, [checkId]: result },
        },
      };
    });
  }

  function getResult(scenarioId: string, checkId: string): CheckResult {
    return getState(scenarioId).results[checkId] ?? "untested";
  }

  // ── Aggregate metrics ──
  const metrics = useMemo(() => {
    let totalItems = 0;
    let passed = 0;
    let failed = 0;
    let untested = 0;
    let scenariosTested = 0;
    let scenariosPassed = 0;
    const failedLabels: string[] = [];

    for (const scenario of goldenScenarios) {
      let scenarioHasTest = false;
      let scenarioAllPass = true;
      for (const check of scenario.checklist) {
        totalItems++;
        const r = getResult(scenario.id, check.id);
        if (r === "pass") { passed++; scenarioHasTest = true; }
        else if (r === "fail") { failed++; scenarioHasTest = true; scenarioAllPass = false; failedLabels.push(`${gsLabel(scenario.id, scenario.label)}: ${check.label}`); }
        else { untested++; scenarioAllPass = false; }
      }
      if (scenarioHasTest) scenariosTested++;
      if (scenarioHasTest && scenarioAllPass) scenariosPassed++;
    }

    return { totalItems, passed, failed, untested, scenariosTested, scenariosPassed, failedLabels };
  }, [scenarioStates]);

  function handleCopyNarrative() {
    navigator.clipboard.writeText(selected.narrative).then(() => {
      setCopyMsg(t("qaScreen.copied"));
      setTimeout(() => setCopyMsg(null), 1500);
    });
  }

  // ── Group checklist by category ──
  const groupedChecklist = useMemo(() => {
    const groups: { category: string; label: string; items: typeof selected.checklist }[] = [];
    for (const cat of CATEGORY_ORDER) {
      const items = selected.checklist.filter((c) => c.category === cat);
      if (items.length > 0) {
        groups.push({ category: cat, label: CATEGORY_LABEL_KEYS[cat] ? t(CATEGORY_LABEL_KEYS[cat]) : cat, items });
      }
    }
    return groups;
  }, [selected]);

  return (
    <section className="mx-auto max-w-[1360px] px-6 py-10 lg:py-14">
      <SectionLabel>{t("qaScreen.section_label")}</SectionLabel>
      <h2 className="mt-3 font-sans text-heading-lg font-semibold leading-tight tracking-tighter text-ink">
        {t("qaScreen.heading")}
      </h2>
      <p className="mt-2 max-w-[560px] text-body leading-relaxed text-ink-secondary">
        {t("qaScreen.subtitle")}
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* ─── Main column ─── */}
        <div>
          {/* Scenario selector */}
          <div className="flex flex-wrap gap-2">
            {goldenScenarios.map((s) => {
              const st = getState(s.id);
              const total = s.checklist.length;
              const passCount = s.checklist.filter((c) => st.results[c.id] === "pass").length;
              const checkedCount = s.checklist.filter((c) => st.results[c.id] === "pass" || st.results[c.id] === "fail").length;
              const hasFail = s.checklist.some((c) => st.results[c.id] === "fail");
              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedId(s.id)}
                  className={cn(
                    "rounded-lg border px-3.5 py-2.5 text-left transition-all",
                    selectedId === s.id
                      ? "border-ink/20 bg-surface shadow-sm ring-1 ring-ink/5"
                      : "border-rule-light bg-warm-white hover:shadow-sm",
                  )}
                >
                  <span className="block text-body-sm font-semibold text-ink">{gsLabel(s.id, s.label)}</span>
                  <span className="mt-0.5 block font-mono text-eyebrow text-muted">
                    {checkedCount === 0 ? t("qaScreen.not_run") : `${checkedCount}/${total} ${t("qaScreen.checked")} · ${passCount} ${t("qaScreen.passed")}`}
                    {hasFail && <span className="ml-1 text-emergency">· {t("qaScreen.has_failures")}</span>}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Scenario detail */}
          <div className="mt-6 rounded-card border border-rule-light bg-warm-white shadow-card p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-caption font-medium uppercase tracking-eyebrow text-muted">
                  {t("qaScreen.scenario_label")}
                </p>
                <h3 className="mt-1 text-body-lg font-semibold text-ink">{gsLabel(selected.id, selected.label)}</h3>
              </div>
              <span className="shrink-0 rounded-badge border border-rule-light bg-surface px-2.5 py-0.5 font-mono text-caption font-medium text-ink-secondary">
                {selected.expectedRoute}
              </span>
            </div>

            {/* Narrative */}
            <div className="mt-4 rounded-lg border border-rule-light/60 bg-surface/40 p-3">
              <p className="mb-1 font-mono text-caption font-medium uppercase tracking-eyebrow text-muted">
                {t("qaScreen.source_narrative")}
              </p>
              <p className="text-body-sm leading-relaxed text-ink-secondary">{selected.narrative}</p>
            </div>

            {/* Actions */}
            <div className="mt-3 flex flex-wrap gap-2">
              {onLoadScenario && (
                <button
                  onClick={() => onLoadScenario(selected.narrative)}
                  className="inline-flex h-8 items-center rounded-btn border border-rule bg-warm-white px-3 font-mono text-caption uppercase tracking-wide text-ink-secondary transition-all hover:border-ink/30 hover:text-ink"
                >
                  {t("qaScreen.load_into_flow")}
                </button>
              )}
              <button
                onClick={handleCopyNarrative}
                className="inline-flex h-8 items-center rounded-btn border border-rule bg-paper px-3 font-mono text-caption uppercase tracking-wide text-ink-secondary transition-all hover:border-accent hover:text-ink"
              >
                {copyMsg ?? t("qaScreen.copy_narrative")}
              </button>
            </div>

            {/* Expected fields */}
            <div className="mt-4">
              <p className="mb-2 font-mono text-caption font-medium uppercase tracking-eyebrow text-muted">
                {t("qaScreen.expected_fields")}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(selected.expectedKeyFields).map(([key, val]) => (
                  <span key={key} className="rounded-badge border border-rule-light bg-surface px-2 py-0.5 font-mono text-caption text-ink-secondary">
                    {key.replace(/_/g, " ")}: {String(val)}
                  </span>
                ))}
              </div>
            </div>

            {/* Expected safety */}
            <div className="mt-3">
              <span className="font-mono text-eyebrow text-muted">{t("qaScreen.expected_safety")} </span>
              <span className={cn(
                "font-mono text-eyebrow font-semibold",
                selected.expectedSafetyStatus === "TRIGGERED" ? "text-emergency" : "text-routine",
              )}>
                {selected.expectedSafetyStatus}
              </span>
            </div>
          </div>

          {/* Checklist */}
          <div className="mt-6 space-y-4">
            {groupedChecklist.map((group) => (
              <div key={group.category} className="rounded-card border border-rule-light/80 bg-warm-white shadow-card p-5">
                <p className="mb-3 font-mono text-eyebrow font-semibold uppercase tracking-wide text-muted/60">
                  {group.label}
                </p>
                <div className="space-y-2">
                  {group.items.map((check) => {
                    const result = getResult(selected.id, check.id);
                    return (
                      <div key={check.id} className="flex items-center gap-3">
                        <div className="flex shrink-0 gap-1">
                          <ResultButton
                            active={result === "pass"}
                            color="routine"
                            label={t("qaScreen.btn_pass")}
                            onClick={() => setCheckResult(selected.id, check.id, result === "pass" ? "untested" : "pass")}
                          />
                          <ResultButton
                            active={result === "fail"}
                            color="emergency"
                            label={t("qaScreen.btn_fail")}
                            onClick={() => setCheckResult(selected.id, check.id, result === "fail" ? "untested" : "fail")}
                          />
                        </div>
                        <span className={cn(
                          "text-body-sm",
                          result === "pass" ? "text-ink-secondary" : result === "fail" ? "text-emergency" : "text-muted",
                        )}>
                          {check.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Sidebar ─── */}
        <aside className="space-y-4 lg:sticky lg:top-header lg:self-start">
          {/* QA summary */}
          <div className="rounded-card border border-rule-light/80 bg-warm-white shadow-card p-5">
            <p className="font-mono text-eyebrow font-medium uppercase tracking-eyebrow text-muted">
              {t("qaScreen.sidebar_title")}
            </p>
            <div className="mt-3 space-y-2 text-meta">
              <MetricRow label={t("qaScreen.metric_tested")} value={`${metrics.scenariosTested}/${goldenScenarios.length}`} />
              <MetricRow label={t("qaScreen.metric_passed")} value={String(metrics.scenariosPassed)} highlight={metrics.scenariosPassed === goldenScenarios.length} />
              <MetricRow label={t("qaScreen.metric_items_passed")} value={`${metrics.passed}/${metrics.totalItems}`} />
              <MetricRow label={t("qaScreen.metric_failed")} value={String(metrics.failed)} warn={metrics.failed > 0} />
              <MetricRow label={t("qaScreen.metric_untested")} value={String(metrics.untested)} />
              <div className="border-t border-rule-light pt-2">
                <MetricRow label={t("qaScreen.metric_dx")} value="0" />
                <MetricRow label={t("qaScreen.metric_rx")} value="0" />
              </div>
            </div>
            <p className="mt-3 border-t border-rule-light pt-2 text-eyebrow text-muted">
              {t("qaScreen.sidebar_disclaimer")}
            </p>
          </div>

          {/* Failed items summary */}
          {metrics.failed > 0 && (
            <div className="rounded-card border border-emergency/20 bg-emergency-soft p-5">
              <p className="font-mono text-eyebrow font-medium uppercase text-emergency">
                {t("qaScreen.failed_heading")}
              </p>
              <div className="mt-2 space-y-1">
                {metrics.failedLabels.map((label, i) => (
                  <p key={i} className="text-caption text-emergency/80">{label}</p>
                ))}
              </div>
            </div>
          )}

          {/* Manual steps */}
          <div className="rounded-card border border-rule-light/80 bg-warm-white shadow-card p-5">
            <p className="font-mono text-eyebrow font-medium uppercase tracking-eyebrow text-muted">
              {t("qaScreen.manual_heading")}
            </p>
            <div className="mt-3 space-y-2">
              {([
                "qaScreen.step_1" as TranslationKey,
                "qaScreen.step_2" as TranslationKey,
                "qaScreen.step_3" as TranslationKey,
                "qaScreen.step_4" as TranslationKey,
                "qaScreen.step_5" as TranslationKey,
                "qaScreen.step_6" as TranslationKey,
                "qaScreen.step_7" as TranslationKey,
                "qaScreen.step_8" as TranslationKey,
                "qaScreen.step_9" as TranslationKey,
              ]).map((key, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-rule bg-surface font-mono text-eyebrow font-semibold text-muted">
                    {i + 1}
                  </span>
                  <span className="text-caption leading-snug text-ink-secondary">{t(key)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Governance note */}
          <div className="rounded-card border border-rule-light/80 bg-warm-white shadow-card p-5">
            <p className="font-mono text-eyebrow font-medium uppercase tracking-eyebrow text-muted">
              {t("qaScreen.scope_heading")}
            </p>
            <p className="mt-2 text-caption leading-relaxed text-muted">
              {t("qaScreen.scope_body")}
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

// ── Sub-components ──────────────────────────────────────────────

function ResultButton({
  active,
  color,
  label,
  onClick,
}: {
  active: boolean;
  color: "routine" | "emergency";
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex h-6 w-6 items-center justify-center rounded border font-mono text-eyebrow font-bold transition-all",
        active && color === "routine" && "border-routine bg-routine/20 text-routine",
        active && color === "emergency" && "border-emergency bg-emergency/20 text-emergency",
        !active && "border-rule-light bg-surface text-muted/40 hover:border-rule hover:text-muted",
      )}
    >
      {label}
    </button>
  );
}

function MetricRow({
  label,
  value,
  highlight,
  warn,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  warn?: boolean;
}) {
  return (
    <div className="flex justify-between">
      <span className="text-muted">{label}</span>
      <span className={cn(
        "font-mono text-label font-medium",
        warn ? "text-emergency" : highlight ? "text-routine" : "text-ink-secondary",
      )}>
        {value}
      </span>
    </div>
  );
}
