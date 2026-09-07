"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, Check, Package, Sparkles } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { motion, useMotionValue, useReducedMotion } from "framer-motion";
import { FrameCache } from "@/lib/frame-cache";
import { introHandoffTransform } from "@/lib/intro-handoff";
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
const SCROLL_PX_PER_SECTION = 1120;
const CROSSFADE_PROGRESS = 0.055;
const MOBILE_BREAKPOINT = 768;
const FRAME_RENDER_SCALE = 0.58;
const FRAME_BACKGROUND = "#ededeb";

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
    copy: "Strategy, brand, websites, apps, AI automation, content, and growth campaigns, planned as one connected business system.",
    bullets: ["Brand", "Websites", "Apps", "AI", "Content", "Growth"],
    primary: { label: "Explore services", href: "/services" },
  },
  {
    folder: 2,
    eyebrow: "The VAT World",
    title: "No vendor juggling. One team carries the context.",
    copy: "Most businesses split work between designers, developers, marketers, and automation tools. VAT keeps the thinking, build, launch, and reporting under one roof.",
    bullets: ["Clear strategy", "Consistent brand", "Faster delivery"],
    primary: { label: "About the company", href: "/about" },
  },
  {
    folder: 3,
    eyebrow: "Studio",
    title: "This is where ideas become real.",
    copy: "Use the studio for product shoots, reels, podcasts, brand films, and campaign content without managing a separate production vendor.",
    bullets: ["Product shoots", "Reels", "Podcasts", "Brand films"],
    primary: { label: "Book the Studio", href: "/studio/book" },
    secondary: { label: "View studio", href: "/studio" },
  },
  {
    folder: 4,
    eyebrow: "Technology & Intelligence",
    title: "Good ideas need systems that do the boring work.",
    copy: "CRM, dashboards, portals, AI assistants, and workflow automation help your team respond faster and lose fewer leads.",
    bullets: ["CRM", "Dashboards", "AI assistants", "Automation"],
    primary: { label: "Build a system", href: "/package-builder" },
  },
  {
    folder: 5,
    eyebrow: "Services Deep Dive",
    title: "Pick the outcome, then shape the package.",
    copy: "Starter works for fast launches. Growth fits most businesses that need stronger design, integrations, and campaigns. Enterprise covers complex systems and multi-location operations.",
    bullets: ["Starter", "Growth", "Enterprise"],
    primary: { label: "See package options", href: "#pricing" },
  },
  {
    folder: 6,
    eyebrow: "Selected Work",
    title: "Built for businesses that need leads, systems, and content.",
    copy: "From a startup's first launch to a growing restaurant, clinic, or online store: bring your brand, customer experience, and daily operations together.",
    bullets: ["Startups", "Restaurants", "Real estate", "E-commerce"],
    primary: { label: "View all work", href: "/work" },
  },
  {
    folder: 7,
    eyebrow: "Build Your Package",
    title: "Scope your custom project.",
    copy: "Combine only what you need: brand, website, content, AI, automation, campaigns, or studio production. The goal is a clean proposal, not a crowded menu.",
    primary: { label: "Build Your Package", href: "/package-builder" },
  },
];

const SERVICE_TEASERS = [
  ["Brand + Website Launch", "Identity, landing pages, business sites, and conversion basics for a credible market entry.", "from ₹10K"],
  ["AI + Automation Systems", "AI assistants, CRM automation, lead management, dashboards, and workflow cleanup.", "from ₹19K"],
  ["Content + Campaign Growth", "Product shoots, reels, ads, SEO, WhatsApp, and monthly campaign reporting.", "from ₹7K/mo"],
  ["Apps + Portals", "Customer portals, booking systems, mobile apps, commerce flows, and internal tools.", "from ₹30K"],
  ["Studio Production", "Podcast recording, brand films, product shoots, reels, and campaign-ready video assets.", "from ₹2K"],
  ["Business Consulting", "Roadmaps, audits, product strategy, growth planning, and digital transformation direction.", "from ₹19K"],
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
  "One team for brand, tech, AI, marketing, and content",
  "Built-in AI and automation advantage",
  "Clear scopes before work starts",
  "Fast delivery with direct communication",
  "Bengaluru-based and easy to reach",
];

function frameUrl(folder: number, frame: number) {
  return `/frames-webp/frame-${folder}/ezgif-frame-${String(frame).padStart(3, "0")}.webp`;
}

