"use client";

import { useState, useMemo } from "react";
import { SectionLabel } from "@/components/ui/section-label";
import { CardPanel } from "@/components/ui/card-panel";
import { cn } from "@/lib/cn";
import {
  reviewerCases as sampleCases,
  type ReviewerCase,
} from "@/mock/reviewer-cases";
import type {
  ReviewerQueueItem,
  ReviewerFeedback,
  ReviewerAgreement,
  ReviewerMissingInfoResponse,
  ReviewerFlagIssue,
  ReviewerTimeSaved,
  ReviewerUsefulBefore,
  ReviewerPersistenceStatus,
  PersistedReviewerCaseSummary,
} from "@/types";
import {
  updateQueueFeedback,
  getReviewerMetrics,
} from "@/lib/cardio/reviewer-queue";
import {
  buildAuditRecord,
  downloadAuditRecordJson,
  downloadAuditRecordMarkdown,
} from "@/lib/cardio/audit-record";
import { saveReviewerFeedback, listPersistedCases, getPersistedCase } from "@/lib/cardio/persistence-api-client";
import { buildReviewerFeedbackPayload } from "@/lib/cardio/reviewer-persistence";

// ── Shared row type for table rendering ─────────────────────────

interface TableRow {
  case_id: string;
  created_at: string;
  chief_complaint: string;
  route_label: string;
  route: string | null;
  safety_flags_count: number;
  missing_fields_count: number;
  human_edits_count: number;
  review_status: "pending_review" | "reviewed" | "pending";
  agreement: string;
  isSession: boolean;
}

function toTableRow(q: ReviewerQueueItem): TableRow {
  return {
    case_id: q.case_id,
    created_at: q.created_at,
    chief_complaint: q.chief_complaint,
    route_label: q.route_label,
    route: q.route,
    safety_flags_count: q.safety_flags_count,
    missing_fields_count: q.missing_fields_count,
    human_edits_count: q.human_edits_count,
    review_status: q.review_status,
    agreement: q.feedback?.route_appropriate ?? "—",
    isSession: true,
  };
}

function sampleToTableRow(c: ReviewerCase): TableRow {
  return {
    case_id: c.case_id,
    created_at: c.created_at,
    chief_complaint: c.chief_complaint,
    route_label: c.route_label,
    route: c.route,
    safety_flags_count: c.safety_flags_count,
    missing_fields_count: c.missing_fields_count,
    human_edits_count: 0,
    review_status: c.review_status === "reviewed" ? "reviewed" : "pending",
    agreement: c.reviewer_agreement.replace(/_/g, " "),
    isSession: false,
  };
}

function getRouteBadgeCls(route: string | null): string {
  if (route?.includes("EMERGENCY")) return "bg-emergency-soft/60 text-emergency border-emergency/15";
  if (route?.includes("URGENT")) return "bg-surface text-muted border-rule-light";
  if (route?.includes("ROUTINE")) return "bg-surface text-muted border-rule-light";
  return "bg-surface text-muted border-rule-light";
}

function getReviewBadgeCls(status: string): string {
  if (status === "reviewed") return "bg-surface text-ink-secondary";
  return "bg-surface text-muted/60";
}

type FilterKey = "all" | "pending" | "reviewed" | "session";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "session", label: "Session" },
  { key: "pending", label: "Pending" },
  { key: "reviewed", label: "Reviewed" },
];

function OptionBtn({ selected, label, onClick }: { selected: boolean; label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={cn(
      "rounded-btn border px-3 py-1.5 font-sans text-body-sm transition-all",
      selected ? "border-ink/30 bg-ink text-warm-white font-medium" : "border-rule-light bg-warm-white text-ink-secondary hover:border-rule",
    )}>{label}</button>
  );
}

function ScaleBtn({ selected, value, onClick }: { selected: boolean; value: number; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={cn(
      "flex h-8 w-8 items-center justify-center rounded-btn border font-mono text-body-sm transition-all",
      selected ? "border-ink/30 bg-ink text-warm-white font-semibold" : "border-rule-light bg-warm-white text-ink-secondary hover:border-rule",
    )}>{value}</button>
  );
}

// ── Component ───────────────────────────────────────────────────

interface ReviewerWorkspaceProps {
  queue: ReviewerQueueItem[];
  onUpdateQueue: (queue: ReviewerQueueItem[]) => void;
  onOpenReport: (caseId: string) => void;
  onReviewCase: (caseId: string) => void;
}

