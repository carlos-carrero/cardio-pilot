import type {
  PilotCase,
  CardioPilotAuditRecord,
  AIExtractionRecord,
  SignalChain,
  ReportIntegrity,
  SafetyAssertions,
  PilotModeSnapshot,
  CardioExtractionFields,
} from "@/types";
import { getRouteLabel, getStatusLabel } from "./report-helpers";

// ── Audit ID generation ─────────────────────────────────────────

function generateAuditId(): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 6);
  return `CA-${ts}-${rand}`.toUpperCase();
}

// ── Build AIExtractionRecord from extraction ────────────────────

function buildAIExtractionRecord(
  pilotCase: PilotCase,
): AIExtractionRecord | null {
  const ext = pilotCase.extraction;
  if (!ext) return null;
  return {
    extraction_id: ext.extraction_id,
    model: ext.model_id,
    extraction_source: ext.extraction_source ?? "mock",
    raw_text: pilotCase.free_text_input || undefined,
    structured_clinical_summary: ext.structured_clinical_summary,
    fields: ext.fields,
    field_evidence: ext.field_evidence,
    missing_information: ext.missing_information,
    completion_questions: ext.completion_questions,
    extraction_quality_flags: ext.extraction_quality_flags,
    pii_warnings: ext.pii_warnings,
    confidence: ext.confidence,
    created_at: ext.extracted_at,
  };
}

// ── Build signal chain ──────────────────────────────────────────

function buildSignalChain(pilotCase: PilotCase): SignalChain {
  const ext = pilotCase.extraction;
  const hc = pilotCase.humanCorrection;
  return {
    ai_extraction: {
      label: "AI extraction",
      status: ext?.extraction_source === "ai" ? "completed" : "mock_fallback",
      detail: ext?.extraction_source === "ai" ? `Model: ${ext.model_id}` : undefined,
    },
    human_confirmation: {
      label: "Human confirmation",
      status: pilotCase.extraction_confirmed ? "completed" : "pending",
    },
    human_edits: {
      label: "Human edits",
      status: hc?.humanEditsApplied ? "completed" : "skipped",
      detail: hc?.humanEditsApplied ? `${hc.fieldsEdited} fields edited` : "No edits applied",
    },
    soficca_routing: {
      label: "Soficca routing",
      status: pilotCase.report_source === "backend" ? "completed" : "mock_fallback",
      detail: pilotCase.report_source === "backend" ? "Real deterministic backend" : "Mock fallback",
    },
    physician_review: {
      label: "Physician review",
      status: "pending",
    },
  };
}

// ── Build report integrity ──────────────────────────────────────

function buildReportIntegrity(pilotCase: PilotCase): ReportIntegrity {
  const r = pilotCase.engine_report;
  return {
    policy_version_included: !!r?.versions.safety_policy,
    ruleset_version_included: !!r?.versions.ruleset,
    engine_version_included: !!r?.versions.engine,
    activated_rules_included: (r?.trace.activated_rules.length ?? 0) > 0,
    audit_trace_included: !!r?.trace,
    human_review_required: true,
  };
}

// ── Safety assertions (always true by design) ───────────────────

const SAFETY_ASSERTIONS: SafetyAssertions = {
  no_diagnosis_generated: true,
  no_prescription_generated: true,
  ai_did_not_decide_route: true,
  deterministic_engine_routed_case: true,
  physician_review_required: true,
};

// ── Determine final structured input ────────────────────────────

function getFinalStructuredInput(pilotCase: PilotCase): CardioExtractionFields | null {
  if (!pilotCase.extraction) return null;
  // If human edits were applied, the routing used corrected fields.
  // The engine_input.state contains the final values sent to the engine.
  // But the extraction.fields on PilotCase is the original AI fields.
  // The corrected fields were passed as finalFieldsOverride in page.tsx
  // and merged into the extraction sent to routing. Since PilotCase.extraction
  // stores the *original* extraction, we reconstruct final fields by applying diffs.
  const fields = { ...pilotCase.extraction.fields };
  if (pilotCase.humanCorrection?.humanEditsApplied) {
    for (const diff of pilotCase.humanCorrection.diffs) {
      (fields as Record<string, unknown>)[diff.field] = diff.finalValue;
    }
  }
  return fields;
}

// ── Main builder ────────────────────────────────────────────────

export function buildAuditRecord(pilotCase: PilotCase): CardioPilotAuditRecord {
  const pilotMode: PilotModeSnapshot = {
    data_source: "mock",
    extraction_source: pilotCase.extraction?.extraction_source ?? "unknown",
    routing_source: pilotCase.report_source ?? "unknown",
  };

  return {
    audit_id: generateAuditId(),
    case_id: pilotCase.case_id,
    created_at: pilotCase.created_at,
    raw_narrative: pilotCase.free_text_input,
    extraction_source: pilotCase.extraction?.extraction_source ?? "unknown",
    routing_source: pilotCase.report_source ?? "unknown",
    ai_extraction_record: buildAIExtractionRecord(pilotCase),
    human_correction: pilotCase.humanCorrection ?? null,
    final_structured_input: getFinalStructuredInput(pilotCase),
    engine_input: pilotCase.engine_input,
    engine_report: pilotCase.engine_report,
    signal_chain: buildSignalChain(pilotCase),
    report_integrity: buildReportIntegrity(pilotCase),
    safety_assertions: SAFETY_ASSERTIONS,
    pilot_mode: pilotMode,
  };
}

