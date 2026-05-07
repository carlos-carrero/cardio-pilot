"use client";

import { useState } from "react";
import { SectionLabel } from "@/components/ui/section-label";
import { CardPanel } from "@/components/ui/card-panel";
import { cn } from "@/lib/cn";

interface PhysicianFeedbackFormProps {
  caseId: string;
  onBack: () => void;
}

type RouteAppropriate = "yes" | "partially" | "no" | null;
type MissingSurfaced = "yes" | "partially" | "no" | "na" | null;
type FlagIssue = "no" | "missing" | "incorrect" | "unsure" | null;
type TimeSaved = "0" | "1-2" | "3-5" | "5+" | null;
type UsefulBefore = "yes" | "maybe" | "no" | null;

function OptionButton({
  selected,
  label,
  onClick,
}: {
  selected: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-btn border px-3.5 py-2 font-sans text-body-sm transition-all",
        selected
          ? "border-accent/40 bg-accent-soft text-accent font-medium shadow-sm"
          : "border-rule-light bg-warm-white text-ink-secondary hover:border-accent/20 hover:bg-surface"
      )}
    >
      {label}
    </button>
  );
}

function ScaleButton({
  selected,
  value,
  onClick,
}: {
  selected: boolean;
  value: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-btn border font-mono text-body-sm transition-all",
        selected
          ? "border-accent/40 bg-accent-soft text-accent font-semibold shadow-sm"
          : "border-rule-light bg-warm-white text-ink-secondary hover:border-accent/20"
      )}
    >
      {value}
    </button>
  );
}

