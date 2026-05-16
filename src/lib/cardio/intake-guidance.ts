// ── Intake guidance helpers (frontend-only, lightweight) ────────────────

import type { TranslationKey } from "@/i18n/en";

type TFunc = (key: TranslationKey) => string;

export type SignalGroupId =
  | "patient"
  | "complaint"
  | "red_flags"
  | "vitals"
  | "cv_history"
  | "meds";

export interface SignalGroup {
  id: SignalGroupId;
  label: string;
  signals: IntakeSignalStatus[];
}

export interface IntakeSignal {
  key: string;
  label: string;
  group: SignalGroupId;
  patterns: RegExp[];
  considerPriority: number;
}

export type SignalDetectionStatus = "detected" | "unclear";

export interface IntakeSignalStatus {
  key: string;
  label: string;
  group: SignalGroupId;
  status: SignalDetectionStatus;
}

export type IntakeCompletenessLevel = "strong" | "moderate" | "limited";

export interface IntakeCompleteness {
  level: IntakeCompletenessLevel;
  detectedCount: number;
  unclearCount: number;
  message: string;
}

export interface IntakeQuickFields {
  age: string;
  systolic_bp: string;
  heart_rate: string;
  known_cad: "yes" | "no" | "";
  prior_mi: "yes" | "no" | "";
  current_meds: string;
}

export const EMPTY_QUICK_FIELDS: IntakeQuickFields = {
  age: "",
  systolic_bp: "",
  heart_rate: "",
  known_cad: "",
  prior_mi: "",
  current_meds: "",
};

// ── Signal definitions ──────────────────────────────────────────

const INTAKE_SIGNALS: IntakeSignal[] = [
  { key: "age", label: "Age", group: "patient", considerPriority: 3,
    patterns: [/\d{1,3}[\s-]*(year|yr|y\/o|yo|años)/i, /age\s*:?\s*\d/i, /\b(elderly|older|young)\b/i] },
  { key: "chest_pain", label: "Chest pain presence", group: "complaint", considerPriority: 5,
    patterns: [/chest\s*pain/i, /dolor\s*(de\s*)?pecho/i, /precordial/i, /angina/i, /chest\s*discomfort/i] },
  { key: "duration", label: "Pain duration", group: "complaint", considerPriority: 4,
    patterns: [/\d+\s*(min|minute|hour|hr|h)\b/i, /lasting\s*\d/i, /for\s*\d+\s*min/i, /duration/i] },
  { key: "character", label: "Pain character", group: "complaint", considerPriority: 3,
    patterns: [/pressure/i, /crushing/i, /sharp/i, /stabbing/i, /squeezing/i, /burning/i, /tightness/i, /dull/i, /aching/i] },
  { key: "severity", label: "Pain severity", group: "complaint", considerPriority: 3,
    patterns: [/severe/i, /mild/i, /moderate/i, /\d+\/10/i, /intensity/i, /high\s*severity/i, /low[\s-]*grade/i] },
  { key: "radiation", label: "Pain radiation", group: "complaint", considerPriority: 4,
    patterns: [/radiat/i, /jaw/i, /left\s*arm/i, /arm/i, /back/i, /shoulder/i, /neck/i, /no\s*radiation/i] },
  { key: "exertional", label: "Exertional component", group: "complaint", considerPriority: 2,
    patterns: [/exertion/i, /exertional/i, /on\s*exertion/i, /at\s*rest/i, /with\s*activity/i, /non[\s-]*exertional/i] },
  { key: "dyspnea", label: "Dyspnea", group: "red_flags", considerPriority: 4,
    patterns: [/dyspnea/i, /shortness\s*(of\s*)?breath/i, /breath/i, /SOB/i, /disnea/i, /dificultad.*respirar/i] },
  { key: "syncope", label: "Syncope", group: "red_flags", considerPriority: 5,
    patterns: [/syncop/i, /faint/i, /passed\s*out/i, /loss\s*of\s*consciousness/i, /LOC/i, /desmay/i] },
  { key: "diaphoresis", label: "Diaphoresis", group: "red_flags", considerPriority: 5,
    patterns: [/diaphores/i, /sweat/i, /diaforesis/i, /sudoración/i, /profuse/i] },
  { key: "bp", label: "Blood pressure", group: "vitals", considerPriority: 4,
    patterns: [/\bBP\b/i, /blood\s*pressure/i, /\bTA\b/, /\d{2,3}\s*\/\s*\d{2,3}/i, /systolic/i, /diastolic/i, /presión/i] },
  { key: "hr", label: "Heart rate", group: "vitals", considerPriority: 3,
    patterns: [/\bHR\b/i, /heart\s*rate/i, /\bFC\b/, /\bbpm\b/i, /pulse/i, /frecuencia/i] },
  { key: "cad_mi", label: "Known CAD / prior MI", group: "cv_history", considerPriority: 4,
    patterns: [/\bCAD\b/i, /coronary\s*artery/i, /prior\s*MI/i, /myocardial\s*infarction/i, /heart\s*attack/i, /infarto/i] },
  { key: "cv_risk", label: "Cardiovascular risk factors", group: "cv_history", considerPriority: 2,
    patterns: [/risk\s*factor/i, /diabetes/i, /hypertens/i, /smoking/i, /hyperlipid/i, /obesity/i, /family\s*history/i, /\bcv\b.*factor/i] },
  { key: "meds", label: "Current medications", group: "meds", considerPriority: 3,
    patterns: [/medic/i, /\bmeds\b/i, /aspirin/i, /statin/i, /beta[\s-]*blocker/i, /nitroglycerin/i, /not\s*on/i, /no\s*cardiac/i] },
];

