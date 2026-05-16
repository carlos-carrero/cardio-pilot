/**
 * Frontend persistence API client (Stage 3E.1 + 3E.2 + 3E.3).
 *
 * Calls the Next.js proxy routes which forward to the FastAPI backend.
 * No direct database access. No secrets exposed.
 */

import type {
  PersistCaseBundlePayload,
  PersistCaseBundleResponse,
  PersistedCaseBundle,
  PersistenceStatus,
  PersistReviewerFeedbackPayload,
  PersistReviewerFeedbackResponse,
  ReviewerPersistenceStatus,
  PersistedCaseListResponse,
  CreatePilotSessionPayload,
  CreatePilotSessionResponse,
  SessionListResponse,
  PersistSessionSummaryPayload,
  PersistSessionSummaryResponse,
  PersistedSessionSummaryResponse,
  SessionPersistenceStatus,
} from "@/types";
import type { TranslationKey } from "@/i18n/en";

// ── Stable error codes (UI-side localization map) ───────────────
// `error` (raw string) is preserved as a diagnostic detail. `errorCode`
// is an optional, stable, UI-side discriminator for localized banners.
// No backend payload or API route is affected by these codes.

export type PersistErrorCode =
  | "case_persistence_unavailable"
  | "case_backend_unavailable"
  | "feedback_persistence_unavailable"
  | "feedback_backend_unavailable"
  | "session_backend_unavailable"
  | "network";

const PERSIST_ERROR_CODE_KEYS: Record<PersistErrorCode, TranslationKey> = {
  case_persistence_unavailable: "persist.error_case_persistence_unavailable",
  case_backend_unavailable: "persist.error_case_backend_unavailable",
  feedback_persistence_unavailable: "persist.error_feedback_persistence_unavailable",
  feedback_backend_unavailable: "persist.error_feedback_backend_unavailable",
  session_backend_unavailable: "persist.error_session_backend_unavailable",
  network: "persist.error_network",
};

/**
 * Resolve a localized banner string for a persistence client result.
 * Falls back to the raw backend `error` (diagnostic) if no `errorCode`
 * is set or the code is unknown.
 */
export function localizePersistError(
  result: { error: string; errorCode?: PersistErrorCode },
  t: (key: TranslationKey) => string,
): string {
  if (result.errorCode) {
    const key = PERSIST_ERROR_CODE_KEYS[result.errorCode];
    if (key) return t(key);
  }
  return result.error;
}

// ── Result types ────────────────────────────────────────────────

export type PersistResult =
  | { ok: true; data: PersistCaseBundleResponse; status: "saved" }
  | { ok: false; error: string; errorCode?: PersistErrorCode; status: PersistenceStatus };

export type ReadBundleResult =
  | { ok: true; data: PersistedCaseBundle }
  | { ok: false; error: string; errorCode?: PersistErrorCode };

export type ReviewerFeedbackResult =
  | { ok: true; data: PersistReviewerFeedbackResponse; status: "saved" }
  | { ok: false; error: string; errorCode?: PersistErrorCode; status: ReviewerPersistenceStatus };

export type CaseListResult =
  | { ok: true; data: PersistedCaseListResponse }
  | { ok: false; error: string; errorCode?: PersistErrorCode };

export type CreateSessionResult =
  | { ok: true; data: CreatePilotSessionResponse; status: "created" }
  | { ok: false; error: string; errorCode?: PersistErrorCode; status: SessionPersistenceStatus };

export type SessionListResult =
  | { ok: true; data: SessionListResponse }
  | { ok: false; error: string; errorCode?: PersistErrorCode };

export type SaveSummaryResult =
  | { ok: true; data: PersistSessionSummaryResponse }
  | { ok: false; error: string; errorCode?: PersistErrorCode };

export type GetSummaryResult =
  | { ok: true; data: PersistedSessionSummaryResponse }
  | { ok: false; error: string; errorCode?: PersistErrorCode };

// ── Persist case bundle ─────────────────────────────────────────

export async function persistCaseBundle(
  payload: PersistCaseBundlePayload,
): Promise<PersistResult> {
  try {
    const res = await fetch("/api/cardio/pilot/cases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.status === 201) {
      const data: PersistCaseBundleResponse = await res.json();
      return { ok: true, data, status: "saved" };
    }

    if (res.status === 409) {
      return { ok: false, error: "Case already exists in database.", status: "already_exists" };
    }

    if (res.status === 503) {
      return { ok: false, error: "Persistence unavailable — current session retained in browser.", errorCode: "case_persistence_unavailable", status: "unavailable" };
    }

    if (res.status === 502) {
      return { ok: false, error: "Backend unavailable — current session retained in browser.", errorCode: "case_backend_unavailable", status: "unavailable" };
    }

    const errData = await res.json().catch(() => ({}));
    const detail = errData.detail ?? errData.error ?? `HTTP ${res.status}`;
    return { ok: false, error: String(detail), status: "error" };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Network error";
    return { ok: false, error: msg, errorCode: "network", status: "unavailable" };
  }
}

// ── Read persisted case bundle ──────────────────────────────────

export async function getPersistedCase(caseId: string): Promise<ReadBundleResult> {
  try {
    const res = await fetch(`/api/cardio/pilot/cases/${encodeURIComponent(caseId)}`);

    if (res.ok) {
      const data: PersistedCaseBundle = await res.json();
      return { ok: true, data };
    }

    if (res.status === 404) {
      return { ok: false, error: "Case not found in database." };
    }

    const errData = await res.json().catch(() => ({}));
    return { ok: false, error: errData.detail ?? `HTTP ${res.status}` };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Network error";
    return { ok: false, error: msg };
  }
}

