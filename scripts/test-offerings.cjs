const { chromium } = require(process.argv[2] || 'playwright');
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const route of ['work', 'studio', 'about']) {
      assert.equal((await page.goto(`http://localhost:3000/${route}`)).status(), 200);
      assert.equal(await page.locator('main article').count(), route === 'about' ? 4 : 6);
      const links = await page.locator('main a[href^="/"]').evaluateAll(nodes => [...new Set(nodes.map(node => node.getAttribute('href')))]);
      for (const link of links) assert.equal((await page.request.get(`http://localhost:3000${link}`)).status(), 200, link);
      for (const width of [1440, 768, 390, 320]) {
        await page.setViewportSize({ width, height: 900 });
        await page.waitForTimeout(200);
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${route}: overflow at ${width}`);
        const overflow = await page.locator('main h1, main h2, main h3, main a, main li').evaluateAll(nodes => nodes.filter(node => node.scrollWidth > node.clientWidth + 2).map(node => node.textContent));
        assert.deepEqual(overflow, [], `${route}: text overflow at ${width}`);
        await page.screenshot({ path: `.chrome-cdp/${route}-${width}.png`, fullPage: true });
      }
      if (route === 'studio' || route === 'about') {
        await page.locator('main img').scrollIntoViewIfNeeded();
        await page.waitForFunction(() => [...document.querySelectorAll('main img')].every(img => img.complete && img.naturalWidth > 0));
        assert.equal(await page.locator('main a[href^="mailto:"]').count(), 1);
      }
      assert.ok(!/PRD|Phase 4|state-of-the-art|broadcast-grade|4K commercial/i.test(await page.locator('main').innerText()));
    }
    assert.deepEqual(errors, []);
    console.log('PASS: Work, Studio and About, linked routes, 1440/768/390/320 layouts, images, email, no runtime errors.');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
