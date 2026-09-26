import Link from "next/link";
import { Shield, LayoutDashboard, FileText, DollarSign, Bot, KeyRound, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Admin Control Center | Vyara Amogya Technologies",
  description: "Protected commercial operations and content management console.",
  robots: { index: false, follow: false },
};

const ADMIN_NAV = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Content", href: "/admin/content", icon: FileText },
  { label: "Commercial", href: "/admin/commercial", icon: DollarSign },
  { label: "AMO Controls", href: "/admin/amo", icon: Bot },
  { label: "Governance", href: "/admin/governance", icon: KeyRound },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface-base flex flex-col sm:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full sm:w-64 bg-surface-dark text-text-inverted p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-2 text-brand-secondary font-bold text-sm">
              <Shield className="w-4 h-4" />
              <span>Admin Control Center</span>
            </div>
            <p className="text-[11px] text-text-invertedMuted mt-1">
              Vyara Amogya Operations (PRD §12)
            </p>
          </div>

          <nav className="space-y-1">
            {ADMIN_NAV.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-text-invertedMuted hover:text-text-inverted hover:bg-surface-darkElevated transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-border-darkSubtle">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs text-text-invertedMuted hover:text-text-inverted transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Site</span>
          </Link>
        </div>
      </aside>

      {/* Main Admin Viewport */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
