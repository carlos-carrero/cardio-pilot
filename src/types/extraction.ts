export type ExtractionSource = "ai" | "mock";

export interface CardioFieldEvidence {
  field: string;
  value: string;
  source_text: string;
  confidence: number;
}

export interface CardioMissingInformation {
  required_for_routing: string[];
  clinically_useful: string[];
  unconfirmed: string[];
}

export type ExtractionQualityFlag =
  | "low_confidence_extraction"
  | "critical_missing_fields"
  | "contradictory_narrative"
  | "limited_vitals"
  | "medication_status_unclear"
  | "cardiovascular_history_unclear"
  | "requires_human_confirmation"
  | "possible_identifier_detected";

export type PiiWarning =
  | "possible_name_detected"
  | "possible_phone_detected"
  | "possible_email_detected"
  | "possible_id_number_detected"
  | "possible_address_detected";

export interface CardioExtraction {
  extraction_id: string;
  model_id: string;
  extracted_at: string;
  confidence: number;
  fields: CardioExtractionFields;
  unmapped_signals: string[];
  warnings: string[];
  extraction_source?: ExtractionSource;
  field_evidence?: CardioFieldEvidence[];
  missing_fields?: string[];
  possible_conflicts?: string[];
  structured_clinical_summary?: string;
  missing_information?: CardioMissingInformation;
  completion_questions?: string[];
  extraction_quality_flags?: ExtractionQualityFlag[];
  pii_warnings?: PiiWarning[];
}

// ── Editable extraction types ────────────────────────────────────

export type FieldValue = string | number | boolean | null;

export interface EditedFieldDiff {
  field: keyof CardioExtractionFields;
  originalValue: FieldValue;
  finalValue: FieldValue;
}

export interface EditableExtractionState {
  originalFields: CardioExtractionFields;
  finalFields: CardioExtractionFields;
  edits: EditedFieldDiff[];
  reviewedAt?: string;
}

export interface HumanCorrectionStatus {
  humanEditsApplied: boolean;
  fieldsEdited: number;
  diffs: EditedFieldDiff[];
}

// ── Audit-ready extraction record (preparation for Stage 2B.4) ──

export interface AIExtractionRecord {
  extraction_id: string;
  model: string;
  extraction_source: ExtractionSource;
  raw_text?: string;
  structured_clinical_summary?: string;
  fields: CardioExtractionFields;
  field_evidence?: CardioFieldEvidence[];
  missing_information?: CardioMissingInformation;
  completion_questions?: string[];
  extraction_quality_flags?: ExtractionQualityFlag[];
  pii_warnings?: PiiWarning[];
  confidence: number;
  created_at: string;
}

export interface CardioExtractionFields {
  age: number | null;
  chest_pain_present: boolean | null;
  pain_duration_minutes: number | null;
  pain_character: string | null;
  pain_severity: string | null;
  pain_radiation: string | null;
  exertional_chest_pain: boolean | null;
  diaphoresis: boolean | null;
  dyspnea: boolean | null;
  syncope: boolean | null;
  systolic_bp: number | null;
  heart_rate: number | null;
  prior_mi: boolean | null;
  known_cad: boolean | null;
  cv_risk_factors_count: number | null;
  current_meds_none: boolean | null;
  current_meds_summary?: string | null;
}
