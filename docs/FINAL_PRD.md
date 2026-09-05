# Vyara Amogya Technologies — Final Product Requirements Document
**Status:** Locked for build. This document is the single source of truth. Where it conflicts with any earlier draft (Final-Cut Master PRD, Company-Grade Full PRD v2, Engineer-Ready PRD), this document wins.

**Official product name:** Vyara Amogya Technologies
**Hero character:** AMO
**Note on naming:** A separate pricing document uses the name "Amoghya Technologies." That document is treated as a general agency-wide price list, not authoritative for this project's scope. Confirm with client whether it is a typo or an intentional parent-brand name before publishing prices on this site.

---

## 1. What This Product Is

A premium marketing + commercial-operations website. Half the experience is a polished, conventional static interface. Half is an interactive 3D narrative led by a character called AMO. Every business-critical action (contact, package builder, studio booking) must work completely with 3D, sound, and animation turned off. The 3D layer is enhancement, not a gate.

This is not a game and not a portfolio-only site. It is a lead-generation and booking platform with a distinctive front door.

## 2. Goals (in priority order)

1. A first-time visitor understands what the company offers and what to do next within 30–60 seconds.
2. Every qualified inquiry is captured, attributed to its source, and routed to a human.
3. Studio time can be checked and booked (or requested) without a phone call.
4. Non-developers can update content, pricing, availability, and leads through an admin panel.
5. The site is fully usable on low-power devices and without WebGL.
6. AMO is a recognizable, consistent brand asset across every page and device.

## 3. Explicit Non-Goals (v1)

State these plainly so no one — human or AI agent — invents scope:

- No public visitor login/signup or client portal. Auth is for internal/admin operators only.
- No live payment processing beyond optional deposit collection for studio bookings, if configured.
- No AI chat assistant, no voice interaction for AMO, no AR/immersive mode.
- No multilingual content, no regional pricing.
- No native mobile app.
- Public site search is optional, not required, at launch.

Anything not explicitly listed in this document is out of scope until a written change request adds it.

## 4. Users and Primary Jobs

| User | Needs | Key actions |
|---|---|---|
| Startup founder | Credible partner for MVP/brand/launch | Review work, request discovery call |
| Business owner | Practical upgrade to web/marketing/ops | Explore services, build a package, submit inquiry |
| Enterprise buyer | Proof, capability breadth, governance | Review case studies, schedule call |
| Creator/brand | Studio access | Check availability, book a session |
| Returning client | Fast access to support or new project | Contact team, new booking |
| Internal operator | Control content and workflows | Use Admin Control Center |

## 5. Information Architecture (Routes)

| Route | Purpose |
|---|---|
| `/` | AMO-led homepage narrative and conversion hub |
| `/services` | Service overview and category selection |
| `/services/[service-slug]` | Detailed service offer + project CTA |
| `/work` | Filterable project portfolio |
| `/work/[case-study-slug]` | Outcome-led case study |
| `/studio` | Studio overview, booking options, equipment, availability |
| `/studio/book` | Booking flow |
| `/package-builder` | Guided scope + indicative estimate |
| `/about` | Company story, operating model, AMO identity |
| `/contact` | Project inquiry and scheduling |
| `/admin` | Protected Admin Control Center |

Global nav is persistent: Home, What We Do, Work, Studio, Build Your Package, About, Contact, plus a persistent "Start a Project" CTA.

## 6. Homepage: AMO Scene Sequence (locked order)

Every scene below MUST have: an accessible text equivalent, a static image/video fallback, and a direct CTA. Scroll progress must never trap the visitor — nav, keyboard control, and deep links stay live at all times.

**1. Arrival — "Oh, you're here."**
AMO begins as a distant form in a warm near-white environment, looks around, notices the visitor, and moves closer.
Dialogue (verbatim, use as-is): *"Oh... you're here. I'm AMO. And apparently, I'm supposed to show you what we do."*
Interaction: cursor/touch produces subtle eye and head tracking.
CTAs: "See what AMO can do" · "Start a project."

**2. Capability Reveal — "I do quite a lot."**
AMO interacts with floating objects representing: a website, an app, an identity system, a camera frame, a motion composition, an AI interface, an analytics object, a campaign asset.
Dialogue (verbatim): *"I build things. I design things. I make things move. I help people notice things. And sometimes, I make machines do the boring stuff."*
Static layer: service cards linking directly to `/services/[slug]`, one per object.

**3. The Vyara Amogya World**
AMO enters connected spaces for product, brand, technology, content, studio, and growth.
Static layer copy (verbatim): *"One team. Many capabilities. One coherent outcome."*
Supporting value pillars (verbatim, display all three): **Think clearly** · **Build beautifully** · **Grow intelligently.**

