export interface MetricCard {
  label: string;
  value: string;
  note?: string;
  accent?: "accent" | "routine" | "urgent" | "emergency" | "info" | "muted";
}

export interface RouteDistribution {
  route: string;
  count: number;
  total: number;
  color: string;
}

export interface SafetyAuditMetric {
  label: string;
  value: string;
}

export const summaryMetrics: MetricCard[] = [
  { label: "Total cases processed", value: "50", accent: "accent" },
  { label: "Cases reviewed", value: "38", accent: "accent" },
  { label: "Pending review", value: "12", accent: "urgent" },
  { label: "Physician agreement rate", value: "84%", accent: "routine" },
  { label: "Average usefulness score", value: "4.3 / 5", accent: "accent" },
  { label: "Avg. estimated review-time saved", value: "3–5 min", accent: "info" },
  { label: "Reports with trace", value: "100%", accent: "routine" },
  { label: "Autonomous diagnosis events", value: "0", accent: "muted", note: "Soficca never diagnoses" },
  { label: "Autonomous prescription events", value: "0", accent: "muted", note: "Soficca never prescribes" },
];

export const routeDistribution: RouteDistribution[] = [
  { route: "Emergency", count: 4, total: 50, color: "bg-emergency" },
  { route: "Same-day urgent", count: 8, total: 50, color: "bg-urgent" },
  { route: "Routine review", count: 22, total: 50, color: "bg-routine" },
  { route: "Needs more info", count: 11, total: 50, color: "bg-info" },
  { route: "Deferred / Conflict", count: 5, total: 50, color: "bg-deferred" },
];

export const safetyAuditMetrics: SafetyAuditMetric[] = [
  { label: "Cases with missing critical information surfaced", value: "14" },
  { label: "Emergency overrides applied", value: "4" },
  { label: "Conflicting cases blocked", value: "5" },
  { label: "Reports with policy version", value: "50 / 50" },
  { label: "Reports with activated rules", value: "39 / 50" },
  { label: "Reports requiring human review", value: "50 / 50" },
];
