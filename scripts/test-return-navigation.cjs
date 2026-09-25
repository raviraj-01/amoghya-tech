const { chromium } = require(process.argv[2] || 'playwright');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    const base = 'http://localhost:3000';
    const verify = async (y, label) => {
      await page.waitForFunction(y => Math.abs(scrollY - y) < 3 && !document.body.hasAttribute('data-vat-intro-playing'), y, { timeout: 15000 }).catch(async error => {
        console.log({ label, expected: y, actual: await page.evaluate(() => ({ url: location.href, y: scrollY, height: document.documentElement.scrollHeight, body: document.body.outerHTML.slice(0,200), home: document.querySelector('.amo-experience')?.outerHTML.slice(0,200), stored: Object.fromEntries(Object.keys(sessionStorage).map(k => [k, sessionStorage.getItem(k)])) })) });
        throw error;
      });
      await page.waitForTimeout(1000);
      assert.ok(Math.abs(await page.evaluate(() => scrollY) - y) < 3, label);
      console.log('PASS:', label);
    };
    const trip = async (link, destination, label, reload = false) => {
      await link.scrollIntoViewIfNeeded();
      await page.waitForTimeout(800);
      const y = await page.evaluate(() => scrollY);
      await link.click();
      await page.waitForURL(destination);
      if (reload) { await page.reload(); await page.waitForTimeout(1000); }
      await page.goBack();
      await verify(y, label);
    };
    await page.goto(base);
    await page.waitForSelector('body[data-vat-intro-playing]');
    await page.waitForFunction(() => !document.body.hasAttribute('data-vat-intro-playing'), null, { timeout: 45000 });
    await page.evaluate(() => scrollTo({ top: 1960, behavior: 'instant' }));
    await page.waitForTimeout(1000);
    await trip(page.getByRole('link', { name: 'Explore services', exact: true }), '**/services', 'hero service Back');
    await trip(page.locator('#pricing article a').first(), '**/package-builder', 'package Back');
    await trip(page.locator('#pricing article a').nth(2), '**/package-builder', 'package full-document Back', true);
    const homeY = await page.evaluate(() => scrollY);
    await page.locator('#pricing article a').first().click();
    await page.waitForURL('**/package-builder');
    await page.getByRole('link', { name: 'Home', exact: true }).click();
    await verify(homeY, 'Home navigation from package');
    await page.goto(base + '/services');
    await page.waitForSelector('#service-rail[data-rail]');
    await page.locator('[data-service-index]').nth(5).click();
    await page.waitForTimeout(800);
    await trip(page.locator('[data-service-row]').nth(5).getByRole('link', { name: 'Explore service', exact: true }), '**/services/digital-marketing', 'Services panel Back', true);
    assert.equal(await page.locator('#service-rail').getAttribute('data-active-service'), '6');
    await page.goto(base + '/#pricing');
    await page.waitForFunction(() => !document.querySelector('.amo-experience'));
    await trip(page.locator('#pricing article a').first(), '**/package-builder', 'hash/static homepage Back');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(base);
    await page.waitForFunction(() => !document.querySelector('.amo-experience'));
    await trip(page.locator('#pricing article a').nth(1), '**/package-builder', 'mobile package Back', true);
    assert.deepEqual(errors, []);
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
