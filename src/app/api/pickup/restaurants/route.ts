import { NextResponse } from "next/server";
import { searchRestaurants, getMode } from "@/lib/swiggyMcp";

export const runtime = "nodejs";

interface PickupRequest {
  query?: string;
  vegOnly?: boolean;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as PickupRequest;
    const result = await searchRestaurants({
      query: body.query?.trim() || "",
      vegOnly: body.vegOnly,
    });

    return NextResponse.json({
      restaurants: result.data,
      source: result.source,
      mode: getMode(),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
