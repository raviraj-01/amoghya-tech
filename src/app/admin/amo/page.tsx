"use client";

import { useState } from "react";
import { Bot, Save, Volume2, Box, Eye, CheckCircle2 } from "lucide-react";

const SCENES_COPY = [
  { num: "01", name: "Arrival", dialogue: "Oh... you're here. I'm AMO. And apparently, I'm supposed to show you what we do.", cta: "See what AMO can do · Start a project" },
  { num: "02", name: "Capability Reveal", dialogue: "I build things. I design things. I make things move. I help people notice things. And sometimes, I make machines do the boring stuff.", cta: "Explore Capabilities" },
  { num: "03", name: "The Vyara Amogya World", dialogue: "One team. Many capabilities. One coherent outcome.", cta: "Think clearly · Build beautifully · Grow intelligently" },
  { num: "04", name: "AMO in the Studio", dialogue: "This is where ideas become real.", cta: "Book the Studio" },
  { num: "05", name: "Technology and Intelligence", dialogue: "Good ideas need systems... I make technology feel less like technology.", cta: "Explore Tech" },
  { num: "06", name: "Services Deep Dive", dialogue: "Pending content design sign-off", cta: "View All 9 Groups" },
  { num: "07", name: "Selected Work", dialogue: "Pending content design sign-off", cta: "View All Work" },
  { num: "08", name: "Build Your Package", dialogue: "Pending content design sign-off", cta: "Configure Package" },
  { num: "09", name: "Closing / Contact", dialogue: "So... what are we building?", cta: "Start a Project · Book Studio · Build Package · Discovery Call" },
];

export default function AdminAMOPage() {
  const [soundDefault, setSoundDefault] = useState(false);
  const [enable3DDefault, setEnable3DDefault] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-brand-secondary uppercase">
            Admin Control Center (PRD §12)
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-content-primary mt-1">
            AMO Experience & Scene Controls
          </h1>
        </div>
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-primary text-surface-base text-xs font-semibold hover:bg-brand-primary/90 shadow-card"
        >
          <Save className="w-4 h-4" />
          <span>{saved ? "Saved Changes!" : "Save Controls"}</span>
        </button>
      </div>

      {/* Global AMO Settings */}
      <div className="p-6 rounded-2xl bg-surface-elevated border border-border-subtle shadow-subtle grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex items-center justify-between p-4 rounded-xl bg-surface-muted">
          <div>
            <span className="text-xs font-bold text-content-primary block">
              Default 3D Interactive Engine
            </span>
            <span className="text-[11px] text-content-secondary">
              Allow WebGL rendering if supported
            </span>
          </div>
          <input
            type="checkbox"
            checked={enable3DDefault}
            onChange={(e) => setEnable3DDefault(e.target.checked)}
            className="w-4 h-4 rounded text-brand-primary"
          />
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl bg-surface-muted">
          <div>
            <span className="text-xs font-bold text-content-primary block">
              Default Ambient Audio
            </span>
            <span className="text-[11px] text-content-secondary">
              Must remain OFF by default per TRD §7
            </span>
          </div>
          <input
            type="checkbox"
            checked={soundDefault}
            onChange={(e) => setSoundDefault(e.target.checked)}
            className="w-4 h-4 rounded text-brand-primary"
          />
        </div>
      </div>

      {/* Scene Copy Manager */}
      <div className="p-6 rounded-2xl bg-surface-elevated border border-border-subtle shadow-subtle space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-content-primary">
            Homepage 9-Scene Copy & Dialogue (PRD §6)
          </h2>
          <span className="text-xs font-mono text-content-muted">9 / 9 Scenes Active</span>
        </div>

        <div className="divide-y divide-border-subtle">
          {SCENES_COPY.map((scene) => (
            <div key={scene.num} className="py-4 space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold text-content-primary">
                <span>Scene {scene.num}: {scene.name}</span>
                <span className="text-content-muted font-mono font-normal">CTAs: {scene.cta}</span>
              </div>
              <textarea
                rows={2}
                defaultValue={scene.dialogue}
                className="w-full px-3 py-2 rounded-lg bg-surface-muted border border-border-subtle text-content-primary focus:outline-none focus:border-brand-primary"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
