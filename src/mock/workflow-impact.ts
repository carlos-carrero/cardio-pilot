export interface ImpactCategory {
  title: string;
  signals: ImpactSignal[];
}

export interface ImpactSignal {
  label: string;
  value: string;
}

export const fragmentationSignals: ImpactCategory = {
  title: "Fragmentation signals",
  signals: [
    { label: "Missing critical information surfaced", value: "14 cases" },
    { label: "Contradictory cases blocked before routing", value: "5 cases" },
    { label: "Cases requiring reconciliation", value: "5 cases" },
    { label: "Reports with complete trace", value: "50 / 50" },
  ],
};

export const escalationEfficiency: ImpactCategory = {
  title: "Escalation efficiency",
  signals: [
    { label: "Emergency overrides applied", value: "4 cases" },
    { label: "Same-day urgent cases identified", value: "8 cases" },
    { label: "Routine cases not unnecessarily escalated", value: "22 cases" },
    { label: "Needs-more-info cases withheld from unsafe classification", value: "11 cases" },
  ],
};

export const reviewEfficiency: ImpactCategory = {
  title: "Review efficiency",
  signals: [
    { label: "Estimated review-time saved", value: "3–5 min / case" },
    { label: "Cases prepared before consultation", value: "38 / 50" },
    { label: "Reports requiring no repeated intake fields", value: "50 / 50" },
    { label: "Physician agreement rate", value: "84%" },
  ],
};

export const governanceAudit: ImpactCategory = {
  title: "Governance / audit",
  signals: [
    { label: "Reports with engine version", value: "50 / 50" },
    { label: "Reports with ruleset version", value: "50 / 50" },
    { label: "Reports with safety policy version", value: "50 / 50" },
    { label: "Reports with activated rules", value: "39 / 50" },
  ],
};

export const allImpactCategories: ImpactCategory[] = [
  fragmentationSignals,
  escalationEfficiency,
  reviewEfficiency,
  governanceAudit,
];

export const workflowModel = {
  cases_reviewed: 50,
  estimated_minutes_per_case: 3,
  total_minutes_saved: 150,
};
