<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# LeadForge OS: Production SaaS Architectural Blueprint

Welcome to the **LeadForge OS** project guide. This document serves as the master blueprint, technical manual, and coding standard for the engineering team and autonomous agents working on this workspace. 

LeadForge OS is a high-performance, real-time B2B sales automation and lead orchestration SaaS startup platform. It is built for scalability, speed, and strict data security.

---

## 1. Vision, Mission & Target Customers

### Vision
To be the absolute operating system for modern business growth. We unify lead generation, customer data enrichment, relationship management, and sales outreach into a single, high-performance web console that feels instantaneous, unified, and delightful to operate.

### Product Mission
To empower sales development representatives (SDRs) and growth marketing teams with real-time lead ingestion pipelines, automated multi-vendor data enrichment, predictive AI lead scoring, and automated outreach sequences. All of this must run on a secure, low-latency, and fully accessible application architecture.

### Target Customers
1. **Growth-stage B2B SaaS Startups**: Teams looking to scale out-of-box pipeline operations and eliminate multi-tool clutter.
2. **Mid-Market Sales Organizations**: Teams requiring high-throughput lead enrichment, deduplication, and CRM data syncing.
3. **High-Velocity Agencies**: Multi-tenant agencies managing lead campaigns for dozens of external clients simultaneously.

---

## 2. Tech Stack & Ecosystem

LeadForge OS is built on a modern, modern-web-compliant, and fully typed technical stack:

*   **Meta-Framework**: Next.js 16.2.9 (App Router, Server Actions, Partial Prerendering (PPR), Streaming HTML).
*   **Core UI & Rendering**: React 19.2.4 (Async Transitions, `useActionState`, server-native form processing, client-side state optimization).
*   **Styling Engine**: Tailwind CSS v4.0 (Utilizes CSS-based `@theme` declarations instead of a legacy `tailwind.config.js` file).
*   **Component Architecture**: Shadcn UI combined with Radix UI Primitives (strictly configured for high-contrast accessibility).
*   **Icons & Motion**: Lucide React + `tw-animate-css` (for GPU-accelerated micro-animations).
*   **Database & ORM**: PostgreSQL (using Prisma or Drizzle ORM for type-safe query building and strict migration tracking).
*   **Caching & Queueing**: Redis (utilized for rate-limiting, background jobs queue tracking, and real-time session caching).
*   **Validation**: Schema-driven Zod validator pipelines on both client and API boundaries.
*   **Authentication**: Auth.js / NextAuth (secure sessions via HTTP-Only cookies, OAuth2, and webauthn/MFA support).

---

## 3. Folder Architecture

The workspace follows a strict, domain-driven directory structure designed to scale to hundreds of modules without degradation of code discoverability:

```txt
leadforge-os/
├── public/                 # Optimized SVGs, brand assets, and localization resources
├── src/
│   ├── app/                # Next.js App Router root
│   │   ├── (auth)/         # Auth pages: login, signup, password reset
│   │   ├── (dashboard)/    # Core SaaS dashboard, workspace management, CRM portals
│   │   ├── api/            # Public webhooks, REST API endpoints, and external service routers
│   │   ├── globals.css     # CSS Variables, Tailwind v4 imports, global layers
│   │   ├── layout.tsx      # Core root layout layout (enforces dark theme globally)
│   │   └── page.tsx        # High-performance homepage
│   ├── components/         # Modular UI Component Hub
│   │   ├── ui/             # Atomic, generic Shadcn/Radix components (e.g. Button, Input)
│   │   ├── shared/         # Multi-page layout modules (e.g. Navigation, Sidebar, Shells)
│   │   └── features/       # Feature-specific, domain-scoped widgets (e.g. LeadsTable, EnrichmentCard)
│   ├── lib/                # Shared utilities and libraries (Strictly NO React view code here)
│   │   ├── api/            # API client wrappers, fetch orchestration, interceptors
│   │   ├── db/             # Database connection, schemas, and direct queries
│   │   ├── hooks/          # Global client hooks (e.g. useDebounce, useMediaQuery)
│   │   ├── validation/     # Shared Zod validation schemas
│   │   └── utils.ts        # Pure, testable helper functions
│   ├── services/           # Business Logic Layer (Integrations, external platforms)
│   │   ├── enrichment/     # Integration logic for Clearbit, Hunter.io, LinkedIn scraper APIs
│   │   ├── email/          # Sequence and transactional triggers (Resend, SendGrid)
│   │   └── stripe/         # Billing engine, webhook processors, subscription logic
│   └── types/              # Global TypeScript declarations and domain type overrides
├── tsconfig.json           # Strictly typed TypeScript configuration
└── package.json            # Lockfiles and project dependencies
```

