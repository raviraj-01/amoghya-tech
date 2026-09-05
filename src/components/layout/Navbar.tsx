"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "What We Do", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "Studio", href: "/studio" },
  { label: "Build Your Package", href: "/package-builder" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hide global navbar on /admin routes to allow clean admin-specific layout
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border-subtle bg-surface-base/88 backdrop-blur-md transition-colors">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 h-nav flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-12 items-center justify-center rounded-full bg-brand-primary text-sm font-black tracking-tight text-surface-base shadow-subtle transition-transform group-hover:scale-105">
            <span>VAT</span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-content-primary text-sm tracking-tight leading-tight">
              Vyara Amogya
            </span>
            <span className="text-[11px] text-content-muted">
              Beyond Your Expectations
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors",
                  isActive
                    ? "bg-brand-primary text-surface-base font-semibold"
                    : "text-content-secondary hover:bg-surface-muted hover:text-brand-primary"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Button: Start a Project */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/contact?source=global-nav"
            className="inline-flex items-center gap-2 rounded-full bg-brand-primary px-4 py-2 text-sm font-bold text-surface-base shadow-subtle transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Start a Project</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-content-secondary hover:text-content-primary hover:bg-surface-muted"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface-elevated border-b border-border-subtle px-4 pt-3 pb-6 space-y-2 shadow-card animate-in fade-in slide-in-from-top-2">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block rounded-full px-3 py-2 text-base font-medium",
                  isActive
                    ? "bg-brand-primary text-surface-base font-semibold"
                    : "text-content-secondary hover:bg-surface-muted hover:text-brand-primary"
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="pt-3">
            <Link
              href="/contact?source=mobile-nav"
              onClick={() => setMobileMenuOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-primary py-2.5 text-sm font-bold text-surface-base shadow-subtle"
            >
              <span>Start a Project</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
