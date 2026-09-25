const assert = require("node:assert/strict");
const sharp = require("sharp");
const manifest = require("../src/lib/cloudinary-manifest.json");
const sequences = require("../src/lib/frame-manifest.json");

(async () => {
  let count = 0;
  for (const { id, frames } of sequences) {
    for (const frame of frames) {
      const path = `/frames-webp/frame-${id}/ezgif-frame-${String(frame).padStart(3, "0")}.webp`;
      const url = new URL(manifest[path]);
      assert.equal(url.hostname, "res.cloudinary.com");
      assert.ok(url.pathname.startsWith("/dtgvkkgbk/image/upload/"));
      assert.equal(url.username + url.password, "");
      count++;
    }
    for (const frame of [frames[0], frames.at(-1)]) {
      const path = `/frames-webp/frame-${id}/ezgif-frame-${String(frame).padStart(3, "0")}.webp`;
      const response = await fetch(manifest[path], { headers: { Origin: "https://amoghya.tech" }, signal: AbortSignal.timeout(60000) });
      assert.equal(response.status, 200, path);
      assert.equal(response.headers.get("access-control-allow-origin"), "*", `${path}: canvas CORS`);
      const meta = await sharp(Buffer.from(await response.arrayBuffer())).metadata();
      assert.equal(meta.format, "webp");
      assert.equal(meta.width, 1120);
      assert.equal(meta.height, 630);
    }
    console.log(`frame-${id}: first/last delivery, WebP dimensions and CORS passed`);
  }
  console.log(`${count} frame mappings validated. Remote delivery sampled at both ends of every clip.`);
})().catch(error => { console.error(error.message); process.exitCode = 1; });
