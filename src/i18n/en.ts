// ── English dictionary · Header + Welcome screen ─────────────────
// Keys are organized by screen. Add new screens as separate sections.

const en = {
  // ── Header ──────────────────────────────────────────────────────
  "header.badge": "Cardio Pilot",
  "header.nav.flow": "Pilot Flow",
  "header.nav.reviewer": "Reviewer",
  "header.nav.metrics": "Metrics",
  "header.nav.cost_impact": "Operational Signals",
  "header.nav.pilot_summary": "Pilot Summary",
  "header.nav.qa": "QA",
  "header.nav.demo_guide": "Demo Guide",
  "header.nav.sample_report": "Sample",
  "header.session.persisted": "Persisted demo session · active",
  "header.session.local": "Current demo session · not persisted",
  "header.mobile_toggle_label": "Toggle navigation",

  // ── Welcome screen ─────────────────────────────────────────────
  "welcome.eyebrow": "Cardiovascular Triage Infrastructure",
  "welcome.headline_soficca": "Soficca",
  "welcome.headline_accent": "Cardio Pilot",
  "welcome.subtitle": "Cardiovascular triage infrastructure built for physician review.",
  "welcome.mantra_ai": "AI structures the signal.",
  "welcome.mantra_soficca": "Soficca governs the route.",
  "welcome.mantra_physician": "Physicians make the final decision.",
  "welcome.cta_start": "Start Pilot Case →",
  "welcome.cta_sample": "View sample report",
  "welcome.disclaimer": "Soficca does not diagnose, prescribe, or replace clinical judgment. This pilot structures symptoms and safety-routing signals for human clinical review.",

  // Pipeline steps
  "welcome.step1_title": "Free-text symptoms",
  "welcome.step1_desc": "Physician enters a clinical narrative in natural language.",
  "welcome.step2_title": "AI signal structuring",
  "welcome.step2_desc": "AI extracts clinical signals. It does not determine the route.",
  "welcome.step3_title": "Soficca deterministic route",
  "welcome.step3_desc": "Governed safety policies and versioned rules determine the routing path.",
  "welcome.step4_title": "Physician review",
  "welcome.step4_desc": "A physician reviews and confirms every routed case. Final authority is always human.",

  // Evidence loop
  "welcome.evidence_heading": "Pilot evidence loop",
  "welcome.evidence_signals": "Structured signals",
  "welcome.evidence_route": "Versioned route",
  "welcome.evidence_review": "Human review",
  "welcome.evidence_ops": "Operational signals",

  // Bottom meta tags
  "welcome.tag_deterministic": "Deterministic",
  "welcome.tag_auditable": "Auditable",
  "welcome.tag_versionable": "Versionable",
  "welcome.tag_safety": "Safety-first",

  // ── Intake screen ──────────────────────────────────────────────
  "intake.section_label": "Case Intake",
  "intake.heading": "Cardiovascular symptom narrative",
  "intake.body": "Enter a clinical narrative or select an example case. The AI will structure the signal — it does not determine the clinical route.",

  // Example case cards
  "intake.example_cases_label": "Example cases",
  "intake.scenario_route_prefix": "Scenario route:",
  "intake.badge_needs_info": "Needs info",
  "intake.badge_routine": "Routine",
  "intake.badge_urgent": "Urgent",
  "intake.badge_emergency": "Emergency",
  "intake.badge_conflict": "Conflict",

  // Narrative textarea
  "intake.narrative_label": "Clinical narrative",
  "intake.narrative_placeholder": "Describe the cardiovascular presentation. Include age, symptoms, vitals, history, and relevant context...",

  // Quick fields
  "intake.quick_fields_summary": "Optional structured quick fields",
  "intake.quick_fields_hint": "— add vitals, CAD history, or medication context without rewriting the narrative",
  "intake.quick_fields_explanation": "These fields are appended to the text sent for AI structuring. They do not replace the narrative.",
  "intake.quick_label_age": "Age",
  "intake.quick_label_systolic_bp": "Systolic BP",
  "intake.quick_label_heart_rate": "Heart rate",
  "intake.quick_label_known_cad": "Known CAD",
  "intake.quick_label_prior_mi": "Prior MI",
  "intake.quick_label_current_meds": "Current medications",
  "intake.quick_placeholder_age": "e.g. 64",
  "intake.quick_placeholder_bp": "e.g. 120",
  "intake.quick_placeholder_hr": "e.g. 96",
  "intake.quick_placeholder_meds": "e.g. aspirin, statin",
  "intake.quick_option_yes": "Yes",
  "intake.quick_option_no": "No",
  "intake.structured_additions_label": "Structured additions (will be appended)",
  "intake.no_structured_additions": "No structured additions added.",

  // Prepared text preview
  "intake.prepared_text_show": "▸ Show text prepared for AI structuring",
  "intake.prepared_text_hide": "▾ Hide text prepared for AI structuring",
  "intake.prepared_text_explanation": "This is the exact text that will be sent to the AI extraction endpoint for signal structuring only.",

  // Submit area
  "intake.pre_submit_note": "Next, AI will structure the narrative into editable clinical signals. Soficca will not route the case until you review or confirm the extraction.",
  "intake.submit_button": "Structure clinical signal →",
  "intake.using_example": "Using:",

  // Sidebar: Intake completeness
  "intake.completeness_title": "Intake completeness",
  "intake.completeness_strong": "strong",
  "intake.completeness_moderate": "moderate",
  "intake.completeness_limited": "limited",
  "intake.signals_count_suffix": "signals",

  // Sidebar: Signals checklist
  "intake.signals_title": "Signals Soficca looks for",
  "intake.signal_likely": "likely",
  "intake.signals_footer": "Lightweight intake guidance — final extraction happens after AI structuring.",

  // Sidebar: Consider adding
  "intake.consider_adding_title": "Consider adding",
  "intake.consider_adding_footer": "These suggestions help complete structured intake. They are not clinical advice.",

  // Sidebar: What happens next
  "intake.next_title": "What happens next",
  "intake.next_step1": "AI structures the narrative into clinical signals.",
  "intake.next_step2": "You review and correct the extracted fields.",
  "intake.next_step3": "Soficca applies deterministic routing.",
  "intake.next_step4": "A physician-reviewable audit report is generated.",

  // Sidebar: Routing guidance
  "intake.routing_title": "Routing guidance",
  "intake.routing_body": "To route deterministically, Soficca needs structured signals such as symptom duration, character, radiation, red flags, vitals, cardiovascular history, and medications. If key inputs are missing, Soficca may return Needs More Info instead of forcing a route.",

  // ── Extraction Preview screen ────────────────────────────────────
  "extract.section_label": "Review & Confirm Extraction",
  "extract.heading": "Confirm structured signals",
  "extract.banner_text": "The AI proposed structured signals. Review or correct them before Soficca routes the case.",
  "extract.source_ai": "Real AI extraction · structuring only",
  "extract.source_mock": "Mock extraction fallback",

  // Structured summary
  "extract.summary_heading": "Structured summary for review",
  "extract.summary_disclaimer": "AI-generated summary of extracted facts only. Not a diagnosis or route decision.",

  // Quality flags
  "extract.flag_low_confidence": "Low confidence extraction",
  "extract.flag_critical_missing": "Critical missing fields",
  "extract.flag_contradictory": "Contradictory narrative",
  "extract.flag_limited_vitals": "Limited vitals",
  "extract.flag_med_unclear": "Medication status unclear",
  "extract.flag_cv_unclear": "Cardiovascular history unclear",
  "extract.flag_requires_confirmation": "Requires human confirmation",
  "extract.flag_pii_detected": "Possible identifier detected",

  // PII warnings
  "extract.pii_title": "Possible identifier detected",
  "extract.pii_body": "Remove or anonymize before storing or sharing.",

  // Missing information
  "extract.missing_heading": "Routing input requirements",
  "extract.missing_required": "Required for routing",
  "extract.missing_useful": "Clinically useful",
  "extract.missing_unconfirmed": "Unconfirmed",

  // Completion questions
  "extract.questions_heading": "Suggested intake questions",
  "extract.questions_disclaimer": "Questions are generated to complete structured intake. They are not clinical advice.",

  // Field groups
  "extract.group_patient": "Patient / Context",
  "extract.group_complaint": "Presenting Complaint",
  "extract.group_symptoms": "Symptoms",
  "extract.group_vitals": "Vitals",
  "extract.group_cv_history": "Cardiovascular History",
  "extract.group_medication": "Medication / Context",

  // Field labels
  "extract.field_age": "Age",
  "extract.field_chest_pain_present": "Chest pain present",
  "extract.field_pain_duration": "Pain duration (min)",
  "extract.field_pain_character": "Pain character",
  "extract.field_pain_severity": "Pain severity",
  "extract.field_pain_radiation": "Pain radiation",
  "extract.field_exertional": "Exertional chest pain",
  "extract.field_diaphoresis": "Diaphoresis",
  "extract.field_dyspnea": "Dyspnea",
  "extract.field_syncope": "Syncope",
  "extract.field_systolic_bp": "Systolic BP",
  "extract.field_heart_rate": "Heart rate",
  "extract.field_prior_mi": "Prior MI",
  "extract.field_known_cad": "Known CAD",
  "extract.field_cv_risk": "CV risk factors",
  "extract.field_no_cardiac_meds": "No current cardiac meds",
  "extract.field_med_summary": "Medication summary",

  // Field editing
  "extract.edited_badge": "Edited",
  "extract.diff_ai_prefix": "AI:",
  "extract.diff_final_prefix": "→ Final:",
  "extract.evidence_ai_note": "Evidence belongs to AI value",
  "extract.evidence_footer": "Evidence links extracted fields to the original narrative for physician review.",

  // Sections: Conflicts, Unmapped, Warnings
  "extract.conflicts_heading": "Possible Conflicts",
  "extract.unmapped_heading": "Unmapped Signals",
  "extract.warnings_heading": "Warnings",

  // Critical unconfirmed
  "extract.critical_warning": "Soficca may return \"Needs More Info\" if required fields remain unconfirmed.",

  // Buttons
  "extract.run_routing_button": "Run Soficca routing with confirmed input →",
  "extract.back_button": "← Back to intake",

  // Sidebar: Extraction confirmation
  "extract.confirmation_title": "Extraction confirmation",
  "extract.total_fields": "Total fields",
  "extract.fields_edited": "Fields edited",
  "extract.still_unconfirmed": "Still unconfirmed",
  "extract.ready_for_routing": "Ready for routing",
  "extract.ready_yes": "Yes",

  // Sidebar: Confidence
  "extract.confidence_title": "AI extraction confidence",
  "extract.confidence_high": "High confidence",
  "extract.confidence_moderate": "Moderate confidence",
  "extract.confidence_low": "Low confidence",

  // Sidebar: Model
  "extract.model_title": "Extraction model",
  "extract.model_ai": "AI extraction",
  "extract.model_mock": "Mock fallback",

  // Shared editor labels
  "extract.option_yes": "Yes",
  "extract.option_no": "No",
  "extract.option_unconfirmed": "Unconfirmed",

  // ── Report screen ─────────────────────────────────────────────────
  "report.no_report": "No report available.",
  "report.section_label": "Soficca Decision Report",
  "report.case_prefix": "Case",

  // Source labels
  "report.source_backend": "Real deterministic backend",
  "report.source_ai_ext": "real AI extraction",
  "report.source_mock_ext": "mock extraction",
  "report.source_corrected": "human-corrected",
  "report.source_mock_fallback": "Mock fallback · backend unavailable or not connected",

  // Status row
  "report.status_label": "Status:",
  "report.type_label": "Type:",
  "report.review_label": "Human review:",
  "report.review_always": "Always required",

  // Structured summary
  "report.summary_heading": "Structured summary for review",
  "report.summary_disclaimer": "AI-generated summary of extracted facts only. Not a diagnosis, treatment recommendation, or routing decision.",
  "report.summary_corrected_note": "Summary generated from original AI extraction. Final routing used confirmed structured input.",

  // Decision reasoning
  "report.reasoning_heading": "Decision Reasoning",
  "report.why_this": "Why this route",
  "report.why_not": "Why not other routes",
  "report.decisive_inputs": "Decisive inputs",
  "report.edited_tag": "· edited",
  "report.unconfirmed_inputs": "Unconfirmed routing inputs",

  // Required actions
  "report.actions_heading": "Required Actions",

  // Intake completion notes
  "report.intake_checked_heading": "Routing inputs checked",
  "report.required_fields": "Required routing fields",
  "report.optional_context": "Optional clinical context",
  "report.unconfirmed_fields": "Unconfirmed extracted fields",
  "report.intake_questions": "Suggested intake questions",
  "report.intake_questions_disclaimer": "Questions are generated to complete structured intake. They are not clinical advice.",

  // Safety override check
  "report.safety_heading": "Safety override check",
  "report.safety_status": "Safety status",
  "report.safety_action": "Safety action",
  "report.red_flags": "Red flags",
  "report.red_flags_none": "None",
  "report.override_applied": "Safety override applied",
  "report.override_yes": "Yes",
  "report.override_no": "No",
  "report.active_triggers": "Active triggers:",
  "report.safety_policy": "Safety policy:",

  // Missing / Flags / Conflicts / Rules
  "report.missing_fields_heading": "Missing required routing fields",
  "report.flags_heading": "Flags",
  "report.conflicts_heading": "Conflicts Detected",
  "report.rules_heading": "Activated Rules",
  "report.rules_empty": "No rules activated — routing deferred.",

  // Report integrity
  "report.integrity_heading": "Report Integrity",
  "report.integrity_policy": "Policy version included",
  "report.integrity_ruleset": "Ruleset version included",
  "report.integrity_engine": "Engine version included",
  "report.integrity_rules": "Activated rules included",
  "report.integrity_review": "Human review required",
  "report.integrity_no_dx": "No diagnosis generated",
  "report.integrity_no_rx": "No prescription generated",

  // Audit trace
  "report.trace_label": "Audit Trace",
  "report.trace_heading": "Governed Trace · Deterministic Routing Evidence",
  "report.trace_preliminary": "Preliminary routing rule evaluated",
  "report.trace_final": "Final route after safety policy",
  "report.trace_override": "Safety override reason",
  "report.trace_rules": "Activated rules",
  "report.trace_triggered": "Rules triggered",
  "report.trace_conflicts": "Conflicts detected",
  "report.trace_uncertainty": "Uncertainty notes",
  "report.trace_none": "None",
  "report.trace_policy": "Policy trace",
  "report.trace_evaluated": "Evaluated",
  "report.trace_policies_suffix": "policies",
  "report.trace_triggered_label": "Triggered",
  "report.trace_json": "Full JSON preview",

  // Sidebar: Signal chain
  "report.signal_chain": "Signal chain",
  "report.chain_ai": "1. AI extraction",
  "report.chain_confirm": "2. Human confirmation",
  "report.chain_edits": "3. Human edits",
  "report.chain_routing": "4. Soficca routing",
  "report.chain_physician": "5. Physician review",
  "report.chain_completed": "Completed",
  "report.chain_mock": "Mock fallback",
  "report.chain_yes_prefix": "Yes ·",
  "report.chain_fields_suffix": "fields",
  "report.chain_none": "None",
  "report.chain_deterministic": "Deterministic backend",
  "report.chain_pending": "Pending",

  // Sidebar: Human-corrected extraction
  "report.correction_heading": "Human-corrected extraction",
  "report.correction_fields_edited": "Fields edited:",
  "report.correction_ai_value": "AI value:",
  "report.correction_final_value": "Final value:",
  "report.correction_none": "No human edits applied before routing.",

  // Sidebar: AI extraction quality
  "report.quality_heading": "AI extraction quality",
  "report.quality_confidence": "Confidence",
  "report.quality_high": "High",
  "report.quality_moderate": "Moderate",
  "report.quality_low": "Low",
  "report.quality_evidence": "Field evidence",
  "report.quality_fields_suffix": "fields",
  "report.quality_flags": "Quality flags",
  "report.quality_pii_heading": "PII warning",
  "report.quality_pii_text": "Possible identifier detected. Remove or anonymize before storing or sharing.",
  "report.quality_disclaimer": "AI extraction may be incomplete or incorrect. Human review is required before clinical use.",

  // Quality flag labels
  "report.flag_low_confidence": "Low confidence",
  "report.flag_critical_missing": "Critical missing fields",
  "report.flag_contradictory": "Contradictory narrative",
  "report.flag_limited_vitals": "Limited vitals",
  "report.flag_med_unclear": "Medication unclear",
  "report.flag_cv_unclear": "CV history unclear",
  "report.flag_requires_confirmation": "Requires confirmation",
  "report.flag_pii_detected": "PII detected",

  // Sidebar: Contract versions
  "report.versions_heading": "Contract Versions",
  "report.version_engine": "Engine",
  "report.version_ruleset": "Ruleset",
  "report.version_safety": "Safety",
  "report.version_contract": "Contract",

  // Sidebar: Export
  "report.export_heading": "Export",
  "report.export_downloaded": "Downloaded!",
  "report.export_audit_json": "Export Audit JSON",
  "report.export_audit_md": "Export Audit Markdown",
  "report.export_copied": "Copied!",
  "report.export_copy_json": "Copy Engine Report JSON",
  "report.export_copy_md": "Copy Report Markdown",
  "report.export_reviewer_queued": "Already in reviewer queue",
  "report.export_reviewer_sent": "Sent to Reviewer",
  "report.export_reviewer_send": "Send to Reviewer",
  "report.export_reviewer_unavailable": "Send to Reviewer · unavailable",
  "report.export_pii_warning": "Possible identifier detected. Remove or anonymize before exporting or sharing.",
  "report.export_disclaimer": "Audit export includes AI extraction, human edits, final engine input, Soficca report, and trace. Local export only.",

  // Sidebar: Database persistence
  "report.persist_heading": "Database Persistence",
  "report.persist_save": "Save Case to Database",
  "report.persist_saving": "Saving...",
  "report.persist_saved": "Saved to database",
  "report.persist_exists": "Already exists in database",
  "report.persist_retry": "Retry Save to Database",
  "report.persist_disclaimer": "Database persistence is backend-mediated. No database secrets are stored in the frontend. Simulated/anonymized cases only.",

  // Sidebar: Audit record preview
  "report.audit_preview": "Audit record preview",
  "report.audit_id": "Audit ID",
  "report.audit_case_id": "Case ID",
  "report.audit_extraction": "AI extraction",
  "report.audit_routing": "Routing",
  "report.audit_edits": "Human edits",
  "report.audit_fields_suffix": "fields",
  "report.audit_none": "None",
  "report.audit_final_route": "Final route",
  "report.audit_checklist": "Integrity checklist",
  "report.audit_check_policy": "Policy version",
  "report.audit_check_ruleset": "Ruleset version",
  "report.audit_check_engine": "Engine version",
  "report.audit_check_rules": "Activated rules",
  "report.audit_check_trace": "Audit trace",
  "report.audit_check_review": "Human review required",
  "report.audit_check_no_dx": "No diagnosis generated",
  "report.audit_check_no_rx": "No prescription generated",
  "report.audit_check_no_ai": "AI did not decide route",

  // Sidebar: Pilot mode
  "report.pilot_heading": "Pilot Mode",
  "report.pilot_data": "Data",
  "report.pilot_persisted": "Persisted",
  "report.pilot_session": "Current session",
  "report.pilot_extraction": "Extraction",
  "report.pilot_ai": "AI",
  "report.pilot_mock": "Mock",
  "report.pilot_routing": "Routing",
  "report.pilot_backend": "Backend",
  "report.pilot_human_review": "Human review",
  "report.pilot_always_required": "Always required",

  // Footer
  "report.footer_disclaimer": "Route generated from confirmed structured input. AI extraction may be incomplete or incorrect. Human review is required before clinical use. Soficca does not diagnose, prescribe, or replace clinical judgment. This report structures symptoms and safety-routing signals for human clinical review.",
  "report.new_case_button": "← Start new case",

  // Shared value labels
  "report.value_unconfirmed": "Unconfirmed",
  "report.value_yes": "Yes",
  "report.value_no": "No",

  // Urgency badge display labels
  "report.urgency_ROUTINE": "Routine",
  "report.urgency_URGENT": "Urgent",
  "report.urgency_EMERGENCY": "Emergency",
  "report.urgency_INFO": "Needs Info",
  "report.urgency_DEFERRED": "Deferred",

  // Decision type display labels
  "report.decisionType_ROUTINE_REVIEW": "Routine review",
  "report.decisionType_URGENT_ESCALATION": "Same-day urgent review",
  "report.decisionType_EMERGENCY_ROUTE": "Emergency escalation",
  "report.decisionType_NEEDS_MORE_INFO": "Needs more information",
  "report.decisionType_DEFERRED_PENDING_DATA": "Deferred — pending data",

  // Safety status display labels
  "report.safetyStatus_CLEAR": "Clear",
  "report.safetyStatus_TRIGGERED": "Triggered",

  // Safety action display labels
  "report.safetyAction_NONE": "None",
  "report.safetyAction_OVERRIDE_TO_EMERGENCY": "Override to emergency",
  "report.safetyAction_BLOCKED": "Blocked",
  "report.safetyAction_REVIEW": "Review",

  // Persist error messages
  "report.persist_unexpected_error": "Unexpected error saving case.",
  "report.persist_connection_error": "Connection error.",

  // ── Reviewer Workspace ────────────────────────────────────────────
  "reviewer.section_label": "Physician Reviewer Workspace",
  "reviewer.heading": "Review routed cases",
  "reviewer.subtitle": "Review routed cases, assess the suggested route, and submit structured feedback.",
  "reviewer.persist_banner_saved": "Reviewer feedback is persisted for saved cases.",
  "reviewer.persist_banner_local": "Local reviewer queue. Feedback is persisted for database-backed cases.",

  // Filters
  "reviewer.filter_all": "All",
  "reviewer.filter_session": "Session",
  "reviewer.filter_pending": "Pending",
  "reviewer.filter_reviewed": "Reviewed",
  "reviewer.show_samples": "Show samples",
  "reviewer.hide_samples": "Hide samples",

  // Empty state
  "reviewer.empty_heading": "No cases sent to reviewer yet.",
  "reviewer.empty_hint": "Run a pilot case and click \"Send to Reviewer\" from the final report.",

  // Table columns
  "reviewer.col_case": "Case",
  "reviewer.col_complaint": "Complaint",
  "reviewer.col_route": "Route",
  "reviewer.col_flags": "Flags",
  "reviewer.col_edits": "Edits",
  "reviewer.col_status": "Status",
  "reviewer.col_actions": "Actions",

  // Badges & actions
  "reviewer.badge_session": "session",
  "reviewer.status_reviewed": "Reviewed",
  "reviewer.status_pending": "Pending",
  "reviewer.action_review": "Review",
  "reviewer.action_report": "Report",

  // Case detail
  "reviewer.detail_label": "Case Review & Feedback",
  "reviewer.close": "Close",
  "reviewer.detail_case": "Case",
  "reviewer.detail_route": "Route",
  "reviewer.detail_complaint": "Chief complaint",
  "reviewer.detail_flags": "Safety flags",
  "reviewer.detail_edits": "Human edits",
  "reviewer.detail_extraction": "Extraction",
  "reviewer.detail_routing": "Routing",
  "reviewer.detail_review_status": "Review status",
  "reviewer.ai_summary": "AI structured summary",

  // Audit export
  "reviewer.export_downloaded": "Downloaded!",
  "reviewer.export_audit_json": "Export Audit JSON",
  "reviewer.export_audit_md": "Export Audit Markdown",

  // Feedback form
  "reviewer.q1_heading": "1. Was the route appropriate?",
  "reviewer.q1_agree": "Agree",
  "reviewer.q1_partial": "Partially agree",
  "reviewer.q1_disagree": "Disagree",
  "reviewer.q2_heading": "2. Was the report clinically useful?",
  "reviewer.q3_heading": "3. Did Soficca surface important missing information?",
  "reviewer.q3_yes": "Yes",
  "reviewer.q3_partial": "Partially",
  "reviewer.q3_no": "No",
  "reviewer.q3_na": "Not applicable",
  "reviewer.q4_heading": "4. Were any safety flags wrong or missing?",
  "reviewer.q4_no": "No",
  "reviewer.q4_missing": "Yes, missing flag",
  "reviewer.q4_incorrect": "Yes, incorrect flag",
  "reviewer.q4_unsure": "Unsure",
  "reviewer.q5_heading": "5. Estimated review-time saved",
  "reviewer.q5_0": "0 minutes",
  "reviewer.q5_1_2": "1–2 minutes",
  "reviewer.q5_3_5": "3–5 minutes",
  "reviewer.q5_5_plus": "5+ minutes",
  "reviewer.q6_heading": "6. Would this be useful before consultation?",
  "reviewer.q6_yes": "Yes",
  "reviewer.q6_maybe": "Maybe",
  "reviewer.q6_no": "No",
  "reviewer.q7_heading": "7. Reviewer comments",
  "reviewer.q7_placeholder": "Add clinical notes, disagreement rationale, or missing context.",
  "reviewer.submit": "Submit feedback",
  "reviewer.clear_form": "Clear form",

  // Saved states
  "reviewer.saved_local": "Feedback captured locally.",
  "reviewer.saved_local_hint": "Save case to database before persisted review.",
  "reviewer.saving_feedback": "Saving reviewer feedback...",
  "reviewer.saved_db": "Reviewer feedback saved to database.",
  "reviewer.saved_error": "Database save failed — feedback retained locally.",
  "reviewer.feedback_persist_unexpected_error": "Unexpected error persisting feedback.",
  "reviewer.persisted_load_failed": "Failed to load persisted cases.",
  "reviewer.governance_disclaimer": "Physicians remain the final clinical decision-makers. Soficca does not diagnose, prescribe, or replace clinical judgment.",

  // Persisted cases
  "reviewer.persisted_label": "Persisted Cases",
  "reviewer.persisted_loading": "Loading...",
  "reviewer.persisted_refresh": "Refresh",
  "reviewer.persisted_load": "Load Persisted Cases",
  "reviewer.persisted_empty": "No additional persisted cases found. Cases already in local queue are excluded.",
  "reviewer.persisted_col_source": "Source",
  "reviewer.badge_persisted": "persisted",
  "reviewer.action_details": "Details",
  "reviewer.persisted_detail_label": "Persisted Case Detail",
  "reviewer.persisted_decision_status": "Decision status",
  "reviewer.persisted_extraction_source": "Extraction source",
  "reviewer.persisted_routing_source": "Routing source",
  "reviewer.persisted_complaint_summary": "Chief complaint summary",
  "reviewer.persisted_feedback_count": "Reviewer feedback count",
  "reviewer.persisted_audit_record": "Audit record",
  "reviewer.persisted_engine_report": "Engine report",
  "reviewer.persisted_available": "Available",
  "reviewer.persisted_disclaimer": "Persisted bundle loaded from backend. Not counted in current session metrics unless added through the current reviewer queue.",

  // Sidebar metrics
  "reviewer.metrics_heading": "Reviewer metrics",
  "reviewer.metric_session_cases": "Session cases",
  "reviewer.metric_pending": "Pending review",
  "reviewer.metric_reviewed": "Reviewed",
  "reviewer.metric_agreement": "Agreement rate",
  "reviewer.metric_usefulness": "Avg usefulness",
  "reviewer.metric_time_saved": "Avg time saved",
  "reviewer.metric_emergency": "Emergency reviewed",
  "reviewer.metric_human_edits": "With human edits",
  "reviewer.metric_audit_exports": "Audit exports available",
  "reviewer.metrics_disclaimer": "Current session metrics only. Sample cases and separately loaded persisted cases are not counted.",

  // Sidebar cards
  "reviewer.getting_started": "Getting started",
  "reviewer.getting_started_hint": "Run a pilot case through the full flow, then click \"Send to Reviewer\" in the final report to populate this queue.",
  "reviewer.governance_heading": "Governance",

  // ── Pilot Metrics Dashboard ───────────────────────────────────────
  "metrics.section_label": "Pilot Metrics Dashboard",
  "metrics.heading": "Aggregate signals from routed cases and reviewer feedback",
  "metrics.banner": "Current demo session metrics · persisted summaries available",
  "metrics.empty_heading": "No completed cases yet. Run a pilot case to populate current session metrics.",
  "metrics.empty_hint": "Audit export availability is based on completed cases with reports.",

  // Session export
  "metrics.export_heading": "Session export",
  "metrics.export_desc": "Exports the current demo session summary: processed cases, reviewer feedback, metrics, workflow signals, and governance assertions.",
  "metrics.export_hint": "Session export. Persisted session summaries available via the Persisted Pilot Session card below.",
  "metrics.export_no_cases": "Run at least one completed case to export a session summary.",
  "metrics.export_json": "Export Session JSON",
  "metrics.export_md": "Export Session Markdown",

  // Summary metric cards
  "metrics.cases_processed": "Cases processed",
  "metrics.sent_to_reviewer": "Sent to reviewer",
  "metrics.reviewed": "Reviewed",
  "metrics.pending_review": "Pending review",
  "metrics.agreement_rate": "Agreement rate",
  "metrics.avg_usefulness": "Average usefulness",
  "metrics.est_time_saved": "Estimated review-time saved",
  "metrics.audit_exports": "Audit exports available",
  "metrics.autonomous_dx": "Autonomous diagnosis events",
  "metrics.autonomous_rx": "Autonomous prescription events",
  "metrics.note_populates": "Populates after review",
  "metrics.note_reviewer_signal": "Reviewer-reported signal",
  "metrics.note_availability": "Availability, not downloads",
  "metrics.note_never_dx": "Soficca never diagnoses",
  "metrics.note_never_rx": "Soficca never prescribes",
  "metrics.reviewer_hint": "Reviewer metrics will populate after cases are reviewed.",

  // What these metrics mean
  "metrics.what_heading": "What These Metrics Mean",
  "metrics.what_desc": "The pilot measures whether Soficca consistently surfaces missing information, blocks unsafe classification, preserves traceability, and remains structured for human review.",
  "metrics.card_safety_title": "Safety coverage",
  "metrics.card_safety_body": "Percentage of cases where safety policies were evaluated and, when triggered, correctly overrode the preliminary route.",
  "metrics.card_alignment_title": "Review alignment",
  "metrics.card_alignment_body": "How often reviewers agree with the Soficca-suggested route. Higher alignment indicates routing coherence, not diagnostic accuracy.",
  "metrics.card_intake_title": "Intake quality",
  "metrics.card_intake_body": "The proportion of cases where all required clinical fields were present. Higher intake quality means fewer deferrals and better routing confidence.",
  "metrics.card_readiness_title": "Operational readiness",
  "metrics.card_readiness_body": "Whether every report includes engine version, ruleset version, safety policy version, and activated rules — the minimum for institutional auditability.",

  // AI extraction & human confirmation
  "metrics.ai_heading": "AI Extraction & Human Confirmation",
  "metrics.ai_real": "Real AI extractions",
  "metrics.ai_mock": "Mock extraction fallbacks",
  "metrics.ai_human_corrected": "Human-corrected cases",
  "metrics.ai_edited_fields": "Edited fields",
  "metrics.ai_missing_info": "Missing info surfaced",
  "metrics.ai_completion_qs": "Completion questions generated",
  "metrics.ai_quality_flags": "Cases with quality flags",
  "metrics.ai_pii_warnings": "Cases with PII warnings",

  // Route distribution
  "metrics.route_heading": "Route Distribution",
  "metrics.route_emergency": "Emergency",
  "metrics.route_urgent": "Same-day urgent",
  "metrics.route_routine": "Routine review",
  "metrics.route_needs_info": "Needs more info",
  "metrics.route_conflict": "Conflict",

  // Safety & audit signals
  "metrics.safety_heading": "Safety & Audit Signals",
  "metrics.safety_trace": "Reports with trace",
  "metrics.safety_policy": "Reports with policy version",
  "metrics.safety_ruleset": "Reports with ruleset version",
  "metrics.safety_engine": "Reports with engine version",
  "metrics.safety_rules": "Reports with activated rules",
  "metrics.safety_ai_decisions": "AI route decisions",

  // Persisted pilot session
  "metrics.persist_heading": "Persisted Pilot Session",
  "metrics.persist_desc": "Groups saved cases and reviewer feedback under a persisted pilot session. Backend-mediated persistence. No database secrets are stored in the frontend.",
  "metrics.persist_status": "Session status",
  "metrics.persist_active": "Active",
  "metrics.persist_creating": "Creating...",
  "metrics.persist_not_created": "Not created",
  "metrics.persist_session_id": "Session ID",
  "metrics.persist_label": "Label",
  "metrics.persist_cases_processed": "Cases processed in current session",
  "metrics.persist_btn_active": "Session active",
  "metrics.persist_btn_create": "Create Persisted Session",
  "metrics.persist_btn_save": "Save Session Summary",
  "metrics.persist_saving": "Saving...",
  "metrics.persist_saved": "Summary saved",
  "metrics.persist_btn_load": "Load Latest Persisted Summary",
  "metrics.persist_loading": "Loading...",
  "metrics.persist_summary_loaded": "Persisted summary loaded",
  "metrics.persist_summary_id": "Summary ID",
  "metrics.persist_generated_at": "Generated at",
  "metrics.persist_disclaimer": "Persisted summary loaded from backend. Simulated/anonymized cases only.",

  // Disclaimers
  "metrics.critical_wording": "This dashboard does not claim clinical outcome improvement. It shows the operational signals this current demo session produced.",
  "metrics.footer_disclaimer": "Soficca does not diagnose, prescribe, or replace clinical judgment. These are current session metrics. They do not represent clinical validation or outcome improvement.",

  // ── Pilot Summary ─────────────────────────────────────────────────
  "pilotSummary.section_label": "Pilot Summary",
  "pilotSummary.heading": "Governed cardiovascular triage infrastructure for physician review",
  "pilotSummary.subtitle": "AI structures the signal. Soficca governs the route. Physicians make the final decision.",
  "pilotSummary.banner": "Local-first pilot · Real AI extraction · Real deterministic routing · Database persistence available for saved cases, reviewer feedback, and session summaries",

  // Section: What the pilot demonstrates
  "pilotSummary.sec_demonstrates": "What the pilot demonstrates",
  "pilotSummary.demo_intake": "Guided cardiovascular intake from free-text narrative.",
  "pilotSummary.demo_extraction": "Real AI signal extraction with field evidence and confidence.",
  "pilotSummary.demo_confirmed": "Human-confirmed structured input before routing.",
  "pilotSummary.demo_routing": "Deterministic Soficca routing with safety policy enforcement.",
  "pilotSummary.demo_report": "Physician-reviewable governed report with audit trace.",
  "pilotSummary.demo_feedback": "Reviewer feedback loop with structured agreement capture and database persistence for saved cases.",
  "pilotSummary.demo_metrics": "Session metrics reflecting cases, routes, and reviewer signals with optional persisted summaries.",
  "pilotSummary.demo_audit": "Audit export (JSON and Markdown) for individual cases and full sessions.",
  "pilotSummary.demo_persistence": "Database persistence for saved cases, reviewer feedback, and session summaries.",

  // Section: What Soficca governs
  "pilotSummary.sec_governs": "What Soficca governs",
  "pilotSummary.gov_routing": "Routing logic — deterministic rules, not AI decisions.",
  "pilotSummary.gov_safety": "Safety policy — red-flag detection and escalation overrides.",
  "pilotSummary.gov_versioned": "Versioned ruleset and engine trace for every routed case.",
  "pilotSummary.gov_missing": "Missing information handling — deferrals when data is insufficient.",
  "pilotSummary.gov_conflict": "Conflict handling — blocks routing when inputs are contradictory.",
  "pilotSummary.gov_integrity": "Report integrity — no diagnosis, no prescription, human review required.",

  // Section: What AI does
  "pilotSummary.sec_ai_does": "What AI does",
  "pilotSummary.ai_structures": "Structures free-text narratives into clinical signals.",
  "pilotSummary.ai_evidence": "Provides field-level evidence with source text and confidence.",
  "pilotSummary.ai_summarizes": "Summarizes extracted facts for physician review.",
  "pilotSummary.ai_questions": "Suggests intake completion questions for missing data.",
  "pilotSummary.ai_flags": "Flags missing, uncertain, or potentially conflicting information.",

  // Section: What AI does not do
  "pilotSummary.sec_ai_not": "What AI does not do",
  "pilotSummary.ainot_diagnose": "Does not diagnose.",
  "pilotSummary.ainot_prescribe": "Does not prescribe.",
  "pilotSummary.ainot_route": "Does not decide the route.",
  "pilotSummary.ainot_replace": "Does not replace physician judgment.",

  // Current stage
  "pilotSummary.current_stage": "Current stage",
  "pilotSummary.cur_backend": "Local-first pilot with real backend services.",
  "pilotSummary.cur_ai": "Real AI extraction via OpenAI backend.",
  "pilotSummary.cur_routing": "Real deterministic Soficca routing engine.",
  "pilotSummary.cur_reviewer": "Reviewer workflow with database persistence for saved cases.",
  "pilotSummary.cur_summaries": "Session summaries can be persisted and loaded.",
  "pilotSummary.cur_reset": "Local queue and metrics reset on reload — persisted data remains in database.",

  // Next stage
  "pilotSummary.next_stage": "Next stage",
  "pilotSummary.nxt_pilot": "Controlled physician pilot with expanded reviewer pool.",
  "pilotSummary.nxt_aggregated": "Aggregated metrics across sessions and reviewers.",
  "pilotSummary.nxt_auth": "Authentication and access control.",
  "pilotSummary.nxt_restore": "Session restoration on page reload.",

  // Component readiness
  "pilotSummary.readiness_heading": "Component readiness",
  "pilotSummary.rdy_routing_engine": "Deterministic routing engine",
  "pilotSummary.rdy_safety_policy": "Safety policy enforcement",
  "pilotSummary.rdy_ai_extraction": "Real AI extraction (backend)",
  "pilotSummary.rdy_backend_routing": "Real deterministic backend routing",
  "pilotSummary.rdy_schema": "Structured extraction schema",
  "pilotSummary.rdy_audit_trace": "Audit trace generation",
  "pilotSummary.rdy_feedback": "Reviewer feedback workflow",
  "pilotSummary.rdy_persistence": "Database persistence (cases, feedback, summaries)",
  "pilotSummary.rdy_persisted_feedback": "Persisted reviewer feedback",
  "pilotSummary.rdy_persisted_summaries": "Persisted session summaries",
  "pilotSummary.rdy_metrics_dashboard": "Session metrics dashboard (local-derived)",
  "pilotSummary.rdy_audit_export": "Session and case audit export",
  "pilotSummary.rdy_demo_guide": "Demo guide and scenario shortcuts",
  "pilotSummary.rdy_controlled_pilot": "Controlled physician pilot",
  "pilotSummary.rdy_aggregated_metrics": "Aggregated metrics across sessions",
  "pilotSummary.rdy_auth": "Authentication / access control",
  "pilotSummary.rdy_multisite": "Multi-site deployment",

  // Status labels
  "pilotSummary.status_ready": "Ready",
  "pilotSummary.status_next": "Next stage",
  "pilotSummary.status_scope": "Out of scope",

  // Disclaimer
  "pilotSummary.disclaimer": "Soficca does not diagnose, prescribe, or replace clinical judgment. This pilot structures symptoms and safety-routing signals for human clinical review.",

  // ── Cost / Workflow Impact Dashboard ───────────────────────────────
  "costWorkflowImpact.section_label": "Operational Workflow Signals",
  "costWorkflowImpact.heading": "Operational indicators for clinical review efficiency",
  "costWorkflowImpact.subtitle": "Operational indicators related to fragmentation, routing safety, and clinical review workflow.",
  "costWorkflowImpact.caveat_important": "Important:",
  "costWorkflowImpact.caveat_body": "This pilot does not claim realized cost reduction. It reports operational signals that may inform workflow review.",
  "costWorkflowImpact.empty_heading": "Run and review cases to populate this section.",
  "costWorkflowImpact.empty_hint": "Local workflow signals appear after completed cases, reviewer sends, and reviewer feedback.",
  "costWorkflowImpact.unit_cases": "cases",

  // Why these signals matter
  "costWorkflowImpact.why_heading": "Why These Signals Matter",
  "costWorkflowImpact.why_body": "Fragmented triage creates repeated intake, delayed escalation, unnecessary escalation, weak continuity, and limited auditability. These signals indicate where governed routing may reduce operational friction before, during, and after clinical review.",

  // Impact categories
  "costWorkflowImpact.cat_fragmentation": "Fragmentation signals",
  "costWorkflowImpact.cat_escalation": "Escalation efficiency",
  "costWorkflowImpact.cat_review": "Review efficiency",
  "costWorkflowImpact.cat_governance": "Governance / audit",

  // Fragmentation signal labels
  "costWorkflowImpact.frag_missing": "Missing critical information surfaced",
  "costWorkflowImpact.frag_conflicts_blocked": "Conflicting cases blocked before routing",
  "costWorkflowImpact.frag_reconciliation": "Cases requiring reconciliation",
  "costWorkflowImpact.frag_trace": "Reports with complete trace",

  // Escalation signal labels
  "costWorkflowImpact.esc_emergency": "Emergency overrides applied",
  "costWorkflowImpact.esc_urgent": "Same-day urgent cases identified",
  "costWorkflowImpact.esc_routine": "Routine cases not unnecessarily escalated",
  "costWorkflowImpact.esc_withheld": "Needs-more-info cases withheld from unsafe classification",

  // Review signal labels
  "costWorkflowImpact.rev_time_saved": "Estimated review-time saved",
  "costWorkflowImpact.rev_prepared": "Cases prepared before consultation",
  "costWorkflowImpact.rev_human_corrected": "Cases with human-corrected extraction",
  "costWorkflowImpact.rev_agreement": "Reviewer agreement rate",

  // Governance signal labels
  "costWorkflowImpact.gov_engine": "Reports with engine version",
  "costWorkflowImpact.gov_ruleset": "Reports with ruleset version",
  "costWorkflowImpact.gov_policy": "Reports with safety policy version",
  "costWorkflowImpact.gov_rules": "Reports with activated rules",

  // Workflow model card
  "costWorkflowImpact.model_title": "Illustrative Workflow Signal Model",
  "costWorkflowImpact.model_cases_reviewed": "Cases reviewed",
  "costWorkflowImpact.model_time_per_case": "Est. time saved / case",
  "costWorkflowImpact.model_reviewed_feedback": "Reviewed cases with feedback",
  "costWorkflowImpact.model_formula": "Estimated workflow time signal = cases reviewed × reviewer-reported estimated minutes saved per case",
  "costWorkflowImpact.model_caption": "This is a workflow estimate, not a financial claim.",

  // Evidence layer
  "costWorkflowImpact.evidence_title": "Operational signal evidence layer",
  "costWorkflowImpact.evidence_routine": "Routine cases not escalated",
  "costWorkflowImpact.evidence_needs_info": "Needs-more-info routes",
  "costWorkflowImpact.evidence_conflicts": "Conflicts detected",
  "costWorkflowImpact.evidence_audit": "Reports with full audit trace",

  // Time distribution
  "costWorkflowImpact.time_title": "Reviewer-reported time-signal distribution",
  "costWorkflowImpact.time_empty": "Run and review cases to populate this section.",
  "costWorkflowImpact.time_0": "0 minutes",
  "costWorkflowImpact.time_1_2": "1–2 minutes",
  "costWorkflowImpact.time_3_5": "3–5 minutes",
  "costWorkflowImpact.time_5_plus": "5+ minutes",

  // No-claim list
  "costWorkflowImpact.noclaim_title": "What this pilot does not claim",
  "costWorkflowImpact.noclaim_dollars": "Dollar amounts saved",
  "costWorkflowImpact.noclaim_pct": "Percentage cost reduction",
  "costWorkflowImpact.noclaim_hospital": "Proven hospital savings",
  "costWorkflowImpact.noclaim_government": "Proven government savings",
  "costWorkflowImpact.noclaim_clinical": "Clinical outcome improvement",

  // Disclaimer
  "costWorkflowImpact.disclaimer": "Soficca does not diagnose, prescribe, or replace clinical judgment. These current session signals do not claim realized cost reduction, clinical validation, or outcome improvement.",

  // ── Physician Feedback Form ────────────────────────────────────────
  "physicianFeedback.back": "← Back to reviewer workspace",
  "physicianFeedback.section_label": "Physician Feedback",
  "physicianFeedback.heading": "Structured review feedback",
  "physicianFeedback.case_label": "Case:",
  "physicianFeedback.mock_banner": "Frontend mock — Feedback persistence will be added in a later stage.",

  // Q1
  "physicianFeedback.q1_heading": "1. Was the route appropriate?",
  "physicianFeedback.q1_yes": "Yes",
  "physicianFeedback.q1_partially": "Partially",
  "physicianFeedback.q1_no": "No",

  // Q2
  "physicianFeedback.q2_heading": "2. Was the report clinically useful?",
  "physicianFeedback.q2_select": "Select",

  // Q3
  "physicianFeedback.q3_heading": "3. Did Soficca surface important missing information?",
  "physicianFeedback.q3_yes": "Yes",
  "physicianFeedback.q3_partially": "Partially",
  "physicianFeedback.q3_no": "No",
  "physicianFeedback.q3_na": "Not applicable",

  // Q4
  "physicianFeedback.q4_heading": "4. Were any safety flags wrong or missing?",
  "physicianFeedback.q4_no": "No",
  "physicianFeedback.q4_missing": "Yes, missing flag",
  "physicianFeedback.q4_incorrect": "Yes, incorrect flag",
  "physicianFeedback.q4_unsure": "Unsure",

  // Q5
  "physicianFeedback.q5_heading": "5. Estimated review-time saved",
  "physicianFeedback.q5_0": "0 minutes",
  "physicianFeedback.q5_1_2": "1–2 minutes",
  "physicianFeedback.q5_3_5": "3–5 minutes",
  "physicianFeedback.q5_5_plus": "5+ minutes",

  // Q6
  "physicianFeedback.q6_heading": "6. Would this be useful before consultation?",
  "physicianFeedback.q6_yes": "Yes",
  "physicianFeedback.q6_maybe": "Maybe",
  "physicianFeedback.q6_no": "No",

  // Q7
  "physicianFeedback.q7_heading": "7. Reviewer comments",
  "physicianFeedback.q7_placeholder": "Add clinical notes, disagreement rationale, or missing context.",

  // Actions & states
  "physicianFeedback.save": "Save mock feedback",
  "physicianFeedback.clear": "Clear form",
  "physicianFeedback.saved_confirm": "Feedback captured for current session.",
  "physicianFeedback.disclaimer": "Physicians remain the final clinical decision-makers. Soficca does not diagnose, prescribe, or replace clinical judgment.",

  // ── QA Screen ──────────────────────────────────────────────────────
  "qaScreen.section_label": "Golden Scenario QA",
  "qaScreen.heading": "End-to-end scenario validation",
  "qaScreen.subtitle": "Verify the full pilot chain for each golden scenario. Mark each checklist item as you test.",

  // Category labels
  "qaScreen.cat_intake": "Intake",
  "qaScreen.cat_extraction": "AI Extraction",
  "qaScreen.cat_correction": "Human Correction",
  "qaScreen.cat_routing": "Soficca Routing",
  "qaScreen.cat_report": "Final Report",
  "qaScreen.cat_audit": "Audit Export",
  "qaScreen.cat_safety": "Safety / Governance",

  // Scenario selector status
  "qaScreen.not_run": "Not run",
  "qaScreen.checked": "checked",
  "qaScreen.passed": "passed",
  "qaScreen.has_failures": "has failures",

  // Scenario detail
  "qaScreen.scenario_label": "Scenario",
  "qaScreen.source_narrative": "Source narrative",
  "qaScreen.load_into_flow": "Load into Pilot Flow",
  "qaScreen.copy_narrative": "Copy narrative",
  "qaScreen.copied": "Copied!",
  "qaScreen.expected_fields": "Expected key fields",
  "qaScreen.expected_safety": "Expected safety:",

  // Checklist buttons
  "qaScreen.btn_pass": "P",
  "qaScreen.btn_fail": "F",

  // Sidebar metrics
  "qaScreen.sidebar_title": "Golden scenario QA",
  "qaScreen.metric_tested": "Scenarios tested",
  "qaScreen.metric_passed": "Scenarios fully passed",
  "qaScreen.metric_items_passed": "Checklist items passed",
  "qaScreen.metric_failed": "Failed items",
  "qaScreen.metric_untested": "Untested items",
  "qaScreen.metric_dx": "Autonomous diagnosis events",
  "qaScreen.metric_rx": "Autonomous prescription events",
  "qaScreen.sidebar_disclaimer": "Manual QA session only. Scenario checklist results remain local and are not persisted.",
  "qaScreen.failed_heading": "Failed items",

  // Manual test steps
  "qaScreen.manual_heading": "Manual test steps",
  "qaScreen.step_1": "Load or copy scenario narrative",
  "qaScreen.step_2": "Navigate to Pilot Flow → Intake",
  "qaScreen.step_3": "Paste narrative and run AI extraction",
  "qaScreen.step_4": "Review extracted fields, optionally edit one",
  "qaScreen.step_5": "Confirm and run Soficca routing",
  "qaScreen.step_6": "Verify final route matches expected",
  "qaScreen.step_7": "Check report sections and signal chain",
  "qaScreen.step_8": "Export Audit JSON and Markdown",
  "qaScreen.step_9": "Return here and mark checklist items",

  // QA scope
  "qaScreen.scope_heading": "QA scope",
  "qaScreen.scope_body": "This QA validates end-to-end scenario flow, not clinical outcomes. Route matching confirms deterministic engine behavior against predefined demo scenarios. No clinical validation, safety proof, or outcome measurement is claimed.",

  // ── Demo Guide ─────────────────────────────────────────────────────
  "demoGuide.section_label": "Demo Guide",
  "demoGuide.heading": "Guided demo script for advisors, physicians, and stakeholders",
  "demoGuide.banner": "Local-first demo · Real AI extraction · Real routing · Database persistence available",

  // Suggested opening
  "demoGuide.opening_heading": "Suggested opening",
  "demoGuide.opening_quote": "Soficca is the governed decision layer underneath clinical workflows. In this pilot, AI structures messy cardiovascular narratives, humans confirm the structured signal, and Soficca applies deterministic safety routing.",

  // Demo objective
  "demoGuide.objective_heading": "Demo objective",
  "demoGuide.objective_body": "Show how Soficca converts free-text cardiovascular narratives into structured signals, allows human confirmation, applies deterministic routing, generates an auditable report, sends a case to reviewer, captures feedback, and exports session metrics.",

  // 3-minute flow
  "demoGuide.flow_heading": "Recommended 3-minute demo flow",
  "demoGuide.flow_1": "Start with the Welcome / Pilot Flow.",
  "demoGuide.flow_2": "Load the Emergency red-flag golden scenario.",
  "demoGuide.flow_3": "Show guided intake signals and completeness.",
  "demoGuide.flow_4": "Run real AI extraction.",
  "demoGuide.flow_5": "Show structured summary, field evidence, missing info, and completion questions.",
  "demoGuide.flow_6": "Edit one field to demonstrate human confirmation.",
  "demoGuide.flow_7": "Run Soficca deterministic routing.",
  "demoGuide.flow_8": "Show final report, signal chain, human correction status, and audit trace.",
  "demoGuide.flow_9": "Send case to Reviewer.",
  "demoGuide.flow_10": "Submit reviewer feedback.",
  "demoGuide.flow_11": "Open Metrics and show current session metrics.",
  "demoGuide.flow_12": "Export session summary or case audit record.",

  // Core message
  "demoGuide.core_heading": "Core message",
  "demoGuide.core_quote": "AI structures the signal. The human confirms the extraction. Soficca applies deterministic safety routing. The physician remains the final decision-maker.",

  // What not to claim
  "demoGuide.noclaim_heading": "What not to claim",
  "demoGuide.noclaim_1": "Do not claim clinical validation.",
  "demoGuide.noclaim_2": "Do not claim improved outcomes.",
  "demoGuide.noclaim_3": "Do not claim realized cost reduction.",
  "demoGuide.noclaim_4": "Do not claim AI diagnoses or decides route.",
  "demoGuide.noclaim_5": "Do not use real identifiable patient data.",

  // Golden scenario shortcuts
  "demoGuide.shortcuts_heading": "Golden scenario shortcuts",
  "demoGuide.shortcuts_hint": "Use simulated scenarios only. Loads narrative into Pilot Flow intake.",
  "demoGuide.loaded_prefix": "Loaded:",
  "demoGuide.loaded_suffix": "navigate to Pilot Flow",

  // Phase labels
  "demoGuide.phase_before": "Before demo",
  "demoGuide.phase_during": "During demo",
  "demoGuide.phase_after": "After demo",

  // Checklist — Before
  "demoGuide.ck_backend": "Backend running (local port 8000 or deployed URL)",
  "demoGuide.ck_frontend": "Frontend running (local or Vercel)",
  "demoGuide.ck_openai": "OPENAI_API_KEY configured in backend environment",
  "demoGuide.ck_db": "DATABASE_URL configured on backend (for persistence)",
  "demoGuide.ck_ai_extraction": "Real AI extraction working",
  "demoGuide.ck_backend_routing": "Real deterministic backend routing working",
  "demoGuide.ck_reviewer_empty": "Reviewer queue empty or reset",
  "demoGuide.ck_metrics_reset": "Metrics session reset or ready",
  "demoGuide.ck_simulated": "Use simulated / anonymized cases only",
  "demoGuide.ck_no_clinical": "No clinical validation claims",

  // Checklist — During
  "demoGuide.ck_intake": "Show guided intake",
  "demoGuide.ck_extraction": "Show AI extraction",
  "demoGuide.ck_correction": "Show human correction",
  "demoGuide.ck_routing": "Show Soficca routing",
  "demoGuide.ck_report": "Show audit report",
  "demoGuide.ck_reviewer": "Send to reviewer",
  "demoGuide.ck_feedback": "Submit reviewer feedback",
  "demoGuide.ck_metrics": "Show metrics",
  "demoGuide.ck_export": "Export session summary",

  // Checklist — After
  "demoGuide.ck_af_audit": "Export audit JSON / Markdown if useful",
  "demoGuide.ck_af_session": "Export session summary if useful",
  "demoGuide.ck_af_persist_session": "Create persisted session (Metrics Dashboard)",
  "demoGuide.ck_af_persist_case": "Save case to database",
  "demoGuide.ck_af_persist_feedback": "Persist reviewer feedback",
  "demoGuide.ck_af_persist_summary": "Save session summary to backend",
  "demoGuide.ck_af_persist_load": "Load persisted summary / cases",
  "demoGuide.ck_af_reset": "Reset current demo session if needed",

  // Sidebar — Demo mode status
  "demoGuide.status_heading": "Demo mode status",
  "demoGuide.status_data_mode": "Data mode",
  "demoGuide.status_data_value": "Local / session only",
  "demoGuide.status_ai": "AI extraction",
  "demoGuide.status_ai_value": "Real backend AI · fallback available",
  "demoGuide.status_routing": "Routing",
  "demoGuide.status_routing_value": "Real deterministic backend · fallback available",
  "demoGuide.status_reviewer": "Reviewer queue",
  "demoGuide.status_reviewer_value": "Local · feedback persisted for saved cases",
  "demoGuide.status_metrics": "Metrics",
  "demoGuide.status_metrics_value": "Local-derived · persisted summaries available",
  "demoGuide.status_persistence": "Persistence",
  "demoGuide.status_persistence_value": "Cases, feedback, sessions, summaries",
  "demoGuide.status_clinical": "Clinical claims",
  "demoGuide.status_clinical_value": "Not validated",

  // Sidebar — Session snapshot
  "demoGuide.snapshot_heading": "Current session snapshot",
  "demoGuide.snapshot_processed": "Cases processed",
  "demoGuide.snapshot_sent": "Sent to reviewer",
  "demoGuide.snapshot_reviewed": "Reviewed",
  "demoGuide.snapshot_pending": "Pending review",

  // Sidebar — Demo outputs
  "demoGuide.outputs_heading": "Demo outputs",
  "demoGuide.output_audit_json": "Case audit JSON",
  "demoGuide.output_audit_md": "Case audit Markdown",
  "demoGuide.output_session_json": "Session summary JSON",
  "demoGuide.output_session_md": "Session summary Markdown",
  "demoGuide.output_feedback": "Reviewer feedback summary",
  "demoGuide.output_metrics": "Local metrics dashboard",
  "demoGuide.outputs_disclaimer": "Exports are local files generated in the browser. No session data is persisted in Stage 2B.9.",

  // Sidebar — Reset
  "demoGuide.reset_heading": "Reset local demo session",
  "demoGuide.reset_desc": "Clears local demo cases, reviewer feedback, and session metrics. Does not affect backend code or saved files.",
  "demoGuide.reset_note": "Local reset only. No backend data is deleted.",
  "demoGuide.reset_btn": "Reset current demo session",
  "demoGuide.reset_confirm": "Confirm reset — clears all current session data",
  "demoGuide.reset_cancel": "Cancel",

  // Disclaimer
  "demoGuide.disclaimer": "This demo does not claim clinical validation, outcome improvement, or realized cost reduction. Soficca does not diagnose, prescribe, or replace clinical judgment.",

  // ── Page-level loading / error states ──────────────────────────────
  "page.extracting": "Running AI signal extraction...",
  "page.extraction_timeout": "Live AI extraction timed out",
  "page.extraction_unavailable": "Live AI extraction unavailable",
  "page.extraction_failed": "Live AI extraction failed",
  "page.mock_fallback": "showing mock fallback.",
  "page.retried": "retried",
  "page.retry_extraction": "Retry live extraction",
  "page.routing": "Running Soficca deterministic routing...",
  "page.backend_unavailable": "Backend unavailable",
  "page.mock_report_fallback": "showing mock report fallback.",

  // ── Example case cards ─────────────────────────────────────────────
  "exampleCase.NEEDS_MORE_INFO.label": "Missing information",
  "exampleCase.NEEDS_MORE_INFO.description": "Incomplete clinical data requiring additional fields",
  "exampleCase.NEEDS_MORE_INFO.route": "Needs More Info",
  "exampleCase.NEEDS_MORE_INFO.narrative": "62-year-old patient presents with chest pain. Denies shortness of breath and syncope. Blood pressure 124/78, heart rate 80 bpm. Not currently on cardiac medications.",

  "exampleCase.ROUTINE_REVIEW.label": "Routine review",
  "exampleCase.ROUTINE_REVIEW.description": "Stable presentation appropriate for routine cardiology follow-up",
  "exampleCase.ROUTINE_REVIEW.route": "Routine Review",
  "exampleCase.ROUTINE_REVIEW.narrative": "60-year-old patient with low-grade pressure-like chest pain lasting 15 minutes. No radiation, no exertional component, no diaphoresis. Denies dyspnea and syncope. BP 122/76, HR 78. No known CAD, no prior MI. One cardiovascular risk factor. Not on cardiac medications. Pain is mild and non-exertional.",

  "exampleCase.URGENT_ESCALATION.label": "Same-day urgent review",
  "exampleCase.URGENT_ESCALATION.description": "Risk pattern requiring urgent same-day clinical escalation",
  "exampleCase.URGENT_ESCALATION.route": "Same-Day Urgent Review",
  "exampleCase.URGENT_ESCALATION.narrative": "63-year-old patient with moderate pressure-like chest pain for 20 minutes, radiating to the jaw. The pain occurs with exertion. No diaphoresis. Denies dyspnea and syncope. BP 126/82, HR 88. No known CAD. One cardiovascular risk factor. Not on cardiac medications.",

  "exampleCase.EMERGENCY_ROUTE.label": "Emergency red-flag",
  "exampleCase.EMERGENCY_ROUTE.description": "Hard red-flag criteria requiring immediate emergency escalation",
  "exampleCase.EMERGENCY_ROUTE.route": "Emergency Red Flag",
  "exampleCase.EMERGENCY_ROUTE.narrative": "64-year-old patient with severe pressure-like chest pain for 10 minutes radiating to the left arm. Patient experienced syncope during the episode. No dyspnea reported. BP 120/74, HR 96. No known CAD. Not on cardiac medications.",

  "exampleCase.DEFERRED_PENDING_DATA.label": "Conflicting data",
  "exampleCase.DEFERRED_PENDING_DATA.description": "Contradictory clinical inputs requiring reconciliation",
  "exampleCase.DEFERRED_PENDING_DATA.route": "Conflicting Data",
  "exampleCase.DEFERRED_PENDING_DATA.narrative": "59-year-old patient denies chest pain, but describes crushing pain for 20 minutes with jaw radiation and high severity. Reports exertional chest pain despite denying chest pain presence. No dyspnea, no syncope. BP 122/80, HR 84. No known CAD. Not on cardiac medications.",

  // Signal preview tags
  "signal.age": "age",
  "signal.chest_pain": "chest pain",
  "signal.vitals": "vitals",
  "signal.meds": "meds",
  "signal.duration": "duration",
  "signal.character": "character",
  "signal.history": "history",
  "signal.radiation": "radiation",
  "signal.exertional": "exertional",
  "signal.severity": "severity",
  "signal.syncope": "syncope",
  "signal.contradictions": "contradictions",

  // ── Golden scenarios ──────────────────────────────────────────────
  "goldenScenario.gs_emergency.label": "Emergency red flag",
  "goldenScenario.gs_urgent.label": "Same-day urgent review",
  "goldenScenario.gs_routine.label": "Routine review",
  "goldenScenario.gs_needs_info.label": "Needs more information",
  "goldenScenario.gs_conflict.label": "Conflicting data",

  // ── Route labels (report-helpers) ──────────────────────────────────
  "routeLabel.none": "No route determined",
  "routeLabel.PATH_EMERGENCY_NOW": "Emergency — Immediate escalation",
  "routeLabel.PATH_URGENT_SAME_DAY": "Urgent — Same-day review",
  "routeLabel.PATH_ROUTINE": "Routine — Scheduled follow-up",
  "routeLabel.PATH_MORE_QUESTIONS": "Pending — More information needed",
  "routeLabel.PATH_SELF_CARE": "Self-care — Home monitoring",
  "routeLabel.PATH_ESCALATE_HUMAN": "Escalate — Human review required",

  // ── Status labels ──────────────────────────────────────────────────
  "statusLabel.DECIDED": "Decided",
  "statusLabel.NEEDS_MORE_INFO": "Needs more information",
  "statusLabel.CONFLICT": "Conflict detected",
  "statusLabel.ESCALATED": "Escalated",

  // ── Why this route ─────────────────────────────────────────────────
  "whyRoute.needs_info": "Critical clinical inputs were missing, so deterministic routing was withheld.",
  "whyRoute.conflict": "Contradictory inputs blocked deterministic classification.",
  "whyRoute.emergency": "Emergency red-flag criteria were triggered under the active safety policy.",
  "whyRoute.urgent": "Urgent escalation thresholds were met after deterministic rule evaluation.",
  "whyRoute.routine": "No emergency or urgent cluster was detected after deterministic rule evaluation.",
  "whyRoute.default": "Route determined by deterministic Soficca policy evaluation.",

  // ── Why not selected ───────────────────────────────────────────────
  "whyNot.needs_info.route1": "Routine / Urgent",
  "whyNot.needs_info.reason1": "A safe route cannot be selected until required fields are complete.",
  "whyNot.needs_info.route2": "Emergency",
  "whyNot.needs_info.reason2": "Emergency override was not triggered by safety policy.",
  "whyNot.conflict.route1": "Emergency / Routine",
  "whyNot.conflict.reason1": "The case requires reconciliation before safe classification.",
  "whyNot.emergency.route1": "Routine",
  "whyNot.emergency.reason1": "Routine review is not selected when emergency red flags are present.",
  "whyNot.emergency.route2": "Needs more info",
  "whyNot.emergency.reason2": "Missing information does not override emergency safety escalation when red-flag criteria are active.",
  "whyNot.urgent.route1": "Emergency",
  "whyNot.urgent.reason1": "No active emergency safety override was applied.",
  "whyNot.urgent.route2": "Routine",
  "whyNot.urgent.reason2": "Urgent escalation thresholds were met, precluding routine classification.",
  "whyNot.routine.route1": "Urgent",
  "whyNot.routine.reason1": "Urgent escalation thresholds were not met.",
  "whyNot.routine.route2": "Emergency",
  "whyNot.routine.reason2": "No active emergency safety trigger was present.",

  // ── Evidence labels ────────────────────────────────────────────────
  "evidence.age": "Age",
  "evidence.chest_pain_present": "Chest pain present",
  "evidence.pain_duration_minutes": "Pain duration",
  "evidence.pain_character": "Pain character",
  "evidence.pain_severity": "Pain severity",
  "evidence.pain_radiation": "Pain radiation",
  "evidence.exertional_chest_pain": "Exertional chest pain",
  "evidence.diaphoresis": "Diaphoresis",
  "evidence.dyspnea": "Dyspnea",
  "evidence.syncope": "Syncope",
  "evidence.systolic_bp": "Systolic BP",
  "evidence.heart_rate": "Heart rate",
  "evidence.prior_mi": "Prior MI",
  "evidence.known_cad": "Known CAD",
  "evidence.cv_risk_factors_count": "CV risk factors",
  "evidence.current_meds_none": "Current cardiac meds",
  "evidence.value_yes": "Yes",
  "evidence.value_no": "No",
  "evidence.value_none_reported": "None reported",
  "evidence.value_taking_meds": "Taking medications",

  // ── Mock report visible content ────────────────────────────────────
  "mockReport.NEEDS_MORE_INFO.summary": "Critical cardio fields missing; safe routing deferred.",
  "mockReport.NEEDS_MORE_INFO.action1": "Collect all listed missing critical fields and resubmit.",
  "mockReport.NEEDS_MORE_INFO.note1": "Critical cardio fields missing; triage logic not executed.",

  "mockReport.ROUTINE_REVIEW.summary": "Stable complete case; routine review indicated by deterministic rules.",
  "mockReport.ROUTINE_REVIEW.action1": "Schedule routine cardiology review.",
  "mockReport.ROUTINE_REVIEW.reason1": "No emergency or urgent cluster detected in complete case.",

  "mockReport.URGENT_ESCALATION.summary": "Urgent same-day review indicated by deterministic risk rule(s).",
  "mockReport.URGENT_ESCALATION.action1": "Arrange same-day clinical escalation pathway.",
  "mockReport.URGENT_ESCALATION.reason1": "Exertional chest pain with arm/jaw radiation.",

  "mockReport.EMERGENCY_ROUTE.summary": "Hard emergency red-flag criteria met; emergency route required.",
  "mockReport.EMERGENCY_ROUTE.action1": "Initiate immediate emergency escalation protocol.",
  "mockReport.EMERGENCY_ROUTE.override": "Hard red-flag emergency criteria met.",

  "mockReport.DEFERRED_PENDING_DATA.summary": "Conflicting structured cardio inputs detected; safe routing deferred.",
  "mockReport.DEFERRED_PENDING_DATA.action1": "Reconcile contradictory chest-pain fields.",
  "mockReport.DEFERRED_PENDING_DATA.action2": "Reconfirm symptom presence, severity, and related attributes.",
  "mockReport.DEFERRED_PENDING_DATA.note1": "Conflicting structured inputs detected.",

  // ── Intake guidance — signal labels ────────────────────────────────
  "intakeSignal.age": "Age",
  "intakeSignal.chest_pain": "Chest pain presence",
  "intakeSignal.duration": "Pain duration",
  "intakeSignal.character": "Pain character",
  "intakeSignal.severity": "Pain severity",
  "intakeSignal.radiation": "Pain radiation",
  "intakeSignal.exertional": "Exertional component",
  "intakeSignal.dyspnea": "Dyspnea",
  "intakeSignal.syncope": "Syncope",
  "intakeSignal.diaphoresis": "Diaphoresis",
  "intakeSignal.bp": "Blood pressure",
  "intakeSignal.hr": "Heart rate",
  "intakeSignal.cad_mi": "Known CAD / prior MI",
  "intakeSignal.cv_risk": "Cardiovascular risk factors",
  "intakeSignal.meds": "Current medications",

  // ── Intake guidance — signal group labels ──────────────────────────
  "intakeGroup.patient": "Patient / context",
  "intakeGroup.complaint": "Presenting complaint",
  "intakeGroup.red_flags": "Associated symptoms / red flags",
  "intakeGroup.vitals": "Vitals",
  "intakeGroup.cv_history": "Cardiovascular history",
  "intakeGroup.meds": "Medication / context",

  // ── Intake guidance — completeness messages ────────────────────────
  "intakeCompleteness.strong": "Key symptoms, red flags, vitals, and medication context appear present. Some items may still need confirmation.",
  "intakeCompleteness.moderate": "Core symptoms are present, but additional context may improve extraction and review.",
  "intakeCompleteness.limited": "Consider adding duration, radiation, associated symptoms, vitals, cardiovascular history, or medications if available.",
} as const;

export type TranslationKey = keyof typeof en;
export default en;
