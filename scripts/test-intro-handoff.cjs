const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const exportsObject = {};
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/lib/intro-handoff.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText, { exports: exportsObject });
const { INTRO_ANCHORS, introHandoffTransform } = exportsObject;
const start = introHandoffTransform(0);
INTRO_ANCHORS.incoming.forEach((point, index) => {
  const target = INTRO_ANCHORS.outgoing[index];
  assert.ok(Math.abs(start.a * point.x - start.b * point.y + start.tx - target.x) < 1e-9);
  assert.ok(Math.abs(start.b * point.x + start.a * point.y + start.ty - target.y) < 1e-9);
});
for (const progress of [.45, .5, 1]) {
  const transform = introHandoffTransform(progress);
  assert.equal(transform.a, 1);
  assert.equal(Math.abs(transform.b), 0);
  assert.equal(Math.abs(transform.tx), 0);
  assert.equal(Math.abs(transform.ty), 0);
}
const end = introHandoffTransform(.45 - 1e-5);
assert.ok(Math.abs(end.a - 1) < 1e-8, 'size settles continuously before content enters');
console.log('PASS: helmet/feet align exactly, normal placement restored, continuous settling.');
