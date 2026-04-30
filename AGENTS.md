<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:swiggy-mcp-rules -->
# Swiggy Builders Club

This project integrates Swiggy MCP (Food, Instamart, Dineout). Authoritative docs:

- Index:     https://mcp.swiggy.com/builders/llms.txt
- Full text: https://mcp.swiggy.com/builders/llms-full.txt
- Per-page:  append `.md` to any https://mcp.swiggy.com/builders/docs/... URL

Tool catalog: `/docs/reference/{food,instamart,dineout}/<tool>.md`
Error codes: `/docs/reference/errors.md`
Auth flow:   `/docs/start/authenticate.md`

Rules:
1. Before recommending a Swiggy MCP tool name, parameter, error code, rate
   limit, or auth flow, fetch the relevant `.md` page and verify.
2. Never invent tool names or parameters. If a `.md` page doesn't cover the
   field you need (response schemas in particular are partial today), say so
   and fall back to the defensive normalizer pattern in
   `src/lib/swiggyMcp.ts` rather than guessing.
3. Prefer per-page `.md` fetches over `llms-full.txt` when the area is known
   — it's cheaper on context.
4. The MCP transport is JSON-RPC 2.0 (`tools/call`) over `POST /food` (or
   `/im` / `/dineout`) with `Authorization: Bearer <access_token>`. Inner
   envelope is `{ success, data, message? }` wrapped in MCP's `result.content[0].text`.
<!-- END:swiggy-mcp-rules -->
