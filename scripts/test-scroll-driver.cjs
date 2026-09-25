const assert = require("node:assert/strict");
const fs = require("node:fs");
const ts = require("typescript");
const { chromium } = require(process.argv[2] || "playwright");

// Exercise the actual app driver with real Lenis/GSAP, without a dev server.
const compiled = ts.transpileModule(fs.readFileSync("src/components/layout/ScrollSystem.tsx", "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
}).outputText;

(async () => {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.setContent('<style>body{margin:0}main{height:30000px}</style><main></main>');
    for (const path of ["node_modules/lenis/dist/lenis.js", "node_modules/gsap/dist/gsap.js", "node_modules/gsap/dist/ScrollTrigger.js"]) await page.addScriptTag({ path });
    await page.addStyleTag({ path: "node_modules/lenis/dist/lenis.css" });
    await page.evaluate(code => {
      window.cleanups = [];
      const dependencies = {
        react: { useLayoutEffect: setup => { const cleanup = setup(); if (cleanup) window.cleanups.push(cleanup); } },
        lenis: { default: window.Lenis },
        gsap: { default: window.gsap },
        "gsap/dist/ScrollTrigger": { ScrollTrigger: window.ScrollTrigger },
        "@/lib/scroll-animation": { SCROLL_SCRUB: 1 },
      };
      const exports = {};
      new Function("require", "exports", "process", code)(name => dependencies[name], exports, { env: { NODE_ENV: "development" } });
      window.driver = exports;
      exports.ScrollSystem();
      window.firstInstance = window.__vatLenis;
      exports.ScrollSystem();
    }, compiled);
    assert.equal(await page.evaluate(() => window.firstInstance === window.__vatLenis && window.cleanups.length === 1), true, "One live instance and ticker owner");
    const config = await page.evaluate(() => ({ lerp: window.__vatLenis.options.lerp, wheel: window.__vatLenis.options.wheelMultiplier, normalizer: Boolean(window.ScrollTrigger.normalizeScroll()) }));
    assert.deepEqual(config, { lerp: .075, wheel: .7, normalizer: false });
    await page.evaluate(() => { window.events = 0; window.unsubscribe = window.driver.subscribeToSmoothScroll(() => window.events++); });
    const measure = async (count, delta) => {
      await page.evaluate(() => window.driver.scrollWithLenis(1000));
      await page.waitForTimeout(100);
      const samples = [];
      for (let i = 0; i < count; i++) { await page.mouse.wheel(0, delta); samples.push(await page.evaluate(() => ({ actual: window.__vatLenis.scroll, target: window.__vatLenis.targetScroll }))); }
      await page.waitForTimeout(2500);
      const end = await page.evaluate(() => window.__vatLenis.scroll);
      assert.ok(Math.abs(end - (1000 + count * delta * .7)) < 3, `Input distance reduced: ${end}`);
      assert.ok(samples.some(sample => sample.actual < sample.target - 1), "Ticker damps input instead of jumping directly");
      return { count, delta, end };
    };
    const wheel = await measure(4, 300);
    const trackpad = await measure(40, 30);
    assert.ok(Math.abs(wheel.end - trackpad.end) < 3, "Equal total input has equal travel");
    await page.evaluate(() => { window.unlock = window.driver.lockSmoothScroll(); });
    const lockedAt = await page.evaluate(() => window.driver.getSmoothScrollPosition());
    await page.mouse.wheel(0, 1200);
    await page.waitForTimeout(400);
    assert.equal(await page.evaluate(() => window.driver.getSmoothScrollPosition()), lockedAt, "Intro lock blocks wheel input");
    await page.evaluate(() => { window.unlock(); window.unlock(); });
    assert.equal(await page.evaluate(() => window.__vatLenis.isStopped), false);
    assert.ok(await page.evaluate(() => window.events > 0), "Restoration subscribers receive Lenis updates");
    await page.evaluate(() => { window.unsubscribe(); window.cleanups.pop()(); });
    assert.equal(await page.evaluate(() => window.__vatLenis === undefined), true, "Unmount releases debug instance");
    await page.evaluate(() => window.driver.ScrollSystem());
    assert.equal(await page.evaluate(() => window.__vatLenis !== window.firstInstance && window.cleanups.length === 1), true, "Strict Mode remount has one fresh owner");
    await page.evaluate(() => window.cleanups.pop()());
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ wheel, trackpad, singleton: "passed", lock: "passed", cleanup: "passed", note: "Synthetic inputs, not physical-device validation" }, null, 2));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
