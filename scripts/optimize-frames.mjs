import { readdir, mkdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const sourceRoot = path.resolve("public/frames");
const outputRoot = path.resolve("public/frames-webp");
const jobs = [];
for (const folder of await readdir(sourceRoot, { withFileTypes: true })) {
  if (!folder.isDirectory()) continue;
  await mkdir(path.join(outputRoot, folder.name), { recursive: true });
  for (const file of await readdir(path.join(sourceRoot, folder.name))) {
    if (!file.endsWith(".png")) continue;
    jobs.push({
      source: path.join(sourceRoot, folder.name, file),
      output: path.join(outputRoot, folder.name, file.replace(/\.png$/, ".webp")),
    });
  }
}

let sourceBytes = 0;
let outputBytes = 0;
let converted = 0;
sharp.concurrency(1);
await Promise.all(Array.from({ length: 4 }, async () => {
  while (jobs.length) {
    const { source, output } = jobs.pop();
    const input = await stat(source);
    const existing = await stat(output).catch(() => null);
    if (!existing || existing.mtimeMs < input.mtimeMs) {
      await sharp(source).resize({ width: 1120, withoutEnlargement: true }).webp({ quality: 80, effort: 4 }).toFile(output);
      converted++;
    }
    sourceBytes += input.size;
    const result = await stat(output);
    outputBytes += result.size;
  }
}));
console.log(`Frames: ${converted} converted; ${(sourceBytes / 1048576).toFixed(1)} MB PNG -> ${(outputBytes / 1048576).toFixed(1)} MB WebP. Originals preserved.`);