**4. AMO in the Studio**
AMO transitions into a studio scene: working at a desk, adjusting lights, operating a camera, reviewing a prototype.
Dialogue (verbatim): *"This is where ideas become real."*
Static layer: studio formats, equipment, booking types, availability. CTA: "Book the Studio."

**5. Technology and Intelligence**
AMO enters a digital workspace of interfaces, data, logic nodes, workflows.
Dialogue (verbatim): *"Good ideas need systems... I make technology feel less like technology."*
Static layer covers: engineering, AI, automation, CRM, dashboards, consulting.

**6. Services Deep Dive**
A modular capability-room or orbital system lets visitors select service groups (see Section 7 for the 9 groups). Standard cards are the non-3D equivalent, each showing outcomes, deliverables, indicative pricing approach, and a link to the service page.
*Exact scene dialogue not yet specified in source material — content design must write this line before Phase 1 sign-off; do not invent it in code.*

**7. Selected Work**
AMO opens a gallery of project artifacts, which resolves into accessible case-study cards with filters, outcomes, services used, media, testimonials.
CTA: "View all work."
*Exact scene dialogue not yet specified — same rule as Scene 6.*

**8. Build Your Package**
AMO assembles selected components — brand, web, content, automation, product, campaign, studio time — in a 3D workspace. A conventional configurable form (not the 3D layer) is what actually produces pricing and captures the lead.
*Exact scene dialogue not yet specified — same rule as Scene 6.*

**9. Closing / Contact**
The world simplifies. AMO returns to an intimate, clean environment.
Dialogue (verbatim): *"So... what are we building?"*
CTAs (all four, verbatim): Start a Project · Book the Studio · Build Your Package · Schedule a Discovery Call.

**Open item:** Scenes 6, 7, and 8 have staging/structure specified but no locked dialogue line yet. Do not write placeholder dialogue in code — flag it and get copy from content design (Phase 1) first.

## 7. Service Taxonomy (9 groups — do not rename or merge)

This is the full, verbatim scope for each group. Seed the CMS with this text directly — nothing here needs to be invented or paraphrased.

1. **Strategy and Digital Direction** — Brand/digital strategy; market research; product discovery; customer journeys; audits; conversion strategy; content strategy; technology roadmaps; growth planning.
2. **Brand Identity and Creative Systems** — Naming/positioning; logos; visual identity; guidelines; typography/color; brand voice; social systems; presentation design; packaging and campaign creative.
3. **Websites and Digital Experiences** — Corporate, portfolio, e-commerce, landing, CMS, and interactive/WebGL websites; web apps; redesigns; conversion optimization; performance/accessibility improvements.
4. **Product Design and Engineering** — MVPs; SaaS; mobile apps; UI/UX; design systems; prototyping; front-end/back-end engineering; APIs; maintenance and iteration.
5. **AI, Automation, and Business Systems** — AI assistants; workflow automation; lead routing; CRM; support automation; knowledge assistants; dashboards; document workflows; data synchronization; custom operations tools.
6. **Content, Motion, and Campaigns** — Video; motion graphics; explainers; 3D content; social content; photography; campaign concepts; performance creative; launch work; retainers.
7. **Marketing and Growth** — Paid campaign creative/management; social strategy; SEO; email/lifecycle marketing; lead funnels; landing-page optimization; reporting; growth experiments.
8. **Studio Services** — Photo/video shoots; podcast recording; product shoots; content sessions; interviews; creative direction; equipment; editing; studio rental.
9. **Ongoing Support** — Website care; product maintenance; content and growth retainers; automation support; analytics reporting; fractional partnership.

**Not yet specified (needs client input, do not invent):** exact outcomes copy, deliverables list, and indicative pricing approach *per individual service* within each group. The scope lines above are locked; the marketing copy layer on top of them is not.

## 8. Studio Booking Flow

1. Select booking type (studio rental, photo, video, podcast, product shoot, content production, consultation, custom).
2. Select date, start time, duration, party size.
3. Choose add-ons (operator, photographer/videographer, lighting, audio engineer, styling, equipment, editing, set design, crew).
4. Provide purpose, deliverables, reference links, team size, special requirements.
5. Review estimate, availability status, cancellation rules, deposit terms.
6. Submit request or pay deposit → booking reference, confirmation email, calendar invite, internal notification.

Admin side needs: availability calendar, blackout dates, lead time rules, cancellation policy, rates/add-ons, approvals, reschedules, manual booking entry, invoices/payment links, calendar sync.

