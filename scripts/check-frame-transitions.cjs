const { chromium } = require(process.argv[2] || 'playwright');
const { spawn } = require('node:child_process');
const assert = require('node:assert/strict');
const manifest = require('../src/lib/frame-manifest.json');
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-p', '3017'], { windowsHide: true, stdio: 'ignore' });
let browser;
(async () => {
  let ready = false;
  for (let i = 0; i < 60; i++) {
    try { ready = (await fetch('http://localhost:3017')).ok; } catch {}
    if (ready) break;
    await new Promise(r => setTimeout(r, 500));
  }
  assert.ok(ready, 'production server starts');
  browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Network.enable');
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 200000, uploadThroughput: 100000 });
  await page.goto('http://localhost:3017');
  await page.waitForFunction(() => document.querySelector('.amo-experience')?.dataset.scrollReady === 'true', null, { timeout: 120000 });
  let offset = 0;
  const results = [];
  for (const clip of manifest.slice(1)) {
    const y = (offset + Math.floor(clip.frames.length * .55)) * 16;
    const start = Date.now();
    await page.evaluate(y => scrollTo(0, y), y);
    await page.waitForFunction(id => document.querySelector('canvas')?.dataset.frame?.startsWith(id + ':'), clip.id, { timeout: 20000 });
    await page.waitForTimeout(1000);
    const pixels = await page.evaluate(() => {
      const c = document.querySelector('canvas');
      const data = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
      let dark = 0;
      for (let i = 0; i < data.length; i += 64) if (data[i] < 80 && data[i + 3] > 0) dark++;
      return { dark, frame: c.dataset.frame };
    });
    assert.ok(pixels.dark > 50, 'character canvas is nonblank');
    results.push({ clip: clip.id, jumpReadyMs: Date.now() - start, ...pixels });
    offset += clip.frames.length;
  }
  await page.screenshot({ path: '.chrome-cdp/frames-transition-final.png' });
  assert.deepEqual(errors, []);
  console.log(JSON.stringify(results));
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(async () => {
  if (browser) await browser.close();
  server.kill();
});
