import type { DecisionStatus, CardioReport, HumanCorrectionStatus } from "@/types";
import type { TranslationKey } from "@/i18n/en";

export type TFunc = (key: TranslationKey) => string;

export type UrgencyLevel = "emergency" | "urgent" | "routine" | "info" | "deferred" | "unknown";

export function getUrgencyLevel(report: CardioReport): UrgencyLevel {
  const level = report.decision.urgency_level;
  if (level === "EMERGENCY") return "emergency";
  if (level === "URGENT") return "urgent";
  if (level === "ROUTINE") return "routine";
  if (report.decision.status === "NEEDS_MORE_INFO") return "info";
  if (report.decision.status === "CONFLICT") return "deferred";
  return "unknown";
}

export function getRouteLabel(path: string | null, t?: TFunc): string {
  if (!path) return t ? t("routeLabel.none") : "No route determined";
  if (t) {
    const key = `routeLabel.${path}` as TranslationKey;
    const translated = t(key);
    if (translated !== key) return translated;
  }
  const labels: Record<string, string> = {
    PATH_EMERGENCY_NOW: "Emergency — Immediate escalation",
    PATH_URGENT_SAME_DAY: "Urgent — Same-day review",
    PATH_ROUTINE: "Routine — Scheduled follow-up",
    PATH_MORE_QUESTIONS: "Pending — More information needed",
    PATH_SELF_CARE: "Self-care — Home monitoring",
    PATH_ESCALATE_HUMAN: "Escalate — Human review required",
  };
  return labels[path] ?? path;
}

export function getStatusLabel(status: DecisionStatus, t?: TFunc): string {
  if (t) {
    const key = `statusLabel.${status}` as TranslationKey;
    const translated = t(key);
    if (translated !== key) return translated;
  }
  const labels: Record<DecisionStatus, string> = {
    DECIDED: "Decided",
    NEEDS_MORE_INFO: "Needs more information",
    CONFLICT: "Conflict detected",
    ESCALATED: "Escalated",
  };
  return labels[status] ?? status;
}

