// ── Golden scenario definitions for end-to-end QA ───────────────

export interface GoldenScenarioExpectedFields {
  chest_pain_present?: boolean;
  syncope?: boolean;
  diaphoresis?: boolean;
  dyspnea?: boolean;
  pain_severity?: string;
  pain_radiation?: string;
  exertional_chest_pain?: boolean;
}

export interface GoldenScenarioChecklist {
  id: string;
  label: string;
  category: "intake" | "extraction" | "correction" | "routing" | "report" | "audit" | "safety";
}

export interface GoldenScenario {
  id: string;
  label: string;
  narrative: string;
  expectedRoute: string;
  expectedSafetyStatus: "CLEAR" | "TRIGGERED";
  expectedKeyFields: GoldenScenarioExpectedFields;
  checklist: GoldenScenarioChecklist[];
}

// ── Standard checklist items applied to every scenario ──────────

const COMMON_CHECKLIST: GoldenScenarioChecklist[] = [
  { id: "intake_loads", label: "Intake loads narrative correctly", category: "intake" },
  { id: "signals_detected", label: "Signal checklist detects key signals", category: "intake" },
  { id: "extraction_completed", label: "AI extraction completed (not mock fallback)", category: "extraction" },
  { id: "key_fields_correct", label: "Key extraction fields match expected values", category: "extraction" },
  { id: "field_evidence_present", label: "Field evidence is present", category: "extraction" },
  { id: "human_edit_possible", label: "Human field correction is possible", category: "correction" },
  { id: "human_confirm_works", label: "Human confirmation / routing works", category: "correction" },
  { id: "routing_backend", label: "Routing source is real deterministic backend", category: "routing" },
  { id: "route_matches", label: "Final route matches expected scenario route", category: "routing" },
  { id: "report_reasoning", label: "Report reasoning is consistent with route", category: "report" },
  { id: "signal_chain_present", label: "Signal chain card displays in report", category: "report" },
  { id: "human_edits_display", label: "Human edits display correctly (if applied)", category: "report" },
  { id: "audit_json_works", label: "Audit JSON export downloads successfully", category: "audit" },
  { id: "audit_md_works", label: "Audit Markdown export downloads successfully", category: "audit" },
  { id: "no_diagnosis", label: "No diagnosis/prescription language in report", category: "safety" },
  { id: "physician_review_required", label: "Physician review marked as required", category: "safety" },
];

// ── Scenario definitions ────────────────────────────────────────

export const goldenScenarios: GoldenScenario[] = [
  {
    id: "gs_emergency",
    label: "Emergency red flag",
    narrative:
      "64-year-old patient with severe pressure-like chest pain for 10 minutes radiating to the left arm. Patient experienced syncope during the episode. No dyspnea reported. BP 120/74, HR 96. No known CAD. Not on cardiac medications.",
    expectedRoute: "Emergency Now",
    expectedSafetyStatus: "TRIGGERED",
    expectedKeyFields: {
      chest_pain_present: true,
      syncope: true,
      pain_severity: "severe",
      pain_radiation: "left arm",
    },
    checklist: [
      ...COMMON_CHECKLIST,
      { id: "safety_triggered", label: "Safety status is TRIGGERED", category: "safety" },
      { id: "red_flags_present", label: "Red flags present in safety section", category: "report" },
    ],
  },
  {
    id: "gs_urgent",
    label: "Same-day urgent review",
    narrative:
      "63-year-old patient with moderate pressure-like chest pain for 20 minutes, radiating to the jaw. The pain occurs with exertion. No diaphoresis. Denies dyspnea and syncope. BP 126/82, HR 88. No known CAD. One cardiovascular risk factor. Not on cardiac medications.",
    expectedRoute: "Same-Day Urgent",
    expectedSafetyStatus: "CLEAR",
    expectedKeyFields: {
      chest_pain_present: true,
      exertional_chest_pain: true,
      pain_radiation: "jaw",
      syncope: false,
    },
    checklist: [
      ...COMMON_CHECKLIST,
      { id: "urgency_same_day", label: "Urgency level is same-day or urgent", category: "routing" },
    ],
  },
  {
    id: "gs_routine",
    label: "Routine review",
    narrative:
      "60-year-old patient with low-grade pressure-like chest pain lasting 15 minutes. No radiation, no exertional component, no diaphoresis. Denies dyspnea and syncope. BP 122/76, HR 78. No known CAD, no prior MI. One cardiovascular risk factor. Not on cardiac medications. Pain is mild and non-exertional.",
    expectedRoute: "Routine Review",
    expectedSafetyStatus: "CLEAR",
    expectedKeyFields: {
      chest_pain_present: true,
      syncope: false,
      diaphoresis: false,
      dyspnea: false,
      exertional_chest_pain: false,
    },
    checklist: [
      ...COMMON_CHECKLIST,
      { id: "no_safety_override", label: "No safety override applied", category: "safety" },
    ],
  },
  {
    id: "gs_needs_info",
    label: "Needs more information",
    narrative:
      "62-year-old patient presents with chest pain. Denies shortness of breath and syncope. Blood pressure 124/78, heart rate 80 bpm. Not currently on cardiac medications.",
    expectedRoute: "Needs More Info",
    expectedSafetyStatus: "CLEAR",
    expectedKeyFields: {
      chest_pain_present: true,
    },
    checklist: [
      ...COMMON_CHECKLIST,
      { id: "missing_fields_noted", label: "Missing fields noted in report", category: "report" },
    ],
  },
  {
    id: "gs_conflict",
    label: "Conflicting data",
    narrative:
      "59-year-old patient denies chest pain, but describes crushing pain for 20 minutes with jaw radiation and high severity. Reports exertional chest pain despite denying chest pain presence. No dyspnea, no syncope. BP 122/80, HR 84. No known CAD. Not on cardiac medications.",
    expectedRoute: "Conflicting Data",
    expectedSafetyStatus: "CLEAR",
    expectedKeyFields: {
      chest_pain_present: true,
      pain_radiation: "jaw",
    },
    checklist: [
      ...COMMON_CHECKLIST,
      { id: "conflicts_detected", label: "Conflicts detected in audit trace", category: "report" },
    ],
  },
];
