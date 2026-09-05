"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";

export function PersistentCTA() {
  const pathname = usePathname();

  // Hide on /contact and /admin
  if (pathname.startsWith("/admin") || pathname === "/contact") {
    return null;
  }

  return (
    <aside
      aria-label="Quick Action"
      className="vat-hide-during-intro fixed bottom-6 right-6 z-40 animate-in fade-in slide-in-from-bottom-4 duration-default"
    >
      <Link
        href="/contact?source=persistent-cta"
        className="group flex items-center gap-3 rounded-full border border-border-darkSubtle bg-brand-primary py-2.5 pl-4 pr-3 text-surface-base shadow-elevated transition-all hover:scale-105 active:scale-95"
      >
        <span className="text-xs font-semibold tracking-wide uppercase">
          Start a Project
        </span>
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-secondary transition-colors">
          <ArrowUpRight className="h-3.5 w-3.5 text-brand-primary" />
        </div>
      </Link>
    </aside>
  );
}
