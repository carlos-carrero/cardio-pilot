"use client";

import { Eyebrow } from "@/components/ui/eyebrow";

const PIPELINE_STEPS = [
  {
    step: "01",
    title: "Free-text symptoms",
    description: "Physician enters a clinical narrative in natural language.",
  },
  {
    step: "02",
    title: "AI signal structuring",
    description: "AI extracts clinical signals. It does not determine the route.",
  },
  {
    step: "03",
    title: "Soficca deterministic route",
    description: "Governed safety policies and versioned rules determine the routing path.",
  },
  {
    step: "04",
    title: "Physician review",
    description: "A physician reviews and confirms every routed case. Final authority is always human.",
  },
];

const EVIDENCE_LOOP = [
  { label: "Structured signals", icon: "◇" },
  { label: "Versioned route", icon: "⬡" },
  { label: "Human review", icon: "○" },
  { label: "Measured impact", icon: "△" },
];

interface WelcomeScreenProps {
  onStartCase: () => void;
  onViewSampleReport: () => void;
}

export function WelcomeScreen({
  onStartCase,
  onViewSampleReport,
}: WelcomeScreenProps) {
  return (
    <section className="px-6 py-14 md:px-12 lg:py-20">
      <div className="mx-auto max-w-[1360px]">
        {/* Hero grid */}
        <div className="grid gap-12 lg:grid-cols-[1fr_420px] lg:items-start lg:gap-20">
          {/* Left column — copy */}
          <div>
            <Eyebrow>Cardiovascular Triage Infrastructure</Eyebrow>

            <h1 className="mt-6 font-sans text-display-xl font-semibold tracking-tightest text-ink sm:text-[clamp(2.8rem,5vw,3.5rem)]">
              Soficca{" "}
              <span className="text-accent">Cardio Pilot</span>
            </h1>

            <p className="mt-5 max-w-[480px] text-body-lg leading-relaxed text-ink-secondary">
              Physician-reviewed cardiovascular triage infrastructure.
            </p>

            <p className="mt-8 max-w-[540px] text-body leading-[1.78] text-muted">
              <span className="font-medium text-ink">AI structures the signal.</span>{" "}
              <span className="font-medium text-accent">Soficca governs the route.</span>{" "}
              <span className="font-medium text-ink">Physicians make the final decision.</span>
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <button
                onClick={onStartCase}
                className="inline-flex h-11 items-center gap-2 rounded-btn bg-ink px-7 font-mono text-label font-medium uppercase text-warm-white shadow-btn transition-all hover:-translate-y-px hover:shadow-card-hover"
              >
                Start Pilot Case →
              </button>

              <button
                onClick={onViewSampleReport}
                className="inline-flex h-11 items-center gap-2 rounded-btn border border-rule bg-warm-white px-6 font-mono text-label uppercase text-muted transition-all hover:border-ink/30 hover:text-ink"
              >
                View sample report
              </button>
            </div>

            {/* Disclaimer */}
            <div className="mt-16 border-t border-rule-light pt-5">
              <p className="max-w-[480px] text-caption leading-relaxed text-muted">
                Soficca does not diagnose, prescribe, or replace clinical judgment.
                This pilot structures symptoms and safety-routing signals for human
                clinical review.
              </p>
            </div>
          </div>

          {/* Right column — Workflow pipeline cards */}
          <div className="relative pt-2">
            <div className="space-y-2.5">
              {PIPELINE_STEPS.map((step, i) => (
                <div key={step.step} className="relative flex items-start gap-4">
                  {/* Vertical connector line */}
                  {i < PIPELINE_STEPS.length - 1 && (
                    <div className="absolute left-[17px] top-[48px] h-[calc(100%-20px)] w-px bg-rule/60" />
                  )}
                  {/* Step number circle */}
                  <div className="relative z-10 flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-full border border-rule/60 bg-warm-white font-mono text-eyebrow font-semibold text-muted">
                    {step.step}
                  </div>
                  {/* Card */}
                  <div className="flex-1 rounded-card border border-rule-light/80 bg-warm-white p-5 shadow-card transition-shadow hover:shadow-card-hover">
                    <h3 className="font-sans text-body font-semibold text-ink">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-caption leading-relaxed text-muted">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Evidence loop — strategic authority dark section */}
        <div className="mt-16 rounded-card bg-authority p-7 shadow-authority ring-1 ring-white/[0.04] sm:p-8">
          <p className="mb-5 font-mono text-eyebrow font-medium uppercase tracking-eyebrow text-authority-text/50">
            Pilot evidence loop
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {EVIDENCE_LOOP.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 rounded-btn border border-white/[0.06] bg-authority-surface px-4 py-3.5"
              >
                <span className="text-base text-authority-accent/70">{item.icon}</span>
                <span className="font-sans text-body-sm font-medium text-authority-text">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom meta tags */}
        <div className="mt-8 flex flex-wrap gap-8 font-mono text-eyebrow uppercase tracking-eyebrow text-muted/40">
          <span>Deterministic</span>
          <span>Auditable</span>
          <span>Versionable</span>
          <span>Safety-first</span>
        </div>
      </div>
    </section>
  );
}
