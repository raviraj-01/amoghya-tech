"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, Check, Package, Sparkles } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useExperienceStore } from "@/three/quality-controller";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type FrameFolder = {
  id: number;
  count: number;
  missing?: number[];
};

type NarrativeSection = {
  folder: number;
  title: string;
  eyebrow: string;
  copy?: string;
  bullets?: string[];
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
};

type Point = {
  x: number;
  y: number;
};

const FRAME_FOLDERS: FrameFolder[] = [
  { id: 0, count: 240 },
  { id: 1, count: 85 },
  { id: 2, count: 105 },
  { id: 3, count: 220 },
  { id: 4, count: 205, missing: [161, 162, 163, 164, 165] },
  { id: 5, count: 240 },
  { id: 6, count: 240 },
  { id: 7, count: 240 },
];

const AUTOPLAY_FPS = 30;
const SCROLL_PX_PER_FRAME = 6;
const CROSSFADE_FRAMES = 5;
const MOBILE_BREAKPOINT = 768;
const FRAME_BACKGROUND = "#ededeb";
const FRAME_RENDER_SCALE = 0.58;

const NARRATIVE_SECTIONS: NarrativeSection[] = [
  {
    folder: 0,
    eyebrow: "Beyond Your Expectations",
    title: "Vyara Amoghya Technologies",
    copy: "Oh... you're here. I'm AMO. And apparently, I'm supposed to show you what we do.",
    primary: { label: "Start a Project", href: "/contact?source=home-arrival" },
    secondary: { label: "See what AMO can do", href: "/services" },
  },
  {
    folder: 1,
    eyebrow: "Capability Reveal",
    title: "I do quite a lot.",
    copy: "I build things. I design things. I make things move. I help people notice things. And sometimes, I make machines do the boring stuff.",
    bullets: ["Websites", "Apps", "Identity", "AI", "Analytics", "Campaigns"],
    primary: { label: "Explore services", href: "/services" },
  },
  {
    folder: 2,
    eyebrow: "The VAT World",
    title: "One team. Many capabilities. One coherent outcome.",
    bullets: ["Think clearly", "Build beautifully", "Grow intelligently"],
    primary: { label: "About the company", href: "/about" },
  },
  {
    folder: 3,
    eyebrow: "Studio",
    title: "This is where ideas become real.",
    bullets: ["Podcast recording", "Product shoots", "Video production", "Creative direction"],
    primary: { label: "Book the Studio", href: "/studio/book" },
    secondary: { label: "View studio", href: "/studio" },
  },
  {
    folder: 4,
    eyebrow: "Technology & Intelligence",
    title: "Good ideas need systems... I make technology feel less like technology.",
    bullets: ["Engineering", "AI automation", "CRM pipelines", "Data dashboards", "Consulting"],
    primary: { label: "Build a system", href: "/package-builder" },
  },
  {
    folder: 5,
    eyebrow: "Services Deep Dive",
    title: "Modular capabilities, priced for clear decisions.",
    copy: "Starter, Growth, and Enterprise tiers keep scope understandable without forcing a full table into the story.",
    primary: { label: "See launch pricing", href: "#pricing" },
  },
  {
    folder: 6,
    eyebrow: "Selected Work",
    title: "Project proof belongs here.",
    copy: "Client-approved portfolio items are still pending input, so this build does not invent case studies.",
    primary: { label: "View all work", href: "/work" },
  },
  {
    folder: 7,
    eyebrow: "Build Your Package",
    title: "Scope your custom project.",
    copy: "Combine brand, web, content, automation, product, campaigns, and studio time into one guided estimate.",
    primary: { label: "Build Your Package", href: "/package-builder" },
  },
];

