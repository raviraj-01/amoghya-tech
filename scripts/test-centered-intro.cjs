const { chromium } = require(process.argv[2] || 'playwright');
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    for (const width of [1440, 1024]) {
      const context = await browser.newContext({ viewport: { width, height: 900 } });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto('http://localhost:3000');
      await page.waitForSelector('canvas[data-frame^="0:"]', { state: 'attached' });
      await page.evaluate(() => {
        window.introSamples = [];
        const canvas = document.querySelector('.amo-experience canvas');
        const sample = () => {
          const matrix = new DOMMatrix(getComputedStyle(canvas.parentElement).transform);
          window.introSamples.push({ frame: canvas.dataset.frame, x: matrix.m41, y: matrix.m42 });
          if (!canvas.dataset.frame.startsWith('1:')) requestAnimationFrame(sample);
        };
        sample();
      });
      await page.waitForFunction(() => document.querySelector('canvas')?.dataset.frame === '1:0', null, { timeout: 60000 });
      await page.waitForTimeout(150);
      const samples = await page.evaluate(() => window.introSamples);
      assert.ok(new Set(samples.map(sample => sample.frame)).size > 20, 'intro actually plays');
      assert.ok(samples.every(sample => Math.abs(sample.x) < .01 && Math.abs(sample.y) < .01), 'intro and handoff stay centered');
      assert.equal(await page.evaluate(() => document.body.style.overflow), '');
      await page.screenshot({ path: `.chrome-cdp/centered-handoff-${width}.png` });
      const pixels = await page.locator('canvas').evaluate(canvas => {
        const values = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
        let dark = 0;
        for (let i = 0; i < values.length; i += 16) if (values[i] < 80) dark++;
        return dark;
      });
      assert.ok(pixels > 100, 'canvas has rendered character content');
      await page.evaluate(() => scrollTo({ top: 1400, behavior: 'instant' }));
      await page.waitForTimeout(1200);
      const moved = await page.locator('canvas').evaluate(canvas => {
        const matrix = new DOMMatrix(getComputedStyle(canvas.parentElement).transform);
        return { x: matrix.m41, y: matrix.m42, frame: canvas.dataset.frame };
      });
      assert.ok(moved.x < 0 && moved.y > 0, 'first scroll clip leaves center along a curve');
      assert.ok(moved.frame.startsWith('1:') && moved.frame !== '1:0');
      await page.screenshot({ path: `.chrome-cdp/centered-scroll-${width}.png` });
      // A normal/hard reload creates a new document and must replay, not resume.
      await page.reload();
      await page.waitForSelector('canvas[data-frame^="0:"]', { state: 'attached' });
      assert.equal(await page.evaluate(() => scrollY), 0, 'reload restarts at the top');
      assert.equal(await page.evaluate(() => document.body.style.overflow), 'hidden');
      assert.deepEqual(errors, []);
      await context.close();
    }
    console.log('PASS: animated intro remains centered, handoff stays at origin, canvas nonblank, scrolling follows first curve, no runtime errors.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
