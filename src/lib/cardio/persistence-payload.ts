/**
 * Build a PersistCaseBundlePayload from a frontend PilotCase.
 *
 * Maps the frontend PilotCase shape into the backend
 * PersistCaseBundleRequest shape. All cases are marked is_simulated=true.
 * Does not include reviewer feedback (future stage).
 */

import type { PilotCase } from "@/types";
import type {
  PersistCaseBundlePayload,
  AIExtractionPayload,
  HumanCorrectionPayload,
  EngineReportPayload,
  AuditRecordPayload,
} from "@/types";
import type { Language } from "@/i18n";
import { buildAuditRecord, buildAuditRecordMarkdown } from "./audit-record";

// ── Main builder ────────────────────────────────────────────────

export function buildPersistCaseBundlePayload(
  pilotCase: PilotCase,
  sessionId?: string | null,
  locale?: Language,
): PersistCaseBundlePayload {
  const ext = pilotCase.extraction;
  const report = pilotCase.engine_report;
  const hc = pilotCase.humanCorrection;

  const payload: PersistCaseBundlePayload = {
    session_id: sessionId ?? null,
    case_id: pilotCase.case_id,
    source: "free_text",
    raw_narrative: pilotCase.free_text_input,
    chief_complaint_summary: ext?.structured_clinical_summary ?? null,
    current_status: pilotCase.status ?? "routed",
    final_route: report?.decision?.path ?? null,
    decision_status: report?.decision?.status ?? null,
    human_review_required: true,
    extraction_source: ext?.extraction_source ?? null,
    routing_source: pilotCase.report_source ?? null,
    is_simulated: true,
    contains_pii_warning: (ext?.pii_warnings?.length ?? 0) > 0,
    metadata_json: {
      created_at: pilotCase.created_at,
      report_source: pilotCase.report_source ?? "unknown",
      ui_locale: locale ?? "en",
      source_language: locale ?? "en",
    },
  };

  // AI extraction
  if (ext) {
    payload.ai_extraction = buildAIExtractionPayload(pilotCase);
  }

  // Human correction
  if (hc?.humanEditsApplied) {
    payload.human_correction = buildHumanCorrectionPayload(pilotCase);
  }

  // Engine report
  if (report) {
    payload.engine_report = buildEngineReportPayload(pilotCase);
  }

  // Audit record
  payload.audit_record = buildAuditRecordPayload(pilotCase);

  return payload;
}

// ── Sub-payload builders ────────────────────────────────────────

function buildAIExtractionPayload(pilotCase: PilotCase): AIExtractionPayload | null {
  const ext = pilotCase.extraction;
  if (!ext) return null;

  return {
    extraction_id: ext.extraction_id,
    model: ext.model_id,
    extraction_source: ext.extraction_source ?? "unknown",
    confidence: ext.confidence ?? 0,
    structured_summary: ext.structured_clinical_summary ?? null,
    fields_json: ext.fields as unknown as Record<string, unknown>,
    field_evidence_json: ext.field_evidence ?? null,
    missing_information_json: ext.missing_information
      ? (ext.missing_information as unknown as Record<string, unknown>)
      : null,
    completion_questions_json: ext.completion_questions ?? null,
    quality_flags_json: ext.extraction_quality_flags ?? null,
    pii_warnings_json: ext.pii_warnings ?? null,
    warnings_json: ext.warnings ?? null,
    unmapped_signals_json: ext.unmapped_signals ?? null,
    possible_conflicts_json: ext.possible_conflicts ?? null,
    raw_response_json: null,
  };
}

function buildHumanCorrectionPayload(pilotCase: PilotCase): HumanCorrectionPayload | null {
  const hc = pilotCase.humanCorrection;
  if (!hc?.humanEditsApplied) return null;

  // Reconstruct final fields by applying diffs to extraction fields
  const finalFields = { ...(pilotCase.extraction?.fields ?? {}) };
  for (const diff of hc.diffs) {
    (finalFields as Record<string, unknown>)[diff.field] = diff.finalValue;
  }

  return {
    human_edits_applied: true,
    fields_edited_count: hc.fieldsEdited,
    diffs_json: hc.diffs,
    final_structured_input_json: finalFields as Record<string, unknown>,
    reviewer_label: null,
  };
}

function buildEngineReportPayload(pilotCase: PilotCase): EngineReportPayload | null {
  const report = pilotCase.engine_report;
  if (!report) return null;

  return {
    route: report.decision?.path ?? null,
    decision_status: report.decision?.status ?? null,
    report_json: report as unknown as Record<string, unknown>,
    engine_input_json: (pilotCase.engine_input as unknown as Record<string, unknown>) ?? {},
    safety_json: report.safety
      ? (report.safety as unknown as Record<string, unknown>)
      : null,
    trace_json: report.trace
      ? (report.trace as unknown as Record<string, unknown>)
      : null,
    activated_rules_json: report.trace?.activated_rules ?? null,
    engine_version: report.versions?.engine ?? null,
    ruleset_version: report.versions?.ruleset ?? null,
    safety_policy_version: report.versions?.safety_policy ?? null,
    contract_version: report.versions?.contract ?? null,
  };
}

function buildAuditRecordPayload(pilotCase: PilotCase): AuditRecordPayload {
  const auditRecord = buildAuditRecord(pilotCase);
  const markdownSnapshot = buildAuditRecordMarkdown(auditRecord);

  return {
    audit_id: auditRecord.audit_id,
    audit_json: auditRecord as unknown as Record<string, unknown>,
    markdown_snapshot: markdownSnapshot,
  };
}
