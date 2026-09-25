type Entry = { image: HTMLImageElement; objectUrl: string };
const MAX_DECODED = 48;
const MAX_BYTES = 48 * 1024 * 1024;
const blobs = new Map<string, Blob>();
let blobBytes = 0;

function remember(url: string, blob: Blob) {
  blobBytes -= blobs.get(url)?.size ?? 0;
  blobs.delete(url);
  blobs.set(url, blob);
  blobBytes += blob.size;
  while (blobBytes > MAX_BYTES && blobs.size) {
    const oldest = blobs.keys().next().value!;
    blobBytes -= blobs.get(oldest)!.size;
    blobs.delete(oldest);
  }
}

/** Compressed history survives route changes; only a small window stays decoded. */
export class FrameCache {
  constructor(private resolveUrl: (url: string) => string = url => url) {}
  private entries = new Map<string, Entry>();
  private wanted = new Set<string>();
  private loading = new Map<string, AbortController>();
  private errors = new Set<string>();
  private listeners = new Set<() => void>();
  private disposed = false;
  private networkRequests = 0;
  private blobHits = 0;
  private peakActive = 0;

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  }
  request(urls: string[]) {
    if (this.disposed) return;
    this.wanted = new Set(urls.slice(0, MAX_DECODED));
    this.pump();
  }
  ready(urls: string[]) { return urls.every(url => this.entries.has(url)); }
  failed(url: string) { return this.errors.has(url); }
  get(url: string) {
    const entry = this.entries.get(url);
    if (entry) {
      this.entries.delete(url);
      this.entries.set(url, entry);
    }
    return entry?.image;
  }
  stats() {
    return { active: this.loading.size, peakActive: this.peakActive, decoded: this.entries.size,
      compressedBytes: blobBytes, compressedFrames: blobs.size, networkRequests: this.networkRequests, blobHits: this.blobHits };
  }
  private release(entry: Entry) {
    entry.image.src = "";
    URL.revokeObjectURL(entry.objectUrl);
  }
  dispose() {
    this.disposed = true;
    this.loading.forEach(controller => controller.abort());
    this.entries.forEach(entry => this.release(entry));
    this.entries.clear();
    this.wanted.clear();
    this.listeners.clear();
  }
  private pump() {
    if (this.disposed) return;
    for (const url of Array.from(this.wanted)) {
      if (this.loading.size >= 4) break;
      if (this.entries.has(url) || this.loading.has(url) || this.errors.has(url)) continue;
      const controller = new AbortController();
      this.loading.set(url, controller);
      this.peakActive = Math.max(this.peakActive, this.loading.size);
      void this.load(url, controller).finally(() => {
        this.loading.delete(url);
        if (this.disposed) return;
        this.pump();
        this.listeners.forEach(listener => listener());
      });
    }
  }
  private async load(url: string, controller: AbortController) {
    const sources = Array.from(new Set([this.resolveUrl(url), url,
      url.replace("/frames-webp/", "/frames/").replace(/\.webp$/, ".png")]));
    for (const source of sources) {
      if (this.disposed) return;
      let objectUrl: string | undefined;
      const attempt = new AbortController();
      const abort = () => attempt.abort();
      controller.signal.addEventListener("abort", abort, { once: true });
      const timeout = setTimeout(abort, 15000);
      try {
        let blob = blobs.get(source);
        if (blob) { this.blobHits++; remember(source, blob); }
        else {
          this.networkRequests++;
          const response = await fetch(source, { signal: attempt.signal, mode: "cors", credentials: "omit" });
          if (!response.ok) throw new Error(`Frame HTTP ${response.status}`);
          blob = await response.blob();
        }
        objectUrl = URL.createObjectURL(blob);
        const image = new Image();
        image.decoding = "async";
        image.src = objectUrl;
        await image.decode();
        if (!image.naturalWidth || this.disposed) throw new Error("Frame unavailable");
        remember(source, blob);
        this.entries.set(url, { image, objectUrl });
        while (this.entries.size > MAX_DECODED) {
          const key = Array.from(this.entries.keys()).find(key => !this.wanted.has(key)) ?? this.entries.keys().next().value!;
          this.release(this.entries.get(key)!);
          this.entries.delete(key);
        }
        return;
      } catch {
        if (objectUrl) URL.revokeObjectURL(objectUrl);
        if (!this.disposed) {
          const cached = blobs.get(source);
          if (cached) { blobBytes -= cached.size; blobs.delete(source); }
        }
      } finally {
        clearTimeout(timeout);
        controller.signal.removeEventListener("abort", abort);
      }
    }
    if (!this.disposed) this.errors.add(url);
  }
}