// ── Save reviewer feedback ──────────────────────────────────────

export async function saveReviewerFeedback(
  caseId: string,
  payload: PersistReviewerFeedbackPayload,
): Promise<ReviewerFeedbackResult> {
  try {
    const res = await fetch(`/api/cardio/pilot/cases/${encodeURIComponent(caseId)}/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.status === 201) {
      const data: PersistReviewerFeedbackResponse = await res.json();
      return { ok: true, data, status: "saved" };
    }

    if (res.status === 404) {
      return { ok: false, error: "Case not found in database. Save case before submitting review.", status: "error" };
    }

    if (res.status === 503) {
      return { ok: false, error: "Persistence unavailable — feedback retained in current session.", errorCode: "feedback_persistence_unavailable", status: "unavailable" };
    }

    if (res.status === 502) {
      return { ok: false, error: "Backend unavailable — feedback retained in current session.", errorCode: "feedback_backend_unavailable", status: "unavailable" };
    }

    const errData = await res.json().catch(() => ({}));
    const detail = errData.detail ?? errData.error ?? `HTTP ${res.status}`;
    return { ok: false, error: String(detail), status: "error" };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Network error";
    return { ok: false, error: msg, errorCode: "network", status: "unavailable" };
  }
}

// ── List persisted cases ────────────────────────────────────────

export async function listPersistedCases(
  params?: { session_id?: string; limit?: number; offset?: number },
): Promise<CaseListResult> {
  try {
    const query = new URLSearchParams();
    if (params?.session_id) query.set("session_id", params.session_id);
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.offset) query.set("offset", String(params.offset));

    const res = await fetch(`/api/cardio/pilot/cases?${query.toString()}`);

    if (res.ok) {
      const data: PersistedCaseListResponse = await res.json();
      return { ok: true, data };
    }

    if (res.status === 502 || res.status === 503) {
      return { ok: false, error: "Backend unavailable — cannot load persisted cases." };
    }

    const errData = await res.json().catch(() => ({}));
    return { ok: false, error: errData.detail ?? `HTTP ${res.status}` };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Network error";
    return { ok: false, error: msg };
  }
}

// ── Create pilot session ────────────────────────────────────────

export async function createPilotSession(
  payload: CreatePilotSessionPayload,
): Promise<CreateSessionResult> {
  try {
    const res = await fetch("/api/cardio/pilot/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.status === 201) {
      const data: CreatePilotSessionResponse = await res.json();
      return { ok: true, data, status: "created" };
    }

    if (res.status === 502 || res.status === 503) {
      return { ok: false, error: "Backend unavailable — session not created.", errorCode: "session_backend_unavailable", status: "unavailable" };
    }

    const errData = await res.json().catch(() => ({}));
    return { ok: false, error: errData.detail ?? `HTTP ${res.status}`, status: "error" };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Network error";
    return { ok: false, error: msg, errorCode: "network", status: "unavailable" };
  }
}

// ── List pilot sessions ─────────────────────────────────────────

export async function listPilotSessions(
  params?: { limit?: number; offset?: number },
): Promise<SessionListResult> {
  try {
    const query = new URLSearchParams();
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.offset) query.set("offset", String(params.offset));

    const res = await fetch(`/api/cardio/pilot/sessions?${query.toString()}`);

    if (res.ok) {
      const data: SessionListResponse = await res.json();
      return { ok: true, data };
    }

    const errData = await res.json().catch(() => ({}));
    return { ok: false, error: errData.detail ?? `HTTP ${res.status}` };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Network error";
    return { ok: false, error: msg };
  }
}

// ── Save session summary ────────────────────────────────────────

export async function saveSessionSummary(
  sessionId: string,
  payload: PersistSessionSummaryPayload,
): Promise<SaveSummaryResult> {
  try {
    const res = await fetch(`/api/cardio/pilot/sessions/${encodeURIComponent(sessionId)}/summary`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.status === 201) {
      const data: PersistSessionSummaryResponse = await res.json();
      return { ok: true, data };
    }

    if (res.status === 502 || res.status === 503) {
      return { ok: false, error: "Backend unavailable — session summary not saved." };
    }

    if (res.status === 409) {
      return { ok: false, error: "Session summary already exists." };
    }

    const errData = await res.json().catch(() => ({}));
    return { ok: false, error: errData.detail ?? `HTTP ${res.status}` };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Network error";
    return { ok: false, error: msg };
  }
}

// ── Get latest session summary ──────────────────────────────────

export async function getSessionSummary(
  sessionId: string,
): Promise<GetSummaryResult> {
  try {
    const res = await fetch(`/api/cardio/pilot/sessions/${encodeURIComponent(sessionId)}/summary`);

    if (res.ok) {
      const data: PersistedSessionSummaryResponse = await res.json();
      return { ok: true, data };
    }

    if (res.status === 404) {
      return { ok: false, error: "No persisted summary found for this session." };
    }

    const errData = await res.json().catch(() => ({}));
    return { ok: false, error: errData.detail ?? `HTTP ${res.status}` };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Network error";
    return { ok: false, error: msg };
  }
}
