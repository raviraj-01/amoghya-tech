import Link from "next/link";
import { FolderGit2, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Work & Case Studies | Vyara Amogya Technologies",
  description: "Outcome-led portfolio featuring brand, web, engineering, and studio projects.",
};

const FILTERS = ["All", "Brand Strategy", "Web Experiences", "Engineering", "Automation", "Studio"];

export default function WorkPage() {
  return (
    <div className="py-16 sm:py-24 max-w-container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-muted border border-border-subtle text-xs font-mono text-content-secondary mb-4">
          <FolderGit2 className="w-3.5 h-3.5 text-brand-secondary" />
          <span>Selected Case Studies (PRD §10)</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-content-primary">
          Our Work
        </h1>
        <p className="mt-4 text-lg text-content-secondary leading-relaxed">
          Measurable commercial impact delivered across startups, growing businesses, and enterprise teams.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-12">
        {FILTERS.map((f, i) => (
          <button
            key={f}
            type="button"
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
              i === 0
                ? "bg-brand-primary text-surface-base"
                : "bg-surface-muted text-content-secondary hover:text-content-primary hover:bg-surface-muted/80"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Case Studies Grid Placeholder */}
      <div className="p-12 rounded-2xl bg-surface-elevated border border-border-subtle text-center">
        <p className="text-sm font-medium text-content-secondary">
          Case study repository configured. Real client projects will be seeded in Phase 4 per CMS content models.
        </p>
        <div className="mt-6">
          <Link
            href="/contact?source=work-portfolio"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-primary text-surface-base text-sm font-medium hover:bg-brand-primary/90"
          >
            <span>Discuss Your Project</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
