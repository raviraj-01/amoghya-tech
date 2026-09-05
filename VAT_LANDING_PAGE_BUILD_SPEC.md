# Vyara Amoghya Technologies — Landing Page Build Spec
This is the single source of truth for building the site. Everything needed is here or explicitly marked as an open item. Do not invent content for anything marked `[TBD]` or `[NEEDS INPUT]`.

---

## 1. Brand Identity

**Company:** Vyara Amoghya Technologies (VAT Creative Studio)
**Tagline:** "Beyond Your Expectations"
**Established:** 2025, Bengaluru, Karnataka

**Color palette:**
- Primary black: `#000000` / near-black
- Background: white / cream (`#FFFFFC`-ish)
- Accent (single accent color only): lime-green, matches the character's visor graphic and shoe accents, approx `#C8FF3D`

**Typography:**
- Wordmark ("VAT") is a custom condensed display face — do not attempt to recreate for body text
- Body/UI text: modern grotesk sans-serif (Inter, Neue Montreal, or similar)

**Buttons:**
- Primary CTA: dark filled pill shape
- Secondary CTA: light/outline pill shape
- Consistent corner radius site-wide

---

## 2. Character: AMO

Round white helmet, dark visor showing an expressive glowing green-graphic face (changes per pose/section, see Section 4), black tracksuit with "AMO" and "VAT" branding, white sneakers with lime-green accents. Small, stylized, 3D-rendered mascot.

**Character design must never drift** between sections/frames — same helmet shape, same outfit, same proportions throughout the entire site experience.

---

## 3. Animation System (Technical Spec)

