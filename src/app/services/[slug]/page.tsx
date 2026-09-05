import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

interface ServiceDetailPageProps {
  params: {
    slug: string;
  };
}

export default function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const formattedTitle = params.slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="py-16 sm:py-24 max-w-container mx-auto px-4 sm:px-6 lg:px-8">
      <Link
        href="/services"
        className="inline-flex items-center gap-2 text-xs font-semibold text-content-muted hover:text-brand-primary mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Services</span>
      </Link>

      <div className="max-w-3xl">
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-content-primary">
          {formattedTitle}
        </h1>
        <p className="mt-6 text-lg text-content-secondary leading-relaxed">
          Comprehensive, outcome-driven scope designed to align technical architecture with commercial growth.
        </p>

        <div className="mt-12 p-8 rounded-2xl bg-surface-elevated border border-border-subtle shadow-subtle space-y-6">
          <h2 className="text-lg font-bold text-content-primary">
            Scope & Implementation
          </h2>
          <p className="text-sm text-content-secondary leading-relaxed">
            Detailed deliverables, outcomes, and pricing approach are seeded directly from the authoritative taxonomy in PRD §7.
          </p>
          <div className="pt-4 flex flex-wrap gap-4">
            <Link
              href={`/contact?source=service-${params.slug}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-brand-primary text-surface-base text-sm font-medium hover:bg-brand-primary/90 shadow-card transition-all"
            >
              <span>Inquire About This Service</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/package-builder"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-surface-muted text-content-primary text-sm font-medium hover:bg-surface-muted/80 border border-border-subtle transition-all"
            >
              <span>Add to Custom Package</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
