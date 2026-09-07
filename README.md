# Vyara Amogya Technologies — Marketing & Commercial Operations Platform

> **IMPORTANT: Read `/docs` first before writing code or modifying specifications.**

This repository implements the premium marketing and commercial operations website for **Vyara Amogya Technologies**, featuring the interactive character **AMO** alongside full-stack digital capabilities and studio operations.

---

## 📚 Essential Documentation

All architectural decisions, scope limits, and technical performance budgets are strictly governed by the documents in `/docs`:

1. **[`/docs/FINAL_PRD.md`](./docs/FINAL_PRD.md)** — The single source of truth for all product requirements, exact route paths, 9 service categories, 9 AMO scenes, 7 admin roles, and commercial flows.
2. **[`/docs/TRD_3D_PERFORMANCE.md`](./docs/TRD_3D_PERFORMANCE.md)** — Hard asset budgets, WebGL quality tiers (Tier 0/1/2), frame rate targets, and rendering rules.
3. **[`/docs/TODO_BUILD_CHECKLIST.md`](./docs/TODO_BUILD_CHECKLIST.md)** — Phased delivery checklist with explicit PRD citations.
4. **[`/docs/PROJECT_STRUCTURE.md`](./docs/PROJECT_STRUCTURE.md)** — Authoritative file tree and folder conventions.
5. **[`/docs/BUILD_PROMPTS.md`](./docs/BUILD_PROMPTS.md)** — Phased execution prompts.
6. **[`/docs/decisions/PHASE0_DECISIONS.md`](./docs/decisions/PHASE0_DECISIONS.md)** — Phase 0 decisions log (resolved tech stack choices + open client decisions).

---

## 🛠️ Tech Stack (PRD §16 & Phase 0 Decisions)

- **Framework:** Next.js (App Router, SSR/SSG) + TypeScript
- **Styling & Tokens:** Tailwind CSS (`src/styles/tokens.ts`)
- **3D Engine:** React Three Fiber + Three.js (`@react-three/drei`, `@react-three/fiber`)
- **Animation:** GSAP (ScrollTrigger) & Framer Motion
- **Database & ORM:** PostgreSQL + Prisma
- **Auth & RBAC:** Auth.js (NextAuth) with email OTP MFA
- **Email:** Resend
- **Bot Protection:** Cloudflare Turnstile
- **Analytics:** PostHog
- **Deployment:** Vercel

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run type checks & build
npm run build
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### AMO Frame Playback

`npm run dev` and `npm run build` generate 1120px WebP copies in
`public/frames-webp` before starting Next.js. The original PNG sequences in
`public/frames` remain untouched and are used as a fallback if a WebP fails.
Generated copies are ignored by Git; deploy using `npm run build` with dev
dependencies installed so Sharp can generate them. No media environment
variables or external CDN are required for this path.

Playback uses equal scroll distances per section, a shared GSAP scroll
playhead, and Framer Motion values for character and content transforms.
The frame cache loads four images at a time, prioritizes the current position,
and releases images outside the nearby frame window. Mobile and reduced-motion
visitors receive static, lazy-loaded scenes without scroll locking.

Run `npm run test:frames` to check the loader's concurrency, eviction, fallback,
and cleanup behaviour. `npm run test:handoff` verifies the opening clip's helmet
and foot alignment against the intro's final leaning pose, and its smooth
return to normal placement before the first content reveal.
Do not run a production build while a development
server uses the same `.next` directory; stop it first to avoid stale chunk URLs.

---

## 🔒 Hard Rules for Build Agents & Contributors

1. **No Hallucinated Scope:** Build only what is specified in `FINAL_PRD.md`. Section 3 (*Explicit Non-Goals*) and Section 22 (*Future Roadmap*) are forbidden scope.
2. **Paired Fallbacks:** Every 3D scene component (`Scene.tsx`) must ship with its paired static fallback component (`Fallback.tsx`).
3. **Exact Naming:** Never rename, merge, or reorder routes, the 9 service groups, the 9 scenes, or the 7 admin roles.
