"use client";

import { useState, useMemo } from "react";
import { SectionLabel } from "@/components/ui/section-label";
import { CardPanel } from "@/components/ui/card-panel";
import { DarkPanel } from "@/components/ui/dark-panel";
import type { PilotCase, ExtractionQualityFlag } from "@/types";
import { cn } from "@/lib/cn";
import {
  getUrgencyLevel,
  getRouteLabel,
  getStatusLabel,
  getDecisionTypeLabel,
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

  if (!report) {
    return (
      <section className="mx-auto max-w-[1360px] px-6 py-12">
        <p className="text-ink-secondary">No report available.</p>
      </section>
    );
  }

  const urgency = getUrgencyLevel(report);
  const d = report.decision;
  const s = report.safety;
  const t = report.trace;
  const v = report.versions;

  const whyThis = getWhyThisRoute(report);
  const whyNot = getWhyNotSelected(report);
  const decisiveInputsWithEdits = getDecisiveInputsWithEdits(report, pilotCase.humanCorrection);
  const filteredReasons = filterReasons(report);
  const unconfirmedInputs = getUnconfirmedInputs(report);

  // AI intelligence data from extraction
  const ext = pilotCase.extraction;
  const structuredSummary = ext?.structured_clinical_summary;
  const missingInfo = ext?.missing_information;
  const completionQs = ext?.completion_questions ?? [];
  const qualityFlags = ext?.extraction_quality_flags ?? [];
  const piiWarnings = ext?.pii_warnings ?? [];
  const fieldEvidence = ext?.field_evidence ?? [];
  const confidence = ext?.confidence ?? 0;
  const confidenceLabel = confidence >= 0.8 ? "High" : confidence >= 0.5 ? "Moderate" : "Low";
  const confidenceColor = confidence >= 0.8 ? "text-routine" : confidence >= 0.5 ? "text-urgent" : "text-emergency";
  const hasMissingInfo = !!(missingInfo?.required_for_routing?.length || missingInfo?.clinically_useful?.length || missingInfo?.unconfirmed?.length);
  const hasIntakeNotes = hasMissingInfo || completionQs.length > 0;

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
      const payload = buildPersistCaseBundlePayload(pilotCase, persistedSessionId);
      const result = await persistCaseBundle(payload);
      setPersistStatus(result.ok ? "saved" : result.status);
      if (!result.ok) setPersistError(result.error);
    } catch {
      setPersistStatus("error");
      setPersistError("Unexpected error saving case.");
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
            <SectionLabel>Soficca Decision Report</SectionLabel>
            <h2 className="mt-2 font-sans text-heading-lg font-bold leading-tight tracking-tighter text-ink">
              {getRouteLabel(d.path)}
            </h2>
            <p className="mt-2 max-w-[560px] text-body leading-relaxed text-ink-secondary">
              {d.clinical_summary}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2">
            <span
              className={cn(
                "rounded-lg px-3.5 py-1.5 font-mono text-meta font-semibold uppercase tracking-wide",
                getUrgencyColor(urgency)
              )}
            >
              {d.urgency_level}
            </span>
            <span className="font-mono text-eyebrow text-muted/60">
              Case {pilotCase.case_id}
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
              ? `Real deterministic backend · ${pilotCase.extraction?.extraction_source === "ai" ? "real AI extraction" : "mock extraction"}${pilotCase.humanCorrection?.humanEditsApplied ? " · human-corrected" : ""}`
              : "Mock fallback · backend unavailable or not connected"}
          </p>
        </div>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 border-t border-rule-light/60 pt-3 text-body-sm">
          <span className="text-muted">
            Status: <span className="font-medium text-ink-secondary">{getStatusLabel(d.status)}</span>
          </span>
          <span className="text-muted">
            Type: <span className="font-medium text-ink-secondary">{getDecisionTypeLabel(d.decision_type)}</span>
          </span>
          <span className="text-muted">
            Human review: <span className="font-semibold text-accent">Always required</span>
          </span>
        </div>
      </div>

      {/* ─── Structured summary for review ─── */}
      {structuredSummary && (
        <CardPanel className="mt-6">
          <h3 className="mb-2 font-mono text-label font-medium uppercase tracking-label text-ink-secondary">
            Structured summary for review
          </h3>
          <p className="text-body leading-relaxed text-ink-secondary">
            {structuredSummary}
          </p>
          <div className="mt-3 space-y-1 border-t border-rule-light/50 pt-2.5">
            <p className="text-caption leading-relaxed text-muted">
              AI-generated summary of extracted facts only. Not a diagnosis, treatment recommendation, or routing decision.
            </p>
            {pilotCase.humanCorrection?.humanEditsApplied && (
              <p className="text-caption leading-relaxed text-muted">
                Summary generated from original AI extraction. Final routing used confirmed structured input.
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
              Decision Reasoning
            </h3>
            <div className="space-y-4">
              {/* Why this route */}
              <div>
                <p className="mb-1.5 font-mono text-eyebrow font-medium uppercase text-muted">
                  Why this route
                </p>
                <p className="text-body leading-relaxed text-ink-secondary">{whyThis}</p>
                {filteredReasons.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {filteredReasons.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-body-sm text-ink-secondary">
                        <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-accent/40" />
                        {r}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Why not other routes */}
              {whyNot.length > 0 && (
                <div className="border-t border-rule-light/50 pt-3">
                  <p className="mb-2 font-mono text-eyebrow font-medium uppercase text-muted">
                    Why not other routes
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
                    Decisive inputs
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
                        {inp.text}{inp.edited && <span className="ml-1 text-eyebrow text-accent">· edited</span>}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Unconfirmed / missing inputs */}
              {unconfirmedInputs.length > 0 && (
                <div className="border-t border-rule-light/50 pt-3">
                  <p className="mb-2 font-mono text-eyebrow font-medium uppercase text-muted">
                    Unconfirmed / missing inputs
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
                Required Actions
              </h3>
              <ul className="space-y-1.5">
                {d.required_actions.map((a, i) => (
                  <li key={i} className="flex items-start gap-2 text-body text-ink-secondary">
                    <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-accent/50" />
                    {a}
                  </li>
                ))}
              </ul>
            </CardPanel>
          )}

          {/* ─── Intake completion notes ─── */}
          {hasIntakeNotes && (
            <CardPanel>
              <h3 className="mb-3 font-mono text-label font-medium uppercase tracking-label text-ink-secondary">
                Intake completion notes
              </h3>
              <div className="space-y-3">
                {missingInfo?.required_for_routing && missingInfo.required_for_routing.length > 0 && (
                  <div>
                    <p className="mb-1.5 font-mono text-eyebrow font-medium uppercase text-emergency/70">
                      Required for routing
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
                      Clinically useful
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
                      Unconfirmed
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
                      Suggested intake questions
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
                      Questions are generated to complete structured intake. They are not clinical advice.
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
              Safety Verification
            </h3>
            <div className="grid gap-3 text-body-sm sm:grid-cols-2">
              <div className="flex justify-between sm:flex-col sm:gap-0.5">
                <span className="text-muted">Safety status</span>
                <span className={cn("font-mono font-medium", s.status === "TRIGGERED" ? "text-emergency" : "text-routine")}>
                  {s.status}
                </span>
              </div>
              <div className="flex justify-between sm:flex-col sm:gap-0.5">
                <span className="text-muted">Action</span>
                <span className="font-mono text-ink-secondary">{s.action}</span>
              </div>
              <div className="flex justify-between sm:flex-col sm:gap-0.5">
                <span className="text-muted">Red flags</span>
                <span className={cn("font-mono", s.has_red_flags ? "font-medium text-emergency" : "text-ink-secondary")}>
                  {s.has_red_flags ? s.flags.join(", ") : "None"}
                </span>
              </div>
              <div className="flex justify-between sm:flex-col sm:gap-0.5">
                <span className="text-muted">Override applied</span>
                <span className={cn("font-mono", s.override_applied ? "font-medium text-emergency" : "text-ink-secondary")}>
                  {s.override_applied ? "Yes" : "No"}
                </span>
              </div>
            </div>
            {s.triggers.length > 0 && (
              <div className="mt-3 border-t border-rule-light/60 pt-2.5">
                <span className="text-meta text-muted">Active triggers: </span>
                <span className="font-mono text-meta text-ink-secondary">
                  {s.triggers.join(", ")}
                </span>
              </div>
            )}
            <div className="mt-2.5 border-t border-rule-light/60 pt-2.5">
              <span className="text-meta text-muted">Safety policy: </span>
              <span className="font-mono text-meta text-ink-secondary">
                {s.policy_version}
              </span>
            </div>
          </CardPanel>

          {/* Missing information */}
          {d.missing_fields.length > 0 && (
            <CardPanel className="border-l-[3px] border-l-urgent/60">
              <h3 className="mb-3 font-mono text-label font-medium uppercase tracking-label text-ink-secondary">
                Missing Information
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
                Flags
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
          {t.conflicts_detected.length > 0 && (
            <CardPanel className="border-l-[3px] border-l-deferred/60">
              <h3 className="mb-3 font-mono text-label font-medium uppercase tracking-label text-ink-secondary">
                Conflicts Detected
              </h3>
              <div className="space-y-1.5">
                {t.conflicts_detected.map((c) => (
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
              Activated Rules
            </h3>
            {t.activated_rules.length > 0 ? (
              <div className="space-y-1.5">
                {t.activated_rules.map((r) => (
                  <div key={r} className="flex items-center gap-2">
                    <span className="block h-1 w-1 shrink-0 rounded-full bg-accent/40" />
                    <span className="font-mono text-meta text-ink-secondary">{r}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-body-sm text-muted">No rules activated — routing deferred.</p>
            )}
          </CardPanel>

          {/* ─── D. Report integrity ─── */}
          <CardPanel className="border-l-[3px] border-l-accent/40">
            <h3 className="mb-3 font-mono text-label font-medium uppercase tracking-label text-ink-secondary">
              Report Integrity
            </h3>
            <div className="grid gap-1.5 text-body-sm sm:grid-cols-2">
              {[
                { label: "Policy version included", ok: true },
                { label: "Ruleset version included", ok: true },
                { label: "Engine version included", ok: true },
                { label: "Activated rules included", ok: t.activated_rules.length > 0 },
                { label: "Human review required", ok: true },
                { label: "No diagnosis generated", ok: true },
                { label: "No prescription generated", ok: true },
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
            <SectionLabel>Audit Trace</SectionLabel>
            <DarkPanel className="mt-3">
              <div className="mb-4 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                <span className="font-mono text-eyebrow font-medium uppercase tracking-eyebrow text-authority-text/40">
                  Governed Trace · Deterministic Routing Evidence
                </span>
              </div>
              <div className="space-y-3">
                <TraceRow label="Preliminary route" value={t.preliminary_route} />
                <TraceRow label="Final route" value={t.final_route} />
                <TraceRow label="Override reason" value={t.override_reason} />
                <TraceRow
                  label="Activated rules"
                  value={t.activated_rules.length > 0 ? t.activated_rules.join(", ") : "None"}
                />
                <TraceRow
                  label="Rules triggered"
                  value={t.rules_triggered.length > 0 ? t.rules_triggered.join(", ") : "None"}
                />
                <TraceRow
                  label="Conflicts detected"
                  value={t.conflicts_detected.length > 0 ? t.conflicts_detected.join(", ") : "None"}
                />
                {t.uncertainty_notes.length > 0 && (
                  <TraceRow label="Uncertainty notes" value={t.uncertainty_notes.join("; ")} />
                )}
              </div>

              {/* Policy trace */}
              <div className="mt-4 border-t border-white/[0.06] pt-3">
                <p className="mb-2 font-mono text-eyebrow uppercase tracking-eyebrow text-authority-text/35">
                  Policy trace
                </p>
                <div className="space-y-1.5">
                  <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between">
                    <span className="font-mono text-eyebrow text-authority-text/40">Evaluated</span>
                    <span className="font-mono text-eyebrow text-authority-text/65">{t.policy_trace.evaluated.length} policies</span>
                  </div>
                  <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between">
                    <span className="font-mono text-eyebrow text-authority-text/40">Triggered</span>
                    <span className="font-mono text-eyebrow text-authority-text/65">
                      {t.policy_trace.triggered.length > 0 ? t.policy_trace.triggered.join(", ") : "None"}
                    </span>
                  </div>
                </div>
              </div>

              <details className="mt-4">
                <summary className="cursor-pointer font-mono text-eyebrow uppercase tracking-label text-authority-text/35 transition-colors hover:text-authority-text/60">
                  Full JSON preview
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
              Signal chain
            </p>
            <div className="mt-3 space-y-2 text-meta">
              <div className="flex items-center justify-between">
                <span className="text-muted">1. AI extraction</span>
                <span className={cn(
                  "rounded-full border px-2 py-[1px] font-mono text-eyebrow",
                  ext?.extraction_source === "ai"
                    ? "border-routine/30 bg-routine/10 text-routine"
                    : "border-rule bg-surface text-muted"
                )}>
                  {ext?.extraction_source === "ai" ? "Completed" : "Mock fallback"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">2. Human confirmation</span>
                <span className="rounded-full border border-routine/30 bg-routine/10 px-2 py-[1px] font-mono text-eyebrow text-routine">
                  Completed
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">3. Human edits</span>
                <span className={cn(
                  "rounded-full border px-2 py-[1px] font-mono text-eyebrow",
                  pilotCase.humanCorrection?.humanEditsApplied
                    ? "border-accent/30 bg-accent/10 text-accent"
                    : "border-rule bg-surface text-muted"
                )}>
                  {pilotCase.humanCorrection?.humanEditsApplied
                    ? `Yes · ${pilotCase.humanCorrection.fieldsEdited} fields`
                    : "None"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">4. Soficca routing</span>
                <span className={cn(
                  "rounded-full border px-2 py-[1px] font-mono text-eyebrow",
                  pilotCase.report_source === "backend"
                    ? "border-routine/30 bg-routine/10 text-routine"
                    : "border-rule bg-surface text-muted"
                )}>
                  {pilotCase.report_source === "backend" ? "Deterministic backend" : "Mock fallback"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">5. Physician review</span>
                <span className="rounded-full border border-urgent/20 bg-urgent-soft px-2 py-0.5 font-mono text-eyebrow text-urgent">
                  Pending
                </span>
              </div>
            </div>
          </div>

          {/* Human-corrected extraction */}
          <div className="rounded-card border border-rule-light/80 bg-warm-white shadow-card p-5">
            <p className="font-mono text-eyebrow font-medium uppercase tracking-eyebrow text-muted">
              Human-corrected extraction
            </p>
            {pilotCase.humanCorrection?.humanEditsApplied ? (
              <>
                <p className="mt-3 text-meta text-ink-secondary">
                  Fields edited: <span className="font-mono font-medium text-accent">{pilotCase.humanCorrection.fieldsEdited}</span>
                </p>
                <div className="mt-3 space-y-3 border-t border-rule-light pt-3">
                  {pilotCase.humanCorrection.diffs.map((diff) => (
                    <div key={diff.field}>
                      <p className="text-meta font-medium text-ink-secondary">
                        {(FIELD_LABELS_MAP as Record<string, string>)[diff.field] ?? diff.field.replace(/_/g, " ")}
                      </p>
                      <div className="mt-0.5 space-y-0.5 text-eyebrow">
                        <p className="text-muted">
                          AI value: <span className="font-mono text-ink-secondary">{formatCorrectionValue(diff.originalValue)}</span>
                        </p>
                        <p className="text-muted">
                          Final value: <span className="font-mono font-medium text-ink">{formatCorrectionValue(diff.finalValue)}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="mt-3 text-meta text-muted">
                No human edits applied before routing.
              </p>
            )}
          </div>

          {/* AI extraction quality */}
          {ext && (
            <div className="rounded-card border border-rule-light/80 bg-warm-white shadow-card p-5">
              <p className="font-mono text-eyebrow font-medium uppercase tracking-eyebrow text-muted">
                AI extraction quality
              </p>
              <div className="mt-3 space-y-2 text-meta">
                <div className="flex justify-between">
                  <span className="text-muted">Confidence</span>
                  <span className={cn("font-mono font-medium", confidenceColor)}>{confidenceLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Field evidence</span>
                  <span className="font-mono text-ink-secondary">{fieldEvidence.length} fields</span>
                </div>
                {qualityFlags.length > 0 && (
                  <div>
                    <p className="mb-1.5 text-eyebrow text-muted">Quality flags</p>
                    <div className="flex flex-wrap gap-1">
                      {qualityFlags.map((flag) => (
                        <span key={flag} className="rounded-badge border border-rule-light bg-surface px-2 py-0.5 font-mono text-eyebrow text-ink-secondary">
                          {REPORT_QUALITY_FLAG_LABELS[flag] ?? flag.replace(/_/g, " ")}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {piiWarnings.length > 0 && (
                  <div className="border-t border-rule-light pt-2">
                    <p className="text-eyebrow font-medium text-emergency/70">PII warning</p>
                    <p className="mt-0.5 text-eyebrow text-muted">
                      Possible identifier detected. Remove or anonymize before storing or sharing.
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
                AI extraction may be incomplete or incorrect. Human review is required before clinical use.
              </p>
            </div>
          )}

          {/* Contract versions */}
          <div className="rounded-card border border-rule-light/80 bg-warm-white shadow-card p-5">
            <p className="font-mono text-eyebrow font-medium uppercase tracking-eyebrow text-muted">
              Contract Versions
            </p>
            <div className="mt-3 space-y-2 text-meta">
              <div className="flex justify-between"><span className="text-muted">Engine</span><span className="font-mono text-ink-secondary">{v.engine}</span></div>
              <div className="flex justify-between"><span className="text-muted">Ruleset</span><span className="font-mono text-ink-secondary">{v.ruleset}</span></div>
              <div className="flex justify-between"><span className="text-muted">Safety</span><span className="font-mono text-ink-secondary">{v.safety_policy}</span></div>
              <div className="flex justify-between"><span className="text-muted">Contract</span><span className="font-mono text-ink-secondary">{v.contract}</span></div>
            </div>
          </div>

          {/* Export actions */}
          <div className="rounded-card border border-rule-light/80 bg-warm-white shadow-card p-5">
            <p className="font-mono text-eyebrow font-medium uppercase tracking-eyebrow text-muted">
              Export
            </p>
            <div className="mt-3 space-y-2">
              <button
                onClick={handleDownloadAuditJson}
                className="flex h-9 w-full items-center justify-center rounded-btn border border-rule bg-warm-white font-mono text-label uppercase tracking-wide text-ink-secondary transition-all hover:border-ink/30 hover:text-ink"
              >
                {auditDlState === "json" ? "Downloaded!" : "Export Audit JSON"}
              </button>
              <button
                onClick={handleDownloadAuditMarkdown}
                className="flex h-9 w-full items-center justify-center rounded-btn border border-rule bg-warm-white font-mono text-label uppercase tracking-wide text-ink-secondary transition-all hover:border-ink/30 hover:text-ink"
              >
                {auditDlState === "md" ? "Downloaded!" : "Export Audit Markdown"}
              </button>
              <button
                onClick={handleCopyJson}
                className="flex h-9 w-full items-center justify-center rounded-btn border border-rule bg-paper font-mono text-label uppercase tracking-wide text-ink-secondary transition-all hover:border-accent hover:text-ink"
              >
                {copyState === "json" ? "Copied!" : "Copy Engine Report JSON"}
              </button>
              <button
                onClick={handleCopyMarkdown}
                className="flex h-9 w-full items-center justify-center rounded-btn border border-rule bg-paper font-mono text-label uppercase tracking-wide text-ink-secondary transition-all hover:border-accent hover:text-ink"
              >
                {copyState === "md" ? "Copied!" : "Copy Report Markdown"}
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
                  {isInReviewerQueue ? "Already in reviewer queue" : sentToReviewer ? "Sent to Reviewer" : "Send to Reviewer"}
                </button>
              )}
              {!onSendToReviewer && (
                <button
                  disabled
                  className="flex h-9 w-full cursor-not-allowed items-center justify-center rounded-btn border border-rule bg-paper font-mono text-label uppercase tracking-wide text-muted/50"
                >
                  Send to Reviewer · unavailable
                </button>
              )}
            </div>
            {piiWarnings.length > 0 && (
              <p className="mt-2 text-eyebrow font-medium text-emergency/70">
                Possible identifier detected. Remove or anonymize before exporting or sharing.
              </p>
            )}
            <p className="mt-2 text-eyebrow text-muted">
              Audit export includes AI extraction, human edits, final engine input, Soficca report, and trace. Local export only.
            </p>
          </div>

          {/* Database persistence */}
          <div className="rounded-card border border-rule-light/80 bg-warm-white shadow-card p-5">
            <p className="font-mono text-eyebrow font-medium uppercase tracking-eyebrow text-muted">
              Database Persistence
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
                {persistStatus === "idle" && "Save Case to Database"}
                {persistStatus === "saving" && "Saving..."}
                {persistStatus === "saved" && "Saved to database"}
                {persistStatus === "already_exists" && "Already exists in database"}
                {persistStatus === "error" && "Retry Save to Database"}
                {persistStatus === "unavailable" && "Retry Save to Database"}
              </button>
              {persistError && (
                <p className="text-eyebrow text-urgent">{persistError}</p>
              )}
            </div>
            <p className="mt-2 text-eyebrow text-muted">
              Database persistence is backend-mediated. No database secrets are stored in the frontend. Simulated/anonymized cases only.
            </p>
          </div>

          {/* Audit record preview */}
          <details className="rounded-card border border-rule-light/80 bg-warm-white shadow-card p-5">
            <summary className="cursor-pointer font-mono text-eyebrow font-medium uppercase text-muted hover:text-ink-secondary">
              Audit record preview
            </summary>
            <div className="mt-3 space-y-2 text-meta">
              <div className="flex justify-between">
                <span className="text-muted">Audit ID</span>
                <span className="font-mono text-label text-ink-secondary">{auditRecord.audit_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Case ID</span>
                <span className="font-mono text-label text-ink-secondary">{auditRecord.case_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">AI extraction</span>
                <span className="font-mono text-label text-ink-secondary">{auditRecord.extraction_source}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Routing</span>
                <span className="font-mono text-label text-ink-secondary">{auditRecord.routing_source}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Human edits</span>
                <span className="font-mono text-label text-ink-secondary">{auditRecord.human_correction?.humanEditsApplied ? `${auditRecord.human_correction.fieldsEdited} fields` : "None"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Final route</span>
                <span className="font-mono text-label text-ink-secondary">{auditRecord.engine_report ? getRouteLabel(auditRecord.engine_report.decision.path) : "—"}</span>
              </div>
              <div className="mt-2 border-t border-rule-light pt-2">
                <p className="mb-1.5 font-mono text-eyebrow text-muted">Integrity checklist</p>
                <div className="grid grid-cols-1 gap-1">
                  {[
                    { label: "Policy version", ok: auditRecord.report_integrity.policy_version_included },
                    { label: "Ruleset version", ok: auditRecord.report_integrity.ruleset_version_included },
                    { label: "Engine version", ok: auditRecord.report_integrity.engine_version_included },
                    { label: "Activated rules", ok: auditRecord.report_integrity.activated_rules_included },
                    { label: "Audit trace", ok: auditRecord.report_integrity.audit_trace_included },
                    { label: "Human review required", ok: true },
                    { label: "No diagnosis generated", ok: true },
                    { label: "No prescription generated", ok: true },
                    { label: "AI did not decide route", ok: true },
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
              Pilot Mode
            </p>
            <div className="mt-3 space-y-2 text-meta">
              <div className="flex justify-between">
                <span className="text-muted">Data</span>
                <span className={cn(
                  "rounded-full border px-2 py-[1px] font-mono text-eyebrow",
                  persistStatus === "saved"
                    ? "border-routine/30 bg-routine/10 text-routine"
                    : "border-rule bg-surface text-muted"
                )}>
                  {persistStatus === "saved" ? "Persisted" : "Local session"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Extraction</span>
                <span className={cn(
                  "rounded-full border px-2 py-[1px] font-mono text-eyebrow",
                  ext?.extraction_source === "ai"
                    ? "border-routine/30 bg-routine/10 text-routine"
                    : "border-rule bg-surface text-muted"
                )}>
                  {ext?.extraction_source === "ai" ? "AI" : "Mock"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Routing</span>
                <span className={cn(
                  "rounded-full border px-2 py-[1px] font-mono text-eyebrow",
                  pilotCase.report_source === "backend"
                    ? "border-routine/30 bg-routine/10 text-routine"
                    : "border-rule bg-surface text-muted"
                )}>
                  {pilotCase.report_source === "backend" ? "Backend" : "Mock"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Human review</span>
                <span className="font-mono text-accent">Always required</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Disclaimer + new case */}
      <div className="mt-10 border-t border-rule-light pt-5">
        <p className="max-w-[560px] text-caption leading-relaxed text-muted">
          Route generated from confirmed structured input.
          AI extraction may be incomplete or incorrect. Human review is required before clinical use.
          Soficca does not diagnose, prescribe, or replace clinical judgment.
          This report structures symptoms and safety-routing signals for human
          clinical review.
        </p>
        <button
          onClick={onNewCase}
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-btn border border-rule bg-warm-white px-5 font-mono text-label uppercase text-ink-secondary transition-all hover:border-ink/30 hover:text-ink"
        >
          ← Start new case
        </button>
      </div>
    </section>
  );
}

const REPORT_QUALITY_FLAG_LABELS: Record<ExtractionQualityFlag, string> = {
  low_confidence_extraction: "Low confidence",
  critical_missing_fields: "Critical missing fields",
  contradictory_narrative: "Contradictory narrative",
  limited_vitals: "Limited vitals",
  medication_status_unclear: "Medication unclear",
  cardiovascular_history_unclear: "CV history unclear",
  requires_human_confirmation: "Requires confirmation",
  possible_identifier_detected: "PII detected",
};

const FIELD_LABELS_MAP: Record<string, string> = {
  age: "Age",
  chest_pain_present: "Chest pain present",
  pain_duration_minutes: "Pain duration (min)",
  pain_character: "Pain character",
  pain_severity: "Pain severity",
  pain_radiation: "Pain radiation",
  exertional_chest_pain: "Exertional chest pain",
  diaphoresis: "Diaphoresis",
  dyspnea: "Dyspnea",
  syncope: "Syncope",
  systolic_bp: "Systolic BP",
  heart_rate: "Heart rate",
  prior_mi: "Prior MI",
  known_cad: "Known CAD",
  cv_risk_factors_count: "CV risk factors",
  current_meds_none: "No current cardiac meds",
  current_meds_summary: "Medication summary",
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
