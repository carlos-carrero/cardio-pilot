"use client";

import { useState } from "react";
import { Header, type PilotSurface } from "@/components/layout/header";
import { useTranslation, TranslationProvider } from "@/i18n";
import { WelcomeScreen } from "@/components/screens/welcome-screen";
import { IntakeScreen } from "@/components/screens/intake-screen";
import { ExtractionPreviewScreen } from "@/components/screens/extraction-preview-screen";
import { ReportScreen } from "@/components/screens/report-screen";
import { ReviewerWorkspace } from "@/components/screens/reviewer-workspace";
import { PilotMetricsDashboard } from "@/components/screens/pilot-metrics-dashboard";
import { CostWorkflowImpactDashboard } from "@/components/screens/cost-workflow-impact";
import { PilotSummary } from "@/components/screens/pilot-summary";
import { QaScreen } from "@/components/screens/qa-screen";
import { DemoGuide } from "@/components/screens/demo-guide";
import { extractFromNarrative } from "@/lib/cardio/mock-extractor";
import { routeExtraction } from "@/lib/cardio/mock-router";
import { callPilotReport, callPilotExtract, type ExtractionErrorType } from "@/lib/cardio/api-client";
import { generateCaseId } from "@/lib/cardio/report-helpers";
import { addCaseToQueue, isCaseInQueue } from "@/lib/cardio/reviewer-queue";
import { getSessionMetrics, upsertCompletedCase } from "@/lib/cardio/session-metrics";
import { exampleCases } from "@/mock/example-cases";
import { reviewerCases } from "@/mock/reviewer-cases";
import type {
  PilotCase,
  CardioExtraction,
  CardioExtractionFields,
  ExampleCaseId,
  ReportSource,
  HumanCorrectionStatus,
  ReviewerQueueItem,
  SessionPersistenceStatus,
} from "@/types";

type FlowPhase = "welcome" | "intake" | "extracting" | "extraction" | "report" | "routing";