---

## 4. Coding Standards & Conventions

### TypeScript & Linting
*   **Strict Typing**: Every function, component parameter, and backend action must be fully typed. Use `interface` or `type` declarations. Avoid `any` at all costs. Prefer `unknown` with runtime type checks/guards.
*   **Implicit Casting**: Avoid `as` type assertion unless interfacing with un-typed external libraries. Validate data at boundaries using Zod.
*   **Strict Imports**: Use absolute path aliases (e.g. `@/components/ui/button` instead of relative references like `../../components/ui/button`).

### React 19 Standards
*   **Async Operations**: Leverage React 19's transition hooks (`useTransition`, `useActionState`) to manage pending UI states automatically.
*   **Forms**: Do not use heavy form-state management libraries (e.g., Formik). Utilize React 19's native `<form action={...}>` alongside Server Actions.
*   **State Management**: Keep client state as close to the leaf components as possible. Do not wrap the whole application in global context providers unless absolutely necessary.

### Next.js App Router Rules
*   **Server Components First**: By default, all components are Server Components. Use `'use client'` only for interactive leaf components that rely on React hooks, event listeners, or browser APIs.
*   **Suspense Boundaries**: Wrap page sub-components that perform dynamic database/API calls in `Suspense` and supply custom skeleton designs (`skeleton.tsx`).

---

## 5. UI Design System (Dark Theme Only)

LeadForge OS is designed exclusively around an immersive, low-strain dark mode. Light mode styles are not supported.

### Visual Aesthetic & Glassmorphism
*   **Atmospheric Dark Theme**: The system uses deep obsidian blues, true blacks, and slate gray gradients.
*   **Glassmorphism**: Dashboard cards use frosted glass overlays with subtle border borders:
    ```css
    background: rgba(15, 23, 42, 0.6);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    ```
*   **Micro-Animations**: Buttons, tabs, and interactive tables must display responsive micro-animations on hover or focus using `tw-animate-css` transitions.

### Tailwind v4 OKLCH Color Palette
All color values are defined in `globals.css` using OKLCH coordinates to yield high-fidelity dark shades:
*   `--background`: `oklch(0.145 0 0)` — Deepest canvas black
*   `--foreground`: `oklch(0.985 0 0)` — Soft off-white for body copy
*   `--card`: `oklch(0.205 0 0)` — Card background slate
*   `--primary`: `oklch(0.65 0.22 142)` — Electric mint accent green (representing lead growth)
*   `--accent`: `oklch(0.269 0 0)` — Muted interactive state highlights
*   `--destructive`: `oklch(0.55 0.22 28)` — Warnings and action reversals

---

## 6. Component Rules

*   **Zero Placeholders**: Never write empty components or `// TODO` markup blocks. Real mock data frameworks or functional fallbacks must be written when data is absent.
*   **Isolation**: Keep components self-contained. A component should not modify state in parent trees directly; use actions, events, or state hooks.
*   **Accessibility (a11y)**:
    *   Semantic HTML: Always use proper tags (`<main>`, `<header>`, `<nav>`, `<aside>`, `<article>`).
    *   Keyboard Navigation: Ensure components are fully focusable and navigable with a keyboard (`Tab`, `Enter`, `Space`, and Arrow keys).
    *   ARIA Roles: All non-native elements must feature standard `role` and `aria-*` tags. Leverage Radix UI to ensure access controls are complete.

---

## 7. API Conventions

All internal communication must favor **Next.js Server Actions** for operations mutating database rows. REST API endpoints are reserved for third-party webhook ingestions.

