const { chromium } = require(process.argv[2] || 'playwright');
const assert = require('node:assert/strict');
require('node:fs').mkdirSync('.chrome-cdp', { recursive: true });
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(process.argv[3] || 'http://localhost:3000');
    await page.waitForSelector('body[data-vat-intro-playing]');
    await page.waitForFunction(() => !document.body.hasAttribute('data-vat-intro-playing'), null, { timeout: 45000 });
    assert.equal(await page.locator('#service-rail h3').count(), 11);
    const bounds = () => page.locator('#service-rail [data-service-index]').first().evaluate(button => {
      const stage = button.closest('nav').parentElement;
      const spacer = stage.parentElement;
      return { start: spacer.getBoundingClientRect().top + scrollY - 72, distance: spacer.offsetHeight - stage.offsetHeight };
    });
    for (const { width, height } of [{ width: 1440, height: 900 }, { width: 1024, height: 900 }, { width: 768, height: 900 }, { width: 768, height: 600 }]) {
      await page.setViewportSize({ width, height });
      await page.waitForTimeout(700);
      const { start, distance } = await bounds();
      assert.equal(await page.locator('#service-rail .pin-spacer').count(), 1, 'only one Services pin exists');
      assert.ok(start > 12600, 'Services starts after the hero pin');
      assert.ok(distance > 3000 && distance < 6500, 'pin duration is bounded');
      for (let i = 0; i < 11; i++) {
        await page.evaluate(y => scrollTo({ top: y, behavior: 'instant' }), start + distance * (i + .5) / 11);
        await page.waitForTimeout(600);
        assert.equal(await page.locator('#service-rail').getAttribute('data-active-service'), String(i + 1));
        const overlap = await page.locator('#service-rail [data-service-row]').nth(i).evaluate(row => {
          const title = row.querySelector('h3').getBoundingClientRect();
          const details = row.querySelector('[data-details]').getBoundingClientRect();
          const stage = row.parentElement.getBoundingClientRect();
          return title.right > details.left + 1 || details.bottom > stage.bottom + 1 || title.left < stage.left - 1;
        });
        if ([0, 4, 10].includes(i)) await page.screenshot({ path: `.chrome-cdp/services-${width}-${height}-${i}.png` });
        assert.equal(overlap, false, `service ${i+1} fits at ${width}px`);
      }
      await page.locator('#service-rail [data-service-index]').nth(3).click();
      await page.waitForTimeout(700);
      assert.equal(await page.locator('#service-rail').getAttribute('data-active-service'), '4');
      await page.evaluate(y => scrollTo({ top: y, behavior: 'instant' }), start + distance + 950);
      await page.waitForTimeout(600);
      assert.ok(await page.locator('#pricing').evaluate(el => el.getBoundingClientRect().top < innerHeight), 'pin releases into pricing');
    }
    for (const width of [390, 320]) {
      await page.setViewportSize({ width, height: 844 });
      await page.waitForTimeout(800);
      assert.equal(await page.locator('#service-rail').getAttribute('data-rail'), null);
      for (const i of [0, 5, 10]) {
        await page.locator('#service-rail h3').nth(i).scrollIntoViewIfNeeded();
        await page.waitForTimeout(450);
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        await page.screenshot({ path: `.chrome-cdp/services-mobile-${width}-${i}.png` });
      }
    }
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForTimeout(800);
    assert.equal(await page.locator('#service-rail').getAttribute('data-rail'), null);
    assert.equal(await page.locator('#service-rail [data-service-row][aria-hidden="true"]').count(), 0, 'all reduced-motion services remain accessible');
    assert.deepEqual(errors, []);
    console.log('PASS: 11 services, desktop/tablet pinning, index navigation, release, mobile overflow, reduced motion, no browser errors.');
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
