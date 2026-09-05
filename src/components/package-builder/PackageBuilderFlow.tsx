"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sliders,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Layers,
  FileCheck,
  Send,
  Calendar,
} from "lucide-react";

const PACKAGE_GOALS = [
  { id: "brand-launch", name: "Brand Launch", desc: "Identity, naming, guidelines, and launch creative", base: 120000 },
  { id: "website-launch", name: "Website Launch", desc: "Custom Next.js WebGL / CMS digital experience", base: 180000 },
  { id: "digital-growth", name: "Digital Growth", desc: "Paid acquisition, SEO, conversion funnel optimization", base: 95000 },
  { id: "product-mvp", name: "Product MVP", desc: "Full-stack SaaS / mobile app design & engineering", base: 350000 },
  { id: "automation-sprint", name: "Automation Sprint", desc: "AI assistants, CRM routing, operational workflows", base: 140000 },
  { id: "content-engine", name: "Content Engine", desc: "Video retainers, 3D motion, photography production", base: 110000 },
  { id: "studio-production", name: "Studio Production", desc: "Dedicated filming sessions, podcast series capture", base: 85000 },
  { id: "custom-build", name: "Custom Build", desc: "Tailored multi-disciplinary scope", base: 200000 },
];

const SCALES = [
  { id: "starter", name: "Starter", multiplier: 1.0, desc: "Lean scope, fast turnaround for small teams / MVPs" },
  { id: "growth", name: "Growth (★ Most Popular)", multiplier: 1.6, desc: "Bespoke design, deep integrations, scalable architecture" },
  { id: "scale", name: "Scale / Enterprise", multiplier: 2.5, desc: "Multi-system, high compliance, advanced performance" },
  { id: "custom", name: "Custom Scale", multiplier: 1.8, desc: "Hybrid engagement with dedicated squad" },
];

const AVAILABLE_MODULES = [
  { id: "strategy", name: "Strategic Direction & Discovery", price: 40000 },
  { id: "uiux", name: "Interactive 3D / WebGL Layer", price: 65000 },
  { id: "cms", name: "Headless CMS & Operations Panel", price: 45000 },
  { id: "ai", name: "AI Assistant & Workflow Pipelines", price: 60000 },
  { id: "seo", name: "Full Technical SEO & Performance Gate", price: 30000 },
  { id: "studio-session", name: "Full-Day Studio Session Included", price: 45000 },
  { id: "ongoing-care", name: "Quarterly Support & Iteration Retainer", price: 50000 },
];