## 9. Package Builder

Guided, non-binding estimate tool (binding only if a fixed-price package is explicitly configured by admin). Every submission saves as a structured lead.

Flow: Goal → Scale (Starter/Growth/Scale/Custom) → Modules → Constraints (timeline, budget, industry) → Estimate (range/fixed/starting-from/quote-only + exclusions + disclaimer) → Conversion (save/email/request proposal/schedule call).

Package groups: Brand Launch, Website Launch, Digital Growth, Product MVP, Automation Sprint, Content Engine, Studio Production, Custom Build.

## 10. Portfolio / Case Studies

Filters: service, industry, project type, technology, year.
Case study fields: client/project, industry, services, timeline, challenge, approach, solution, media gallery, metrics, testimonial, related work, CTA.
CMS states: draft, in review, published, scheduled, archived, password-protected (optional).

## 11. Contact and Lead Management

Entry points: global CTAs, service pages, case studies, studio booking, package builder, AMO prompts, contact page, footer. Every submission captures source, campaign, landing page, and related booking/package context.

Contact form fields: name, work email, company, phone (optional), project type, services, budget, timeline, brief, reference links, optional upload, preferred contact method, consent.

Lead lifecycle: New → Contacted → Qualified → Discovery Scheduled → Proposal Sent → Negotiation → Won / Lost / Nurture / Spam.

Forms must: validate input, mitigate spam, confirm receipt to visitor, notify internal owner, create a CRM/admin lead record, support assignment/notes, retry failed notifications.

## 12. Admin Control Center

- **Dashboard:** lead funnel, new inquiries, upcoming bookings, package submissions, conversion metrics, top content, performance snapshot, activity feed.
- **Content:** pages, services, case studies, testimonials, about/team content, insights, media library, reusable CTAs, SEO fields, redirects, publish workflow.
- **Commercial:** leads, activities, owners, statuses, studio availability, bookings, add-ons, prices, package rules, invoice/payment references.
- **AMO controls:** scene copy, captions, CTAs, featured service objects/case studies, sound toggle default, 3D on/off, static-fallback selection. (Model/rig/new animation production stays in the 3D asset pipeline, not this panel.)
- **Governance:** users, roles, MFA, integrations, site settings, audit log, backups, privacy controls.

## 13. Roles and Permissions

| Role | Access |
|---|---|
| Super Admin | Full system, security, integrations, users, billing |
| Administrator | Content, services, work, leads, bookings, package setup |
| Content Editor | Pages, services, case studies, insights, media — no system settings |
| Sales/Business Dev | Leads, package submissions, notes, activities, proposal status |
| Studio Manager | Availability, bookings, add-ons, booking details, ops notes |
| Marketing Manager | Campaign content, SEO, analytics, insights, testimonials |
| Analyst/Viewer | Read-only reporting / approved modules |

## 14. Data Model (entities, not full schema — see TRD for schema)

User/Role · Lead/Lead Activity · Service Category/Service · Package/Package Rule/Submission · Studio Booking/Add-on/Availability Block · Case Study/Testimonial · Page/AMO Scene/Media Asset · Insight/Site Setting/Audit Log.

## 15. Non-Functional Requirements Summary

- **Accessibility:** WCAG 2.2 AA. No content conveyed only through sound, color, or 3D motion. Reduced-motion support mandatory.
- **SEO:** SSR/SSG for indexable content, unique metadata, structured data (Organization, Service, FAQ, Article, Breadcrumb), sitemap, redirect manager.
- **Security:** HTTPS, RBAC, MFA for privileged roles, rate limiting, bot protection, input sanitization, encrypted secrets, audit log, daily backups.
- **Performance:** see TRD — this is the section most at risk of being under-specified, so it gets its own document.

## 16. Recommended Technical Architecture

| Layer | Recommendation |
|---|---|
| Front end | Next.js + TypeScript; React; SSR/SSG for indexable content; tokenized CSS/Tailwind; Framer Motion; React Three Fiber/Three.js; GSAP for timeline-level sequences. |
| Back end | Server routes or API service; PostgreSQL; Prisma/equivalent ORM; job queue for notifications, media work, and integration retries. |
| CMS/Admin | Headless CMS for marketing content plus custom modules for leads, pricing rules, booking, and operations. |
| Infrastructure | Vercel/Cloudflare/AWS-class hosting; CDN; managed database; object storage; error tracking; monitoring; staging and production. |
| Integrations | CRM, calendar, scheduling, payment, email, file storage, analytics, support, automation, and bot protection selected as modular providers. |

