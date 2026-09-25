const { chromium } = require(process.argv[2] || 'playwright');
const assert = require('node:assert/strict');
require('node:fs').mkdirSync('.chrome-cdp', { recursive: true });
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const base = process.argv[3] || 'http://localhost:3000';
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(base);
    await page.waitForSelector('body[data-vat-intro-playing]');
    await page.waitForFunction(() => !document.body.hasAttribute('data-vat-intro-playing'), null, { timeout: 45000 });
    const hrefs = await page.locator('#pricing a, #landing-contact a').evaluateAll(links => [...new Set(links.map(a => a.getAttribute('href')).filter(h => h.startsWith('/')))]);
    for (const href of hrefs) assert.equal((await page.request.get(base + href)).status(), 200, href);
    for (const width of [1440, 1024, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      await page.waitForTimeout(700);
      for (const id of ['pricing', 'landing-contact']) {
        await page.locator(`#${id}`).evaluate(el => scrollTo({ top: el.getBoundingClientRect().top + scrollY - 84, behavior: 'instant' }));
        await page.waitForTimeout(850);
        assert.ok(await page.locator(`#${id} h2`).isVisible());
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `no overflow at ${width}`);
        const badText = await page.locator(`#${id} a, #${id} h2, #${id} h3`).evaluateAll(nodes => nodes.filter(el => el.scrollWidth > el.clientWidth + 2).map(el => el.textContent));
        assert.deepEqual(badText, [], `text fits at ${width}`);
        await page.screenshot({ path: `.chrome-cdp/${id}-${width}.png` });
      }
      assert.equal(await page.locator('#landing-contact').evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(0, 0, 0)');
      assert.equal(await page.locator('#landing-contact a[href^="mailto:"]').getAttribute('href'), 'mailto:hello@amoghya.tech');
      assert.equal(await page.locator('footer a[href^="mailto:"]').count(), 1);
      assert.ok(!(await page.locator('#pricing').textContent()).match(/₹|free with every|founding-client/i), 'expired commercial claims removed');
    }
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload();
    await page.waitForFunction(() => !document.querySelector('.amo-experience'));
    await page.locator('#landing-contact').scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    assert.ok(await page.locator('#landing-contact a[href^="mailto:"]').isVisible());
    assert.deepEqual(errors, []);
    console.log('PASS: desktop/tablet/mobile layouts, direct email, footer continuity, linked routes, reduced motion, no console errors.');
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