const SERVICE_TEASERS = [
  ["Brand Strategy & Identity", "Foundational identity and market clarity.", "from ₹4K"],
  ["Website Development", "Landing pages, business sites, portals, and commerce.", "from ₹6K"],
  ["Mobile Application Development", "Native and cross-platform business apps.", "from ₹60K"],
  ["Custom Software Solutions", "CRM, ERP, dashboards, and operations platforms.", "from ₹30K"],
  ["Artificial Intelligence Solutions", "AI assistants, automations, and analytics systems.", "from ₹11K"],
  ["Digital Marketing", "Search, social, WhatsApp, reporting, and growth retainers.", "from ₹7K/mo"],
  ["Creative Content Production", "Photography, video, reels, films, and campaign content.", "from ₹2K"],
  ["UI/UX Design", "Web, app, SaaS, dashboard, prototype, and design systems.", "from ₹6K"],
  ["Cloud & Technology Services", "Infrastructure, APIs, security, performance, and DevOps.", "from ₹7K/mo"],
  ["Business Automation", "Sales, HR, documents, reporting, and workflow automation.", "from ₹14K"],
  ["Business Consulting", "Strategy, roadmaps, audits, and transformation planning.", "from ₹19K"],
];

const PRICING_TIERS = [
  ["Starter", "Lean scope, fast turnaround."],
  ["Growth ★ Most Popular", "Most clients' sweet spot."],
  ["Enterprise", "Complex integrations, compliance, and scale."],
];

const FREE_BONUSES = [
  "Free strategy consultation",
  "Free audit report",
  "Free WhatsApp catalogue setup",
  "Free Google Business Profile setup",
];

const VALUE_PROPS = [
  "One team, every service",
  "Built-in AI advantage",
  "Fixed, transparent pricing",
  "Fast, clearly communicated delivery",
  "Bengaluru-based and WhatsApp-reachable",
];

function frameUrl(folder: number, frame: number) {
  return `/frames/frame-${folder}/ezgif-frame-${String(frame).padStart(3, "0")}.png`;
}

function lastFrameUrl(folder: FrameFolder) {
  const frames = frameNumbers(folder);
  return frameUrl(folder.id, frames[frames.length - 1] ?? folder.count);
}

function frameNumbers(folder: FrameFolder) {
  const missing = new Set(folder.missing ?? []);
  return Array.from({ length: folder.count }, (_, index) => index + 1).filter((frame) => !missing.has(frame));
}

function availableFrameCount(folder: FrameFolder) {
  return folder.count - (folder.missing?.length ?? 0);
}

function bezierPoint(t: number, p0: Point, p1: Point, p2: Point) {
  const x = (1 - t) ** 2 * p0.x + 2 * (1 - t) * t * p1.x + t ** 2 * p2.x;
  const y = (1 - t) ** 2 * p0.y + 2 * (1 - t) * t * p1.y + t ** 2 * p2.y;
  return { x, y };
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
}

function getMotionPoint(sectionIndex: number, progress: number) {
  const t = easeInOutCubic(progress);
  const leftToRight = sectionIndex % 2 === 0;
  const viewportWidth = typeof window === "undefined" ? 1440 : window.innerWidth;
  const viewportHeight = typeof window === "undefined" ? 900 : window.innerHeight;
  const startX = leftToRight ? -viewportWidth * 0.12 : viewportWidth * 0.12;
  const endX = leftToRight ? viewportWidth * 0.12 : -viewportWidth * 0.12;
  const baseY = 0;
  const arcHeight = Math.min(110, viewportHeight * 0.12);
  const p0 = { x: startX, y: baseY };
  const p1 = { x: (startX + endX) / 2, y: baseY + arcHeight };
  const p2 = { x: endX, y: baseY };

  return bezierPoint(t, p0, p1, p2);
}

