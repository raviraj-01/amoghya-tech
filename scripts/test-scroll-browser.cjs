const { chromium } = require(process.argv[2] || "playwright");
const { spawn } = require("node:child_process");
const assert = require("node:assert/strict");
const SCROLL_PX_PER_SECTION = 2800;
require("node:fs").mkdirSync(".chrome-cdp", { recursive: true });
(async () => {
  const port = 3017;
  const baseUrl = process.argv[3] || `http://localhost:${port}`;
  const server = process.argv[3]
    ? null
    : spawn(
        process.execPath,
        ["node_modules/next/dist/bin/next", "start", "-p", String(port)],
        { stdio: "ignore", windowsHide: true },
      );
  let browser;
  try {
    for (let i = 0; i < 60; i++) {
      try {
        if ((await fetch(baseUrl)).ok) break;
      } catch {}
      await new Promise((r) => setTimeout(r, 500));
    }
    browser = await chromium.launch({ channel: "chrome", headless: true });
    const page = await browser.newPage({
      viewport: { width: 1440, height: 900 },
    });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(baseUrl);
    await page.waitForSelector("body[data-vat-intro-playing]");
    await page.waitForFunction(
      () => !document.body.hasAttribute("data-vat-intro-playing"),
      null,
      { timeout: 45000 },
    );
    const held = await page.locator("canvas").evaluate((c) => c.toDataURL());
    await page.evaluate(() =>
      scrollTo({ top: 0.75 * SCROLL_PX_PER_SECTION, behavior: "instant" }),
    );
    await page.waitForTimeout(1200);
    const departure = await page.evaluate(() => ({
      y: scrollY,
      frame: document.querySelector("canvas").dataset.frame,
    }));
    await page
      .getByRole("link", { name: "Explore services", exact: true })
      .click();
    await page.waitForURL("**/services");
    await page.goBack();
    await page.waitForFunction(
      (y) =>
        Math.abs(scrollY - y) < 2 &&
        !document.body.hasAttribute("data-vat-intro-playing"),
      departure.y,
    );
    await page.waitForFunction(
      (frame) => document.querySelector("canvas")?.dataset.frame === frame,
      departure.frame,
    );
    await page.waitForTimeout(800);
    assert.ok(
      Math.abs((await page.evaluate(() => scrollY)) - departure.y) < 2,
      "return position stays stable",
    );
    assert.ok(
      await page
        .getByRole("link", { name: "Explore services", exact: true })
        .isVisible(),
    );
    await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForTimeout(1200);
    for (let i = 0; i < 6; i++) {
      await page.mouse.wheel(0, 120);
      await page.waitForTimeout(60);
    }
    await page.waitForTimeout(800);
    assert.ok(
      await page.evaluate(() => scrollY > 600),
      "native wheel input remains responsive",
    );
    assert.notEqual(
      await page.locator("canvas").evaluate((c) => c.toDataURL()),
      held,
      "wheel input advances the sequence",
    );
    await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForTimeout(1200);
    const slow = await page.evaluate(async () => {
      let previous = performance.now();
      const start = previous,
        gaps = [],
        frames = new Set();
      await new Promise((resolve) => {
        const tick = (time) => {
          gaps.push(time - previous);
          previous = time;
          scrollTo({ top: (time - start) * 0.18, behavior: "instant" });
          frames.add(document.querySelector("canvas").dataset.frame);
          if (time - start < 12000) requestAnimationFrame(tick);
          else resolve();
        };
        requestAnimationFrame(tick);
      });
      gaps.sort((a, b) => a - b);
      return {
        p95: gaps[Math.floor(gaps.length * 0.95)],
        longFrames: gaps.filter((x) => x > 50).length,
        uniquePoses: frames.size,
      };
    });
    console.log(JSON.stringify({ slow }));
    assert.ok(slow.uniquePoses > 70, "slow scroll must advance decoded poses");
    await page.route("**/frames-webp/**", async (route) => {
      await new Promise((r) => setTimeout(r, 180));
      await route.continue().catch(() => {});
    });
    for (const section of [6, 2, 5, 3, 1, 4]) {
      await page.evaluate(
        (y) => scrollTo({ top: y, behavior: "instant" }),
        (section + 0.65) * SCROLL_PX_PER_SECTION,
      );
      await page.waitForTimeout(750);
      assert.ok(
        await page
          .locator('[aria-label="AMO guided landing narrative"] h2')
          .isVisible(),
        "copy responds while image requests are delayed",
      );
      await page.waitForFunction(
        (folder) =>
          document
            .querySelector("canvas")
            ?.dataset.frame?.startsWith(`${folder}:`),
        section + 1,
        { timeout: 8000 },
      );
      assert.ok(
        await page.locator("canvas").evaluate((c) => {
          const pixels = c
            .getContext("2d")
            .getImageData(0, 0, c.width, c.height).data;
          let dark = 0;
          for (let i = 0; i < pixels.length; i += 64)
            if (pixels[i] < 100 && pixels[i + 3] > 200) dark++;
          return dark > 100;
        }),
        "the decoded canvas contains a visible character",
      );
      await page.screenshot({ path: `.chrome-cdp/scroll-jump-${section}.png` });
    }
    for (let i = 0; i < 24; i++) {
      await page.evaluate(
        (y) => scrollTo({ top: y, behavior: "instant" }),
        ((i % 7) + 0.65) * SCROLL_PX_PER_SECTION,
      );
      await page.waitForTimeout(35);
    }
    await page.waitForFunction(
      () => document.querySelector("canvas")?.dataset.frame?.startsWith("3:"),
      null,
      { timeout: 8000 },
    );
    await page.unroute("**/frames-webp/**");
    await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForTimeout(1800);
    assert.equal(
      await page.locator("canvas").evaluate((c) => c.toDataURL()),
      held,
      "reverse restores exact intro handoff",
    );
    await page.setViewportSize({ width: 1024, height: 700 });
    await page.evaluate(() =>
      scrollTo({ top: 1.44 * SCROLL_PX_PER_SECTION, behavior: "instant" }),
    );
    await page.waitForTimeout(1500);
    await page.screenshot({ path: ".chrome-cdp/scroll-compact-entrance.png" });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(500);
    assert.equal(
      await page.locator("canvas").count(),
      0,
      "mobile fallback preserved",
    );
    assert.deepEqual(errors, []);
    console.log(
      JSON.stringify({
        slow,
        delayedJumps: "passed",
        handoff: "passed",
        mobile: "passed",
        errors,
      }),
    );
  } finally {
    if (browser) await browser.close();
    server?.kill();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
