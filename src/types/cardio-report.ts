export type DecisionStatus = "DECIDED" | "NEEDS_MORE_INFO" | "CONFLICT" | "ESCALATED";

export type PathId =
  | "PATH_MORE_QUESTIONS"
  | "PATH_EMERGENCY_NOW"
  | "PATH_URGENT_SAME_DAY"
  | "PATH_ROUTINE"
  | "PATH_SELF_CARE"
  | "PATH_ESCALATE_HUMAN";

export type SafetyStatus = "CLEAR" | "TRIGGERED";
export type SafetyAction = "NONE" | "OVERRIDE_ESCALATE" | "OVERRIDE_BLOCK_RECS";

export interface PolicyTrace {
  evaluated: string[];
  triggered: string[];
}

export interface EvidenceItem {
  value: unknown;
  [key: string]: unknown;
}

export interface CardioVersions {
  engine: string;
  ruleset: string;
  safety_policy: string;
  contract: string;
}

export interface CardioDecision {
  status: DecisionStatus;
  path: PathId | null;
  flags: string[];
  reasons: string[];
  recommendations: string[];
  required_fields: string[];
  missing_fields: string[];
  decision_id: string;
  case_status: string;
  decision_type: string;
  recommended_route: PathId | null;
  urgency_level: string;
  clinical_summary: string;
  required_actions: string[];
}

export interface CardioSafety {
  status: SafetyStatus;
  action: SafetyAction;
  triggers: string[];
  policy_version: string;
  safety_id: string;
  has_red_flags: boolean;
  override_applied: boolean;
  severity: string;
  flags: string[];
}

export interface CardioTrace {
  policy_trace: PolicyTrace;
  rules_evaluated: string[];
  rules_triggered: string[];
  evidence: Record<string, EvidenceItem>;
  uncertainty_notes: string[];
  missing_fields: string[];
  activated_rules: string[];
  preliminary_route: PathId | null;
  final_route: PathId | null;
  override_reason: string | null;
  conflicts_detected: string[];
}

export interface CardioReport {
  ok: boolean;
  errors: Array<Record<string, unknown>>;
  versions: CardioVersions;
  decision: CardioDecision;
  safety: CardioSafety;
  trace: CardioTrace;
}

export interface CardioPayload {
  state: Record<string, unknown>;
  context: { source: string };
}
