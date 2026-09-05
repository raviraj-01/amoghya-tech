# Build TODO — Vyara Amogya Technologies
**Reference docs:** `FINAL_PRD.md` (product spec), `TRD_3D_PERFORMANCE.md` (3D/perf spec).

**Rules for any AI coding agent working this list:**
1. Work top to bottom, in phase order. Do not start Phase 3 work before Phase 1 and 2 deliverables exist and are approved.
2. Every task cites the PRD/TRD section it comes from. If a task seems to need something not covered by that section, stop and ask — do not invent copy, pricing, page names, or features.
3. Check items off only when the linked acceptance note is actually true, not when code merely compiles.
4. Do not rename routes, scenes, service categories, or roles. Use the exact names in FINAL_PRD.md.
5. If a task is blocked (missing asset, missing decision), mark it `BLOCKED: <reason>` and move to the next unblocked item — do not silently skip or fabricate a placeholder that looks final.

---

## Phase 0 — Discovery & Planning (PRD §21.0)

- [ ] Confirm brand name discrepancy: "Vyara Amogya Technologies" (PRDs) vs "Amoghya Technologies" (pricing doc). Get written confirmation before pricing page goes live. *Blocks: Phase 1 content, Phase 4 content population.*
- [ ] Finalize content inventory: all copy for 9 homepage scenes, 9 service groups, about page, studio page.
- [ ] Confirm AMO visual direction (concept art sign-off) before 3D production starts.
- [ ] Confirm pricing data source and model (range/fixed/starting-from/quote-only per package — PRD §9).
- [ ] Confirm studio operational rules: hours, blackout dates, cancellation policy, deposit requirement (PRD §8).
- [ ] Confirm hosting/infra choice (Vercel/Cloudflare/AWS-class) and integration providers (CRM, calendar, payment, email, analytics) — PRD §16 (Technical Architecture).
- [ ] Lock device/browser support matrix (feed into TRD §9 testing matrix).

## Phase 1 — Experience & Content Design (PRD §21.1)

- [ ] Sitemap matches PRD §5 exactly — no extra or missing routes.
- [ ] Wireframes for all 11 routes in PRD §5.
- [ ] Design system: tokens, typography, color, component library (build on Tailwind tokens per TRD §1).
- [ ] Scene storyboard + script for all 9 AMO scenes (PRD §6) — dialogue lines match PRD copy where specified verbatim.
- [ ] Content model defined for CMS: Page, Service, Case Study, Testimonial, AMO Scene, Media Asset (PRD §14).
- [ ] Studio booking flow wireframe — all 6 steps from PRD §8.
- [ ] Package builder flow wireframe — all 6 steps from PRD §9.
- [ ] Static fallback design for every one of the 9 scenes (image/video) — sign off that each fallback communicates the same info + CTA as the 3D version (TRD §7).

## Phase 2 — 3D Production (PRD §21.2 / TRD §3)

- [ ] AMO concept art approved.
- [ ] AMO final model + rig delivered: LOD0 (<40k tris), LOD1 (~15k), LOD2 (~5k) — TRD §3.
- [ ] Facial rig/blendshapes for expressive eyes/brows/mouth (PRD §17, 3D Asset and Animation Requirements).
- [ ] Animation clips delivered for all required states: neutral idle, curious observation, eye tracking, greeting, thinking, explaining/gesturing, discovery, confident presentation, studio work, device operation, camera/light interaction, float/transition, closing gesture (PRD §17, 3D Asset and Animation Requirements). *Check off only when all 13 states exist as separate clips.*
- [ ] Environments delivered for: hero, floating capability objects, modular company world, studio, tech/data space, service display, work gallery, package assembly, closing/contact (PRD §17, 3D Asset and Animation Requirements).
- [ ] All assets exported as glTF/GLB, Draco/Meshopt compressed, KTX2/Basis textures (TRD §3) — reject anything not compressed before it enters the repo.
- [ ] Per-scene asset payload verified against TRD §3 budget (≤3–5MB/scene, ≤15MB total homepage) before handoff to dev.
- [ ] Poster frame / fallback video rendered for every scene (Tier 0 path, TRD §2).

## Phase 3 — Development

### 3a. Front End Foundation
- [ ] Next.js + TypeScript project scaffolded, SSR/SSG configured for indexable routes (TRD §1).
- [ ] Design system/tokens implemented in Tailwind.
- [ ] Global nav + persistent "Start a Project" CTA implemented across all public pages (PRD §5, §13).
- [ ] Device/quality tier detection implemented per TRD §2 (Tier 0/1/2 logic, `prefers-reduced-motion` respected first).

