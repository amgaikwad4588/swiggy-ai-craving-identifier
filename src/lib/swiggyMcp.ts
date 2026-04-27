/**
 * Swiggy Builders Club — MCP client
 * https://mcp.swiggy.com/builders/docs/
 *
 * Speaks Model Context Protocol over streamable HTTP (JSON-RPC 2.0). Auth is
 * OAuth 2.1 + PKCE — the user completes the flow once, the resulting bearer
 * goes in `SWIGGY_MCP_TOKEN`. While builder approval is pending, the client
 * runs in mock mode (curated catalog) and returns responses shaped exactly
 * like the real MCP envelope, so wiring the live token is a no-op swap.
 *
 *   Base URL:        https://mcp.swiggy.com
 *   Endpoints:       POST /food      (14 tools)
 *                    POST /dineout   (8 tools)
 *                    POST /im        (13 tools — not used yet)
 *   Auth header:     Authorization: Bearer <access_token>
 *   JSON-RPC method: tools/call
 *   Inner envelope:  { success: boolean, data: <tool-specific>, message?: string }
 */

const MCP_BASE = "https://mcp.swiggy.com";

export type McpServer = "food" | "dineout" | "im";

export interface McpAddress {
  id: string;
  label?: string;
  area: string;
  city: string;
  lat?: number;
  lng?: number;
}

export interface McpRestaurant {
  id: string;
  name: string;
  cuisines: string[];
  rating: number;
  prepTimeMin: number;
  distanceKm: number;
  costForTwo?: number;
  imageUrl?: string;
  emoji: string;
  bgColor: string;
  availabilityStatus: "OPEN" | "CLOSED" | "UNAVAILABLE";
}

export interface McpMenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  emoji: string;
  isVeg: boolean;
  rating?: number;
  tags: string[];
  restaurantId: string;
  restaurantName: string;
  imageUrl?: string;
}

export type McpMode = "live" | "mock";

export interface McpEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
  source: McpMode;
}

class SwiggyMcpError extends Error {
  constructor(message: string, public readonly mcpCode?: string) {
    super(message);
    this.name = "SwiggyMcpError";
  }
}

let cachedAddressId: string | null = null;

function getToken(): string | null {
  return process.env.SWIGGY_MCP_TOKEN?.trim() || null;
}

function mode(): McpMode {
  return getToken() ? "live" : "mock";
}

