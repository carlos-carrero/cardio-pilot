import { NextRequest, NextResponse } from "next/server";

/**
 * Next.js API route proxy for reading a persisted case bundle.
 * GET → FastAPI /v1/cardio/pilot/cases/{case_id}
 */

const BACKEND_URL =
  process.env.SOFICCA_BACKEND_URL ?? "http://localhost:8000";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ caseId: string }> }
) {
  const { caseId } = await params;
  try {
    const backendResponse = await fetch(
      `${BACKEND_URL}/v1/cardio/pilot/cases/${encodeURIComponent(caseId)}`,
      {
        method: "GET",
        signal: AbortSignal.timeout(10_000),
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
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "backend_unavailable", detail: message },
      { status: 502 }
    );
  }
}
