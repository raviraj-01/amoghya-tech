# Delivery Review - 7 September 2026

## Animation and Assets

- Preserved the eight source clips, intro-to-scroll handoff, mirrored quadratic
  Bezier paths, equal 1120px scroll sections, existing content and destinations.
- All 1570 PNG frames remain tracked and unchanged. Build-generated 1120px WebP
  frames total 27.6 MB versus 802.3 MB of PNGs. WebP failures use the PNG original.
- A bounded frame window replaces whole-folder loading. Four downloads run at
  once; obsolete frames are released and scroll jumps reprioritize the queue.
- GSAP supplies one smoothed scroll progress value. Framer Motion values update
  character and content transforms without rerendering the landing tree each tick.
- Text enters after the character passes the midpoint, holds on its assigned
  side, and exits before the next section. The last section releases into pricing.
- Mobile and reduced-motion visitors use lazy static scenes. Loading failures
  release the intro scroll lock and show the static content instead of hanging.
- The first scroll clip uses measured helmet/foot anchors to match the intro's
  final leaning pose, then settles into its normal framing over the first 45%
  of the section. The outgoing logo fades without leaving a second large AMO.
  Transparent image-edge masking prevents rotated background rectangles.
  A stable scrollbar gutter preserves canvas dimensions when scroll unlocks.
- Page, navbar, and canvas now keep a fixed #ededeb background. Per-frame
  background sampling was removed to prevent source shadows from darkening
  the website. Chrome verified 108 identical colour samples through the intro,
  handoff, all seven scroll sections, and reverse scrolling.

## Verified Locally

- Production build, TypeScript and `npm run test:frames` pass.
- Chrome: intro/handoff, all seven scroll sections, rendered canvas pixels,
  rapid/reverse scroll, final pin release, resizing and reload at a scroll offset.
- Seven public routes return HTTP 200. Leaving the intro releases scroll lock.
- Mobile at 390x844: static scenes, no horizontal overflow, compact menu and Escape.
- Desktop at 1440x900 and 1024x700: screenshots reviewed; compact navigation is
  used below 1280px to prevent wrapping.
- Reduced motion, missing first frame, and blocked WebP/PNG fallback tested.
- No JavaScript page errors in the main browser checks.
- Eight-second local continuous-scroll sample: no frame gaps above 50ms;
  95th percentile requestAnimationFrame interval approximately 20.7ms.
- Initial local desktop Lighthouse: performance 99, accessibility 95,
  best practices 100, SEO 100; LCP 0.7s, total blocking time 0ms, CLS 0.
  The reported navbar-tagline contrast issue was corrected afterward.
- Final accessibility-only Lighthouse report scores 100, including a passing
  contrast audit. Lighthouse saved the report successfully but its CLI exited
  with a Windows EPERM error while deleting its temporary Chrome profile.

These are local Chrome measurements, not guarantees for Netlify, Safari,
physical phones, or real customer connections. Original image lighting and
pose differences are still present in the supplied artwork.

## Before Customer Delivery

The visual improvements do not make the existing commercial backend complete:

- `ContactForm.tsx` prevents submission without sending a request.
- `PackageBuilderFlow.tsx` shows completion using local component state only.
- `StudioBookingFlow.tsx` simulates a reference and confirmation using a timer;
  it does not reserve a slot or send an email. Its calendar download is an alert.
- A real submission destination and booking handling are required. The user
  has been asked for the intended endpoint/service or business email.
- Public detail pages still contain some specification/placeholder copy, and
  legal policy content and real portfolio details require a delivery review.
- Existing package and studio calculations were preserved, not repriced or
  validated as approved commercial rates.

No push or deployment was performed. Build with `npm run build`, with dev
dependencies installed, to generate the optimized media on the host.
