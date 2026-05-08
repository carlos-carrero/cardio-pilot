"use client";

import { SectionLabel } from "@/components/ui/section-label";
import { CardPanel } from "@/components/ui/card-panel";

const SECTIONS: { title: string; items: string[] }[] = [
  {
    title: "What the pilot demonstrates",
    items: [
      "Guided cardiovascular intake from free-text narrative.",
      "Real AI signal extraction with field evidence and confidence.",
      "Human-confirmed structured input before routing.",
      "Deterministic Soficca routing with safety policy enforcement.",
      "Physician-reviewable governed report with audit trace.",
      "Reviewer feedback loop with structured agreement capture and database persistence for saved cases.",
      "Session metrics reflecting cases, routes, and reviewer signals with optional persisted summaries.",
      "Audit export (JSON and Markdown) for individual cases and full sessions.",
      "Database persistence for saved cases, reviewer feedback, and session summaries.",
    ],
  },
  {
    title: "What Soficca governs",
    items: [
      "Routing logic — deterministic rules, not AI decisions.",
      "Safety policy — red-flag detection and escalation overrides.",
      "Versioned ruleset and engine trace for every routed case.",
      "Missing information handling — deferrals when data is insufficient.",
      "Conflict handling — blocks routing when inputs are contradictory.",
      "Report integrity — no diagnosis, no prescription, human review required.",
    ],
  },
  {
    title: "What AI does",
    items: [
      "Structures free-text narratives into clinical signals.",
      "Provides field-level evidence with source text and confidence.",
      "Summarizes extracted facts for physician review.",
      "Suggests intake completion questions for missing data.",
      "Flags missing, uncertain, or potentially conflicting information.",
    ],
  },
  {
    title: "What AI does not do",
    items: [
      "Does not diagnose.",
      "Does not prescribe.",
      "Does not decide the route.",
      "Does not replace physician judgment.",
    ],
  },
];

const READINESS_ITEMS: { label: string; status: "ready" | "next" | "scope" }[] = [
  { label: "Deterministic routing engine", status: "ready" },
  { label: "Safety policy enforcement", status: "ready" },
  { label: "Real AI extraction (backend)", status: "ready" },
  { label: "Real deterministic backend routing", status: "ready" },
  { label: "Structured extraction schema", status: "ready" },
  { label: "Audit trace generation", status: "ready" },
  { label: "Reviewer feedback workflow", status: "ready" },
  { label: "Database persistence (cases, feedback, summaries)", status: "ready" },
  { label: "Persisted reviewer feedback", status: "ready" },
  { label: "Persisted session summaries", status: "ready" },
  { label: "Session metrics dashboard (local-derived)", status: "ready" },
  { label: "Session and case audit export", status: "ready" },
  { label: "Demo guide and scenario shortcuts", status: "ready" },
  { label: "Controlled physician pilot", status: "next" },
  { label: "Aggregated metrics across sessions", status: "next" },
  { label: "Authentication / access control", status: "next" },
  { label: "Multi-site deployment", status: "scope" },
];

function statusColor(s: "ready" | "next" | "scope"): string {
  if (s === "ready") return "bg-routine";
  if (s === "next") return "bg-urgent";
  return "bg-muted/30";
}

function statusLabel(s: "ready" | "next" | "scope"): string {
  if (s === "ready") return "Ready";
  if (s === "next") return "Next stage";
  return "Out of scope";
}

export function PilotSummary() {
  return (
    <section className="mx-auto max-w-[1360px] px-6 py-10 lg:py-14">
      <SectionLabel>Pilot Summary</SectionLabel>
      <h2 className="mt-3 font-sans text-heading-lg font-semibold leading-tight tracking-tighter text-ink">
        Governed cardiovascular triage infrastructure for physician review
      </h2>
      <p className="mt-3 max-w-[640px] text-body leading-relaxed text-ink-secondary">
        AI structures the signal. Soficca governs the route. Physicians make the final decision.
      </p>

      <div className="mt-4 flex items-center gap-2 rounded-lg border border-rule-light bg-surface px-3.5 py-2">
        <span className="h-1.5 w-1.5 rounded-full bg-routine" />
        <span className="font-mono text-label text-muted">
          Local-first pilot · Real AI extraction · Real deterministic routing · Database persistence available for saved cases, reviewer feedback, and session summaries
        </span>
      </div>

      {/* Section cards */}
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {SECTIONS.map((sec) => (
          <CardPanel key={sec.title}>
            <h3 className="mb-3 font-mono text-label font-medium uppercase tracking-label text-ink-secondary">
              {sec.title}
            </h3>
            <ul className="space-y-2">
              {sec.items.map((item) => (
                <li key={item} className="flex items-start gap-2 text-body-sm leading-relaxed text-ink-secondary">
                  <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-accent/40" />
                  {item}
                </li>
              ))}
            </ul>
          </CardPanel>
        ))}
      </div>

      {/* Current stage + next stage */}
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <CardPanel>
          <h3 className="mb-3 font-mono text-label font-medium uppercase tracking-label text-ink-secondary">
            Current stage
          </h3>
          <ul className="space-y-2">
            {[
              "Local-first pilot with real backend services.",
              "Real AI extraction via OpenAI backend.",
              "Real deterministic Soficca routing engine.",
              "Reviewer workflow with database persistence for saved cases.",
              "Session summaries can be persisted and loaded.",
              "Local queue and metrics reset on reload — persisted data remains in database.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-body-sm leading-relaxed text-ink-secondary">
                <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-routine" />
                {item}
              </li>
            ))}
          </ul>
        </CardPanel>
        <CardPanel>
          <h3 className="mb-3 font-mono text-label font-medium uppercase tracking-label text-ink-secondary">
            Next stage
          </h3>
          <ul className="space-y-2">
            {[
              "Controlled physician pilot with expanded reviewer pool.",
              "Aggregated metrics across sessions and reviewers.",
              "Authentication and access control.",
              "Session restoration on page reload.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-body-sm leading-relaxed text-ink-secondary">
                <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-urgent" />
                {item}
              </li>
            ))}
          </ul>
        </CardPanel>
      </div>

      {/* Readiness for next stage */}
      <div className="mt-10">
        <h3 className="font-mono text-label font-medium uppercase tracking-label text-ink-secondary">
          Component readiness
        </h3>
        <CardPanel className="mt-4">
          <div className="space-y-2">
            {READINESS_ITEMS.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between gap-4 border-b border-rule-light/40 pb-2.5 last:border-b-0 last:pb-0"
              >
                <div className="flex items-center gap-2.5">
                  <span className={`block h-2 w-2 shrink-0 rounded-full ${statusColor(item.status)}`} />
                  <span className="text-body-sm text-ink-secondary">{item.label}</span>
                </div>
                <span className="shrink-0 font-mono text-label uppercase tracking-wide text-muted">
                  {statusLabel(item.status)}
                </span>
              </div>
            ))}
          </div>
        </CardPanel>
      </div>

      {/* Disclaimer */}
      <div className="mt-10 border-t border-rule-light pt-4">
        <p className="max-w-[560px] text-meta leading-relaxed text-muted">
          Soficca does not diagnose, prescribe, or replace clinical judgment.
          This pilot structures symptoms and safety-routing signals for human clinical review.
        </p>
      </div>
    </section>
  );
}
