import { NextResponse } from "next/server";
import { searchMenu, getMode } from "@/lib/swiggyMcp";

export const runtime = "nodejs";

interface MenuRequest {
  restaurantId: string;
  query?: string;
  vegOnly?: boolean;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as MenuRequest;
    if (!body.restaurantId) {
      return NextResponse.json({ error: "restaurantId required" }, { status: 400 });
    }

    const result = await searchMenu({
      query: body.query?.trim() || "",
      vegOnly: body.vegOnly,
      restaurantId: body.restaurantId,
    });

    const items = result.data
      .filter((m) => m.restaurantId === body.restaurantId)
      .slice(0, 6);

    return NextResponse.json({
      items: items.length > 0 ? items : result.data.slice(0, 6),
      source: result.source,
      mode: getMode(),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
