import { NextRequest, NextResponse } from "next/server";

/**
 * Next.js API route proxy for Cardio Pilot persistence endpoints.
 * POST → FastAPI /v1/cardio/pilot/cases (persist case bundle)
 * GET  → FastAPI /v1/cardio/pilot/cases (list cases)
 */

const BACKEND_URL =
  process.env.SOFICCA_BACKEND_URL ?? "http://localhost:8000";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const backendResponse = await fetch(
      `${BACKEND_URL}/v1/cardio/pilot/cases`,
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
        {
          error: "backend_error",
          status: backendResponse.status,
          detail: errorText,
        },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "backend_unavailable", detail: message },
      { status: 502 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = new URLSearchParams();
    if (searchParams.get("session_id")) params.set("session_id", searchParams.get("session_id")!);
    if (searchParams.get("limit")) params.set("limit", searchParams.get("limit")!);
    if (searchParams.get("offset")) params.set("offset", searchParams.get("offset")!);

    const backendResponse = await fetch(
      `${BACKEND_URL}/v1/cardio/pilot/cases?${params.toString()}`,
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