const SIGNAL_GROUP_ORDER: { id: SignalGroupId; label: string }[] = [
  { id: "patient", label: "Patient / context" },
  { id: "complaint", label: "Presenting complaint" },
  { id: "red_flags", label: "Associated symptoms / red flags" },
  { id: "vitals", label: "Vitals" },
  { id: "cv_history", label: "Cardiovascular history" },
  { id: "meds", label: "Medication / context" },
];

const SIGNAL_LABEL_KEYS: Record<string, TranslationKey> = {
  age: "intakeSignal.age",
  chest_pain: "intakeSignal.chest_pain",
  duration: "intakeSignal.duration",
  character: "intakeSignal.character",
  severity: "intakeSignal.severity",
  radiation: "intakeSignal.radiation",
  exertional: "intakeSignal.exertional",
  dyspnea: "intakeSignal.dyspnea",
  syncope: "intakeSignal.syncope",
  diaphoresis: "intakeSignal.diaphoresis",
  bp: "intakeSignal.bp",
  hr: "intakeSignal.hr",
  cad_mi: "intakeSignal.cad_mi",
  cv_risk: "intakeSignal.cv_risk",
  meds: "intakeSignal.meds",
};

const GROUP_LABEL_KEYS: Record<SignalGroupId, TranslationKey> = {
  patient: "intakeGroup.patient",
  complaint: "intakeGroup.complaint",
  red_flags: "intakeGroup.red_flags",
  vitals: "intakeGroup.vitals",
  cv_history: "intakeGroup.cv_history",
  meds: "intakeGroup.meds",
};

const COMPLETENESS_MSG_KEYS: Record<IntakeCompletenessLevel, TranslationKey> = {
  strong: "intakeCompleteness.strong",
  moderate: "intakeCompleteness.moderate",
  limited: "intakeCompleteness.limited",
};

// ── Analyze narrative for signal presence ────────────────────────

export function analyzeNarrativeSignals(text: string, t?: TFunc): IntakeSignalStatus[] {
  return INTAKE_SIGNALS.map((signal) => ({
    key: signal.key,
    label: t && SIGNAL_LABEL_KEYS[signal.key] ? t(SIGNAL_LABEL_KEYS[signal.key]) : signal.label,
    group: signal.group,
    status: signal.patterns.some((p) => p.test(text)) ? "detected" : "unclear",
  }));
}

