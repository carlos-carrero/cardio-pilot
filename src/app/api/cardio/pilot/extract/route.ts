import { NextRequest, NextResponse } from "next/server";

/**
 * Next.js API route proxy for the Soficca Cardio Pilot extraction endpoint.
 * Forwards the extraction request to the real backend and returns the response.
 * If the backend is unavailable, returns a 502 with a structured error.
 *
 * This route has an extended maxDuration because AI extraction involves
 * Render cold start + OpenAI structured output latency.
 */

export const maxDuration = 60;

const BACKEND_URL =
  process.env.SOFICCA_BACKEND_URL ?? "http://localhost:8000";

function generateRequestId(): string {
  return `req-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function classifyError(err: unknown): "timeout" | "network" | "unknown" {
  if (err instanceof Error) {
    const msg = err.message.toLowerCase();
    if (msg.includes("abort") || msg.includes("timeout")) return "timeout";
    if (msg.includes("fetch") || msg.includes("econnrefused") || msg.includes("enotfound") || msg.includes("network")) return "network";
  }
  return "unknown";
}

export async function POST(request: NextRequest) {
  const requestId = generateRequestId();
  const startMs = Date.now();
  const endpoint = "/v1/cardio/pilot/extract";

  try {
    const body = await request.json();

    const backendResponse = await fetch(
      `${BACKEND_URL}${endpoint}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(55_000),
      }
    );

    const elapsedMs = Date.now() - startMs;

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error(
        `[extract-proxy] backend_error | request_id=${requestId} endpoint=${endpoint} status=${backendResponse.status} elapsed_ms=${elapsedMs}`,
      );
      return NextResponse.json(
        {
          error: "backend_error",
          error_type: "backend_error" as const,
          status: backendResponse.status,
          detail: errorText,
          elapsed_ms: elapsedMs,
          request_id: requestId,
        },
        { status: backendResponse.status },
      );
    }

    const data = await backendResponse.json();
    console.info(
      `[extract-proxy] ok | request_id=${requestId} endpoint=${endpoint} elapsed_ms=${elapsedMs}`,
    );
    return NextResponse.json(data);
  } catch (err) {
    const elapsedMs = Date.now() - startMs;
    const message = err instanceof Error ? err.message : "Unknown error";
    const errorType = classifyError(err);

    console.error(
      `[extract-proxy] ${errorType} | request_id=${requestId} endpoint=${endpoint} elapsed_ms=${elapsedMs} detail=${message}`,
    );

    return NextResponse.json(
      {
        error: "backend_unavailable",
        error_type: errorType,
        detail: message,
        elapsed_ms: elapsedMs,
        request_id: requestId,
      },
      { status: 502 },
    );
  }
}