### Server Actions Architecture
*   **Schema Validation**: Every action must validate its payload against a Zod schema before processing logic.
*   **Response Format**: Actions must return a standardized status envelope:
    ```typescript
    type ActionResponse<T> =
      | { success: true; data: T }
      | { success: false; error: string; code: string; validationErrors?: Record<string, string[]> };
    ```
*   **Revalidation**: Use `revalidatePath` or `revalidateTag` in actions to keep client caches synchronized after data writes.

### REST Endpoints
*   **Versioning**: All endpoints reside under `src/app/api/v1/`.
*   **Rate Limiting**: Enforced globally on public routes utilizing middleware and Redis token buckets.

---

## 8. Database Conventions

*   **Strict Naming**: Tables use singular, lowercase, snake_case names (e.g., `lead`, `enrichment_run`, `organization`).
*   **Indexes**:
    *   Always use UUIDs or ULIDs for Primary Keys.
    *   Ensure foreign key constraints are indexed to speed up relational joins.
    *   Create composite indexes on columns frequently queried together (e.g., `[organization_id, status]`).
*   **Schema Safety**: Never bypass schema configurations. Direct raw database queries are forbidden unless performance benchmarks explicitly require it. In those cases, SQL injections must be prevented via parametrized query builders.

---

## 9. Performance & Core Web Vitals

To deliver instant-feeling interactions, LeadForge OS demands extreme optimization:

*   **Image Optimization**: Always utilize Next.js `<Image />` component with pre-computed sizes. Add the `priority` flag to critical hero graphics or first-view icons.
*   **Instant Client Navigation**: For paths critical to sales loops, export `unstable_instant` from the route definition:
    ```typescript
    export const unstable_instant = true;
    ```
*   **Streaming HTML**: Break layouts into nested chunks. Render critical navigations immediately, streaming secondary components (e.g. graphs, logs) using React Suspense blocks.

---

## 10. Security Rules

*   **CSRF & XSS Prevention**: Next.js Server Actions automatically protect against basic CSRF. Always sanitize user inputs containing HTML before rendering using clean libraries.
*   **Row-Level Security (RLS)**: Every database request must check tenant boundary constraints. Query parameters must explicitly enforce ownership checks:
    ```typescript
    where: { id: leadId, organizationId: user.organizationId }
    ```
*   **Sensitive Information**: API tokens, database URIs, and enrichment vendor credentials must reside in environment variables and never leak to client code bundles (no `NEXT_PUBLIC_` prefixes on sensitive keys).

---

## 11. Git Commit & Integration Rules

The codebase utilizes standard conventional commits:
*   `feat`: A new feature introduction
*   `fix`: A bug fix patch
*   `perf`: Performance-related refactorings
*   `security`: Security vulnerability mitigations
*   `docs`: Documentation changes
*   `refactor`: Structural codebase cleanups

Before opening any Pull Request, developers and agents must verify:
1. TypeScript compiles error-free (`npm run build` or `tsc --noEmit`).
2. The code conforms to ESLint guidelines (`npm run lint`).
3. Core layout routes build cleanly without broken links.

---

## 12. Mandate for AI Coding Agents

When working on this codebase, all autonomous agents must abide by the following constraints:

1.  **Read Next.js Docs First**: Under Next.js 16.2.9, verify the exact syntax for routing, cache control, and actions from `node_modules/next/dist/docs/` before implementing new paths.
2.  **No Placeholder Code**: Do not generate dummy cards, hardcoded arrays, or missing functions. All implementations must be production-ready and fully functional.
3.  **Explain Architectural Decisions**: If a task requires modifying a routing paradigm, database schema, or authentication flow, **explain the proposed design and rationale clearly to the developer before making changes.**
4.  **Enforce Mobile-First CSS**: Form layouts and data grids must be built mobile-first (`flex-col md:flex-row`, `grid-cols-1 lg:grid-cols-4`) to ensure the dashboard fits inside standard phone screens as well as large enterprise displays.
5.  **Always Build Scalable Code**: Write functions that degrade gracefully, support pagination, handle exceptions cleanly, and support high concurrent usage workloads.

