"use client";

import { useState, useMemo } from "react";
import { SectionLabel } from "@/components/ui/section-label";
import { CardPanel } from "@/components/ui/card-panel";
import { exampleCases } from "@/mock/example-cases";
import type { ExampleCaseId } from "@/types";
import { cn } from "@/lib/cn";
import { useTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n/en";
import {
  analyzeNarrativeSignals,
  groupSignalStatuses,
  getIntakeCompleteness,
  getConsiderAddingItems,
  buildExtractionText,
  buildStructuredAdditions,
  hasQuickFieldData,
  EMPTY_QUICK_FIELDS,
  type IntakeQuickFields,
  type IntakeCompletenessLevel,
} from "@/lib/cardio/intake-guidance";

const CASE_META: Record<
  ExampleCaseId,
  { badgeKey: TranslationKey; badgeColor: string }
> = {
  NEEDS_MORE_INFO: {
    badgeKey: "intake.badge_needs_info",
    badgeColor: "bg-caution/8 text-caution border-caution/20",
  },
  ROUTINE_REVIEW: {
    badgeKey: "intake.badge_routine",
    badgeColor: "bg-accent-soft text-accent border-accent/20",
  },
  URGENT_ESCALATION: {
    badgeKey: "intake.badge_urgent",
    badgeColor: "bg-urgent-soft/60 text-urgent border-urgent/20",
  },
  EMERGENCY_ROUTE: {
    badgeKey: "intake.badge_emergency",
    badgeColor: "bg-emergency-soft/60 text-emergency border-emergency/15",
  },
  DEFERRED_PENDING_DATA: {
    badgeKey: "intake.badge_conflict",
    badgeColor: "bg-caution/8 text-caution border-caution/20",
  },
};

const COMPLETENESS_COLORS: Record<IntakeCompletenessLevel, { text: string; bg: string; border: string }> = {
  strong:   { text: "text-routine",    bg: "bg-accent-soft",     border: "border-routine/30" },
  moderate: { text: "text-urgent",     bg: "bg-urgent-soft",     border: "border-urgent/30" },
  limited:  { text: "text-emergency",  bg: "bg-emergency-soft",  border: "border-emergency/30" },
};

const COMPLETENESS_LEVEL_KEYS: Record<IntakeCompletenessLevel, TranslationKey> = {
  strong: "intake.completeness_strong",
  moderate: "intake.completeness_moderate",
  limited: "intake.completeness_limited",
};

const NEXT_STEP_KEYS: TranslationKey[] = [
  "intake.next_step1",
  "intake.next_step2",
  "intake.next_step3",
  "intake.next_step4",
];

// Signal preview tag translation keys
const SIGNAL_TAG_KEYS: Record<string, TranslationKey> = {
  age: "signal.age",
  "chest pain": "signal.chest_pain",
  vitals: "signal.vitals",
  meds: "signal.meds",
  duration: "signal.duration",
  character: "signal.character",
  history: "signal.history",
  radiation: "signal.radiation",
  exertional: "signal.exertional",
  severity: "signal.severity",
  syncope: "signal.syncope",
  contradictions: "signal.contradictions",
};

interface IntakeScreenProps {
  onSubmit: (narrative: string, exampleCaseId: ExampleCaseId | null) => void;
}

export function IntakeScreen({ onSubmit }: IntakeScreenProps) {
  const [narrative, setNarrative] = useState("");
  const [selectedExample, setSelectedExample] = useState<ExampleCaseId | null>(null);
  const [quickFields, setQuickFields] = useState<IntakeQuickFields>(EMPTY_QUICK_FIELDS);
  const [showPreparedText, setShowPreparedText] = useState(false);
  const { t } = useTranslation();

  // Combined text for signal analysis includes narrative + quick field additions
  const combinedText = useMemo(
    () => buildExtractionText(narrative, quickFields),
    [narrative, quickFields],
  );
  const signalStatus = useMemo(() => analyzeNarrativeSignals(combinedText, t), [combinedText, t]);
  const signalGroups = useMemo(() => groupSignalStatuses(signalStatus, t), [signalStatus, t]);
  const completeness = useMemo(() => getIntakeCompleteness(signalStatus, t), [signalStatus, t]);
  const considerAdding = useMemo(() => getConsiderAddingItems(signalStatus), [signalStatus]);
  const hasQuickData = useMemo(() => hasQuickFieldData(quickFields), [quickFields]);
  const structuredAdditions = useMemo(() => buildStructuredAdditions(quickFields), [quickFields]);

  function handleExampleSelect(id: ExampleCaseId) {
    const example = exampleCases.find((c) => c.id === id);
    if (example) {
      setSelectedExample(id);
      const narrativeKey = `exampleCase.${id}.narrative` as TranslationKey;
      const translated = t(narrativeKey);
      setNarrative(translated !== narrativeKey ? translated : example.narrative);
      setQuickFields(EMPTY_QUICK_FIELDS);
    }
  }

  function handleNarrativeChange(text: string) {
    setNarrative(text);
    if (selectedExample) setSelectedExample(null);
  }

  function handleQuickFieldChange(key: keyof IntakeQuickFields, value: string) {
    setQuickFields((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit() {
    const finalText = buildExtractionText(narrative, quickFields);
    if (finalText.trim().length === 0) return;
    onSubmit(finalText, selectedExample);
  }

  const hasNarrative = narrative.trim().length > 0;

  return (
    <section className="mx-auto max-w-[1360px] px-6 py-10 lg:py-14">
      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        {/* ─── Main column ─── */}
        <div>
          <SectionLabel>{t("intake.section_label")}</SectionLabel>
          <h2 className="mt-3 font-sans text-heading-lg font-semibold text-ink">
            {t("intake.heading")}
          </h2>
          <p className="mt-3 max-w-[560px] text-body leading-relaxed text-ink-secondary">
            {t("intake.body")}
          </p>

          {/* ── Example case cards ── */}
          <div className="mt-8">
            <p className="mb-3 font-mono text-eyebrow font-medium uppercase text-muted">
              {t("intake.example_cases_label")}
            </p>
            <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
              {exampleCases.map((c) => {
                const meta = CASE_META[c.id];
                const isSelected = selectedExample === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => handleExampleSelect(c.id)}
                    className={cn(
                      "group rounded-card border border-rule-light/80 bg-warm-white p-4 text-left shadow-card transition-all hover:shadow-card-hover",
                      isSelected && "border-accent/40 ring-1 ring-accent/15 shadow-[0_0_0_1px_rgba(45,106,79,0.08),0_1px_6px_rgba(45,106,79,0.10)]",
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-body-sm font-semibold text-ink">{t(`exampleCase.${c.id}.label` as TranslationKey)}</span>
                      <span className={cn("shrink-0 rounded-badge border px-2.5 py-0.5 font-mono text-eyebrow font-medium uppercase", meta.badgeColor)}>
                        {t(meta.badgeKey)}
                      </span>
                    </div>
                    <p className="mt-1.5 text-caption leading-relaxed text-muted">
                      {t(`exampleCase.${c.id}.description` as TranslationKey)}
                    </p>
                    {c.expectedRoute && (
                      <p className="mt-1.5 font-mono text-eyebrow text-muted/70">
                        {t("intake.scenario_route_prefix")} {t(`exampleCase.${c.id}.route` as TranslationKey)}
                      </p>
                    )}
                    {c.signalsPreview && c.signalsPreview.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {c.signalsPreview.map((s) => (
                          <span key={s} className="rounded-badge border border-rule-light bg-surface/50 px-1.5 py-0.5 font-mono text-eyebrow text-muted">
                            {SIGNAL_TAG_KEYS[s] ? t(SIGNAL_TAG_KEYS[s]) : s}
                          </span>
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Narrative textarea ── */}
          <div className="mt-8">
            <label htmlFor="narrative" className="mb-2 block text-body font-semibold text-ink">
              {t("intake.narrative_label")}
            </label>
            <textarea
              id="narrative"
              value={narrative}
              onChange={(e) => handleNarrativeChange(e.target.value)}
              placeholder={t("intake.narrative_placeholder")}
              className="min-h-[200px] w-full resize-y rounded-card border border-rule bg-white p-5 font-sans text-body leading-relaxed text-ink placeholder:text-muted/50 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
              spellCheck={false}
            />
          </div>

          {/* ── Optional quick fields ── */}
          <CardPanel className="mt-5">
            <details>
              <summary className="cursor-pointer font-mono text-label font-medium uppercase tracking-label text-muted transition-colors hover:text-ink-secondary">
                {t("intake.quick_fields_summary")}
                <span className="ml-2 font-normal normal-case tracking-normal text-caption text-muted/70">
                  {t("intake.quick_fields_hint")}
                </span>
              </summary>
              <p className="mt-2 text-caption text-muted">
                {t("intake.quick_fields_explanation")}
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <QuickInput label={t("intake.quick_label_age")} value={quickFields.age} placeholder={t("intake.quick_placeholder_age")} onChange={(v) => handleQuickFieldChange("age", v)} />
                <QuickInput label={t("intake.quick_label_systolic_bp")} value={quickFields.systolic_bp} placeholder={t("intake.quick_placeholder_bp")} onChange={(v) => handleQuickFieldChange("systolic_bp", v)} />
                <QuickInput label={t("intake.quick_label_heart_rate")} value={quickFields.heart_rate} placeholder={t("intake.quick_placeholder_hr")} onChange={(v) => handleQuickFieldChange("heart_rate", v)} />
                <QuickSelect label={t("intake.quick_label_known_cad")} value={quickFields.known_cad} options={[["", "—"], ["yes", t("intake.quick_option_yes")], ["no", t("intake.quick_option_no")]]} onChange={(v) => handleQuickFieldChange("known_cad", v)} />
                <QuickSelect label={t("intake.quick_label_prior_mi")} value={quickFields.prior_mi} options={[["", "—"], ["yes", t("intake.quick_option_yes")], ["no", t("intake.quick_option_no")]]} onChange={(v) => handleQuickFieldChange("prior_mi", v)} />
                <QuickInput label={t("intake.quick_label_current_meds")} value={quickFields.current_meds} placeholder={t("intake.quick_placeholder_meds")} onChange={(v) => handleQuickFieldChange("current_meds", v)} />
              </div>
              {hasQuickData && structuredAdditions && (
                <div className="mt-3 rounded-btn border border-rule-light bg-surface/40 p-3">
                  <p className="mb-1 font-mono text-eyebrow font-medium uppercase text-muted">
                    {t("intake.structured_additions_label")}
                  </p>
                  <p className="font-mono text-meta text-ink-secondary">{structuredAdditions}</p>
                </div>
              )}
            </details>
          </CardPanel>

          {/* ── Prepared extraction text preview ── */}
          {hasNarrative && (
            <div className="mt-4">
              <button
                onClick={() => setShowPreparedText(!showPreparedText)}
                className="font-mono text-label font-medium uppercase tracking-label text-muted transition-colors hover:text-ink-secondary"
              >
                {showPreparedText ? t("intake.prepared_text_hide") : t("intake.prepared_text_show")}
              </button>
              {showPreparedText && (
                <div className="mt-2 rounded-btn border border-rule-light bg-surface/40 p-4">
                  <p className="mb-1.5 font-mono text-eyebrow text-muted">
                    {t("intake.prepared_text_explanation")}
                  </p>
                  <pre className="whitespace-pre-wrap font-sans text-body-sm leading-relaxed text-ink-secondary">
                    {combinedText}
                  </pre>
                  {!hasQuickData && (
                    <p className="mt-2 font-mono text-eyebrow text-muted/60">{t("intake.no_structured_additions")}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── Submit ── */}
          {hasNarrative && (
            <p className="mt-6 max-w-[540px] text-caption leading-relaxed text-muted">
              {t("intake.pre_submit_note")}
            </p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-4">
            <button
              onClick={handleSubmit}
              disabled={!hasNarrative}
              className="inline-flex h-11 items-center gap-2 rounded-btn bg-ink px-6 font-mono text-label font-medium uppercase text-warm-white shadow-btn transition-all hover:-translate-y-px hover:shadow-card-hover disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none disabled:hover:translate-y-0"
            >
              {t("intake.submit_button")}
            </button>
            {selectedExample && (
              <span className="rounded-badge border border-rule/60 bg-surface-raised px-3 py-1 font-mono text-label font-medium text-ink-secondary">
                {t("intake.using_example")} {selectedExample.replace(/_/g, " ").toLowerCase()}
              </span>
            )}
          </div>
        </div>

        {/* ─── Sidebar ─── */}
        <aside className="space-y-4 lg:sticky lg:top-header lg:self-start">

          {/* Intake completeness */}
          {hasNarrative && (
            <div className="rounded-card border border-rule-light/80 bg-warm-white p-5 shadow-card">
              <p className="font-mono text-eyebrow font-medium uppercase tracking-eyebrow text-muted">
                {t("intake.completeness_title")}
              </p>
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "rounded-badge border px-2.5 py-0.5 font-mono text-eyebrow font-semibold uppercase",
                    COMPLETENESS_COLORS[completeness.level].text,
                    COMPLETENESS_COLORS[completeness.level].bg,
                    COMPLETENESS_COLORS[completeness.level].border,
                  )}>
                    {t(COMPLETENESS_LEVEL_KEYS[completeness.level])}
                  </span>
                  <span className="font-mono text-eyebrow text-muted">
                    {completeness.detectedCount}/{signalStatus.length} {t("intake.signals_count_suffix")}
                  </span>
                </div>
                <p className="text-caption leading-relaxed text-ink-secondary">
                  {completeness.message}
                </p>
              </div>
            </div>
          )}

          {/* Signals Soficca looks for — grouped */}
          <div className="rounded-card border border-rule-light/80 bg-warm-white p-5 shadow-card">
            <p className="font-mono text-eyebrow font-medium uppercase tracking-eyebrow text-muted">
              {t("intake.signals_title")}
            </p>
            <div className="mt-3 space-y-3">
              {signalGroups.map((group) => (
                <div key={group.id}>
                  <p className="mb-1 font-mono text-eyebrow font-semibold uppercase text-muted/60">
                    {group.label}
                  </p>
                  <div className="space-y-1">
                    {group.signals.map((s) => (
                      <div key={s.key} className="flex items-center gap-2">
                        <span className={cn(
                          "block h-[7px] w-[7px] rounded-full transition-colors",
                          s.status === "detected" ? "bg-routine" : "bg-muted/20",
                        )} />
                        <span className={cn(
                          "text-caption transition-colors",
                          s.status === "detected" ? "text-ink-secondary" : "text-muted",
                        )}>
                          {s.label}
                        </span>
                        {s.status === "detected" && (
                          <span className="ml-auto font-mono text-eyebrow text-routine">{t("intake.signal_likely")}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 border-t border-rule-light pt-2 text-eyebrow text-muted">
              {t("intake.signals_footer")}
            </p>
          </div>

          {/* Consider adding */}
          {hasNarrative && considerAdding.length > 0 && (
            <div className="rounded-card border border-rule-light/80 bg-warm-white p-5 shadow-card">
              <p className="font-mono text-eyebrow font-medium uppercase tracking-eyebrow text-muted">
                {t("intake.consider_adding_title")}
              </p>
              <div className="mt-2.5 space-y-1.5">
                {considerAdding.map((label) => (
                  <div key={label} className="flex items-center gap-2">
                    <span className="block h-1.5 w-1.5 rounded-full bg-urgent/50" />
                    <span className="text-caption text-ink-secondary">{label}</span>
                  </div>
                ))}
              </div>
              <p className="mt-2.5 border-t border-rule-light pt-2 text-eyebrow text-muted">
                {t("intake.consider_adding_footer")}
              </p>
            </div>
          )}

          {/* What happens next */}
          <div className="rounded-card border border-rule-light/80 bg-warm-white p-5 shadow-card">
            <p className="font-mono text-eyebrow font-medium uppercase tracking-eyebrow text-muted">
              {t("intake.next_title")}
            </p>
            <div className="mt-3 space-y-2.5">
              {NEXT_STEP_KEYS.map((key, i) => (
                <div key={key} className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-rule bg-surface font-mono text-eyebrow font-semibold text-muted">
                    {i + 1}
                  </span>
                  <span className="text-caption leading-snug text-ink-secondary">{t(key)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Routing guidance note */}
          <div className="rounded-card border border-rule-light/80 bg-warm-white p-5 shadow-card">
            <p className="font-mono text-eyebrow font-medium uppercase tracking-eyebrow text-muted">
              {t("intake.routing_title")}
            </p>
            <p className="mt-2 text-caption leading-relaxed text-muted">
              {t("intake.routing_body")}
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

// ── Quick field sub-components ──────────────────────────────────

function QuickInput({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1 block font-mono text-eyebrow font-medium text-muted">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-btn border border-rule bg-white px-3 font-mono text-meta text-ink placeholder:text-muted/40 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
      />
    </div>
  );
}

function QuickSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: [string, string][];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1 block font-mono text-eyebrow font-medium text-muted">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full rounded-btn border border-rule bg-white px-3 font-mono text-meta text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
      >
        {options.map(([val, lbl]) => (
          <option key={val} value={val}>{lbl}</option>
        ))}
      </select>
    </div>
  );
}
