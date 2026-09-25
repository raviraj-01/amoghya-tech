# Service Rail

## Scope

The new `src/components/services` module is inserted at the beginning of
`LandingSections`, after the animated hero (or its existing static fallback)
and before pricing. Integration consists only of an import and component mount.
Hero sequencing, assets, loading, autoplay, motion and scroll timings are unchanged.
Global styles, typography and dependencies are unchanged. Existing service route
paths are reused for the updated overview and real category/sub-service content.

The current brief's eleven category names match sections 5-15 of
`Amoghya_Technologies_Customer_Pricing_Offers.docx`. That document supplies the
selected sub-services; the older nine-group Markdown PRD is not used to rename
the categories. No pricing or expired offers are included in the rail.

## Behavior

- Desktop/tablet: one scoped GSAP ScrollTrigger, equal progress per category,
  layered panels that zoom and travel upward, clipped details and a clickable
  number index. The next panel is partially visible before its turn.
- The Services trigger has local refresh priority -1 so the upstream hero pin
  is measured first. No global scroll configuration is changed.
- Mobile: unpinned rows, IntersectionObserver emphasis and compact neighbors.
- Reduced motion and short desktop viewports: all details in normal flow.
- Animation and observers are cleaned up on navigation and breakpoint changes.
- Category actions open `/services/[slug]`; selected sub-service links land on
  matching anchored content sections. Each category has one contact action after
  its four sub-sections. The Services overview uses the same eleven categories.

## Verification

Run against the existing development server:

```sh
node scripts/test-service-rail.cjs <path-to-playwright> http://localhost:3000
node scripts/test-scroll-browser.cjs <path-to-playwright> http://localhost:3000
node scripts/test-service-journey.cjs <path-to-playwright> http://localhost:3000
npx tsc --noEmit
```

The rail check covers all eleven services at 1440, 1024 and 768 pixels, index
navigation, pin release into pricing, 390/320-pixel mobile widths, reduced motion,
text bounds, duplicate pins and console errors. Screenshots go to `.chrome-cdp`.
The existing hero regression covers intro handoff, service-page return position,
slow scrolling, delayed frames, rapid reversals and the mobile fallback.
The journey regression checks actual zoom transforms, all eleven detail pages,
all 44 sub-section destinations, contact placement, mobile detail layouts,
reduced-motion navigation and homepage return after opening a category.
