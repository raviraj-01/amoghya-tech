const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const requests = [];
class FakeImage {
  set src(value) { this.url = value; if (value) requests.push(this); }
  get src() { return this.url; }
  decode() { return Promise.resolve(); }
}
const exportsObject = {};
const compiled = ts.transpileModule(fs.readFileSync('src/lib/frame-cache.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
vm.runInNewContext(compiled, { exports: exportsObject, Image: FakeImage, setTimeout, clearTimeout });
const { FrameCache } = exportsObject;
const flush = () => new Promise(resolve => setImmediate(resolve));
const url = n => `/frames-webp/frame-1/ezgif-frame-${String(n).padStart(3, '0')}.webp`;
(async () => {
  const cache = new FrameCache();
  try {
    cache.request(Array.from({ length: 40 }, (_, i) => url(i + 1)));
    assert.equal(requests.length, 4, 'downloads must be bounded');
    requests[0].onload();
    await flush();
    assert.ok(cache.get(url(1)), 'decoded frames are available');
    assert.equal(requests.length, 5, 'finishing one request starts only one more');
    cache.request([url(80), url(81)]);
    assert.equal(cache.get(url(1)), undefined, 'old decoded frames are released');
    requests[1].onload();
    await flush();
    assert.equal(requests.at(-1).src, url(80), 'a scroll jump replaces queued preloads');
    const fallback = requests.at(-1);
    fallback.onerror();
    assert.equal(fallback.src, '/frames/frame-1/ezgif-frame-080.png', 'WebP failures try the original PNG');
    fallback.onerror();
    assert.ok(cache.failed(url(80)), 'permanent failures are observable instead of waiting forever');
    cache.dispose();
    const count = requests.length;
    cache.request([url(90)]);
    await flush();
    assert.equal(requests.length, count, 'unmounted experiences start no more downloads');
    assert.equal(cache.get(url(81)), undefined);
    console.log('PASS: concurrency limit, frame eviction, scroll-jump priority, PNG fallback, failures and disposal.');
  } finally { cache.dispose(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