export function HomeExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<Map<number, HTMLImageElement[]>>(new Map());
  const loadedFoldersRef = useRef<Set<number>>(new Set());
  const rafRef = useRef<number | null>(null);
  const lastAutoplayTickRef = useRef(0);
  const currentFrameRef = useRef({ folder: 0, frame: 1 });

  const enable3D = useExperienceStore((s) => s.enable3D);
  const [isStatic, setIsStatic] = useState(false);
  const [autoplayDone, setAutoplayDone] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [scrollStarted, setScrollStarted] = useState(false);
  const [motionPoint, setMotionPoint] = useState<Point>({ x: 0, y: 0 });

  const scrollFrameCount = useMemo(
    () => FRAME_FOLDERS.slice(1).reduce((total, folder) => total + availableFrameCount(folder), 0),
    []
  );

  const scrollDistance = scrollFrameCount * SCROLL_PX_PER_FRAME;

  useLayoutEffect(() => {
    if (isStatic || window.location.hash) return;

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    window.scrollTo(0, 0);
    ScrollTrigger.clearScrollMemory?.();
  }, [isStatic]);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
  }, []);

  const drawImage = useCallback((ctx: CanvasRenderingContext2D, img: HTMLImageElement, alpha = 1) => {
    const canvas = canvasRef.current;
    if (!canvas || !img.complete || !img.naturalWidth) return false;

    const cw = canvas.width;
    const ch = canvas.height;
    const ratio = Math.max(cw / img.naturalWidth, ch / img.naturalHeight) * FRAME_RENDER_SCALE;
    const drawW = img.naturalWidth * ratio;
    const drawH = img.naturalHeight * ratio;
    const x = (cw - drawW) / 2;
    const y = (ch - drawH) / 2;

    ctx.globalAlpha = alpha;
    ctx.drawImage(img, x, y, drawW, drawH);
    ctx.globalAlpha = 1;

    const feather = Math.min(90, Math.max(42, Math.min(drawW, drawH) * 0.07));
    const edges = [
      { x, y, w: feather, h: drawH, stops: [[0, 1], [1, 0]], axis: "x" },
      { x: x + drawW - feather, y, w: feather, h: drawH, stops: [[0, 0], [1, 1]], axis: "x" },
      { x, y, w: drawW, h: feather, stops: [[0, 1], [1, 0]], axis: "y" },
      { x, y: y + drawH - feather, w: drawW, h: feather, stops: [[0, 0], [1, 1]], axis: "y" },
    ] as const;

    edges.forEach((edge) => {
      const gradient =
        edge.axis === "x"
          ? ctx.createLinearGradient(edge.x, 0, edge.x + edge.w, 0)
          : ctx.createLinearGradient(0, edge.y, 0, edge.y + edge.h);
      edge.stops.forEach(([position, opacity]) => {
        gradient.addColorStop(position, `rgba(237, 237, 235, ${opacity * alpha})`);
      });
      ctx.fillStyle = gradient;
      ctx.fillRect(edge.x, edge.y, edge.w, edge.h);
    });

    return true;
  }, []);

  const drawBackdrop = useCallback((ctx: CanvasRenderingContext2D, img: HTMLImageElement, alpha = 1) => {
    const canvas = canvasRef.current;
    if (!canvas || !img.complete || !img.naturalWidth) return false;

    const cw = canvas.width;
    const ch = canvas.height;
    const ratio = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const drawW = img.naturalWidth * ratio;
    const drawH = img.naturalHeight * ratio;
    const x = (cw - drawW) / 2;
    const y = (ch - drawH) / 2;

    ctx.save();
    ctx.globalAlpha = alpha * 0.55;
    ctx.filter = "blur(18px)";
    ctx.drawImage(img, x - 18, y - 18, drawW + 36, drawH + 36);
    ctx.restore();
    return true;
  }, []);

  const preloadFolder = useCallback((folderId: number) => {
    if (loadedFoldersRef.current.has(folderId) || imagesRef.current.has(folderId)) return;

    const folder = FRAME_FOLDERS.find((item) => item.id === folderId);
    if (!folder) return;

    const images: HTMLImageElement[] = [];
    imagesRef.current.set(folderId, images);

    frameNumbers(folder).forEach((frame) => {
      const img = new window.Image();
      img.decoding = frame === 1 ? "sync" : "async";
      img.src = frameUrl(folder.id, frame);
      img.onload = () => {
        if (images.every((image) => image.complete && image.naturalWidth > 0)) {
          loadedFoldersRef.current.add(folderId);
        }
      };
      images.push(img);
    });
  }, []);

  const renderFrame = useCallback(
    (folderId: number, frameFloat: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      resizeCanvas();
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const folder = FRAME_FOLDERS.find((item) => item.id === folderId);
      const images = imagesRef.current.get(folderId);
      if (!folder || !images) return;

      const frameIndex = Math.min(images.length - 1, Math.max(0, Math.floor(frameFloat)));
      const current = images[frameIndex];
      if (!current || !current.complete || !current.naturalWidth) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = FRAME_BACKGROUND;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (folderId > 0 && frameIndex < CROSSFADE_FRAMES) {
        const previousFolder = FRAME_FOLDERS.find((item) => item.id === folderId - 1);
        const previousImages = imagesRef.current.get(folderId - 1);
        const previous = previousFolder && previousImages ? previousImages[previousImages.length - 1] : null;
        const blend = Math.min(1, Math.max(0, frameIndex / CROSSFADE_FRAMES));

        if (previous) drawBackdrop(ctx, previous, 1 - blend);
        drawBackdrop(ctx, current, blend);
        if (previous) drawImage(ctx, previous, 1 - blend);
        drawImage(ctx, current, blend);
      } else {
        drawBackdrop(ctx, current);
        drawImage(ctx, current);
      }

      currentFrameRef.current = { folder: folderId, frame: frameIndex + 1 };
    },
    [drawBackdrop, drawImage, resizeCanvas]
  );

  const frameFromScrollProgress = useCallback(
    (progress: number) => {
      const target = progress * (scrollFrameCount - 1);
      let cursor = 0;

      for (let i = 1; i < FRAME_FOLDERS.length; i++) {
        const folder = FRAME_FOLDERS[i];
        const count = availableFrameCount(folder);
        const nextCursor = cursor + count;

        if (target < nextCursor || i === FRAME_FOLDERS.length - 1) {
          return {
            sectionIndex: i,
            folderId: folder.id,
            localFrame: Math.min(count - 1, target - cursor),
            sectionProgress: Math.min(1, Math.max(0, (target - cursor) / Math.max(1, count - 1))),
          };
        }

        cursor = nextCursor;
      }

      return { sectionIndex: 1, folderId: 1, localFrame: 0, sectionProgress: 0 };
    },
    [scrollFrameCount]
  );

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    const sync = () => setIsStatic(media.matches || reduce.matches || !enable3D);
    sync();

    media.addEventListener("change", sync);
    reduce.addEventListener("change", sync);

    return () => {
      media.removeEventListener("change", sync);
      reduce.removeEventListener("change", sync);
    };
  }, [enable3D]);

  useEffect(() => {
    if (isStatic) {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      return;
    }

    preloadFolder(0);
    preloadFolder(1);
  }, [isStatic, preloadFolder]);

  useEffect(() => {
    if (isStatic || autoplayDone) return;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const tick = (time: number) => {
      if (!lastAutoplayTickRef.current) lastAutoplayTickRef.current = time;
      const elapsedFrames = Math.floor(((time - lastAutoplayTickRef.current) / 1000) * AUTOPLAY_FPS);
      const introFrameCount = availableFrameCount(FRAME_FOLDERS[0]);
      const frame = Math.min(introFrameCount, 1 + elapsedFrames);

      renderFrame(0, frame - 1);
      setMotionPoint(getMotionPoint(0, frame / introFrameCount));

      if (frame >= introFrameCount) {
        renderFrame(1, 0);
        setActiveSection(1);
        setMotionPoint(getMotionPoint(1, 0));
        setScrollStarted(false);
        setAutoplayDone(true);
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [autoplayDone, isStatic, renderFrame]);

  useEffect(() => {
    if (isStatic || !autoplayDone || !containerRef.current || !pinRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        pin: pinRef.current,
        start: "top top+=72",
        end: `+=${scrollDistance}`,
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const frame = frameFromScrollProgress(self.progress);
          preloadFolder(frame.folderId + 1);
          renderFrame(frame.folderId, frame.localFrame);
          setActiveSection(frame.sectionIndex);
          setScrollStarted(self.progress > 0.035 && frame.sectionProgress > 0.16);
          setMotionPoint(getMotionPoint(frame.sectionIndex, frame.sectionProgress));
        },
      });
    }, containerRef);

    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, [autoplayDone, frameFromScrollProgress, isStatic, preloadFolder, renderFrame, scrollDistance]);

  useEffect(() => {
    if (isStatic) return;

    const onResize = () => {
      resizeCanvas();
      renderFrame(currentFrameRef.current.folder, currentFrameRef.current.frame - 1);
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isStatic, renderFrame, resizeCanvas]);

  useEffect(() => {
    if (isStatic || autoplayDone) {
      document.body.removeAttribute("data-vat-intro-playing");
      return;
    }

    document.body.setAttribute("data-vat-intro-playing", "true");

    return () => {
      document.body.removeAttribute("data-vat-intro-playing");
    };
  }, [autoplayDone, isStatic]);

  const visibleSection = NARRATIVE_SECTIONS.find((section) => section.folder === activeSection) ?? NARRATIVE_SECTIONS[0];
  const contentOnRight = motionPoint.x < 0;
  const contentVisible = autoplayDone && scrollStarted && Math.abs(motionPoint.x) > 3;

  if (isStatic) {
    return (
      <div className="bg-[#ededeb] text-black">
        <StaticNarrative />
        <LandingSections />
      </div>
    );
  }

  return (
    <div className="bg-[#ededeb] text-black">
      <section
        ref={containerRef}
        className="relative"
        style={{ minHeight: `${scrollDistance + 720}px` }}
        aria-label="AMO guided landing narrative"
      >
        <div ref={pinRef} className="relative h-[calc(100vh-4.5rem)] min-h-[600px] overflow-hidden" style={{ backgroundColor: FRAME_BACKGROUND }}>
          <div
            className="absolute -inset-x-[8vw] -inset-y-[8vh]"
            style={{
              transform: `translate(${motionPoint.x}px, ${motionPoint.y}px)`,
            }}
          >
            <canvas ref={canvasRef} className="h-full w-full" aria-hidden="true" />
          </div>

          <div
            className={[
              "absolute top-1/2 w-[min(32vw,360px)] -translate-y-1/2 transition-opacity duration-300",
              contentOnRight ? "right-[8vw]" : "left-[8vw]",
              contentVisible ? "opacity-100" : "pointer-events-none opacity-0",
            ].join(" ")}
          >
            <NarrativeCard section={visibleSection} />
          </div>
        </div>
      </section>

      <LandingSections />
    </div>
  );
}

