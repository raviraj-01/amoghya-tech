"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { SCROLL_SCRUB, scrollDistanceForFrames } from "@/lib/scroll-animation";
import {
  scrollWithLenis,
  lockSmoothScroll,
} from "@/components/layout/ScrollSystem";
import { mediaUrl } from "@/lib/media-url";
import { PricingPreview } from "./LandingConversion";
import { ServicesMarquee } from "./ServicesMarquee";
import { currentScrollKey, readScrollPosition } from "@/lib/scroll-position";
import { FrameCache } from "@/lib/frame-cache";
import { introHandoffTransform } from "@/lib/intro-handoff";
import { normalizeFrameMatte } from "@/lib/frame-matte";
import { useExperienceStore } from "@/three/quality-controller";
import { ServicesSection } from "@/components/services/ServicesSection";
import thoughtStyles from "./AmoThought.module.css";
import frameManifest from "@/lib/frame-manifest.json";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type FrameFolder = {
  id: number;
  frames: number[];
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

const FRAME_FOLDERS: FrameFolder[] = frameManifest;

const AUTOPLAY_FPS = 30;
const CROSSFADE_PROGRESS = 0.055;
const CONTENT_ENTER_START = 0.3;
const CONTENT_ENTER_RANGE = 0.18;
const CONTENT_EXIT_RANGE = 0.16;
const MOBILE_BREAKPOINT = 768;
const FRAME_RENDER_SCALE = 0.58;
const FRAME_BACKGROUND = "#ededeb";

// Source clips share an identical canvas ratio but not an identical AMO scale.
// These uniform factors align AMO's apparent height without distorting any frame.
const FRAME_CLIP_SCALE: Record<number, number> = {
  0: 1,
  1: 1, // Must remain unscaled for the exact intro handoff.
  2: 1.064,
  3: 0.976,
  4: 0.965,
  5: 0.988,
  6: 1.137,
  7: 1.078,
};

const AMO_THOUGHTS = [
  "",
  "Your next idea starts here.",
  "One team connects it all.",
  "Let your story take shape.",
  "Less busywork. More possibility.",
  "Start with the outcome.",
  "Built around your business.",
  "What shall we create together?",
];

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
    primary: { label: "Build a system", href: "/contact?source=systems" },
  },
  {
    folder: 5,
    eyebrow: "Services Deep Dive",
    title: "Start with what your business needs.",
    copy: "Bring your brand, technology and creative production together around a clear outcome.",
    bullets: ["Design", "Technology", "Growth"],
    primary: { label: "Explore outcomes", href: "#pricing" },
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
    eyebrow: "Your next chapter",
    title: "Let us talk about your next project.",
    copy: "Bring your idea, your challenges and where you want to go. We will help define the next step.",
    primary: { label: "Start a conversation", href: "/contact?source=home" },
  },
];

function frameUrl(folder: number, frame: number) {
  return `/frames-webp/frame-${folder}/ezgif-frame-${String(frame).padStart(3, "0")}.webp`;
}

function pngUrl(url: string) {
  return url.replace("/frames-webp/", "/frames/").replace(/\.webp$/, ".png");
}

function lastFrameUrl(folder: FrameFolder) {
  const frames = frameNumbers(folder);
  return frameUrl(folder.id, frames[frames.length - 1]);
}

function frameNumbers(folder: FrameFolder) {
  return folder.frames;
}

function availableFrameCount(folder: FrameFolder) {
  return folder.frames.length;
}

const FRAME_URLS = FRAME_FOLDERS.map((folder) =>
  frameNumbers(folder).map((frame) => frameUrl(folder.id, frame)),
);

function bezierPoint(t: number, p0: Point, p1: Point, p2: Point) {
  const x = (1 - t) ** 2 * p0.x + 2 * (1 - t) * t * p1.x + t ** 2 * p2.x;
  const y = (1 - t) ** 2 * p0.y + 2 * (1 - t) * t * p1.y + t ** 2 * p2.y;
  return { x, y };
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
}