function pngUrl(url: string) {
  return url.replace("/frames-webp/", "/frames/").replace(/\.webp$/, ".png");
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

const FRAME_URLS = FRAME_FOLDERS.map(folder => frameNumbers(folder).map(frame => frameUrl(folder.id, frame)));

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
  const contentRef = useRef<HTMLDivElement>(null);
  const imageLayerRef = useRef<HTMLCanvasElement | null>(null);
  const cacheRef = useRef<FrameCache | null>(null);
  const lastRenderRef = useRef("");
  const posterRef = useRef<HTMLImageElement>(null);
  const rafRef = useRef<number | null>(null);
  const lastAutoplayTickRef = useRef(0);
  const currentFrameRef = useRef({ folder: 0, frame: 1 });

  const enable3D = useExperienceStore((s) => s.enable3D);
  const [isStatic, setIsStatic] = useState<boolean | null>(null);
  const [autoplayDone, setAutoplayDone] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const characterX = useMotionValue(0);
  const characterY = useMotionValue(0);
  const contentOpacity = useMotionValue(0);
  const contentX = useMotionValue(0);
  const setMotionPoint = useCallback((point: Point) => {
    characterX.set(point.x);
    characterY.set(point.y);
  }, [characterX, characterY]);

  const scrollSections = FRAME_FOLDERS.length - 1;

  const scrollDistance = scrollSections * SCROLL_PX_PER_SECTION;

  useLayoutEffect(() => {
    if (isStatic !== false || window.location.hash) return;

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

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const width = Math.floor(rect.width * dpr);
    const height = Math.floor(rect.height * dpr);
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
  }, []);

  const drawImage = useCallback((ctx: CanvasRenderingContext2D, img: HTMLImageElement, alpha = 1, handoffProgress?: number) => {
    const canvas = canvasRef.current;
    if (!canvas || !img.complete || !img.naturalWidth) return false;

    const cw = canvas.width;
    const ch = canvas.height;
    const ratio = Math.max(cw / img.naturalWidth, ch / img.naturalHeight) * FRAME_RENDER_SCALE;
    const drawW = img.naturalWidth * ratio;
    const drawH = img.naturalHeight * ratio;
    const x = (cw - drawW) / 2;
    const y = (ch - drawH) / 2;

    const layer = imageLayerRef.current ?? document.createElement("canvas");
    imageLayerRef.current = layer;
    if (layer.width !== Math.ceil(drawW) || layer.height !== Math.ceil(drawH)) {
      layer.width = Math.ceil(drawW);
      layer.height = Math.ceil(drawH);
    }
    const layerCtx = layer.getContext("2d");
    if (!layerCtx) return false;
    layerCtx.clearRect(0, 0, layer.width, layer.height);
    layerCtx.drawImage(img, 0, 0, drawW, drawH);

    const feather = drawW * 0.28;
    const verticalFeather = drawH * 0.05;
    const edges = [
      { x: 0, y: 0, w: feather, h: drawH, stops: [[0, 1], [1, 0]], axis: "x" },
      { x: drawW - feather, y: 0, w: feather, h: drawH, stops: [[0, 0], [1, 1]], axis: "x" },
      { x: 0, y: 0, w: drawW, h: verticalFeather, stops: [[0, 1], [1, 0]], axis: "y" },
      { x: 0, y: drawH - verticalFeather, w: drawW, h: verticalFeather, stops: [[0, 0], [1, 1]], axis: "y" },
    ] as const;

    // Feather the image alpha before compositing so a rotated frame cannot
    // paint a rectangular background over the outgoing lettering.
    layerCtx.save();
    layerCtx.globalCompositeOperation = "destination-out";
    edges.forEach((edge) => {
      const gradient =
        edge.axis === "x"
          ? layerCtx.createLinearGradient(edge.x, 0, edge.x + edge.w, 0)
          : layerCtx.createLinearGradient(0, edge.y, 0, edge.y + edge.h);
      edge.stops.forEach(([position, opacity]) => {
        gradient.addColorStop(position, `rgba(0, 0, 0, ${opacity})`);
      });
      layerCtx.fillStyle = gradient;
      layerCtx.fillRect(edge.x, edge.y, edge.w, edge.h);
    });
    layerCtx.restore();
    ctx.save();
    if (handoffProgress !== undefined) {
      const { a, b, tx, ty } = introHandoffTransform(handoffProgress);
      ctx.translate(x, y);
      ctx.transform(a, b, -b, a, tx * drawW / 1920, ty * drawH / 1080);
      ctx.translate(-x, -y);
    }
    ctx.globalAlpha = alpha;
    ctx.drawImage(layer, x, y, drawW, drawH);
    ctx.restore();

    return true;
  }, []);

  const preloadFrames = useCallback((folderId: number, frameIndex: number) => {
    const urls = FRAME_URLS[folderId];
    if (!urls) return;
    const index = Math.min(urls.length - 1, Math.max(0, Math.floor(frameIndex)));
    const wanted = [urls[index]];
    const previous = FRAME_URLS[folderId - 1];
    if (previous && index / (urls.length - 1) <= CROSSFADE_PROGRESS) wanted.push(previous[previous.length - 1]);
    for (let offset = 1; offset <= 24; offset++) {
      if (urls[index + offset]) wanted.push(urls[index + offset]);
      if (folderId > 0 && offset <= 12 && urls[index - offset]) wanted.push(urls[index - offset]);
    }
    // Keep the next scene's opening ready, including for a fast wheel or anchor jump.
    wanted.push(...(FRAME_URLS[folderId + 1]?.slice(0, 6) ?? []));
    cacheRef.current?.request(wanted);
  }, []);

  const renderFrame = useCallback(
    (folderId: number, frameFloat: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const folder = FRAME_FOLDERS.find((item) => item.id === folderId);
      const urls = FRAME_URLS[folderId];
      if (!folder || !urls) return;

      const frameIndex = Math.min(urls.length - 1, Math.max(0, Math.floor(frameFloat)));
      preloadFrames(folderId, frameIndex);
      const current = cacheRef.current?.get(urls[frameIndex]);
      if (cacheRef.current?.failed(urls[frameIndex])) {
        setIsStatic(true);
        return;
      }
      if (!current || !current.complete || !current.naturalWidth) return;

      const previousUrls = FRAME_URLS[folderId - 1];
      const previous = previousUrls ? cacheRef.current?.get(previousUrls[previousUrls.length - 1]) : undefined;
      const sectionProgress = frameFloat / (urls.length - 1);
      if (previousUrls && sectionProgress < CROSSFADE_PROGRESS && cacheRef.current?.failed(previousUrls[previousUrls.length - 1])) {
        setIsStatic(true);
        return;
      }
      if (folderId > 0 && sectionProgress < CROSSFADE_PROGRESS && !previous) return;
      const blend = previous?.complete && previous.naturalWidth
        ? Math.min(1, sectionProgress / CROSSFADE_PROGRESS)
        : 1;
      const handoffProgress = folderId === 1 ? sectionProgress : undefined;
      const renderKey = `${folderId}:${frameIndex}:${blend.toFixed(3)}:${handoffProgress?.toFixed(5)}:${canvas.width}:${canvas.height}`;
      if (lastRenderRef.current === renderKey) return true;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = FRAME_BACKGROUND;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (folderId > 0 && blend < 1) {
        if (previous) drawImage(ctx, previous, folderId === 1 ? 1 - blend : 1);
        drawImage(ctx, current, blend, handoffProgress);
      } else {
        drawImage(ctx, current, 1, handoffProgress);
      }

      currentFrameRef.current = { folder: folderId, frame: frameIndex + 1 };
      lastRenderRef.current = renderKey;
      if (posterRef.current) posterRef.current.style.display = "none";
      return true;
    },
    [drawImage, preloadFrames]
  );

  const frameFromScrollProgress = useCallback(
    (progress: number) => {
      const sectionFolders = FRAME_FOLDERS.slice(1);
      const normalizedProgress = Math.min(1, Math.max(0, progress));
      const sectionTarget = normalizedProgress * sectionFolders.length;
      const sectionSlot = Math.min(sectionFolders.length - 1, Math.floor(sectionTarget));
      const sectionProgress = sectionSlot === sectionFolders.length - 1 && normalizedProgress === 1
        ? 1
        : sectionTarget - sectionSlot;
      const folder = sectionFolders[sectionSlot] ?? sectionFolders[0];
      const count = availableFrameCount(folder);

      return {
        sectionIndex: folder.id,
        folderId: folder.id,
        localFrame: sectionProgress * Math.max(1, count - 1),
        sectionProgress,
      };
    },
    []
  );

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    const sync = () => setIsStatic(media.matches || reduce.matches || !enable3D || Boolean(window.location.hash));
    sync();

    media.addEventListener("change", sync);
    reduce.addEventListener("change", sync);

    return () => {
      media.removeEventListener("change", sync);
      reduce.removeEventListener("change", sync);
    };
  }, [enable3D]);

  useEffect(() => {
    if (isStatic !== false) return;
    const cache = new FrameCache();
    cacheRef.current = cache;
    resizeCanvas();
    lastRenderRef.current = "";
    preloadFrames(0, 0);
    return () => { cache.dispose(); cacheRef.current = null; };
  }, [isStatic, preloadFrames, resizeCanvas]);

  useEffect(() => {
    if (isStatic !== false || autoplayDone) return;

    const bodyOverflow = document.body.style.overflow;
    const htmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    let nextFrame = 0;
    let lastSuccess = performance.now();
    lastAutoplayTickRef.current = 0;
    const tick = (time: number) => {
      const introFrameCount = availableFrameCount(FRAME_FOLDERS[0]);
      if (document.hidden) {
        lastAutoplayTickRef.current = time;
        lastSuccess = time;
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      if (time - lastSuccess > 12000) {
        setIsStatic(true);
        return;
      }
      if (nextFrame < introFrameCount && time - lastAutoplayTickRef.current >= 1000 / AUTOPLAY_FPS && renderFrame(0, nextFrame)) {
        nextFrame += 1;
        lastSuccess = time;
        lastAutoplayTickRef.current = time - Math.min((time - lastAutoplayTickRef.current) % (1000 / AUTOPLAY_FPS), 1000 / AUTOPLAY_FPS);
        setMotionPoint(getMotionPoint(0, nextFrame / introFrameCount));
      }

      if (nextFrame >= introFrameCount && renderFrame(1, 0)) {
        setActiveSection(1);
        setMotionPoint(getMotionPoint(1, 0));
        setAutoplayDone(true);
        document.body.style.overflow = bodyOverflow;
        document.documentElement.style.overflow = htmlOverflow;
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      document.body.style.overflow = bodyOverflow;
      document.documentElement.style.overflow = htmlOverflow;
    };
  }, [autoplayDone, isStatic, renderFrame, setMotionPoint]);

  useEffect(() => {
    if (isStatic !== false || !autoplayDone || !containerRef.current || !pinRef.current) return;

    let pendingFrame = 0;
    const ctx = gsap.context(() => {
      const playhead = { progress: 0 };
      const update = () => {
        cancelAnimationFrame(pendingFrame);
        const frame = frameFromScrollProgress(playhead.progress);
        if (!renderFrame(frame.folderId, frame.localFrame)) {
          pendingFrame = requestAnimationFrame(update);
          return;
        }
        setActiveSection(frame.sectionIndex);
        const enter = easeInOutCubic(Math.min(1, Math.max(0, (frame.sectionProgress - 0.5) / 0.14)));
        const leave = frame.folderId === 7 ? 1 : Math.min(1, (1 - frame.sectionProgress) / 0.12);
        const opacity = Math.min(enter, leave);
        contentOpacity.set(opacity);
        contentX.set((frame.sectionIndex % 2 === 1 ? 28 : -28) * (1 - enter));
        if (contentRef.current) {
          contentRef.current.style.visibility = opacity > 0.01 ? "visible" : "hidden";
          contentRef.current.style.pointerEvents = opacity > 0.95 ? "auto" : "none";
          contentRef.current.setAttribute("aria-hidden", String(opacity <= 0.01));
        }
        setMotionPoint(getMotionPoint(frame.sectionIndex, frame.sectionProgress));
      };
      gsap.to(playhead, {
        progress: 1,
        ease: "none",
        onUpdate: update,
        scrollTrigger: {
          trigger: containerRef.current,
          pin: pinRef.current,
          start: "top top+=72",
          end: `+=${scrollDistance}`,
          scrub: 0.35,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefresh: update,
        },
      });
    }, containerRef);

    ScrollTrigger.refresh();

    return () => {
      cancelAnimationFrame(pendingFrame);
      ctx.revert();
    };
  }, [autoplayDone, contentOpacity, contentX, frameFromScrollProgress, isStatic, renderFrame, scrollDistance, setMotionPoint]);

  useEffect(() => {
    if (isStatic !== false) return;

    const onResize = () => {
      resizeCanvas();
      renderFrame(currentFrameRef.current.folder, currentFrameRef.current.frame - 1);
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isStatic, renderFrame, resizeCanvas]);

  useEffect(() => {
    if (isStatic !== false || autoplayDone) {
      document.body.removeAttribute("data-vat-intro-playing");
      return;
    }

    document.body.setAttribute("data-vat-intro-playing", "true");

    return () => {
      document.body.removeAttribute("data-vat-intro-playing");
    };
  }, [autoplayDone, isStatic]);

  const visibleSection = NARRATIVE_SECTIONS.find((section) => section.folder === activeSection) ?? NARRATIVE_SECTIONS[0];
  const contentOnRight = activeSection % 2 === 1;

  useEffect(() => {
    document.body.toggleAttribute("data-amo-experience", isStatic === false);
    return () => {
      document.body.removeAttribute("data-amo-experience");
    };
  }, [isStatic]);

  if (isStatic) {
    return (
      <div className="bg-[#ededeb] text-black">
        <StaticNarrative />
        <LandingSections />
      </div>
    );
  }

  return (
    <div className="amo-experience text-black" style={{ backgroundColor: FRAME_BACKGROUND }}>
      <h1 className="sr-only">Vyara Amoghya Technologies</h1>
      <section
        ref={containerRef}
        className="relative"
        aria-label="AMO guided landing narrative"
      >
        <div ref={pinRef} className="relative h-[calc(100vh-4.5rem)] min-h-[600px] overflow-hidden" style={{ backgroundColor: FRAME_BACKGROUND }}>
          <motion.div
            className="absolute -inset-x-[8vw] -inset-y-[8vh]"
            style={{
              x: characterX, y: characterY,
              willChange: "transform",
            }}
          >
            <img ref={posterRef} src={FRAME_URLS[0][0]} alt="" width={1120} height={630} fetchPriority="high" className="absolute inset-0 h-full w-full object-cover" style={{ transform: `scale(${FRAME_RENDER_SCALE})` }} onError={event => { if (!event.currentTarget.src.endsWith(".png")) event.currentTarget.src = pngUrl(FRAME_URLS[0][0]); }} />
            <canvas ref={canvasRef} className="h-full w-full" aria-hidden="true" />
          </motion.div>

          <div
            ref={contentRef}
            className={[
              "absolute top-1/2 w-[min(32vw,360px)] -translate-y-1/2",
              contentOnRight ? "right-[8vw]" : "left-[8vw]",
            ].join(" ")}
            style={{ visibility: "hidden" }}
            aria-hidden="true"
          >
            <motion.div style={{ opacity: contentOpacity, x: contentX }}>
            <NarrativeCard section={visibleSection} />
            </motion.div>
          </div>
        </div>
      </section>

      <LandingSections />
    </div>
  );
}

function NarrativeCard({ section }: { section: NarrativeSection }) {
  const Heading = section.folder === 0 ? "h1" : "h2";
  return (
    <div className="space-y-6">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-black/50">{section.eyebrow}</p>
      <Heading className="text-2xl font-black leading-[1.05] text-black sm:text-3xl lg:text-[2rem]">
        {section.title}
      </Heading>
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
                <img src={lastFrameUrl(folder)} alt="AMO, the VAT studio character" width={1120} height={630} loading={section.folder === 0 ? "eager" : "lazy"} decoding="async" onError={event => { const img = event.currentTarget; if (!img.src.endsWith(".png")) img.src = pngUrl(lastFrameUrl(folder)); }} className="h-full w-full object-contain" />
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

function Reveal({ children, className }: { children: React.ReactNode; className: string }) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.div className={className} initial={reducedMotion ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.08 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

function PricingPreview() {
  return (
    <section id="pricing" className="border-y border-black/10 bg-[#ededeb] py-14">
      <Reveal className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#C8FF3D] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-black">
              <Sparkles className="h-4 w-4" />
              Founding-client package options
            </div>
            <h2 className="text-2xl font-black leading-none text-black sm:text-3xl">Clear ways to start.</h2>
            <p className="text-sm leading-6 text-black/65">
              Start with the essentials or plan a complete launch. Explore our services, then build a package around your goals, timeline, and budget.
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
          <BundleTeaser title="Startup Launch Bundle" copy="Business website, logo design, brand strategy, and performance marketing for founders who need a clean first launch." />
          <BundleTeaser title="Restaurant Launch Bundle" copy="Business website, product photography, social reels, and WhatsApp marketing for food brands that need faster visibility." />
        </div>
      </Reveal>
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
      <Reveal className="mx-auto grid max-w-container gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_0.8fr] lg:px-8">
        <div className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/50">Contact</p>
          <h2 className="text-3xl font-black leading-none text-black sm:text-4xl">So... what are we building?</h2>
          <p className="max-w-2xl text-sm leading-6 text-black/65">
            Tell us what you have in mind. We will help you choose the right services, define the scope, and plan the next step.
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
      </Reveal>
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
