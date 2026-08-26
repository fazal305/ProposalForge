# ProposalForge

A reusable proposal-generation workspace for freelance software developers. Build a master
template once — static business/legal sections plus a variable system — then spin up a
polished, client-ready proposal per project in minutes instead of rebuilding the same
document from scratch every time.

> Educational / portfolio project. Terms & Conditions content is a reusable business
> template, not legal advice — see the note in Settings → Terms Library.

## Product overview

The core workflow: **Client → Project → Proposal (from Template) → Scope → Pricing →
Timeline → Payment Schedule → Preview → Share → Client Approves/Rejects/Requests Changes**.

Static content (About Me, Development Process, Terms, Payment Policy) is written once in
the Template Manager and reused across every proposal. Dynamic content (client name,
project scope, price, timeline) is filled in per proposal and merged in via a
`{{namespace.field}}` variable system with a picker UI — no manual retyping.

## Features

| Area | Status |
|---|---|
| Clients & Projects | Implemented |
| Template Manager (sections, static/dynamic, reorder, duplicate, disable) | Implemented |
| Variable system + picker | Implemented |
| Scope Builder (grouped items, include/exclude, reorder) | Implemented |
| Pricing Builder (line items, discount, tax, computed totals) | Implemented |
| Payment Schedule (presets + custom, percent → amount) | Implemented |
| Timeline / Milestones | Implemented |
| Proposal Preview (themed, print-quality) | Implemented |
| PDF export (`@react-pdf/renderer`, real document not a screenshot) | Implemented |
| Public share link + client Approve / Reject / Request Changes | Implemented |
| Proposal status lifecycle & activity log | Implemented |
| Proposal duplication | Implemented |
| Proposal versioning (frozen snapshot on send) | Implemented |
| Dashboard (real counts, revenue pipeline, recent proposals) | Implemented |
| Search & filter proposals | Implemented |
| Autosave indicator / offline-first local persistence | Implemented (local storage; see limitations) |
| Settings — developer profile, terms library, pricing defaults, numbering | Implemented |
| Generated initials logo | Implemented |
| Reorder via drag-and-drop | Placeholder — up/down buttons ship instead; see Known Limitations |
| Backend REST API (Prisma + Postgres) | Placeholder — schema + example routes written, not connected to a live DB |
| Auth (email/password, JWT) | Placeholder — server-side helpers written, no login UI wired up |
| AI Quote Assistant (OpenRouter) | Not implemented — architecture only, per project scope; see below |
| Multiple proposal themes (Minimal/Executive/Modern/Technical/Editorial presets) | Placeholder — theme *system* (colors, fonts, spacing, radius) is implemented and used by every proposal; only the five named presets themselves aren't pre-authored |

## Architecture

```
src/
  components/     shared primitives (Button, Card, FormField, StatusBadge, ...)
  layouts/        AppLayout (sidebar/topbar shell)
  pages/          route-level screens
  features/
    proposals/    ScopeBuilder, PricingBuilder, TimelineBuilder, PaymentScheduleBuilder,
                   SectionsEditor, ProposalRenderer (screen), ProposalPdfDocument (PDF)
  stores/         Zustand stores — clients, projects, templates, proposals, settings, sync
  lib/            pure logic: pricing.js, variables.js, markdownLite.jsx, generateLogo.js
  data/           seed data: default template, terms library, process phases, demo data
  schemas/        Zod validation schemas
  constants.js    shared display constants (e.g. proposal status labels)

api/              Vercel serverless functions (Prisma-backed reference implementation)
  _lib/           db.js (Prisma client), auth.js (bcrypt + JWT), errors.js
  clients/        example CRUD route
  public/proposals/[token].js   public token-based read + view tracking
  ai/quote.js     OpenRouter proxy (key stays server-side)

prisma/schema.prisma   full relational schema (users, clients, projects, templates,
                        proposals + versions/sections/scope/pricing/milestones/payment
                        schedules, views, approvals, activity log, AI generations)
```

### Data layer — why local-first right now

The app ships **fully functional using Zustand + `localStorage`** as its data layer. This
was a deliberate scope decision for this build, not a shortcut hidden from the user:

- No live PostgreSQL database was provisioned for this session (would need a Neon/Railway
  connection string the user supplies).
- The brief explicitly asks for offline-first draft protection — local persistence
  satisfies that directly.
- The complete relational schema (`prisma/schema.prisma`) and a handful of reference API
  routes are written and build cleanly, so wiring the frontend to the real backend is a
  contained follow-up: swap the Zustand actions for TanStack Query calls against `/api/*`,
  point `DATABASE_URL` at a real Postgres instance, run `npx prisma migrate dev`.

