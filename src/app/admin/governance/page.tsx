"use client";

import { useState } from "react";
import { KeyRound, ShieldCheck, Database, RefreshCw, CheckCircle2, Lock } from "lucide-react";
import { AdminRole } from "@/types";

const ROLES: { role: AdminRole; access: string; userCount: number }[] = [
  { role: "Super Admin", access: "Full system, security, integrations, users, billing", userCount: 2 },
  { role: "Administrator", access: "Content, services, work, leads, bookings, package setup", userCount: 3 },
  { role: "Content Editor", access: "Pages, services, case studies, insights, media — no system settings", userCount: 4 },
  { role: "Sales/Business Dev", access: "Leads, package submissions, notes, activities, proposal status", userCount: 5 },
  { role: "Studio Manager", access: "Availability, bookings, add-ons, booking details, ops notes", userCount: 2 },
  { role: "Marketing Manager", access: "Campaign content, SEO, analytics, insights, testimonials", userCount: 3 },
  { role: "Analyst/Viewer", access: "Read-only reporting / approved modules", userCount: 2 },
];

const INTEGRATIONS = [
  { name: "PostgreSQL Database", provider: "Prisma ORM", status: "Connected", health: "100%" },
  { name: "Email Delivery", provider: "Resend", status: "Active", health: "99.9%" },
  { name: "Bot Protection", provider: "Cloudflare Turnstile", status: "Active", health: "100%" },
  { name: "Product Analytics", provider: "PostHog", status: "Active", health: "100%" },
  { name: "Media / Asset Storage", provider: "Cloudflare R2", status: "Ready", health: "100%" },
];

export default function AdminGovernancePage() {
  const [mfaEnforced, setMfaEnforced] = useState(true);

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <span className="text-xs font-mono font-bold text-brand-secondary uppercase">
          Admin Control Center (PRD §12 & §13)
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-content-primary mt-1">
          Governance, RBAC & Integrations
        </h1>
      </div>

      {/* 7 Roles & Permissions Table */}
      <div className="p-6 rounded-2xl bg-surface-elevated border border-border-subtle shadow-subtle space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-content-primary flex items-center gap-2">
            <Lock className="w-4 h-4 text-brand-primary" />
            <span>Roles & Permissions Matrix (PRD §13)</span>
          </h2>
          <span className="text-xs font-mono text-content-muted">7 System Roles Locked</span>
        </div>

        <div className="divide-y divide-border-subtle">
          {ROLES.map((r) => (
            <div key={r.role} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="space-y-0.5">
                <span className="font-bold text-content-primary block">{r.role}</span>
                <span className="text-content-secondary">{r.access}</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-surface-muted text-content-primary font-semibold shrink-0">
                {r.userCount} Assigned
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Security & MFA Policy */}
      <div className="p-6 rounded-2xl bg-surface-elevated border border-border-subtle shadow-subtle space-y-4">
        <h3 className="text-sm font-bold text-content-primary flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-brand-secondary" />
          <span>Security & Authentication Policy</span>
        </h3>
        <div className="flex items-center justify-between p-4 rounded-xl bg-surface-muted text-xs">
          <div>
            <span className="font-bold text-content-primary block">
              Multi-Factor Authentication (Email OTP MFA)
            </span>
            <span className="text-content-secondary">
              Mandatory for Super Admin & Administrator roles per PRD §15.
            </span>
          </div>
          <input
            type="checkbox"
            checked={mfaEnforced}
            onChange={(e) => setMfaEnforced(e.target.checked)}
            className="w-4 h-4 rounded text-brand-primary"
          />
        </div>
      </div>

      {/* Connected Integrations */}
      <div className="p-6 rounded-2xl bg-surface-elevated border border-border-subtle shadow-subtle space-y-4">
        <h3 className="text-sm font-bold text-content-primary flex items-center gap-2">
          <Database className="w-4 h-4 text-brand-accent" />
          <span>Modular Service Integrations (PRD §16 & Decisions Log)</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {INTEGRATIONS.map((item) => (
            <div key={item.name} className="p-4 rounded-xl bg-surface-muted flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-content-primary block">{item.name}</span>
                <span className="text-content-muted">{item.provider}</span>
              </div>
              <span className="text-status-success font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{item.status}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
