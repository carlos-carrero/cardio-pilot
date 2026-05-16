/**
 * Case export helpers (JSON / Markdown).
 *
 * ── Export language policy ──────────────────────────────────────
 * Visible UI labels in the application are localized through the i18n
 * system (EN / ES). The exports produced by this module are
 * INTENTIONALLY NOT localized:
 *
 *   - UI labels are localized via `useTranslation()` and `t()`.
 *   - Raw audit/export outputs preserve canonical backend contract
 *     values and English / institutional labels.
 *   - Canonical values such as `PATH_*`, `RULE_*`, status codes,
 *     policy_version, model_id, and all JSON keys must remain
 *     unchanged across languages so that downstream audit, log,
 *     analytics, and regulatory tooling can rely on stable
 *     identifiers.
 *   - Markdown exports remain single-language for now to avoid
 *     mixing localized display labels with audit artifacts that
 *     are consumed by reviewers, regulators, and machine pipelines.
 *
 * A localized clinician-facing PDF / report export can be added
 * later as a separate feature; it must not replace this canonical
 * export surface.
 */

import type { PilotCase } from "@/types";
import { getRouteLabel, getStatusLabel } from "./report-helpers";

export function caseToJson(pilotCase: PilotCase): string {
  return JSON.stringify(
    {
      case_id: pilotCase.case_id,
      created_at: pilotCase.created_at,
      free_text_input: pilotCase.free_text_input,
      extraction: pilotCase.extraction,
      engine_input: pilotCase.engine_input,
      engine_report: pilotCase.engine_report,
    },
    null,
    2
  );
}

export function caseToMarkdown(pilotCase: PilotCase): string {
  const r = pilotCase.engine_report;
  if (!r) return `# Case ${pilotCase.case_id}\n\nNo report available.`;

  const lines: string[] = [
    `# Soficca Cardio Pilot — Case Report`,
    ``,
    `**Case ID:** ${pilotCase.case_id}`,
    `**Created:** ${pilotCase.created_at}`,
    `**Status:** ${getStatusLabel(r.decision.status)}`,
    `**Route:** ${getRouteLabel(r.decision.path)}`,
    `**Urgency:** ${r.decision.urgency_level}`,
    ``,
    `## Clinical Summary`,
    ``,
    r.decision.clinical_summary,
    ``,
    `## Decision`,
    ``,
    `- **Type:** ${r.decision.decision_type}`,
    `- **Reasons:** ${r.decision.reasons.length > 0 ? r.decision.reasons.join("; ") : "None stated"}`,
    `- **Required actions:** ${r.decision.required_actions.length > 0 ? r.decision.required_actions.join("; ") : "None"}`,
    ``,
    `## Safety`,
    ``,
    `- **Status:** ${r.safety.status}`,
    `- **Action:** ${r.safety.action}`,
    `- **Red flags:** ${r.safety.has_red_flags ? r.safety.triggers.join(", ") : "None"}`,
    `- **Override applied:** ${r.safety.override_applied ? "Yes" : "No"}`,
    ``,
    `## Versions`,
    ``,
    `- Engine: ${r.versions.engine}`,
    `- Ruleset: ${r.versions.ruleset}`,
    `- Safety policy: ${r.versions.safety_policy}`,
    `- Contract: ${r.versions.contract}`,
    ``,
    `## Trace`,
    ``,
    `- **Activated rules:** ${r.trace.activated_rules.join(", ") || "None"}`,
    `- **Preliminary route:** ${r.trace.preliminary_route ?? "None"}`,
    `- **Final route:** ${r.trace.final_route ?? "None"}`,
    `- **Override reason:** ${r.trace.override_reason ?? "None"}`,
    `- **Conflicts:** ${r.trace.conflicts_detected.join(", ") || "None"}`,
    ``,
    `---`,
    ``,
    `*Soficca does not diagnose, prescribe, or replace clinical judgment.*`,
    `*This report structures symptoms and safety-routing signals for human clinical review.*`,
  ];

  return lines.join("\n");
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}