// ── Group signals by clinical category ──────────────────────────

export function groupSignalStatuses(signals: IntakeSignalStatus[], t?: TFunc): SignalGroup[] {
  return SIGNAL_GROUP_ORDER.map((g) => ({
    id: g.id,
    label: t ? t(GROUP_LABEL_KEYS[g.id]) : g.label,
    signals: signals.filter((s) => s.group === g.id),
  }));
}

// ── Consider adding items (top unclear signals by priority) ─────

export function getConsiderAddingItems(
  signals: IntakeSignalStatus[],
  max: number = 5,
): string[] {
  const unclear = signals.filter((s) => s.status === "unclear");
  const withPriority = unclear.map((s) => {
    const def = INTAKE_SIGNALS.find((d) => d.key === s.key);
    return { label: s.label, priority: def?.considerPriority ?? 0 };
  });
  withPriority.sort((a, b) => b.priority - a.priority);
  return withPriority.slice(0, max).map((i) => i.label);
}

// ── Compute intake completeness ─────────────────────────────────

export function getIntakeCompleteness(signals: IntakeSignalStatus[], t?: TFunc): IntakeCompleteness {
  const detectedCount = signals.filter((s) => s.status === "detected").length;
  const unclearCount = signals.length - detectedCount;
  const ratio = detectedCount / signals.length;

  let level: IntakeCompletenessLevel;
  let message: string;

  if (ratio >= 0.7) {
    level = "strong";
    message = t ? t(COMPLETENESS_MSG_KEYS.strong) : "Key symptoms, red flags, vitals, and medication context appear present. Some items may still need confirmation.";
  } else if (ratio >= 0.4) {
    level = "moderate";
    message = t ? t(COMPLETENESS_MSG_KEYS.moderate) : "Core symptoms are present, but additional context may improve extraction and review.";
  } else {
    level = "limited";
    message = t ? t(COMPLETENESS_MSG_KEYS.limited) : "Consider adding duration, radiation, associated symptoms, vitals, cardiovascular history, or medications if available.";
  }

  return { level, detectedCount, unclearCount, message };
}

// ── Build structured additions text from quick fields ────────────

export function buildStructuredAdditions(qf: IntakeQuickFields): string {
  const parts: string[] = [];

  if (qf.age.trim()) parts.push(`Age ${qf.age.trim()}`);
  if (qf.systolic_bp.trim()) parts.push(`Systolic BP ${qf.systolic_bp.trim()}`);
  if (qf.heart_rate.trim()) parts.push(`Heart rate ${qf.heart_rate.trim()}`);
  if (qf.known_cad === "yes") parts.push("Known CAD confirmed");
  if (qf.known_cad === "no") parts.push("Known CAD denied");
  if (qf.prior_mi === "yes") parts.push("Prior MI confirmed");
  if (qf.prior_mi === "no") parts.push("Prior MI denied");
  if (qf.current_meds.trim()) parts.push(`Current medications: ${qf.current_meds.trim()}`);

  if (parts.length === 0) return "";
  return `Structured additions: ${parts.join(". ")}.`;
}

// ── Build final extraction text ─────────────────────────────────

export function buildExtractionText(narrative: string, quickFields: IntakeQuickFields): string {
  const additions = buildStructuredAdditions(quickFields);
  if (!additions) return narrative.trim();
  return `${narrative.trim()}\n\n${additions}`;
}

// ── Check if quick fields have any data ─────────────────────────

export function hasQuickFieldData(qf: IntakeQuickFields): boolean {
  return (
    qf.age.trim() !== "" ||
    qf.systolic_bp.trim() !== "" ||
    qf.heart_rate.trim() !== "" ||
    qf.known_cad !== "" ||
    qf.prior_mi !== "" ||
    qf.current_meds.trim() !== ""
  );
}
