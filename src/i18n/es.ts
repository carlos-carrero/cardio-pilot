// ── Spanish dictionary · Header + Welcome screen ─────────────────
// Careful, neutral Latin American clinical Spanish.
// Missing keys fall back to English automatically.

import type { TranslationKey } from "./en";

const es: Partial<Record<TranslationKey, string>> = {
  // ── Header ──────────────────────────────────────────────────────
  "header.badge": "Cardio Pilot",
  "header.nav.flow": "Flujo piloto",
  "header.nav.reviewer": "Revisor",
  "header.nav.metrics": "Métricas",
  "header.nav.cost_impact": "Señales operativas",
  "header.nav.pilot_summary": "Resumen piloto",
  "header.nav.qa": "QA",
  "header.nav.demo_guide": "Guía demo",
  "header.nav.sample_report": "Ejemplo",
  "header.session.persisted": "Sesión demo persistida · activa",
  "header.session.local": "Sesión demo actual · no persistida",
  "header.mobile_toggle_label": "Alternar navegación",

  // ── Welcome screen ─────────────────────────────────────────────
  "welcome.eyebrow": "Infraestructura piloto de triaje cardiovascular",
  "welcome.headline_soficca": "Soficca",
  "welcome.headline_accent": "Cardio Pilot",
  "welcome.subtitle": "Infraestructura de triaje cardiovascular diseñada para revisión médica.",
  "welcome.mantra_ai": "La IA estructura la señal.",
  "welcome.mantra_soficca": "Soficca gobierna la clasificación.",
  "welcome.mantra_physician": "Los médicos toman la decisión final.",
  "welcome.cta_start": "Iniciar caso piloto →",
  "welcome.cta_sample": "Ver reporte de ejemplo",
  "welcome.disclaimer": "Soficca no diagnostica, ni prescribe, ni reemplaza el criterio clínico. Este piloto estructura síntomas y señales de clasificación segura para revisión clínica humana.",

  // Pipeline steps
  "welcome.step1_title": "Síntomas en texto libre",
  "welcome.step1_desc": "El médico ingresa una narrativa clínica en lenguaje natural.",
  "welcome.step2_title": "Estructuración de señales con IA",
  "welcome.step2_desc": "La IA extrae señales clínicas. No determina la clasificación.",
  "welcome.step3_title": "Clasificación determinista Soficca",
  "welcome.step3_desc": "Políticas de seguridad gobernadas y reglas versionadas determinan la ruta de clasificación.",
  "welcome.step4_title": "Revisión médica",
  "welcome.step4_desc": "Un médico revisa y confirma cada caso clasificado. La autoridad final es siempre humana.",

  // Evidence loop
  "welcome.evidence_heading": "Ciclo de evidencia del piloto",
  "welcome.evidence_signals": "Señales estructuradas",
  "welcome.evidence_route": "Clasificación versionada",
  "welcome.evidence_review": "Revisión humana",
  "welcome.evidence_ops": "Señales operativas",

  // Bottom meta tags
  "welcome.tag_deterministic": "Determinista",
  "welcome.tag_auditable": "Auditable",
  "welcome.tag_versionable": "Versionable",
  "welcome.tag_safety": "Seguridad primero",

  // ── Intake screen ──────────────────────────────────────────────
  "intake.section_label": "Ingreso de caso",
  "intake.heading": "Narrativa de síntomas cardiovasculares",
  "intake.body": "Ingrese una narrativa clínica o seleccione un caso de ejemplo. La IA estructurará la señal — no determina la clasificación clínica.",

  // Example case cards
  "intake.example_cases_label": "Casos de ejemplo",
  "intake.scenario_route_prefix": "Ruta del escenario:",
  "intake.badge_needs_info": "Requiere datos",
  "intake.badge_routine": "Rutina",
  "intake.badge_urgent": "Urgente",
  "intake.badge_emergency": "Emergencia",
  "intake.badge_conflict": "Conflicto",

  // Narrative textarea
  "intake.narrative_label": "Narrativa clínica",
  "intake.narrative_placeholder": "Describa la presentación cardiovascular. Incluya edad, síntomas, signos vitales, antecedentes y contexto relevante...",

  // Quick fields
  "intake.quick_fields_summary": "Campos rápidos estructurados opcionales",
  "intake.quick_fields_hint": "— agregar signos vitales, antecedentes coronarios o medicamentos sin reescribir la narrativa",
  "intake.quick_fields_explanation": "Estos campos se agregan al texto enviado para estructuración con IA. No reemplazan la narrativa.",
  "intake.quick_label_age": "Edad",
  "intake.quick_label_systolic_bp": "Presión sistólica",
  "intake.quick_label_heart_rate": "Frecuencia cardíaca",
  "intake.quick_label_known_cad": "Enfermedad coronaria conocida",
  "intake.quick_label_prior_mi": "Infarto previo",
  "intake.quick_label_current_meds": "Medicamentos actuales",
  "intake.quick_placeholder_age": "ej. 64",
  "intake.quick_placeholder_bp": "ej. 120",
  "intake.quick_placeholder_hr": "ej. 96",
  "intake.quick_placeholder_meds": "ej. aspirina, estatina",
  "intake.quick_option_yes": "Sí",
  "intake.quick_option_no": "No",
  "intake.structured_additions_label": "Adiciones estructuradas (se agregarán)",
  "intake.no_structured_additions": "Sin adiciones estructuradas.",

  // Prepared text preview
  "intake.prepared_text_show": "▸ Mostrar texto preparado para estructuración con IA",
  "intake.prepared_text_hide": "▾ Ocultar texto preparado para estructuración con IA",
  "intake.prepared_text_explanation": "Este es el texto exacto que se enviará al servicio de extracción con IA solo para estructuración de señales.",

  // Submit area
  "intake.pre_submit_note": "A continuación, la IA estructurará la narrativa en señales clínicas editables. Soficca no clasificará el caso hasta que usted revise o confirme la extracción.",
  "intake.submit_button": "Estructurar señal clínica →",
  "intake.using_example": "Usando:",

  // Sidebar: Intake completeness
  "intake.completeness_title": "Completitud del ingreso",
  "intake.completeness_strong": "fuerte",
  "intake.completeness_moderate": "moderada",
  "intake.completeness_limited": "limitada",
  "intake.signals_count_suffix": "señales",

  // Sidebar: Signals checklist
  "intake.signals_title": "Señales que Soficca busca",
  "intake.signal_likely": "probable",
  "intake.signals_footer": "Guía ligera de ingreso — la extracción final ocurre después de la estructuración con IA.",

  // Sidebar: Consider adding
  "intake.consider_adding_title": "Considera agregar",
  "intake.consider_adding_footer": "Estas sugerencias ayudan a completar el ingreso estructurado. No son consejo clínico.",

  // Sidebar: What happens next
  "intake.next_title": "Qué ocurre después",
  "intake.next_step1": "La IA estructura la narrativa en señales clínicas.",
  "intake.next_step2": "Usted revisa y corrige los campos extraídos.",
  "intake.next_step3": "Soficca aplica clasificación determinista.",
  "intake.next_step4": "Se genera un reporte de auditoría para revisión médica.",

  // Sidebar: Routing guidance
  "intake.routing_title": "Guía de clasificación",
  "intake.routing_body": "Para clasificar de forma determinista, Soficca necesita señales estructuradas como duración del síntoma, carácter, radiación, alertas críticas, signos vitales, antecedentes cardiovasculares y medicamentos. Si faltan datos clave, Soficca puede devolver Requiere más datos en lugar de forzar una clasificación.",

  // ── Extraction Preview screen ────────────────────────────────────
  "extract.section_label": "Revisar y confirmar extracción",
  "extract.heading": "Confirmar señales estructuradas",
  "extract.banner_text": "La IA propuso señales estructuradas. Revísalas o corrígelas antes de que Soficca clasifique el caso.",
  "extract.source_ai": "Extracción IA real · solo estructuración",
  "extract.source_mock": "Extracción de respaldo (mock)",

  // Structured summary
  "extract.summary_heading": "Resumen estructurado para revisión",
  "extract.summary_disclaimer": "Resumen generado por IA solo con hechos extraídos. No es un diagnóstico ni una decisión de clasificación.",

  // Quality flags
  "extract.flag_low_confidence": "Extracción de baja confianza",
  "extract.flag_critical_missing": "Campos críticos faltantes",
  "extract.flag_contradictory": "Narrativa contradictoria",
  "extract.flag_limited_vitals": "Signos vitales limitados",
  "extract.flag_med_unclear": "Estado de medicación poco claro",
  "extract.flag_cv_unclear": "Antecedentes cardiovasculares poco claros",
  "extract.flag_requires_confirmation": "Revisión humana requerida",
  "extract.flag_pii_detected": "Posible identificador detectado",

  // PII warnings
  "extract.pii_title": "Posible identificador detectado",
  "extract.pii_body": "Eliminar o anonimizar antes de almacenar o compartir.",

  // Missing information
  "extract.missing_heading": "Requisitos de entrada para clasificación",
  "extract.missing_required": "Requerido para clasificación",
  "extract.missing_useful": "Clínicamente útil",
  "extract.missing_unconfirmed": "Sin confirmar",

  // Completion questions
  "extract.questions_heading": "Preguntas de ingreso sugeridas",
  "extract.questions_disclaimer": "Las preguntas se generan para completar el ingreso estructurado. No son consejo clínico.",

  // Field groups
  "extract.group_patient": "Paciente / Contexto",
  "extract.group_complaint": "Motivo de consulta",
  "extract.group_symptoms": "Síntomas",
  "extract.group_vitals": "Signos vitales",
  "extract.group_cv_history": "Antecedentes cardiovasculares",
  "extract.group_medication": "Medicación / Contexto",

  // Field labels
  "extract.field_age": "Edad",
  "extract.field_chest_pain_present": "Dolor torácico presente",
  "extract.field_pain_duration": "Duración del dolor (min)",
  "extract.field_pain_character": "Carácter del dolor",
  "extract.field_pain_severity": "Severidad del dolor",
  "extract.field_pain_radiation": "Irradiación del dolor",
  "extract.field_exertional": "Dolor torácico de esfuerzo",
  "extract.field_diaphoresis": "Diaforesis",
  "extract.field_dyspnea": "Disnea",
  "extract.field_syncope": "Síncope",
  "extract.field_systolic_bp": "Presión sistólica",
  "extract.field_heart_rate": "Frecuencia cardíaca",
  "extract.field_prior_mi": "Infarto previo",
  "extract.field_known_cad": "Enfermedad coronaria conocida",
  "extract.field_cv_risk": "Factores de riesgo CV",
  "extract.field_no_cardiac_meds": "Sin medicación cardíaca actual",
  "extract.field_med_summary": "Resumen de medicación",

  // Field editing
  "extract.edited_badge": "Editado",
  "extract.diff_ai_prefix": "IA:",
  "extract.diff_final_prefix": "→ Final:",
  "extract.evidence_ai_note": "Evidencia corresponde al valor de IA",
  "extract.evidence_footer": "La evidencia vincula campos extraídos con la narrativa original para revisión médica.",

  // Sections: Conflicts, Unmapped, Warnings
  "extract.conflicts_heading": "Posibles conflictos",
  "extract.unmapped_heading": "Señales no mapeadas",
  "extract.warnings_heading": "Advertencias",

  // Critical unconfirmed
  "extract.critical_warning": "Soficca puede devolver \"Requiere más datos\" si campos requeridos permanecen sin confirmar.",

  // Buttons
  "extract.run_routing_button": "Ejecutar clasificación Soficca con entrada confirmada →",
  "extract.back_button": "← Volver al ingreso",

  // Sidebar: Extraction confirmation
  "extract.confirmation_title": "Confirmación de extracción",
  "extract.total_fields": "Total de campos",
  "extract.fields_edited": "Campos editados",
  "extract.still_unconfirmed": "Sin confirmar aún",
  "extract.ready_for_routing": "Listo para clasificación",
  "extract.ready_yes": "Sí",

  // Sidebar: Confidence
  "extract.confidence_title": "Confianza de extracción IA",
  "extract.confidence_high": "Confianza alta",
  "extract.confidence_moderate": "Confianza moderada",
  "extract.confidence_low": "Confianza baja",

  // Sidebar: Model
  "extract.model_title": "Modelo de extracción",
  "extract.model_ai": "Extracción IA",
  "extract.model_mock": "Respaldo (mock)",

  // Shared editor labels
  "extract.option_yes": "Sí",
  "extract.option_no": "No",
  "extract.option_unconfirmed": "Sin confirmar",

  // ── Report screen ─────────────────────────────────────────────────
  "report.no_report": "No hay reporte disponible.",
  "report.section_label": "Reporte de decisión Soficca",
  "report.case_prefix": "Caso",

  // Source labels
  "report.source_backend": "Motor determinista activo",
  "report.source_ai_ext": "extracción IA activa",
  "report.source_mock_ext": "extracción simulada",
  "report.source_corrected": "corrección humana",
  "report.source_mock_fallback": "Respaldo simulado · motor no disponible o no conectado",

  // Status row
  "report.status_label": "Estado:",
  "report.type_label": "Tipo:",
  "report.review_label": "Revisión humana:",
  "report.review_always": "Siempre requerida",

  // Structured summary
  "report.summary_heading": "Resumen estructurado para revisión",
  "report.summary_disclaimer": "Resumen generado por IA solo con hechos extraídos. No es un diagnóstico, recomendación de tratamiento ni decisión de clasificación.",
  "report.summary_corrected_note": "Resumen generado a partir de la extracción IA original. La clasificación final usó entrada estructurada confirmada.",

  // Decision reasoning
  "report.reasoning_heading": "Razonamiento de decisión",
  "report.why_this": "Por qué esta ruta",
  "report.why_not": "Por qué no otras rutas",
  "report.decisive_inputs": "Entradas decisivas",
  "report.edited_tag": "· editado",
  "report.unconfirmed_inputs": "Entradas de clasificación sin confirmar",

  // Required actions
  "report.actions_heading": "Acciones requeridas",

  // Intake completion notes
  "report.intake_checked_heading": "Entradas de clasificación verificadas",
  "report.required_fields": "Campos requeridos para clasificación",
  "report.optional_context": "Contexto clínico opcional",
  "report.unconfirmed_fields": "Campos extraídos sin confirmar",
  "report.intake_questions": "Preguntas de ingreso sugeridas",
  "report.intake_questions_disclaimer": "Las preguntas se generan para completar el ingreso estructurado. No son consejo clínico.",

  // Safety override check
  "report.safety_heading": "Verificación de seguridad prioritaria",
  "report.safety_status": "Estado de seguridad",
  "report.safety_action": "Acción de seguridad",
  "report.red_flags": "Alertas críticas",
  "report.red_flags_none": "Ninguna",
  "report.override_applied": "Control prioritario aplicado",
  "report.override_yes": "Sí",
  "report.override_no": "No",
  "report.active_triggers": "Activadores activos:",
  "report.safety_policy": "Política de seguridad:",

  // Missing / Flags / Conflicts / Rules
  "report.missing_fields_heading": "Campos requeridos faltantes para clasificación",
  "report.flags_heading": "Indicadores",
  "report.conflicts_heading": "Conflictos detectados",
  "report.rules_heading": "Reglas activadas",
  "report.rules_empty": "Sin reglas activadas — clasificación diferida.",

  // Report integrity
  "report.integrity_heading": "Integridad del reporte",
  "report.integrity_policy": "Versión de política incluida",
  "report.integrity_ruleset": "Versión de reglas incluida",
  "report.integrity_engine": "Versión del motor incluida",
  "report.integrity_rules": "Reglas activadas incluidas",
  "report.integrity_review": "Revisión humana requerida",
  "report.integrity_no_dx": "No se generó diagnóstico",
  "report.integrity_no_rx": "No se generó prescripción",

  // Audit trace
  "report.trace_label": "Traza de auditoría",
  "report.trace_heading": "Traza gobernada · Evidencia de clasificación determinista",
  "report.trace_preliminary": "Regla preliminar de clasificación evaluada",
  "report.trace_final": "Ruta final tras política de seguridad",
  "report.trace_override": "Razón de control prioritario de seguridad",
  "report.trace_rules": "Reglas activadas",
  "report.trace_triggered": "Reglas disparadas",
  "report.trace_conflicts": "Conflictos detectados",
  "report.trace_uncertainty": "Notas de incertidumbre",
  "report.trace_none": "Ninguno",
  "report.trace_policy": "Traza de política",
  "report.trace_evaluated": "Evaluadas",
  "report.trace_policies_suffix": "políticas",
  "report.trace_triggered_label": "Disparadas",
  "report.trace_json": "Vista previa JSON completa",

  // Sidebar: Signal chain
  "report.signal_chain": "Cadena de señales",
  "report.chain_ai": "1. Extracción IA",
  "report.chain_confirm": "2. Confirmación humana",
  "report.chain_edits": "3. Ediciones humanas",
  "report.chain_routing": "4. Clasificación Soficca",
  "report.chain_physician": "5. Revisión médica",
  "report.chain_completed": "Completado",
  "report.chain_mock": "Respaldo simulado",
  "report.chain_yes_prefix": "Sí ·",
  "report.chain_fields_suffix": "campos",
  "report.chain_none": "Ninguno",
  "report.chain_deterministic": "Motor determinista",
  "report.chain_pending": "Pendiente",

  // Sidebar: Human-corrected extraction
  "report.correction_heading": "Extracción con corrección humana",
  "report.correction_fields_edited": "Campos editados:",
  "report.correction_ai_value": "Valor IA:",
  "report.correction_final_value": "Valor final:",
  "report.correction_none": "Sin ediciones humanas antes de la clasificación.",

  // Sidebar: AI extraction quality
  "report.quality_heading": "Calidad de extracción IA",
  "report.quality_confidence": "Confianza",
  "report.quality_high": "Alta",
  "report.quality_moderate": "Moderada",
  "report.quality_low": "Baja",
  "report.quality_evidence": "Evidencia de campos",
  "report.quality_fields_suffix": "campos",
  "report.quality_flags": "Indicadores de calidad",
  "report.quality_pii_heading": "Alerta de datos personales",
  "report.quality_pii_text": "Posible identificador detectado. Eliminar o anonimizar antes de almacenar o compartir.",
  "report.quality_disclaimer": "La extracción IA puede ser incompleta o incorrecta. Se requiere revisión humana antes del uso clínico.",

  // Quality flag labels
  "report.flag_low_confidence": "Confianza baja",
  "report.flag_critical_missing": "Campos críticos faltantes",
  "report.flag_contradictory": "Narrativa contradictoria",
  "report.flag_limited_vitals": "Signos vitales limitados",
  "report.flag_med_unclear": "Medicación poco clara",
  "report.flag_cv_unclear": "Antecedentes CV poco claros",
  "report.flag_requires_confirmation": "Requiere confirmación",
  "report.flag_pii_detected": "Datos personales detectados",

  // Sidebar: Contract versions
  "report.versions_heading": "Versiones del contrato",
  "report.version_engine": "Motor",
  "report.version_ruleset": "Reglas",
  "report.version_safety": "Seguridad",
  "report.version_contract": "Contrato",

  // Sidebar: Export
  "report.export_heading": "Exportar",
  "report.export_downloaded": "¡Descargado!",
  "report.export_audit_json": "Exportar auditoría JSON",
  "report.export_audit_md": "Exportar auditoría Markdown",
  "report.export_copied": "¡Copiado!",
  "report.export_copy_json": "Copiar reporte del motor JSON",
  "report.export_copy_md": "Copiar reporte Markdown",
  "report.export_reviewer_queued": "Ya en cola de revisión",
  "report.export_reviewer_sent": "Enviado al revisor",
  "report.export_reviewer_send": "Enviar al revisor",
  "report.export_reviewer_unavailable": "Enviar al revisor · no disponible",
  "report.export_pii_warning": "Posible identificador detectado. Eliminar o anonimizar antes de exportar o compartir.",
  "report.export_disclaimer": "La exportación de auditoría incluye extracción IA, ediciones humanas, entrada final del motor, reporte Soficca y traza. Solo exportación local.",

  // Sidebar: Database persistence
  "report.persist_heading": "Persistencia en base de datos",
  "report.persist_save": "Guardar caso en base de datos",
  "report.persist_saving": "Guardando...",
  "report.persist_saved": "Guardado en base de datos",
  "report.persist_exists": "Ya existe en base de datos",
  "report.persist_retry": "Reintentar guardado en base de datos",
  "report.persist_disclaimer": "La persistencia en base de datos es mediada por el backend. No se almacenan credenciales de base de datos en el frontend. Solo casos simulados/anonimizados.",

  // Sidebar: Audit record preview
  "report.audit_preview": "Vista previa del registro de auditoría",
  "report.audit_id": "ID de auditoría",
  "report.audit_case_id": "ID de caso",
  "report.audit_extraction": "Extracción IA",
  "report.audit_routing": "Clasificación",
  "report.audit_edits": "Ediciones humanas",
  "report.audit_fields_suffix": "campos",
  "report.audit_none": "Ninguno",
  "report.audit_final_route": "Ruta final",
  "report.audit_checklist": "Lista de integridad",
  "report.audit_check_policy": "Versión de política",
  "report.audit_check_ruleset": "Versión de reglas",
  "report.audit_check_engine": "Versión del motor",
  "report.audit_check_rules": "Reglas activadas",
  "report.audit_check_trace": "Traza de auditoría",
  "report.audit_check_review": "Revisión humana requerida",
  "report.audit_check_no_dx": "No se generó diagnóstico",
  "report.audit_check_no_rx": "No se generó prescripción",
  "report.audit_check_no_ai": "La IA no decidió la ruta",

  // Sidebar: Pilot mode
  "report.pilot_heading": "Modo piloto",
  "report.pilot_data": "Datos",
  "report.pilot_persisted": "Persistido",
  "report.pilot_session": "Sesión actual",
  "report.pilot_extraction": "Extracción",
  "report.pilot_ai": "IA",
  "report.pilot_mock": "Simulado",
  "report.pilot_routing": "Clasificación",
  "report.pilot_backend": "Backend",
  "report.pilot_human_review": "Revisión humana",
  "report.pilot_always_required": "Siempre requerida",

  // Footer
  "report.footer_disclaimer": "Ruta generada a partir de entrada estructurada confirmada. La extracción IA puede ser incompleta o incorrecta. Se requiere revisión humana antes del uso clínico. Soficca no diagnostica, no prescribe ni reemplaza el juicio clínico. Este reporte estructura síntomas y señales de clasificación de seguridad para revisión clínica humana.",
  "report.new_case_button": "← Iniciar nuevo caso",

  // Shared value labels
  "report.value_unconfirmed": "Sin confirmar",
  "report.value_yes": "Sí",
  "report.value_no": "No",

  // Urgency badge display labels
  "report.urgency_ROUTINE": "Rutina",
  "report.urgency_URGENT": "Urgente",
  "report.urgency_EMERGENCY": "Emergencia",
  "report.urgency_INFO": "Requiere datos",
  "report.urgency_DEFERRED": "Diferido",

  // Decision type display labels
  "report.decisionType_ROUTINE_REVIEW": "Revisión de rutina",
  "report.decisionType_URGENT_ESCALATION": "Revisión urgente hoy",
  "report.decisionType_EMERGENCY_ROUTE": "Escalamiento de emergencia",
  "report.decisionType_NEEDS_MORE_INFO": "Requiere más datos",
  "report.decisionType_DEFERRED_PENDING_DATA": "Diferido · datos pendientes",

  // Safety status display labels
  "report.safetyStatus_CLEAR": "Sin alertas",
  "report.safetyStatus_TRIGGERED": "Activado",

  // Safety action display labels
  "report.safetyAction_NONE": "Ninguna",
  "report.safetyAction_OVERRIDE_TO_EMERGENCY": "Control prioritario a emergencia",
  "report.safetyAction_BLOCKED": "Bloqueado",
  "report.safetyAction_REVIEW": "Revisión",

  // Persist error messages
  "report.persist_unexpected_error": "Error inesperado al guardar el caso.",
  "report.persist_connection_error": "Error de conexión.",

  // ── Reviewer Workspace ────────────────────────────────────────────
  "reviewer.section_label": "Espacio de revisión médica",
  "reviewer.heading": "Revisar casos clasificados",
  "reviewer.subtitle": "Revise los casos clasificados, evalúe la ruta sugerida y envíe retroalimentación estructurada.",
  "reviewer.persist_banner_saved": "La retroalimentación del revisor se persiste para casos guardados.",
  "reviewer.persist_banner_local": "Cola de revisión local. La retroalimentación se persiste para casos respaldados en base de datos.",

  // Filters
  "reviewer.filter_all": "Todos",
  "reviewer.filter_session": "Sesión",
  "reviewer.filter_pending": "Pendientes",
  "reviewer.filter_reviewed": "Revisados",
  "reviewer.show_samples": "Mostrar ejemplos",
  "reviewer.hide_samples": "Ocultar ejemplos",

  // Empty state
  "reviewer.empty_heading": "Aún no se han enviado casos al revisor.",
  "reviewer.empty_hint": "Ejecute un caso piloto y haga clic en \"Enviar al revisor\" desde el reporte final.",

  // Table columns
  "reviewer.col_case": "Caso",
  "reviewer.col_complaint": "Motivo de consulta",
  "reviewer.col_route": "Ruta",
  "reviewer.col_flags": "Alertas",
  "reviewer.col_edits": "Ediciones",
  "reviewer.col_status": "Estado",
  "reviewer.col_actions": "Acciones",

  // Badges & actions
  "reviewer.badge_session": "sesión",
  "reviewer.status_reviewed": "Revisado",
  "reviewer.status_pending": "Pendiente",
  "reviewer.action_review": "Revisar",
  "reviewer.action_report": "Reporte",

  // Case detail
  "reviewer.detail_label": "Revisión del caso y retroalimentación",
  "reviewer.close": "Cerrar",
  "reviewer.detail_case": "Caso",
  "reviewer.detail_route": "Ruta",
  "reviewer.detail_complaint": "Motivo de consulta",
  "reviewer.detail_flags": "Alertas de seguridad",
  "reviewer.detail_edits": "Ediciones humanas",
  "reviewer.detail_extraction": "Extracción",
  "reviewer.detail_routing": "Clasificación",
  "reviewer.detail_review_status": "Estado de revisión",
  "reviewer.ai_summary": "Resumen estructurado IA",

  // Audit export
  "reviewer.export_downloaded": "¡Descargado!",
  "reviewer.export_audit_json": "Exportar auditoría JSON",
  "reviewer.export_audit_md": "Exportar auditoría Markdown",

  // Feedback form
  "reviewer.q1_heading": "1. ¿Fue apropiada la ruta?",
  "reviewer.q1_agree": "De acuerdo",
  "reviewer.q1_partial": "Parcialmente de acuerdo",
  "reviewer.q1_disagree": "En desacuerdo",
  "reviewer.q2_heading": "2. ¿Fue clínicamente útil el reporte?",
  "reviewer.q3_heading": "3. ¿Soficca identificó información faltante importante?",
  "reviewer.q3_yes": "Sí",
  "reviewer.q3_partial": "Parcialmente",
  "reviewer.q3_no": "No",
  "reviewer.q3_na": "No aplica",
  "reviewer.q4_heading": "4. ¿Hubo alertas de seguridad incorrectas o faltantes?",
  "reviewer.q4_no": "No",
  "reviewer.q4_missing": "Sí, alerta faltante",
  "reviewer.q4_incorrect": "Sí, alerta incorrecta",
  "reviewer.q4_unsure": "No estoy seguro",
  "reviewer.q5_heading": "5. Tiempo de revisión estimado ahorrado",
  "reviewer.q5_0": "0 minutos",
  "reviewer.q5_1_2": "1–2 minutos",
  "reviewer.q5_3_5": "3–5 minutos",
  "reviewer.q5_5_plus": "5+ minutos",
  "reviewer.q6_heading": "6. ¿Sería útil antes de la consulta?",
  "reviewer.q6_yes": "Sí",
  "reviewer.q6_maybe": "Quizás",
  "reviewer.q6_no": "No",
  "reviewer.q7_heading": "7. Comentarios del revisor",
  "reviewer.q7_placeholder": "Agregue notas clínicas, justificación de desacuerdo o contexto faltante.",
  "reviewer.submit": "Enviar retroalimentación",
  "reviewer.clear_form": "Limpiar formulario",

  // Saved states
  "reviewer.saved_local": "Retroalimentación capturada localmente.",
  "reviewer.saved_local_hint": "Guarde el caso en base de datos antes de la revisión persistida.",
  "reviewer.saving_feedback": "Guardando retroalimentación del revisor...",
  "reviewer.saved_db": "Retroalimentación del revisor guardada en base de datos.",
  "reviewer.saved_error": "Error al guardar en base de datos — retroalimentación retenida localmente.",
  "reviewer.feedback_persist_unexpected_error": "Error inesperado al persistir la retroalimentación.",
  "reviewer.persisted_load_failed": "No se pudieron cargar los casos persistidos.",
  "reviewer.governance_disclaimer": "Los médicos son los responsables finales de las decisiones clínicas. Soficca no diagnostica, no prescribe ni reemplaza el juicio clínico.",

  // Persisted cases
  "reviewer.persisted_label": "Casos persistidos",
  "reviewer.persisted_loading": "Cargando...",
  "reviewer.persisted_refresh": "Actualizar",
  "reviewer.persisted_load": "Cargar casos persistidos",
  "reviewer.persisted_empty": "No se encontraron casos persistidos adicionales. Los casos ya en la cola local están excluidos.",
  "reviewer.persisted_col_source": "Fuente",
  "reviewer.badge_persisted": "persistido",
  "reviewer.action_details": "Detalles",
  "reviewer.persisted_detail_label": "Detalle del caso persistido",
  "reviewer.persisted_decision_status": "Estado de decisión",
  "reviewer.persisted_extraction_source": "Fuente de extracción",
  "reviewer.persisted_routing_source": "Fuente de clasificación",
  "reviewer.persisted_complaint_summary": "Resumen del motivo de consulta",
  "reviewer.persisted_feedback_count": "Cantidad de retroalimentación",
  "reviewer.persisted_audit_record": "Registro de auditoría",
  "reviewer.persisted_engine_report": "Reporte del motor",
  "reviewer.persisted_available": "Disponible",
  "reviewer.persisted_disclaimer": "Paquete persistido cargado del backend. No se cuenta en métricas de sesión actual a menos que se agregue a la cola de revisión actual.",

  // Sidebar metrics
  "reviewer.metrics_heading": "Métricas del revisor",
  "reviewer.metric_session_cases": "Casos de sesión",
  "reviewer.metric_pending": "Revisión pendiente",
  "reviewer.metric_reviewed": "Revisados",
  "reviewer.metric_agreement": "Tasa de acuerdo",
  "reviewer.metric_usefulness": "Utilidad promedio",
  "reviewer.metric_time_saved": "Tiempo ahorrado promedio",
  "reviewer.metric_emergency": "Emergencias revisadas",
  "reviewer.metric_human_edits": "Con ediciones humanas",
  "reviewer.metric_audit_exports": "Exportaciones de auditoría disponibles",
  "reviewer.metrics_disclaimer": "Métricas de sesión actual únicamente. Los casos de ejemplo y casos persistidos cargados por separado no se cuentan.",

  // Sidebar cards
  "reviewer.getting_started": "Primeros pasos",
  "reviewer.getting_started_hint": "Ejecute un caso piloto a través del flujo completo, luego haga clic en \"Enviar al revisor\" en el reporte final para poblar esta cola.",
  "reviewer.governance_heading": "Gobernanza",

  // ── Pilot Metrics Dashboard ───────────────────────────────────────
  "metrics.section_label": "Panel de métricas del piloto",
  "metrics.heading": "Señales agregadas de casos clasificados y retroalimentación del revisor",
  "metrics.banner": "Métricas de sesión de demostración actual · resúmenes persistidos disponibles",
  "metrics.empty_heading": "Aún no hay casos completados. Ejecute un caso piloto para generar métricas de sesión.",
  "metrics.empty_hint": "La disponibilidad de exportación de auditoría se basa en casos completados con reportes.",

  // Session export
  "metrics.export_heading": "Exportación de sesión",
  "metrics.export_desc": "Exporta el resumen de sesión de demostración actual: casos procesados, retroalimentación del revisor, métricas, señales de flujo y aserciones de gobernanza.",
  "metrics.export_hint": "Exportación de sesión. Resúmenes de sesión persistidos disponibles en la tarjeta de Sesión piloto persistida a continuación.",
  "metrics.export_no_cases": "Ejecute al menos un caso completo para exportar un resumen de sesión.",
  "metrics.export_json": "Exportar sesión JSON",
  "metrics.export_md": "Exportar sesión Markdown",

  // Summary metric cards
  "metrics.cases_processed": "Casos procesados",
  "metrics.sent_to_reviewer": "Enviados al revisor",
  "metrics.reviewed": "Revisados",
  "metrics.pending_review": "Revisión pendiente",
  "metrics.agreement_rate": "Tasa de acuerdo",
  "metrics.avg_usefulness": "Utilidad promedio",
  "metrics.est_time_saved": "Tiempo de revisión estimado ahorrado",
  "metrics.audit_exports": "Exportaciones de auditoría disponibles",
  "metrics.autonomous_dx": "Eventos de diagnóstico autónomo",
  "metrics.autonomous_rx": "Eventos de prescripción autónoma",
  "metrics.note_populates": "Se completa después de la revisión",
  "metrics.note_reviewer_signal": "Señal reportada por el revisor",
  "metrics.note_availability": "Disponibilidad, no descargas",
  "metrics.note_never_dx": "Soficca nunca diagnostica",
  "metrics.note_never_rx": "Soficca nunca prescribe",
  "metrics.reviewer_hint": "Las métricas del revisor se completarán después de que se revisen los casos.",

  // What these metrics mean
  "metrics.what_heading": "Qué significan estas métricas",
  "metrics.what_desc": "El piloto mide si Soficca identifica consistentemente información faltante, bloquea clasificaciones inseguras, preserva la trazabilidad y mantiene la estructura para revisión humana.",
  "metrics.card_safety_title": "Cobertura de seguridad",
  "metrics.card_safety_body": "Porcentaje de casos donde se evaluaron las políticas de seguridad y, al activarse, anularon correctamente la ruta preliminar.",
  "metrics.card_alignment_title": "Alineación de revisión",
  "metrics.card_alignment_body": "Frecuencia con la que los revisores concuerdan con la ruta sugerida por Soficca. Mayor alineación indica coherencia de clasificación, no precisión diagnóstica.",
  "metrics.card_intake_title": "Calidad de ingreso",
  "metrics.card_intake_body": "La proporción de casos donde todos los campos clínicos requeridos estaban presentes. Mayor calidad de ingreso significa menos diferimientos y mayor confianza en la clasificación.",
  "metrics.card_readiness_title": "Preparación operacional",
  "metrics.card_readiness_body": "Si cada reporte incluye versión del motor, versión del conjunto de reglas, versión de política de seguridad y reglas activadas — el mínimo para auditabilidad institucional.",

  // AI extraction & human confirmation
  "metrics.ai_heading": "Extracción IA y confirmación humana",
  "metrics.ai_real": "Extracciones IA reales",
  "metrics.ai_mock": "Extracciones simuladas de respaldo",
  "metrics.ai_human_corrected": "Casos corregidos por humanos",
  "metrics.ai_edited_fields": "Campos editados",
  "metrics.ai_missing_info": "Información faltante identificada",
  "metrics.ai_completion_qs": "Preguntas de completitud generadas",
  "metrics.ai_quality_flags": "Casos con alertas de calidad",
  "metrics.ai_pii_warnings": "Casos con alertas de datos personales",

  // Route distribution
  "metrics.route_heading": "Distribución de rutas",
  "metrics.route_emergency": "Emergencia",
  "metrics.route_urgent": "Revisión urgente hoy",
  "metrics.route_routine": "Revisión de rutina",
  "metrics.route_needs_info": "Requiere más datos",
  "metrics.route_conflict": "Datos conflictivos",

  // Safety & audit signals
  "metrics.safety_heading": "Señales de seguridad y auditoría",
  "metrics.safety_trace": "Reportes con traza",
  "metrics.safety_policy": "Reportes con versión de política",
  "metrics.safety_ruleset": "Reportes con versión de reglas",
  "metrics.safety_engine": "Reportes con versión del motor",
  "metrics.safety_rules": "Reportes con reglas activadas",
  "metrics.safety_ai_decisions": "Decisiones de ruta IA",

  // Persisted pilot session
  "metrics.persist_heading": "Sesión piloto persistida",
  "metrics.persist_desc": "Agrupa casos guardados y retroalimentación del revisor bajo una sesión piloto persistida. Persistencia mediada por backend. No se almacenan secretos de base de datos en el frontend.",
  "metrics.persist_status": "Estado de la sesión",
  "metrics.persist_active": "Activa",
  "metrics.persist_creating": "Creando...",
  "metrics.persist_not_created": "No creada",
  "metrics.persist_session_id": "ID de sesión",
  "metrics.persist_label": "Etiqueta",
  "metrics.persist_cases_processed": "Casos procesados en sesión actual",
  "metrics.persist_btn_active": "Sesión activa",
  "metrics.persist_btn_create": "Crear sesión persistida",
  "metrics.persist_btn_save": "Guardar resumen de sesión",
  "metrics.persist_saving": "Guardando...",
  "metrics.persist_saved": "Resumen guardado",
  "metrics.persist_btn_load": "Cargar último resumen persistido",
  "metrics.persist_loading": "Cargando...",
  "metrics.persist_summary_loaded": "Resumen persistido cargado",
  "metrics.persist_summary_id": "ID del resumen",
  "metrics.persist_generated_at": "Generado el",
  "metrics.persist_disclaimer": "Resumen persistido cargado del backend. Solo casos simulados/anonimizados.",

  // Disclaimers
  "metrics.critical_wording": "Este panel no afirma mejoras en resultados clínicos. Muestra las señales operacionales que esta sesión de demostración produjo.",
  "metrics.footer_disclaimer": "Soficca no diagnostica, no prescribe ni reemplaza el juicio clínico. Estas son métricas de sesión actual. No representan validación clínica ni mejora de resultados.",

  // ── Pilot Summary ─────────────────────────────────────────────────
  "pilotSummary.section_label": "Resumen del piloto",
  "pilotSummary.heading": "Infraestructura gobernada de triaje cardiovascular para revisión médica",
  "pilotSummary.subtitle": "La IA estructura la señal. Soficca gobierna la ruta. Los médicos toman la decisión final.",
  "pilotSummary.banner": "Piloto local · Extracción IA real · Clasificación determinista real · Persistencia en base de datos disponible para casos guardados, retroalimentación del revisor y resúmenes de sesión",

  // Section: What the pilot demonstrates
  "pilotSummary.sec_demonstrates": "Lo que demuestra el piloto",
  "pilotSummary.demo_intake": "Ingreso cardiovascular guiado desde narrativa de texto libre.",
  "pilotSummary.demo_extraction": "Extracción IA real de señales con evidencia de campo y confianza.",
  "pilotSummary.demo_confirmed": "Entrada estructurada confirmada por humano antes de la clasificación.",
  "pilotSummary.demo_routing": "Clasificación determinista de Soficca con cumplimiento de política de seguridad.",
  "pilotSummary.demo_report": "Reporte gobernado revisable por médico con traza de auditoría.",
  "pilotSummary.demo_feedback": "Ciclo de retroalimentación del revisor con captura estructurada de acuerdo y persistencia en base de datos para casos guardados.",
  "pilotSummary.demo_metrics": "Métricas de sesión que reflejan casos, rutas y señales del revisor con resúmenes persistidos opcionales.",
  "pilotSummary.demo_audit": "Exportación de auditoría (JSON y Markdown) para casos individuales y sesiones completas.",
  "pilotSummary.demo_persistence": "Persistencia en base de datos para casos guardados, retroalimentación del revisor y resúmenes de sesión.",

  // Section: What Soficca governs
  "pilotSummary.sec_governs": "Lo que Soficca gobierna",
  "pilotSummary.gov_routing": "Lógica de clasificación — reglas deterministas, no decisiones de IA.",
  "pilotSummary.gov_safety": "Política de seguridad — detección de señales críticas y escalamiento.",
  "pilotSummary.gov_versioned": "Conjunto de reglas versionado y traza del motor para cada caso clasificado.",
  "pilotSummary.gov_missing": "Manejo de información faltante — diferimiento cuando los datos son insuficientes.",
  "pilotSummary.gov_conflict": "Manejo de conflictos — bloquea la clasificación cuando las entradas son contradictorias.",
  "pilotSummary.gov_integrity": "Integridad del reporte — sin diagnóstico, sin prescripción, revisión humana requerida.",

  // Section: What AI does
  "pilotSummary.sec_ai_does": "Lo que hace la IA",
  "pilotSummary.ai_structures": "Estructura narrativas de texto libre en señales clínicas.",
  "pilotSummary.ai_evidence": "Proporciona evidencia a nivel de campo con texto fuente y confianza.",
  "pilotSummary.ai_summarizes": "Resume los hechos extraídos para revisión médica.",
  "pilotSummary.ai_questions": "Sugiere preguntas de completitud de ingreso para datos faltantes.",
  "pilotSummary.ai_flags": "Señala información faltante, incierta o potencialmente conflictiva.",

  // Section: What AI does not do
  "pilotSummary.sec_ai_not": "Lo que la IA no hace",
  "pilotSummary.ainot_diagnose": "No diagnostica.",
  "pilotSummary.ainot_prescribe": "No prescribe.",
  "pilotSummary.ainot_route": "No decide la ruta.",
  "pilotSummary.ainot_replace": "No reemplaza el juicio médico.",

  // Current stage
  "pilotSummary.current_stage": "Etapa actual",
  "pilotSummary.cur_backend": "Piloto local con servicios backend reales.",
  "pilotSummary.cur_ai": "Extracción IA real vía backend OpenAI.",
  "pilotSummary.cur_routing": "Motor de clasificación determinista real de Soficca.",
  "pilotSummary.cur_reviewer": "Flujo de revisión con persistencia en base de datos para casos guardados.",
  "pilotSummary.cur_summaries": "Los resúmenes de sesión pueden persistirse y cargarse.",
  "pilotSummary.cur_reset": "La cola local y métricas se reinician al recargar — los datos persistidos permanecen en base de datos.",

  // Next stage
  "pilotSummary.next_stage": "Siguiente etapa",
  "pilotSummary.nxt_pilot": "Piloto controlado con médicos y grupo ampliado de revisores.",
  "pilotSummary.nxt_aggregated": "Métricas agregadas entre sesiones y revisores.",
  "pilotSummary.nxt_auth": "Autenticación y control de acceso.",
  "pilotSummary.nxt_restore": "Restauración de sesión al recargar la página.",

  // Component readiness
  "pilotSummary.readiness_heading": "Preparación de componentes",
  "pilotSummary.rdy_routing_engine": "Motor de clasificación determinista",
  "pilotSummary.rdy_safety_policy": "Cumplimiento de política de seguridad",
  "pilotSummary.rdy_ai_extraction": "Extracción IA real (backend)",
  "pilotSummary.rdy_backend_routing": "Clasificación determinista real en backend",
  "pilotSummary.rdy_schema": "Esquema de extracción estructurada",
  "pilotSummary.rdy_audit_trace": "Generación de traza de auditoría",
  "pilotSummary.rdy_feedback": "Flujo de retroalimentación del revisor",
  "pilotSummary.rdy_persistence": "Persistencia en base de datos (casos, retroalimentación, resúmenes)",
  "pilotSummary.rdy_persisted_feedback": "Retroalimentación del revisor persistida",
  "pilotSummary.rdy_persisted_summaries": "Resúmenes de sesión persistidos",
  "pilotSummary.rdy_metrics_dashboard": "Panel de métricas de sesión (derivado localmente)",
  "pilotSummary.rdy_audit_export": "Exportación de auditoría de sesión y caso",
  "pilotSummary.rdy_demo_guide": "Guía de demostración y atajos de escenario",
  "pilotSummary.rdy_controlled_pilot": "Piloto controlado con médicos",
  "pilotSummary.rdy_aggregated_metrics": "Métricas agregadas entre sesiones",
  "pilotSummary.rdy_auth": "Autenticación / control de acceso",
  "pilotSummary.rdy_multisite": "Despliegue multi-sitio",

  // Status labels
  "pilotSummary.status_ready": "Listo",
  "pilotSummary.status_next": "Siguiente etapa",
  "pilotSummary.status_scope": "Fuera de alcance",

  // Disclaimer
  "pilotSummary.disclaimer": "Soficca no diagnostica, no prescribe ni reemplaza el juicio clínico. Este piloto estructura síntomas y señales de clasificación de seguridad para revisión clínica humana.",

  // ── Cost / Workflow Impact Dashboard ───────────────────────────────
  "costWorkflowImpact.section_label": "Señales operacionales de flujo de trabajo",
  "costWorkflowImpact.heading": "Indicadores operacionales para la eficiencia de revisión clínica",
  "costWorkflowImpact.subtitle": "Indicadores operacionales relacionados con fragmentación, seguridad de clasificación y flujo de revisión clínica.",
  "costWorkflowImpact.caveat_important": "Importante:",
  "costWorkflowImpact.caveat_body": "Este piloto no afirma reducciones de costos realizadas. Reporta señales operacionales que pueden orientar la revisión de flujos de trabajo.",
  "costWorkflowImpact.empty_heading": "Ejecute y revise casos para completar esta sección.",
  "costWorkflowImpact.empty_hint": "Las señales de flujo de trabajo local aparecen después de casos completados, envíos al revisor y retroalimentación del revisor.",
  "costWorkflowImpact.unit_cases": "casos",

  // Why these signals matter
  "costWorkflowImpact.why_heading": "Por qué importan estas señales",
  "costWorkflowImpact.why_body": "El triaje fragmentado genera ingreso repetido, escalamiento tardío, escalamiento innecesario, continuidad débil y auditabilidad limitada. Estas señales indican dónde la clasificación gobernada puede reducir la fricción operacional antes, durante y después de la revisión clínica.",

  // Impact categories
  "costWorkflowImpact.cat_fragmentation": "Señales de fragmentación",
  "costWorkflowImpact.cat_escalation": "Eficiencia de escalamiento",
  "costWorkflowImpact.cat_review": "Eficiencia de revisión",
  "costWorkflowImpact.cat_governance": "Gobernanza / auditoría",

  // Fragmentation signal labels
  "costWorkflowImpact.frag_missing": "Información crítica faltante identificada",
  "costWorkflowImpact.frag_conflicts_blocked": "Casos conflictivos bloqueados antes de la clasificación",
  "costWorkflowImpact.frag_reconciliation": "Casos que requieren conciliación",
  "costWorkflowImpact.frag_trace": "Reportes con traza completa",

  // Escalation signal labels
  "costWorkflowImpact.esc_emergency": "Anulaciones de emergencia aplicadas",
  "costWorkflowImpact.esc_urgent": "Casos urgentes del día identificados",
  "costWorkflowImpact.esc_routine": "Casos de rutina no escalados innecesariamente",
  "costWorkflowImpact.esc_withheld": "Casos con datos insuficientes retenidos de clasificación insegura",

  // Review signal labels
  "costWorkflowImpact.rev_time_saved": "Tiempo de revisión estimado ahorrado",
  "costWorkflowImpact.rev_prepared": "Casos preparados antes de la consulta",
  "costWorkflowImpact.rev_human_corrected": "Casos con extracción corregida por humanos",
  "costWorkflowImpact.rev_agreement": "Tasa de acuerdo del revisor",

  // Governance signal labels
  "costWorkflowImpact.gov_engine": "Reportes con versión del motor",
  "costWorkflowImpact.gov_ruleset": "Reportes con versión de reglas",
  "costWorkflowImpact.gov_policy": "Reportes con versión de política de seguridad",
  "costWorkflowImpact.gov_rules": "Reportes con reglas activadas",

  // Workflow model card
  "costWorkflowImpact.model_title": "Modelo ilustrativo de señal de flujo de trabajo",
  "costWorkflowImpact.model_cases_reviewed": "Casos revisados",
  "costWorkflowImpact.model_time_per_case": "Tiempo est. ahorrado / caso",
  "costWorkflowImpact.model_reviewed_feedback": "Casos revisados con retroalimentación",
  "costWorkflowImpact.model_formula": "Señal de tiempo de flujo estimado = casos revisados × minutos estimados ahorrados por caso reportados por el revisor",
  "costWorkflowImpact.model_caption": "Esta es una estimación de flujo de trabajo, no una afirmación financiera.",

  // Evidence layer
  "costWorkflowImpact.evidence_title": "Capa de evidencia de señales operacionales",
  "costWorkflowImpact.evidence_routine": "Casos de rutina no escalados",
  "costWorkflowImpact.evidence_needs_info": "Rutas con datos insuficientes",
  "costWorkflowImpact.evidence_conflicts": "Conflictos detectados",
  "costWorkflowImpact.evidence_audit": "Reportes con traza de auditoría completa",

  // Time distribution
  "costWorkflowImpact.time_title": "Distribución de señal de tiempo reportada por el revisor",
  "costWorkflowImpact.time_empty": "Ejecute y revise casos para completar esta sección.",
  "costWorkflowImpact.time_0": "0 minutos",
  "costWorkflowImpact.time_1_2": "1–2 minutos",
  "costWorkflowImpact.time_3_5": "3–5 minutos",
  "costWorkflowImpact.time_5_plus": "5+ minutos",

  // No-claim list
  "costWorkflowImpact.noclaim_title": "Lo que este piloto no afirma",
  "costWorkflowImpact.noclaim_dollars": "Montos en dólares ahorrados",
  "costWorkflowImpact.noclaim_pct": "Reducción porcentual de costos",
  "costWorkflowImpact.noclaim_hospital": "Ahorros hospitalarios comprobados",
  "costWorkflowImpact.noclaim_government": "Ahorros gubernamentales comprobados",
  "costWorkflowImpact.noclaim_clinical": "Mejora de resultados clínicos",

  // Disclaimer
  "costWorkflowImpact.disclaimer": "Soficca no diagnostica, no prescribe ni reemplaza el juicio clínico. Estas señales de sesión actual no afirman reducción de costos realizada, validación clínica ni mejora de resultados.",

  // ── Physician Feedback Form ────────────────────────────────────────
  "physicianFeedback.back": "← Volver al espacio de revisión",
  "physicianFeedback.section_label": "Retroalimentación médica",
  "physicianFeedback.heading": "Retroalimentación estructurada de revisión",
  "physicianFeedback.case_label": "Caso:",
  "physicianFeedback.mock_banner": "Simulación frontend — La persistencia de retroalimentación se agregará en una etapa posterior.",

  // Q1
  "physicianFeedback.q1_heading": "1. ¿Fue apropiada la ruta?",
  "physicianFeedback.q1_yes": "Sí",
  "physicianFeedback.q1_partially": "Parcialmente",
  "physicianFeedback.q1_no": "No",

  // Q2
  "physicianFeedback.q2_heading": "2. ¿Fue clínicamente útil el reporte?",
  "physicianFeedback.q2_select": "Seleccionar",

  // Q3
  "physicianFeedback.q3_heading": "3. ¿Soficca identificó información faltante importante?",
  "physicianFeedback.q3_yes": "Sí",
  "physicianFeedback.q3_partially": "Parcialmente",
  "physicianFeedback.q3_no": "No",
  "physicianFeedback.q3_na": "No aplica",

  // Q4
  "physicianFeedback.q4_heading": "4. ¿Hubo alertas de seguridad incorrectas o faltantes?",
  "physicianFeedback.q4_no": "No",
  "physicianFeedback.q4_missing": "Sí, alerta faltante",
  "physicianFeedback.q4_incorrect": "Sí, alerta incorrecta",
  "physicianFeedback.q4_unsure": "No estoy seguro",

  // Q5
  "physicianFeedback.q5_heading": "5. Tiempo de revisión estimado ahorrado",
  "physicianFeedback.q5_0": "0 minutos",
  "physicianFeedback.q5_1_2": "1–2 minutos",
  "physicianFeedback.q5_3_5": "3–5 minutos",
  "physicianFeedback.q5_5_plus": "5+ minutos",

  // Q6
  "physicianFeedback.q6_heading": "6. ¿Sería útil antes de la consulta?",
  "physicianFeedback.q6_yes": "Sí",
  "physicianFeedback.q6_maybe": "Quizás",
  "physicianFeedback.q6_no": "No",

  // Q7
  "physicianFeedback.q7_heading": "7. Comentarios del revisor",
  "physicianFeedback.q7_placeholder": "Agregue notas clínicas, justificación de desacuerdo o contexto faltante.",

  // Actions & states
  "physicianFeedback.save": "Guardar retroalimentación simulada",
  "physicianFeedback.clear": "Limpiar formulario",
  "physicianFeedback.saved_confirm": "Retroalimentación capturada para la sesión actual.",
  "physicianFeedback.disclaimer": "Los médicos son los responsables finales de las decisiones clínicas. Soficca no diagnostica, no prescribe ni reemplaza el juicio clínico.",

  // ── QA Screen ──────────────────────────────────────────────────────
  "qaScreen.section_label": "QA de escenarios dorados",
  "qaScreen.heading": "Validación de escenarios de extremo a extremo",
  "qaScreen.subtitle": "Verifique la cadena completa del piloto para cada escenario dorado. Marque cada elemento de la lista de verificación mientras prueba.",

  // Category labels
  "qaScreen.cat_intake": "Ingreso",
  "qaScreen.cat_extraction": "Extracción IA",
  "qaScreen.cat_correction": "Corrección humana",
  "qaScreen.cat_routing": "Clasificación Soficca",
  "qaScreen.cat_report": "Reporte final",
  "qaScreen.cat_audit": "Exportación de auditoría",
  "qaScreen.cat_safety": "Seguridad / Gobernanza",

  // Scenario selector status
  "qaScreen.not_run": "Sin ejecutar",
  "qaScreen.checked": "verificados",
  "qaScreen.passed": "aprobados",
  "qaScreen.has_failures": "tiene fallos",

  // Scenario detail
  "qaScreen.scenario_label": "Escenario",
  "qaScreen.source_narrative": "Narrativa fuente",
  "qaScreen.load_into_flow": "Cargar en flujo piloto",
  "qaScreen.copy_narrative": "Copiar narrativa",
  "qaScreen.copied": "¡Copiado!",
  "qaScreen.expected_fields": "Campos clave esperados",
  "qaScreen.expected_safety": "Seguridad esperada:",

  // Checklist buttons
  "qaScreen.btn_pass": "A",
  "qaScreen.btn_fail": "R",

  // Sidebar metrics
  "qaScreen.sidebar_title": "QA de escenarios dorados",
  "qaScreen.metric_tested": "Escenarios probados",
  "qaScreen.metric_passed": "Escenarios completamente aprobados",
  "qaScreen.metric_items_passed": "Elementos aprobados",
  "qaScreen.metric_failed": "Elementos fallidos",
  "qaScreen.metric_untested": "Elementos sin probar",
  "qaScreen.metric_dx": "Eventos de diagnóstico autónomo",
  "qaScreen.metric_rx": "Eventos de prescripción autónoma",
  "qaScreen.sidebar_disclaimer": "Sesión de QA manual únicamente. Los resultados de la lista de verificación permanecen locales y no se persisten.",
  "qaScreen.failed_heading": "Elementos fallidos",

  // Manual test steps
  "qaScreen.manual_heading": "Pasos de prueba manual",
  "qaScreen.step_1": "Cargar o copiar la narrativa del escenario",
  "qaScreen.step_2": "Navegar a Flujo piloto → Ingreso",
  "qaScreen.step_3": "Pegar narrativa y ejecutar extracción IA",
  "qaScreen.step_4": "Revisar campos extraídos, opcionalmente editar uno",
  "qaScreen.step_5": "Confirmar y ejecutar clasificación Soficca",
  "qaScreen.step_6": "Verificar que la ruta final coincida con la esperada",
  "qaScreen.step_7": "Verificar secciones del reporte y cadena de señales",
  "qaScreen.step_8": "Exportar auditoría JSON y Markdown",
  "qaScreen.step_9": "Regresar aquí y marcar elementos de la lista",

  // QA scope
  "qaScreen.scope_heading": "Alcance de QA",
  "qaScreen.scope_body": "Esta QA valida el flujo de escenarios de extremo a extremo, no resultados clínicos. La coincidencia de rutas confirma el comportamiento determinista del motor contra escenarios de demostración predefinidos. No se afirma validación clínica, prueba de seguridad ni medición de resultados.",

  // ── Demo Guide ─────────────────────────────────────────────────────
  "demoGuide.section_label": "Guía de demostración",
  "demoGuide.heading": "Guion de demostración guiada para asesores, médicos y partes interesadas",
  "demoGuide.banner": "Demo local · Extracción IA real · Clasificación real · Persistencia en base de datos disponible",

  // Suggested opening
  "demoGuide.opening_heading": "Apertura sugerida",
  "demoGuide.opening_quote": "Soficca es la capa de decisión gobernada debajo de los flujos de trabajo clínicos. En este piloto, la IA estructura narrativas cardiovasculares desordenadas, los humanos confirman la señal estructurada, y Soficca aplica clasificación de seguridad determinista.",

  // Demo objective
  "demoGuide.objective_heading": "Objetivo de la demostración",
  "demoGuide.objective_body": "Mostrar cómo Soficca convierte narrativas cardiovasculares de texto libre en señales estructuradas, permite confirmación humana, aplica clasificación determinista, genera un reporte auditable, envía un caso al revisor, captura retroalimentación y exporta métricas de sesión.",

  // 3-minute flow
  "demoGuide.flow_heading": "Flujo de demostración recomendado de 3 minutos",
  "demoGuide.flow_1": "Comenzar con la Bienvenida / Flujo piloto.",
  "demoGuide.flow_2": "Cargar el escenario dorado de Emergencia con bandera roja.",
  "demoGuide.flow_3": "Mostrar señales de ingreso guiado y completitud.",
  "demoGuide.flow_4": "Ejecutar extracción IA real.",
  "demoGuide.flow_5": "Mostrar resumen estructurado, evidencia de campos, información faltante y preguntas de completitud.",
  "demoGuide.flow_6": "Editar un campo para demostrar confirmación humana.",
  "demoGuide.flow_7": "Ejecutar clasificación determinista de Soficca.",
  "demoGuide.flow_8": "Mostrar reporte final, cadena de señales, estado de corrección humana y traza de auditoría.",
  "demoGuide.flow_9": "Enviar caso al revisor.",
  "demoGuide.flow_10": "Enviar retroalimentación del revisor.",
  "demoGuide.flow_11": "Abrir métricas y mostrar métricas de sesión actual.",
  "demoGuide.flow_12": "Exportar resumen de sesión o registro de auditoría del caso.",

  // Core message
  "demoGuide.core_heading": "Mensaje central",
  "demoGuide.core_quote": "La IA estructura la señal. El humano confirma la extracción. Soficca aplica clasificación de seguridad determinista. El médico sigue siendo el decisor final.",

  // What not to claim
  "demoGuide.noclaim_heading": "Lo que no se debe afirmar",
  "demoGuide.noclaim_1": "No afirmar validación clínica.",
  "demoGuide.noclaim_2": "No afirmar mejora de resultados.",
  "demoGuide.noclaim_3": "No afirmar reducción de costos realizada.",
  "demoGuide.noclaim_4": "No afirmar que la IA diagnostica o decide la ruta.",
  "demoGuide.noclaim_5": "No usar datos reales identificables de pacientes.",

  // Golden scenario shortcuts
  "demoGuide.shortcuts_heading": "Atajos de escenarios dorados",
  "demoGuide.shortcuts_hint": "Use solo escenarios simulados. Carga la narrativa en el ingreso del flujo piloto.",
  "demoGuide.loaded_prefix": "Cargado:",
  "demoGuide.loaded_suffix": "navegar al flujo piloto",

  // Phase labels
  "demoGuide.phase_before": "Antes de la demo",
  "demoGuide.phase_during": "Durante la demo",
  "demoGuide.phase_after": "Después de la demo",

  // Checklist — Before
  "demoGuide.ck_backend": "Backend ejecutándose (puerto local 8000 o URL desplegada)",
  "demoGuide.ck_frontend": "Frontend ejecutándose (local o Vercel)",
  "demoGuide.ck_openai": "OPENAI_API_KEY configurada en el entorno del backend",
  "demoGuide.ck_db": "DATABASE_URL configurada en el backend (para persistencia)",
  "demoGuide.ck_ai_extraction": "Extracción IA real funcionando",
  "demoGuide.ck_backend_routing": "Clasificación determinista real del backend funcionando",
  "demoGuide.ck_reviewer_empty": "Cola de revisión vacía o reiniciada",
  "demoGuide.ck_metrics_reset": "Sesión de métricas reiniciada o lista",
  "demoGuide.ck_simulated": "Usar solo casos simulados / anonimizados",
  "demoGuide.ck_no_clinical": "Sin afirmaciones de validación clínica",

  // Checklist — During
  "demoGuide.ck_intake": "Mostrar ingreso guiado",
  "demoGuide.ck_extraction": "Mostrar extracción IA",
  "demoGuide.ck_correction": "Mostrar corrección humana",
  "demoGuide.ck_routing": "Mostrar clasificación Soficca",
  "demoGuide.ck_report": "Mostrar reporte de auditoría",
  "demoGuide.ck_reviewer": "Enviar al revisor",
  "demoGuide.ck_feedback": "Enviar retroalimentación del revisor",
  "demoGuide.ck_metrics": "Mostrar métricas",
  "demoGuide.ck_export": "Exportar resumen de sesión",

  // Checklist — After
  "demoGuide.ck_af_audit": "Exportar auditoría JSON / Markdown si es útil",
  "demoGuide.ck_af_session": "Exportar resumen de sesión si es útil",
  "demoGuide.ck_af_persist_session": "Crear sesión persistida (Panel de métricas)",
  "demoGuide.ck_af_persist_case": "Guardar caso en base de datos",
  "demoGuide.ck_af_persist_feedback": "Persistir retroalimentación del revisor",
  "demoGuide.ck_af_persist_summary": "Guardar resumen de sesión en el backend",
  "demoGuide.ck_af_persist_load": "Cargar resumen / casos persistidos",
  "demoGuide.ck_af_reset": "Reiniciar sesión de demo actual si es necesario",

  // Sidebar — Demo mode status
  "demoGuide.status_heading": "Estado del modo demo",
  "demoGuide.status_data_mode": "Modo de datos",
  "demoGuide.status_data_value": "Local / solo sesión",
  "demoGuide.status_ai": "Extracción IA",
  "demoGuide.status_ai_value": "IA real del backend · respaldo disponible",
  "demoGuide.status_routing": "Clasificación",
  "demoGuide.status_routing_value": "Backend determinista real · respaldo disponible",
  "demoGuide.status_reviewer": "Cola de revisión",
  "demoGuide.status_reviewer_value": "Local · retroalimentación persistida para casos guardados",
  "demoGuide.status_metrics": "Métricas",
  "demoGuide.status_metrics_value": "Derivadas localmente · resúmenes persistidos disponibles",
  "demoGuide.status_persistence": "Persistencia",
  "demoGuide.status_persistence_value": "Casos, retroalimentación, sesiones, resúmenes",
  "demoGuide.status_clinical": "Afirmaciones clínicas",
  "demoGuide.status_clinical_value": "No validado",

  // Sidebar — Session snapshot
  "demoGuide.snapshot_heading": "Instantánea de sesión actual",
  "demoGuide.snapshot_processed": "Casos procesados",
  "demoGuide.snapshot_sent": "Enviados al revisor",
  "demoGuide.snapshot_reviewed": "Revisados",
  "demoGuide.snapshot_pending": "Pendientes de revisión",

  // Sidebar — Demo outputs
  "demoGuide.outputs_heading": "Salidas de la demo",
  "demoGuide.output_audit_json": "Auditoría de caso JSON",
  "demoGuide.output_audit_md": "Auditoría de caso Markdown",
  "demoGuide.output_session_json": "Resumen de sesión JSON",
  "demoGuide.output_session_md": "Resumen de sesión Markdown",
  "demoGuide.output_feedback": "Resumen de retroalimentación del revisor",
  "demoGuide.output_metrics": "Panel de métricas local",
  "demoGuide.outputs_disclaimer": "Las exportaciones son archivos locales generados en el navegador. Ningún dato de sesión se persiste en la Etapa 2B.9.",

  // Sidebar — Reset
  "demoGuide.reset_heading": "Reiniciar sesión de demo local",
  "demoGuide.reset_desc": "Limpia casos de demo locales, retroalimentación del revisor y métricas de sesión. No afecta el código del backend ni archivos guardados.",
  "demoGuide.reset_note": "Solo reinicio local. No se eliminan datos del backend.",
  "demoGuide.reset_btn": "Reiniciar sesión de demo actual",
  "demoGuide.reset_confirm": "Confirmar reinicio — limpia todos los datos de la sesión actual",
  "demoGuide.reset_cancel": "Cancelar",

  // Disclaimer
  "demoGuide.disclaimer": "Esta demo no afirma validación clínica, mejora de resultados ni reducción de costos realizada. Soficca no diagnostica, no prescribe ni reemplaza el juicio clínico.",

  // ── Page-level loading / error states ──────────────────────────────
  "page.extracting": "Ejecutando extracción de señales IA...",
  "page.extraction_timeout": "La extracción IA en vivo agotó el tiempo",
  "page.extraction_unavailable": "Extracción IA en vivo no disponible",
  "page.extraction_failed": "La extracción IA en vivo falló",
  "page.mock_fallback": "mostrando respaldo simulado.",
  "page.retried": "reintentado",
  "page.retry_extraction": "Reintentar extracción en vivo",
  "page.routing": "Ejecutando clasificación determinista de Soficca...",
  "page.backend_unavailable": "Backend no disponible",
  "page.mock_report_fallback": "mostrando reporte de respaldo simulado.",

  // ── Example case cards ─────────────────────────────────────────────
  "exampleCase.NEEDS_MORE_INFO.label": "Información faltante",
  "exampleCase.NEEDS_MORE_INFO.description": "Datos clínicos incompletos que requieren campos adicionales",
  "exampleCase.NEEDS_MORE_INFO.route": "Necesita más información",
  "exampleCase.NEEDS_MORE_INFO.narrative": "Paciente de 62 años presenta dolor torácico. Niega dificultad respiratoria y síncope. Presión arterial 124/78, frecuencia cardíaca 80 lpm. No toma medicamentos cardíacos actualmente.",

  "exampleCase.ROUTINE_REVIEW.label": "Revisión de rutina",
  "exampleCase.ROUTINE_REVIEW.description": "Presentación estable apropiada para seguimiento cardiológico de rutina",
  "exampleCase.ROUTINE_REVIEW.route": "Revisión de rutina",
  "exampleCase.ROUTINE_REVIEW.narrative": "Paciente de 60 años con dolor torácico tipo presión de baja intensidad de 15 minutos de duración. Sin irradiación, sin componente de esfuerzo, sin diaforesis. Niega disnea y síncope. PA 122/76, FC 78. Sin enfermedad coronaria conocida, sin infarto previo. Un factor de riesgo cardiovascular. Sin medicación cardíaca. El dolor es leve y no relacionado con esfuerzo.",

  "exampleCase.URGENT_ESCALATION.label": "Revisión urgente el mismo día",
  "exampleCase.URGENT_ESCALATION.description": "Patrón de riesgo que requiere escalamiento clínico urgente el mismo día",
  "exampleCase.URGENT_ESCALATION.route": "Revisión urgente el mismo día",
  "exampleCase.URGENT_ESCALATION.narrative": "Paciente de 63 años con dolor torácico tipo presión moderado de 20 minutos de duración, con irradiación a la mandíbula. El dolor ocurre con el esfuerzo. Sin diaforesis. Niega disnea y síncope. PA 126/82, FC 88. Sin enfermedad coronaria conocida. Un factor de riesgo cardiovascular. Sin medicación cardíaca.",

  "exampleCase.EMERGENCY_ROUTE.label": "Emergencia — señal de alarma",
  "exampleCase.EMERGENCY_ROUTE.description": "Criterios de señal de alarma que requieren escalamiento de emergencia inmediato",
  "exampleCase.EMERGENCY_ROUTE.route": "Emergencia — señal de alarma",
  "exampleCase.EMERGENCY_ROUTE.narrative": "Paciente de 64 años con dolor torácico severo tipo presión de 10 minutos de duración con irradiación al brazo izquierdo. El paciente presentó síncope durante el episodio. No se reportó disnea. PA 120/74, FC 96. Sin enfermedad coronaria conocida. Sin medicación cardíaca.",

  "exampleCase.DEFERRED_PENDING_DATA.label": "Datos contradictorios",
  "exampleCase.DEFERRED_PENDING_DATA.description": "Datos clínicos contradictorios que requieren reconciliación",
  "exampleCase.DEFERRED_PENDING_DATA.route": "Datos contradictorios",
  "exampleCase.DEFERRED_PENDING_DATA.narrative": "Paciente de 59 años niega dolor torácico, pero describe dolor opresivo de 20 minutos con irradiación a la mandíbula y alta severidad. Reporta dolor torácico de esfuerzo a pesar de negar la presencia de dolor torácico. Sin disnea, sin síncope. PA 122/80, FC 84. Sin enfermedad coronaria conocida. Sin medicación cardíaca.",

  // Signal preview tags
  "signal.age": "edad",
  "signal.chest_pain": "dolor torácico",
  "signal.vitals": "signos vitales",
  "signal.meds": "medicamentos",
  "signal.duration": "duración",
  "signal.character": "carácter",
  "signal.history": "historial",
  "signal.radiation": "irradiación",
  "signal.exertional": "esfuerzo",
  "signal.severity": "severidad",
  "signal.syncope": "síncope",
  "signal.contradictions": "contradicciones",

  // ── Golden scenarios ──────────────────────────────────────────────
  "goldenScenario.gs_emergency.label": "Emergencia — señal de alarma",
  "goldenScenario.gs_urgent.label": "Revisión urgente el mismo día",
  "goldenScenario.gs_routine.label": "Revisión de rutina",
  "goldenScenario.gs_needs_info.label": "Necesita más información",
  "goldenScenario.gs_conflict.label": "Datos contradictorios",

  // ── Route labels (report-helpers) ──────────────────────────────────
  "routeLabel.none": "Ruta no determinada",
  "routeLabel.PATH_EMERGENCY_NOW": "Emergencia — Escalamiento inmediato",
  "routeLabel.PATH_URGENT_SAME_DAY": "Urgente — Revisión el mismo día",
  "routeLabel.PATH_ROUTINE": "Rutina — Seguimiento programado",
  "routeLabel.PATH_MORE_QUESTIONS": "Pendiente — Se necesita más información",
  "routeLabel.PATH_SELF_CARE": "Autocuidado — Monitoreo en casa",
  "routeLabel.PATH_ESCALATE_HUMAN": "Escalar — Revisión humana requerida",

  // ── Status labels ──────────────────────────────────────────────────
  "statusLabel.DECIDED": "Decidido",
  "statusLabel.NEEDS_MORE_INFO": "Necesita más información",
  "statusLabel.CONFLICT": "Conflicto detectado",
  "statusLabel.ESCALATED": "Escalado",

  // ── Why this route ─────────────────────────────────────────────────
  "whyRoute.needs_info": "Faltaban datos clínicos críticos, por lo que la clasificación determinista fue retenida.",
  "whyRoute.conflict": "Datos contradictorios bloquearon la clasificación determinista.",
  "whyRoute.emergency": "Se activaron criterios de señal de alarma de emergencia bajo la política de seguridad activa.",
  "whyRoute.urgent": "Se cumplieron los umbrales de escalamiento urgente tras la evaluación determinista de reglas.",
  "whyRoute.routine": "No se detectó ningún patrón de emergencia o urgencia tras la evaluación determinista de reglas.",
  "whyRoute.default": "Ruta determinada por la evaluación de políticas deterministas de Soficca.",

  // ── Why not selected ───────────────────────────────────────────────
  "whyNot.needs_info.route1": "Rutina / Urgente",
  "whyNot.needs_info.reason1": "No se puede seleccionar una ruta segura hasta que los campos requeridos estén completos.",
  "whyNot.needs_info.route2": "Emergencia",
  "whyNot.needs_info.reason2": "La anulación de emergencia no fue activada por la política de seguridad.",
  "whyNot.conflict.route1": "Emergencia / Rutina",
  "whyNot.conflict.reason1": "El caso requiere reconciliación antes de una clasificación segura.",
  "whyNot.emergency.route1": "Rutina",
  "whyNot.emergency.reason1": "La revisión de rutina no se selecciona cuando hay señales de alarma de emergencia presentes.",
  "whyNot.emergency.route2": "Necesita más información",
  "whyNot.emergency.reason2": "La información faltante no anula el escalamiento de seguridad de emergencia cuando los criterios de señal de alarma están activos.",
  "whyNot.urgent.route1": "Emergencia",
  "whyNot.urgent.reason1": "No se aplicó ninguna anulación de seguridad de emergencia activa.",
  "whyNot.urgent.route2": "Rutina",
  "whyNot.urgent.reason2": "Se cumplieron los umbrales de escalamiento urgente, impidiendo la clasificación de rutina.",
  "whyNot.routine.route1": "Urgente",
  "whyNot.routine.reason1": "No se cumplieron los umbrales de escalamiento urgente.",
  "whyNot.routine.route2": "Emergencia",
  "whyNot.routine.reason2": "No hubo activación de seguridad de emergencia.",

  // ── Evidence labels ────────────────────────────────────────────────
  "evidence.age": "Edad",
  "evidence.chest_pain_present": "Dolor torácico presente",
  "evidence.pain_duration_minutes": "Duración del dolor",
  "evidence.pain_character": "Carácter del dolor",
  "evidence.pain_severity": "Severidad del dolor",
  "evidence.pain_radiation": "Irradiación del dolor",
  "evidence.exertional_chest_pain": "Dolor torácico de esfuerzo",
  "evidence.diaphoresis": "Diaforesis",
  "evidence.dyspnea": "Disnea",
  "evidence.syncope": "Síncope",
  "evidence.systolic_bp": "PA sistólica",
  "evidence.heart_rate": "Frecuencia cardíaca",
  "evidence.prior_mi": "Infarto previo",
  "evidence.known_cad": "Enfermedad coronaria conocida",
  "evidence.cv_risk_factors_count": "Factores de riesgo CV",
  "evidence.current_meds_none": "Medicación cardíaca actual",
  "evidence.value_yes": "Sí",
  "evidence.value_no": "No",
  "evidence.value_none_reported": "Ninguno reportado",
  "evidence.value_taking_meds": "Toma medicamentos",

  // ── Mock report visible content ────────────────────────────────────
  "mockReport.NEEDS_MORE_INFO.summary": "Campos cardíacos críticos faltantes; clasificación segura diferida.",
  "mockReport.NEEDS_MORE_INFO.action1": "Recopilar todos los campos críticos faltantes y reenviar.",
  "mockReport.NEEDS_MORE_INFO.note1": "Campos cardíacos críticos faltantes; lógica de triaje no ejecutada.",

  "mockReport.ROUTINE_REVIEW.summary": "Caso completo estable; revisión de rutina indicada por reglas deterministas.",
  "mockReport.ROUTINE_REVIEW.action1": "Programar revisión cardiológica de rutina.",
  "mockReport.ROUTINE_REVIEW.reason1": "No se detectó patrón de emergencia o urgencia en caso completo.",

  "mockReport.URGENT_ESCALATION.summary": "Revisión urgente el mismo día indicada por regla(s) de riesgo deterministas.",
  "mockReport.URGENT_ESCALATION.action1": "Organizar vía de escalamiento clínico el mismo día.",
  "mockReport.URGENT_ESCALATION.reason1": "Dolor torácico de esfuerzo con irradiación a brazo/mandíbula.",

  "mockReport.EMERGENCY_ROUTE.summary": "Criterios de señal de alarma de emergencia cumplidos; ruta de emergencia requerida.",
  "mockReport.EMERGENCY_ROUTE.action1": "Iniciar protocolo de escalamiento de emergencia inmediato.",
  "mockReport.EMERGENCY_ROUTE.override": "Criterios de emergencia de señal de alarma cumplidos.",

  "mockReport.DEFERRED_PENDING_DATA.summary": "Datos cardíacos estructurados contradictorios detectados; clasificación segura diferida.",
  "mockReport.DEFERRED_PENDING_DATA.action1": "Reconciliar campos contradictorios de dolor torácico.",
  "mockReport.DEFERRED_PENDING_DATA.action2": "Reconfirmar presencia de síntomas, severidad y atributos relacionados.",
  "mockReport.DEFERRED_PENDING_DATA.note1": "Datos estructurados contradictorios detectados.",

  // ── Intake guidance — signal labels ────────────────────────────────
  "intakeSignal.age": "Edad",
  "intakeSignal.chest_pain": "Presencia de dolor torácico",
  "intakeSignal.duration": "Duración del dolor",
  "intakeSignal.character": "Carácter del dolor",
  "intakeSignal.severity": "Severidad del dolor",
  "intakeSignal.radiation": "Irradiación del dolor",
  "intakeSignal.exertional": "Componente de esfuerzo",
  "intakeSignal.dyspnea": "Disnea",
  "intakeSignal.syncope": "Síncope",
  "intakeSignal.diaphoresis": "Diaforesis",
  "intakeSignal.bp": "Presión arterial",
  "intakeSignal.hr": "Frecuencia cardíaca",
  "intakeSignal.cad_mi": "Enfermedad coronaria / infarto previo",
  "intakeSignal.cv_risk": "Factores de riesgo cardiovascular",
  "intakeSignal.meds": "Medicamentos actuales",

  // ── Intake guidance — signal group labels ──────────────────────────
  "intakeGroup.patient": "Paciente / contexto",
  "intakeGroup.complaint": "Motivo de consulta",
  "intakeGroup.red_flags": "Síntomas asociados / señales de alarma",
  "intakeGroup.vitals": "Signos vitales",
  "intakeGroup.cv_history": "Historial cardiovascular",
  "intakeGroup.meds": "Medicación / contexto",

  // ── Intake guidance — completeness messages ────────────────────────
  "intakeCompleteness.strong": "Síntomas clave, señales de alarma, signos vitales y contexto de medicación parecen presentes. Algunos elementos aún pueden necesitar confirmación.",
  "intakeCompleteness.moderate": "Los síntomas principales están presentes, pero contexto adicional puede mejorar la extracción y revisión.",
  "intakeCompleteness.limited": "Considere agregar duración, irradiación, síntomas asociados, signos vitales, historial cardiovascular o medicamentos si están disponibles.",
};

export default es;