async function callTool<T>(
  server: McpServer,
  toolName: string,
  args: Record<string, unknown>,
): Promise<T> {
  const token = getToken();
  if (!token) {
    throw new SwiggyMcpError(
      "SWIGGY_MCP_TOKEN not set — caller should have used mock mode",
    );
  }

  const body = {
    jsonrpc: "2.0",
    id: cryptoRandomId(),
    method: "tools/call",
    params: { name: toolName, arguments: args },
  };

  const res = await fetch(`${MCP_BASE}/${server}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new SwiggyMcpError(
      `Swiggy MCP ${server}/${toolName} returned ${res.status}`,
      String(res.status),
    );
  }

  const json = (await res.json()) as {
    error?: { code: number; message: string };
    result?: { content: Array<{ type: string; text: string }>; isError?: boolean };
  };

  if (json.error) {
    throw new SwiggyMcpError(json.error.message, String(json.error.code));
  }

  const textBlock = json.result?.content?.find((c) => c.type === "text")?.text;
  if (!textBlock) {
    throw new SwiggyMcpError(`Empty result from ${toolName}`);
  }

  const inner = JSON.parse(textBlock) as { success: boolean; data: T; message?: string };
  if (!inner.success) {
    throw new SwiggyMcpError(inner.message || `${toolName} returned success=false`);
  }
  return inner.data;
}

function cryptoRandomId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
}

async function ensureAddressId(): Promise<string> {
  if (cachedAddressId) return cachedAddressId;
  if (mode() === "mock") {
    cachedAddressId = "addr_mock_ayodhya_nagar";
    return cachedAddressId;
  }
  const addresses = await callTool<McpAddress[]>("food", "get_addresses", {});
  if (!addresses || addresses.length === 0) {
    throw new SwiggyMcpError("No saved addresses on this Swiggy account");
  }
  cachedAddressId = addresses[0].id;
  return cachedAddressId;
}

// ────────────────────────────────────────────────────────────────────
//  Food server — search_restaurants, search_menu
// ────────────────────────────────────────────────────────────────────

export interface SearchRestaurantsInput {
  query: string;
  vegOnly?: boolean;
  offset?: number;
}

export async function searchRestaurants(
  input: SearchRestaurantsInput,
): Promise<McpEnvelope<McpRestaurant[]>> {
  if (mode() === "mock") {
    return {
      success: true,
      source: "mock",
      data: filterMockRestaurants(input.query, input.vegOnly),
      message: "Mock data — set SWIGGY_MCP_TOKEN for live results",
    };
  }
  const addressId = await ensureAddressId();
  const raw = await callTool<unknown>("food", "search_restaurants", {
    addressId,
    query: input.query,
    offset: input.offset ?? 0,
  });
  return {
    success: true,
    source: "live",
    data: normalizeRestaurants(raw),
  };
}

export interface SearchMenuInput {
  query: string;
  vegOnly?: boolean;
  restaurantId?: string;
  offset?: number;
}

export async function searchMenu(
  input: SearchMenuInput,
): Promise<McpEnvelope<McpMenuItem[]>> {
  if (mode() === "mock") {
    return {
      success: true,
      source: "mock",
      data: filterMockMenu(input.query, input.vegOnly),
      message: "Mock data — set SWIGGY_MCP_TOKEN for live results",
    };
  }
  const addressId = await ensureAddressId();
  const raw = await callTool<unknown>("food", "search_menu", {
    addressId,
    query: input.query,
    vegFilter: input.vegOnly ? 1 : 0,
    ...(input.restaurantId && { restaurantIdOfAddedItem: input.restaurantId }),
    offset: input.offset ?? 0,
  });
  return {
    success: true,
    source: "live",
    data: normalizeMenuItems(raw),
  };
}

export function getMode(): McpMode {
  return mode();
}

// ────────────────────────────────────────────────────────────────────
//  Live → typed normalization
// ────────────────────────────────────────────────────────────────────
//
// The MCP docs publish field types but not full response schemas (they cite
// `availabilityStatus`, `distanceKm`, `nextOffset`, `variantsV2`, etc.). The
// normalizers below defensively extract the fields we need and synthesize
// emoji/bgColor for UI affordance — when the real response shape is locked
// down post-onboarding, the extraction logic is the only thing to revisit.

interface RawObj {
  [key: string]: unknown;
}

function asString(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}
function asNumber(v: unknown, fallback = 0): number {
  return typeof v === "number" ? v : fallback;
}
function asBool(v: unknown, fallback = false): boolean {
  return typeof v === "boolean" ? v : fallback;
}

function normalizeRestaurants(raw: unknown): McpRestaurant[] {
  const list = Array.isArray(raw)
    ? raw
    : Array.isArray((raw as RawObj)?.restaurants)
      ? ((raw as RawObj).restaurants as unknown[])
      : Array.isArray((raw as RawObj)?.results)
        ? ((raw as RawObj).results as unknown[])
        : [];
  return list.map((r): McpRestaurant => {
    const o = r as RawObj;
    const cuisines = Array.isArray(o.cuisines)
      ? (o.cuisines as string[])
      : typeof o.cuisines === "string"
        ? [(o.cuisines as string)]
        : [];
    return {
      id: asString(o.id ?? o.restaurantId, "unknown"),
      name: asString(o.name, "Unknown restaurant"),
      cuisines,
      rating: asNumber(o.rating ?? o.avgRating, 4.0),
      prepTimeMin: asNumber(o.prepTimeMin ?? o.sla?.["minDeliveryTime" as never] ?? o.prepTime, 20),
      distanceKm: asNumber(o.distanceKm ?? o.distance, 0),
      costForTwo: asNumber(o.costForTwo),
      imageUrl: asString(o.imageUrl ?? o.cloudinaryImageId),
      emoji: pickRestaurantEmoji(cuisines),
      bgColor: pickRestaurantBg(cuisines),
      availabilityStatus:
        (asString(o.availabilityStatus, "OPEN") as McpRestaurant["availabilityStatus"]) || "OPEN",
    };
  });
}

function normalizeMenuItems(raw: unknown): McpMenuItem[] {
  const list = Array.isArray(raw)
    ? raw
    : Array.isArray((raw as RawObj)?.items)
      ? ((raw as RawObj).items as unknown[])
      : Array.isArray((raw as RawObj)?.results)
        ? ((raw as RawObj).results as unknown[])
        : [];
  return list.map((m): McpMenuItem => {
    const o = m as RawObj;
    const tags = Array.isArray(o.tags) ? (o.tags as string[]) : [];
    return {
      id: asString(o.id ?? o.itemId, "unknown"),
      name: asString(o.name, "Unknown dish"),
      description: asString(o.description),
      price: asNumber(o.price ?? o.finalPrice, 0) / (o.priceInPaise ? 100 : 1),
      emoji: pickDishEmoji(asString(o.name)),
      isVeg: asBool(o.isVeg),
      rating: asNumber(o.rating),
      tags,
      restaurantId: asString(o.restaurantId, "unknown"),
      restaurantName: asString(o.restaurantName, ""),
      imageUrl: asString(o.imageUrl),
    };
  });
}

function pickRestaurantEmoji(cuisines: string[]): string {
  const c = cuisines.join(" ").toLowerCase();
  if (c.includes("biryani") || c.includes("hyderabadi")) return "🍛";
  if (c.includes("pizza") || c.includes("italian")) return "🍕";
  if (c.includes("burger") || c.includes("american")) return "🍔";
  if (c.includes("chinese") || c.includes("noodle")) return "🍜";
  if (c.includes("dessert") || c.includes("bakery") || c.includes("ice cream")) return "🍰";
  if (c.includes("south indian") || c.includes("dosa")) return "🥞";
  if (c.includes("beverage") || c.includes("cafe") || c.includes("coffee")) return "☕";
  if (c.includes("chaat") || c.includes("street")) return "🥟";
  return "🍽️";
}

function pickRestaurantBg(cuisines: string[]): string {
  const c = cuisines.join(" ").toLowerCase();
  if (c.includes("biryani")) return "bg-amber-500";
  if (c.includes("pizza")) return "bg-red-500";
  if (c.includes("burger")) return "bg-orange-500";
  if (c.includes("chinese")) return "bg-rose-500";
  if (c.includes("dessert")) return "bg-pink-400";
  if (c.includes("south indian")) return "bg-yellow-500";
  if (c.includes("beverage") || c.includes("cafe")) return "bg-green-600";
  return "bg-orange-400";
}

function pickDishEmoji(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("biryani")) return "🍛";
  if (n.includes("pizza")) return "🍕";
  if (n.includes("burger")) return "🍔";
  if (n.includes("noodle") || n.includes("chowmein")) return "🍜";
  if (n.includes("paneer")) return "🧀";
  if (n.includes("chicken")) return "🍗";
  if (n.includes("dosa") || n.includes("idli")) return "🥞";
  if (n.includes("samosa") || n.includes("kachori")) return "🥟";
  if (n.includes("chocolate") || n.includes("brownie")) return "🍫";
  if (n.includes("cake") || n.includes("pastry")) return "🍰";
  if (n.includes("ice cream") || n.includes("kulfi")) return "🍨";
  if (n.includes("coffee")) return "☕";
  if (n.includes("juice") || n.includes("shake") || n.includes("lassi")) return "🥤";
  if (n.includes("salad") || n.includes("bowl")) return "🥗";
  if (n.includes("roll") || n.includes("wrap") || n.includes("kathi")) return "🌯";
  if (n.includes("pav") || n.includes("vada")) return "🍔";
  return "🍽️";
}

// ────────────────────────────────────────────────────────────────────
//  Mock data — shape-compatible with live MCP responses
// ────────────────────────────────────────────────────────────────────

const MOCK_RESTAURANTS: McpRestaurant[] = [
  { id: "r-meghana", name: "Meghana Foods", cuisines: ["Biryani", "North Indian"], rating: 4.5, prepTimeMin: 25, distanceKm: 1.2, costForTwo: 500, emoji: "🍛", bgColor: "bg-amber-500", availabilityStatus: "OPEN" },
  { id: "r-bk", name: "Burger King", cuisines: ["Burgers", "American"], rating: 4.2, prepTimeMin: 10, distanceKm: 0.8, costForTwo: 400, emoji: "🍔", bgColor: "bg-orange-500", availabilityStatus: "OPEN" },
  { id: "r-dominos", name: "Domino's Pizza", cuisines: ["Pizza", "Italian"], rating: 4.0, prepTimeMin: 20, distanceKm: 1.5, costForTwo: 600, emoji: "🍕", bgColor: "bg-red-500", availabilityStatus: "OPEN" },
  { id: "r-chai", name: "Chai Point", cuisines: ["Beverages", "Snacks"], rating: 4.3, prepTimeMin: 5, distanceKm: 0.5, costForTwo: 200, emoji: "☕", bgColor: "bg-green-600", availabilityStatus: "OPEN" },
  { id: "r-theobroma", name: "Theobroma", cuisines: ["Bakery", "Desserts"], rating: 4.6, prepTimeMin: 8, distanceKm: 1.0, costForTwo: 350, emoji: "🍰", bgColor: "bg-pink-400", availabilityStatus: "OPEN" },
  { id: "r-bikanervala", name: "Bikanervala", cuisines: ["North Indian", "Sweets"], rating: 4.2, prepTimeMin: 12, distanceKm: 1.7, costForTwo: 300, emoji: "🥟", bgColor: "bg-yellow-500", availabilityStatus: "OPEN" },
  { id: "r-wok", name: "Wok Express", cuisines: ["Chinese", "Asian"], rating: 4.1, prepTimeMin: 15, distanceKm: 1.3, costForTwo: 350, emoji: "🍜", bgColor: "bg-rose-500", availabilityStatus: "OPEN" },
  { id: "r-adigas", name: "Vasudev Adiga's", cuisines: ["South Indian", "Dosa"], rating: 4.4, prepTimeMin: 8, distanceKm: 0.9, costForTwo: 250, emoji: "🥞", bgColor: "bg-yellow-500", availabilityStatus: "OPEN" },
];

const MOCK_MENU: McpMenuItem[] = [
  // Biryani / Comfort / Indian
  { id: "m-1", name: "Chicken Biryani", price: 249, emoji: "🍛", isVeg: false, rating: 4.5, tags: ["Spicy", "Bestseller", "Hyderabadi"], restaurantId: "r-meghana", restaurantName: "Meghana Foods" },
  { id: "m-2", name: "Paneer Butter Masala", price: 199, emoji: "🧀", isVeg: true, rating: 4.3, tags: ["Rich", "North Indian"], restaurantId: "r-meghana", restaurantName: "Meghana Foods" },
  { id: "m-3", name: "Butter Chicken", price: 349, emoji: "🍗", isVeg: false, rating: 4.5, tags: ["Rich", "Creamy"], restaurantId: "r-meghana", restaurantName: "Meghana Foods" },
  { id: "m-4", name: "Dal Makhani", price: 179, emoji: "🍲", isVeg: true, rating: 4.4, tags: ["Slow-cooked", "Punjabi"], restaurantId: "r-bikanervala", restaurantName: "Bikanervala" },
  { id: "m-5", name: "Veg Biryani", price: 169, emoji: "🍛", isVeg: true, rating: 4.1, tags: ["Aromatic"], restaurantId: "r-meghana", restaurantName: "Meghana Foods" },
  // Pizza / Indulgence
  { id: "m-10", name: "Loaded Cheese Burst Pizza", price: 399, emoji: "🍕", isVeg: true, rating: 4.1, tags: ["Cheesy", "Loaded"], restaurantId: "r-dominos", restaurantName: "Domino's Pizza" },
  { id: "m-11", name: "Farmhouse Pizza", price: 349, emoji: "🍕", isVeg: true, rating: 4.0, tags: ["Veggie", "Bestseller"], restaurantId: "r-dominos", restaurantName: "Domino's Pizza" },
  { id: "m-12", name: "Garlic Bread", price: 99, emoji: "🥖", isVeg: true, rating: 4.0, tags: ["Side"], restaurantId: "r-dominos", restaurantName: "Domino's Pizza" },
  // Burgers
  { id: "m-20", name: "Whopper", price: 179, emoji: "🍔", isVeg: false, rating: 4.2, tags: ["Bestseller", "Filling"], restaurantId: "r-bk", restaurantName: "Burger King" },
  { id: "m-21", name: "Veg Crispy Burger", price: 99, emoji: "🍔", isVeg: true, rating: 3.9, tags: ["Quick", "Budget"], restaurantId: "r-bk", restaurantName: "Burger King" },
  { id: "m-22", name: "French Fries (Large)", price: 119, emoji: "🍟", isVeg: true, rating: 4.0, tags: ["Crispy"], restaurantId: "r-bk", restaurantName: "Burger King" },
  // Chinese
  { id: "m-30", name: "Schezwan Noodles", price: 179, emoji: "🍜", isVeg: true, rating: 4.1, tags: ["Spicy", "Indo-Chinese"], restaurantId: "r-wok", restaurantName: "Wok Express" },
  { id: "m-31", name: "Chicken Manchurian", price: 219, emoji: "🍜", isVeg: false, rating: 4.2, tags: ["Saucy"], restaurantId: "r-wok", restaurantName: "Wok Express" },
  { id: "m-32", name: "Veg Spring Rolls", price: 89, emoji: "🥢", isVeg: true, rating: 4.0, tags: ["Crispy"], restaurantId: "r-wok", restaurantName: "Wok Express" },
  // South Indian
  { id: "m-40", name: "Masala Dosa", price: 99, emoji: "🥞", isVeg: true, rating: 4.5, tags: ["Classic", "South Indian"], restaurantId: "r-adigas", restaurantName: "Vasudev Adiga's" },
  { id: "m-41", name: "Idli Sambar (4pc)", price: 69, emoji: "🫕", isVeg: true, rating: 4.4, tags: ["Steamed", "Light"], restaurantId: "r-adigas", restaurantName: "Vasudev Adiga's" },
  { id: "m-42", name: "Filter Coffee", price: 49, emoji: "☕", isVeg: true, rating: 4.6, tags: ["Hot", "Classic"], restaurantId: "r-adigas", restaurantName: "Vasudev Adiga's" },
  // Beverages / Comfort
  { id: "m-50", name: "Masala Chai + Bun Maska", price: 89, emoji: "☕", isVeg: true, rating: 4.2, tags: ["Hot", "Comfort"], restaurantId: "r-chai", restaurantName: "Chai Point" },
  { id: "m-51", name: "Cold Coffee Frappe", price: 159, emoji: "🥤", isVeg: true, rating: 4.4, tags: ["Cold", "Caffeine"], restaurantId: "r-chai", restaurantName: "Chai Point" },
  { id: "m-52", name: "Vada Pav", price: 49, emoji: "🍔", isVeg: true, rating: 4.0, tags: ["Mumbai", "Spicy"], restaurantId: "r-chai", restaurantName: "Chai Point" },
  // Desserts
  { id: "m-60", name: "Chocolate Lava Cake", price: 189, emoji: "🍫", isVeg: true, rating: 4.6, tags: ["Premium", "Dessert"], restaurantId: "r-theobroma", restaurantName: "Theobroma" },
  { id: "m-61", name: "Red Velvet Pastry", price: 149, emoji: "🍰", isVeg: true, rating: 4.4, tags: ["Cake", "Premium"], restaurantId: "r-theobroma", restaurantName: "Theobroma" },
  { id: "m-62", name: "Double Chocolate Brownie", price: 129, emoji: "🍫", isVeg: true, rating: 4.7, tags: ["Rich", "Dessert"], restaurantId: "r-theobroma", restaurantName: "Theobroma" },
  // Street food / Chaat
  { id: "m-70", name: "Pani Puri (6pc)", price: 49, emoji: "💧", isVeg: true, rating: 4.3, tags: ["Tangy", "Chaat"], restaurantId: "r-bikanervala", restaurantName: "Bikanervala" },
  { id: "m-71", name: "Samosa (2pc)", price: 39, emoji: "🥟", isVeg: true, rating: 4.2, tags: ["Crispy", "Snack"], restaurantId: "r-bikanervala", restaurantName: "Bikanervala" },
  { id: "m-72", name: "Chole Bhature", price: 129, emoji: "🫓", isVeg: true, rating: 4.3, tags: ["North Indian", "Spicy"], restaurantId: "r-bikanervala", restaurantName: "Bikanervala" },
  { id: "m-73", name: "Gulab Jamun (4pc)", price: 79, emoji: "🍮", isVeg: true, rating: 4.3, tags: ["Sweet", "Hot"], restaurantId: "r-bikanervala", restaurantName: "Bikanervala" },
];

function filterMockRestaurants(query: string, vegOnly?: boolean): McpRestaurant[] {
  const q = query.toLowerCase().trim();
  let list = MOCK_RESTAURANTS;
  if (q) {
    const matches = list.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.cuisines.some((c) => c.toLowerCase().includes(q)),
    );
    if (matches.length > 0) list = matches;
  }
  if (vegOnly) {
    // restaurants don't carry per-item veg, so we don't filter heavily — leave list intact
  }
  return list.slice(0, 8);
}

function filterMockMenu(query: string, vegOnly?: boolean): McpMenuItem[] {
  const q = query.toLowerCase().trim();
  let list = MOCK_MENU;
  if (vegOnly) list = list.filter((m) => m.isVeg);
  if (q) {
    const tokens = q.split(/\s+/).filter(Boolean);
    list = list
      .map((item) => {
        const haystack = [item.name, ...item.tags, item.restaurantName]
          .join(" ")
          .toLowerCase();
        const score = tokens.reduce(
          (s, t) => s + (haystack.includes(t) ? 1 : 0),
          0,
        );
        return { item, score };
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ item }) => item);
  }
  return list.slice(0, 12);
}

export { SwiggyMcpError };