function NarrativeCard({ section }: { section: NarrativeSection }) {
  return (
    <div className="space-y-6">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-black/50">{section.eyebrow}</p>
      <h1 className="text-2xl font-black leading-[1.05] text-black sm:text-3xl lg:text-[2rem]">
        {section.title}
      </h1>
      {section.copy ? <p className="text-sm leading-6 text-black/70">{section.copy}</p> : null}
      {section.bullets ? (
        <div className="flex flex-wrap gap-2">
          {section.bullets.map((bullet) => (
            <span key={bullet} className="rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs font-semibold text-black/70">
              {bullet}
            </span>
          ))}
        </div>
      ) : null}
      <div className="flex flex-wrap gap-3">
        {section.secondary ? <SecondaryButton href={section.secondary.href}>{section.secondary.label}</SecondaryButton> : null}
        {section.primary ? <PrimaryButton href={section.primary.href}>{section.primary.label}</PrimaryButton> : null}
      </div>
    </div>
  );
}

function StaticNarrative() {
  return (
    <section className="mx-auto w-full max-w-container px-4 py-12 sm:px-6 lg:px-8">
      <div className="space-y-16">
        {NARRATIVE_SECTIONS.map((section) => {
          const folder = FRAME_FOLDERS.find((item) => item.id === section.folder) ?? FRAME_FOLDERS[0];
          return (
            <article key={section.folder} className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div className="relative mx-auto aspect-video w-full overflow-hidden bg-[#ededeb]">
                <img src={lastFrameUrl(folder)} alt="" className="h-full w-full object-cover" />
              </div>
              <NarrativeCard section={section} />
            </article>
          );
        })}
      </div>
    </section>
  );
}