This is the architecture shape. Specific vendor choices for each "modular provider" (which CRM, which payment gateway, etc.) are tracked in `/docs/decisions/PHASE0_DECISIONS.md`, not hardcoded here, since they can change without altering scope.

## 17. 3D Asset and Animation Requirements

- AMO must be a unique, production-quality character: clean web-ready topology, facial rig/blendshapes, expressive eyes/brows/mouth, skeletal rig where needed, and a consistent identity across desktop, mobile, still, and marketing executions.
- **Required animation states (13 — build all of them, no more, no fewer):** neutral idle; curious observation; eye tracking; greeting; thinking; explaining/gesturing; discovery; confident presentation; studio work; device operation; camera/light interaction; float/transition; closing gesture.
- **Required environments (9):** hero, floating capability objects, modular company world, studio, technology/data space, service display, work gallery, package assembly, closing/contact.
- **Runtime delivery:** glTF/GLB preferred; Draco/Meshopt geometry compression; KTX2/Basis textures; LODs; baked lighting where practical; animation optimization; lazy scene loading; poster/video fallback for every major scene. (See TRD Section 3 for hard budget numbers.)
- Ambient sound is optional, off by default where appropriate, toggleable, and never required for comprehension.

## 18. Responsive Behavior

| Breakpoint | Behavior |
|---|---|
| Desktop | Fullest cinematic scenes, pointer-aware AMO behavior, richer lighting/materials, optional scene navigation. |
| Tablet | Simplified scene detail, reduced particles/textures, touch-first interactions, static content and CTAs prioritized. |
| Mobile | First-class conversion experience; selectively rendered 3D, short loops, or static scenes; narrative stays vertically sequenced; booking/forms/package builder optimized for speed. |
| Low-power or no WebGL | Serve static imagery or prerendered motion; retain all content, navigation, forms, booking, pricing, and lead flow. |

## 19. Analytics and Measurement

Track: homepage view; AMO scene reached/interaction started; motion or 3D disabled; service/case-study views; booking and package-builder starts/completions; package modules selected; estimate generation; form start/submission/errors; discovery-call click; attribution; fallback activation.

Business metrics: qualified leads, conversion by entry point, studio booking conversion, package completion, projected package value, requested services, lead-to-proposal, proposal-to-win, revenue attribution.

Use privacy-conscious analytics with consent controls. Connect Search Console, error tracking, CRM reporting, and optional session replay only under appropriate privacy rules. (See Decisions Log for which specific analytics vendor is selected.)

## 20. Acceptance Criteria (must all be true at launch)

1. Brand name "Vyara Amogya Technologies" and character name "AMO" used consistently across the live site.
2. Full 9-scene narrative order implemented exactly as listed in Section 6.
3. Every conversion action (contact, package builder, booking) works with 3D/audio/motion off.
4. Inquiries, package requests, and booking requests all produce records, confirmations, notifications, and trackable statuses end-to-end.
5. Admin can update content, pricing, availability, bookings, projects, leads, SEO — with enforced and audited access boundaries.
6. WCAG 2.2 AA target met; performance budgets in TRD met on supported browsers/devices.

## 21. Delivery Phases

0. Discovery & Planning — priorities, content inventory, AMO direction, pricing data, studio rules, stack decisions.
1. Experience & Content Design — sitemap, flows, wireframes, design system, scene storyboard/script, content model, booking/package design.
2. 3D Production — concept art, AMO model/rig, animation clips, environments, optimized runtime assets, fallback media.
3. Development — front end, CMS/admin, lead/booking/package modules, integrations, 3D integration, monitoring/analytics.
4. QA & Content Population — functional, browser/device, accessibility, performance, SEO, security, UAT, content review.
5. Launch — production deploy, DNS/redirects, monitoring/backups, analytics verification, team training, post-launch review.

## 22. Future Roadmap (explicitly out of v1 scope)

AMO voice interaction, visitor personalization, client portal/dashboard, live confirmed bookings + auto-proposal generation, multilingual/regional pricing, AI-assisted brief refinement, AR/immersive AMO, community/careers pages.

---

**Instruction to any AI coding agent using this document:** Build only what is specified in Sections 1–21. If a requirement is ambiguous, stop and flag it rather than inventing behavior, copy, pricing, or additional pages. Section 3 (Non-Goals) is binding — do not add login systems, payment rails, chat assistants, or extra languages unless this document is amended. For anything marked "not yet specified" or "needs client input," check `/docs/decisions/PHASE0_DECISIONS.md` first — it may already be resolved there.
