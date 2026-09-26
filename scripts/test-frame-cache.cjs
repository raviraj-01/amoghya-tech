const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const pending = [], requests = [], aborts = [], decodes = [], objects = new Map();
let id = 0;
class FakeImage {
  naturalWidth = 1120;
  set src(value) { this.url = value; }
  decode() { return new Promise(resolve => decodes.push(resolve)); }
}
const exportsObject = {};
const compiled = ts.transpileModule(fs.readFileSync('src/lib/frame-cache.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
vm.runInNewContext(compiled, {
  exports: exportsObject, Image: FakeImage, setTimeout, clearTimeout, AbortController,
  URL: { createObjectURL(blob) { const key = 'blob:' + ++id; objects.set(key, blob); return key; }, revokeObjectURL(key) { objects.delete(key); } },
  fetch(source, options) {
    requests.push(source);
    return new Promise((resolve, reject) => {
      options.signal.addEventListener('abort', () => {
        aborts.push(source);
        reject(new Error('aborted'));
      });
      pending.push({ source, resolve: (ok = true, size = 17000) => resolve({ ok, status: ok ? 200 : 404, blob: async () => ({ size }) }) });
    });
  },
});
const { FrameCache } = exportsObject;
const flush = () => new Promise(resolve => setTimeout(resolve, 1));
const url = n => `/frames-webp/frame-1/ezgif-frame-${n}.webp`;
async function settle() {
  let idleTicks = 0;
  while (idleTicks < 3) {
    if (pending.length) {
      idleTicks = 0;
      pending.splice(0).forEach(p => p.resolve());
      await flush();
    }
    if (decodes.length) {
      idleTicks = 0;
      decodes.splice(0).forEach(resolve => resolve());
      await flush();
    }
    if (!pending.length && !decodes.length) {
      idleTicks += 1;
      await flush();
    }
  }
}
(async () => {
  const cache = new FrameCache();
  cache.request(Array.from({ length: 40 }, (_, i) => url(i)));
  assert.equal(requests.length, 4);
  pending.shift().resolve();
  await flush();
  assert.equal(cache.ready([url(0)]), false, 'downloaded is not decoded');
  decodes.shift()();
  await flush();
  assert.ok(cache.get(url(0)));
  cache.request([url(80), url(81)]);
  assert.equal(cache.stats().active, 4, 'scroll changes do not cancel active downloads');
  await settle();
  assert.ok(cache.ready([url(80), url(81)]), 'latest window wins queued priority');
  assert.ok(!requests.includes(url(6)), 'obsolete queued frames never download');
  for (let i = 100; i < 165; i++) { cache.request([url(i)]); await settle(); }
  assert.equal(cache.get(url(0)), undefined);
  assert.ok(cache.stats().decoded <= 48);
  const before = requests.length;
  cache.request([url(0)]);
  await settle();
  assert.equal(requests.length, before, 'decoded eviction reuses compressed bytes');
  assert.ok(cache.get(url(0)));
  assert.equal(cache.stats().peakActive, 4);
  cache.dispose();
  assert.equal(objects.size, 0, 'object URLs released on eviction/unmount');
  const mobileStart = requests.length;
  const mobile = new FrameCache(url => `https://cdn.example/mobile${url}`, {
    maxDecoded: 20, maxConcurrent: 2, cancelObsolete: true,
  });
  mobile.request(Array.from({ length: 25 }, (_, i) => url(2000 + i)));
  assert.equal(mobile.stats().active, 2, 'mobile limits active frame requests');
  const mobileInitialRequests = requests.slice(-2);
  const mobileAbortStart = aborts.length;
  mobile.request(Array.from({ length: 25 }, (_, i) => url(3000 + i)));
  assert.deepEqual(aborts.slice(mobileAbortStart), mobileInitialRequests,
    'the active requests from an obsolete mobile window are aborted');
  await flush();
  await settle();
  assert.ok(mobile.stats().decoded <= 20, 'mobile decoded cache stays bounded');
  assert.equal(mobile.stats().peakActive, 2, 'mobile request peak respects its limit');
  assert.ok(!requests.slice(mobileStart).some(source => /frame-200[2-9]/.test(source)),
    'obsolete mobile window is canceled before queued frames start');
  mobile.dispose();
  const remote = new FrameCache(() => 'https://cdn.example/broken.webp');
  remote.request([url(999)]);
  pending.shift().resolve(false); await flush();
  assert.equal(pending[0].source, url(999));
  pending.shift().resolve(false); await flush();
  assert.equal(pending[0].source, '/frames/frame-1/ezgif-frame-999.png');
  await settle();
  assert.ok(remote.get(url(999)));
  remote.dispose();
  const large = new FrameCache();
  for (let i = 200; i < 207; i++) {
    large.request([url(i)]);
    pending.shift().resolve(true, 10 * 1024 * 1024); await flush();
    decodes.shift()(); await flush();
  }
  assert.ok(large.stats().compressedBytes <= 48 * 1024 * 1024);
  large.request([url(300)]);
  large.dispose();
  await flush();
  const count = requests.length;
  large.request([url(301)]);
  assert.equal(requests.length, count);
  console.log('PASS: desktop and mobile concurrency, mobile window cancellation, decode readiness, latest-window priority, bounded caches, no repeat download after decoded eviction, local fallback, disposal.');
})().catch(error => { console.error(error); process.exitCode = 1; });
