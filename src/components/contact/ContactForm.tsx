"use client";

import { ArrowRight } from "lucide-react";

const PROJECT_TYPES = [
  "Brand Identity",
  "Website / Digital Experience",
  "Product Engineering / MVP",
  "AI & Workflow Automation",
  "Studio Production",
  "Integrated Multi-Disciplinary",
];

export function ContactForm() {
  return (
    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-semibold text-content-primary uppercase tracking-wider mb-2">
            Full Name *
          </label>
          <input
            type="text"
            placeholder="Jane Doe"
            className="w-full px-4 py-2.5 rounded-lg bg-surface-muted border border-border-subtle text-sm text-content-primary focus:outline-none focus:border-brand-primary"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-content-primary uppercase tracking-wider mb-2">
            Work Email *
          </label>
          <input
            type="email"
            placeholder="jane@company.com"
            className="w-full px-4 py-2.5 rounded-lg bg-surface-muted border border-border-subtle text-sm text-content-primary focus:outline-none focus:border-brand-primary"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-semibold text-content-primary uppercase tracking-wider mb-2">
            Company / Organization *
          </label>
          <input
            type="text"
            placeholder="Acme Corp"
            className="w-full px-4 py-2.5 rounded-lg bg-surface-muted border border-border-subtle text-sm text-content-primary focus:outline-none focus:border-brand-primary"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-content-primary uppercase tracking-wider mb-2">
            Phone (Optional)
          </label>
          <input
            type="tel"
            placeholder="+91 98765 43210"
            className="w-full px-4 py-2.5 rounded-lg bg-surface-muted border border-border-subtle text-sm text-content-primary focus:outline-none focus:border-brand-primary"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-content-primary uppercase tracking-wider mb-2">
          Project Type *
        </label>
        <select
          className="w-full px-4 py-2.5 rounded-lg bg-surface-muted border border-border-subtle text-sm text-content-primary focus:outline-none focus:border-brand-primary"
          defaultValue=""
          required
        >
          <option value="" disabled>Select project category...</option>
          {PROJECT_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-semibold text-content-primary uppercase tracking-wider mb-2">
            Target Timeline
          </label>
          <input
            type="text"
            placeholder="e.g. 6–8 weeks"
            className="w-full px-4 py-2.5 rounded-lg bg-surface-muted border border-border-subtle text-sm text-content-primary focus:outline-none focus:border-brand-primary"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-content-primary uppercase tracking-wider mb-2">
          Project Brief & Requirements *
        </label>
        <textarea
          rows={4}
          placeholder="Describe your current state, desired outcome, and key milestones..."
          className="w-full px-4 py-2.5 rounded-lg bg-surface-muted border border-border-subtle text-sm text-content-primary focus:outline-none focus:border-brand-primary"
          required
        />
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" id="consent" className="rounded border-border-subtle" required />
        <label htmlFor="consent" className="text-xs text-content-secondary">
          I agree to the privacy policy and consent to being contacted regarding this inquiry.
        </label>
      </div>

      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-brand-primary text-surface-base text-sm font-semibold hover:bg-brand-primary/90 shadow-card transition-all"
      >
        <span>Submit Project Inquiry</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
}
