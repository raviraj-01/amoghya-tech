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

const home = fs.readFileSync('src/components/home/HomeExperience.tsx', 'utf8');
const motionSource = home.slice(home.indexOf('function bezierPoint'), home.indexOf('export function HomeExperience'));
for (const [innerWidth, innerHeight] of [[1440, 900], [1024, 768], [1920, 1080]]) {
  const context = vm.createContext({ window: { innerWidth, innerHeight } });
  vm.runInContext(ts.transpileModule(motionSource, {}).outputText, context);
  const point = (section, progress) => context.getMotionPoint(section, progress);
  for (const t of [0, .25, .5, .75, 1]) {
    assert.equal(point(0, t).x, 0, 'intro never translates horizontally');
    assert.equal(point(0, t).y, 0, 'intro never translates vertically');
  }
  assert.equal(point(1, 0).x, 0, 'handoff starts at centered intro origin');
  assert.equal(point(1, 0).y, 0);
  assert.ok(point(1, .5).y > 0, 'first scroll clip still follows a curve');
  for (let section = 1; section < 7; section++) {
    assert.equal(point(section, 1).x, point(section + 1, 0).x, 'later resting positions are unchanged');
    assert.equal(point(section, 1).y, point(section + 1, 0).y);
  }
}
console.log('PASS: stationary centered intro, continuous first scroll origin and later Bezier paths.');
