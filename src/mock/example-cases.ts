import type { ExampleCase } from "@/types";

export const exampleCases: ExampleCase[] = [
  {
    id: "NEEDS_MORE_INFO",
    label: "Missing information",
    short_description: "Incomplete clinical data requiring additional fields",
    narrative:
      "62-year-old patient presents with chest pain. Denies shortness of breath and syncope. Blood pressure 124/78, heart rate 80 bpm. Not currently on cardiac medications.",
    expectedRoute: "Needs More Info",
    signalsPreview: ["age", "chest pain", "vitals", "meds"],
  },
  {
    id: "ROUTINE_REVIEW",
    label: "Routine review",
    short_description: "Stable presentation appropriate for routine cardiology follow-up",
    narrative:
      "60-year-old patient with low-grade pressure-like chest pain lasting 15 minutes. No radiation, no exertional component, no diaphoresis. Denies dyspnea and syncope. BP 122/76, HR 78. No known CAD, no prior MI. One cardiovascular risk factor. Not on cardiac medications. Pain is mild and non-exertional.",
    expectedRoute: "Routine Review",
    signalsPreview: ["age", "duration", "character", "vitals", "history", "meds"],
  },
  {
    id: "URGENT_ESCALATION",
    label: "Same-day urgent review",
    short_description: "Risk pattern requiring urgent same-day clinical escalation",
    narrative:
      "63-year-old patient with moderate pressure-like chest pain for 20 minutes, radiating to the jaw. The pain occurs with exertion. No diaphoresis. Denies dyspnea and syncope. BP 126/82, HR 88. No known CAD. One cardiovascular risk factor. Not on cardiac medications.",
    expectedRoute: "Same-Day Urgent Review",
    signalsPreview: ["age", "duration", "radiation", "exertional", "vitals", "meds"],
  },
  {
    id: "EMERGENCY_ROUTE",
    label: "Emergency red-flag",
    short_description: "Hard red-flag criteria requiring immediate emergency escalation",
    narrative:
      "64-year-old patient with severe pressure-like chest pain for 10 minutes radiating to the left arm. Patient experienced syncope during the episode. No dyspnea reported. BP 120/74, HR 96. No known CAD. Not on cardiac medications.",
    expectedRoute: "Emergency Red Flag",
    signalsPreview: ["age", "duration", "severity", "radiation", "syncope", "vitals"],
  },
  {
    id: "DEFERRED_PENDING_DATA",
    label: "Conflicting data",
    short_description: "Contradictory clinical inputs requiring reconciliation",
    narrative:
      "59-year-old patient denies chest pain, but describes crushing pain for 20 minutes with jaw radiation and high severity. Reports exertional chest pain despite denying chest pain presence. No dyspnea, no syncope. BP 122/80, HR 84. No known CAD. Not on cardiac medications.",
    expectedRoute: "Conflicting Data",
    signalsPreview: ["age", "duration", "character", "radiation", "vitals", "contradictions"],
  },
];
