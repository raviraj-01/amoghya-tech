"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  Calendar,
  DollarSign,
  Activity,
  ArrowUpRight,
  Shield,
  FileText,
  Bot,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { AdminRole } from "@/types";

const ROLES: AdminRole[] = [
  "Super Admin",
  "Administrator",
  "Content Editor",
  "Sales/Business Dev",
  "Studio Manager",
  "Marketing Manager",
  "Analyst/Viewer",
];

const RECENT_LEADS = [
  { id: "L-101", name: "Sarah Jenkins", company: "Apex Robotics", service: "Product MVP", status: "New", date: "Today" },
  { id: "L-102", name: "Rahul Sharma", company: "Kavya Foods", service: "Brand & Web Launch", status: "Qualified", date: "Yesterday" },
  { id: "L-103", name: "David Chen", company: "Synapse AI", service: "Automation Sprint", status: "Proposal Sent", date: "2 days ago" },
];

const UPCOMING_BOOKINGS = [
  { id: "B-501", client: "Elena Rostova", format: "Podcast Recording", date: "2026-09-02", duration: "4 hrs", status: "Confirmed" },
  { id: "B-502", client: "Vikram Mehta", format: "Product Shoot", date: "2026-09-05", duration: "8 hrs", status: "Deposit Received" },
];

export default function AdminDashboardPage() {
  const [activeRole, setActiveRole] = useState<AdminRole>("Super Admin");

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Top Header with Role Switcher Simulation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-subtle">
        <div>
          <span className="text-xs font-mono font-bold text-brand-secondary uppercase">
            Admin Control Center (PRD §12)
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-content-primary mt-1">
            Operations & Commercial Dashboard
          </h1>
        </div>

        {/* Role Simulator */}
        <div className="flex items-center gap-2 bg-surface-elevated p-2 rounded-xl border border-border-subtle shadow-subtle">
          <Shield className="w-4 h-4 text-brand-primary" />
          <span className="text-xs text-content-muted">Role:</span>
          <select
            value={activeRole}
            onChange={(e) => setActiveRole(e.target.value as AdminRole)}
            className="text-xs font-bold text-content-primary bg-surface-muted px-2.5 py-1 rounded-md border-0 focus:ring-1 focus:ring-brand-primary"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-surface-elevated border border-border-subtle shadow-subtle space-y-2">
          <div className="flex items-center justify-between text-xs text-content-muted">
            <span className="font-semibold uppercase tracking-wider">Active Leads</span>
            <Users className="w-4 h-4 text-brand-secondary" />
          </div>
          <p className="text-2xl font-bold text-content-primary">14</p>
          <span className="text-[11px] text-status-success font-semibold flex items-center gap-1">
            +3 new this week
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-surface-elevated border border-border-subtle shadow-subtle space-y-2">
          <div className="flex items-center justify-between text-xs text-content-muted">
            <span className="font-semibold uppercase tracking-wider">Studio Bookings</span>
            <Calendar className="w-4 h-4 text-brand-highlight" />
          </div>
          <p className="text-2xl font-bold text-content-primary">6</p>
          <span className="text-[11px] text-content-secondary">
            Next: Sep 2 (Podcast)
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-surface-elevated border border-border-subtle shadow-subtle space-y-2">
          <div className="flex items-center justify-between text-xs text-content-muted">
            <span className="font-semibold uppercase tracking-wider">Package Proposals</span>
            <DollarSign className="w-4 h-4 text-status-success" />
          </div>
          <p className="text-2xl font-bold text-content-primary">9</p>
          <span className="text-[11px] text-content-secondary">
            ₹18.4L Pipeline Value
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-surface-elevated border border-border-subtle shadow-subtle space-y-2">
          <div className="flex items-center justify-between text-xs text-content-muted">
            <span className="font-semibold uppercase tracking-wider">Conversion Rate</span>
            <Activity className="w-4 h-4 text-brand-accent" />
          </div>
          <p className="text-2xl font-bold text-content-primary">24.8%</p>
          <span className="text-[11px] text-status-success font-semibold">
            Healthy lead conversion
          </span>
        </div>
      </div>

      {/* Quick Access Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Inquiries & Lead Pipeline */}
        <div className="p-6 rounded-2xl bg-surface-elevated border border-border-subtle shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-content-primary flex items-center gap-2">
              <Users className="w-4 h-4 text-brand-primary" />
              <span>Recent Inquiries (PRD §11)</span>
            </h2>
            <Link
              href="/admin/commercial"
              className="text-xs font-semibold text-brand-primary hover:text-brand-secondary flex items-center gap-1"
            >
              <span>View All Leads</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-border-subtle">
            {RECENT_LEADS.map((lead) => (
              <div key={lead.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-content-primary block">{lead.name} ({lead.company})</span>
                  <span className="text-content-muted">{lead.service} • {lead.date}</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-surface-muted text-content-primary font-mono font-semibold">
                  {lead.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Studio Pipeline */}
        <div className="p-6 rounded-2xl bg-surface-elevated border border-border-subtle shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-content-primary flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-highlight" />
              <span>Upcoming Studio Sessions (PRD §8)</span>
            </h2>
            <Link
              href="/admin/commercial"
              className="text-xs font-semibold text-brand-primary hover:text-brand-secondary flex items-center gap-1"
            >
              <span>Manage Bookings</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-border-subtle">
            {UPCOMING_BOOKINGS.map((b) => (
              <div key={b.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-content-primary block">{b.client} — {b.format}</span>
                  <span className="text-content-muted">{b.date} ({b.duration})</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-brand-secondary/10 text-brand-secondary font-semibold">
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
