# Scroll driver verification

## Ownership

`ScrollSystem` is mounted in the persistent root layout. It owns the only Lenis
instance and the only Lenis RAF callback, driven by the GSAP ticker. Seconds from
GSAP are converted to milliseconds for Lenis. ScrollTrigger updates and route
position subscriptions are dispatched from the same Lenis scroll event.

Do not enable ScrollTrigger's input normalizer alongside Lenis. Both handle wheel
and touch input. The supported Lenis/GSAP integration uses the ticker and update
callback without a second input controller.

In development, inspect `window.__vatLenis`. Its identity should stay unchanged
when navigating between pages. React Strict Mode may log a setup, cleanup and
second setup; there must never be two live instances. Cleanup removes the ticker
callback, subscription and debug reference.

## Pacing

- Shared `PX_PER_FRAME`: 16 (was 8).
- All pinned ranges derive from frame counts through `scrollDistanceForFrames`.
- Lenis lerp: 0.075; wheel multiplier: 0.7; touch multiplier: 0.8.
- Touch synchronization is enabled; test Safari/iOS separately.
- Shared ScrollTrigger scrub remains 1.
- Input scaling and damping reduce movement, but are not a hard velocity cap.
- Keyboard and scrollbar input retain native accessibility behavior; pinned
  animations still use the increased distance.

## Automated check (no server)

Run `node scripts/test-scroll-driver.cjs` with Playwright installed, or pass its
module path as the first argument. This runs the actual transpiled scroll driver
with real Lenis and GSAP in Chrome. It checks singleton ownership, ticker damping,
equal travel for large wheel bursts versus small frequent wheel events, intro
locking, subscriptions and cleanup/remount.

This is not a full application test or physical device test.

## Physical-device acceptance

1. With a real mouse wheel, scroll slowly and then flick through the hero, all
   service panels and the outcome stack. Confirm each transition remains readable.
2. Repeat on a physical trackpad, including direction reversals mid-motion.
3. During the intro, attempt to scroll; no movement should accumulate for playback end.
4. Open a service, then go Back. Confirm the old position restores without replaying
   the intro or carrying momentum into the new route.
5. Check keyboard, anchors, mobile touch, nested menus and reduced-motion mode.

Physical-device and full-page visual checks remain pending. No site server was
started for this change.
