const { chromium } = require(process.argv[2] || 'playwright');
const assert = require('node:assert/strict');
require('node:fs').mkdirSync('.chrome-cdp', { recursive: true });
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const base = process.argv[3] || 'http://localhost:3000';
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`${base}/services`);
    await page.waitForSelector('#service-rail[data-rail]');
    const categories = await page.locator('[data-service-row]').evaluateAll(rows => rows.map(row => ({
      title: row.querySelector('h3').textContent,
      href: row.querySelector('a[href]:not([href*="#"])').getAttribute('href'),
      subs: Array.from(row.querySelectorAll('li a')).map(a => ({ title: a.textContent, href: a.getAttribute('href') })),
    })));
    assert.equal(categories.length, 11);
    assert.equal(await page.locator('#service-rail a[href^="/contact"]').count(), 0);
    const { start, distance } = await page.locator('[data-service-index]').first().evaluate(button => {
      const stage = button.closest('nav').parentElement;
      return { start: stage.parentElement.getBoundingClientRect().top + scrollY - 72, distance: stage.parentElement.offsetHeight - stage.offsetHeight };
    });
    const scales = [];
    for (const position of [.5, .85, 1.15, 1.5]) {
      await page.evaluate(y => scrollTo({ top: y, behavior: 'instant' }), start + distance * position / 11);
      await page.waitForTimeout(650);
      scales.push(await page.locator('[data-service-row]').first().evaluate(row => new DOMMatrix(getComputedStyle(row).transform).a));
      await page.screenshot({ path: `.chrome-cdp/service-zoom-${position}.png` });
    }
    assert.ok(scales[2] > scales[0] + .04, 'scroll drives a visible zoom, not just a fade');
    assert.equal(await page.locator('#service-rail').getAttribute('data-active-service'), '2');
    await page.locator('[data-service-row]').nth(1).getByRole('link', { name: 'Explore service' }).click();
    await page.waitForURL('**/services/website-development');
    for (const category of categories) {
      const response = await page.goto(base + category.href);
      assert.equal(response.status(), 200);
      assert.equal(await page.locator('h1').textContent(), category.title);
      assert.equal(await page.locator('section[id]').count(), 4);
      assert.equal(await page.locator('[data-service-detail] a[href^="/contact?"]').count(), 1, 'contact occurs once at the end');
      assert.ok(await page.locator('[data-service-detail] a[href^="/contact?"]').evaluate(a => Array.from(document.querySelectorAll('section[id]')).every(s => Boolean(s.compareDocumentPosition(a) & Node.DOCUMENT_POSITION_FOLLOWING))));
      for (const sub of category.subs) {
        const id = sub.href.split('#')[1];
        assert.equal(await page.locator(`section[id="${id}"] h2`).textContent(), sub.title);
        assert.ok((await page.locator(`section[id="${id}"] p`).textContent()).length > 40);
        await page.locator('nav').getByRole('link', { name: sub.title, exact: true }).click();
        await page.waitForTimeout(400);
        assert.ok(page.url().endsWith(`#${id}`));
      }
    }
    await page.goto(base + categories[0].subs[2].href);
    await page.waitForTimeout(600);
    assert.ok(await page.locator('#visual-identity').evaluate(el => el.getBoundingClientRect().top >= 70 && el.getBoundingClientRect().top < 200));
    await page.screenshot({ path: '.chrome-cdp/service-detail-desktop.png' });
    await page.goto(base);
    await page.waitForSelector('body[data-vat-intro-playing]');
    await page.waitForFunction(() => !document.body.hasAttribute('data-vat-intro-playing'), null, { timeout: 45000 });
    await page.locator('#service-rail [data-service-index]').nth(1).click();
    await page.waitForTimeout(800);
    const returnY = await page.evaluate(() => scrollY);
    await page.locator('[data-service-row]').nth(1).getByRole('link', { name: 'Explore service' }).click();
    await page.waitForURL('**/services/website-development');
    await page.goBack();
    await page.waitForFunction(y => Math.abs(scrollY - y) < 2 && !document.body.hasAttribute('data-vat-intro-playing'), returnY);
    await page.waitForFunction(() => document.querySelector('#service-rail')?.dataset.activeService === '2');
    await page.waitForTimeout(700);
    assert.ok(Math.abs(await page.evaluate(() => scrollY) - returnY) < 2, 'return from a category preserves the homepage Services position');
    for (const width of [390, 320]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(base + categories[2].href);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      await page.screenshot({ path: `.chrome-cdp/service-detail-${width}.png` });
    }
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(`${base}/services`);
    assert.equal(await page.locator('#service-rail[data-rail]').count(), 0);
    assert.equal(await page.locator('[data-service-row] li a').count(), 44);
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ categories: 11, subSections: 44, zoomScales: scales, links: 'passed', homeReturn: 'passed', contactLast: 'passed', mobile: 'passed', reducedMotion: 'passed', errors }));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
