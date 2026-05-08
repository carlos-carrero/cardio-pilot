"use client";

import { useState } from "react";
import { SectionLabel } from "@/components/ui/section-label";
import { CardPanel } from "@/components/ui/card-panel";
import { cn } from "@/lib/cn";
import { goldenScenarios } from "@/data/golden-scenarios";
import type { SessionMetrics } from "@/types";

// ── Types ───────────────────────────────────────────────────────

type CheckPhase = "before" | "during" | "after";

interface CheckItem {
  id: string;
  label: string;
  phase: CheckPhase;
}

const CHECKLIST: CheckItem[] = [
  // Before
  { id: "be_backend", label: "Backend running (local port 8000 or deployed URL)", phase: "before" },
  { id: "be_frontend", label: "Frontend running (local or Vercel)", phase: "before" },
  { id: "be_openai", label: "OPENAI_API_KEY configured in backend environment", phase: "before" },
  { id: "be_db", label: "DATABASE_URL configured on backend (for persistence)", phase: "before" },
  { id: "be_ai_extraction", label: "Real AI extraction working", phase: "before" },
  { id: "be_backend_routing", label: "Real deterministic backend routing working", phase: "before" },
  { id: "be_reviewer_empty", label: "Reviewer queue empty or reset", phase: "before" },
  { id: "be_metrics_reset", label: "Metrics session reset or ready", phase: "before" },
  { id: "be_simulated_only", label: "Use simulated / anonymized cases only", phase: "before" },
  { id: "be_no_clinical", label: "No clinical validation claims", phase: "before" },
  // During
  { id: "du_intake", label: "Show guided intake", phase: "during" },
  { id: "du_extraction", label: "Show AI extraction", phase: "during" },
  { id: "du_correction", label: "Show human correction", phase: "during" },
  { id: "du_routing", label: "Show Soficca routing", phase: "during" },
  { id: "du_report", label: "Show audit report", phase: "during" },
  { id: "du_reviewer", label: "Send to reviewer", phase: "during" },
  { id: "du_feedback", label: "Submit reviewer feedback", phase: "during" },
  { id: "du_metrics", label: "Show metrics", phase: "during" },
  { id: "du_export", label: "Export session summary", phase: "during" },
  // After
  { id: "af_audit", label: "Export audit JSON / Markdown if useful", phase: "after" },
  { id: "af_session", label: "Export session summary if useful", phase: "after" },
  { id: "af_persist_session", label: "Create persisted session (Metrics Dashboard)", phase: "after" },
  { id: "af_persist_case", label: "Save case to database", phase: "after" },
  { id: "af_persist_feedback", label: "Persist reviewer feedback", phase: "after" },
  { id: "af_persist_summary", label: "Save session summary to backend", phase: "after" },
  { id: "af_persist_load", label: "Load persisted summary / cases", phase: "after" },
  { id: "af_reset", label: "Reset current demo session if needed", phase: "after" },
];

const PHASE_LABELS: Record<CheckPhase, string> = {
  before: "Before demo",
  during: "During demo",
  after: "After demo",
};

interface DemoGuideProps {
  metrics: SessionMetrics;
  onLoadScenario: (narrative: string) => void;
  onResetSession: () => void;
}

// ── Component ───────────────────────────────────────────────────

