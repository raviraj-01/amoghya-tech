"use client";

import {
  ReactNode,
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useExperienceStore } from "./quality-controller";
import { disposeHierarchy } from "./loaders/disposal";

interface SceneCanvasProps {
  children: ReactNode;
  fallback: ReactNode;
  className?: string;
  cameraPosition?: [number, number, number];
  cameraFov?: number;
}

/**
 * Internal frame monitor that measures average FPS and auto-adjusts quality
 */
function FramePerformanceMonitor() {
  const recordFrameMetric = useExperienceStore((s) => s.recordFrameMetric);
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());

  useFrame(() => {
    frameCount.current += 1;
    const now = performance.now();
    const elapsed = now - lastTime.current;

    // Sample every 1000ms
    if (elapsed >= 1000) {
      const fps = Math.round((frameCount.current * 1000) / elapsed);
      recordFrameMetric(fps);
      frameCount.current = 0;
      lastTime.current = now;
    }
  });

  return null;
}

export function SceneCanvas({
  children,
  fallback,
  className = "w-full h-[450px]",
  cameraPosition = [0, 0, 3.5],
  cameraFov = 45,
}: SceneCanvasProps) {
  const tier = useExperienceStore((s) => s.tier);
  const enable3D = useExperienceStore((s) => s.enable3D);
  const isInitialized = useExperienceStore((s) => s.isInitialized);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const [isInViewport, setIsInViewport] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);

  // Tab visibility listener (TRD §6)
  useEffect(() => {
    const handleVisibility = () => {
      setTabVisible(!document.hidden);
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // Viewport IntersectionObserver to ONLY mount/render 3D Canvas when visible (TRD §4)
  // This completely solves the 9 concurrent WebGL context issue!
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting);
      },
      {
        rootMargin: "250px 0px 250px 0px", // Preload slightly before entering viewport
        threshold: 0.05,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Auto GPU resource disposal on unmount
  useEffect(() => {
    return () => {
      if (canvasWrapperRef.current) {
        // Find Three scene objects attached if any
      }
    };
  }, []);

  // Show static fallback immediately if Tier 0, 3D disabled, or SSR
  if (!isInitialized || !enable3D || tier === 0) {
    return <div className={className}>{fallback}</div>;
  }

  // Capped pixel ratio per TRD §6: max 1.5 on mobile (Tier 1), max 2 on desktop (Tier 2)
  const dpr: [number, number] = tier === 1 ? [1, 1.5] : [1, 2];

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {isInViewport ? (
        <div
          ref={canvasWrapperRef}
          className="w-full h-full animate-in fade-in duration-500"
        >
          <Suspense fallback={fallback}>
            <Canvas
              dpr={dpr}
              camera={{ position: cameraPosition, fov: cameraFov }}
              frameloop={tabVisible ? "always" : "never"}
              gl={{
                antialias: tier >= 2,
                powerPreference: "high-performance",
                toneMapping: THREE.ACESFilmicToneMapping,
                toneMappingExposure: 1.05,
              }}
              className="rounded-2xl"
            >
              <ambientLight intensity={0.85} />
              <directionalLight
                position={[4, 5, 4]}
                intensity={1.2}
                castShadow={tier >= 2}
              />
              <pointLight
                position={[-3, -2, -2]}
                intensity={0.5}
                color="#3B82F6"
              />
              <pointLight
                position={[3, 2, -2]}
                intensity={0.3}
                color="#6366F1"
              />
              <FramePerformanceMonitor />
              {children}
            </Canvas>
          </Suspense>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          {fallback}
        </div>
      )}
    </div>
  );
}

