import { NextRequest, NextResponse } from "next/server";

/**
 * Next.js API route proxy for the Soficca Cardio Pilot extraction endpoint.
 * Forwards the extraction request to the real backend and returns the response.
 * If the backend is unavailable, returns a 502 with a structured error.
 */

const BACKEND_URL =
  process.env.SOFICCA_BACKEND_URL ?? "http://localhost:8000";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const backendResponse = await fetch(
      `${BACKEND_URL}/v1/cardio/pilot/extract`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(30_000),
      }
    );

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      return NextResponse.json(
        {
          error: "backend_error",
          status: backendResponse.status,
          detail: errorText,
        },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    return NextResponse.json(data);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "backend_unavailable", detail: message },
      { status: 502 }
    );
  }
}
