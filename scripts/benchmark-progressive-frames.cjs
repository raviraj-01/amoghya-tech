const { chromium } = require(process.argv[2] || 'playwright');
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const label = process.argv[3] || 'current';
const port = 3017;
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-p', String(port)], { windowsHide: true, stdio: 'ignore' });
let browser;
(async () => {
  for (let i = 0; i < 60; i++) {
    try { if ((await fetch(`http://localhost:${port}`)).ok) break; } catch {}
    await new Promise(r => setTimeout(r, 500));
  }
  browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 200000, uploadThroughput: 100000 });
  const results = [];
  for (const cached of [false, true]) {
    const requests = new Map();
    const onRequest = event => {
      if (/ezgif-frame-/.test(event.request.url)) requests.set(event.requestId, { url: event.request.url, bytes: 0 });
    };
    const onResponse = event => { const item = requests.get(event.requestId); if (item) Object.assign(item, { status: event.response.status, type: event.response.mimeType, fromCache: !!(event.response.fromDiskCache || event.response.fromPrefetchCache) }); };
    const onFinish = event => { const item = requests.get(event.requestId); if (item) item.bytes = event.encodedDataLength; };
    const onFail = event => { const item = requests.get(event.requestId); if (item) item.failed = event.errorText; };
    cdp.on('Network.requestWillBeSent', onRequest); cdp.on('Network.responseReceived', onResponse); cdp.on('Network.loadingFinished', onFinish); cdp.on('Network.loadingFailed', onFail);
    await cdp.send('Network.setCacheDisabled', { cacheDisabled: !cached });
    const start = Date.now();
    if (cached) await page.reload({ waitUntil: 'domcontentloaded' });
    else await page.goto(`http://localhost:${port}`, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => document.querySelector('.amo-experience')?.getAttribute('data-scroll-ready') === 'true', null, { timeout: 120000 });
    const readyMs = Date.now() - start;
    const metrics = await page.evaluate(async () => {
      const c = document.querySelector('canvas');
      let previous = c.dataset.frame, lastChange = performance.now(), longestHold = 0, lastTime = performance.now();
      const poses = new Set(), gaps = [];
      const start = performance.now();
      await new Promise(resolve => {
        const tick = time => {
          const elapsed = time - start;
          window.scrollTo(0, Math.min(1200, elapsed * .1));
          gaps.push(time - lastTime); lastTime = time;
          const frame = c.dataset.frame;
          if (frame !== previous) { longestHold = Math.max(longestHold, time - lastChange); lastChange = time; previous = frame; }
          poses.add(frame);
          if (elapsed < 12000) requestAnimationFrame(tick); else resolve();
        };
        requestAnimationFrame(tick);
      });
      longestHold = Math.max(longestHold, performance.now() - lastChange);
      gaps.sort((a, b) => a - b);
      return { poses: poses.size, longestHoldMs: Math.round(longestHold), rafP95Ms: Math.round(gaps[Math.floor(gaps.length * .95)]), lastFrame: c.dataset.frame, stats: window.__vatFrameCache?.stats() };
    });
    const beforeReverse = requests.size;
    await page.evaluate(() => scrollTo(0, 100));
    await page.waitForTimeout(2500);
    const rows = [...requests.values()];
    const result = { cached, readyMs, ...metrics, requests: rows.length, reverseRequests: requests.size - beforeReverse, transferredBytes: rows.reduce((n, r) => n + r.bytes, 0), canceled: rows.filter(r => r.failed).length, originalPngResponses: rows.filter(r => r.type === 'image/png').length, badResponses: rows.filter(r => r.status >= 400).length, fromCache: rows.filter(r => r.fromCache).length };
    results.push(result);
    console.log(JSON.stringify(result));
    fs.mkdirSync('.chrome-cdp', { recursive: true });
    await page.screenshot({ path: `.chrome-cdp/frames-${label}-${cached ? 'warm' : 'cold'}.png` });
    cdp.off('Network.requestWillBeSent', onRequest); cdp.off('Network.responseReceived', onResponse); cdp.off('Network.loadingFinished', onFinish); cdp.off('Network.loadingFailed', onFail);
  }
  fs.writeFileSync(`.chrome-cdp/frames-${label}.json`, JSON.stringify({ results, errors }, null, 2));
  assert.deepEqual(errors, []);
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(async () => {
  if (browser) await browser.close();
  server.kill();
});
