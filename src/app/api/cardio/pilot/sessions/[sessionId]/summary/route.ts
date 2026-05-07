import { NextRequest, NextResponse } from "next/server";

/**
 * Next.js API route proxy for session summary.
 * POST → FastAPI POST /v1/cardio/pilot/sessions/{session_id}/summary
 * GET  → FastAPI GET  /v1/cardio/pilot/sessions/{session_id}/summary
 */

const BACKEND_URL =
  process.env.SOFICCA_BACKEND_URL ?? "http://localhost:8000";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;
  try {
    const body = await request.json();

    const backendResponse = await fetch(
      `${BACKEND_URL}/v1/cardio/pilot/sessions/${encodeURIComponent(sessionId)}/summary`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(15_000),
      }
    );

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      return NextResponse.json(
        { error: "backend_error", status: backendResponse.status, detail: errorText },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "backend_unavailable", detail: message },
      { status: 502 }
    );
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;
  try {
    const backendResponse = await fetch(
      `${BACKEND_URL}/v1/cardio/pilot/sessions/${encodeURIComponent(sessionId)}/summary`,
      { signal: AbortSignal.timeout(15_000) }
    );

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      return NextResponse.json(
        { error: "backend_error", status: backendResponse.status, detail: errorText },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "backend_unavailable", detail: message },
      { status: 502 }
    );
  }
}
