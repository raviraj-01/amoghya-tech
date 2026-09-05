"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useExperienceStore } from "@/three/quality-controller";
import { Box, Volume2, VolumeX, EyeOff } from "lucide-react";

export function ExperienceControls() {
  const pathname = usePathname();
  const enable3D = useExperienceStore((s) => s.enable3D);
  const enableSound = useExperienceStore((s) => s.enableSound);
  const isInitialized = useExperienceStore((s) => s.isInitialized);
  const initialize = useExperienceStore((s) => s.initialize);
  const toggle3D = useExperienceStore((s) => s.toggle3D);
  const toggleSound = useExperienceStore((s) => s.toggleSound);

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (!isInitialized || pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <div
      aria-label="Experience & Accessibility Controls"
      className="vat-hide-during-intro fixed bottom-6 left-6 z-40 flex items-center gap-2 bg-surface-elevated/90 backdrop-blur-md border border-border-subtle p-1.5 rounded-full shadow-card text-xs"
    >
      {/* 3D / Motion Toggle */}
      <button
        type="button"
        role="switch"
        aria-checked={enable3D}
        onClick={toggle3D}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium transition-all ${
          enable3D
            ? "bg-brand-primary text-surface-base shadow-subtle"
            : "bg-surface-muted text-content-secondary hover:text-content-primary"
        }`}
        title={enable3D ? "Disable 3D (Switch to Static Mode)" : "Enable 3D Experience"}
      >
        {enable3D ? (
          <Box className="w-3.5 h-3.5 text-brand-secondary" />
        ) : (
          <EyeOff className="w-3.5 h-3.5" />
        )}
        <span>{enable3D ? "3D" : "Static"}</span>
      </button>

      {/* Sound Toggle (Off by default per TRD §7) */}
      <button
        type="button"
        role="switch"
        aria-checked={enableSound}
        onClick={toggleSound}
        className={`p-1.5 rounded-full transition-colors ${
          enableSound
            ? "bg-brand-secondary text-surface-base"
            : "text-content-muted hover:text-content-primary hover:bg-surface-muted"
        }`}
        title={enableSound ? "Mute Ambient Sound" : "Enable Ambient Sound (Off by default)"}
      >
        {enableSound ? (
          <Volume2 className="w-4 h-4" />
        ) : (
          <VolumeX className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}
