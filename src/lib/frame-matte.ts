const normalizedFrames = new WeakMap<HTMLImageElement, HTMLCanvasElement>();

/** Match the first clip's neutral studio backdrop without keying out white AMO parts. */
export function normalizeFrameMatte(image: HTMLImageElement) {
  const cached = normalizedFrames.get(image);
  if (cached) return cached;
  const canvas = document.createElement("canvas");
  canvas.width = Math.min(image.naturalWidth, 1120);
  canvas.height = Math.round(image.naturalHeight * canvas.width / image.naturalWidth);
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return image;
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = frame.data;
  const columns = [.12, .2, .8, .88].map(x => Math.floor(x * canvas.width));
  const target = [237, 237, 235];

  for (let y = 0; y < canvas.height; y++) {
    const row = y * canvas.width * 4;
    const background = [0, 0, 0];
    for (const column of columns) {
      for (let channel = 0; channel < 3; channel++) background[channel] += pixels[row + column * 4 + channel] / columns.length;
    }
    for (let x = 0; x < canvas.width; x++) {
      const offset = row + x * 4;
      const difference = Math.max(
        Math.abs(pixels[offset] - background[0]),
        Math.abs(pixels[offset + 1] - background[1]),
        Math.abs(pixels[offset + 2] - background[2]),
      );
      if (difference >= 36) continue;
      // Only backdrop-like tones change. Dark clothing, visor, bright helmet
      // highlights and saturated lime accents remain outside this colour band.
      const t = Math.min(1, Math.max(0, (36 - difference) / 24));
      const weight = t * t * (3 - 2 * t);
      pixels[offset] += (target[0] - pixels[offset]) * weight;
      pixels[offset + 1] += (target[1] - pixels[offset + 1]) * weight;
      pixels[offset + 2] += (target[2] - pixels[offset + 2]) * weight;
    }
  }
  ctx.putImageData(frame, 0, 0);
  normalizedFrames.set(image, canvas);
  return canvas;
}
