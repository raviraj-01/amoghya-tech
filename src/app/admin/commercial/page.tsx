"use client";

import { useState } from "react";
import { DollarSign, Calendar, Users, Sliders, CheckCircle2, ChevronRight } from "lucide-react";
import { LeadStatus } from "@/types";

const COMMERCIAL_TABS = ["Leads Pipeline", "Studio Availability & Bookings", "Package Pricing Rules"];

const ALL_STATUSES: LeadStatus[] = [
  "New",
  "Contacted",
  "Qualified",
  "Discovery Scheduled",
  "Proposal Sent",
  "Negotiation",
  "Won",
  "Lost",
  "Nurture",
  "Spam",
];

const INITIAL_LEADS = [
  { id: "L-101", name: "Sarah Jenkins", email: "sarah@apexrobotics.io", company: "Apex Robotics", budget: "₹8,00,000", status: "New" as LeadStatus },
  { id: "L-102", name: "Rahul Sharma", email: "rahul@kavyafoods.in", company: "Kavya Foods", budget: "₹4,50,000", status: "Qualified" as LeadStatus },
  { id: "L-103", name: "David Chen", email: "david@synapse.ai", company: "Synapse AI", budget: "₹12,00,000", status: "Proposal Sent" as LeadStatus },
  { id: "L-104", name: "Ananya Roy", email: "ananya@royfashion.com", company: "Roy Studio", budget: "₹2,50,000", status: "Won" as LeadStatus },
];

export default function AdminCommercialPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [leads, setLeads] = useState(INITIAL_LEADS);

  const updateLeadStatus = (id: string, newStatus: LeadStatus) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
    );
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <span className="text-xs font-mono font-bold text-brand-secondary uppercase">
          Admin Control Center (PRD §12)
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-content-primary mt-1">
          Commercial Operations & CRM
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border-subtle pb-3">
        {COMMERCIAL_TABS.map((tab, idx) => (
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

      {/* Tab 1: Leads Pipeline */}
      {activeTab === 0 && (
        <div className="p-6 rounded-2xl bg-surface-elevated border border-border-subtle shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-content-primary">
              Lead Lifecycle Management (PRD §11)
            </h2>
            <span className="text-xs font-mono text-content-muted">
              {leads.length} Total Leads
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border-subtle text-content-muted uppercase">
                  <th className="pb-3 font-semibold">Contact / Company</th>
                  <th className="pb-3 font-semibold">Budget</th>
                  <th className="pb-3 font-semibold">Status (PRD §11)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {leads.map((lead) => (
                  <tr key={lead.id} className="py-3">
                    <td className="py-3 font-medium">
                      <span className="font-bold text-content-primary block">{lead.name}</span>
                      <span className="text-content-secondary">{lead.company} • {lead.email}</span>
                    </td>
                    <td className="py-3 font-mono text-content-primary">{lead.budget}</td>
                    <td className="py-3">
                      <select
                        value={lead.status}
                        onChange={(e) => updateLeadStatus(lead.id, e.target.value as LeadStatus)}
                        className="px-2.5 py-1 rounded bg-surface-muted border border-border-subtle text-xs font-semibold text-content-primary focus:outline-none focus:border-brand-primary"
                      >
                        {ALL_STATUSES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Studio Bookings & Availability */}
      {activeTab === 1 && (
        <div className="p-6 rounded-2xl bg-surface-elevated border border-border-subtle shadow-subtle space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-content-primary">
              Studio Availability & Operational Policy (PRD §8)
            </h3>
            <span className="text-xs text-status-success font-semibold">
              Live Calendar Sync Active (.ICS)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-surface-muted space-y-2">
              <span className="font-bold text-content-primary block">Operating Hours</span>
              <p className="text-content-secondary">08:00 AM – 10:00 PM (Daily)</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-muted space-y-2">
              <span className="font-bold text-content-primary block">Min. Lead Time</span>
              <p className="text-content-secondary">24 Hours Advance Notice</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-muted space-y-2">
              <span className="font-bold text-content-primary block">Deposit Requirement</span>
              <p className="text-content-secondary">30% Online or Offline</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Package Rules */}
      {activeTab === 2 && (
        <div className="p-6 rounded-2xl bg-surface-elevated border border-border-subtle shadow-subtle space-y-4">
          <h3 className="text-sm font-bold text-content-primary">
            Package Builder Estimator Rules (PRD §9)
          </h3>
          <p className="text-xs text-content-secondary leading-relaxed">
            Multipliers for Starter (1.0x), Growth (1.6x), and Scale (2.5x) are active across all 8 package groups.
          </p>
        </div>
      )}
    </div>
  );
}