export function ReviewerWorkspace({
  queue,
  onUpdateQueue,
  onOpenReport,
}: ReviewerWorkspaceProps) {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showSamples, setShowSamples] = useState(false);

  // Feedback state
  const [routeOk, setRouteOk] = useState<ReviewerAgreement | null>(null);
  const [usefulness, setUsefulness] = useState<number | null>(null);
  const [missingSurfaced, setMissingSurfaced] = useState<ReviewerMissingInfoResponse | null>(null);
  const [flagIssue, setFlagIssue] = useState<ReviewerFlagIssue | null>(null);
  const [timeSaved, setTimeSaved] = useState<ReviewerTimeSaved | null>(null);
  const [usefulBefore, setUsefulBefore] = useState<ReviewerUsefulBefore | null>(null);
  const [comments, setComments] = useState("");
  const [saved, setSaved] = useState(false);
  const [auditDlState, setAuditDlState] = useState<"idle" | "json" | "md">("idle");
  const [feedbackPersistStatus, setFeedbackPersistStatus] = useState<ReviewerPersistenceStatus>("idle");
  const [feedbackPersistError, setFeedbackPersistError] = useState<string | null>(null);
  const [persistedCases, setPersistedCases] = useState<PersistedReviewerCaseSummary[]>([]);
  const [persistedCasesLoading, setPersistedCasesLoading] = useState(false);
  const [persistedCasesError, setPersistedCasesError] = useState<string | null>(null);
  const [persistedCasesLoaded, setPersistedCasesLoaded] = useState(false);
  const [selectedPersistedCase, setSelectedPersistedCase] = useState<PersistedReviewerCaseSummary | null>(null);
  const [persistedBundleDetail, setPersistedBundleDetail] = useState<Record<string, unknown> | null>(null);

  const metrics = useMemo(() => getReviewerMetrics(queue), [queue]);

  // Build rows
  const sessionRows = queue.map(toTableRow);
  const sampleRows = sampleCases.map(sampleToTableRow);

  const visibleRows = useMemo(() => {
    let rows = [...sessionRows];
    if (showSamples) rows = [...rows, ...sampleRows];

    if (filter === "session") return rows.filter((r) => r.isSession);
    if (filter === "pending") return rows.filter((r) => r.review_status !== "reviewed");
    if (filter === "reviewed") return rows.filter((r) => r.review_status === "reviewed");
    return rows;
  }, [sessionRows, sampleRows, showSamples, filter]);

  const selectedQueueItem = selectedId ? queue.find((q) => q.case_id === selectedId) : null;

  function selectCase(id: string) {
    setSelectedId(id);
    clearForm();
  }

  function clearForm() {
    setRouteOk(null); setUsefulness(null); setMissingSurfaced(null);
    setFlagIssue(null); setTimeSaved(null); setUsefulBefore(null);
    setComments(""); setSaved(false);
    setFeedbackPersistStatus("idle"); setFeedbackPersistError(null);
  }

  async function handleSave() {
    if (!selectedId || !routeOk) return;
    const feedback: ReviewerFeedback = {
      route_appropriate: routeOk,
      usefulness: usefulness ?? 0,
      missing_info_surfaced: missingSurfaced ?? "not_applicable",
      safety_flags_issue: flagIssue ?? "no",
      estimated_time_saved: timeSaved ?? "0_minutes",
      useful_before_consultation: usefulBefore ?? "maybe",
      comments,
      submitted_at: new Date().toISOString(),
    };
    // Update local queue optimistically
    onUpdateQueue(updateQueueFeedback(queue, selectedId, feedback));
    setSaved(true);

    // Attempt backend persistence if case is persisted
    const queueItem = queue.find((q) => q.case_id === selectedId);
    if (queueItem?.persisted) {
      setFeedbackPersistStatus("saving");
      setFeedbackPersistError(null);
      try {
        const payload = buildReviewerFeedbackPayload(feedback);
        const result = await saveReviewerFeedback(selectedId, payload);
        setFeedbackPersistStatus(result.ok ? "saved" : result.status);
        if (!result.ok) setFeedbackPersistError(result.error);
      } catch {
        setFeedbackPersistStatus("error");
        setFeedbackPersistError("Unexpected error persisting feedback.");
      }
    } else {
      setFeedbackPersistStatus("idle");
    }

    setTimeout(() => setSaved(false), 4000);
  }

  async function handleLoadPersistedCases() {
    setPersistedCasesLoading(true);
    setPersistedCasesError(null);
    try {
      const result = await listPersistedCases({ limit: 50 });
      if (result.ok) {
        // Filter out cases already in local queue to avoid duplicates
        const localIds = new Set(queue.map((q) => q.case_id));
        const filtered = result.data.cases.filter((c) => !localIds.has(c.case_id));
        setPersistedCases(filtered);
        setPersistedCasesLoaded(true);
      } else {
        setPersistedCasesError(result.error);
      }
    } catch {
      setPersistedCasesError("Failed to load persisted cases.");
    } finally {
      setPersistedCasesLoading(false);
    }
  }

  async function handleSelectPersistedCase(c: PersistedReviewerCaseSummary) {
    setSelectedPersistedCase(c);
    setPersistedBundleDetail(null);
    try {
      const result = await getPersistedCase(c.case_id);
      if (result.ok) {
        setPersistedBundleDetail(result.data as unknown as Record<string, unknown>);
      }
    } catch {
      // Non-fatal — summary still shown
    }
  }

  function handleAuditDownload(format: "json" | "md") {
    if (!selectedQueueItem) return;
    const pc = selectedQueueItem.pilotCase;
    const record = buildAuditRecord(pc);
    if (format === "json") downloadAuditRecordJson(record);
    else downloadAuditRecordMarkdown(record);
    setAuditDlState(format);
    setTimeout(() => setAuditDlState("idle"), 2000);
  }

  const hasQueue = queue.length > 0;

  return (
    <section className="mx-auto max-w-[1360px] px-6 py-10 lg:py-14">
      <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
        {/* ─── Main column ─── */}
        <div>
          <SectionLabel>Physician Reviewer Workspace</SectionLabel>
          <h2 className="mt-3 font-sans text-heading-lg font-semibold text-ink">
            Review routed cases
          </h2>
          <p className="mt-2 max-w-[560px] text-body leading-relaxed text-ink-secondary">
            Review routed cases, assess the suggested route, and submit structured feedback.
          </p>

          <div className="mt-4 flex items-center gap-2 rounded-lg border border-rule-light bg-surface px-3.5 py-2">
            <span className={cn("h-1.5 w-1.5 rounded-full", queue.some((q) => q.persisted) ? "bg-routine" : "bg-muted/50")} />
            <span className="font-mono text-label text-muted">
              {queue.some((q) => q.persisted) ? "Reviewer feedback is persisted for saved cases." : "Local reviewer queue. Feedback is persisted for database-backed cases."}
            </span>
          </div>

          {/* Filter pills + sample toggle */}
          <div className="mt-5 flex flex-wrap items-center gap-1.5">
            {FILTERS.map((f) => (
              <button key={f.key} onClick={() => setFilter(f.key)} className={cn(
                "rounded-badge border px-3 py-1 font-mono text-label uppercase tracking-wide transition-all",
                filter === f.key ? "border-ink/20 bg-ink text-warm-white font-medium" : "border-rule-light bg-warm-white text-muted hover:text-ink-secondary",
              )}>{f.label}</button>
            ))}
            <span className="mx-1 h-3 w-px bg-rule-light" />
            <button
              onClick={() => setShowSamples(!showSamples)}
              className="rounded-badge border border-rule-light bg-warm-white px-3 py-1 font-mono text-label uppercase tracking-wide text-muted transition-all hover:text-ink-secondary"
            >
              {showSamples ? "Hide samples" : "Show samples"}
            </button>
          </div>

          {/* Empty state */}
          {visibleRows.length === 0 && (
            <div className="mt-8 rounded-card border border-rule-light bg-surface p-8 text-center">
              <p className="text-body font-medium text-ink-secondary">No cases sent to reviewer yet.</p>
              <p className="mt-1 text-body-sm text-muted">Run a pilot case and click &quot;Send to Reviewer&quot; from the final report.</p>
            </div>
          )}

          {/* Case table */}
          {visibleRows.length > 0 && (
            <div className="mt-5 overflow-x-auto rounded-card border border-rule-light/80">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-rule-light/60 bg-surface/40">
                    <th className="px-3 py-2.5 font-mono text-eyebrow font-medium uppercase tracking-label text-muted">Case</th>
                    <th className="px-3 py-2.5 font-mono text-eyebrow font-medium uppercase tracking-label text-muted">Complaint</th>
                    <th className="px-3 py-2.5 font-mono text-eyebrow font-medium uppercase tracking-label text-muted">Route</th>
                    <th className="px-3 py-2.5 font-mono text-eyebrow font-medium uppercase tracking-label text-muted text-center">Flags</th>
                    <th className="px-3 py-2.5 font-mono text-eyebrow font-medium uppercase tracking-label text-muted text-center">Edits</th>
                    <th className="px-3 py-2.5 font-mono text-eyebrow font-medium uppercase tracking-label text-muted">Status</th>
                    <th className="px-3 py-2.5 font-mono text-eyebrow font-medium uppercase tracking-label text-muted">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleRows.map((r) => {
                    const isSelected = selectedId === r.case_id;
                    return (
                      <tr key={r.case_id} className={cn("border-b border-rule-light/50 transition-colors", isSelected ? "bg-accent-soft/20" : "bg-warm-white hover:bg-surface/40")}>
                        <td className="px-3 py-2.5">
                          <span className="font-mono text-label text-ink-secondary">{r.case_id}</span>
                          {r.isSession && <span className="ml-1.5 rounded-badge bg-accent-soft px-1.5 py-0.5 font-mono text-eyebrow text-accent">session</span>}
                        </td>
                        <td className="max-w-[220px] px-3 py-2.5 text-meta text-ink-secondary">{r.chief_complaint}</td>
                        <td className="px-3 py-2.5">
                          <span className={cn("rounded-badge border px-2 py-0.5 font-mono text-eyebrow uppercase tracking-wide", getRouteBadgeCls(r.route))}>{r.route_label}</span>
                        </td>
                        <td className="px-3 py-2.5 text-center font-mono text-label">
                          <span className={r.safety_flags_count > 0 ? "text-emergency" : "text-muted"}>{r.safety_flags_count}</span>
                        </td>
                        <td className="px-3 py-2.5 text-center font-mono text-label">
                          <span className={r.human_edits_count > 0 ? "text-accent" : "text-muted"}>{r.human_edits_count}</span>
                        </td>
                        <td className="px-3 py-2.5">
                          <span className={cn("rounded-badge px-2 py-0.5 font-mono text-eyebrow uppercase tracking-wide", getReviewBadgeCls(r.review_status))}>
                            {r.review_status === "reviewed" ? "Reviewed" : "Pending"}
                          </span>
                        </td>
                        <td className="px-3 py-2.5">
                          <div className="flex gap-1.5">
                            {r.isSession && (
                              <button onClick={() => selectCase(r.case_id)} className={cn("rounded-btn border px-2.5 py-1 font-mono text-eyebrow uppercase tracking-wide transition-all", isSelected ? "border-accent bg-accent text-white" : "border-accent/30 bg-accent-soft text-accent hover:bg-accent hover:text-white")}>
                                Review
                              </button>
                            )}
                            {!r.isSession && (
                              <button onClick={() => onOpenReport(r.case_id)} className="rounded-btn border border-rule bg-paper px-2.5 py-1 font-mono text-eyebrow uppercase tracking-wide text-ink-secondary transition-all hover:border-accent hover:text-accent">
                                Report
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* ─── Case detail + feedback panel ─── */}
          {selectedQueueItem && (
            <div className="mt-6 rounded-card border border-accent/15 bg-warm-white p-5 shadow-card sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <SectionLabel>Case Review &amp; Feedback</SectionLabel>
                <button onClick={() => { setSelectedId(null); clearForm(); }} className="font-mono text-label uppercase tracking-wide text-muted hover:text-ink">Close</button>
              </div>

              {/* Case detail */}
              <div className="mt-4 grid gap-3 rounded-lg border border-rule-light bg-surface/50 p-4 sm:grid-cols-2 lg:grid-cols-3">
                <div><span className="font-mono text-eyebrow uppercase text-muted">Case</span><p className="mt-0.5 font-mono text-meta text-ink-secondary">{selectedQueueItem.case_id}</p></div>
                <div><span className="font-mono text-eyebrow uppercase text-muted">Route</span><p className="mt-0.5 text-meta text-ink-secondary">{selectedQueueItem.route_label}</p></div>
                <div><span className="font-mono text-eyebrow uppercase text-muted">Chief complaint</span><p className="mt-0.5 text-meta text-ink-secondary">{selectedQueueItem.chief_complaint}</p></div>
                <div><span className="font-mono text-eyebrow uppercase text-muted">Safety flags</span><p className="mt-0.5 font-mono text-meta text-ink-secondary">{selectedQueueItem.safety_flags_count}</p></div>
                <div><span className="font-mono text-eyebrow uppercase text-muted">Human edits</span><p className="mt-0.5 font-mono text-meta text-ink-secondary">{selectedQueueItem.human_edits_count}</p></div>
                <div><span className="font-mono text-eyebrow uppercase text-muted">Extraction</span><p className="mt-0.5 font-mono text-meta text-ink-secondary">{selectedQueueItem.extraction_source}</p></div>
                <div><span className="font-mono text-eyebrow uppercase text-muted">Routing</span><p className="mt-0.5 font-mono text-meta text-ink-secondary">{selectedQueueItem.routing_source}</p></div>
                <div><span className="font-mono text-eyebrow uppercase text-muted">Review status</span><p className="mt-0.5 font-mono text-meta capitalize text-ink-secondary">{selectedQueueItem.review_status.replace(/_/g, " ")}</p></div>
              </div>

              {/* AI summary if present */}
              {selectedQueueItem.pilotCase.extraction?.structured_clinical_summary && (
                <div className="mt-3 rounded-lg border border-rule-light/60 bg-surface/40 p-3">
                  <p className="mb-1 font-mono text-eyebrow font-medium uppercase text-muted">AI structured summary</p>
                  <p className="text-meta leading-relaxed text-ink-secondary">{selectedQueueItem.pilotCase.extraction.structured_clinical_summary}</p>
                </div>
              )}

              {/* Audit export from reviewer */}
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => handleAuditDownload("json")}
                  className="rounded-btn border border-rule bg-paper px-3 py-1.5 font-mono text-label uppercase tracking-wide text-ink-secondary transition-all hover:border-accent hover:text-accent"
                >
                  {auditDlState === "json" ? "Downloaded!" : "Export Audit JSON"}
                </button>
                <button
                  onClick={() => handleAuditDownload("md")}
                  className="rounded-btn border border-rule bg-paper px-3 py-1.5 font-mono text-label uppercase tracking-wide text-ink-secondary transition-all hover:border-accent hover:text-accent"
                >
                  {auditDlState === "md" ? "Downloaded!" : "Export Audit Markdown"}
                </button>
              </div>

              {/* Feedback form */}
              <div className="mt-5 space-y-4">
                <CardPanel><h4 className="mb-2 font-mono text-label font-medium uppercase tracking-label text-ink-secondary">1. Was the route appropriate?</h4>
                  <div className="flex flex-wrap gap-2">
                    <OptionBtn selected={routeOk === "agree"} label="Agree" onClick={() => setRouteOk("agree")} />
                    <OptionBtn selected={routeOk === "partially_agree"} label="Partially agree" onClick={() => setRouteOk("partially_agree")} />
                    <OptionBtn selected={routeOk === "disagree"} label="Disagree" onClick={() => setRouteOk("disagree")} />
                  </div>
                </CardPanel>

                <CardPanel><h4 className="mb-2 font-mono text-label font-medium uppercase tracking-label text-ink-secondary">2. Was the report clinically useful?</h4>
                  <div className="flex items-center gap-2">
                    {[1,2,3,4,5].map((v) => <ScaleBtn key={v} selected={usefulness===v} value={v} onClick={() => setUsefulness(v)} />)}
                    <span className="ml-2 font-mono text-label text-muted">{usefulness ? `${usefulness} / 5` : ""}</span>
                  </div>
                </CardPanel>

                <CardPanel><h4 className="mb-2 font-mono text-label font-medium uppercase tracking-label text-ink-secondary">3. Did Soficca surface important missing information?</h4>
                  <div className="flex flex-wrap gap-2">
                    <OptionBtn selected={missingSurfaced === "yes"} label="Yes" onClick={() => setMissingSurfaced("yes")} />
                    <OptionBtn selected={missingSurfaced === "partially"} label="Partially" onClick={() => setMissingSurfaced("partially")} />
                    <OptionBtn selected={missingSurfaced === "no"} label="No" onClick={() => setMissingSurfaced("no")} />
                    <OptionBtn selected={missingSurfaced === "not_applicable"} label="Not applicable" onClick={() => setMissingSurfaced("not_applicable")} />
                  </div>
                </CardPanel>

                <CardPanel><h4 className="mb-2 font-mono text-label font-medium uppercase tracking-label text-ink-secondary">4. Were any safety flags wrong or missing?</h4>
                  <div className="flex flex-wrap gap-2">
                    <OptionBtn selected={flagIssue === "no"} label="No" onClick={() => setFlagIssue("no")} />
                    <OptionBtn selected={flagIssue === "missing_flag"} label="Yes, missing flag" onClick={() => setFlagIssue("missing_flag")} />
                    <OptionBtn selected={flagIssue === "incorrect_flag"} label="Yes, incorrect flag" onClick={() => setFlagIssue("incorrect_flag")} />
                    <OptionBtn selected={flagIssue === "unsure"} label="Unsure" onClick={() => setFlagIssue("unsure")} />
                  </div>
                </CardPanel>

                <CardPanel><h4 className="mb-2 font-mono text-label font-medium uppercase tracking-label text-ink-secondary">5. Estimated review-time saved</h4>
                  <div className="flex flex-wrap gap-2">
                    <OptionBtn selected={timeSaved === "0_minutes"} label="0 minutes" onClick={() => setTimeSaved("0_minutes")} />
                    <OptionBtn selected={timeSaved === "1_2_minutes"} label="1–2 minutes" onClick={() => setTimeSaved("1_2_minutes")} />
                    <OptionBtn selected={timeSaved === "3_5_minutes"} label="3–5 minutes" onClick={() => setTimeSaved("3_5_minutes")} />
                    <OptionBtn selected={timeSaved === "5_plus_minutes"} label="5+ minutes" onClick={() => setTimeSaved("5_plus_minutes")} />
                  </div>
                </CardPanel>

                <CardPanel><h4 className="mb-2 font-mono text-label font-medium uppercase tracking-label text-ink-secondary">6. Would this be useful before consultation?</h4>
                  <div className="flex flex-wrap gap-2">
                    <OptionBtn selected={usefulBefore === "yes"} label="Yes" onClick={() => setUsefulBefore("yes")} />
                    <OptionBtn selected={usefulBefore === "maybe"} label="Maybe" onClick={() => setUsefulBefore("maybe")} />
                    <OptionBtn selected={usefulBefore === "no"} label="No" onClick={() => setUsefulBefore("no")} />
                  </div>
                </CardPanel>

                <CardPanel><h4 className="mb-2 font-mono text-label font-medium uppercase tracking-label text-ink-secondary">7. Reviewer comments</h4>
                  <textarea value={comments} onChange={(e) => setComments(e.target.value)} placeholder="Add clinical notes, disagreement rationale, or missing context." className="min-h-[90px] w-full resize-y rounded-lg border border-rule bg-white p-3 font-sans text-body-sm leading-relaxed text-ink placeholder:text-muted/40 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/20" />
                </CardPanel>
              </div>

              {/* Actions */}
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  onClick={handleSave}
                  disabled={!routeOk}
                  className="inline-flex h-11 items-center gap-2 rounded-btn bg-ink px-5 font-mono text-label font-medium uppercase text-warm-white shadow-btn transition-all hover:-translate-y-px hover:shadow-card-hover disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Submit feedback
                </button>
                <button onClick={clearForm} className="inline-flex h-11 items-center rounded-btn border border-rule bg-warm-white px-4 font-mono text-label uppercase text-ink-secondary transition-all hover:border-accent/40 hover:text-ink">Clear form</button>
              </div>

              {saved && feedbackPersistStatus === "idle" && !selectedQueueItem?.persisted && (
                <div className="mt-4 rounded-lg border border-accent/20 bg-accent-soft/50 px-4 py-3">
                  <p className="text-body-sm font-medium text-accent">Feedback captured locally.</p>
                  <p className="mt-0.5 text-caption text-muted">Save case to database before persisted review.</p>
                  <p className="mt-1 text-caption text-muted">Physicians remain the final clinical decision-makers. Soficca does not diagnose, prescribe, or replace clinical judgment.</p>
                </div>
              )}
              {saved && feedbackPersistStatus === "saving" && (
                <div className="mt-4 rounded-lg border border-accent/20 bg-accent-soft/50 px-4 py-3">
                  <p className="text-body-sm font-medium text-accent">Saving reviewer feedback...</p>
                </div>
              )}
              {saved && feedbackPersistStatus === "saved" && (
                <div className="mt-4 rounded-lg border border-routine/20 bg-routine/5 px-4 py-3">
                  <p className="text-body-sm font-medium text-routine">Reviewer feedback saved to database.</p>
                  <p className="mt-1 text-caption text-muted">Physicians remain the final clinical decision-makers. Soficca does not diagnose, prescribe, or replace clinical judgment.</p>
                </div>
              )}
              {saved && (feedbackPersistStatus === "error" || feedbackPersistStatus === "unavailable") && (
                <div className="mt-4 rounded-lg border border-urgent/20 bg-urgent-soft/50 px-4 py-3">
                  <p className="text-body-sm font-medium text-urgent">Database save failed — feedback retained locally.</p>
                  {feedbackPersistError && <p className="mt-0.5 text-caption text-urgent/70">{feedbackPersistError}</p>}
                  <p className="mt-1 text-caption text-muted">Physicians remain the final clinical decision-makers. Soficca does not diagnose, prescribe, or replace clinical judgment.</p>
                </div>
              )}
            </div>
          )}

          {/* ─── Persisted cases section ─── */}
          <div className="mt-8">
            <div className="flex items-center gap-3">
              <SectionLabel>Persisted Cases</SectionLabel>
              <button
                onClick={handleLoadPersistedCases}
                disabled={persistedCasesLoading}
                className={cn(
                  "rounded-btn border px-3 py-1.5 font-mono text-label uppercase tracking-wide transition-all",
                  persistedCasesLoading
                    ? "cursor-wait border-accent/30 bg-accent/5 text-accent"
                    : "border-accent/30 bg-paper text-accent hover:bg-accent hover:text-white"
                )}
              >
                {persistedCasesLoading ? "Loading..." : persistedCasesLoaded ? "Refresh" : "Load Persisted Cases"}
              </button>
            </div>
            {persistedCasesError && (
              <p className="mt-2 text-body-sm text-urgent">{persistedCasesError}</p>
            )}
            {persistedCasesLoaded && persistedCases.length === 0 && !persistedCasesError && (
              <p className="mt-3 text-body-sm text-muted">No additional persisted cases found. Cases already in local queue are excluded.</p>
            )}
            {persistedCases.length > 0 && (
              <div className="mt-3 overflow-x-auto rounded-card border border-rule-light/80">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-rule-light/60 bg-surface/40">
                      <th className="px-3 py-2.5 font-mono text-eyebrow font-medium uppercase tracking-label text-muted">Case</th>
                      <th className="px-3 py-2.5 font-mono text-eyebrow font-medium uppercase tracking-label text-muted">Route</th>
                      <th className="px-3 py-2.5 font-mono text-eyebrow font-medium uppercase tracking-label text-muted">Status</th>
                      <th className="px-3 py-2.5 font-mono text-eyebrow font-medium uppercase tracking-label text-muted">Source</th>
                      <th className="px-3 py-2.5 font-mono text-eyebrow font-medium uppercase tracking-label text-muted">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {persistedCases.map((c) => (
                      <tr key={c.case_id} className={cn("border-b border-rule-light/50 transition-colors", selectedPersistedCase?.case_id === c.case_id ? "bg-accent-soft/20" : "bg-warm-white hover:bg-surface/40")}>
                        <td className="px-3 py-2.5">
                          <span className="font-mono text-label text-ink-secondary">{c.case_id}</span>
                          <span className="ml-1.5 rounded-badge bg-routine/10 px-1.5 py-0.5 font-mono text-eyebrow text-routine">persisted</span>
                        </td>
                        <td className="px-3 py-2.5">
                          <span className={cn("rounded-badge border px-2 py-0.5 font-mono text-eyebrow uppercase tracking-wide", getRouteBadgeCls(c.final_route))}>
                            {c.final_route?.replace(/_/g, " ") ?? "—"}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 font-mono text-label capitalize text-ink-secondary">{c.current_status.replace(/_/g, " ")}</td>
                        <td className="px-3 py-2.5 font-mono text-label text-muted">{c.extraction_source ?? "—"} / {c.routing_source ?? "—"}</td>
                        <td className="px-3 py-2.5">
                          <button
                            onClick={() => handleSelectPersistedCase(c)}
                            className={cn("rounded-btn border px-2.5 py-1 font-mono text-eyebrow uppercase tracking-wide transition-all",
                              selectedPersistedCase?.case_id === c.case_id ? "border-accent bg-accent text-white" : "border-accent/30 bg-accent-soft text-accent hover:bg-accent hover:text-white"
                            )}
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {selectedPersistedCase && (
              <div className="mt-4 rounded-card border border-accent/15 bg-warm-white p-5 shadow-card">
                <div className="flex items-center justify-between gap-4">
                  <SectionLabel>Persisted Case Detail</SectionLabel>
                  <button onClick={() => { setSelectedPersistedCase(null); setPersistedBundleDetail(null); }} className="font-mono text-label uppercase tracking-wide text-muted hover:text-ink">Close</button>
                </div>
                <div className="mt-3 grid gap-3 rounded-lg border border-rule-light bg-surface/50 p-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div><span className="font-mono text-eyebrow uppercase text-muted">Case</span><p className="mt-0.5 font-mono text-meta text-ink-secondary">{selectedPersistedCase.case_id}</p></div>
                  <div><span className="font-mono text-eyebrow uppercase text-muted">Route</span><p className="mt-0.5 text-meta text-ink-secondary">{selectedPersistedCase.final_route?.replace(/_/g, " ") ?? "—"}</p></div>
                  <div><span className="font-mono text-eyebrow uppercase text-muted">Decision status</span><p className="mt-0.5 text-meta capitalize text-ink-secondary">{selectedPersistedCase.decision_status?.replace(/_/g, " ") ?? "—"}</p></div>
                  <div><span className="font-mono text-eyebrow uppercase text-muted">Extraction source</span><p className="mt-0.5 font-mono text-meta text-ink-secondary">{selectedPersistedCase.extraction_source ?? "—"}</p></div>
                  <div><span className="font-mono text-eyebrow uppercase text-muted">Routing source</span><p className="mt-0.5 font-mono text-meta text-ink-secondary">{selectedPersistedCase.routing_source ?? "—"}</p></div>
                  <div><span className="font-mono text-eyebrow uppercase text-muted">Status</span><p className="mt-0.5 font-mono text-meta capitalize text-ink-secondary">{selectedPersistedCase.current_status.replace(/_/g, " ")}</p></div>
                </div>
                {selectedPersistedCase.chief_complaint_summary && (
                  <div className="mt-3 rounded-lg border border-rule-light/60 bg-surface/40 p-3">
                    <p className="mb-1 font-mono text-eyebrow font-medium uppercase text-muted">Chief complaint summary</p>
                    <p className="text-meta leading-relaxed text-ink-secondary">{selectedPersistedCase.chief_complaint_summary}</p>
                  </div>
                )}
                {persistedBundleDetail && (
                  <div className="mt-3 space-y-1.5 text-meta">
                    <div className="flex justify-between"><span className="text-muted">Reviewer feedback count</span><span className="font-mono text-ink-secondary">{Array.isArray((persistedBundleDetail as Record<string, unknown>).reviewer_feedback) ? ((persistedBundleDetail as Record<string, unknown>).reviewer_feedback as unknown[]).length : 0}</span></div>
                    <div className="flex justify-between"><span className="text-muted">Audit record</span><span className="font-mono text-ink-secondary">{(persistedBundleDetail as Record<string, unknown>).audit_record ? "Available" : "—"}</span></div>
                    <div className="flex justify-between"><span className="text-muted">Engine report</span><span className="font-mono text-ink-secondary">{(persistedBundleDetail as Record<string, unknown>).engine_report ? "Available" : "—"}</span></div>
                  </div>
                )}
                <p className="mt-3 text-eyebrow text-muted">Persisted bundle loaded from backend. Not counted in current session metrics unless added through the current reviewer queue.</p>
              </div>
            )}
          </div>
        </div>

        {/* ─── Sidebar metrics ─── */}
        <aside className="space-y-4 lg:sticky lg:top-header lg:self-start">
          <div className="rounded-card border border-rule-light/80 bg-warm-white p-5 shadow-card">
            <p className="font-mono text-eyebrow font-medium uppercase tracking-eyebrow text-muted">
              Reviewer metrics
            </p>
            <div className="mt-3 space-y-2 text-meta">
              <MetricRow label="Session cases" value={String(metrics.total_in_queue)} />
              <MetricRow label="Pending review" value={String(metrics.pending_review)} warn={metrics.pending_review > 0} />
              <MetricRow label="Reviewed" value={String(metrics.reviewed)} highlight={metrics.reviewed > 0} />
              <MetricRow label="Agreement rate" value={metrics.agreement_rate !== null ? `${(metrics.agreement_rate * 100).toFixed(0)}%` : "—"} highlight={metrics.agreement_rate !== null && metrics.agreement_rate >= 0.8} />
              <MetricRow label="Avg usefulness" value={metrics.average_usefulness !== null ? `${metrics.average_usefulness.toFixed(1)} / 5` : "—"} />
              <MetricRow label="Avg time saved" value={metrics.average_time_saved ?? "—"} />
              <div className="border-t border-rule-light pt-2">
                <MetricRow label="Emergency reviewed" value={String(metrics.emergency_routes_reviewed)} />
                <MetricRow label="With human edits" value={String(metrics.cases_with_human_edits)} />
                <MetricRow label="Audit exports available" value={String(metrics.audit_exports_available)} />
              </div>
            </div>
            <p className="mt-3 border-t border-rule-light pt-2 text-eyebrow text-muted">
              Current session metrics only. Sample cases and separately loaded persisted cases are not counted.
            </p>
          </div>

          {!hasQueue && (
            <div className="rounded-card border border-rule-light/80 bg-warm-white p-5 shadow-card">
              <p className="font-mono text-eyebrow font-medium uppercase tracking-eyebrow text-muted">
                Getting started
              </p>
              <p className="mt-2 text-meta leading-relaxed text-muted">
                Run a pilot case through the full flow, then click &quot;Send to Reviewer&quot; in the final report to populate this queue.
              </p>
            </div>
          )}

          <div className="rounded-card border border-rule-light/80 bg-warm-white p-5 shadow-card">
            <p className="font-mono text-eyebrow font-medium uppercase tracking-eyebrow text-muted">
              Governance
            </p>
            <p className="mt-2 text-caption leading-relaxed text-muted">
              Physicians remain the final clinical decision-makers. Soficca does not diagnose, prescribe, or replace clinical judgment.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

// ── Sub-components ──────────────────────────────────────────────

function MetricRow({ label, value, highlight, warn }: { label: string; value: string; highlight?: boolean; warn?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted">{label}</span>
      <span className={cn("font-mono text-label font-medium", warn ? "text-urgent" : highlight ? "text-routine" : "text-ink-secondary")}>{value}</span>
    </div>
  );
}
