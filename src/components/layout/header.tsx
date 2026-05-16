"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { useTranslation, type Language } from "@/i18n";
import type { TranslationKey } from "@/i18n/en";

export type PilotSurface =
  | "flow"
  | "reviewer"
  | "metrics"
  | "cost_impact"
  | "pilot_summary"
  | "qa"
  | "demo_guide"
  | "sample_report";

const NAV_KEYS: { key: PilotSurface; tKey: TranslationKey }[] = [
  { key: "flow", tKey: "header.nav.flow" },
  { key: "reviewer", tKey: "header.nav.reviewer" },
  { key: "metrics", tKey: "header.nav.metrics" },
  { key: "cost_impact", tKey: "header.nav.cost_impact" },
  { key: "pilot_summary", tKey: "header.nav.pilot_summary" },
  { key: "qa", tKey: "header.nav.qa" },
  { key: "demo_guide", tKey: "header.nav.demo_guide" },
  { key: "sample_report", tKey: "header.nav.sample_report" },
];

interface HeaderProps {
  activeSurface: PilotSurface;
  onSurfaceChange: (surface: PilotSurface) => void;
  onLogoClick: () => void;
  persistedSessionActive?: boolean;
}

function LanguageToggle({ lang, setLang }: { lang: Language; setLang: (l: Language) => void }) {
  return (
    <div className="inline-flex items-center rounded-badge border border-rule/60 bg-surface font-mono text-eyebrow uppercase tracking-wide">
      <button
        onClick={() => setLang("en")}
        className={cn(
          "rounded-badge px-2 py-[2px] transition-all",
          lang === "en"
            ? "bg-ink text-warm-white font-medium"
            : "text-muted hover:text-ink-secondary"
        )}
      >
        EN
      </button>
      <button
        onClick={() => setLang("es")}
        className={cn(
          "rounded-badge px-2 py-[2px] transition-all",
          lang === "es"
            ? "bg-ink text-warm-white font-medium"
            : "text-muted hover:text-ink-secondary"
        )}
      >
        ES
      </button>
    </div>
  );
}

export function Header({
  activeSurface,
  onSurfaceChange,
  onLogoClick,
  persistedSessionActive = false,
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { lang, setLang, t } = useTranslation();
  const sessionLabel = persistedSessionActive ? t("header.session.persisted") : t("header.session.local");

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
            {t("header.badge")}
          </span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 lg:flex">
          {NAV_KEYS.map((item) => (
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
              {t(item.tKey)}
            </button>
          ))}
          <span className="ml-3 h-3.5 w-px bg-rule/50" />
          <LanguageToggle lang={lang} setLang={setLang} />
          <span className="ml-3 flex items-center gap-1.5 font-mono text-eyebrow uppercase text-muted/60">
            <span className="block h-1 w-1 rounded-full bg-accent/50" />
            {sessionLabel}
          </span>
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-btn border border-rule text-muted transition-colors hover:text-ink lg:hidden"
          aria-label={t("header.mobile_toggle_label")}
        >
          <span className="text-body">{mobileOpen ? "✕" : "☰"}</span>
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="border-t border-rule/60 bg-warm-white px-6 py-4 lg:hidden">
          <div className="flex flex-col gap-0.5">
            {NAV_KEYS.map((item) => (
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
                {t(item.tKey)}
              </button>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-rule/40 pt-3">
            <span className="flex items-center gap-1.5 font-mono text-eyebrow uppercase text-muted/60">
              <span className="block h-1 w-1 rounded-full bg-accent/50" />
              {sessionLabel}
            </span>
            <LanguageToggle lang={lang} setLang={setLang} />
          </div>
        </div>
      )}
    </header>
  );
}