### 3b. 3D Integration
- [ ] React Three Fiber scene shell built, one component per homepage scene, code-split (TRD §4).
- [ ] Scroll-driven sequencing wired with GSAP ScrollTrigger, matching PRD §6 scene order exactly — no reordering, no added/removed scenes.
- [ ] Scene-by-scene lazy loading + disposal of prior scene GPU resources implemented (TRD §4.4).
- [ ] `useFrame` loops audited for per-frame allocation — none present (TRD §6).
- [ ] Pixel ratio capped, instancing used for repeated objects, shadows limited per TRD §6.
- [ ] Auto-downgrade-on-dropped-frames logic implemented (TRD §5).
- [ ] Manual 3D/motion toggle + sound toggle built, persisted via cookie/localStorage (TRD §7).
- [ ] Render loop pauses on tab-hidden (TRD §6).

### 3c. Services & Portfolio
- [ ] `/services` and `/services/[service-slug]` built for all 9 service groups (PRD §7) — content matches taxonomy, no renamed/merged categories.
- [ ] `/work` and `/work/[case-study-slug]` built with filters: service, industry, project type, technology, year (PRD §10).
- [ ] Case study fields implemented exactly as PRD §10 lists.

### 3d. Studio Booking
- [ ] `/studio` and `/studio/book` built implementing all 6 flow steps (PRD §8).
- [ ] Availability, blackout, lead-time, cancellation, deposit logic implemented per admin-configured rules.
- [ ] Booking submission generates: booking reference, confirmation email, calendar invite, internal notification (PRD §8).

### 3e. Package Builder
- [ ] `/package-builder` built implementing all 6 steps (PRD §9).
- [ ] Every submission saved as a structured lead (PRD §9, §11).
- [ ] Estimate output supports range/fixed/starting-from/quote-only modes + disclaimer text.

### 3f. Contact & Lead Management
- [ ] `/contact` built with all fields from PRD §11.
- [ ] Lead capture wired from every entry point listed in PRD §11 (not just the contact page).
- [ ] Lead lifecycle statuses implemented: New → Contacted → Qualified → Discovery Scheduled → Proposal Sent → Negotiation → Won/Lost/Nurture/Spam.
- [ ] Form validation, spam mitigation, visitor confirmation, internal notification, retry-on-failure implemented (PRD §11).

### 3g. Admin Control Center
- [ ] `/admin` protected route with RBAC matching the 7 roles in PRD §13 exactly.
- [ ] Dashboard module (PRD §12) built.
- [ ] Content module (pages, services, case studies, testimonials, media, SEO fields, publish workflow) built.
- [ ] Commercial module (leads, bookings, pricing, package rules, invoices) built.
- [ ] AMO controls module (scene copy, CTAs, featured items, sound default, 3D on/off, fallback selection) built — model/rig upload explicitly NOT in this module (PRD §12).
- [ ] Governance module (users, roles, MFA, integrations, audit log, backups, privacy) built.

### 3h. Integrations
- [ ] CRM, calendar, scheduling, payment (deposit only), email, file storage, analytics, bot protection integrated as modular providers (PRD §16, Technical Architecture).
- [ ] Job queue implemented for notifications, media processing, integration retries.

## Phase 4 — QA & Content Population (PRD §21.4)

- [ ] Functional QA: navigation, forms, pricing rules, availability, deposits, CMS workflow, permissions, integration error/retry paths.
- [ ] Visual QA: responsive layout, typography, transitions, AMO scenes, fallback fidelity across breakpoints (PRD §18, Responsive Behavior).
- [ ] Performance QA against every target in TRD §5 — logged with actual numbers, not "feels fast."
- [ ] Device matrix testing per TRD §9 — all six device/condition classes tested and logged.
- [ ] Accessibility QA: keyboard nav, screen reader, reduced motion, contrast, zoom/reflow, captions/transcripts — WCAG 2.2 AA (PRD §15).
- [ ] SEO QA: metadata, structured data, sitemap, canonical URLs, redirect manager.
- [ ] Security QA: auth/RBAC, rate limits, spam handling, upload validation, dependency review, secrets config.
- [ ] Full content population: all 9 services, real case studies, real pricing/packages, real studio rules — no lorem ipsum or placeholder copy in production build.
- [ ] UAT sign-off from client against PRD §20 Acceptance Criteria, item by item.

## Phase 5 — Launch (PRD §21.5)

- [ ] Production deploy, DNS/redirect checks complete.
- [ ] Monitoring, error tracking, and daily backups live and verified.
- [ ] Analytics verified firing correctly for every event in PRD §19 (scene reached, motion disabled, service views, booking/package starts and completions, form events, fallback activation).
- [ ] Internal team trained on Admin Control Center.
- [ ] Post-launch review scheduled (recommend 2 weeks out) to check real-world performance numbers against TRD §5 targets.

---

## Standing Rule for the Whole Build

At no point should the agent add pages, roles, integrations, pricing tiers, or 3D scenes beyond what FINAL_PRD.md and TRD_3D_PERFORMANCE.md specify. Section 3 of the PRD (Non-Goals) and Section 18 (Future Roadmap) exist specifically to stop scope invention — treat anything on the Future Roadmap list as forbidden for this build, not as a hint to build it "a little bit now."
