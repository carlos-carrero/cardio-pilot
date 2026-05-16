"use client";

import { useState, useCallback, useMemo } from "react";
import { SectionLabel } from "@/components/ui/section-label";
import { CardPanel } from "@/components/ui/card-panel";
import type {
  CardioExtraction,
  CardioExtractionFields,
  CardioFieldEvidence,
  ExtractionQualityFlag,
  EditedFieldDiff,
  HumanCorrectionStatus,
  FieldValue,
} from "@/types";
import { cn } from "@/lib/cn";
import { useTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n/en";

interface ExtractionPreviewScreenProps {
  extraction: CardioExtraction;
  onRunRouting: (finalFields: CardioExtractionFields, correction: HumanCorrectionStatus) => void;
  onBack: () => void;
}

type FieldKey = keyof CardioExtractionFields;

interface FieldGroup {
  titleKey: TranslationKey;
  keys: FieldKey[];
}

const FIELD_GROUPS: FieldGroup[] = [
  { titleKey: "extract.group_patient", keys: ["age"] },
  {
    titleKey: "extract.group_complaint",
    keys: [
      "chest_pain_present",
      "pain_duration_minutes",
      "pain_character",
      "pain_severity",
      "pain_radiation",
      "exertional_chest_pain",
    ],
  },
  {
    titleKey: "extract.group_symptoms",
    keys: ["diaphoresis", "dyspnea", "syncope"],
  },
  { titleKey: "extract.group_vitals", keys: ["systolic_bp", "heart_rate"] },
  {
    titleKey: "extract.group_cv_history",
    keys: ["prior_mi", "known_cad", "cv_risk_factors_count"],
  },
  { titleKey: "extract.group_medication", keys: ["current_meds_none", "current_meds_summary"] },
];

const FIELD_LABELS: Record<FieldKey, TranslationKey> = {
  age: "extract.field_age",
  chest_pain_present: "extract.field_chest_pain_present",
  pain_duration_minutes: "extract.field_pain_duration",
  pain_character: "extract.field_pain_character",
  pain_severity: "extract.field_pain_severity",
  pain_radiation: "extract.field_pain_radiation",
  exertional_chest_pain: "extract.field_exertional",
  diaphoresis: "extract.field_diaphoresis",
  dyspnea: "extract.field_dyspnea",
  syncope: "extract.field_syncope",
  systolic_bp: "extract.field_systolic_bp",
  heart_rate: "extract.field_heart_rate",
  prior_mi: "extract.field_prior_mi",
  known_cad: "extract.field_known_cad",
  cv_risk_factors_count: "extract.field_cv_risk",
  current_meds_none: "extract.field_no_cardiac_meds",
  current_meds_summary: "extract.field_med_summary",
};

const BOOLEAN_FIELDS: ReadonlySet<FieldKey> = new Set([
  "chest_pain_present", "exertional_chest_pain", "diaphoresis",
  "dyspnea", "syncope", "prior_mi", "known_cad", "current_meds_none",
]);

const NUMERIC_FIELDS: ReadonlySet<FieldKey> = new Set([
  "age", "pain_duration_minutes", "systolic_bp", "heart_rate", "cv_risk_factors_count",
]);

const ENUM_OPTIONS: Partial<Record<FieldKey, string[]>> = {
  pain_character: ["pressure", "sharp", "burning", "tightness", "heaviness", "other"],
  pain_severity: ["low", "moderate", "high"],
  pain_radiation: ["none", "left_arm", "right_arm", "jaw", "back", "shoulder", "multiple", "other"],
};

const TEXT_FIELDS: ReadonlySet<FieldKey> = new Set(["current_meds_summary"]);

function formatValue(v: unknown): string {
  if (v === null || v === undefined) return "Unconfirmed";
  if (typeof v === "boolean") return v ? "Yes" : "No";
  return String(v);
}

function getConfidenceLabel(raw: number): { labelKey: TranslationKey; tier: "high" | "moderate" | "low" } {
  if (raw >= 0.90) return { labelKey: "extract.confidence_high", tier: "high" };
  if (raw >= 0.70) return { labelKey: "extract.confidence_moderate", tier: "moderate" };
  return { labelKey: "extract.confidence_low", tier: "low" };
}

function getDisplayConfidence(raw: number): string {
  const pct = Math.round(raw * 100);
  if (pct >= 95) return "95%+";
  return `${pct}%`;
}

function formatFieldConfidence(raw: number): string {
  const pct = Math.round(raw * 100);
  if (pct >= 95) return "95%+";
  return `${pct}%`;
}

const TIER_COLORS = {
  high: { text: "text-accent", bg: "bg-accent" },
  moderate: { text: "text-urgent", bg: "bg-urgent" },
  low: { text: "text-emergency", bg: "bg-emergency" },
} as const;

const QUALITY_FLAG_LABELS: Record<ExtractionQualityFlag, TranslationKey> = {
  low_confidence_extraction: "extract.flag_low_confidence",
  critical_missing_fields: "extract.flag_critical_missing",
  contradictory_narrative: "extract.flag_contradictory",
  limited_vitals: "extract.flag_limited_vitals",
  medication_status_unclear: "extract.flag_med_unclear",
  cardiovascular_history_unclear: "extract.flag_cv_unclear",
  requires_human_confirmation: "extract.flag_requires_confirmation",
  possible_identifier_detected: "extract.flag_pii_detected",
};

const CRITICAL_FIELDS: ReadonlySet<FieldKey> = new Set([
  "age", "chest_pain_present", "pain_severity", "syncope", "systolic_bp", "heart_rate",
]);

// ── Inline editor components ──────────────────────────────────────

function TriStateEditor({ value, onChange }: { value: boolean | null; onChange: (v: boolean | null) => void }) {
  const { t } = useTranslation();
  const opts: { label: string; val: boolean | null }[] = [
    { label: t("extract.option_yes"), val: true },
    { label: t("extract.option_no"), val: false },
    { label: t("extract.option_unconfirmed"), val: null },
  ];
  return (
    <div className="flex gap-1">
      {opts.map((o) => (
        <button
          key={o.label}
          onClick={() => onChange(o.val)}
          className={cn(
            "rounded-btn px-2.5 py-1 font-mono text-label transition-all",
            value === o.val
              ? "border border-ink/30 bg-ink text-warm-white font-medium"
              : "border border-rule-light bg-warm-white text-muted hover:border-rule hover:text-ink-secondary"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function NumericEditor({ value, onChange, placeholder }: {
  value: number | null;
  onChange: (v: number | null) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="number"
      value={value ?? ""}
      placeholder={placeholder ?? "—"}
      onChange={(e) => {
        const raw = e.target.value;
        if (raw === "") { onChange(null); return; }
        const n = parseInt(raw, 10);
        if (!isNaN(n)) onChange(n);
      }}
      className="w-20 rounded-btn border border-rule-light bg-warm-white px-2.5 py-1 font-mono text-meta text-ink transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
    />
  );
}

function EnumEditor({ value, options, onChange }: {
  value: string | null;
  options: string[];
  onChange: (v: string | null) => void;
}) {
  const { t } = useTranslation();
  return (
    <select
      value={value ?? "__null__"}
      onChange={(e) => onChange(e.target.value === "__null__" ? null : e.target.value)}
      className="rounded-btn border border-rule-light bg-warm-white px-2.5 py-1 font-mono text-meta text-ink transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
    >
      <option value="__null__">{t("extract.option_unconfirmed")}</option>
      {options.map((o) => (
        <option key={o} value={o}>{o.replace(/_/g, " ")}</option>
      ))}
    </select>
  );
}

function TextEditor({ value, onChange, placeholder }: {
  value: string | null;
  onChange: (v: string | null) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value ?? ""}
      placeholder={placeholder ?? "—"}
      onChange={(e) => onChange(e.target.value || null)}
      className="w-40 rounded-btn border border-rule-light bg-warm-white px-2.5 py-1 font-mono text-meta text-ink transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
    />
  );
}

// ── Main component ────────────────────────────────────────────────

export function ExtractionPreviewScreen({
  extraction,
  onRunRouting,
  onBack,
}: ExtractionPreviewScreenProps) {
  const originalFields = extraction.fields;
  const [finalFields, setFinalFields] = useState<CardioExtractionFields>(() => ({ ...originalFields }));
  const { t } = useTranslation();

  const updateField = useCallback((key: FieldKey, value: FieldValue) => {
    setFinalFields((prev) => ({ ...prev, [key]: value }));
  }, []);

  const edits = useMemo<EditedFieldDiff[]>(() => {
    const diffs: EditedFieldDiff[] = [];
    for (const key of Object.keys(originalFields) as FieldKey[]) {
      const orig = originalFields[key] as FieldValue;
      const final = finalFields[key] as FieldValue;
      if (orig !== final) {
        diffs.push({ field: key, originalValue: orig, finalValue: final });
      }
    }
    return diffs;
  }, [originalFields, finalFields]);

  const allKeys = Object.keys(finalFields) as FieldKey[];
  const unconfirmedKeys = allKeys.filter((k) => finalFields[k] === null || finalFields[k] === undefined);
  const criticalUnconfirmed = unconfirmedKeys.filter((k) => CRITICAL_FIELDS.has(k));

  const confidenceInfo = getConfidenceLabel(extraction.confidence);
  const displayConfidence = getDisplayConfidence(extraction.confidence);
  const tierColor = TIER_COLORS[confidenceInfo.tier];
  const barWidth = Math.min(Math.round(extraction.confidence * 100), 95);
  const isAI = extraction.extraction_source === "ai";
  const evidence = extraction.field_evidence ?? [];
  const evidenceMap = new Map(evidence.map((e) => [e.field, e]));
  const qualityFlags = extraction.extraction_quality_flags ?? [];
  const piiWarnings = extraction.pii_warnings ?? [];
  const missingInfo = extraction.missing_information;
  const completionQs = extraction.completion_questions ?? [];
  const summary = extraction.structured_clinical_summary;
  const editedKeySet = new Set(edits.map((e) => e.field));

  function tFormatValue(v: unknown): string {
    if (v === null || v === undefined) return t("extract.option_unconfirmed");
    if (typeof v === "boolean") return v ? t("extract.option_yes") : t("extract.option_no");
    return String(v);
  }

  function handleRunRouting() {
    const correction: HumanCorrectionStatus = {
      humanEditsApplied: edits.length > 0,
      fieldsEdited: edits.length,
      diffs: edits,
    };
    onRunRouting(finalFields, correction);
  }

  function renderFieldEditor(key: FieldKey) {
    if (BOOLEAN_FIELDS.has(key)) {
      return <TriStateEditor value={finalFields[key] as boolean | null} onChange={(v) => updateField(key, v)} />;
    }
    if (NUMERIC_FIELDS.has(key)) {
      return <NumericEditor value={finalFields[key] as number | null} onChange={(v) => updateField(key, v)} />;
    }
    const enumOpts = ENUM_OPTIONS[key];
    if (enumOpts) {
      return <EnumEditor value={finalFields[key] as string | null} options={enumOpts} onChange={(v) => updateField(key, v)} />;
    }
    if (TEXT_FIELDS.has(key)) {
      return <TextEditor value={finalFields[key] as string | null} onChange={(v) => updateField(key, v)} />;
    }
    return <span className="font-mono text-meta text-ink">{tFormatValue(finalFields[key])}</span>;
  }

  return (
    <section className="mx-auto max-w-[1360px] px-6 py-10 lg:py-14">
      <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
        {/* Main column */}
        <div>
          <SectionLabel>{t("extract.section_label")}</SectionLabel>
          <h2 className="mt-3 font-sans text-heading-lg font-semibold text-ink">
            {t("extract.heading")}
          </h2>

          {/* Source + boundary banner */}
          <div className="mt-5 flex items-start gap-3 rounded-card border border-rule-light/80 bg-surface px-5 py-4">
            <span className="mt-0.5 shrink-0 text-ink-secondary">●</span>
            <div>
              <p className="text-body font-semibold text-ink">
                {t("extract.banner_text")}
              </p>
              <div className="mt-1.5 flex items-center gap-2">
                <span className={cn("h-1.5 w-1.5 rounded-full", isAI ? "bg-routine" : "bg-muted/50")} />
                <p className="font-mono text-label text-muted">
                  {isAI ? t("extract.source_ai") : t("extract.source_mock")}
                </p>
              </div>
            </div>
          </div>

          {/* ── AI Intelligence Layer ── */}

          {summary && (
            <CardPanel className="mt-6 p-5">
              <h3 className="mb-2 font-mono text-label font-medium uppercase tracking-label text-ink-secondary">
                {t("extract.summary_heading")}
              </h3>
              <p className="text-body-sm leading-relaxed text-ink-secondary">{summary}</p>
              <p className="mt-2 font-mono text-eyebrow text-muted/70">
                {t("extract.summary_disclaimer")}
              </p>
            </CardPanel>
          )}

          {(qualityFlags.length > 0 || piiWarnings.length > 0) && (
            <div className="mt-4 flex flex-wrap gap-3">
              {qualityFlags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {qualityFlags.map((flag) => (
                    <span key={flag} className="rounded-badge border border-rule bg-surface px-2.5 py-0.5 font-mono text-label text-ink-secondary">
                      {t(QUALITY_FLAG_LABELS[flag])}
                    </span>
                  ))}
                </div>
              )}
              {piiWarnings.length > 0 && (
                <div className="flex w-full items-start gap-2 rounded-card border border-urgent/20 bg-urgent-soft px-4 py-3">
                  <span className="mt-0.5 text-meta text-urgent">⚠</span>
                  <div>
                    <p className="text-caption font-medium text-urgent">{t("extract.pii_title")}</p>
                    <p className="mt-0.5 text-caption text-muted">{t("extract.pii_body")}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {missingInfo && (
            missingInfo.required_for_routing.length > 0 ||
            missingInfo.clinically_useful.length > 0 ||
            missingInfo.unconfirmed.length > 0
          ) && (
            <CardPanel className="mt-4 p-5">
              <h3 className="mb-3 font-mono text-label font-medium uppercase tracking-label text-ink-secondary">{t("extract.missing_heading")}</h3>
              <div className="space-y-3">
                {missingInfo!.required_for_routing.length > 0 && (
                  <div>
                    <p className="mb-1.5 font-mono text-eyebrow font-medium uppercase text-emergency">{t("extract.missing_required")}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {missingInfo!.required_for_routing.map((f, i) => (
                        <span key={i} className="rounded-badge border border-emergency/20 bg-emergency-soft px-2.5 py-0.5 font-mono text-label text-emergency">{f.replace(/_/g, " ")}</span>
                      ))}
                    </div>
                  </div>
                )}
                {missingInfo!.clinically_useful.length > 0 && (
                  <div>
                    <p className="mb-1.5 font-mono text-eyebrow font-medium uppercase text-urgent">{t("extract.missing_useful")}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {missingInfo!.clinically_useful.map((f, i) => (
                        <span key={i} className="rounded-badge border border-urgent/20 bg-urgent-soft px-2.5 py-0.5 font-mono text-label text-urgent">{f.replace(/_/g, " ")}</span>
                      ))}
                    </div>
                  </div>
                )}
                {missingInfo!.unconfirmed.length > 0 && (
                  <div>
                    <p className="mb-1.5 font-mono text-eyebrow font-medium uppercase text-muted">{t("extract.missing_unconfirmed")}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {missingInfo!.unconfirmed.map((f, i) => (
                        <span key={i} className="rounded-badge border border-rule bg-surface px-2.5 py-0.5 font-mono text-label text-muted">{f.replace(/_/g, " ")}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardPanel>
          )}

          {completionQs.length > 0 && (
            <CardPanel className="mt-4 p-5">
              <h3 className="mb-2 font-mono text-label font-medium uppercase tracking-label text-ink-secondary">{t("extract.questions_heading")}</h3>
              <div className="space-y-2">
                {completionQs.map((q, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-body-sm">
                    <span className="mt-[3px] flex h-4 w-4 shrink-0 items-center justify-center rounded border border-rule-light bg-surface">
                      <span className="block h-1.5 w-1.5 rounded-[1px] bg-transparent" />
                    </span>
                    <span className="leading-relaxed text-ink-secondary">{q}</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 font-mono text-eyebrow text-muted/70">{t("extract.questions_disclaimer")}</p>
            </CardPanel>
          )}

          {/* ── Editable grouped field cards ── */}
          <div className="mt-6 space-y-3">
            {FIELD_GROUPS.map((group) => (
              <CardPanel key={group.titleKey} className="p-5">
                <h3 className="mb-3 font-mono text-label font-medium uppercase tracking-label text-ink-secondary">
                  {t(group.titleKey)}
                </h3>
                <div className="space-y-0">
                  {group.keys.map((key) => {
                    const isEdited = editedKeySet.has(key);
                    const ev = evidenceMap.get(key);
                    const origVal = originalFields[key];
                    return (
                      <div key={key} className={cn(
                        "border-b border-rule-light/40 py-3 last:border-b-0",
                        isEdited && "bg-accent/[0.03] -mx-2 px-2 rounded"
                      )}>
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-body-sm text-ink-secondary">{t(FIELD_LABELS[key])}</span>
                            {isEdited && (
                              <span className="rounded-badge bg-accent/10 px-1.5 py-0.5 font-mono text-eyebrow font-medium text-accent">
                                {t("extract.edited_badge")}
                              </span>
                            )}
                          </div>
                          <div>{renderFieldEditor(key)}</div>
                        </div>
                        {isEdited && (
                          <p className="mt-1 font-mono text-eyebrow text-muted">
                            {t("extract.diff_ai_prefix")} {tFormatValue(origVal)} → {t("extract.diff_final_prefix")} {tFormatValue(finalFields[key])}
                          </p>
                        )}
                        {ev && (
                          <div className="mt-1 flex items-start gap-2 pl-1">
                            <span className="mt-0.5 block h-1 w-1 shrink-0 rounded-full bg-accent/40" />
                            <p className="text-caption italic leading-snug text-muted">
                              &ldquo;{ev.source_text}&rdquo;
                              <span className="ml-1.5 not-italic font-mono text-eyebrow text-accent/60">
                                {formatFieldConfidence(ev.confidence)}
                              </span>
                              {isEdited && (
                                <span className="ml-1.5 not-italic font-mono text-eyebrow text-muted/60">
                                  {t("extract.evidence_ai_note")}
                                </span>
                              )}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardPanel>
            ))}
          </div>

          {evidence.length > 0 && (
            <p className="mt-3 text-caption text-muted">
              {t("extract.evidence_footer")}
            </p>
          )}

          {extraction.possible_conflicts && extraction.possible_conflicts.length > 0 && (
            <CardPanel className="mt-4 border-l-[3px] border-l-caution">
              <h3 className="mb-2 font-mono text-label font-medium uppercase tracking-label text-ink-secondary">{t("extract.conflicts_heading")}</h3>
              <ul className="space-y-1">
                {extraction.possible_conflicts.map((c, i) => (
                  <li key={i} className="text-body-sm leading-relaxed text-ink-secondary">{c}</li>
                ))}
              </ul>
            </CardPanel>
          )}

          {extraction.unmapped_signals.length > 0 && (
            <CardPanel className="mt-4 border-l-[3px] border-l-muted">
              <h3 className="mb-2 font-mono text-label font-medium uppercase tracking-label text-ink-secondary">{t("extract.unmapped_heading")}</h3>
              <ul className="space-y-1">
                {extraction.unmapped_signals.map((s, i) => (
                  <li key={i} className="text-body-sm leading-relaxed text-ink-secondary">{s}</li>
                ))}
              </ul>
            </CardPanel>
          )}

          {extraction.warnings.length > 0 && (
            <CardPanel className="mt-4 border-l-[3px] border-l-urgent">
              <h3 className="mb-2 font-mono text-label font-medium uppercase tracking-label text-ink-secondary">{t("extract.warnings_heading")}</h3>
              <ul className="space-y-1">
                {extraction.warnings.map((w, i) => (
                  <li key={i} className="text-body-sm leading-relaxed text-ink-secondary">{w}</li>
                ))}
              </ul>
            </CardPanel>
          )}

          {/* Critical unconfirmed warning */}
          {criticalUnconfirmed.length > 0 && (
            <div className="mt-4 rounded-card border border-urgent/20 bg-urgent-soft px-5 py-4">
              <p className="text-body-sm text-urgent">
                {t("extract.critical_warning")}
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {criticalUnconfirmed.map((k) => (
                  <span key={k} className="rounded-badge border border-urgent/20 bg-urgent-soft px-2.5 py-0.5 font-mono text-label text-urgent">
                    {t(FIELD_LABELS[k])}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={handleRunRouting}
              className="inline-flex h-11 items-center gap-2 rounded-btn bg-ink px-6 font-mono text-label font-medium uppercase text-warm-white shadow-btn transition-all hover:-translate-y-px hover:shadow-card-hover"
            >
              {t("extract.run_routing_button")}
            </button>
            <button
              onClick={onBack}
              className="inline-flex h-12 items-center rounded-btn border border-rule bg-warm-white px-5 font-mono text-label uppercase text-ink-secondary transition-all hover:border-accent/40 hover:text-ink"
            >
              {t("extract.back_button")}
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-header space-y-4">
            {/* Confirmation summary card */}
            <div className="rounded-card border border-rule-light/80 bg-warm-white p-5 shadow-card">
              <p className="font-mono text-eyebrow font-medium uppercase tracking-eyebrow text-muted">
                {t("extract.confirmation_title")}
              </p>
              <div className="mt-3 space-y-2 text-caption">
                <div className="flex justify-between">
                  <span className="text-muted">{t("extract.total_fields")}</span>
                  <span className="font-mono text-ink-secondary">{allKeys.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">{t("extract.fields_edited")}</span>
                  <span className={cn("font-mono", edits.length > 0 ? "text-accent font-medium" : "text-ink-secondary")}>
                    {edits.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">{t("extract.still_unconfirmed")}</span>
                  <span className={cn("font-mono", unconfirmedKeys.length > 0 ? "text-urgent" : "text-routine")}>
                    {unconfirmedKeys.length}
                  </span>
                </div>
                <div className="flex justify-between border-t border-rule-light pt-2">
                  <span className="text-muted">{t("extract.ready_for_routing")}</span>
                  <span className="font-mono text-routine font-medium">{t("extract.ready_yes")}</span>
                </div>
              </div>
            </div>

            {/* Confidence card */}
            <div className="rounded-card border border-rule-light/80 bg-warm-white p-5 shadow-card">
              <p className="font-mono text-eyebrow font-medium uppercase tracking-eyebrow text-muted">
                {t("extract.confidence_title")}
              </p>
              <p className={cn("mt-3 font-sans text-body-lg font-semibold leading-tight tracking-tight", tierColor.text)}>
                {t(confidenceInfo.labelKey)}
              </p>
              <p className={cn("mt-1 font-mono text-meta", tierColor.text)}>
                {displayConfidence}
              </p>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface">
                <div className={cn("h-full rounded-full transition-all", tierColor.bg)} style={{ width: `${barWidth}%` }} />
              </div>
            </div>

            {/* Model info card */}
            <div className="rounded-card border border-rule-light/80 bg-warm-white p-5 shadow-card">
              <p className="font-mono text-eyebrow font-medium uppercase tracking-eyebrow text-muted">
                {t("extract.model_title")}
              </p>
              <p className="mt-2 font-mono text-meta text-ink-secondary">{extraction.model_id}</p>
              <p className="mt-1 font-mono text-eyebrow text-muted">{extraction.extraction_id}</p>
              <div className="mt-2.5 flex items-center gap-1.5">
                <span className={cn("h-1.5 w-1.5 rounded-full", isAI ? "bg-routine" : "bg-muted/50")} />
                <span className="font-mono text-eyebrow text-muted">{isAI ? t("extract.model_ai") : t("extract.model_mock")}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