### Variable system

`src/lib/variables.js` resolves `{{client.name}}`, `{{project.total}}`,
`{{developer.email}}`, `{{proposal.number}}`, etc. against a `VariableContext` built per
proposal. Unresolved variables render as `[namespace.field]` rather than silently
disappearing, so a missing value is always visible before a proposal is sent.

### Pricing & payment-schedule math

All calculation lives in `src/lib/pricing.js`, is framework-free, and is unit tested
(`src/lib/pricing.test.js`). Totals are **always computed**, never typed in directly. Tax
is calculated on the post-discount amount. Payment-schedule percentages are converted to
amounts with the rounding remainder absorbed into the final entry so the parts always sum
exactly to the total.

## Tech stack

**Frontend** — React 19, Vite, JavaScript (JSX), React Router, Tailwind CSS v4, Zustand,
TanStack Query (installed, ready for the live-API swap), React Hook Form + Zod,
`@react-pdf/renderer` (lazy-loaded), Recharts (installed for future chart use).

**Backend (reference implementation)** — Vercel serverless functions, JavaScript, Prisma
ORM, PostgreSQL, bcryptjs + jsonwebtoken.

**AI** — OpenRouter, called only from `api/ai/quote.js`; the key never reaches the browser.

**Testing** — Vitest + jsdom.

## Local development

```bash
npm install
npm run dev       # http://localhost:5173
npm run test      # unit tests (pricing, variables, proposal store)
npm run build     # production build
```

No environment variables are required to run the app as shipped — it works entirely
against local storage. `.env` is only needed once you wire up the backend/AI:

```bash
cp .env.example .env
# fill in DATABASE_URL, JWT_SECRET, OPENROUTER_API_KEY as needed
```

### Database setup (when you're ready to connect the real backend)

1. Create a free Postgres database, e.g. at [neon.tech](https://neon.tech).
2. Put the pooled connection string in `.env` as `DATABASE_URL`.
3. `npx prisma migrate dev --name init`
4. `npx prisma generate`

### AI configuration

This is an **educational project — no OpenRouter API key is provided**. The AI Quote
Assistant architecture (`api/ai/quote.js`) is written and validated, but inert until you
supply your own key:

1. Get a key at [openrouter.ai/keys](https://openrouter.ai/keys).
2. Set `OPENROUTER_API_KEY` in your environment (never commit it).
3. The endpoint validates the model's JSON response with Zod before returning it; the
   frontend UI for this feature is not wired up in this build (see Known Limitations).

## Deployment

Two separate, required steps — pushing to GitHub is **not** the same as deploying:

1. **GitHub**: `git push` to the public `ProposalForge` repository.
2. **Vercel**: `vercel --prod` (or connect the repo in the Vercel dashboard). Set
   `DATABASE_URL`, `JWT_SECRET`, `OPENROUTER_API_KEY` as Vercel project environment
   variables if/when the backend is connected — the app runs without them otherwise.

`vercel.json` configures the Vite build output and SPA rewrites so client-side routes
(including `/proposal/:token`) survive a full page refresh in production.

## Security notes

- No secrets are hardcoded; `.env` is gitignored; `.env.example` documents required vars
  with placeholders only.
- Public proposal links use a random `publicToken`, never the internal database id.
- The AI endpoint validates model output with Zod before it reaches the client and never
  auto-applies AI pricing — every suggested value is meant to be user-edited before use.
- Server-side reference routes validate input with Zod and use Prisma's parameterized
  queries (no raw SQL string concatenation).

## Known limitations

- The backend REST API and auth are reference implementations, not connected to the
  shipped frontend — see "Data layer" above.
- The AI Quote Assistant has no frontend UI in this build (skipped per project scope) and
  requires a user-supplied `OPENROUTER_API_KEY` before its backend route does anything.
- Section and scope-item reordering uses up/down buttons rather than pointer drag-and-drop.
- Only one of the five named theme presets (the default) ships pre-authored; the
  underlying theme system (color, font, spacing, radius, header style) is fully
  configurable per template.
- Terms & Conditions content is a reusable starting template, not legal advice — reviewed
  by a qualified professional before real client use is the user's responsibility.

## Roadmap

- Wire the frontend to the Prisma/Postgres backend (swap Zustand actions for API calls).
- Login/auth UI against `api/auth/*`.
- AI Quote Assistant frontend (structured suggestions → editable pricing draft).
- Pointer-based drag-and-drop reordering.
- Additional pre-authored theme presets (Executive, Modern, Technical, Editorial).
