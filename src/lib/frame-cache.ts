type Entry = { image: HTMLImageElement; state: "loading" | "ready" | "error" };

/** A moving frame window: four downloads at a time, with obsolete images released. */
export class FrameCache {
  private entries = new Map<string, Entry>();
  private wanted = new Set<string>();
  private queue: string[] = [];
  private active = 0;
  private disposed = false;
  private cancel = new Set<() => void>();

  request(urls: string[]) {
    if (this.disposed) return;
    this.wanted = new Set(urls.slice(0, 64));
    this.entries.forEach((entry, url) => {
      if (!this.wanted.has(url) && entry.state !== "loading") this.entries.delete(url);
    });
    this.queue = Array.from(this.wanted).filter(url => !this.entries.has(url));
    this.pump();
  }

  get(url: string) {
    const entry = this.entries.get(url);
    return entry?.state === "ready" ? entry.image : undefined;
  }

  failed(url: string) {
    return this.entries.get(url)?.state === "error";
  }

  dispose() {
    this.disposed = true;
    this.cancel.forEach(cancel => cancel());
    this.cancel.clear();
    this.entries.clear();
    this.queue = [];
  }

  private pump() {
    while (!this.disposed && this.active < 4 && this.queue.length) {
      const url = this.queue.shift()!;
      const image = new Image();
      image.decoding = "async";
      const entry: Entry = { image, state: "loading" };
      this.entries.set(url, entry);
      this.active++;
      let settled = false;
      let fallback = false;
      const stop = () => {
        clearTimeout(timeout);
        image.onload = null;
        image.onerror = null;
      };
      const cancel = () => { settled = true; stop(); image.src = ""; };
      const finish = (state: "ready" | "error") => {
        if (settled) return;
        settled = true;
        stop();
        if (state === "error") image.src = "";
        this.cancel.delete(cancel);
        entry.state = state;
        this.active--;
        if (!this.wanted.has(url)) this.entries.delete(url);
        this.pump();
      };
      const timeout = setTimeout(() => finish("error"), 12000);
      this.cancel.add(cancel);
      image.onload = () => {
        image.decode().then(() => finish("ready"), () => finish("error"));
      };
      image.onerror = () => {
        if (!fallback) {
          fallback = true;
          image.src = url.replace("/frames-webp/", "/frames/").replace(/\.webp$/, ".png");
        } else finish("error");
      };
      image.src = url;
    }
  }
}
