import { NextRequest, NextResponse } from "next/server";

/**
 * Next.js API route proxy for pilot sessions.
 * POST → FastAPI POST /v1/cardio/pilot/sessions
 * GET  → FastAPI GET  /v1/cardio/pilot/sessions
 */

const BACKEND_URL =
  process.env.SOFICCA_BACKEND_URL ?? "http://localhost:8000";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const backendResponse = await fetch(
      `${BACKEND_URL}/v1/cardio/pilot/sessions`,
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = new URLSearchParams();
    if (searchParams.has("limit")) query.set("limit", searchParams.get("limit")!);
    if (searchParams.has("offset")) query.set("offset", searchParams.get("offset")!);

    const backendResponse = await fetch(
      `${BACKEND_URL}/v1/cardio/pilot/sessions?${query.toString()}`,
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