function LandingSections() {
  return (
    <>
      <PricingPreview />
      <ClosingContact />
    </>
  );
}

function PricingPreview() {
  return (
    <section id="pricing" className="border-y border-black/10 bg-[#ededeb] py-14">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#C8FF3D] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-black">
              <Sparkles className="h-4 w-4" />
              Launch Pricing valid through 5 September 2026
            </div>
            <h2 className="text-2xl font-black leading-none text-black sm:text-3xl">Clear ways to start.</h2>
            <p className="text-sm leading-6 text-black/65">
              The landing page keeps pricing light and glanceable. Full tables, all 22 industry bundles, GST notes, and milestones belong in the package builder/detail view.
            </p>
          </div>
          <PrimaryButton href="/package-builder">Build Your Package</PrimaryButton>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {PRICING_TIERS.map(([title, copy]) => (
            <div key={title} className="rounded-lg border border-black/10 bg-white/75 p-5">
              <h3 className="text-base font-black text-black">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-black/65">{copy}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICE_TEASERS.map(([title, copy, price]) => (
            <Link
              key={title}
              href="/services"
              className="group rounded-lg border border-black/10 bg-white/75 p-4 transition-colors hover:border-black/30"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-sm font-black text-black">{title}</h3>
                <span className="shrink-0 rounded-full bg-black px-3 py-1 text-xs font-bold text-[#C8FF3D]">{price}</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-black/60">{copy}</p>
            </Link>
          ))}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <InfoPanel title="Why Businesses Choose Amoghya" items={VALUE_PROPS} />
          <InfoPanel title="Free With Every Project" items={FREE_BONUSES} />
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <BundleTeaser title="Startup Launch Bundle" copy="Startups save ₹5K with Business Website + Logo Design + Brand Strategy + Performance Marketing." />
          <BundleTeaser title="Restaurant Launch Bundle" copy="Restaurants & Cafés save ₹5K with Business Website + Product Photography + Reels + WhatsApp Marketing." />
        </div>
      </div>
    </section>
  );
}

