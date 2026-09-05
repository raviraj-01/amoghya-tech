"use client";

import { useState } from "react";
import { FileText, Plus, CheckCircle2, Edit3, Trash2, Globe } from "lucide-react";

const CONTENT_TABS = ["Services (9 Groups)", "Case Studies", "Testimonials", "Page SEO & Redirects"];

const SERVICES_DATA = [
  { id: "1", name: "Strategy and Digital Direction", status: "Published", modified: "Today" },
  { id: "2", name: "Brand Identity and Creative Systems", status: "Published", modified: "Today" },
  { id: "3", name: "Websites and Digital Experiences", status: "Published", modified: "Today" },
  { id: "4", name: "Product Design and Engineering", status: "Published", modified: "Today" },
  { id: "5", name: "AI, Automation, and Business Systems", status: "Published", modified: "Today" },
  { id: "6", name: "Content, Motion, and Campaigns", status: "Published", modified: "Today" },
  { id: "7", name: "Marketing and Growth", status: "Published", modified: "Today" },
  { id: "8", name: "Studio Services", status: "Published", modified: "Today" },
  { id: "9", name: "Ongoing Support", status: "Published", modified: "Today" },
];

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <span className="text-xs font-mono font-bold text-brand-secondary uppercase">
          Admin Control Center (PRD §12)
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-content-primary mt-1">
          Content & SEO Management
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border-subtle pb-3">
        {CONTENT_TABS.map((tab, idx) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(idx)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === idx
                ? "bg-brand-primary text-surface-base shadow-subtle"
                : "bg-surface-elevated text-content-secondary hover:text-content-primary border border-border-subtle"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab 1: Services */}
      {activeTab === 0 && (
        <div className="p-6 rounded-2xl bg-surface-elevated border border-border-subtle shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-content-primary">
              All 9 Service Groups (Locked Taxonomy per PRD §7)
            </h2>
            <span className="text-xs font-mono text-content-muted">9 / 9 Groups Active</span>
          </div>

          <div className="divide-y divide-border-subtle">
            {SERVICES_DATA.map((srv) => (
              <div key={srv.id} className="py-3.5 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <span className="font-bold text-content-primary block">
                    {srv.id}. {srv.name}
                  </span>
                  <span className="text-content-muted">Last updated: {srv.modified}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-full bg-status-success/10 text-status-success font-semibold">
                    {srv.status}
                  </span>
                  <button type="button" className="p-1.5 rounded text-content-muted hover:text-brand-primary">
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Case Studies */}
      {activeTab === 1 && (
        <div className="p-8 rounded-2xl bg-surface-elevated border border-border-subtle shadow-subtle text-center space-y-4">
          <h3 className="text-base font-bold text-content-primary">Case Studies & Client Outcomes</h3>
          <p className="text-xs text-content-secondary max-w-md mx-auto">
            Create and edit client case studies with metrics, media galleries, testimonials, and category filters.
          </p>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-primary text-surface-base text-xs font-semibold"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Case Study</span>
          </button>
        </div>
      )}

      {/* Tab 3: Testimonials */}
      {activeTab === 2 && (
        <div className="p-8 rounded-2xl bg-surface-elevated border border-border-subtle shadow-subtle text-center space-y-4">
          <h3 className="text-base font-bold text-content-primary">Client Testimonials</h3>
          <p className="text-xs text-content-secondary max-w-md mx-auto">
            Manage verified client reviews and ratings displayed across homepage and case studies.
          </p>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-primary text-surface-base text-xs font-semibold"
          >
            <Plus className="w-4 h-4" />
            <span>Add Testimonial</span>
          </button>
        </div>
      )}

      {/* Tab 4: SEO & Redirects */}
      {activeTab === 3 && (
        <div className="p-6 rounded-2xl bg-surface-elevated border border-border-subtle shadow-subtle space-y-4">
          <h3 className="text-sm font-bold text-content-primary">
            Site-Wide Meta, JSON-LD Schema & Redirects
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-surface-muted space-y-2">
              <span className="font-bold text-content-primary block">Canonical Domain</span>
              <input
                type="text"
                defaultValue="https://vyaraamogya.com"
                className="w-full px-3 py-2 rounded bg-surface-elevated border border-border-subtle text-content-primary"
              />
            </div>
            <div className="p-4 rounded-xl bg-surface-muted space-y-2">
              <span className="font-bold text-content-primary block">Structured Schema</span>
              <span className="text-status-success font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Organization & Breadcrumbs Active
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