export function PhysicianFeedbackForm({
  caseId,
  onBack,
}: PhysicianFeedbackFormProps) {
  const [routeAppropriate, setRouteAppropriate] = useState<RouteAppropriate>(null);
  const [usefulness, setUsefulness] = useState<number | null>(null);
  const [missingSurfaced, setMissingSurfaced] = useState<MissingSurfaced>(null);
  const [flagIssue, setFlagIssue] = useState<FlagIssue>(null);
  const [timeSaved, setTimeSaved] = useState<TimeSaved>(null);
  const [usefulBefore, setUsefulBefore] = useState<UsefulBefore>(null);
  const [comments, setComments] = useState("");
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 4000);
  }

  function handleClear() {
    setRouteAppropriate(null);
    setUsefulness(null);
    setMissingSurfaced(null);
    setFlagIssue(null);
    setTimeSaved(null);
    setUsefulBefore(null);
    setComments("");
    setSaved(false);
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-10 lg:py-14">
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center font-mono text-caption uppercase tracking-wide text-muted transition-colors hover:text-ink"
      >
        ← Back to reviewer workspace
      </button>

      <SectionLabel>Physician Feedback</SectionLabel>
      <h2 className="mt-3 font-sans text-heading-lg font-semibold leading-tight tracking-tighter text-ink">
        Structured review feedback
      </h2>
      <p className="mt-2 font-mono text-caption text-muted">
        Case: {caseId}
      </p>

      {/* Mock note */}
      <div className="mt-4 flex items-center gap-2 rounded-lg border border-rule-light bg-surface px-3.5 py-2">
        <span className="h-1.5 w-1.5 rounded-full bg-muted/50" />
        <span className="font-mono text-label text-muted">
          Frontend mock — Feedback persistence will be added in a later stage.
        </span>
      </div>

      <div className="mt-8 space-y-6">
        {/* Q1: Route appropriate */}
        <CardPanel>
          <h3 className="mb-3 font-mono text-label font-medium uppercase tracking-label text-accent">
            1. Was the route appropriate?
          </h3>
          <div className="flex flex-wrap gap-2">
            <OptionButton selected={routeAppropriate === "yes"} label="Yes" onClick={() => setRouteAppropriate("yes")} />
            <OptionButton selected={routeAppropriate === "partially"} label="Partially" onClick={() => setRouteAppropriate("partially")} />
            <OptionButton selected={routeAppropriate === "no"} label="No" onClick={() => setRouteAppropriate("no")} />
          </div>
        </CardPanel>

        {/* Q2: Usefulness */}
        <CardPanel>
          <h3 className="mb-3 font-mono text-label font-medium uppercase tracking-label text-accent">
            2. Was the report clinically useful?
          </h3>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((v) => (
              <ScaleButton key={v} selected={usefulness === v} value={v} onClick={() => setUsefulness(v)} />
            ))}
            <span className="ml-2 font-mono text-label text-muted">
              {usefulness ? `${usefulness} / 5` : "Select"}
            </span>
          </div>
        </CardPanel>

        {/* Q3: Missing info surfaced */}
        <CardPanel>
          <h3 className="mb-3 font-mono text-label font-medium uppercase tracking-label text-accent">
            3. Did Soficca surface important missing information?
          </h3>
          <div className="flex flex-wrap gap-2">
            <OptionButton selected={missingSurfaced === "yes"} label="Yes" onClick={() => setMissingSurfaced("yes")} />
            <OptionButton selected={missingSurfaced === "partially"} label="Partially" onClick={() => setMissingSurfaced("partially")} />
            <OptionButton selected={missingSurfaced === "no"} label="No" onClick={() => setMissingSurfaced("no")} />
            <OptionButton selected={missingSurfaced === "na"} label="Not applicable" onClick={() => setMissingSurfaced("na")} />
          </div>
        </CardPanel>

        {/* Q4: Safety flags */}
        <CardPanel>
          <h3 className="mb-3 font-mono text-label font-medium uppercase tracking-label text-accent">
            4. Were any safety flags wrong or missing?
          </h3>
          <div className="flex flex-wrap gap-2">
            <OptionButton selected={flagIssue === "no"} label="No" onClick={() => setFlagIssue("no")} />
            <OptionButton selected={flagIssue === "missing"} label="Yes, missing flag" onClick={() => setFlagIssue("missing")} />
            <OptionButton selected={flagIssue === "incorrect"} label="Yes, incorrect flag" onClick={() => setFlagIssue("incorrect")} />
            <OptionButton selected={flagIssue === "unsure"} label="Unsure" onClick={() => setFlagIssue("unsure")} />
          </div>
        </CardPanel>

        {/* Q5: Time saved */}
        <CardPanel>
          <h3 className="mb-3 font-mono text-label font-medium uppercase tracking-label text-accent">
            5. Estimated review-time saved
          </h3>
          <div className="flex flex-wrap gap-2">
            <OptionButton selected={timeSaved === "0"} label="0 minutes" onClick={() => setTimeSaved("0")} />
            <OptionButton selected={timeSaved === "1-2"} label="1–2 minutes" onClick={() => setTimeSaved("1-2")} />
            <OptionButton selected={timeSaved === "3-5"} label="3–5 minutes" onClick={() => setTimeSaved("3-5")} />
            <OptionButton selected={timeSaved === "5+"} label="5+ minutes" onClick={() => setTimeSaved("5+")} />
          </div>
        </CardPanel>

        {/* Q6: Useful before consultation */}
        <CardPanel>
          <h3 className="mb-3 font-mono text-label font-medium uppercase tracking-label text-accent">
            6. Would this be useful before consultation?
          </h3>
          <div className="flex flex-wrap gap-2">
            <OptionButton selected={usefulBefore === "yes"} label="Yes" onClick={() => setUsefulBefore("yes")} />
            <OptionButton selected={usefulBefore === "maybe"} label="Maybe" onClick={() => setUsefulBefore("maybe")} />
            <OptionButton selected={usefulBefore === "no"} label="No" onClick={() => setUsefulBefore("no")} />
          </div>
        </CardPanel>

        {/* Q7: Comments */}
        <CardPanel>
          <h3 className="mb-3 font-mono text-label font-medium uppercase tracking-label text-accent">
            7. Reviewer comments
          </h3>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Add clinical notes, disagreement rationale, or missing context."
            className="min-h-[120px] w-full resize-y rounded-lg border border-rule bg-white p-4 font-sans text-body leading-relaxed text-ink placeholder:text-muted/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/20"
          />
        </CardPanel>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <button
          onClick={handleSave}
          className="inline-flex h-11 items-center gap-2 rounded-btn border border-accent-hover bg-accent px-6 font-mono text-label font-medium uppercase text-white shadow-btn transition-all hover:-translate-y-px hover:bg-accent-hover hover:shadow-card-hover"
        >
          Save mock feedback
        </button>
        <button
          onClick={handleClear}
          className="inline-flex h-11 items-center rounded-btn border border-rule bg-warm-white px-5 font-mono text-label uppercase text-ink-secondary transition-all hover:border-accent/40 hover:text-ink"
        >
          Clear form
        </button>
      </div>

      {/* Confirmation */}
      {saved && (
        <div className="mt-4 rounded-lg border border-accent/20 bg-accent-soft/50 px-4 py-3">
          <p className="text-body-sm font-medium text-accent">
            Feedback captured for local session.
          </p>
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-10 border-t border-rule-light pt-4">
        <p className="max-w-[520px] text-meta leading-relaxed text-muted">
          Physicians remain the final clinical decision-makers. Soficca does not
          diagnose, prescribe, or replace clinical judgment.
        </p>
      </div>
    </section>
  );
}
