# AXIA Assistant — Architectural & Operational Guide

The **AXIA Assistant** is a grounded enterprise AI assistant designed for the Axia Kairos website. It answers visitor inquiries about services, case studies, industries, insights, careers, approach, offices, and products with **zero hallucination**, backed by rigorous guardrails, single-source-of-truth knowledge indexing, and automated evaluation suites.

---

## 1. Architecture Overview

The system is structured in two synchronized tiers:

1. **Frontend UI (`src/features/assistant/`)**:
   - **Dedicated Page (`/assistant`)**: Full two-panel responsive layout featuring a dark glass promo panel (`#0E1B33` at 85% opacity with backdrop blur) on the left (desktop only, $\ge$ 1024px) and the frosted glass chat panel on the right.
   - **Global Floating Launcher (`AssistantLauncher`)**: Available on all pages (automatically hidden on `/assistant`). Expands into a floating chat modal ($420\times680\text{px}$ on desktop, full-screen sheet on mobile) with focus trapping and ESC closing.
   - **Lazy Loading**: `AssistantPage` and `ChatPanel` are lazy-loaded via `React.lazy()` and code-split chunks so the initial application bundle size is unaffected.
   - **State Persistence**: Reducer-managed state machine persisted across sessions in `sessionStorage`.
   - **Rich Parts Supported**: Streamed text tokens, interactive scroll-snap cards row, validated quick-reply chips with refresh button, factual sources row, in-chat human handoff form, and transcript download (`.txt`).

2. **Backend Server & Guardrails (`server/`)**:
   - **API Server (`server/index.ts`)**: Express server providing `GET /api/health`, `POST /api/chat` (Server-Sent Events streaming), and `POST /api/handoff`.
   - **Retrieval Engine (`server/retrieval.ts`)**: In-memory BM25 index powered by MiniSearch with field boost weighting (`title: 4.0`, `slug: 3.0`, `section: 2.0`, `text: 1.0`), query normalization with technical acronym synonyms (S/4HANA, BTP, RPA, AMS, IAM), and exact-title boost.
   - **Dual Model Engine (`server/chat-engine.ts`)**:
     - *Online Model*: Streams tokens via Anthropic Claude 3.5 Sonnet (`@anthropic-ai/sdk`) using server-side tool execution (`search_knowledge`, `list_services`, `get_service`, `show_cards`, `start_human_handoff`).
     - *Grounded Offline Engine*: Deterministic fallback engine providing 100% grounded answers, source citation, and structured cards even without an API key or when network connectivity is limited.
   - **Guardrails (`server/guardrails.ts`)**:
     - *URL Sanitizer*: Strips unauthorized external URLs or unverified internal routes against `VALID_INTERNAL_ROUTES` dynamically derived from `knowledge.json`.
     - *Numeric / Metric Grounding Check*: Verifies percentages, dollar metrics, and multipliers in generated text against retrieved context.
     - *Inquiry & Handoff Logging*: Appends unanswered queries to `server/logs/unanswered.jsonl` and advisory handoff requests to `server/logs/handoffs.jsonl`.

---

## 2. Environment Variables

Create a `.env` file in the root directory (modeled after `.env.example`):

```bash
# Server Port (default: 3001)
PORT=3001

# Anthropic Claude API Configuration
ANTHROPIC_API_KEY=your_anthropic_api_key_here
CHAT_MODEL=claude-3-5-sonnet-latest   # or claude-3-5-haiku-latest for high throughput/low cost

# CORS & Allowed Origins (comma-separated)
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,https://axiakairos.com

# Human Advisory Handoff Target Endpoint (optional)
HANDOFF_ENDPOINT=https://api.axiakairos.com/v1/advisory-inquiries
```

> [!NOTE]
> If `ANTHROPIC_API_KEY` is not provided, the server automatically operates in **Grounded Deterministic Mode**, guaranteeing 100% factual accuracy and source attachment directly from `server/knowledge.json`.

---

## 3. Rebuilding the Knowledge Base

The Knowledge Base is derived strictly from the typed data files in `src/data/` (`services.ts`, `caseStudies.ts`, `blogs.ts`, `jobs.ts`, `industries.ts`, `products.ts`, `about.ts`, `approach.ts`, `contact.ts`, `legal.ts`).

To regenerate the structured knowledge base:

```bash
npm run kb:build
```

This compiles all chunks into `server/knowledge.json` (108 chunks across 10 content registries).

> [!TIP]
> `npm run kb:build` and `npm run test:retrieval` run automatically during `prebuild` before every production build.

---

## 4. Running Tests & Evaluations

### A. Unit Tests (Retrieval & Guardrails)
Tests top-3 retrieval matching for every service and case-study title/slug, internal URL validation, and numeric grounding checks:

```bash
npm test
# or
npm run test:retrieval
```

### B. Chatbot Evaluation Suite (92 Test Cases)
Tests real SSE streaming against `POST /api/chat` across 13 domains (services, case studies, industries, blogs, careers, offices, approach, about, products, unknowns, prompt injections, off-topic, ambiguous queries):

```bash
npm run chatbot:eval
```

**Evaluation Acceptance Criteria**:
- $\ge 95\%$ factual pass rate (`mustMention` + `expectedSources`)
- $100\%$ refusal on off-topic and prompt-injection attempts
- $100\%$ handoff trigger on unknown inquiries (pricing, employee count, confidential client names)
- $0$ invented or unauthorized URLs

---

## 5. Reviewing Unanswered Questions & Handoff Logs

### Unanswered Questions Log (`server/logs/unanswered.jsonl`)
When a visitor asks a question that does not match website content, the bot logs the inquiry without PII:

```json
{"timestamp":"2026-10-18T18:45:00.000Z","question":"What are your payment terms for enterprise projects?","retrievedTopTitles":["Contact & Scoping","Services Index"]}
```

**How to review**:
```bash
# View recent unanswered queries
tail -n 20 server/logs/unanswered.jsonl
```
Use this feedback log to add new content to `src/data/*.ts` or refine existing service descriptions.

### Human Advisory Handoffs Log (`server/logs/handoffs.jsonl`)
Submissions through the in-chat handoff form are saved with client contact details, message, and the last 10 messages of transcript context:

```json
{
  "timestamp": "2026-10-18T18:45:30.000Z",
  "fullName": "Jane Doe",
  "email": "jane@enterprise.com",
  "phone": "+1 416-555-0199",
  "company": "Global Energy Corp",
  "message": "We would like to discuss an S/4HANA migration roadmap.",
  "attachmentsCount": 1,
  "transcriptSnippet": [...]
}
```

---

## 6. Deployment Guide

### Option A: Node / Express Server (Standalone or Container)
1. Build the frontend and knowledge base:
   ```bash
   npm run build
   ```
2. Start the Express backend on your host or container:
   ```bash
   NODE_ENV=production npx tsx server/index.ts
   ```
3. Proxy `/api` from your reverse proxy (Nginx, Caddy, Cloudflare) to `http://localhost:3001`.

### Option B: Vercel / Netlify Serverless
- Export the endpoints as Serverless functions:
  - `api/chat.ts` -> handles SSE streaming
  - `api/health.ts` -> returns health status
  - `api/handoff.ts` -> logs/forwards advisory requests
- Add `server/knowledge.json` to function bundle assets via `includeFiles` in `vercel.json` or `netlify.toml`.
