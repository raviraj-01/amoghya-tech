import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { openGraphForPage } from "@/lib/seo";

interface CaseStudyPageProps {
  params: {
    slug: string;
  };
}

export function generateMetadata({ params }: CaseStudyPageProps) {
  const title = `${params.slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")} | Amoghya Work`;
  const description = "Explore an Amoghya Technologies work and industry solution.";
  const path = `/work/${params.slug}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: openGraphForPage(path, title, description),
  };
}

export default function CaseStudyPage({ params }: CaseStudyPageProps) {
  const formattedTitle = params.slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="py-16 sm:py-24 max-w-container mx-auto px-4 sm:px-6 lg:px-8">
      <Link
        href="/work"
        className="inline-flex items-center gap-2 text-xs font-semibold text-content-muted hover:text-brand-primary mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Work</span>
      </Link>

      <div className="max-w-3xl">
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-content-primary">
          {formattedTitle}
        </h1>

        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-xl bg-surface-elevated border border-border-subtle text-xs">
          <div>
            <span className="text-content-muted block">Client</span>
            <span className="font-semibold text-content-primary">Client Case</span>
          </div>
          <div>
            <span className="text-content-muted block">Industry</span>
            <span className="font-semibold text-content-primary">Technology</span>
          </div>
          <div>
            <span className="text-content-muted block">Services</span>
            <span className="font-semibold text-content-primary">Design & Build</span>
          </div>
          <div>
            <span className="text-content-muted block">Timeline</span>
            <span className="font-semibold text-content-primary">8 Weeks</span>
          </div>
        </div>

        <div className="mt-12 space-y-8 text-content-secondary leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-content-primary mb-3">Challenge</h2>
            <p className="text-sm">Client challenge outline mapped per PRD §10 case study entity fields.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-content-primary mb-3">Approach & Solution</h2>
            <p className="text-sm">Strategic design, technical implementation, and measurable commercial results.</p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-border-subtle">
          <Link
            href="/contact?source=case-study"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-brand-primary text-surface-base text-sm font-medium hover:bg-brand-primary/90"
          >
            <span>Start a Similar Project</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
