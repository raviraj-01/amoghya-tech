"use client";
import { SCROLL_SCRUB, SCENE_FRAME_COUNT, scrollDistanceForFrames } from "@/lib/scroll-animation";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const TOTAL_FRAMES = 120;
const PIN_DISTANCE = scrollDistanceForFrames(TOTAL_FRAMES);

function getFrameUrl(index: number): string {
  const paddedIndex = String(index).padStart(3, "0");
  return `/frames/frame-1/ezgif-frame-${paddedIndex}.jpg`;
}

export function ScrollFrameSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinTargetRef = useRef<HTMLDivElement>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isIntroVideoVisible, setIsIntroVideoVisible] = useState(true);

  // Cached image array in memory
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameIndexRef = useRef<number>(0);
  const animationContextRef = useRef<gsap.Context | null>(null);
  const handoffCompletedRef = useRef(false);

  // 1. Draw frame with native aspect ratio (object-fit: contain logic, transparent canvas)
  const renderFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return false;

    const ctx = canvas.getContext("2d");
    if (!ctx) return false;

    const img = imagesRef.current[frameIndex];
    if (!img || !img.complete || img.naturalWidth === 0) return false;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    // Clear completely with zero black background bars
    ctx.clearRect(0, 0, cw, ch);

    // object-fit: contain calculation
    const hRatio = cw / iw;
    const vRatio = ch / ih;
    const ratio = Math.min(hRatio, vRatio);

    const drawW = iw * ratio;
    const drawH = ih * ratio;
    const offsetX = (cw - drawW) / 2;
    const offsetY = (ch - drawH) / 2;

    ctx.drawImage(img, 0, 0, iw, ih, offsetX, offsetY, drawW, drawH);
    currentFrameIndexRef.current = frameIndex;
    return true;
  }, []);

  // Lock scroll until the intro video has handed off to the first canvas frame.
  useEffect(() => {
    if (isReducedMotion || !isIntroVideoVisible) {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const preventScroll = (e: Event) => {
      e.preventDefault();
    };

    const preventKeyScroll = (e: KeyboardEvent) => {
      const keys = ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Space", " "];
      if (keys.includes(e.key)) {
        e.preventDefault();
      }
    };

    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });
    window.addEventListener("keydown", preventKeyScroll, { passive: false });

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      window.removeEventListener("keydown", preventKeyScroll);
    };
  }, [isIntroVideoVisible, isReducedMotion]);

  // 2. Resize canvas for high DPI displays
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);

    renderFrame(currentFrameIndexRef.current);
  }, [renderFrame]);

  // 3. Preload all frame images into memory
  useEffect(() => {
    const prefersReduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      setIsReducedMotion(true);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    let loadedCount = 0;
    const frameImages: HTMLImageElement[] = [];
    imagesRef.current = frameImages;

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new window.Image();
      img.src = getFrameUrl(i);
      if (i === 1) {
        img.decoding = "sync";
        img.fetchPriority = "high";
      }

      const handleImageLoad = () => {
        if (!isMounted) return;
        loadedCount++;
        setLoadProgress(Math.floor((loadedCount / TOTAL_FRAMES) * 100));

        if (loadedCount === TOTAL_FRAMES) {
          imagesRef.current = frameImages;
          setIsLoading(false);
        }
      };

      img.onload = handleImageLoad;
      img.onerror = handleImageLoad;
      frameImages.push(img);
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const completeVideoHandoff = useCallback(() => {
    if (handoffCompletedRef.current) return;

    resizeCanvas();
    const didDrawFirstFrame = renderFrame(0);

    if (!didDrawFirstFrame) {
      const firstFrame = imagesRef.current[0];
      if (firstFrame) {
        firstFrame.addEventListener("load", completeVideoHandoff, { once: true });
      }
      return;
    }

    handoffCompletedRef.current = true;

    requestAnimationFrame(() => {
      const video = heroVideoRef.current;
      if (video) {
        video.pause();
      }
      setIsIntroVideoVisible(false);
    });
  }, [renderFrame, resizeCanvas]);

  // 4. Initialize GSAP ScrollTrigger after preloading finishes
  useEffect(() => {
    if (isLoading || isReducedMotion || isIntroVideoVisible) return;

    resizeCanvas();
    renderFrame(0);

    const handleWindowResize = () => {
      resizeCanvas();
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleWindowResize);

    const ctx = gsap.context(() => {
      if (
        !containerRef.current ||
        !pinTargetRef.current ||
        !canvasWrapperRef.current ||
        !contentWrapperRef.current
      )
        return;

      // Master ScrollTrigger timeline pinned in viewport
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          pin: pinTargetRef.current,
          start: "top top",
          end: `+=${PIN_DISTANCE}`,
          scrub: SCROLL_SCRUB,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self: ScrollTrigger) => {
            const progress = self.progress;
            const targetFrame = Math.min(
              TOTAL_FRAMES - 1,
              Math.max(0, Math.floor(progress * (TOTAL_FRAMES - 1)))
            );

            // Only redraw canvas when frame index actually changes (0 waste)
            if (targetFrame !== currentFrameIndexRef.current) {
              renderFrame(targetFrame);
            }
          },
        },
      });

      // Character translates left-to-right on scroll scrub
      tl.fromTo(
        canvasWrapperRef.current,
        {
          xPercent: -20,
          scale: 0.95,
        },
        {
          xPercent: 12,
          scale: 1.02,
          ease: "none",
        },
        0
      );

      // Section Content enters from the opposite side (right-to-left) in exact lockstep
      tl.fromTo(
        contentWrapperRef.current,
        {
          xPercent: 25,
          opacity: 0,
        },
        {
          xPercent: 0,
          opacity: 1,
          ease: "none",
        },
        0
      );
    }, containerRef);

    animationContextRef.current = ctx;

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    return () => {
      clearTimeout(refreshTimer);
      window.removeEventListener("resize", handleWindowResize);
      ctx.revert();
    };
  }, [isIntroVideoVisible, isLoading, isReducedMotion, renderFrame, resizeCanvas]);

  // Reduced motion / Fallback static render
  if (isReducedMotion) {
    return (
      <div className="relative w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center py-12 px-4">
        <div className="relative w-full aspect-[16/10] max-h-[480px]">
          <Image
            src={getFrameUrl(TOTAL_FRAMES)}
            alt="AMO Arrival"
            fill
            sizes="(min-width: 1024px) 50vw, calc(100vw - 32px)"
            className="object-contain drop-shadow-2xl"
            priority
          />
        </div>
        <div className="space-y-6 text-center lg:text-left">
          <p className="text-2xl sm:text-3xl font-bold text-content-primary italic leading-snug">
            &ldquo;Oh... you&apos;re here. I&apos;m AMO. And apparently, I&apos;m supposed to show you what we do.&rdquo;
          </p>
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
            <Link
              href="/services"
              className="px-6 py-3 rounded-lg bg-surface-muted text-content-primary font-medium hover:bg-surface-muted/80 border border-border-subtle transition-all text-sm"
            >
              See what AMO can do
            </Link>
            <Link
              href="/contact?source=scene-01"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-brand-primary text-surface-base font-medium hover:bg-brand-primary/90 shadow-card transition-all text-sm"
            >
              <span>Start a project</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ minHeight: `${PIN_DISTANCE + 400}px` }}
    >
      {/* Pinned Viewport Container */}
      <div
        ref={pinTargetRef}
        className="w-full h-screen flex flex-col justify-center items-center overflow-hidden px-4 sm:px-6 lg:px-8"
      >
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div
            ref={canvasWrapperRef}
            className="relative w-full aspect-[16/10] max-h-[460px] flex items-center justify-center bg-transparent"
          >
            <video
              ref={heroVideoRef}
              src="/video.mp4"
              autoPlay
              muted
              playsInline
              preload="auto"
              onEnded={completeVideoHandoff}
              className={[
                "absolute inset-0 z-0 w-full h-full object-contain bg-transparent drop-shadow-2xl",
                isIntroVideoVisible ? "pointer-events-auto" : "pointer-events-none",
              ].join(" ")}
            />
            <canvas
              ref={canvasRef}
              className={[
                "absolute inset-0 z-10 w-full h-full object-contain bg-transparent drop-shadow-2xl",
                isIntroVideoVisible ? "opacity-0" : "opacity-100",
              ].join(" ")}
            />
            {isLoading && !isIntroVideoVisible ? (
              <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3 rounded-full border border-border-subtle bg-surface-elevated/80 px-4 py-2 text-xs font-mono text-brand-secondary backdrop-blur-md">
                <Loader2 className="w-4 h-4 animate-spin text-brand-primary" />
                <span>{loadProgress}%</span>
              </div>
            ) : null}
          </div>

          <div
            ref={contentWrapperRef}
            className={[
              "space-y-6 text-center lg:text-left",
              isIntroVideoVisible ? "opacity-0" : "",
            ].join(" ")}
          >
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-content-primary italic leading-tight">
              &ldquo;Oh... you&apos;re here. I&apos;m AMO. And apparently, I&apos;m supposed to show you what we do.&rdquo;
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/services"
                className="px-6 py-3 rounded-lg bg-surface-muted text-content-primary hover:bg-surface-muted/80 border border-border-subtle transition-all text-sm font-semibold"
              >
                See what AMO can do
              </Link>
              <Link
                href="/contact?source=scene-01"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-brand-primary text-surface-base hover:bg-brand-primary/90 shadow-card transition-all text-sm font-semibold"
              >
                <span>Start a project</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
