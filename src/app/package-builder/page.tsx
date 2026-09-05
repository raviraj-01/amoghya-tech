import { Sliders } from "lucide-react";
import { PackageBuilderFlow } from "@/components/package-builder/PackageBuilderFlow";

export const metadata = {
  title: "Build Your Package | Vyara Amogya Technologies",
  description: "Guided 6-step project scope and package estimator per PRD §9.",
};

export default function PackageBuilderPage() {
  return (
    <div className="py-16 sm:py-24 max-w-container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-muted border border-border-subtle text-xs font-mono text-content-secondary mb-4">
          <Sliders className="w-3.5 h-3.5 text-brand-secondary" />
          <span>Package Builder (PRD §9)</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-content-primary">
          Build Your Custom Package
        </h1>
        <p className="mt-2 text-sm text-content-secondary">
          Configure an indicative project estimate based on your goals, business scale, and required modules.
        </p>
      </div>

      <PackageBuilderFlow />
    </div>
  );
}