### 3.1 Frame Source Structure
Frames live in `public/frames/frame-0/` through `public/frames/frame-N/`, each folder containing a sequential numbered image set for that segment of the journey. Treat all folders as ONE continuous logical timeline (folder 0's frames → folder 1's frames → folder 2's, etc.), not independent players.

`[NEEDS INPUT: exact frame-folder → section mapping — see Section 4 table below, fill in "Frame Folder" column]`

### 3.2 Hero Segment: Autoplay → Scroll Handoff
- On page load: auto-advance through frame-0 on a fixed timer (like normal video playback). Page scroll is **locked** during this.
- The instant frame-0 reaches its last frame: unlock scroll, switch frame-advance from timer-driven to **scroll-progress-driven** for every subsequent folder.
- No visible pause or gap at this handoff.

### 3.3 Seamless Folder Boundaries
At every junction between two folders, add a short safety crossfade (blend opacity over ~3–5 frames) between the outgoing folder's final frame and the incoming folder's first frame. This guarantees zero visible pop/break at the seam even if source frames aren't pixel-perfect matches. This is insurance, not decoration — always include it.

### 3.4 Character Motion Path
- **Not a linear slide.** Horizontal position uses an eased S-curve: slow at origin, accelerates through center, eases into destination.
- **Slight vertical arc:** implement as a quadratic bezier (start point → control point offset vertically at horizontal midpoint → end point) so the character visibly curves through the middle of the screen rather than moving in a flat straight line.
- Handle left-to-right and right-to-left transitions with the same consistent motion language (mirrored, not different behavior per direction).
- **Direction alternates per section:** character travels left→right through the curve, then right→left on the next section, then back again, continuing this alternation through the full sequence (matching the reference path diagrams the client provided: a smooth curve dipping through center, not a straight cut).
- Content for each section always docks on whichever side the character is NOT currently resting on for that section (see 3.5), computed live, not hardcoded.

### 3.5 Content Docking
- Each section's content block (headline, copy, CTAs) docks to whichever side the character is **not** currently occupying — computed dynamically from the character's live interpolated position, never hardcoded per section.
- Content animates in using the **same scroll-progress value** driving the character, beginning its entrance once the character clears the horizontal midpoint. They must move in visible lockstep.

### 3.6 Canvas / Rendering
- Use `<canvas>`, not swapped `<img>` tags or a scrubbed `<video>` element — gives frame-accurate control without buffering issues.
- Canvas/container background: transparent or matching page background. **Never black.** No letterboxing.
- Preload the next folder's frames while the current folder is still playing/scrubbing.

### 3.7 Responsive / Mobile
- Below `[NEEDS INPUT: breakpoint, suggest 768px]`, disable the pinned scroll-jack entirely (known jank risk on mobile browsers).
- Fallback: static image per section (last frame of that section's folder), normal document scroll, no pinning.
- Content stacks vertically above/below the static character image on mobile.
- Test on real devices, not just dev-tools resize.

### 3.8 Accessibility
- Respect `prefers-reduced-motion`: same static-image fallback path as mobile.
- All interactive elements keyboard-navigable and properly labeled.
- Sufficient text/background contrast.

### 3.9 Performance
- Compress/resize frame images for web (not full-res source PNGs). Use WebP with PNG fallback.
- Lazy-load folders ahead of need only — never eagerly load all folders on initial page load.
- Run a Lighthouse check before considering this done.

### 3.10 What Comes After the Last Frame
Once the final frame folder completes: resume normal document scroll into the footer. No pin, no scroll-jack from that point on.

### 3.11 Standing Rule: No Debug UI
Never render, in production: scene labels ("Scene 0X: ..."), the section-navigator list, tier badges ("3D (Tier 2)"), scroll hint text, or any other dev/QA overlay. Gate any of these behind a `?debug=true` flag if needed for internal use — they must never be visible to a real visitor. (This has broken/reappeared before — check carefully.)

---

## 4. Section-by-Section Content Map

> ⚠️ **ASSUMPTION, NOT CONFIRMED:** the client has 8 frame folders (`frame-0` through `frame-7`) but the PRD has 9 sections. The mapping below assumes `frame-0` covers the hero/Arrival autoplay-then-scrub segment, `frame-1` through `frame-7` cover the next 7 sections in order, and **Closing/Contact reuses the final static frame of `frame-7`** rather than getting its own animated folder. **This must be confirmed or corrected by the client before build** — if wrong, every row below shifts.

| # | Section | Frame Folder | Character Expression/Pose | Content |
|---|---------|---------------|---------------------------|---------|
| 1 | Arrival | `frame-0` (assumed) | Neutral → noticing | Dialogue: *"Oh... you're here. I'm AMO. And apparently, I'm supposed to show you what we do."* CTAs: "See what AMO can do" (secondary), "Start a Project" (primary) |
| 2 | Capability Reveal | `frame-1` (assumed) | Confident, playful (wink) | Headline framing: "I do quite a lot." Showcases core service categories. |
| 3 | The Vyara Amoghya World | `frame-2` (assumed) | Calm, exploring | `[TBD content — not yet written]` |
| 4 | AMO in the Studio | `frame-3` (assumed) | Focused, creative | `[TBD content — not yet written]` |
| 5 | Technology & Intelligence | `frame-4` (assumed) | Analytical, considering | `[TBD content — not yet written]` |
| 6 | Services Deep Dive | `frame-5` (assumed) | Confident (sunglasses) | See Section 5 — pricing teaser content, NOT full tables |
| 7 | Selected Work | `frame-6` (assumed) | Proud, energetic (star eyes) | `[NEEDS INPUT: actual portfolio/work items — not yet provided]` |
| 8 | Build Your Package | `frame-7` (assumed) | Focused/building | Entry point into the interactive pricing/package builder — see Section 5 |
| 9 | Closing / Contact | *No dedicated folder — reuses last static frame of `frame-7`* (assumed) | Warm, static | Final CTA, contact form/link — `[NEEDS INPUT: form destination/email — not yet provided]` |

---

## 5. Pricing Content Strategy

Source data: `Amoghya_Technologies_Customer_Pricing_Offers.docx` (18 sections, 12 service categories × 3 tiers, 22 industry bundles). This is **too dense for the scroll narrative** — split as follows.

### 5.1 On the landing page (light, glanceable)
- Launch pricing urgency badge/banner: "Launch Pricing valid through 5 September 2026"
- Three-tier concept, one line each: **Starter** (lean scope, fast turnaround) / **Growth ★ Most Popular** (most clients' sweet spot) / **Enterprise** (multi-location, complex integrations, compliance needs)
- 12 service category cards, one-line description + "Starting at ₹[lowest launch price]" each — no full table inline. Categories: Brand Strategy & Identity, Website Development, Mobile Application Development, Custom Software Solutions, Artificial Intelligence Solutions, Digital Marketing, Creative Content Production, UI/UX Design, Cloud & Technology Services, Business Automation, Business Consulting
- "Why Businesses Choose Amoghya" value props (one team/every service, built-in AI advantage, fixed transparent pricing, fast clearly-communicated delivery, Bengaluru-based/WhatsApp-reachable)
- 3–4 "Free With Every Project" bonuses as trust bullets (free strategy consultation, free audit report, free WhatsApp catalogue setup, free Google Business Profile setup)
- 1–2 industry bundle teasers linking to the full list (e.g. "Startups save ₹5K with our Launch Bundle")

### 5.2 In a subsection / interactive detail view (this is what "Build Your Package," PRD Scene 8, actually is)
- Full pricing tables per category: all 3 tiers × Standard/Launch pricing × what's-included breakdown
- All 22 industry combo bundles, filterable by industry
- Terms & Validity, GST notes, payment milestones — footer/legal page
- Referral & Loyalty Bonus detail — footer link

---

## 6. Global Page Structure
- Sticky top nav: logo (left), links (Home, What We Do, Work, Studio, Build Your Package, About, Contact), primary CTA (right)
- Footer: company name, tagline, contact info, social links, copyright, legal/terms link
- `[NEEDS INPUT: actual destination for every CTA button — external form? mailto? anchor scroll?]`

---

## 7. Open Items Before This Is Fully Buildable
1. Frame-folder → section mapping (Section 4 table)
2. Content copy for Sections 3, 4, 5, 7 (World, Studio, Technology, Selected Work)
3. Actual portfolio/work items for Selected Work
4. CTA destinations (contact form, booking link, etc.)
5. Mobile breakpoint confirmation
