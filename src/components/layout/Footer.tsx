"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Shield } from "lucide-react";

export function Footer() {
  const pathname = usePathname();

  // Hide on admin routes
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="border-t border-border-subtle bg-brand-primary pb-12 pt-16 text-surface-base transition-colors">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-border-subtle">
          {/* Col 1: Brand & AMO */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-12 items-center justify-center rounded-full bg-brand-secondary text-sm font-black text-brand-primary">
                VAT
              </div>
              <span className="font-semibold text-surface-base">
                Vyara Amogya Technologies
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-surface-base/70">
              Beyond Your Expectations. One team. Many capabilities. One coherent outcome.
            </p>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-2.5 py-1 text-xs font-mono text-surface-base/70">
              <Sparkles className="w-3.5 h-3.5 text-brand-secondary" />
              <span>AMO-led landing experience</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-surface-base/50">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/services" className="text-surface-base/70 transition-colors hover:text-brand-secondary">
                  What We Do
                </Link>
              </li>
              <li>
                <Link href="/work" className="text-surface-base/70 transition-colors hover:text-brand-secondary">
                  Work / Case Studies
                </Link>
              </li>
              <li>
                <Link href="/studio" className="text-surface-base/70 transition-colors hover:text-brand-secondary">
                  Studio & Equipment
                </Link>
              </li>
              <li>
                <Link href="/package-builder" className="text-surface-base/70 transition-colors hover:text-brand-secondary">
                  Build Your Package
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-surface-base/70 transition-colors hover:text-brand-secondary">
                  About the Company & AMO
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Services Summary */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-surface-base/50">
              Core Capabilities
            </h3>
            <ul className="space-y-2 text-sm text-surface-base/70">
              <li>Strategy & Digital Direction</li>
              <li>Brand Identity & Creative Systems</li>
              <li>Websites & Digital Experiences</li>
              <li>Product Design & Engineering</li>
              <li>AI, Automation & Business Systems</li>
              <li>Content, Motion & Studio Sessions</li>
            </ul>
          </div>

          {/* Col 4: Commercial & Admin */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-surface-base/50">
              Connect & Operations
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="text-surface-base/70 transition-colors hover:text-brand-secondary">
                  Contact & Inquiries
                </Link>
              </li>
              <li>
                <Link href="/studio/book" className="text-surface-base/70 transition-colors hover:text-brand-secondary">
                  Book Studio Session
                </Link>
              </li>
              <li>
                <Link href="/admin" className="inline-flex items-center gap-1.5 text-surface-base/50 transition-colors hover:text-brand-secondary">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin Control Center</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 pt-8 text-xs text-surface-base/50 sm:flex-row">
          <p>© {new Date().getFullYear()} Vyara Amogya Technologies. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>WCAG 2.2 AA Compliant</span>
            <span>Reduced Motion Supported</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