function getMotionPoint(sectionIndex: number, progress: number) {
  // The intro stays centered; the first scroll clip leaves that same origin.
  if (sectionIndex === 0) return { x: 0, y: 0 };
  const t = easeInOutCubic(progress);
  const leftToRight = sectionIndex % 2 === 0;
  const viewportWidth =
    typeof window === "undefined" ? 1440 : window.innerWidth;
  const viewportHeight =
    typeof window === "undefined" ? 900 : window.innerHeight;
  const startX =
    sectionIndex === 1
      ? 0
      : leftToRight
        ? -viewportWidth * 0.12
        : viewportWidth * 0.12;
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
  const thoughtRef = useRef<HTMLDivElement>(null);
  const imageLayerRef = useRef<HTMLCanvasElement | null>(null);
  const cacheRef = useRef<FrameCache | null>(null);
  const lastRenderRef = useRef("");
  const posterRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const lastAutoplayTickRef = useRef(0);
  const currentFrameRef = useRef({ folder: 0, frame: 1 });
  const preloadPositionRef = useRef({ folder: 0, index: 0, direction: 1 });
  const returnPositionRef = useRef<number | null>(null);

  const enable3D = useExperienceStore((s) => s.enable3D);
  const [isStatic, setIsStatic] = useState<boolean | null>(null);
  const [autoplayDone, setAutoplayDone] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const characterRef = useRef<HTMLDivElement>(null);
  const contentMotionRef = useRef<HTMLDivElement>(null);
  const setMotionPoint = useCallback((point: Point) => {
    if (characterRef.current)
      gsap.set(characterRef.current, { x: point.x, y: point.y });
  }, []);
  const scrollDistance = scrollDistanceForFrames(
    FRAME_FOLDERS.slice(1).reduce(
      (sum, folder) => sum + availableFrameCount(folder),
      0,
    ),
  );

  useLayoutEffect(() => {
    const saved = readScrollPosition(currentScrollKey());
    if (!saved?.homeReady) return;
    returnPositionRef.current = saved.y;
    setAutoplayDone(true);
  }, []);

  useLayoutEffect(() => {
    if (isStatic !== false || window.location.hash) return;

    if (returnPositionRef.current === null) scrollWithLenis(0);
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

  const drawImage = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      img: HTMLImageElement | HTMLVideoElement,
      alpha = 1,
      handoffProgress?: number,
      clipScale = 1,
      introPresence = 0,
    ) => {
      const canvas = canvasRef.current;
      const isVideo = img instanceof HTMLVideoElement;
      const width = isVideo ? img.videoWidth : img.naturalWidth;
      const height = isVideo ? img.videoHeight : img.naturalHeight;
      if (
        !canvas ||
        !width ||
        !height ||
        (isVideo ? img.readyState < 2 : !img.complete)
      )
        return false;

      const cw = canvas.width;
      const ch = canvas.height;
      const preferredRatio =
        Math.max(cw / width, ch / height) * FRAME_RENDER_SCALE;
      // Use one uniform fit limit for both intro and scroll clips, including
      // the largest clip correction, so wide viewports cannot crop AMO.
      const regularRatio = Math.min(
        preferredRatio,
        (ch * 0.78) / (height * 1.137),
      );
      // The canvas includes overscan for AMO's path; fit the intro to the actual viewport.
      const viewportWidth = pinRef.current?.clientWidth ?? cw;
      const viewportHeight = pinRef.current?.clientHeight ?? ch;
      const pixelRatio = cw / (canvas.clientWidth || cw);
      const introRatio =
        Math.min(viewportWidth / width, viewportHeight / height) * pixelRatio;
      const ratio = regularRatio + (introRatio - regularRatio) * introPresence;
      const drawW = width * ratio;
      const drawH = height * ratio;
      const x = (cw - drawW) / 2;
      const y = (ch - drawH) / 2;

      const layer = imageLayerRef.current ?? document.createElement("canvas");
      imageLayerRef.current = layer;
      if (
        layer.width !== Math.ceil(drawW) ||
        layer.height !== Math.ceil(drawH)
      ) {
        layer.width = Math.ceil(drawW);
        layer.height = Math.ceil(drawH);
      }
      const layerCtx = layer.getContext("2d");
      if (!layerCtx) return false;
      layerCtx.clearRect(0, 0, layer.width, layer.height);
      layerCtx.drawImage(
        handoffProgress === undefined || isVideo
          ? img
          : normalizeFrameMatte(img),
        0,
        0,
        drawW,
        drawH,
      );

      const feather =
        drawW * (0.28 * (1 - introPresence) + 0.015 * introPresence);
      const verticalFeather =
        drawH * (0.05 * (1 - introPresence) + 0.015 * introPresence);
      const edges = [
        {
          x: 0,
          y: 0,
          w: feather,
          h: drawH,
          stops: [
            [0, 1],
            [1, 0],
          ],
          axis: "x",
        },
        {
          x: drawW - feather,
          y: 0,
          w: feather,
          h: drawH,
          stops: [
            [0, 0],
            [1, 1],
          ],
          axis: "x",
        },
        {
          x: 0,
          y: 0,
          w: drawW,
          h: verticalFeather,
          stops: [
            [0, 1],
            [1, 0],
          ],
          axis: "y",
        },
        {
          x: 0,
          y: drawH - verticalFeather,
          w: drawW,
          h: verticalFeather,
          stops: [
            [0, 0],
            [1, 1],
          ],
          axis: "y",
        },
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
      ctx.translate(cw / 2, ch / 2);
      ctx.scale(clipScale, clipScale);
      ctx.translate(-cw / 2, -ch / 2);
      if (handoffProgress !== undefined) {
        const { a, b, tx, ty } = introHandoffTransform(handoffProgress);
        ctx.translate(x, y);
        ctx.transform(a, b, -b, a, (tx * drawW) / 1920, (ty * drawH) / 1080);
        ctx.translate(-x, -y);
      }
      ctx.globalAlpha = alpha;
      ctx.drawImage(layer, x, y, drawW, drawH);
      ctx.restore();

      return true;
    },
    [],
  );

  const preloadFrames = useCallback((folderId: number, frameIndex: number) => {
    const urls = FRAME_URLS[folderId];
    if (!urls) return;
    const index = Math.min(
      urls.length - 1,
      Math.max(0, Math.floor(frameIndex)),
    );
    const last = preloadPositionRef.current;
    const delta =
      folderId === last.folder ? index - last.index : folderId - last.folder;
    const direction = delta === 0 ? last.direction : Math.sign(delta);
    preloadPositionRef.current = { folder: folderId, index, direction };
    const wanted = [urls[index]];
    const previous = FRAME_URLS[folderId - 1];
    if (previous && index / (urls.length - 1) <= CROSSFADE_PROGRESS)
      wanted.push(previous[previous.length - 1]);
    for (let offset = 1; offset <= 28; offset++) {
      if (urls[index + offset * direction])
        wanted.push(urls[index + offset * direction]);
      if (folderId > 0 && offset <= 8 && urls[index - offset * direction])
        wanted.push(urls[index - offset * direction]);
    }
    // Keep the next scene's opening ready, including for a fast wheel or anchor jump.
    if (direction > 0 ? index >= urls.length - 28 : index < 28)
      wanted.push(
        ...(direction > 0
          ? (FRAME_URLS[folderId + 1]?.slice(0, 6) ?? [])
          : (previous?.slice(-6).reverse() ?? [])),
      );
    cacheRef.current?.request(wanted);
  }, []);

  const renderFrame = useCallback(
    (folderId: number, frameFloat: number, allowNearby = false) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const folder = FRAME_FOLDERS.find((item) => item.id === folderId);
      const urls = FRAME_URLS[folderId];
      if (!folder || !urls) return;

      const frameIndex = Math.min(
        urls.length - 1,
        Math.max(0, Math.floor(frameFloat)),
      );
      preloadFrames(folderId, frameIndex);
      let displayedIndex = frameIndex;
      let current = cacheRef.current?.get(urls[frameIndex]);
      // A nearby decoded pose bridges brief download delays, never another scene.
      if (!current && allowNearby && frameFloat > 0) {
        const last = currentFrameRef.current;
        const sameScene = last.folder === folderId;
        const lastIndex = last.frame - 1;
        for (let offset = 1; offset < urls.length && !current; offset++) {
          for (const candidate of [frameIndex - offset, frameIndex + offset]) {
            if (candidate < 0 || candidate >= urls.length) continue;
            if (
              sameScene &&
              (candidate < Math.min(lastIndex, frameIndex) ||
                candidate > Math.max(lastIndex, frameIndex))
            )
              continue;
            const ready = cacheRef.current?.get(urls[candidate]);
            if (ready) {
              current = ready;
              displayedIndex = candidate;
              break;
            }
          }
        }
      }
      if (!current || !current.complete || !current.naturalWidth) return;

      const previousUrls = FRAME_URLS[folderId - 1];
      const previous = previousUrls
        ? cacheRef.current?.get(previousUrls[previousUrls.length - 1])
        : undefined;
      const sectionProgress = frameFloat / (urls.length - 1);
      if (folderId === 1 && sectionProgress < CROSSFADE_PROGRESS && !previous)
        return;
      const blend =
        previous?.complete && previous.naturalWidth
          ? Math.min(1, sectionProgress / CROSSFADE_PROGRESS)
          : 1;
      const handoffProgress = folderId === 1 ? sectionProgress : undefined;
      const introPresence =
        folderId === 0
          ? 1
          : folderId === 1
            ? 1 - easeInOutCubic(Math.min(1, sectionProgress / 0.45))
            : 0;
      const renderKey = `${folderId}:${displayedIndex}:${blend.toFixed(3)}:${handoffProgress === undefined ? "" : Math.min(0.45, handoffProgress).toFixed(5)}:${canvas.width}:${canvas.height}`;
      if (lastRenderRef.current === renderKey) return true;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = FRAME_BACKGROUND;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (folderId > 0 && blend < 1) {
        if (previous)
          drawImage(
            ctx,
            previous,
            folderId === 1 ? 1 - blend : 1,
            undefined,
            FRAME_CLIP_SCALE[folderId - 1] ?? 1,
            introPresence,
          );
        drawImage(
          ctx,
          current,
          blend,
          handoffProgress,
          FRAME_CLIP_SCALE[folderId] ?? 1,
          introPresence,
        );
      } else {
        drawImage(
          ctx,
          current,
          1,
          handoffProgress,
          FRAME_CLIP_SCALE[folderId] ?? 1,
          introPresence,
        );
      }

      currentFrameRef.current = { folder: folderId, frame: displayedIndex + 1 };
      canvas.dataset.frame = `${folderId}:${displayedIndex}`;
      lastRenderRef.current = renderKey;
      if (posterRef.current) posterRef.current.style.display = "none";
      return true;
    },
    [drawImage, preloadFrames],
  );

  const frameFromScrollProgress = useCallback((progress: number) => {
    const sectionFolders = FRAME_FOLDERS.slice(1);
    const normalizedProgress = Math.min(1, Math.max(0, progress));
    const total = sectionFolders.reduce(
      (sum, folder) => sum + availableFrameCount(folder),
      0,
    );
    const target = normalizedProgress * total;
    let offset = 0;
    const folder =
      sectionFolders.find((folder) => {
        const count = availableFrameCount(folder);
        if (target < offset + count) return true;
        offset += count;
        return false;
      }) ?? sectionFolders[sectionFolders.length - 1];
    const count = availableFrameCount(folder);
    const sectionProgress =
      normalizedProgress === 1 ? 1 : Math.min(1, (target - offset) / count);

    return {
      sectionIndex: folder.id,
      folderId: folder.id,
      localFrame: sectionProgress * Math.max(1, count - 1),
      sectionProgress,
    };
  }, []);

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    const sync = () =>
      setIsStatic(
        media.matches ||
          reduce.matches ||
          !enable3D ||
          Boolean(window.location.hash),
      );
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
    const cache = new FrameCache(mediaUrl);
    cacheRef.current = cache;
    resizeCanvas();
    lastRenderRef.current = "";
    const returning = returnPositionRef.current;
    if (returning !== null) {
      const frame = frameFromScrollProgress(returning / scrollDistance);
      preloadFrames(frame.folderId, frame.localFrame);
    } else
      cache.request([FRAME_URLS[0].at(-1)!, ...FRAME_URLS[1].slice(0, 29)]);
    return () => {
      cache.dispose();
      cacheRef.current = null;
    };
  }, [
    isStatic,
    preloadFrames,
    resizeCanvas,
    frameFromScrollProgress,
    scrollDistance,
  ]);

  useEffect(() => {
    if (isStatic !== false || autoplayDone) return;

    const bodyOverflow = document.body.style.overflow;
    const htmlOverflow = document.documentElement.style.overflow;
    const unlockScroll = lockSmoothScroll();
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    setMotionPoint(getMotionPoint(0, 0));

    let nextFrame = 0;
    let lastSuccess = performance.now();
    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.src =
      "https://res.cloudinary.com/dtgvkkgbk/video/upload/v1790320347/video_spwnbl.mp4";
    let videoFailed = false;
    let videoEnded = false;
    let lastVideoTime = -1;
    video.onended = () => {
      videoEnded = true;
      lastSuccess = performance.now();
    };
    video.onerror = () => {
      videoFailed = true;
      lastSuccess = performance.now();
    };
    video.play().catch(() => {
      videoFailed = true;
      lastSuccess = performance.now();
    });
    const openingBatch = [FRAME_URLS[0].at(-1)!, ...FRAME_URLS[1].slice(0, 12)];
    cacheRef.current?.request([
      FRAME_URLS[0].at(-1)!,
      ...FRAME_URLS[1].slice(0, 29),
    ]);
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
        if (!videoFailed) {
          videoFailed = true;
          video.pause();
          lastSuccess = time;
        } else {
          setIsStatic(true);
          return;
        }
      }
      if (!videoFailed) {
        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d");
        if (
          !videoEnded &&
          canvas &&
          context &&
          video.readyState >= 2 &&
          video.currentTime !== lastVideoTime
        ) {
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.fillStyle = FRAME_BACKGROUND;
          context.fillRect(0, 0, canvas.width, canvas.height);
          drawImage(context, video, 1, undefined, 1, 1);
          lastVideoTime = video.currentTime;
          lastSuccess = time;
          if (posterRef.current) posterRef.current.style.display = "none";
        }
        if (videoEnded) nextFrame = introFrameCount;
      }
      if (
        videoFailed &&
        nextFrame < introFrameCount &&
        time - lastAutoplayTickRef.current >= 1000 / AUTOPLAY_FPS &&
        renderFrame(0, nextFrame)
      ) {
        nextFrame += 1;
        lastSuccess = time;
        lastAutoplayTickRef.current =
          time -
          Math.min(
            (time - lastAutoplayTickRef.current) % (1000 / AUTOPLAY_FPS),
            1000 / AUTOPLAY_FPS,
          );
      }

      if (nextFrame >= introFrameCount)
        cacheRef.current?.request([
          FRAME_URLS[0].at(-1)!,
          ...FRAME_URLS[1].slice(0, 29),
        ]);
      if (
        nextFrame >= introFrameCount &&
        cacheRef.current?.ready(openingBatch) &&
        renderFrame(1, 0)
      ) {
        setActiveSection(1);
        setMotionPoint(getMotionPoint(1, 0));
        setAutoplayDone(true);
        document.body.style.overflow = bodyOverflow;
        document.documentElement.style.overflow = htmlOverflow;
        unlockScroll();
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      video.onended = null;
      video.onerror = null;
      video.pause();
      video.removeAttribute("src");
      video.load();
      document.body.style.overflow = bodyOverflow;
      document.documentElement.style.overflow = htmlOverflow;
      unlockScroll();
    };
  }, [autoplayDone, isStatic, renderFrame, setMotionPoint, drawImage]);

  useEffect(() => {
    if (
      isStatic !== false ||
      !autoplayDone ||
      !containerRef.current ||
      !pinRef.current
    )
      return;

    let needsPaint = false;
    let unsubscribe = () => {};
    let paint = () => {};
    let tick = () => {};
    let scrollAnimation: gsap.core.Tween | undefined;
    const ctx = gsap.context(() => {
      const playhead = { progress: 0 };

      let lastSection = -1;
      paint = () => {
        if (!needsPaint) return;
        needsPaint = false;
        const frame = frameFromScrollProgress(playhead.progress);
        updateContent();
        renderFrame(frame.folderId, frame.localFrame, true);
      };
      unsubscribe =
        cacheRef.current?.subscribe(() => {
          needsPaint = true;
        }) ?? unsubscribe;
      const update = () => {
        needsPaint = true;
      };
      const updateContent = () => {
        const frame = frameFromScrollProgress(playhead.progress);
        // Loading a pose must never block the scroll timeline or its copy.
        if (lastSection !== frame.sectionIndex) {
          lastSection = frame.sectionIndex;
          setActiveSection(frame.sectionIndex);
        }
        const enterStart = frame.folderId === 1 ? 0.5 : CONTENT_ENTER_START;
        const enter = easeInOutCubic(
          Math.min(
            1,
            Math.max(
              0,
              (frame.sectionProgress - enterStart) / CONTENT_ENTER_RANGE,
            ),
          ),
        );
        const leave =
          frame.folderId === 7
            ? 1
            : easeInOutCubic(
                Math.min(
                  1,
                  Math.max(0, (1 - frame.sectionProgress) / CONTENT_EXIT_RANGE),
                ),
              );
        const opacity = Math.min(enter, leave);
        const enterX = frame.sectionIndex % 2 === 1 ? 28 : -28;
        const exitX = frame.sectionIndex % 2 === 1 ? -28 : 28;
        const contentOffset =
          enter < 1 ? enterX * (1 - enter) : exitX * (1 - leave);
        if (contentMotionRef.current)
          gsap.set(contentMotionRef.current, { opacity, x: contentOffset });
        const thoughtEnter = easeInOutCubic(
          Math.min(1, Math.max(0, (frame.sectionProgress - 0.76) / 0.09)),
        );
        const thoughtLeave =
          frame.folderId === 7
            ? 1
            : Math.min(1, Math.max(0, (1 - frame.sectionProgress) / 0.06));
        const thoughtVisible = thoughtEnter * thoughtLeave;
        if (thoughtRef.current)
          gsap.set(thoughtRef.current, {
            opacity: thoughtVisible,
            y: (1 - thoughtEnter) * 12,
          });
        if (thoughtRef.current) {
          thoughtRef.current.style.visibility =
            thoughtVisible > 0.01 ? "visible" : "hidden";
          thoughtRef.current.setAttribute(
            "aria-hidden",
            String(thoughtVisible <= 0.01),
          );
        }
        if (contentRef.current) {
          contentRef.current.style.visibility =
            opacity > 0.001 ? "visible" : "hidden";
          contentRef.current.style.pointerEvents =
            opacity > 0.95 ? "auto" : "none";
          contentRef.current.setAttribute(
            "aria-hidden",
            String(opacity <= 0.001),
          );
        }
        setMotionPoint(
          getMotionPoint(frame.sectionIndex, frame.sectionProgress),
        );
      };
      scrollAnimation = gsap.to(playhead, {
        onUpdate: update,
        progress: 1,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          pin: pinRef.current,
          start: "top top",
          end: `+=${scrollDistance}`,
          scrub: SCROLL_SCRUB,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      tick = paint;
      gsap.ticker.add(tick);
    }, containerRef);

    ScrollTrigger.refresh();
    containerRef.current.parentElement?.setAttribute(
      "data-scroll-ready",
      "true",
    );
    if (returnPositionRef.current !== null) {
      scrollWithLenis(returnPositionRef.current);
      ScrollTrigger.update();
      const targetProgress = scrollAnimation?.scrollTrigger?.progress ?? 0;
      scrollAnimation?.progress(targetProgress);
      scrollAnimation?.scrollTrigger?.update();
      paint();
      returnPositionRef.current = null;
    }

    return () => {
      containerRef.current?.parentElement?.setAttribute(
        "data-scroll-ready",
        "false",
      );
      unsubscribe();
      gsap.ticker.remove(tick);
      ctx.revert();
    };
  }, [
    autoplayDone,
    frameFromScrollProgress,
    isStatic,
    renderFrame,
    scrollDistance,
    setMotionPoint,
  ]);

  useEffect(() => {
    if (isStatic !== false) return;

    const onResize = () => {
      resizeCanvas();
      renderFrame(
        currentFrameRef.current.folder,
        currentFrameRef.current.frame - 1,
      );
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", onResize);
    const observer = new ResizeObserver(() => {
      resizeCanvas();
      renderFrame(
        currentFrameRef.current.folder,
        currentFrameRef.current.frame - 1,
      );
    });
    if (canvasRef.current) observer.observe(canvasRef.current);
    return () => {
      window.removeEventListener("resize", onResize);
      observer.disconnect();
    };
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

  const visibleSection =
    NARRATIVE_SECTIONS.find((section) => section.folder === activeSection) ??
    NARRATIVE_SECTIONS[0];
  const contentOnRight = activeSection % 2 === 1;

  useEffect(() => {
    document.body.toggleAttribute("data-amo-experience", isStatic === false);
    return () => {
      document.body.removeAttribute("data-amo-experience");
    };
  }, [isStatic]);

  if (isStatic) {
    return (
      <div className="bg-[#ededeb] text-black" data-home-ready="true">
        <StaticNarrative />
        <LandingSections />
      </div>
    );
  }

  return (
    <div
      className="amo-experience -mt-[4.5rem] text-black"
      data-home-ready={autoplayDone}
      style={{ backgroundColor: FRAME_BACKGROUND }}
    >
      <h1 className="sr-only">Vyara Amoghya Technologies</h1>
      <section
        ref={containerRef}
        className="relative"
        aria-label="AMO guided landing narrative"
      >
        <div
          ref={pinRef}
          className="relative h-[100svh] min-h-[600px] overflow-hidden"
          style={{ backgroundColor: FRAME_BACKGROUND }}
        >
          <div
            ref={characterRef}
            className="absolute -inset-x-[8vw] -inset-y-[8vh]"
            style={{
              willChange: "transform",
            }}
          >
            <div
              ref={posterRef}
              role="status"
              className="absolute inset-0 flex items-center justify-center"
            >
              <span
                className="h-6 w-6 animate-spin motion-reduce:animate-none rounded-full border-2 border-black/15 border-t-black"
                aria-hidden="true"
              />
              <span className="sr-only">Loading AMO</span>
            </div>
            <canvas
              ref={canvasRef}
              className="absolute inset-0 block h-full w-full"
              aria-hidden="true"
            />
          </div>

          <div
            ref={contentRef}
            className={[
              "absolute top-1/2 w-[min(35vw,410px)] -translate-y-1/2",
              contentOnRight ? "right-[8vw]" : "left-[8vw]",
            ].join(" ")}
            style={{ visibility: "hidden" }}
            aria-hidden="true"
          >
            <div ref={contentMotionRef} style={{ opacity: 0 }}>
              <NarrativeCard section={visibleSection} />
            </div>
          </div>
          <div
            ref={thoughtRef}
            className={thoughtStyles.thought}
            data-side={contentOnRight ? "left" : "right"}
            data-amo-thought
            aria-hidden="true"
            style={{ opacity: 0, visibility: "hidden" }}
          >
            <svg
              className={thoughtStyles.cloud}
              viewBox="0 0 300 150"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path d="M30 112 C4 112 2 81 17 70 C1 49 19 26 44 30 C45 7 79 3 95 20 C115 0 147 5 158 20 C180 3 210 9 219 26 C248 12 273 28 272 47 C301 49 308 78 288 94 C301 119 272 139 249 129 C230 150 198 145 184 132 C161 152 132 146 119 133 C96 151 68 139 63 125 C45 136 26 129 30 112 Z" />
            </svg>
            <span className={thoughtStyles.trail} aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span className={thoughtStyles.label}>AMO thinks</span>
            <p>{AMO_THOUGHTS[activeSection]}</p>
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
    <div className="relative space-y-6 border-l border-black/20 pl-7 before:absolute before:-left-px before:top-0 before:h-20 before:w-[3px] before:bg-[#83a72a]">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/55">
        {section.eyebrow}
      </p>
      <Heading className="text-2xl font-black leading-[1.15] text-black sm:text-3xl lg:text-[2.25rem]">
        {section.title}
      </Heading>
      {section.copy ? (
        <p className="text-[17px] leading-7 text-black/70">{section.copy}</p>
      ) : null}
      {section.bullets ? (
        <div className="flex flex-wrap gap-2">
          {section.bullets.map((bullet) => (
            <span
              key={bullet}
              className="rounded-sm border border-black/15 bg-white/80 px-3 py-1.5 text-sm font-semibold text-black/70 shadow-[0_6px_18px_rgba(0,0,0,0.04)]"
            >
              {bullet}
            </span>
          ))}
        </div>
      ) : null}
      <div className="flex flex-wrap gap-3">
        {section.secondary ? (
          <SecondaryButton href={section.secondary.href}>
            {section.secondary.label}
          </SecondaryButton>
        ) : null}
        {section.primary ? (
          <PrimaryButton href={section.primary.href}>
            {section.primary.label}
          </PrimaryButton>
        ) : null}
      </div>
    </div>
  );
}

function StaticNarrative() {
  return (
    <section className="mx-auto w-full max-w-container px-4 py-12 sm:px-6 lg:px-8">
      <div className="space-y-16">
        {NARRATIVE_SECTIONS.map((section) => {
          const folder =
            FRAME_FOLDERS.find((item) => item.id === section.folder) ??
            FRAME_FOLDERS[0];
          return (
            <article
              key={section.folder}
              className="grid gap-8 lg:grid-cols-2 lg:items-center"
            >
              <div className="relative mx-auto aspect-video w-full overflow-hidden bg-[#ededeb]">
                <img
                  src={mediaUrl(lastFrameUrl(folder))}
                  alt="AMO, the VAT studio character"
                  width={1120}
                  height={630}
                  loading={section.folder === 0 ? "eager" : "lazy"}
                  decoding="async"
                  onError={(event) => {
                    const img = event.currentTarget;
                    if (!img.src.endsWith(".png"))
                      img.src = pngUrl(lastFrameUrl(folder));
                  }}
                  className="h-full w-full object-contain"
                />
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
      <ServicesMarquee />
      <ServicesSection />
      <PricingPreview />
    </>
  );
}

function PrimaryButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`${href.startsWith("/contact") ? "vat-contact-action " : ""}inline-flex items-center justify-center gap-3 rounded-sm bg-black px-5 py-3 text-sm font-bold text-white shadow-[0_12px_24px_rgba(0,0,0,0.14)] transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(0,0,0,0.2)]`}
    >
      <span>{children}</span>
      <ArrowRight className="h-4 w-4 text-[#C8FF3D]" />
    </Link>
  );
}

function SecondaryButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-sm border border-black/20 bg-white/85 px-5 py-3 text-sm font-bold text-black shadow-[0_8px_18px_rgba(0,0,0,0.05)] transition-[transform,border-color] hover:-translate-y-0.5 hover:border-black/50"
    >
      {children}
    </Link>
  );
}
