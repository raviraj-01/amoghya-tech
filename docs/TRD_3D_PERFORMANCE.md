# Technical Requirements Document — 3D Interaction & Performance
**Companion to:** FINAL_PRD.md. This document governs HOW the 3D/AMO layer gets built so it never becomes slow, janky, or a blocker to the commercial flows the PRD requires.

**Core rule:** The static, SEO-critical, conversion layer loads and works first. The 3D layer is an enhancement that loads after, and is allowed to fail, degrade, or be skipped without breaking anything.

---

## 1. Stack (locked)

- **Framework:** Next.js + TypeScript, App Router, SSR/SSG for all indexable routes.
- **3D:** React Three Fiber + Three.js. `@react-three/drei` for helpers. `@react-three/fiber`'s `<Suspense>` for async asset loading.
- **2D motion:** Framer Motion for UI transitions; GSAP (ScrollTrigger) for timeline-driven scene sequencing tied to scroll.
- **Styling:** Tailwind with design tokens, not ad hoc CSS.
- **State:** Zustand or React context for scene state — do not put 3D scene state in Redux-style global stores that re-render unrelated UI.

Do not introduce a second 3D engine (Babylon, PlayCanvas, etc.) or a second animation library beyond what's listed here. One rendering pipeline, one motion pipeline.

## 2. Device / Quality Tiers

Detect capability, not just screen size, before deciding what to render.

| Tier | Trigger | Behavior |
|---|---|---|
| **Tier 0 — No WebGL / reduced motion / very low memory** | `WebGL` context creation fails, OR `prefers-reduced-motion: reduce`, OR `navigator.deviceMemory < 2` (where available) | Serve static image/poster + short looping video per scene. Zero Three.js bundle loaded. |
| **Tier 1 — Low/mid mobile** | Mobile UA + mid-range GPU signal | Reduced geometry, baked lighting only, no post-processing, capped pixel ratio (max 1.5x), shorter animation loops. |
| **Tier 2 — Desktop/high-end mobile** | Desktop UA or high-end GPU signal | Full scene detail, pointer-tracking AMO behavior, richer lighting/materials, optional scene navigation. |

Tier decision happens once on load and is re-evaluated if the user toggles the manual "reduce motion / disable 3D" control (Section 7). Do not do per-frame tier switching — that itself causes jank.

## 3. Asset Budgets (hard limits, not targets)

- **Format:** glTF/GLB only for runtime delivery.
- **Geometry compression:** Draco or Meshopt — mandatory, no raw uncompressed meshes in production.
- **Textures:** KTX2/Basis compressed. No raw PNG/JPG textures on 3D meshes in production build.
- **Per-scene budget:** ≤ 3–5 MB compressed geometry+texture payload per scene, ≤ 15 MB total for the initial homepage experience across all lazy-loaded scenes combined.
- **Draw calls:** target under 150 per visible scene on Tier 2, under 60 on Tier 1.
- **Polycount (AMO character):** single LOD0 rig under 40k triangles; provide LOD1 (~15k) and LOD2 (~5k) for Tier 1 and distant/small-viewport rendering.
- **Textures on AMO:** single texture atlas per material set, 2K max on Tier 2, 1K max on Tier 1.
- **Animation clips:** keep skeletal animation data lean — trim unused bones/tracks before export; do not ship the full production rig's non-deforming control bones to runtime.

Any asset exceeding these budgets gets rejected in CI (see Section 8), not caught visually after launch.

## 4. Loading Strategy

1. Static HTML/CSS/critical content paints first — this is what SEO crawlers and slow connections see. No 3D bundle is in the critical path.
2. 3D scene code is code-split per scene (route- and scroll-position-based dynamic `import()`), not one giant bundle.
3. Scenes load just-in-time as the visitor approaches them in scroll, with a poster frame shown until ready — never a blank frame or spinner-only state for more than ~300ms.
4. Only the current scene and the next scene are kept resident in memory. Prior scenes get disposed (geometries, materials, textures) via `dispose()` calls when scrolled past — Three.js does not garbage collect GPU memory on its own.
5. Font, icon, and non-3D asset loading must not block 3D scene requests, and vice versa.

## 5. Runtime Performance Targets

