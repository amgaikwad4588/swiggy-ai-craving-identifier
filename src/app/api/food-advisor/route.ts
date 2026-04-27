import { NextResponse } from "next/server";
import { searchMenu, getMode, type McpMenuItem, type McpMode } from "@/lib/swiggyMcp";

export const runtime = "nodejs";

type CravingCategory =
  | "full_meal"
  | "quick_snack"
  | "dessert_sweet"
  | "comfort_food"
  | "light_healthy"
  | "street_food"
  | "beverage"
  | "indulgence";

interface AdvisorRequest {
  craving: CravingCategory;
  diet?: "veg" | "vegan" | "egg" | "nonveg";
  ingredient?: string;
  budgetTier?: "low" | "mid" | "high" | "unlimited";
  spice?: "none" | "mild" | "medium" | "extreme";
}

interface AdvisorRecommendation {
  name: string;
  restaurant: string;
  emoji: string;
  rating: number;
  price: string;
  prepTime: string;
  matchScore: number;
  reason: string;
  tags: string[];
}

const cravingQueries: Record<CravingCategory, string[]> = {
  full_meal: ["biryani", "thali", "chicken curry", "dal rice"],
  quick_snack: ["samosa", "momos", "spring rolls", "fries"],
  dessert_sweet: ["chocolate cake", "ice cream", "gulab jamun", "brownie"],
  comfort_food: ["butter chicken", "dal makhani", "pasta", "khichdi"],
  light_healthy: ["salad", "idli", "fruit bowl", "soup"],
  street_food: ["chaat", "pani puri", "vada pav", "kathi roll"],
  beverage: ["cold coffee", "mango lassi", "masala chai", "shake"],
  indulgence: ["cheese pizza", "loaded burger", "nachos", "lava cake"],
};

const ingredientQueries: Record<string, string> = {
  chicken: "chicken",
  paneer: "paneer",
  cheese: "cheese pizza",
  chocolate: "chocolate",
};

function buildQueryPlan(req: AdvisorRequest): string[] {
  const queries: string[] = [];
  if (req.ingredient && req.ingredient !== "none" && ingredientQueries[req.ingredient]) {
    queries.push(ingredientQueries[req.ingredient]);
  }
  queries.push(...cravingQueries[req.craving]);
  return queries;
}

async function searchUntilHit(
  req: AdvisorRequest,
  vegOnly: boolean,
): Promise<{ items: McpMenuItem[]; source: McpMode; query: string }> {
  for (const q of buildQueryPlan(req)) {
    const result = await searchMenu({ query: q, vegOnly });
    if (result.data.length > 0) {
      return { items: result.data, source: result.source, query: q };
    }
  }
  // Last resort: empty query pulls the broader catalog so we never hand back []
  const fallback = await searchMenu({ query: "", vegOnly });
  return { items: fallback.data, source: fallback.source, query: "" };
}

function budgetCeiling(tier?: AdvisorRequest["budgetTier"]): number {
  switch (tier) {
    case "low": return 100;
    case "mid": return 250;
    case "high": return 500;
    default: return Number.MAX_SAFE_INTEGER;
  }
}

function rankRecommendations(
  items: McpMenuItem[],
  req: AdvisorRequest,
): AdvisorRecommendation[] {
  const ceiling = budgetCeiling(req.budgetTier);
  const vegOnly = req.diet === "veg" || req.diet === "vegan";

  const scored = items
    .filter((m) => !vegOnly || m.isVeg)
    .map((m) => {
      let score = (m.rating ?? 4) * 10;
      if (m.price <= ceiling) score += 8;
      else score -= Math.min(20, (m.price - ceiling) / 10);

      if (req.ingredient && m.name.toLowerCase().includes(req.ingredient.toLowerCase())) {
        score += 12;
      }
      if (req.craving === "indulgence" && m.tags.some((t) => /loaded|cheesy|premium/i.test(t))) {
        score += 6;
      }
      if (req.craving === "comfort_food" && m.tags.some((t) => /rich|comfort|slow/i.test(t))) {
        score += 6;
      }
      if (req.craving === "light_healthy" && m.tags.some((t) => /light|healthy|steamed|fresh/i.test(t))) {
        score += 6;
      }
      if (req.spice === "extreme" && m.tags.some((t) => /spicy|fiery/i.test(t))) score += 4;
      if (req.spice === "none" && m.tags.some((t) => /spicy|fiery/i.test(t))) score -= 8;

      return { item: m, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (scored.length === 0) return [];
  const top = scored[0].score;

  return scored.map(({ item, score }, i) => ({
    name: item.name,
    restaurant: item.restaurantName || "Swiggy partner",
    emoji: item.emoji,
    rating: item.rating ?? 4.2,
    price: `₹${Math.round(item.price)}`,
    prepTime: "20 min",
    matchScore: Math.max(98 - i * 7, Math.round((score / Math.max(top, 1)) * 90)),
    reason: buildReason(item, req),
    tags: item.tags.slice(0, 3),
  }));
}

function buildReason(item: McpMenuItem, req: AdvisorRequest): string {
  if (req.ingredient && item.name.toLowerCase().includes(req.ingredient.toLowerCase())) {
    return `has the ${req.ingredient} you're craving`;
  }
  switch (req.craving) {
    case "comfort_food": return "warm, slow-cooked match for your mood";
    case "indulgence": return "full indulgence — exactly what you asked for";
    case "dessert_sweet": return "the sugar hit your craving profile signaled";
    case "light_healthy": return "fresh and energizing — fits your vibe";
    case "street_food": return "bold chatpata flavors for your mood";
    case "beverage": return "refreshing pick-me-up";
    case "quick_snack": return "perfect for casual munching";
    case "full_meal": return "fills the hunger gap you described";
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AdvisorRequest;
    if (!body.craving) {
      return NextResponse.json({ error: "craving required" }, { status: 400 });
    }

    const vegOnly = body.diet === "veg" || body.diet === "vegan";
    const { items, source, query } = await searchUntilHit(body, vegOnly);
    const recommendations = rankRecommendations(items, body);

    return NextResponse.json({
      recommendations,
      query,
      source,
      mode: getMode(),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
