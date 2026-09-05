# Project Folder Structure — Vyara Amogya Technologies

Reference structure for a Next.js (App Router) + React Three Fiber build. Put `FINAL_PRD.md`, `TRD_3D_PERFORMANCE.md`, and `TODO_BUILD_CHECKLIST.md` in `/docs` so the coding agent can read them directly from the repo — never paste-and-lose them in chat only.

```
vyara-amogya/
├── docs/
│   ├── FINAL_PRD.md
│   ├── TRD_3D_PERFORMANCE.md
│   ├── TODO_BUILD_CHECKLIST.md
│   └── decisions/                     # short dated .md files logging any scope
│       └── 2026-08-xx-brand-name.md   # decision/clarification the agent got — audit trail
│
├── src/
│   ├── app/                           # Next.js App Router — matches PRD §5 routes exactly
│   │   ├── page.tsx                   # / — homepage, AMO narrative
│   │   ├── layout.tsx
│   │   ├── services/
│   │   │   ├── page.tsx               # /services
│   │   │   └── [slug]/page.tsx        # /services/[service-slug]
│   │   ├── work/
│   │   │   ├── page.tsx               # /work
│   │   │   └── [slug]/page.tsx        # /work/[case-study-slug]
│   │   ├── studio/
│   │   │   ├── page.tsx               # /studio
│   │   │   └── book/page.tsx          # /studio/book
│   │   ├── package-builder/page.tsx   # /package-builder
│   │   ├── about/page.tsx             # /about
│   │   ├── contact/page.tsx           # /contact
│   │   ├── admin/                     # protected — RBAC per PRD §13
│   │   │   ├── layout.tsx             # auth guard
│   │   │   ├── page.tsx               # dashboard
│   │   │   ├── content/
│   │   │   ├── commercial/
│   │   │   ├── amo/                   # AMO scene/copy/toggle controls only — no model upload
│   │   │   └── governance/
│   │   └── api/                       # route handlers: leads, bookings, package submissions, webhooks
│   │
│   ├── components/
│   │   ├── ui/                        # design-system primitives (buttons, cards, forms)
│   │   ├── layout/                    # nav, footer, persistent CTA
│   │   ├── scenes/                    # one folder per AMO scene, 3D + fallback paired together
│   │   │   ├── 01-arrival/
│   │   │   │   ├── Scene.tsx          # R3F scene
│   │   │   │   ├── Fallback.tsx       # static image/video version — required, PRD §6/TRD §7
│   │   │   │   └── copy.ts            # scene dialogue, matches PRD verbatim
│   │   │   ├── 02-capability-reveal/
│   │   │   ├── 03-company-world/
│   │   │   ├── 04-studio/
│   │   │   ├── 05-technology/
│   │   │   ├── 06-services/
│   │   │   ├── 07-work/
│   │   │   ├── 08-package-builder/
│   │   │   └── 09-closing-contact/
│   │   ├── booking/                   # studio booking flow steps
│   │   └── package-builder/           # package builder flow steps
│   │
│   ├── three/
│   │   ├── amo/                       # AMO model loader, rig controller, animation state machine
│   │   ├── tier-detection.ts          # Tier 0/1/2 logic — TRD §2
│   │   ├── loaders/                   # Draco/KTX2 loaders, disposal helpers — TRD §4
│   │   ├── hooks/                     # useFrame-safe hooks, pre-allocated vectors — TRD §6
│   │   └── quality-controller.ts      # auto-downgrade-on-dropped-frames — TRD §5
│   │
│   ├── lib/
│   │   ├── cms/                       # CMS client + content model types (PRD §14 entities)
│   │   ├── db/                        # ORM (Prisma) schema + client
│   │   ├── auth/                      # admin auth, RBAC, MFA
│   │   ├── integrations/              # CRM, calendar, payment, email, analytics adapters
│   │   ├── leads/                     # lead lifecycle logic (PRD §11)
│   │   └── validation/                # form/input schemas (zod or similar)
│   │
│   ├── styles/                        # Tailwind config, design tokens
│   └── types/                         # shared TypeScript types matching PRD data model
│
├── public/
│   └── fallback-media/                # posters/videos per scene — Tier 0 path
│
├── assets-3d-source/                  # pre-optimization source files (NOT shipped to prod bundle)
│   └── amo/                           # raw model, rig, textures from 3D team before compression
│
├── prisma/ (or equivalent ORM dir)
│   └── schema.prisma                  # matches PRD §14 entities exactly
│
├── tests/
│   ├── e2e/                           # booking flow, package builder, contact — full journeys
│   ├── accessibility/                 # WCAG 2.2 AA automated checks
│   └── performance/                   # Lighthouse/CWV + frame-rate scripts — TRD §8/§9
│
├── .github/workflows/                 # CI: bundle-size budget check (TRD §3), Lighthouse gate (TRD §8)
├── package.json
└── README.md                          # points every new contributor to /docs first
```

**Rule baked into this structure:** every 3D scene folder pairs a `Scene.tsx` with a mandatory `Fallback.tsx`. If a scene folder is missing its fallback file, that's a build gap — the folder structure itself makes the omission visible in a PR review, not just in a written checklist.
