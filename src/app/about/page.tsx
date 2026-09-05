import Link from "next/link";
import { Sparkles, ArrowRight, Compass, ShieldCheck, Zap } from "lucide-react";

export const metadata = {
  title: "About Us & AMO | Vyara Amogya Technologies",
  description: "Learn about Vyara Amogya Technologies, our operating model, and our hero character AMO.",
};

export default function AboutPage() {
  return (
    <div className="py-16 sm:py-24 max-w-container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-muted border border-border-subtle text-xs font-mono text-content-secondary mb-4">
          <Sparkles className="w-3.5 h-3.5 text-brand-secondary" />
          <span>Company & Identity (PRD §5)</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-content-primary">
          About Vyara Amogya
        </h1>
        <p className="mt-4 text-lg text-content-secondary leading-relaxed">
          We combine brand storytelling, software engineering, intelligent systems, and studio content production into one unified delivery engine.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="p-8 rounded-2xl bg-surface-elevated border border-border-subtle shadow-subtle space-y-3">
          <div className="w-10 h-10 rounded-lg bg-surface-muted flex items-center justify-center text-brand-primary">
            <Compass className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-content-primary">Think Clearly</h2>
          <p className="text-xs text-content-secondary leading-relaxed">
            Rigorous digital strategy, user research, and technical roadmapping before writing a single line of code.
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-surface-elevated border border-border-subtle shadow-subtle space-y-3">
          <div className="w-10 h-10 rounded-lg bg-surface-muted flex items-center justify-center text-brand-secondary">
            <Zap className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-content-primary">Build Beautifully</h2>
          <p className="text-xs text-content-secondary leading-relaxed">
            High-performance web architecture, fluid motion, interactive 3D, and production-grade software craftsmanship.
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-surface-elevated border border-border-subtle shadow-subtle space-y-3">
          <div className="w-10 h-10 rounded-lg bg-surface-muted flex items-center justify-center text-brand-accent">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-content-primary">Grow Intelligently</h2>
          <p className="text-xs text-content-secondary leading-relaxed">
            Business automation, CRM workflows, lifecycle marketing, and ongoing operations to scale predictably.
          </p>
        </div>
      </div>

      {/* Hero Character AMO note */}
      <div className="p-8 rounded-2xl bg-surface-dark text-text-inverted space-y-4">
        <h2 className="text-xl font-bold">Meet AMO</h2>
        <p className="text-sm text-text-invertedMuted leading-relaxed max-w-2xl">
          AMO is our interactive brand navigator — guiding visitors through our universe of capabilities, from digital design and automated workflows to physical studio production.
        </p>
      </div>
    </div>
  );
}