export function DemoGuide({ metrics, onLoadScenario, onResetSession }: DemoGuideProps) {
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
      <SectionLabel>Demo Guide</SectionLabel>
      <h2 className="mt-3 font-sans text-heading-lg font-semibold leading-tight tracking-tighter text-ink">
        Guided demo script for advisors, physicians, and stakeholders
      </h2>

      <div className="mt-4 flex items-center gap-2 rounded-lg border border-rule-light bg-surface px-3.5 py-2">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        <span className="font-mono text-label text-muted">
          Local-first demo · Real AI extraction · Real routing · Database persistence available
        </span>
      </div>

      {/* ── Two-column layout ── */}
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        {/* ─── Main column ─── */}
        <div className="space-y-8">
          {/* Suggested opening */}
          <CardPanel>
            <h3 className="font-mono text-label font-medium uppercase tracking-label text-ink-secondary">
              Suggested opening
            </h3>
            <blockquote className="mt-3 border-l-2 border-rule pl-4 text-body leading-relaxed text-ink italic">
              &ldquo;Soficca is the governed decision layer underneath clinical workflows.
              In this pilot, AI structures messy cardiovascular narratives, humans confirm the structured signal,
              and Soficca applies deterministic safety routing.&rdquo;
            </blockquote>
          </CardPanel>

          {/* Demo objective */}
          <CardPanel>
            <h3 className="font-mono text-label font-medium uppercase tracking-label text-ink-secondary">
              Demo objective
            </h3>
            <p className="mt-3 text-body leading-relaxed text-ink-secondary">
              Show how Soficca converts free-text cardiovascular narratives into structured signals,
              allows human confirmation, applies deterministic routing, generates an auditable report,
              sends a case to reviewer, captures feedback, and exports session metrics.
            </p>
          </CardPanel>

          {/* Recommended 3-minute demo flow */}
          <CardPanel>
            <h3 className="font-mono text-label font-medium uppercase tracking-label text-ink-secondary">
              Recommended 3-minute demo flow
            </h3>
            <div className="mt-4 space-y-2.5">
              {[
                "Start with the Welcome / Pilot Flow.",
                "Load the Emergency red-flag golden scenario.",
                "Show guided intake signals and completeness.",
                "Run real AI extraction.",
                "Show structured summary, field evidence, missing info, and completion questions.",
                "Edit one field to demonstrate human confirmation.",
                "Run Soficca deterministic routing.",
                "Show final report, signal chain, human correction status, and audit trace.",
                "Send case to Reviewer.",
                "Submit reviewer feedback.",
                "Open Metrics and show current session metrics.",
                "Export session summary or case audit record.",
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-rule bg-surface font-mono text-eyebrow font-bold text-muted">
                    {i + 1}
                  </span>
                  <span className="text-body-sm leading-snug text-ink-secondary">{step}</span>
                </div>
              ))}
            </div>
          </CardPanel>

          {/* What to say */}
          <CardPanel>
            <h3 className="font-mono text-label font-medium uppercase tracking-label text-ink-secondary">
              Core message
            </h3>
            <blockquote className="mt-3 border-l-2 border-rule pl-4 text-body leading-relaxed text-ink-secondary italic">
              &ldquo;AI structures the signal. The human confirms the extraction.
              Soficca applies deterministic safety routing. The physician remains the final decision-maker.&rdquo;
            </blockquote>
          </CardPanel>

          {/* What not to claim */}
          <CardPanel>
            <h3 className="font-mono text-label font-medium uppercase tracking-label text-ink-secondary">
              What not to claim
            </h3>
            <ul className="mt-3 space-y-1.5 text-body-sm text-ink-secondary">
              {[
                "Do not claim clinical validation.",
                "Do not claim improved outcomes.",
                "Do not claim realized cost reduction.",
                "Do not claim AI diagnoses or decides route.",
                "Do not use real identifiable patient data.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-emergency/60" />
                  {item}
                </li>
              ))}
            </ul>
          </CardPanel>

          {/* Golden scenario shortcuts */}
          <CardPanel>
            <h3 className="font-mono text-label font-medium uppercase tracking-label text-ink-secondary">
              Golden scenario shortcuts
            </h3>
            <p className="mt-2 text-meta text-muted">
              Use simulated scenarios only. Loads narrative into Pilot Flow intake.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {demoScenarios.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleLoadScenario(s.narrative, s.label)}
                  className="inline-flex h-9 items-center rounded-btn border border-rule bg-warm-white px-3.5 font-mono text-eyebrow uppercase tracking-wide text-ink-secondary transition-all hover:border-ink/30 hover:text-ink"
                >
                  {s.label}
                </button>
              ))}
            </div>
            {copyMsg && (
              <p className="mt-2 font-mono text-eyebrow text-routine">
                Loaded: {copyMsg} — navigate to Pilot Flow
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
                    {PHASE_LABELS[phase]}
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
                          {item.label}
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
              Demo mode status
            </p>
            <div className="mt-3 space-y-2 text-meta">
              <StatusRow label="Data mode" value="Local / session only" />
              <StatusRow label="AI extraction" value="Real backend AI · fallback available" />
              <StatusRow label="Routing" value="Real deterministic backend · fallback available" />
              <StatusRow label="Reviewer queue" value="Local · feedback persisted for saved cases" />
              <StatusRow label="Metrics" value="Local-derived · persisted summaries available" />
              <StatusRow label="Persistence" value="Cases, feedback, sessions, summaries" />
              <StatusRow label="Clinical claims" value="Not validated" />
            </div>
          </div>

          {/* Session snapshot */}
          <div className="rounded-card border border-rule-light/80 bg-warm-white shadow-card p-5">
            <p className="font-mono text-eyebrow font-medium uppercase tracking-eyebrow text-muted">
              Current session snapshot
            </p>
            <div className="mt-3 space-y-2 text-meta">
              <StatusRow label="Cases processed" value={String(metrics.cases_processed)} />
              <StatusRow label="Sent to reviewer" value={String(metrics.cases_sent_to_reviewer)} />
              <StatusRow label="Reviewed" value={String(metrics.cases_reviewed)} />
              <StatusRow label="Pending review" value={String(metrics.pending_review)} />
            </div>
          </div>

          {/* Demo outputs */}
          <div className="rounded-card border border-rule-light/80 bg-warm-white shadow-card p-5">
            <p className="font-mono text-eyebrow font-medium uppercase tracking-eyebrow text-muted">
              Demo outputs
            </p>
            <ul className="mt-3 space-y-1.5 text-meta text-ink-secondary">
              <li>Case audit JSON</li>
              <li>Case audit Markdown</li>
              <li>Session summary JSON</li>
              <li>Session summary Markdown</li>
              <li>Reviewer feedback summary</li>
              <li>Local metrics dashboard</li>
            </ul>
            <p className="mt-3 border-t border-rule-light pt-2 font-mono text-eyebrow text-muted">
              Exports are local files generated in the browser. No session data is persisted in Stage 2B.9.
            </p>
          </div>

          {/* Reset local session */}
          <div className="rounded-card border border-rule-light/80 bg-warm-white shadow-card p-5">
            <p className="font-mono text-eyebrow font-medium uppercase tracking-eyebrow text-muted">
              Reset local demo session
            </p>
            <p className="mt-2 text-caption leading-relaxed text-muted">
              Clears local demo cases, reviewer feedback, and session metrics. Does not affect backend code or saved files.
            </p>
            <p className="mt-1 font-mono text-eyebrow text-muted">
              Local reset only. No backend data is deleted.
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
              {resetConfirm ? "Confirm reset — clears all current session data" : "Reset current demo session"}
            </button>
            {resetConfirm && (
              <button
                onClick={() => setResetConfirm(false)}
                className="mt-1.5 w-full rounded-btn border border-rule-light px-3.5 py-1.5 font-mono text-eyebrow text-muted transition-all hover:text-ink"
              >
                Cancel
              </button>
            )}
          </div>

          {/* Governance */}
          <div className="rounded-xl border border-rule-light bg-surface p-5">
            <p className="text-meta leading-relaxed text-muted">
              This demo does not claim clinical validation, outcome improvement, or realized cost reduction.
              Soficca does not diagnose, prescribe, or replace clinical judgment.
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