export function PackageBuilderFlow() {
  const [step, setStep] = useState(1);
  const [selectedGoal, setSelectedGoal] = useState(PACKAGE_GOALS[0].id);
  const [selectedScale, setSelectedScale] = useState(SCALES[1].id);
  const [selectedModules, setSelectedModules] = useState<string[]>(["strategy", "uiux"]);
  const [constraints, setConstraints] = useState({
    timeline: "6–8 weeks",
    budgetRange: "₹3,00,000 – ₹6,00,000",
    industry: "Technology / SaaS",
  });
  const [contactInfo, setContactInfo] = useState({
    name: "",
    email: "",
    company: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const currentGoal = PACKAGE_GOALS.find((g) => g.id === selectedGoal) || PACKAGE_GOALS[0];
  const currentScale = SCALES.find((s) => s.id === selectedScale) || SCALES[1];

  const modulesCost = selectedModules.reduce((acc, mId) => {
    const mod = AVAILABLE_MODULES.find((m) => m.id === mId);
    return acc + (mod ? mod.price : 0);
  }, 0);

  const baseCalculated = Math.round(currentGoal.base * currentScale.multiplier + modulesCost);
  const lowerEstimate = Math.round(baseCalculated * 0.9);
  const upperEstimate = Math.round(baseCalculated * 1.15);

  const toggleModule = (id: string) => {
    setSelectedModules((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const handleSubmitLead = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setStep(6);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 sm:p-10 rounded-3xl bg-surface-elevated border border-border-subtle shadow-card">
      {/* Progress header */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-mono text-content-muted mb-2">
          <span>Step {step} of 6</span>
          <span>
            {step === 1 && "Select Primary Goal"}
            {step === 2 && "Scale & Scope"}
            {step === 3 && "Capability Modules"}
            {step === 4 && "Constraints"}
            {step === 5 && "Estimate & Breakdown"}
            {step === 6 && "Proposal Request"}
          </span>
        </div>
        <div className="w-full bg-surface-muted h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-brand-primary h-full transition-all duration-default"
            style={{ width: `${(step / 6) * 100}%` }}
          />
        </div>
      </div>

      {/* Step 1: Goal */}
      {step === 1 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-content-primary">
            1. What is your primary objective?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PACKAGE_GOALS.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setSelectedGoal(g.id)}
                className={`p-4 rounded-xl text-left border transition-all ${
                  selectedGoal === g.id
                    ? "border-brand-primary bg-surface-muted ring-1 ring-brand-primary"
                    : "border-border-subtle hover:border-brand-primary/40 bg-surface-base"
                }`}
              >
                <span className="text-sm font-bold text-content-primary block">{g.name}</span>
                <span className="text-xs text-content-secondary mt-1 block">{g.desc}</span>
              </button>
            ))}
          </div>
          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-brand-primary text-surface-base text-sm font-medium hover:bg-brand-primary/90"
            >
              <span>Next: Scale & Scope</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Scale */}
      {step === 2 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-content-primary">
            2. Select Project Scale
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {SCALES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedScale(s.id)}
                className={`p-4 rounded-xl text-left border transition-all ${
                  selectedScale === s.id
                    ? "border-brand-primary bg-surface-muted ring-1 ring-brand-primary"
                    : "border-border-subtle hover:border-brand-primary/40 bg-surface-base"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-content-primary">{s.name}</span>
                </div>
                <span className="text-xs text-content-secondary mt-1 block">{s.desc}</span>
              </button>
            ))}
          </div>
          <div className="pt-4 flex justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-surface-muted text-content-primary text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-brand-primary text-surface-base text-sm font-medium hover:bg-brand-primary/90"
            >
              <span>Next: Add Modules</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Modules */}
      {step === 3 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-content-primary">
            3. Choose Capability Modules
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {AVAILABLE_MODULES.map((mod) => {
              const active = selectedModules.includes(mod.id);
              return (
                <button
                  key={mod.id}
                  type="button"
                  onClick={() => toggleModule(mod.id)}
                  className={`p-3.5 rounded-xl text-left border flex items-center justify-between transition-all ${
                    active
                      ? "border-brand-secondary bg-surface-muted ring-1 ring-brand-secondary"
                      : "border-border-subtle hover:border-brand-primary/40 bg-surface-base"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center ${
                        active ? "bg-brand-secondary border-brand-secondary text-surface-base" : "border-border-subtle"
                      }`}
                    >
                      {active && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <span className="text-xs font-semibold text-content-primary">{mod.name}</span>
                  </div>
                  <span className="text-xs font-mono text-content-secondary">+₹{mod.price.toLocaleString()}</span>
                </button>
              );
            })}
          </div>
          <div className="pt-4 flex justify-between">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-surface-muted text-content-primary text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => setStep(4)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-brand-primary text-surface-base text-sm font-medium hover:bg-brand-primary/90"
            >
              <span>Next: Constraints</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Constraints */}
      {step === 4 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-content-primary">
            4. Timeline, Budget & Industry
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-content-primary uppercase mb-1">
                Target Timeline
              </label>
              <select
                value={constraints.timeline}
                onChange={(e) => setConstraints({ ...constraints, timeline: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg bg-surface-muted border border-border-subtle text-xs text-content-primary"
              >
                <option value="Sprint (3–4 weeks)">Sprint (3–4 weeks)</option>
                <option value="Standard (6–8 weeks)">Standard (6–8 weeks)</option>
                <option value="Comprehensive (10–14 weeks)">Comprehensive (10–14 weeks)</option>
                <option value="Flexible / Retainer">Flexible / Retainer</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-content-primary uppercase mb-1">
                Industry / Sector
              </label>
              <input
                type="text"
                value={constraints.industry}
                onChange={(e) => setConstraints({ ...constraints, industry: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg bg-surface-muted border border-border-subtle text-xs text-content-primary"
                placeholder="e.g. AI / FinTech / D2C / Healthcare"
              />
            </div>
          </div>
          <div className="pt-4 flex justify-between">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-surface-muted text-content-primary text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => setStep(5)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-brand-primary text-surface-base text-sm font-medium hover:bg-brand-primary/90"
            >
              <span>Next: View Estimate</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Estimate (Range/Fixed/Starting-From/Quote-Only modes per PRD §9) */}
      {step === 5 && (
        <form onSubmit={handleSubmitLead} className="space-y-6">
          <h2 className="text-xl font-bold text-content-primary">
            5. Indicative Package Estimate
          </h2>

          <div className="p-6 rounded-2xl bg-surface-muted border border-border-subtle space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
              <div>
                <span className="text-xs font-mono text-content-muted">Selected Configuration</span>
                <h3 className="text-base font-bold text-content-primary">
                  {currentGoal.name} — {currentScale.name}
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded bg-brand-secondary/10 text-brand-secondary text-[11px] font-bold uppercase">
                Range Mode
              </span>
            </div>

            <div className="py-2">
              <span className="text-xs text-content-secondary block">Indicative Cost Range</span>
              <p className="text-3xl font-bold text-brand-primary font-mono mt-1">
                ₹{lowerEstimate.toLocaleString()} – ₹{upperEstimate.toLocaleString()}
              </p>
              <span className="text-[11px] text-content-muted block mt-1">
                Starting from ₹{lowerEstimate.toLocaleString()} • Currency: INR (₹)
              </span>
            </div>

            <div className="text-xs text-content-secondary pt-2 border-t border-border-subtle space-y-1">
              <p><strong className="text-content-primary">Included Modules ({selectedModules.length}):</strong></p>
              {selectedModules.map((mId) => {
                const m = AVAILABLE_MODULES.find((mod) => mod.id === mId);
                return <p key={mId}>• {m?.name}</p>;
              })}
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-content-primary">
              Contact to Save & Request Full Proposal
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                required
                placeholder="Your Name *"
                value={contactInfo.name}
                onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                className="px-3 py-2 rounded-lg bg-surface-muted border border-border-subtle text-xs text-content-primary"
              />
              <input
                type="email"
                required
                placeholder="Work Email *"
                value={contactInfo.email}
                onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                className="px-3 py-2 rounded-lg bg-surface-muted border border-border-subtle text-xs text-content-primary"
              />
              <input
                type="text"
                placeholder="Company Name"
                value={contactInfo.company}
                onChange={(e) => setContactInfo({ ...contactInfo, company: e.target.value })}
                className="px-3 py-2 rounded-lg bg-surface-muted border border-border-subtle text-xs text-content-primary"
              />
            </div>
          </div>

          <p className="text-[11px] text-content-muted italic">
            * Disclaimer: Estimates are indicative and non-binding until confirmed in an official statement of work.
          </p>

          <div className="pt-4 flex justify-between">
            <button
              type="button"
              onClick={() => setStep(4)}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-surface-muted text-content-primary text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-brand-primary text-surface-base text-sm font-semibold hover:bg-brand-primary/90 shadow-card"
            >
              <span>Submit & Request Proposal</span>
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* Step 6: Confirmation & Next steps */}
      {step === 6 && (
        <div className="py-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-status-success/10 text-status-success flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold text-brand-secondary uppercase">
              Package Lead Captured (PRD §9)
            </span>
            <h2 className="text-2xl font-bold text-content-primary mt-1">
              Proposal Request Received
            </h2>
            <p className="text-sm text-content-secondary mt-2 max-w-md mx-auto">
              Our strategy team will prepare a formal scope document for {currentGoal.name} ({currentScale.name}).
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/contact?source=package-completed"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-primary text-surface-base text-xs font-semibold hover:bg-brand-primary/90"
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule Discovery Call</span>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-surface-muted text-content-primary text-xs font-semibold hover:bg-surface-muted/80"
            >
              <span>Return to Home</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
