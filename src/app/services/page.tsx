import Link from "next/link";
import { ArrowRight, Layers } from "lucide-react";

export const metadata = {
  title: "What We Do | Vyara Amogya Technologies",
  description: "Explore our 9 integrated capability groups: Strategy, Brand, Web, Engineering, AI & Automation, Content, Marketing, Studio, and Support.",
};

const SERVICES = [
  {
    number: "01",
    name: "Strategy and Digital Direction",
    slug: "strategy-and-digital-direction",
    scope: "Brand/digital strategy; market research; product discovery; customer journeys; audits; conversion strategy; content strategy; technology roadmaps; growth planning.",
  },
  {
    number: "02",
    name: "Brand Identity and Creative Systems",
    slug: "brand-identity-and-creative-systems",
    scope: "Naming/positioning; logos; visual identity; guidelines; typography/color; brand voice; social systems; presentation design; packaging and campaign creative.",
  },
  {
    number: "03",
    name: "Websites and Digital Experiences",
    slug: "websites-and-digital-experiences",
    scope: "Corporate, portfolio, e-commerce, landing, CMS, and interactive/WebGL websites; web apps; redesigns; conversion optimization; performance/accessibility improvements.",
  },
  {
    number: "04",
    name: "Product Design and Engineering",
    slug: "product-design-and-engineering",
    scope: "MVPs; SaaS; mobile apps; UI/UX; design systems; prototyping; front-end/back-end engineering; APIs; maintenance and iteration.",
  },
  {
    number: "05",
    name: "AI, Automation, and Business Systems",
    slug: "ai-automation-and-business-systems",
    scope: "AI assistants; workflow automation; lead routing; CRM; support automation; knowledge assistants; dashboards; document workflows; data synchronization; custom operations tools.",
  },
  {
    number: "06",
    name: "Content, Motion, and Campaigns",
    slug: "content-motion-and-campaigns",
    scope: "Video; motion graphics; explainers; 3D content; social content; photography; campaign concepts; performance creative; launch work; retainers.",
  },
  {
    number: "07",
    name: "Marketing and Growth",
    slug: "marketing-and-growth",
    scope: "Paid campaign creative/management; social strategy; SEO; email/lifecycle marketing; lead funnels; landing-page optimization; reporting; growth experiments.",
  },
  {
    number: "08",
    name: "Studio Services",
    slug: "studio-services",
    scope: "Photo/video shoots; podcast recording; product shoots; content sessions; interviews; creative direction; equipment; editing; studio rental.",
  },
  {
    number: "09",
    name: "Ongoing Support",
    slug: "ongoing-support",
    scope: "Website care; product maintenance; content and growth retainers; automation support; analytics reporting; fractional partnership.",
  },
];

export default function ServicesPage() {
  return (
    <div className="py-16 sm:py-24 max-w-container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-muted border border-border-subtle text-xs font-mono text-content-secondary mb-4">
          <Layers className="w-3.5 h-3.5 text-brand-secondary" />
          <span>Service Taxonomy — 9 Capability Groups</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-content-primary">
          What We Do
        </h1>
        <p className="mt-4 text-lg text-content-secondary leading-relaxed">
          Comprehensive, interdisciplinary capabilities built to take ideas from foundational strategy to full-scale digital operations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {SERVICES.map((srv) => (
          <Link
            key={srv.slug}
            href={`/services/${srv.slug}`}
            className="group flex flex-col justify-between p-8 rounded-2xl bg-surface-elevated border border-border-subtle hover:border-brand-secondary/40 hover:shadow-elevated transition-all duration-default"
          >
            <div>
              <span className="text-xs font-mono font-bold text-brand-secondary">
                {srv.number}
              </span>
              <h2 className="mt-3 text-xl font-bold text-content-primary group-hover:text-brand-secondary transition-colors">
                {srv.name}
              </h2>
              <p className="mt-3 text-sm text-content-secondary leading-relaxed">
                {srv.scope}
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-border-subtle flex items-center justify-between text-xs font-semibold text-content-primary group-hover:text-brand-secondary transition-colors">
              <span>Explore Capability</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