export default function CardioPilotPage() {
  const { t, lang } = useTranslation();
  const [surface, setSurface] = useState<PilotSurface>("flow");
  const [flowPhase, setFlowPhase] = useState<FlowPhase>("welcome");
  const [narrative, setNarrative] = useState("");
  const [exampleCaseId, setExampleCaseId] = useState<ExampleCaseId | null>(null);
  const [extraction, setExtraction] = useState<CardioExtraction | null>(null);
  const [pilotCase, setPilotCase] = useState<PilotCase | null>(null);
  const [routingError, setRoutingError] = useState<string | null>(null);
  const [extractionError, setExtractionError] = useState<string | null>(null);
  const [extractionErrorType, setExtractionErrorType] = useState<ExtractionErrorType | null>(null);
  const [extractionDiag, setExtractionDiag] = useState<{ elapsedMs?: number; retried?: boolean; requestId?: string } | null>(null);
  const [humanCorrection, setHumanCorrection] = useState<HumanCorrectionStatus | null>(null);
  const [reviewerQueue, setReviewerQueue] = useState<ReviewerQueueItem[]>([]);
  const [completedCases, setCompletedCases] = useState<PilotCase[]>([]);
  const [persistedSessionId, setPersistedSessionId] = useState<string | null>(null);
  const [persistedSessionStatus, setPersistedSessionStatus] = useState<SessionPersistenceStatus>("not_created");
  const [persistedSessionLabel, setPersistedSessionLabel] = useState<string | null>(null);
  const [persistedSessionError, setPersistedSessionError] = useState<string | null>(null);
  const sessionMetrics = getSessionMetrics(completedCases, reviewerQueue);

  function resetFlow() {
    setFlowPhase("welcome");
    setNarrative("");
    setExampleCaseId(null);
    setExtraction(null);
    setPilotCase(null);
    setRoutingError(null);
    setExtractionError(null);
    setExtractionErrorType(null);
    setExtractionDiag(null);
    setHumanCorrection(null);
  }

  function handleLogoClick() {
    setSurface("flow");
    resetFlow();
  }

  function handleSurfaceChange(s: PilotSurface) {
    setSurface(s);
    if (s === "flow") {
      // preserve current flow phase
    } else if (s === "sample_report") {
      void runBackendRouting(
        "64-year-old patient with severe pressure-like chest pain for 10 minutes radiating to the left arm. Patient experienced syncope during the episode. No dyspnea reported. BP 120/74, HR 96. No known CAD. Not on cardiac medications.",
        "EMERGENCY_ROUTE" as ExampleCaseId,
      );
      setSurface("flow");
    }
  }

  function handleStartCase() {
    setSurface("flow");
    setFlowPhase("intake");
  }

  function handleViewSampleReport() {
    void runBackendRouting(
      "64-year-old patient with severe pressure-like chest pain for 10 minutes radiating to the left arm. Patient experienced syncope during the episode. No dyspnea reported. BP 120/74, HR 96. No known CAD. Not on cardiac medications.",
      "EMERGENCY_ROUTE" as ExampleCaseId,
    );
    setSurface("flow");
  }

  function handleIntakeSubmit(text: string, selectedExample: ExampleCaseId | null) {
    setNarrative(text);
    setExampleCaseId(selectedExample);
    void runExtraction(text, selectedExample);
  }

  /**
   * Call real AI extraction backend, fall back to mock if unavailable.
   */
  async function runExtraction(text: string, selectedExample: ExampleCaseId | null) {
    setFlowPhase("extracting");
    setExtractionError(null);
    setExtractionErrorType(null);
    setExtractionDiag(null);

    const result = await callPilotExtract(text, lang === "es" ? "es" : "auto");

    if (result.ok) {
      const d = result.data;
      const ext: CardioExtraction = {
        extraction_id: d.extraction_id,
        model_id: d.model,
        extracted_at: new Date().toISOString(),
        confidence: d.confidence,
        fields: d.fields,
        unmapped_signals: [],
        warnings: d.warnings,
        extraction_source: "ai",
        field_evidence: d.field_evidence,
        missing_fields: d.missing_fields,
        possible_conflicts: d.possible_conflicts,
        structured_clinical_summary: d.structured_clinical_summary,
        missing_information: d.missing_information,
        completion_questions: d.completion_questions,
        extraction_quality_flags: d.extraction_quality_flags,
        pii_warnings: d.pii_warnings,
      };
      setExtraction(ext);
      setFlowPhase("extraction");
    } else {
      // Fallback to mock extraction
      const mockExt = extractFromNarrative(text, selectedExample);
      mockExt.extraction_source = "mock";
      setExtraction(mockExt);
      setExtractionError(result.error);
      setExtractionErrorType(result.errorType);
      setExtractionDiag({
        elapsedMs: result.elapsedMs,
        retried: result.retried,
        requestId: result.requestId,
      });
      setFlowPhase("extraction");
    }
  }

  /** Retry live AI extraction using the current narrative. */
  function handleRetryExtraction() {
    if (!narrative) return;
    void runExtraction(narrative, exampleCaseId);
  }

  /**
   * Core routing function: calls real backend first, falls back to mock.
   */
  async function runBackendRouting(
    text: string,
    selectedExample: ExampleCaseId | null,
    ext?: CardioExtraction,
    finalFieldsOverride?: CardioExtractionFields,
    correction?: HumanCorrectionStatus,
  ) {
    const currentExt = ext ?? extractFromNarrative(text, selectedExample);
    // Use edited fields if provided, otherwise use extraction fields
    const routingExt: CardioExtraction = finalFieldsOverride
      ? { ...currentExt, fields: finalFieldsOverride }
      : currentExt;
    const caseId = generateCaseId();

    setNarrative(text);
    setExampleCaseId(selectedExample);
    setExtraction(currentExt);
    setFlowPhase("routing");
    setRoutingError(null);

    const result = await callPilotReport(caseId, text, routingExt);

    let reportSource: ReportSource;
    let engineInput;
    let engineReport;

    if (result.ok) {
      reportSource = "backend";
      engineInput = result.data.engine_input;
      engineReport = result.data.engine_report;
    } else {
      // Fallback to mock
      reportSource = "mock_fallback";
      const mock = routeExtraction(routingExt, selectedExample);
      engineInput = mock.payload;
      engineReport = mock.report;
      setRoutingError(result.error);
    }

    const newCase: PilotCase = {
      case_id: caseId,
      created_at: new Date().toISOString(),
      free_text_input: text,
      extraction: currentExt,
      extraction_confirmed: true,
      engine_input: engineInput,
      engine_report: engineReport,
      status: "routed",
      report_source: reportSource,
      humanCorrection: correction ?? { humanEditsApplied: false, fieldsEdited: 0, diffs: [] },
    };

    setPilotCase(newCase);
    setCompletedCases((prev) => upsertCompletedCase(prev, newCase));
    setFlowPhase("report");
  }

  function handleRunRouting(finalFields: CardioExtractionFields, correction: HumanCorrectionStatus) {
    if (!extraction) return;
    setHumanCorrection(correction);
    void runBackendRouting(narrative, exampleCaseId, extraction, finalFields, correction);
  }

  function handleBackToIntake() {
    setFlowPhase("intake");
    setRoutingError(null);
    setExtractionError(null);
  }

  function handleQaLoadScenario(narrative: string) {
    setSurface("flow");
    setFlowPhase("intake");
    // The IntakeScreen manages its own narrative state, so the user
    // will paste from clipboard. For a seamless experience, we copy
    // to clipboard and switch to intake.
    navigator.clipboard.writeText(narrative).catch(() => {});
  }

  function handleSendToReviewer(pc: PilotCase, persisted: boolean = false) {
    setReviewerQueue((prev) => {
      const updated = addCaseToQueue(prev, pc);
      if (persisted) {
        return updated.map((q) =>
          q.case_id === pc.case_id ? { ...q, persisted: true, persistence_status: "saved" as const } : q
        );
      }
      return updated;
    });
  }

  function handleResetSession() {
    setCompletedCases([]);
    setReviewerQueue([]);
    resetFlow();
    setSurface("flow");
  }

  function handleDemoLoadScenario(narrative: string) {
    setSurface("flow");
    setFlowPhase("intake");
    navigator.clipboard.writeText(narrative).catch(() => {});
  }

  function handleReviewerOpenReport(caseId: string) {
    const rc = reviewerCases.find((c) => c.case_id === caseId);
    if (!rc) return;

    const example = exampleCases.find((e) => e.id === rc.example_id);
    if (!example) return;

    const ext = extractFromNarrative(example.narrative, rc.example_id);

    // Reviewer reports still use mock (reviewer persistence is Stage 2B+)
    const { payload, report } = routeExtraction(ext, rc.example_id);

    const newCase: PilotCase = {
      case_id: caseId,
      created_at: rc.created_at,
      free_text_input: example.narrative,
      extraction: ext,
      extraction_confirmed: true,
      engine_input: payload,
      engine_report: report,
      status: "routed",
      report_source: "mock_fallback",
    };

    setPilotCase(newCase);
    setSurface("flow");
    setFlowPhase("report");
  }

  return (
    <TranslationProvider>
    <div className="min-h-screen bg-paper">
      <Header
        activeSurface={surface}
        onSurfaceChange={handleSurfaceChange}
        onLogoClick={handleLogoClick}
      />

      <main>
        {/* Pilot Flow surface */}
        {surface === "flow" && (
          <>
            {flowPhase === "welcome" && (
              <WelcomeScreen
                onStartCase={handleStartCase}
                onViewSampleReport={handleViewSampleReport}
              />
            )}

            {flowPhase === "intake" && (
              <IntakeScreen onSubmit={handleIntakeSubmit} />
            )}

            {flowPhase === "extracting" && (
              <section className="mx-auto max-w-6xl px-6 py-20 text-center">
                <div className="inline-flex items-center gap-3 rounded-xl border border-rule-light bg-warm-white px-6 py-4">
                  <span className="h-3 w-3 animate-pulse rounded-full bg-accent" />
                  <span className="font-mono text-body-sm text-ink-secondary">
                    {t("page.extracting")}
                  </span>
                </div>
              </section>
            )}

            {flowPhase === "extraction" && extraction && (
              <>
                {extractionError && (
                  <div className="mx-auto max-w-6xl px-6 pt-6">
                    <div className="rounded-lg border border-urgent/30 bg-urgent-soft/60 px-4 py-3">
                      <p className="text-body-sm text-urgent">
                        <span className="font-semibold">
                          {extractionErrorType === "timeout"
                            ? t("page.extraction_timeout")
                            : extractionErrorType === "network" || extractionErrorType === "backend_unavailable"
                              ? t("page.extraction_unavailable")
                              : t("page.extraction_failed")}
                        </span>
                        {" — "}{t("page.mock_fallback")}
                      </p>
                      <p className="mt-1 font-mono text-caption text-muted">
                        {extractionError}
                        {extractionDiag?.elapsedMs != null && ` · ${(extractionDiag.elapsedMs / 1000).toFixed(1)}s`}
                        {extractionDiag?.retried && ` · ${t("page.retried")}`}
                        {extractionDiag?.requestId && ` · ${extractionDiag.requestId}`}
                      </p>
                      <button
                        type="button"
                        onClick={handleRetryExtraction}
                        className="mt-2 rounded border border-urgent/40 bg-white px-3 py-1 font-mono text-caption text-urgent transition-colors hover:bg-urgent-soft/40"
                      >
                        {t("page.retry_extraction")}
                      </button>
                    </div>
                  </div>
                )}
                <ExtractionPreviewScreen
                  extraction={extraction}
                  onRunRouting={handleRunRouting}
                  onBack={handleBackToIntake}
                />
              </>
            )}

            {flowPhase === "routing" && (
              <section className="mx-auto max-w-6xl px-6 py-20 text-center">
                <div className="inline-flex items-center gap-3 rounded-xl border border-rule-light bg-warm-white px-6 py-4">
                  <span className="h-3 w-3 animate-pulse rounded-full bg-accent" />
                  <span className="font-mono text-body-sm text-ink-secondary">
                    {t("page.routing")}
                  </span>
                </div>
              </section>
            )}

            {flowPhase === "report" && pilotCase && (
              <>
                {routingError && (
                  <div className="mx-auto max-w-6xl px-6 pt-6">
                    <div className="rounded-lg border border-urgent/30 bg-urgent-soft/60 px-4 py-3">
                      <p className="text-body-sm text-urgent">
                        <span className="font-semibold">{t("page.backend_unavailable")}</span> — {t("page.mock_report_fallback")}
                      </p>
                      <p className="mt-1 font-mono text-caption text-muted">{routingError}</p>
                    </div>
                  </div>
                )}
                <ReportScreen
                  pilotCase={pilotCase}
                  onNewCase={resetFlow}
                  onSendToReviewer={handleSendToReviewer}
                  isInReviewerQueue={isCaseInQueue(reviewerQueue, pilotCase.case_id)}
                  persistedSessionId={persistedSessionId}
                />
              </>
            )}
          </>
        )}

        {/* Reviewer surface — feedback is inline */}
        {surface === "reviewer" && (
          <ReviewerWorkspace
            queue={reviewerQueue}
            onUpdateQueue={setReviewerQueue}
            onOpenReport={handleReviewerOpenReport}
            onReviewCase={() => {}}
          />
        )}

        {/* Metrics surface */}
        {surface === "metrics" && (
          <PilotMetricsDashboard
            completedCases={completedCases}
            reviewerQueue={reviewerQueue}
            metrics={sessionMetrics}
            persistedSessionId={persistedSessionId}
            persistedSessionStatus={persistedSessionStatus}
            persistedSessionLabel={persistedSessionLabel}
            persistedSessionError={persistedSessionError}
            onSetPersistedSessionId={setPersistedSessionId}
            onSetPersistedSessionStatus={setPersistedSessionStatus}
            onSetPersistedSessionLabel={setPersistedSessionLabel}
            onSetPersistedSessionError={setPersistedSessionError}
          />
        )}

        {/* Cost Impact surface */}
        {surface === "cost_impact" && <CostWorkflowImpactDashboard metrics={sessionMetrics} />}

        {/* Pilot Summary surface */}
        {surface === "pilot_summary" && <PilotSummary />}

        {/* QA surface */}
        {surface === "qa" && <QaScreen onLoadScenario={handleQaLoadScenario} />}

        {/* Demo Guide surface */}
        {surface === "demo_guide" && (
          <DemoGuide
            metrics={sessionMetrics}
            onLoadScenario={handleDemoLoadScenario}
            onResetSession={handleResetSession}
          />
        )}
      </main>
    </div>
    </TranslationProvider>
  );
}
