# Build Prompts — Feed These to the Coding AI Agent, One Phase at a Time

Rules before you start:
- Put `FINAL_PRD.md`, `TRD_3D_PERFORMANCE.md`, `TODO_BUILD_CHECKLIST.md`, and `PROJECT_STRUCTURE.md` in the repo's `/docs` folder first. Every prompt below assumes the agent can read them, not just remember what you pasted earlier.
- Run these **in order**. Don't skip to Phase 3 hoping the agent infers Phase 0–2 decisions correctly — it won't have them.
- After each phase, review the output against the matching checklist section in `TODO_BUILD_CHECKLIST.md` before moving on.

---

## Master Instruction (paste once at the start of every session, before any phase prompt)

```
You are building the project defined in /docs/FINAL_PRD.md and /docs/TRD_3D_PERFORMANCE.md.
Follow /docs/TODO_BUILD_CHECKLIST.md and /docs/PROJECT_STRUCTURE.md exactly.

Hard rules:
1. Do not invent features, pages, copy, pricing, or 3D scenes that are not explicitly
   written in FINAL_PRD.md. If something seems missing or ambiguous, stop and ask me
   a specific question instead of guessing or filling the gap yourself.
2. Section 3 of FINAL_PRD.md ("Explicit Non-Goals") and Section 22 ("Future Roadmap")
   are forbidden scope. Do not build any part of them, even partially, even if it
   seems like a natural addition.
3. Use exact names from the PRD: route paths, the 9 service group names, the 9 scene
   names, the 7 admin roles. Do not rename, merge, or reorder them.
4. Follow the folder structure in PROJECT_STRUCTURE.md. If you need a new file or folder
   not shown there, tell me where you're adding it and why before you do it.
5. Every 3D scene component must ship with a paired static fallback component. Do not
   submit a scene without its fallback.
6. Cite which PRD/TRD section each non-trivial piece of work maps to, in your commit
   message or PR description.
7. If you are unsure whether something is in scope, default to NOT building it and ask.
   Under-building and asking is correct behavior. Over-building is not.
```

---

## Phase 0 — Discovery & Planning

```
Read /docs/FINAL_PRD.md in full. Produce a written list of every open question or
ambiguity you find — anything where you'd have to guess to proceed. Do not answer
them yourself. Just list them, grouped by PRD section number, so I can resolve them
before you write any code.

Specifically check: the brand name discrepancy noted in FINAL_PRD.md's header
(Vyara Amogya Technologies vs Amoghya Technologies), pricing model gaps, studio
operational rules gaps, and any integration provider that isn't named.
```

## Phase 1 — Project Scaffold + Design System

```
Using PROJECT_STRUCTURE.md, scaffold the Next.js + TypeScript project. Set up:
- App Router with every route from FINAL_PRD.md Section 5 (empty pages are fine for now,
  but every route must exist as a file, and no route outside that list should exist).
- Tailwind with a design tokens file — do not hardcode colors/spacing outside tokens.
- Global nav and persistent "Start a Project" CTA per PRD Section 5/13.
- The /docs folder wired into the README so future sessions read it first.

Do not build any 3D content yet. Do not build the admin panel yet. This phase is
structure and static shell only. Stop and show me the file tree when done.
```

## Phase 2 — 3D Pipeline Foundation

```
Reference /docs/TRD_3D_PERFORMANCE.md sections 1–4. Build the 3D infrastructure only —
not the actual AMO scenes yet, since those depend on delivered art assets.

Implement:
- Device/quality tier detection (Tier 0/1/2) exactly as TRD section 2 describes.
- Draco/KTX2 loader setup and a dispose() helper for scene teardown.
- The scene-loading shell: lazy-loaded, code-split per scene, poster-frame-until-ready
  pattern from TRD section 4.
- The manual 3D/motion/sound toggle from TRD section 7, persisted via storage.

Use placeholder primitive geometry (cubes/spheres) standing in for AMO and scene
objects — real assets come in Phase 3. The point of this phase is the pipeline working
correctly under the performance rules, not the final look.
```

## Phase 3 — Scene-by-Scene Build (repeat this prompt once per scene, 1 through 9)

```
Build homepage scene [N]: "[scene name from FINAL_PRD.md Section 6]" exactly as
specified in FINAL_PRD.md Section 6 and using the real 3D assets in
/assets-3d-source/. Follow the per-scene asset budget in TRD section 3 before
importing anything into the scene component — if the delivered asset is over
budget, tell me instead of importing it anyway.

Deliverables for this prompt:
1. Scene.tsx — the 3D version, using the loader/tier system from Phase 2.
2. Fallback.tsx — static image/video equivalent, same information and same CTA.
3. copy.ts — dialogue and CTA text taken verbatim from the PRD where the PRD gives
   exact copy; otherwise flag that copy is missing and needs to come from content design.

Do not add a 10th scene, do not merge this scene with another, do not change scene
order. When done, run it through the frame-rate targets in TRD section 5 and report
the numbers.
```

## Phase 4 — Commercial Modules (run as separate prompts, one per module)

```
Build the Studio Booking flow exactly as FINAL_PRD.md Section 8 describes — all 6
steps, admin-configurable rules, and the record/confirmation/notification chain.
Do not add booking types, add-ons, or steps not listed in Section 8.
```

```
Build the Package Builder exactly as FINAL_PRD.md Section 9 describes — all 6 steps,
the package groups listed, and lead-record creation on every submission. Estimate
output must support the range/fixed/starting-from/quote-only modes named in the PRD —
do not default to only one pricing display mode.
```

```
Build Contact and Lead Management per FINAL_PRD.md Section 11 — every field, every
entry point, the full lead lifecycle status list, and the validation/spam/notification/
retry behavior. Wire lead capture into every entry point listed, not just the /contact
page.
```

## Phase 5 — Admin Control Center

```
Build /admin per FINAL_PRD.md Sections 12 and 13. Implement RBAC for the exact 7 roles
listed — no extra roles, no merged roles. Build the five modules (Dashboard, Content,
Commercial, AMO controls, Governance) as separate sections. The AMO controls module
only touches scene copy/CTAs/toggles — it must NOT include 3D model or animation
upload, that stays outside this panel per PRD Section 12.
```

## Phase 6 — Non-Functional Pass

```
Go through FINAL_PRD.md Section 15 and TRD_3D_PERFORMANCE.md Sections 5–9 as a checklist.
For each requirement (accessibility, SEO, security, performance budget, device testing),
report current status: met / not met / not yet tested. Do not mark anything "met"
without a concrete test result to back it — a Lighthouse score, an axe-core report,
a manual keyboard-nav walkthrough note, etc.
```

## Phase 7 — Pre-Launch Review

```
Go through FINAL_PRD.md Section 20 (Acceptance Criteria) item by item and confirm each
one against the live staging build, not against intent. For each item, give me the
specific evidence (URL, screenshot, test log) that it's true. Flag anything not yet
true instead of marking it done.
```

---

**Why phased instead of one giant prompt:** a single "build the whole thing" prompt is exactly what produces hallucinated scope, skipped fallbacks, and made-up copy — the agent fills gaps with guesses because it has too much surface area to track at once. Small, doc-referenced, checkable prompts keep every step auditable against `TODO_BUILD_CHECKLIST.md`.