function InfoPanel({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-black/10 bg-white/75 p-5">
      <h3 className="text-lg font-black text-black">{title}</h3>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-sm text-black/70">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-black" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function BundleTeaser({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="rounded-lg border border-black/10 bg-black p-5 text-white">
      <Package className="h-5 w-5 text-[#C8FF3D]" />
      <h3 className="mt-4 text-lg font-black">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-white/70">{copy}</p>
      <Link href="/package-builder" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#C8FF3D]">
        View bundle options <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function ClosingContact() {
  return (
    <section className="bg-[#ededeb] py-16">
      <div className="mx-auto grid max-w-container gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_0.8fr] lg:px-8">
        <div className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/50">Contact</p>
          <h2 className="text-3xl font-black leading-none text-black sm:text-4xl">So... what are we building?</h2>
          <p className="max-w-2xl text-sm leading-6 text-black/65">
            Start a project, book the studio, build a package, or schedule a discovery call. Each path keeps the commercial flow usable without animation.
          </p>
          <div className="flex flex-wrap gap-3">
            <PrimaryButton href="/contact?source=closing-start">Start a Project</PrimaryButton>
            <SecondaryButton href="/studio/book">Book the Studio</SecondaryButton>
            <SecondaryButton href="/package-builder">Build Your Package</SecondaryButton>
            <SecondaryButton href="/contact?source=closing-discovery">Schedule a Discovery Call</SecondaryButton>
          </div>
        </div>
        <div className="rounded-lg border border-black/10 bg-white/75 p-5">
          <CalendarDays className="h-6 w-6 text-black" />
          <h3 className="mt-5 text-xl font-black text-black">Bengaluru, Karnataka</h3>
          <p className="mt-3 text-sm leading-6 text-black/65">
            Established 2025. VAT Creative Studio brings strategy, brand, engineering, AI automation, marketing, content, and studio production under one roof.
          </p>
        </div>
      </div>
    </section>
  );
}

function PrimaryButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-bold text-white transition-transform hover:scale-[1.02]">
      <span>{children}</span>
      <ArrowRight className="h-4 w-4 text-[#C8FF3D]" />
    </Link>
  );
}

function SecondaryButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="inline-flex items-center justify-center rounded-full border border-black/15 bg-white px-5 py-3 text-sm font-bold text-black transition-colors hover:border-black/40">
      {children}
    </Link>
  );
}
