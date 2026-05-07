"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

export type PilotSurface =
  | "flow"
  | "reviewer"
  | "metrics"
  | "cost_impact"
  | "pilot_summary"
  | "qa"
  | "demo_guide"
  | "sample_report";

const NAV_ITEMS: { key: PilotSurface; label: string }[] = [
  { key: "flow", label: "Pilot Flow" },
  { key: "reviewer", label: "Reviewer" },
  { key: "metrics", label: "Metrics" },
  { key: "cost_impact", label: "Cost Impact" },
  { key: "pilot_summary", label: "Pilot Summary" },
  { key: "qa", label: "QA" },
  { key: "demo_guide", label: "Demo Guide" },
  { key: "sample_report", label: "Sample" },
];

interface HeaderProps {
  activeSurface: PilotSurface;
  onSurfaceChange: (surface: PilotSurface) => void;
  onLogoClick: () => void;
}

export function Header({
  activeSurface,
  onSurfaceChange,
  onLogoClick,
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-rule/60 bg-warm-white/90 backdrop-blur-lg">
      <div className="mx-auto flex h-header max-w-[1360px] items-center justify-between px-6">
        {/* Logo */}
        <button
          onClick={onLogoClick}
          className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
        >
          <span className="font-display text-body-lg font-bold tracking-tight text-ink">
            Soficca
          </span>
          <span className="hidden rounded-badge border border-rule/60 bg-surface-raised px-2 py-[2px] font-mono text-eyebrow font-medium uppercase text-muted sm:inline-flex">
            Cardio Pilot
          </span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 lg:flex">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => onSurfaceChange(item.key)}
              className={cn(
                "rounded-btn px-3 py-1.5 font-mono text-label uppercase transition-all",
                activeSurface === item.key
                  ? "bg-ink text-warm-white font-medium"
                  : "text-muted hover:text-ink-secondary"
              )}
            >
              {item.label}
            </button>
          ))}
          <span className="ml-3 h-3.5 w-px bg-rule/50" />
          <span className="ml-3 flex items-center gap-1.5 font-mono text-eyebrow uppercase text-muted/60">
            <span className="block h-1 w-1 rounded-full bg-accent/50" />
            Local session
          </span>
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-btn border border-rule text-muted transition-colors hover:text-ink lg:hidden"
          aria-label="Toggle navigation"
        >
          <span className="text-body">{mobileOpen ? "✕" : "☰"}</span>
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="border-t border-rule/60 bg-warm-white px-6 py-4 lg:hidden">
          <div className="flex flex-col gap-0.5">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  onSurfaceChange(item.key);
                  setMobileOpen(false);
                }}
                className={cn(
                  "rounded-btn px-3 py-2.5 text-left font-mono text-label uppercase transition-all",
                  activeSurface === item.key
                    ? "bg-ink text-warm-white font-medium"
                    : "text-muted hover:text-ink-secondary"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="mt-3 border-t border-rule/40 pt-3">
            <span className="flex items-center gap-1.5 font-mono text-eyebrow uppercase text-muted/60">
              <span className="block h-1 w-1 rounded-full bg-accent/50" />
              Local session
            </span>
          </div>
        </div>
      )}
    </header>
  );
}
