"use client";

import { useState, useMemo } from "react";
import { SectionLabel } from "@/components/ui/section-label";
import { CardPanel } from "@/components/ui/card-panel";
import { DarkPanel } from "@/components/ui/dark-panel";
import type { PilotCase, ExtractionQualityFlag } from "@/types";
import { cn } from "@/lib/cn";
import { useTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n/en";
import {
  getUrgencyLevel,
  getRouteLabel,
  getStatusLabel,
  getUrgencyColor,
  getUrgencyBorderColor,
  getWhyThisRoute,
  getWhyNotSelected,
  getDecisiveInputsWithEdits,
  getUnconfirmedInputs,
  filterReasons,
} from "@/lib/cardio/report-helpers";
import {
  caseToJson,
  caseToMarkdown,
  copyToClipboard,
} from "@/lib/cardio/export-helpers";
import {
  buildAuditRecord,
  downloadAuditRecordJson,
  downloadAuditRecordMarkdown,
} from "@/lib/cardio/audit-record";
import { persistCaseBundle } from "@/lib/cardio/persistence-api-client";
import { buildPersistCaseBundlePayload } from "@/lib/cardio/persistence-payload";
import type { PersistenceStatus } from "@/types";

interface ReportScreenProps {
  pilotCase: PilotCase;
  onNewCase: () => void;
  onSendToReviewer?: (pilotCase: PilotCase, persisted: boolean) => void;
  isInReviewerQueue?: boolean;
  persistedSessionId?: string | null;
}

export function ReportScreen({ pilotCase, onNewCase, onSendToReviewer, isInReviewerQueue, persistedSessionId }: ReportScreenProps) {
  const report = pilotCase.engine_report;
  const [copyState, setCopyState] = useState<"idle" | "json" | "md">("idle");
  const [auditDlState, setAuditDlState] = useState<"idle" | "json" | "md">("idle");
  const [sentToReviewer, setSentToReviewer] = useState(false);
  const [persistStatus, setPersistStatus] = useState<PersistenceStatus>("idle");
  const [persistError, setPersistError] = useState<string | null>(null);

  const { t, lang } = useTranslation();

  if (!report) {
    return (
      <section className="mx-auto max-w-[1360px] px-6 py-12">
        <p className="text-ink-secondary">{t("report.no_report")}</p>
      </section>
    );
  }

  const urgency = getUrgencyLevel(report);
  const d = report.decision;
  const s = report.safety;
  const trace = report.trace;
  const v = report.versions;

  const whyThis = getWhyThisRoute(report, t);
  const whyNot = getWhyNotSelected(report, t);
  const decisiveInputsWithEdits = getDecisiveInputsWithEdits(report, pilotCase.humanCorrection, t);
  const filteredReasons = filterReasons(report);
  const unconfirmedInputs = getUnconfirmedInputs(report, t);

  // ── Mock report content localization ──────────────────────────────
  // Map known mock report strings to translations. Backend-sourced reports
  // return English copy which is shown as-is (backend contract).
  const MOCK_SUMMARIES: Record<string, TranslationKey> = {
    "Critical cardio fields missing; safe routing deferred.": "mockReport.NEEDS_MORE_INFO.summary",
    "Stable complete case; routine review indicated by deterministic rules.": "mockReport.ROUTINE_REVIEW.summary",
    "Urgent same-day review indicated by deterministic risk rule(s).": "mockReport.URGENT_ESCALATION.summary",
    "Hard emergency red-flag criteria met; emergency route required.": "mockReport.EMERGENCY_ROUTE.summary",
    "Conflicting structured cardio inputs detected; safe routing deferred.": "mockReport.DEFERRED_PENDING_DATA.summary",
  };
  const MOCK_STRINGS: Record<string, TranslationKey> = {
    "Collect all listed missing critical fields and resubmit.": "mockReport.NEEDS_MORE_INFO.action1",
    "Schedule routine cardiology review.": "mockReport.ROUTINE_REVIEW.action1",
    "Arrange same-day clinical escalation pathway.": "mockReport.URGENT_ESCALATION.action1",
    "Initiate immediate emergency escalation protocol.": "mockReport.EMERGENCY_ROUTE.action1",
    "Reconcile contradictory chest-pain fields.": "mockReport.DEFERRED_PENDING_DATA.action1",
    "Reconfirm symptom presence, severity, and related attributes.": "mockReport.DEFERRED_PENDING_DATA.action2",
    "No emergency or urgent cluster detected in complete case.": "mockReport.ROUTINE_REVIEW.reason1",
    "Exertional chest pain with arm/jaw radiation.": "mockReport.URGENT_ESCALATION.reason1",
    "Hard red-flag emergency criteria met.": "mockReport.EMERGENCY_ROUTE.override",
    "Critical cardio fields missing; triage logic not executed.": "mockReport.NEEDS_MORE_INFO.note1",
    "Conflicting structured inputs detected.": "mockReport.DEFERRED_PENDING_DATA.note1",
  };
  function loc(text: string): string {
    const key = MOCK_SUMMARIES[text] ?? MOCK_STRINGS[text];
    return key ? t(key) : text;
  }

  // ── Display label mappers (report-screen only) ─────────────────
  function locUrgency(raw: string): string {
    const k = `report.urgency_${raw}` as TranslationKey;
    const v = t(k);
    return v !== k ? v : raw;
  }
  function locDecisionType(raw: string): string {
    const k = `report.decisionType_${raw}` as TranslationKey;
    const v = t(k);
    return v !== k ? v : raw.replace(/_/g, " ").toLowerCase();
  }
  function locSafetyStatus(raw: string): string {
    const k = `report.safetyStatus_${raw}` as TranslationKey;
    const v = t(k);
    return v !== k ? v : raw;
  }
  function locSafetyAction(raw: string): string {
    const k = `report.safetyAction_${raw}` as TranslationKey;
    const v = t(k);
    return v !== k ? v : raw.replace(/_/g, " ").toLowerCase();
  }

  // AI intelligence data from extraction
  const ext = pilotCase.extraction;
  const structuredSummary = ext?.structured_clinical_summary;
  const missingInfo = ext?.missing_information;
  const completionQs = ext?.completion_questions ?? [];
  const qualityFlags = ext?.extraction_quality_flags ?? [];
  const piiWarnings = ext?.pii_warnings ?? [];
  const fieldEvidence = ext?.field_evidence ?? [];
  const confidence = ext?.confidence ?? 0;
  const confidenceLabelKey: TranslationKey = confidence >= 0.8 ? "report.quality_high" : confidence >= 0.5 ? "report.quality_moderate" : "report.quality_low";
  const confidenceColor = confidence >= 0.8 ? "text-routine" : confidence >= 0.5 ? "text-urgent" : "text-emergency";
  const hasMissingInfo = !!(missingInfo?.required_for_routing?.length || missingInfo?.clinically_useful?.length || missingInfo?.unconfirmed?.length);
  const hasIntakeNotes = hasMissingInfo || completionQs.length > 0;

  function tFormatCorrectionValue(v: string | number | boolean | null): string {
    if (v === null || v === undefined) return t("report.value_unconfirmed");
    if (typeof v === "boolean") return v ? t("report.value_yes") : t("report.value_no");
    return String(v);
  }

  async function handleCopyJson() {
    await copyToClipboard(caseToJson(pilotCase));
    setCopyState("json");
    setTimeout(() => setCopyState("idle"), 2000);
  }

  async function handleCopyMarkdown() {
    await copyToClipboard(caseToMarkdown(pilotCase));
    setCopyState("md");
    setTimeout(() => setCopyState("idle"), 2000);
  }

  const auditRecord = useMemo(() => buildAuditRecord(pilotCase), [pilotCase]);

  function handleDownloadAuditJson() {
    try {
      downloadAuditRecordJson(auditRecord);
      setAuditDlState("json");
      setTimeout(() => setAuditDlState("idle"), 2000);
    } catch (e) {
      console.warn("Audit JSON export failed", e);
    }
  }

  async function handleSaveToDatabase() {
    if (persistStatus === "saving" || persistStatus === "saved" || persistStatus === "already_exists") return;
    setPersistStatus("saving");
    setPersistError(null);
    try {
      const payload = buildPersistCaseBundlePayload(pilotCase, persistedSessionId, lang);
      const result = await persistCaseBundle(payload);
      setPersistStatus(result.ok ? "saved" : result.status);
      if (!result.ok) setPersistError(result.error);
    } catch {
      setPersistStatus("error");
      setPersistError(t("report.persist_unexpected_error"));
    }
  }

  function handleDownloadAuditMarkdown() {
    try {
      downloadAuditRecordMarkdown(auditRecord);
      setAuditDlState("md");
      setTimeout(() => setAuditDlState("idle"), 2000);
    } catch (e) {
      console.warn("Audit Markdown export failed", e);
    }
  }

  return (
    <section className="mx-auto max-w-[1360px] px-6 py-10 lg:py-14">
      {/* ─── A. Report header band ─── */}
      <div className={cn("rounded-card border border-rule-light/80 bg-warm-white shadow-panel p-5 sm:p-6", getUrgencyBorderColor(urgency), "border-l-[3px]")}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <SectionLabel>{t("report.section_label")}</SectionLabel>
            <h2 className="mt-2 font-sans text-heading-lg font-bold leading-tight tracking-tighter text-ink">
              {getRouteLabel(d.path, t)}
            </h2>
            <p className="mt-2 max-w-[560px] text-body leading-relaxed text-ink-secondary">
              {loc(d.clinical_summary)}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2">
            <span
              className={cn(
                "rounded-lg px-3.5 py-1.5 font-mono text-meta font-semibold uppercase tracking-wide",
                getUrgencyColor(urgency)
              )}
            >
              {locUrgency(d.urgency_level)}
            </span>
            <span className="font-mono text-eyebrow text-muted/60">
              {t("report.case_prefix")} {pilotCase.case_id}
            </span>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className={cn(
            "h-1.5 w-1.5 rounded-full",
            pilotCase.report_source === "backend" ? "bg-routine" : "bg-muted/50"
          )} />
          <p className="font-mono text-eyebrow text-muted/70">
            {pilotCase.report_source === "backend"
              ? <>{t("report.source_backend")} · {pilotCase.extraction?.extraction_source === "ai" ? t("report.source_ai_ext") : t("report.source_mock_ext")}{pilotCase.humanCorrection?.humanEditsApplied ? <> · {t("report.source_corrected")}</> : ""}</>
              : t("report.source_mock_fallback")}
          </p>
        </div>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 border-t border-rule-light/60 pt-3 text-body-sm">
          <span className="text-muted">
            {t("report.status_label")} <span className="font-medium text-ink-secondary">{getStatusLabel(d.status, t)}</span>
          </span>
          <span className="text-muted">
            {t("report.type_label")} <span className="font-medium text-ink-secondary">{locDecisionType(d.decision_type)}</span>
          </span>
          <span className="text-muted">
            {t("report.review_label")} <span className="font-semibold text-accent">{t("report.review_always")}</span>
          </span>
        </div>
      </div>

      {/* ─── Structured summary for review ─── */}
      {structuredSummary && (
        <CardPanel className="mt-6">
          <h3 className="mb-2 font-mono text-label font-medium uppercase tracking-label text-ink-secondary">
            {t("report.summary_heading")}
          </h3>
          <p className="text-body leading-relaxed text-ink-secondary">
            {structuredSummary}
          </p>
          <div className="mt-3 space-y-1 border-t border-rule-light/50 pt-2.5">
            <p className="text-caption leading-relaxed text-muted">
              {t("report.summary_disclaimer")}
            </p>
            {pilotCase.humanCorrection?.humanEditsApplied && (
              <p className="text-caption leading-relaxed text-muted">
                {t("report.summary_corrected_note")}
              </p>
            )}
          </div>
        </CardPanel>
      )}

      {/* ─── Two-column layout ─── */}
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_280px]">
        {/* Main report column */}
        <div className="space-y-5">

          {/* ─── B. Decision reasoning ─── */}
          <CardPanel>
            <h3 className="mb-3 font-mono text-label font-medium uppercase tracking-label text-ink-secondary">
              {t("report.reasoning_heading")}
            </h3>
            <div className="space-y-4">
              {/* Why this route */}
              <div>
                <p className="mb-1.5 font-mono text-eyebrow font-medium uppercase text-muted">
                  {t("report.why_this")}
                </p>
                <p className="text-body leading-relaxed text-ink-secondary">{whyThis}</p>
                {filteredReasons.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {filteredReasons.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-body-sm text-ink-secondary">
                        <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-accent/40" />
                        {loc(r)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Why not other routes */}
              {whyNot.length > 0 && (
                <div className="border-t border-rule-light/50 pt-3">
                  <p className="mb-2 font-mono text-eyebrow font-medium uppercase text-muted">
                    {t("report.why_not")}
                  </p>
                  <div className="space-y-1.5">
                    {whyNot.map((item) => (
                      <div key={item.route} className="flex items-start gap-2 text-body-sm">
                        <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-muted/30" />
                        <span className="text-muted">
                          <span className="font-medium text-ink-secondary">{item.route}:</span>{" "}
                          {item.reason}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Decisive inputs */}
              {decisiveInputsWithEdits.length > 0 && (
                <div className="border-t border-rule-light/50 pt-3">
                  <p className="mb-2 font-mono text-eyebrow font-medium uppercase text-muted">
                    {t("report.decisive_inputs")}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {decisiveInputsWithEdits.map((inp) => (
                      <span
                        key={inp.text}
                        className={cn(
                          "rounded-full border px-2.5 py-0.5 font-mono text-caption",
                          inp.edited
                            ? "border-accent/20 bg-accent/[0.04] text-ink-secondary"
                            : "border-rule-light bg-surface text-ink-secondary"
                        )}
                      >
                        {inp.text}{inp.edited && <span className="ml-1 text-eyebrow text-accent">{t("report.edited_tag")}</span>}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Unconfirmed / missing inputs */}
              {unconfirmedInputs.length > 0 && (
                <div className="border-t border-rule-light/50 pt-3">
                  <p className="mb-2 font-mono text-eyebrow font-medium uppercase text-muted">
                    {t("report.unconfirmed_inputs")}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {unconfirmedInputs.map((inp) => (
                      <span key={inp} className="rounded-full border border-rule-light/60 bg-surface/50 px-2.5 py-0.5 font-mono text-caption text-muted">
                        {inp}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardPanel>

          {/* Required actions */}
          {d.required_actions.length > 0 && (
            <CardPanel>
              <h3 className="mb-3 font-mono text-label font-medium uppercase tracking-label text-ink-secondary">
                {t("report.actions_heading")}
              </h3>
              <ul className="space-y-1.5">
                {d.required_actions.map((a, i) => (
                  <li key={i} className="flex items-start gap-2 text-body text-ink-secondary">
                    <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-accent/50" />
                    {loc(a)}
                  </li>
                ))}
              </ul>
            </CardPanel>
          )}

          {/* ─── Intake completion notes ─── */}
          {hasIntakeNotes && (
            <CardPanel>
              <h3 className="mb-3 font-mono text-label font-medium uppercase tracking-label text-ink-secondary">
                {t("report.intake_checked_heading")}
              </h3>
              <div className="space-y-3">
                {missingInfo?.required_for_routing && missingInfo.required_for_routing.length > 0 && (
                  <div>
                    <p className="mb-1.5 font-mono text-eyebrow font-medium uppercase text-emergency/70">
                      {t("report.required_fields")}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {missingInfo.required_for_routing.map((f) => (
                        <span key={f} className="rounded-full border border-emergency/15 bg-emergency-soft/50 px-2.5 py-0.5 font-mono text-caption text-emergency/80">
                          {f.replace(/_/g, " ")}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {missingInfo?.clinically_useful && missingInfo.clinically_useful.length > 0 && (
                  <div>
                    <p className="mb-1.5 font-mono text-eyebrow font-medium uppercase text-urgent/70">
                      {t("report.optional_context")}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {missingInfo.clinically_useful.map((f) => (
                        <span key={f} className="rounded-full border border-urgent/15 bg-urgent-soft/50 px-2.5 py-0.5 font-mono text-caption text-urgent/80">
                          {f.replace(/_/g, " ")}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {missingInfo?.unconfirmed && missingInfo.unconfirmed.length > 0 && (
                  <div>
                    <p className="mb-1.5 font-mono text-eyebrow font-medium uppercase text-muted">
                      {t("report.unconfirmed_fields")}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {missingInfo.unconfirmed.map((f) => (
                        <span key={f} className="rounded-full border border-rule-light bg-surface/50 px-2.5 py-0.5 font-mono text-caption text-muted">
                          {f.replace(/_/g, " ")}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {completionQs.length > 0 && (
                  <div className={cn(hasMissingInfo && "border-t border-rule-light/50 pt-3")}>
                    <p className="mb-2 font-mono text-eyebrow font-medium uppercase text-muted">
                      {t("report.intake_questions")}
                    </p>
                    <div className="space-y-1.5">
                      {completionQs.map((q, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-body-sm">
                          <span className="mt-[3px] flex h-4 w-4 shrink-0 items-center justify-center rounded border border-rule-light bg-surface">
                            <span className="block h-1.5 w-1.5 rounded-[1px] bg-transparent" />
                          </span>
                          <span className="text-ink-secondary">{q}</span>
                        </div>
                      ))}
                    </div>
                    <p className="mt-2 text-eyebrow text-muted">
                      {t("report.intake_questions_disclaimer")}
                    </p>
                  </div>
                )}
              </div>
            </CardPanel>
          )}

          {/* ─── C. Safety verification ─── */}
          <CardPanel
            className={cn(
              "border-l-[3px]",
              s.has_red_flags ? "border-l-emergency" : "border-l-accent/40"
            )}
          >
            <h3 className="mb-3 font-mono text-label font-medium uppercase tracking-label text-ink-secondary">
              {t("report.safety_heading")}
            </h3>
            <div className="grid gap-3 text-body-sm sm:grid-cols-2">
              <div className="flex justify-between sm:flex-col sm:gap-0.5">
                <span className="text-muted">{t("report.safety_status")}</span>
                <span className={cn("font-mono font-medium", s.status === "TRIGGERED" ? "text-emergency" : "text-routine")}>
                  {locSafetyStatus(s.status)}
                </span>
              </div>
              <div className="flex justify-between sm:flex-col sm:gap-0.5">
                <span className="text-muted">{t("report.safety_action")}</span>
                <span className="font-mono text-ink-secondary">{locSafetyAction(s.action)}</span>
              </div>
              <div className="flex justify-between sm:flex-col sm:gap-0.5">
                <span className="text-muted">{t("report.red_flags")}</span>
                <span className={cn("font-mono", s.has_red_flags ? "font-medium text-emergency" : "text-ink-secondary")}>
                  {s.has_red_flags ? s.flags.join(", ") : t("report.red_flags_none")}
                </span>
              </div>
              <div className="flex justify-between sm:flex-col sm:gap-0.5">
                <span className="text-muted">{t("report.override_applied")}</span>
                <span className={cn("font-mono", s.override_applied ? "font-medium text-emergency" : "text-ink-secondary")}>
                  {s.override_applied ? t("report.override_yes") : t("report.override_no")}
                </span>
              </div>
            </div>
            {s.triggers.length > 0 && (
              <div className="mt-3 border-t border-rule-light/60 pt-2.5">
                <span className="text-meta text-muted">{t("report.active_triggers")} </span>
                <span className="font-mono text-meta text-ink-secondary">
                  {s.triggers.join(", ")}
                </span>
              </div>
            )}
            <div className="mt-2.5 border-t border-rule-light/60 pt-2.5">
              <span className="text-meta text-muted">{t("report.safety_policy")} </span>
              <span className="font-mono text-meta text-ink-secondary">
                {s.policy_version}
              </span>
            </div>
          </CardPanel>

          {/* Missing information */}
          {d.missing_fields.length > 0 && (
            <CardPanel className="border-l-[3px] border-l-urgent/60">
              <h3 className="mb-3 font-mono text-label font-medium uppercase tracking-label text-ink-secondary">
                {t("report.missing_fields_heading")}
              </h3>
              <div className="flex flex-wrap gap-2">
                {d.missing_fields.map((fl) => (
                  <span key={fl} className="rounded-full border border-urgent/15 bg-urgent-soft px-2.5 py-0.5 font-mono text-caption text-urgent">
                    {fl.replace(/_/g, " ")}
                  </span>
                ))}
              </div>
            </CardPanel>
          )}

          {/* Flags */}
          {d.flags.length > 0 && (
            <CardPanel className="border-l-[3px] border-l-emergency/60">
              <h3 className="mb-3 font-mono text-label font-medium uppercase tracking-label text-ink-secondary">
                {t("report.flags_heading")}
              </h3>
              <div className="flex flex-wrap gap-2">
                {d.flags.map((fl) => (
                  <span key={fl} className="rounded-full border border-emergency/15 bg-emergency-soft px-2.5 py-0.5 font-mono text-caption text-emergency">
                    {fl}
                  </span>
                ))}
              </div>
            </CardPanel>
          )}

          {/* Conflicts detected */}
          {trace.conflicts_detected.length > 0 && (
            <CardPanel className="border-l-[3px] border-l-deferred/60">
              <h3 className="mb-3 font-mono text-label font-medium uppercase tracking-label text-ink-secondary">
                {t("report.conflicts_heading")}
              </h3>
              <div className="space-y-1.5">
                {trace.conflicts_detected.map((c) => (
                  <div key={c} className="flex items-center gap-2">
                    <span className="block h-1 w-1 shrink-0 rounded-full bg-deferred" />
                    <span className="font-mono text-meta text-ink-secondary">{c.replace(/_/g, " ")}</span>
                  </div>
                ))}
              </div>
            </CardPanel>
          )}

          {/* Activated rules */}
          <CardPanel>
            <h3 className="mb-3 font-mono text-label font-medium uppercase tracking-label text-ink-secondary">
              {t("report.rules_heading")}
            </h3>
            {trace.activated_rules.length > 0 ? (
              <div className="space-y-1.5">
                {trace.activated_rules.map((r) => (
                  <div key={r} className="flex items-center gap-2">
                    <span className="block h-1 w-1 shrink-0 rounded-full bg-accent/40" />
                    <span className="font-mono text-meta text-ink-secondary">{r}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-body-sm text-muted">{t("report.rules_empty")}</p>
            )}
          </CardPanel>

          {/* ─── D. Report integrity ─── */}
          <CardPanel className="border-l-[3px] border-l-accent/40">
            <h3 className="mb-3 font-mono text-label font-medium uppercase tracking-label text-ink-secondary">
              {t("report.integrity_heading")}
            </h3>
            <div className="grid gap-1.5 text-body-sm sm:grid-cols-2">
              {[
                { label: t("report.integrity_policy"), ok: true },
                { label: t("report.integrity_ruleset"), ok: true },
                { label: t("report.integrity_engine"), ok: true },
                { label: t("report.integrity_rules"), ok: trace.activated_rules.length > 0 },
                { label: t("report.integrity_review"), ok: true },
                { label: t("report.integrity_no_dx"), ok: true },
                { label: t("report.integrity_no_rx"), ok: true },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <span className={cn("block h-1.5 w-1.5 rounded-full", item.ok ? "bg-routine" : "bg-muted/30")} />
                  <span className="text-ink-secondary">{item.label}</span>
                </div>
              ))}
            </div>
          </CardPanel>

          {/* ─── F. Audit trace — dark panel ─── */}
          <div className="mt-2">
            <SectionLabel>{t("report.trace_label")}</SectionLabel>
            <DarkPanel className="mt-3">
              <div className="mb-4 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                <span className="font-mono text-eyebrow font-medium uppercase tracking-eyebrow text-authority-text/40">
                  {t("report.trace_heading")}
                </span>
              </div>
              <div className="space-y-3">
                <TraceRow label={t("report.trace_preliminary")} value={trace.preliminary_route} />
                <TraceRow label={t("report.trace_final")} value={trace.final_route} />
                <TraceRow label={t("report.trace_override")} value={trace.override_reason ? loc(trace.override_reason) : null} />
                <TraceRow
                  label={t("report.trace_rules")}
                  value={trace.activated_rules.length > 0 ? trace.activated_rules.join(", ") : t("report.trace_none")}
                />
                <TraceRow
                  label={t("report.trace_triggered")}
                  value={trace.rules_triggered.length > 0 ? trace.rules_triggered.join(", ") : t("report.trace_none")}
                />
                <TraceRow
                  label={t("report.trace_conflicts")}
                  value={trace.conflicts_detected.length > 0 ? trace.conflicts_detected.join(", ") : t("report.trace_none")}
                />
                {trace.uncertainty_notes.length > 0 && (
                  <TraceRow label={t("report.trace_uncertainty")} value={trace.uncertainty_notes.map(loc).join("; ")} />
                )}
              </div>

              {/* Policy trace */}
              <div className="mt-4 border-t border-white/[0.06] pt-3">
                <p className="mb-2 font-mono text-eyebrow uppercase tracking-eyebrow text-authority-text/35">
                  {t("report.trace_policy")}
                </p>
                <div className="space-y-1.5">
                  <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between">
                    <span className="font-mono text-eyebrow text-authority-text/40">{t("report.trace_evaluated")}</span>
                    <span className="font-mono text-eyebrow text-authority-text/65">{trace.policy_trace.evaluated.length} {t("report.trace_policies_suffix")}</span>
                  </div>
                  <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between">
                    <span className="font-mono text-eyebrow text-authority-text/40">{t("report.trace_triggered_label")}</span>
                    <span className="font-mono text-eyebrow text-authority-text/65">
                      {trace.policy_trace.triggered.length > 0 ? trace.policy_trace.triggered.join(", ") : t("report.trace_none")}
                    </span>
                  </div>
                </div>
              </div>

              <details className="mt-4">
                <summary className="cursor-pointer font-mono text-eyebrow uppercase tracking-label text-authority-text/35 transition-colors hover:text-authority-text/60">
                  {t("report.trace_json")}
                </summary>
                <pre className="mt-3 max-h-[360px] overflow-auto rounded-card bg-black/30 p-4 font-mono text-eyebrow leading-relaxed text-authority-text/60">
                  {JSON.stringify(report, null, 2)}
                </pre>
              </details>
            </DarkPanel>
          </div>
        </div>

        {/* ─── E. Right sidebar ─── */}
        <aside className="space-y-4 lg:sticky lg:top-header lg:self-start">

          {/* Signal chain */}
          <div className="rounded-card border border-rule-light/80 bg-warm-white shadow-card p-5">
            <p className="font-mono text-eyebrow font-medium uppercase tracking-eyebrow text-muted">
              {t("report.signal_chain")}
            </p>
            <div className="mt-3 space-y-2 text-meta">
              <div className="flex items-center justify-between">
                <span className="text-muted">{t("report.chain_ai")}</span>
                <span className={cn(
                  "rounded-full border px-2 py-[1px] font-mono text-eyebrow",
                  ext?.extraction_source === "ai"
                    ? "border-routine/30 bg-routine/10 text-routine"
                    : "border-rule bg-surface text-muted"
                )}>
                  {ext?.extraction_source === "ai" ? t("report.chain_completed") : t("report.chain_mock")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">{t("report.chain_confirm")}</span>
                <span className="rounded-full border border-routine/30 bg-routine/10 px-2 py-[1px] font-mono text-eyebrow text-routine">
                  {t("report.chain_completed")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">{t("report.chain_edits")}</span>
                <span className={cn(
                  "rounded-full border px-2 py-[1px] font-mono text-eyebrow",
                  pilotCase.humanCorrection?.humanEditsApplied
                    ? "border-accent/30 bg-accent/10 text-accent"
                    : "border-rule bg-surface text-muted"
                )}>
                  {pilotCase.humanCorrection?.humanEditsApplied
                    ? `${t("report.chain_yes_prefix")} ${pilotCase.humanCorrection.fieldsEdited} ${t("report.chain_fields_suffix")}`
                    : t("report.chain_none")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">{t("report.chain_routing")}</span>
                <span className={cn(
                  "rounded-full border px-2 py-[1px] font-mono text-eyebrow",
                  pilotCase.report_source === "backend"
                    ? "border-routine/30 bg-routine/10 text-routine"
                    : "border-rule bg-surface text-muted"
                )}>
                  {pilotCase.report_source === "backend" ? t("report.chain_deterministic") : t("report.chain_mock")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">{t("report.chain_physician")}</span>
                <span className="rounded-full border border-urgent/20 bg-urgent-soft px-2 py-0.5 font-mono text-eyebrow text-urgent">
                  {t("report.chain_pending")}
                </span>
              </div>
            </div>
          </div>

          {/* Human-corrected extraction */}
          <div className="rounded-card border border-rule-light/80 bg-warm-white shadow-card p-5">
            <p className="font-mono text-eyebrow font-medium uppercase tracking-eyebrow text-muted">
              {t("report.correction_heading")}
            </p>
            {pilotCase.humanCorrection?.humanEditsApplied ? (
              <>
                <p className="mt-3 text-meta text-ink-secondary">
                  {t("report.correction_fields_edited")} <span className="font-mono font-medium text-accent">{pilotCase.humanCorrection.fieldsEdited}</span>
                </p>
                <div className="mt-3 space-y-3 border-t border-rule-light pt-3">
                  {pilotCase.humanCorrection.diffs.map((diff) => (
                    <div key={diff.field}>
                      <p className="text-meta font-medium text-ink-secondary">
                        {FIELD_LABELS_MAP[diff.field] ? t(FIELD_LABELS_MAP[diff.field]) : diff.field.replace(/_/g, " ")}
                      </p>
                      <div className="mt-0.5 space-y-0.5 text-eyebrow">
                        <p className="text-muted">
                          {t("report.correction_ai_value")} <span className="font-mono text-ink-secondary">{tFormatCorrectionValue(diff.originalValue)}</span>
                        </p>
                        <p className="text-muted">
                          {t("report.correction_final_value")} <span className="font-mono font-medium text-ink">{tFormatCorrectionValue(diff.finalValue)}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="mt-3 text-meta text-muted">
                {t("report.correction_none")}
              </p>
            )}
          </div>

          {/* AI extraction quality */}
          {ext && (
            <div className="rounded-card border border-rule-light/80 bg-warm-white shadow-card p-5">
              <p className="font-mono text-eyebrow font-medium uppercase tracking-eyebrow text-muted">
                {t("report.quality_heading")}
              </p>
              <div className="mt-3 space-y-2 text-meta">
                <div className="flex justify-between">
                  <span className="text-muted">{t("report.quality_confidence")}</span>
                  <span className={cn("font-mono font-medium", confidenceColor)}>{t(confidenceLabelKey)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">{t("report.quality_evidence")}</span>
                  <span className="font-mono text-ink-secondary">{fieldEvidence.length} {t("report.quality_fields_suffix")}</span>
                </div>
                {qualityFlags.length > 0 && (
                  <div>
                    <p className="mb-1.5 text-eyebrow text-muted">{t("report.quality_flags")}</p>
                    <div className="flex flex-wrap gap-1">
                      {qualityFlags.map((flag) => (
                        <span key={flag} className="rounded-badge border border-rule-light bg-surface px-2 py-0.5 font-mono text-eyebrow text-ink-secondary">
                          {REPORT_QUALITY_FLAG_LABELS[flag] ? t(REPORT_QUALITY_FLAG_LABELS[flag]) : flag.replace(/_/g, " ")}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {piiWarnings.length > 0 && (
                  <div className="border-t border-rule-light pt-2">
                    <p className="text-eyebrow font-medium text-emergency/70">{t("report.quality_pii_heading")}</p>
                    <p className="mt-0.5 text-eyebrow text-muted">
                      {t("report.quality_pii_text")}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {piiWarnings.map((w) => (
                        <span key={w} className="rounded-badge border border-emergency/15 bg-emergency-soft px-2 py-0.5 font-mono text-eyebrow text-emergency/70">
                          {w.replace(/_/g, " ")}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <p className="mt-3 border-t border-rule-light pt-2 text-label text-muted">
                {t("report.quality_disclaimer")}
              </p>
            </div>
          )}

          {/* Contract versions */}
          <div className="rounded-card border border-rule-light/80 bg-warm-white shadow-card p-5">
            <p className="font-mono text-eyebrow font-medium uppercase tracking-eyebrow text-muted">
              {t("report.versions_heading")}
            </p>
            <div className="mt-3 space-y-2 text-meta">
              <div className="flex justify-between"><span className="text-muted">{t("report.version_engine")}</span><span className="font-mono text-ink-secondary">{v.engine}</span></div>
              <div className="flex justify-between"><span className="text-muted">{t("report.version_ruleset")}</span><span className="font-mono text-ink-secondary">{v.ruleset}</span></div>
              <div className="flex justify-between"><span className="text-muted">{t("report.version_safety")}</span><span className="font-mono text-ink-secondary">{v.safety_policy}</span></div>
              <div className="flex justify-between"><span className="text-muted">{t("report.version_contract")}</span><span className="font-mono text-ink-secondary">{v.contract}</span></div>
            </div>
          </div>

          {/* Export actions */}
          <div className="rounded-card border border-rule-light/80 bg-warm-white shadow-card p-5">
            <p className="font-mono text-eyebrow font-medium uppercase tracking-eyebrow text-muted">
              {t("report.export_heading")}
            </p>
            <div className="mt-3 space-y-2">
              <button
                onClick={handleDownloadAuditJson}
                className="flex h-9 w-full items-center justify-center rounded-btn border border-rule bg-warm-white font-mono text-label uppercase tracking-wide text-ink-secondary transition-all hover:border-ink/30 hover:text-ink"
              >
                {auditDlState === "json" ? t("report.export_downloaded") : t("report.export_audit_json")}
              </button>
              <button
                onClick={handleDownloadAuditMarkdown}
                className="flex h-9 w-full items-center justify-center rounded-btn border border-rule bg-warm-white font-mono text-label uppercase tracking-wide text-ink-secondary transition-all hover:border-ink/30 hover:text-ink"
              >
                {auditDlState === "md" ? t("report.export_downloaded") : t("report.export_audit_md")}
              </button>
              <button
                onClick={handleCopyJson}
                className="flex h-9 w-full items-center justify-center rounded-btn border border-rule bg-paper font-mono text-label uppercase tracking-wide text-ink-secondary transition-all hover:border-accent hover:text-ink"
              >
                {copyState === "json" ? t("report.export_copied") : t("report.export_copy_json")}
              </button>
              <button
                onClick={handleCopyMarkdown}
                className="flex h-9 w-full items-center justify-center rounded-btn border border-rule bg-paper font-mono text-label uppercase tracking-wide text-ink-secondary transition-all hover:border-accent hover:text-ink"
              >
                {copyState === "md" ? t("report.export_copied") : t("report.export_copy_md")}
              </button>
              {onSendToReviewer && (
                <button
                  onClick={() => {
                    onSendToReviewer(pilotCase, persistStatus === "saved" || persistStatus === "already_exists");
                    setSentToReviewer(true);
                    setTimeout(() => setSentToReviewer(false), 3000);
                  }}
                  disabled={isInReviewerQueue}
                  className={cn(
                    "flex h-9 w-full items-center justify-center rounded-btn border font-mono text-label uppercase tracking-wide transition-all",
                    isInReviewerQueue || sentToReviewer
                      ? "cursor-default border-routine/30 bg-routine/10 text-routine"
                      : "border-accent bg-paper text-accent hover:bg-accent hover:text-white"
                  )}
                >
                  {isInReviewerQueue ? t("report.export_reviewer_queued") : sentToReviewer ? t("report.export_reviewer_sent") : t("report.export_reviewer_send")}
                </button>
              )}
              {!onSendToReviewer && (
                <button
                  disabled
                  className="flex h-9 w-full cursor-not-allowed items-center justify-center rounded-btn border border-rule bg-paper font-mono text-label uppercase tracking-wide text-muted/50"
                >
                  {t("report.export_reviewer_unavailable")}
                </button>
              )}
            </div>
            {piiWarnings.length > 0 && (
              <p className="mt-2 text-eyebrow font-medium text-emergency/70">
                {t("report.export_pii_warning")}
              </p>
            )}
            <p className="mt-2 text-eyebrow text-muted">
              {t("report.export_disclaimer")}
            </p>
          </div>

          {/* Database persistence */}
          <div className="rounded-card border border-rule-light/80 bg-warm-white shadow-card p-5">
            <p className="font-mono text-eyebrow font-medium uppercase tracking-eyebrow text-muted">
              {t("report.persist_heading")}
            </p>
            <div className="mt-3 space-y-2">
              <button
                onClick={handleSaveToDatabase}
                disabled={persistStatus === "saving" || persistStatus === "saved" || persistStatus === "already_exists"}
                className={cn(
                  "flex h-9 w-full items-center justify-center rounded-btn border font-mono text-label uppercase tracking-wide transition-all",
                  persistStatus === "saved"
                    ? "cursor-default border-routine/30 bg-routine/10 text-routine"
                    : persistStatus === "already_exists"
                      ? "cursor-default border-routine/30 bg-routine/10 text-routine"
                      : persistStatus === "saving"
                        ? "cursor-wait border-accent/30 bg-accent/5 text-accent"
                        : persistStatus === "error" || persistStatus === "unavailable"
                          ? "border-urgent/40 bg-urgent-soft text-urgent hover:border-urgent/60"
                          : "border-accent bg-paper text-accent hover:bg-accent hover:text-white"
                )}
              >
                {persistStatus === "idle" && t("report.persist_save")}
                {persistStatus === "saving" && t("report.persist_saving")}
                {persistStatus === "saved" && t("report.persist_saved")}
                {persistStatus === "already_exists" && t("report.persist_exists")}
                {persistStatus === "error" && t("report.persist_retry")}
                {persistStatus === "unavailable" && t("report.persist_retry")}
              </button>
              {persistError && (
                <p className="text-eyebrow text-urgent">{persistError.toLowerCase().includes("fetch") ? t("report.persist_connection_error") : persistError}</p>
              )}
            </div>
            <p className="mt-2 text-eyebrow text-muted">
              {t("report.persist_disclaimer")}
            </p>
          </div>

          {/* Audit record preview */}
          <details className="rounded-card border border-rule-light/80 bg-warm-white shadow-card p-5">
            <summary className="cursor-pointer font-mono text-eyebrow font-medium uppercase text-muted hover:text-ink-secondary">
              {t("report.audit_preview")}
            </summary>
            <div className="mt-3 space-y-2 text-meta">
              <div className="flex justify-between">
                <span className="text-muted">{t("report.audit_id")}</span>
                <span className="font-mono text-label text-ink-secondary">{auditRecord.audit_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">{t("report.audit_case_id")}</span>
                <span className="font-mono text-label text-ink-secondary">{auditRecord.case_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">{t("report.audit_extraction")}</span>
                <span className="font-mono text-label text-ink-secondary">{auditRecord.extraction_source}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">{t("report.audit_routing")}</span>
                <span className="font-mono text-label text-ink-secondary">{auditRecord.routing_source}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">{t("report.audit_edits")}</span>
                <span className="font-mono text-label text-ink-secondary">{auditRecord.human_correction?.humanEditsApplied ? `${auditRecord.human_correction.fieldsEdited} ${t("report.audit_fields_suffix")}` : t("report.audit_none")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">{t("report.audit_final_route")}</span>
                <span className="font-mono text-label text-ink-secondary">{auditRecord.engine_report ? getRouteLabel(auditRecord.engine_report.decision.path, t) : "—"}</span>
              </div>
              <div className="mt-2 border-t border-rule-light pt-2">
                <p className="mb-1.5 font-mono text-eyebrow text-muted">{t("report.audit_checklist")}</p>
                <div className="grid grid-cols-1 gap-1">
                  {[
                    { label: t("report.audit_check_policy"), ok: auditRecord.report_integrity.policy_version_included },
                    { label: t("report.audit_check_ruleset"), ok: auditRecord.report_integrity.ruleset_version_included },
                    { label: t("report.audit_check_engine"), ok: auditRecord.report_integrity.engine_version_included },
                    { label: t("report.audit_check_rules"), ok: auditRecord.report_integrity.activated_rules_included },
                    { label: t("report.audit_check_trace"), ok: auditRecord.report_integrity.audit_trace_included },
                    { label: t("report.audit_check_review"), ok: true },
                    { label: t("report.audit_check_no_dx"), ok: true },
                    { label: t("report.audit_check_no_rx"), ok: true },
                    { label: t("report.audit_check_no_ai"), ok: true },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-1.5">
                      <span className={cn("block h-1.5 w-1.5 rounded-full", item.ok ? "bg-routine" : "bg-muted/30")} />
                      <span className="text-label text-ink-secondary">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </details>

          {/* Pilot mode */}
          <div className="rounded-card border border-rule-light/80 bg-warm-white shadow-card p-5">
            <p className="font-mono text-eyebrow font-medium uppercase tracking-eyebrow text-muted">
              {t("report.pilot_heading")}
            </p>
            <div className="mt-3 space-y-2 text-meta">
              <div className="flex justify-between">
                <span className="text-muted">{t("report.pilot_data")}</span>
                <span className={cn(
                  "rounded-full border px-2 py-[1px] font-mono text-eyebrow",
                  persistStatus === "saved"
                    ? "border-routine/30 bg-routine/10 text-routine"
                    : "border-rule bg-surface text-muted"
                )}>
                  {persistStatus === "saved" ? t("report.pilot_persisted") : t("report.pilot_session")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">{t("report.pilot_extraction")}</span>
                <span className={cn(
                  "rounded-full border px-2 py-[1px] font-mono text-eyebrow",
                  ext?.extraction_source === "ai"
                    ? "border-routine/30 bg-routine/10 text-routine"
                    : "border-rule bg-surface text-muted"
                )}>
                  {ext?.extraction_source === "ai" ? t("report.pilot_ai") : t("report.pilot_mock")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">{t("report.pilot_routing")}</span>
                <span className={cn(
                  "rounded-full border px-2 py-[1px] font-mono text-eyebrow",
                  pilotCase.report_source === "backend"
                    ? "border-routine/30 bg-routine/10 text-routine"
                    : "border-rule bg-surface text-muted"
                )}>
                  {pilotCase.report_source === "backend" ? t("report.pilot_backend") : t("report.pilot_mock")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">{t("report.pilot_human_review")}</span>
                <span className="font-mono text-accent">{t("report.pilot_always_required")}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Disclaimer + new case */}
      <div className="mt-10 border-t border-rule-light pt-5">
        <p className="max-w-[560px] text-caption leading-relaxed text-muted">
          {t("report.footer_disclaimer")}
        </p>
        <button
          onClick={onNewCase}
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-btn border border-rule bg-warm-white px-5 font-mono text-label uppercase text-ink-secondary transition-all hover:border-ink/30 hover:text-ink"
        >
          {t("report.new_case_button")}
        </button>
      </div>
    </section>
  );
}

const REPORT_QUALITY_FLAG_LABELS: Record<ExtractionQualityFlag, TranslationKey> = {
  low_confidence_extraction: "report.flag_low_confidence",
  critical_missing_fields: "report.flag_critical_missing",
  contradictory_narrative: "report.flag_contradictory",
  limited_vitals: "report.flag_limited_vitals",
  medication_status_unclear: "report.flag_med_unclear",
  cardiovascular_history_unclear: "report.flag_cv_unclear",
  requires_human_confirmation: "report.flag_requires_confirmation",
  possible_identifier_detected: "report.flag_pii_detected",
};

const FIELD_LABELS_MAP: Record<string, TranslationKey> = {
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

function formatCorrectionValue(v: string | number | boolean | null): string {
  if (v === null || v === undefined) return "Unconfirmed";
  if (typeof v === "boolean") return v ? "Yes" : "No";
  return String(v);
}

function TraceRow({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  return (
    <div className="flex flex-col gap-1 border-b border-white/[0.04] pb-3 last:border-b-0 last:pb-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
      <span className="font-mono text-eyebrow uppercase tracking-label text-authority-text/40">
        {label}
      </span>
      <span className="font-mono text-meta text-authority-text/80">
        {value ?? "—"}
      </span>
    </div>
  );
}
