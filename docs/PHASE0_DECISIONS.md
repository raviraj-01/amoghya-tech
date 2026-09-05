# Phase 0 Decisions Log
Answers to the open questions the build agent raised after its first read of `/docs`. Two categories below: **RESOLVED** (answered here, agent can proceed) and **NEEDS CLIENT INPUT** (real business/content decisions — do not guess these, come back to this file once they're answered).

---

## RESOLVED

**Missing referenced documents**
- `PROJECT_STRUCTURE.md` and this decisions log now exist — make sure both are actually copied into `/docs` (and `/docs/decisions/`) in the repo before the agent's next read. The agent didn't find them because they weren't placed yet, not because they don't exist.
- "Final-Cut Master PRD" as a separate file is retired. Its verbatim content (scene dialogue, full service taxonomy text, technical architecture table, 3D asset/animation requirements) has been merged directly into `FINAL_PRD.md` Sections 6, 7, 16, and 17. Don't look for a separate source file — `FINAL_PRD.md` is now self-contained.
- PRD Sections 19–20 gap: fixed. `FINAL_PRD.md` was renumbered; it now runs Sections 1–22, with Responsive Behavior at §18 and Analytics at §19. If any doc still cites old numbers, treat `FINAL_PRD.md`'s actual section headers as the source of truth over any stale cross-reference.

**Section 5 — Nav label mapping**
- "What We Do" → `/services`. Confirmed.
- "Build Your Package" → `/package-builder`. Confirmed.
- "Start a Project" → routes to `/contact`, pre-filled/tagged with the entry point it was clicked from (so the lead record captures source per PRD §11). It does not need to be a separate modal — a full page navigation is fine and simpler to build correctly.

**Section 11/17 — Vendor/provider stack (technical calls, not business calls)**
Locking these now so Phase 3 isn't blocked. All are swappable later without PRD changes since they're implementation detail, not scope:
- **Database/ORM:** PostgreSQL + Prisma.
- **Admin auth/MFA:** Auth.js (NextAuth) with email OTP for MFA. Simpler to self-host and audit than a third-party auth vendor for an admin-only user base of this size.
- **Email delivery:** Resend. Good developer experience, fine for transactional volume at this scale.
- **Calendar sync:** `.ics` calendar invite attachments on confirmation emails for v1. Skip a live Google Calendar API integration for now — it's real added complexity for a feature (2-way sync) the PRD doesn't actually require, just "calendar invitation."
- **File/media storage:** Cloudflare R2 or AWS S3 (pick whichever matches the hosting choice below, for lower egress cost).
- **Bot protection:** Cloudflare Turnstile — lighter weight and less user-friction than reCAPTCHA v3.
- **Analytics:** PostHog — covers both product analytics (funnel events from PRD §19) and session replay under consent controls in one tool, instead of stitching two vendors together.
- **Hosting:** Vercel — pairs natively with Next.js, simplest path to the SSR/SSG requirement in PRD §16.
- **Payment gateway for deposits:** see NEEDS CLIENT INPUT below — the *choice* of gateway is technical (Razorpay fits an India-based client best) but *whether deposits are even collected online at v1* is a business call.

## NEEDS CLIENT INPUT — do not proceed on these without an answer

**1. Brand name: "Vyara Amogya Technologies" vs "Amoghya Technologies"**
This is the single highest-priority open item — it touches copy, metadata, logos, and the pricing document. Get the client's legal/registered name and confirm which spelling is correct before any content or SEO metadata is finalized. Until answered, `FINAL_PRD.md` stays with "Vyara Amogya Technologies" as the working name and the pricing doc's "Amoghya" spelling stays flagged as unconfirmed. Do not silently pick one.

**2. Deposit payment: live processing or request-and-invoice for v1?**
PRD §3 and §8 leave this genuinely open — it's a scope decision, not a technical one. Ask the client: do they want to take real deposit payments online at launch, or is "submit booking request → we invoice separately" acceptable for v1? This changes real build effort (payment gateway integration + PCI-adjacent handling vs. a simple status field), so get it answered before Phase 3e.

**3. Studio operational rules**
Needed from the client directly, not something to assume:
- Operating hours / bookable slots
- Blackout dates (recurring and one-off)
- Minimum booking lead time
- Cancellation/reschedule window and refund policy
- Deposit calculation rule (flat amount, % of total, or full prepay)
- Base rates for each booking type and each add-on

**4. Package builder pricing**
- Baseline price/range per package group × scale (Starter/Growth/Scale/Custom)
- Which packages are Fixed vs Range vs Starting-From vs Quote-Only
- Currency: confirm INR is correct for all clients or only Bengaluru-launch clients
- **Does `Amoghya_Technologies_Customer_Pricing_Offers.docx` serve as the seed pricing data for this site, or is it a separate/older agency-wide sheet that shouldn't be reused here?** This is tied directly to the brand-name question above — resolve that first, then this one.

**5. Service-level marketing copy**
The 9 service group *scope* lines are locked (`FINAL_PRD.md` §7). What's still missing per individual service: outcome copy, deliverables list, and indicative pricing approach. This is content-writing work, likely from the client or a copywriter, not something the coding agent should draft and ship as final.

**6. Seed case studies**
Real client name, industry, challenge/solution, metrics, images, testimonial — for however many case studies launch with real content. If real ones aren't ready by Phase 4, the CMS should launch with zero case studies rather than fake ones, per the "no lorem ipsum in production" rule in `TODO_BUILD_CHECKLIST.md` Phase 4.

**7. Scene 6, 7, 8 dialogue lines**
Flagged already in `FINAL_PRD.md` §6 — staging is defined, exact AMO dialogue for these three scenes is not. Needs content design sign-off in Phase 1.

---

**Process note for the agent:** re-read this file at the start of every phase. When a client answer comes in, this file gets updated in place with the answer moved from "NEEDS CLIENT INPUT" to "RESOLVED" — don't let answers live only in chat history where a later session can't see them.
