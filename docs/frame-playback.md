# Progressive frame playback

- Intro handoff waits for its previous end frame and 12 decoded opening poses.
- Scroll requests the target, up to 28 frames ahead and 8 behind, plus nearby
  scene-boundary frames. Existing downloads finish; only queued work is replaced.
- Four fetch/decode jobs run concurrently. CDN failures fall back to local WebP,
  then local PNG. Each transport attempt has a 15-second timeout.
- At most 48 images remain decoded. A separate 48 MiB LRU holds compressed blobs
  across route changes. Revisiting an evicted decoded image uses its retained
  blob without a network request. Full reloads rely on browser HTTP caching.
- Downloads are demand-driven, not a preload of the complete sequence. Compressed
  cache eviction can require downloading an old frame again; bounded memory cannot
  guarantee permanent retention for arbitrary future asset sizes.
- GSAP's animation-frame ticker renders only the latest requested position. If
  the exact image is unavailable, use a decoded pose between the last displayed
  frame and target, or retain the existing canvas without clearing it.

## Verification

Run `npm run test:frames`, `npm run test:handoff`, and `npx next build`.
With Playwright installed, run:

```sh
node scripts/benchmark-progressive-frames.cjs playwright after
node scripts/check-frame-transitions.cjs playwright
```

The optional first argument can also be an absolute Playwright module path.
Tests launch and stop a production server on port 3017. Keep that port free.
The benchmark tests disabled browser cache at 200,000 bytes/sec and 150 ms latency,
then cached reload, and writes results/screenshots into ignored `.chrome-cdp/`.
Transition checks jump into each scene and inspect canvas pixels.

Measured representative CDN frames are WebP, 1120 x 630, averaging 17.5 KB.
The initial benchmark advanced 74 poses in 12 seconds both before and after this
change; its roughly 0.3-second longest initial hold did not reproduce the reported
long freeze. The change addresses cancellation churn and repeat downloads, not
the existing scroll duration, frame dimensions, image quality, or visual design.
An uncached jump outside the preload window can still briefly hold its last pose
on a slow connection. No loader can display frames before their bytes arrive.