export function getDecisionTypeLabel(type: string): string {
  return type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function getUrgencyColor(level: UrgencyLevel): string {
  const colors: Record<UrgencyLevel, string> = {
    emergency: "bg-emergency text-white",
    urgent: "bg-urgent text-white",
    routine: "bg-routine text-white",
    info: "bg-info text-white",
    deferred: "bg-deferred text-white",
    unknown: "bg-muted text-white",
  };
  return colors[level];
}

export function getUrgencyBorderColor(level: UrgencyLevel): string {
  const colors: Record<UrgencyLevel, string> = {
    emergency: "border-l-emergency",
    urgent: "border-l-urgent",
    routine: "border-l-routine",
    info: "border-l-info",
    deferred: "border-l-deferred",
    unknown: "border-l-muted",
  };
  return colors[level];
}

export interface WhyNotItem {
  route: string;
  reason: string;
}

export function getWhyThisRoute(report: CardioReport, t?: TFunc): string {
  const u = getUrgencyLevel(report);
  const status = report.decision.status;
  if (t) {
    if (status === "NEEDS_MORE_INFO") return t("whyRoute.needs_info");
    if (status === "CONFLICT") return t("whyRoute.conflict");
    if (u === "emergency") return t("whyRoute.emergency");
    if (u === "urgent") return t("whyRoute.urgent");
    if (u === "routine") return t("whyRoute.routine");
    return t("whyRoute.default");
  }
  if (status === "NEEDS_MORE_INFO")
    return "Critical clinical inputs were missing, so deterministic routing was withheld.";
  if (status === "CONFLICT")
    return "Contradictory inputs blocked deterministic classification.";
  if (u === "emergency")
    return "Emergency red-flag criteria were triggered under the active safety policy.";
  if (u === "urgent")
    return "Urgent escalation thresholds were met after deterministic rule evaluation.";
  if (u === "routine")
    return "No emergency or urgent cluster was detected after deterministic rule evaluation.";
  return "Route determined by deterministic Soficca policy evaluation.";
}

export function getWhyNotSelected(report: CardioReport, t?: TFunc): WhyNotItem[] {
  const u = getUrgencyLevel(report);
  const status = report.decision.status;

  if (t) {
    if (status === "NEEDS_MORE_INFO") return [
      { route: t("whyNot.needs_info.route1"), reason: t("whyNot.needs_info.reason1") },
      { route: t("whyNot.needs_info.route2"), reason: t("whyNot.needs_info.reason2") },
    ];
    if (status === "CONFLICT") return [
      { route: t("whyNot.conflict.route1"), reason: t("whyNot.conflict.reason1") },
    ];
    if (u === "emergency") return [
      { route: t("whyNot.emergency.route1"), reason: t("whyNot.emergency.reason1") },
      { route: t("whyNot.emergency.route2"), reason: t("whyNot.emergency.reason2") },
    ];
    if (u === "urgent") return [
      { route: t("whyNot.urgent.route1"), reason: t("whyNot.urgent.reason1") },
      { route: t("whyNot.urgent.route2"), reason: t("whyNot.urgent.reason2") },
    ];
    if (u === "routine") return [
      { route: t("whyNot.routine.route1"), reason: t("whyNot.routine.reason1") },
      { route: t("whyNot.routine.route2"), reason: t("whyNot.routine.reason2") },
    ];
    return [];
  }
  if (status === "NEEDS_MORE_INFO") return [
    { route: "Routine / Urgent", reason: "A safe route cannot be selected until required fields are complete." },
    { route: "Emergency", reason: "Emergency override was not triggered by safety policy." },
  ];
  if (status === "CONFLICT") return [
    { route: "Emergency / Routine", reason: "The case requires reconciliation before safe classification." },
  ];
  if (u === "emergency") return [
    { route: "Routine", reason: "Routine review is not selected when emergency red flags are present." },
    { route: "Needs more info", reason: "Missing information does not override emergency safety escalation when red-flag criteria are active." },
  ];
  if (u === "urgent") return [
    { route: "Emergency", reason: "No active emergency safety override was applied." },
    { route: "Routine", reason: "Urgent escalation thresholds were met, precluding routine classification." },
  ];
  if (u === "routine") return [
    { route: "Urgent", reason: "Urgent escalation thresholds were not met." },
    { route: "Emergency", reason: "No active emergency safety trigger was present." },
  ];
  return [];
}

/**
 * Filter backend-supplied reasons to remove lines that contradict the final route.
 * This is a frontend rendering safeguard — the backend engine is not modified.
 */
const CONTRADICTORY_PATTERNS: Record<UrgencyLevel, RegExp[]> = {
  emergency: [
    /no emergency/i,
    /no urgent/i,
    /no emergency or urgent/i,
    /escalation thresholds were not met/i,
  ],
  urgent: [
    /no urgent/i,
    /urgent.*not met/i,
  ],
  routine: [
    /emergency.*triggered/i,
    /urgent.*met/i,
  ],
  info: [],
  deferred: [],
  unknown: [],
};

export function filterReasons(report: CardioReport): string[] {
  const u = getUrgencyLevel(report);
  const patterns = CONTRADICTORY_PATTERNS[u];
  if (!patterns || patterns.length === 0) return report.decision.reasons;
  return report.decision.reasons.filter(
    (r) => !patterns.some((p) => p.test(r))
  );
}

const INTERNAL_EVIDENCE_KEYS = new Set([
  "prior_mi_or_known_cad",
  "current_meds_summary_or_none",
  "radiation_arm_or_jaw",
  "current_meds_summary",
]);

const EVIDENCE_LABELS: Record<string, string> = {
  age: "Age",
  chest_pain_present: "Chest pain present",
  pain_duration_minutes: "Pain duration",
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
  current_meds_none: "Current cardiac meds",
};

const EVIDENCE_LABEL_KEYS: Record<string, TranslationKey> = {
  age: "evidence.age",
  chest_pain_present: "evidence.chest_pain_present",
  pain_duration_minutes: "evidence.pain_duration_minutes",
  pain_character: "evidence.pain_character",
  pain_severity: "evidence.pain_severity",
  pain_radiation: "evidence.pain_radiation",
  exertional_chest_pain: "evidence.exertional_chest_pain",
  diaphoresis: "evidence.diaphoresis",
  dyspnea: "evidence.dyspnea",
  syncope: "evidence.syncope",
  systolic_bp: "evidence.systolic_bp",
  heart_rate: "evidence.heart_rate",
  prior_mi: "evidence.prior_mi",
  known_cad: "evidence.known_cad",
  cv_risk_factors_count: "evidence.cv_risk_factors_count",
  current_meds_none: "evidence.current_meds_none",
};

function getEvidenceLabel(key: string, t?: TFunc): string {
  if (t && EVIDENCE_LABEL_KEYS[key]) return t(EVIDENCE_LABEL_KEYS[key]);
  return EVIDENCE_LABELS[key] ?? key.replace(/_/g, " ");
}

function formatEvidenceValue(key: string, value: unknown, t?: TFunc): string {
  if (value === true) {
    if (key === "current_meds_none") return t ? t("evidence.value_none_reported") : "None reported";
    return t ? t("evidence.value_yes") : "Yes";
  }
  if (value === false) {
    if (key === "current_meds_none") return t ? t("evidence.value_taking_meds") : "Taking medications";
    return t ? t("evidence.value_no") : "No";
  }
  if (key === "pain_duration_minutes" && typeof value === "number") return `${value} min`;
  if (key === "pain_radiation" && typeof value === "string") return value.replace(/_/g, " ");
  return String(value);
}

export function getDecisiveInputs(report: CardioReport, t?: TFunc): string[] {
  const inputs: string[] = [];
  const ev = report.trace.evidence;
  for (const [key, val] of Object.entries(ev)) {
    if (INTERNAL_EVIDENCE_KEYS.has(key)) continue;
    if (val.value === null || val.value === undefined) continue;
    const label = getEvidenceLabel(key, t);
    inputs.push(`${label}: ${formatEvidenceValue(key, val.value, t)}`);
  }
  return inputs;
}

export function getDecisiveInputsWithEdits(
  report: CardioReport,
  correction?: HumanCorrectionStatus | null,
  t?: TFunc,
): { text: string; edited: boolean }[] {
  const editedFields = new Set<string>(
    correction?.diffs.map((d) => d.field as string) ?? []
  );
  const inputs: { text: string; edited: boolean }[] = [];
  const ev = report.trace.evidence;
  for (const [key, val] of Object.entries(ev)) {
    if (INTERNAL_EVIDENCE_KEYS.has(key)) continue;
    if (val.value === null || val.value === undefined) continue;
    const label = getEvidenceLabel(key, t);
    const isEdited = editedFields.has(key);
    inputs.push({
      text: `${label}: ${formatEvidenceValue(key, val.value, t)}`,
      edited: isEdited,
    });
  }
  return inputs;
}

export function getUnconfirmedInputs(report: CardioReport, t?: TFunc): string[] {
  const inputs: string[] = [];
  const ev = report.trace.evidence;
  for (const [key, val] of Object.entries(ev)) {
    if (INTERNAL_EVIDENCE_KEYS.has(key)) continue;
    if (val.value !== null && val.value !== undefined) continue;
    const label = getEvidenceLabel(key, t);
    inputs.push(label);
  }
  return inputs;
}

export function generateCaseId(): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 6);
  return `CP-${ts}-${rand}`.toUpperCase();
}