// ── JSON export ─────────────────────────────────────────────────

export function downloadAuditRecordJson(record: CardioPilotAuditRecord): void {
  const stamped = { ...record, exported_at: new Date().toISOString() };
  const json = JSON.stringify(stamped, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `soficca-cardio-audit-${record.case_id}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ── Markdown export ─────────────────────────────────────────────

function fmtBool(v: boolean | null | undefined): string {
  if (v === true) return "Yes";
  if (v === false) return "No";
  return "Unconfirmed";
}

function fmtVal(v: unknown): string {
  if (v === null || v === undefined) return "Unconfirmed";
  if (typeof v === "boolean") return v ? "Yes" : "No";
  return String(v);
}

export function buildAuditRecordMarkdown(record: CardioPilotAuditRecord): string {
  const L: string[] = [];
  const push = (...lines: string[]) => L.push(...lines, "");

  const now = new Date().toISOString();

  push(
    "# Soficca Cardio Pilot Audit Record",
    "",
    "## Case",
    `- **Case ID:** ${record.case_id}`,
    `- **Audit ID:** ${record.audit_id}`,
    `- **Created:** ${record.created_at}`,
    `- **Exported:** ${now}`,
    `- **Pilot mode:** Data: ${record.pilot_mode.data_source} · Extraction: ${record.pilot_mode.extraction_source} · Routing: ${record.pilot_mode.routing_source}`,
  );

  // Source narrative
  push(
    "## Source Narrative",
    "",
    `> ${record.raw_narrative.replace(/\n/g, "\n> ")}`,
  );

  // Signal chain
  const sc = record.signal_chain;
  push(
    "## Signal Chain",
    `1. **AI extraction:** ${sc.ai_extraction.status}${sc.ai_extraction.detail ? ` — ${sc.ai_extraction.detail}` : ""}`,
    `2. **Human confirmation:** ${sc.human_confirmation.status}`,
    `3. **Human edits:** ${sc.human_edits.status}${sc.human_edits.detail ? ` — ${sc.human_edits.detail}` : ""}`,
    `4. **Soficca routing:** ${sc.soficca_routing.status}${sc.soficca_routing.detail ? ` — ${sc.soficca_routing.detail}` : ""}`,
    `5. **Physician review:** ${sc.physician_review.status}`,
  );

  // AI structured summary
  const ext = record.ai_extraction_record;
  if (ext?.structured_clinical_summary) {
    push(
      "## AI Structured Summary",
      "",
      "*AI-generated summary of extracted facts only. Not a diagnosis, treatment recommendation, or routing decision.*",
      "",
      ext.structured_clinical_summary,
    );
  }

  // AI extraction details
  if (ext) {
    push(
      "## AI Extraction",
      `- **Model:** ${ext.model}`,
      `- **Extraction source:** ${ext.extraction_source}`,
      `- **Confidence:** ${(ext.confidence * 100).toFixed(0)}%`,
      `- **Quality flags:** ${ext.extraction_quality_flags?.length ? ext.extraction_quality_flags.map(f => f.replace(/_/g, " ")).join(", ") : "None"}`,
      `- **PII warnings:** ${ext.pii_warnings?.length ? ext.pii_warnings.map(w => w.replace(/_/g, " ")).join(", ") : "None"}`,
    );

    // PII warning block
    if (ext.pii_warnings && ext.pii_warnings.length > 0) {
      push(
        "",
        "> **⚠ Possible identifier detected.** Remove or anonymize before exporting or sharing.",
      );
    }
  }

  // Extracted fields
  if (ext) {
    push("## Extracted Fields (Original AI)");
    for (const [key, val] of Object.entries(ext.fields)) {
      push(`- **${key.replace(/_/g, " ")}:** ${fmtVal(val)}`);
    }
    push("");
  }

  // Field evidence
  if (ext?.field_evidence && ext.field_evidence.length > 0) {
    push("## Field Evidence");
    for (const fe of ext.field_evidence) {
      push(`- **${fe.field}:** ${fe.value} — *"${fe.source_text}"* (confidence: ${(fe.confidence * 100).toFixed(0)}%)`);
    }
    push("");
  }

  // Missing information
  const mi = ext?.missing_information;
  if (mi && (mi.required_for_routing.length || mi.clinically_useful.length || mi.unconfirmed.length)) {
    push("## Missing Information");
    if (mi.required_for_routing.length > 0) {
      push("### Required for routing", ...mi.required_for_routing.map(f => `- ${f.replace(/_/g, " ")}`), "");
    }
    if (mi.clinically_useful.length > 0) {
      push("### Clinically useful", ...mi.clinically_useful.map(f => `- ${f.replace(/_/g, " ")}`), "");
    }
    if (mi.unconfirmed.length > 0) {
      push("### Unconfirmed", ...mi.unconfirmed.map(f => `- ${f.replace(/_/g, " ")}`), "");
    }
  }

  // Completion questions
  if (ext?.completion_questions && ext.completion_questions.length > 0) {
    push("## Completion Questions");
    for (const q of ext.completion_questions) {
      push(`- [ ] ${q}`);
    }
    push("", "*Questions are generated to complete structured intake. They are not clinical advice.*");
    push("");
  }

  // Human corrections
  push("## Human Corrections");
  if (record.human_correction?.humanEditsApplied) {
    push(`Fields edited: **${record.human_correction.fieldsEdited}**`, "");
    for (const diff of record.human_correction.diffs) {
      push(
        `- **${String(diff.field).replace(/_/g, " ")}**`,
        `  - AI value: ${fmtVal(diff.originalValue)}`,
        `  - Final value: ${fmtVal(diff.finalValue)}`,
      );
    }
    push("");
  } else {
    push("No human edits applied before routing.", "");
  }

  // Final structured input
  if (record.final_structured_input) {
    push("## Final Structured Input Used by Engine");
    for (const [key, val] of Object.entries(record.final_structured_input)) {
      push(`- **${key.replace(/_/g, " ")}:** ${fmtVal(val)}`);
    }
    push("");
  }

  // Soficca decision report
  const r = record.engine_report;
  if (r) {
    push(
      "## Soficca Decision Report",
      `- **Route:** ${getRouteLabel(r.decision.path)}`,
      `- **Status:** ${getStatusLabel(r.decision.status)}`,
      `- **Urgency:** ${r.decision.urgency_level}`,
      `- **Human review required:** Always`,
      `- **Clinical summary:** ${r.decision.clinical_summary}`,
      `- **Required actions:** ${r.decision.required_actions.length > 0 ? r.decision.required_actions.join("; ") : "None"}`,
    );

    // Safety verification
    push(
      "## Safety Verification",
      `- **Safety status:** ${r.safety.status}`,
      `- **Override applied:** ${r.safety.override_applied ? "Yes" : "No"}`,
      `- **Red flags:** ${r.safety.has_red_flags ? r.safety.flags.join(", ") : "None"}`,
      `- **Active triggers:** ${r.safety.triggers.length > 0 ? r.safety.triggers.join(", ") : "None"}`,
      `- **Safety policy:** ${r.safety.policy_version}`,
    );

    // Activated rules
    push(
      "## Activated Rules",
      ...(r.trace.activated_rules.length > 0
        ? r.trace.activated_rules.map(rule => `- ${rule}`)
        : ["No rules activated — routing deferred."]),
    );
    push("");

    // Audit trace
    push(
      "## Audit Trace",
      `- **Preliminary route:** ${r.trace.preliminary_route ?? "None"}`,
      `- **Final route:** ${r.trace.final_route ?? "None"}`,
      `- **Override reason:** ${r.trace.override_reason ?? "None"}`,
      `- **Conflicts detected:** ${r.trace.conflicts_detected.length > 0 ? r.trace.conflicts_detected.join(", ") : "None"}`,
    );

    // Versions
    push(
      "## Contract Versions",
      `- Engine: ${r.versions.engine}`,
      `- Ruleset: ${r.versions.ruleset}`,
      `- Safety policy: ${r.versions.safety_policy}`,
      `- Contract: ${r.versions.contract}`,
    );
  }

  // Report integrity
  const ri = record.report_integrity;
  push(
    "## Report Integrity",
    `- [${ri.policy_version_included ? "x" : " "}] Policy version included`,
    `- [${ri.ruleset_version_included ? "x" : " "}] Ruleset version included`,
    `- [${ri.engine_version_included ? "x" : " "}] Engine version included`,
    `- [${ri.activated_rules_included ? "x" : " "}] Activated rules included`,
    `- [${ri.audit_trace_included ? "x" : " "}] Audit trace included`,
    `- [x] No diagnosis generated`,
    `- [x] No prescription generated`,
    `- [x] AI did not decide route`,
    `- [x] Deterministic engine routed case`,
    `- [x] Physician review required`,
  );

  // Disclaimer
  push(
    "",
    "---",
    "",
    "*Soficca does not diagnose, prescribe, or replace clinical judgment.*",
    "*AI extraction may be incomplete or incorrect. Human review is required before clinical use.*",
    "*This audit record structures symptoms and safety-routing signals for human clinical review.*",
  );

  return L.join("\n");
}

export function downloadAuditRecordMarkdown(record: CardioPilotAuditRecord): void {
  const md = buildAuditRecordMarkdown(record);
  const blob = new Blob([md], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `soficca-cardio-audit-${record.case_id}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
