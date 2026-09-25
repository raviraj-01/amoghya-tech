const { chromium } = require(process.argv[2] || 'playwright');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto('http://localhost:3000/#pricing');
    await page.waitForFunction(() => !document.querySelector('.amo-experience'));
    await page.evaluate(() => document.fonts.ready);
    assert.match(await page.locator('#pricing h2').evaluate(el => getComputedStyle(el).fontFamily), /Cinzel/i);
    assert.match(await page.locator('#pricing p').first().evaluate(el => getComputedStyle(el).fontFamily), /Cormorant/i);
    assert.equal(await page.locator('a[href="/package-builder"]').count(), 0);
    assert.equal(await page.locator('[data-service-index]').first().innerText(), '');
    assert.equal(await page.locator('#pricing article').count(), 0);
    for (const width of [1440, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      await page.locator('#pricing').scrollIntoViewIfNeeded();
      await page.waitForTimeout(700);
      await page.locator('#pricing').evaluate(el => scrollTo({ top: el.getBoundingClientRect().top + scrollY - 84, behavior: 'instant' }));
      await page.waitForTimeout(700);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `overflow ${width}`);
      await page.screenshot({ path: `.chrome-cdp/outcomes-new-${width}.png` });
    }
    await page.goto('http://localhost:3000/contact');
    assert.ok(!/estimated budget/i.test(await page.locator('main').innerText()));
    await page.goto('http://localhost:3000/package-builder');
    assert.ok(page.url().endsWith('/contact'));
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('http://localhost:3000');
    assert.equal(await page.locator('canvas').first().locator('..').locator('img').count(), 0, 'no differently sized intro poster');
    await page.waitForSelector('canvas[data-frame^="0:"]', { state: 'attached', timeout: 60000 });
    await page.reload();
    assert.equal(await page.locator('canvas').first().locator('..').locator('img').count(), 0);
    await page.waitForSelector('canvas[data-frame^="0:"]', { state: 'attached', timeout: 60000 });
    assert.deepEqual(errors, []);
    console.log('PASS: fonts, responsive outcomes, unnumbered services, builder redirect, budget removed, intro poster removed and reload plays.');
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
