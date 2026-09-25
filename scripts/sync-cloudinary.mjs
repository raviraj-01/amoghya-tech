import nextEnv from "@next/env";
import { readFile, writeFile } from "node:fs/promises";

nextEnv.loadEnvConfig(process.cwd());
const { CLOUDINARY_CLOUD_NAME: cloud, CLOUDINARY_API_KEY: key, CLOUDINARY_API_SECRET: secret } = process.env;
if (!cloud || !key || !secret) throw new Error("Missing server-only Cloudinary credentials in .env.local");
const authorization = `Basic ${Buffer.from(`${key}:${secret}`).toString("base64")}`;
const sequences = JSON.parse(await readFile("src/lib/frame-manifest.json", "utf8"));
const manifest = {};

async function listFolder(folder) {
  const assets = [];
  let cursor;
  do {
    const url = new URL(`https://api.cloudinary.com/v1_1/${encodeURIComponent(cloud)}/resources/by_asset_folder`);
    url.searchParams.set("asset_folder", folder);
    url.searchParams.set("max_results", "500");
    if (cursor) url.searchParams.set("next_cursor", cursor);
    const response = await fetch(url, { headers: { Authorization: authorization }, signal: AbortSignal.timeout(30000) });
    if (response.status === 404) return [];
    if (!response.ok) throw new Error(`Cloudinary metadata HTTP ${response.status} for ${folder}`);
    const data = await response.json();
    assets.push(...data.resources);
    cursor = data.next_cursor;
  } while (cursor);
  return assets;
}

function imageUrl(asset, width) {
  if (asset.resource_type !== "image" || asset.type !== "upload") throw new Error(`Unsupported asset: ${asset.public_id}`);
  const url = new URL(asset.secure_url);
  if (url.hostname !== "res.cloudinary.com" || !url.pathname.startsWith(`/${cloud}/image/upload/`)) throw new Error("Unexpected delivery host/path");
  // Fixed WebP output keeps canvas decoding predictable; never upscale originals.
  if (asset.format !== "webp" || asset.width > width) {
    url.pathname = url.pathname.replace("/image/upload/", `/image/upload/c_limit,w_${width},q_80,f_webp/`);
  }
  return url.href;
}

for (const sequence of sequences) {
  const folder = `amoghya-tech/frames-webp/frame-${sequence.id}`;
  const assets = await listFolder(folder);
  const byNumber = new Map();
  for (const asset of assets) {
    const name = asset.public_id.split("/").pop();
    const match = /^ezgif-frame-(\d+)(?:_[a-zA-Z0-9-]+)?$/.exec(name);
    if (!match) continue;
    const number = Number(match[1]);
    const existing = byNumber.get(number);
    if (existing) {
      if (existing.format === asset.format) throw new Error(`Ambiguous frame ${number} in ${folder}; manifest not written`);
      if (existing.format === "webp") continue;
      if (asset.format !== "webp") throw new Error(`Ambiguous formats for frame ${number} in ${folder}`);
    }
    byNumber.set(number, asset);
  }
  if (sequence.frames.some(number => !byNumber.has(number))) {
    for (const asset of await listFolder(`amoghya-tech/frames/frame-${sequence.id}`)) {
      const match = /^ezgif-frame-(\d+)(?:_[a-zA-Z0-9-]+)?$/.exec(asset.public_id.split("/").pop());
      if (match && !byNumber.has(Number(match[1]))) byNumber.set(Number(match[1]), asset);
    }
  }
  for (const number of sequence.frames) {
    const asset = byNumber.get(number);
    if (!asset) throw new Error(`Missing frame ${number} in ${folder}; existing manifest preserved`);
    if (Math.abs(asset.width / asset.height - 16 / 9) > .01) throw new Error(`Unexpected aspect ratio: ${folder}/${number}`);
    manifest[`/frames-webp/frame-${sequence.id}/ezgif-frame-${String(number).padStart(3, "0")}.webp`] = imageUrl(asset, 1120);
  }
  console.log(`frame-${sequence.id}: ${sequence.frames.length} mapped (${assets[0]?.format || "unknown"} source)`);
}

for (const asset of await listFolder("amoghya-tech/image")) {
  const match = /^(AMO-\d+)(?:_[a-zA-Z0-9-]+)?$/.exec(asset.public_id.split("/").pop());
  if (!match) continue;
  const local = `/image/${match[1]}.png`;
  if (manifest[local]) throw new Error(`Ambiguous image ${local}`);
  manifest[local] = imageUrl(asset, 1086);
}

await writeFile("src/lib/cloudinary-manifest.json", JSON.stringify(manifest, null, 2) + "\n");
console.log(`Saved ${Object.keys(manifest).length} public URLs. No credentials included; no assets modified.`);