| Metric | Target |
|---|---|
| LCP (static/SEO content) | < 2.5s |
| INP | < 200ms |
| CLS | < 0.1 on SEO-critical static content |
| 3D scene frame rate | ≥ 50fps sustained on Tier 2 desktop, ≥ 30fps sustained on Tier 1 mobile |
| Time to first 3D frame after scene trigger | < 1.5s on Tier 2, < 2.5s on Tier 1, or fallback shown instead |
| GPU memory ceiling (mobile) | Stay under ~250MB texture+geometry resident memory; test on a mid-range Android device, not just flagship |
| JS main-thread block per scene transition | < 50ms — long scene-init logic must be chunked or moved off main thread (Web Worker for physics/data prep if needed) |

If a device cannot sustain the frame rate target for two consecutive seconds, auto-downgrade to the next lower tier for the remainder of the session rather than continuing to render dropped frames.

## 6. Rendering Discipline (to prevent lag, specifically)

- No `useFrame` loops doing unbounded work — profile every `useFrame` callback; anything doing allocation per-frame (`new Vector3()`, `new Object()`, etc. inside the loop) is a bug, not a style choice. Pre-allocate and mutate instead.
- Cap `pixel ratio` (`gl.setPixelRatio`) — never render at full device pixel ratio on mobile; cap at 1.5–2x max.
- Use instancing for any repeated geometry (floating capability objects, particles) — no repeated individual meshes for identical objects.
- Post-processing effects (bloom, DOF, etc.) are Tier-2-desktop-only, disabled by default elsewhere, and must be toggleable off entirely.
- Shadows: baked where possible; real-time shadows limited to a single directional light on the hero character only, never per-object dynamic shadows across a scene.
- Physics (if any) run at a fixed, capped timestep decoupled from render framerate — never tie physics substeps to variable frame delta directly.
- Idle/background tabs: pause the render loop entirely (`document.visibilitychange`) — do not keep rendering when the tab isn't visible.

## 7. User Controls (required, not optional)

- Visible toggle to disable 3D/motion entirely — persists via cookie/localStorage across visits.
- Respect OS-level `prefers-reduced-motion` automatically before any manual toggle is touched.
- Sound (if used) is off by default and never auto-plays with audio.
- Every scene's fallback (static image/video) must communicate the same information and CTA as the 3D version — QA must verify this pairwise, scene by scene, not just spot-check.

## 8. CI / Build-Time Enforcement

- Automated bundle-size check per 3D scene chunk — build fails if a chunk exceeds the Section 3 budget.
- Automated Lighthouse/Core Web Vitals run against staging on every deploy to the homepage and at least one service/case-study page — build fails or flags if targets in Section 5 regress by more than 10%.
- Visual regression + frame-rate profiling on a defined device matrix (one low-end Android, one mid-tier iPhone, one desktop Chrome, one desktop Safari) before any 3D asset or scene-code change ships to production.

## 9. Testing Matrix (minimum)

| Device class | Check |
|---|---|
| Low-end Android (WebGL supported, Tier 1) | Frame rate, load time, fallback trigger correctness |
| Low-end Android without WebGL / old browser | Full Tier 0 fallback path, all CTAs functional |
| Mid-tier iPhone (Safari WebGL quirks) | Texture/shader compatibility, touch interaction, memory ceiling |
| Desktop Chrome, high-end GPU | Full Tier 2 experience, frame rate target |
| Desktop with `prefers-reduced-motion` set | Correct automatic fallback, no motion sickness triggers |
| Throttled 3G / slow connection | Static content usable before 3D ever loads; no layout shift while 3D assets stream in |

## 10. Explicit Anti-Hallucination Notes for Build Agents

- Do not invent additional 3D scenes beyond the 9 listed in FINAL_PRD.md Section 6.
- Do not add a game engine, WebXR/AR mode, or physics engine not named in Section 1 — those are Future Roadmap items only.
- Do not silently relax the budgets in Section 3 to "make it look better" — if a budget can't be hit with a required asset, flag it back to design/3D production, don't ship over-budget and don't ship a broken/empty scene either.
- If unsure whether an optimization technique is in scope, default to the simpler, cheaper option and note the tradeoff — don't add exotic rendering techniques (custom shader pipelines, GPU particle systems, etc.) without them being explicitly requested.
