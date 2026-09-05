import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { StudioBookingFlow } from "@/components/booking/StudioBookingFlow";

export const metadata = {
  title: "Book Studio Time | Vyara Amogya Technologies",
  description: "Guided 6-step studio booking flow per PRD §8.",
};

export default function StudioBookingPage() {
  return (
    <div className="py-16 sm:py-24 max-w-container mx-auto px-4 sm:px-6 lg:px-8">
      <Link
        href="/studio"
        className="inline-flex items-center gap-2 text-xs font-semibold text-content-muted hover:text-brand-primary mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Studio</span>
      </Link>

      <div className="max-w-3xl mx-auto mb-10 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-content-primary">
          Reserve Studio Session
        </h1>
        <p className="mt-2 text-sm text-content-secondary">
          Configure format, duration, cinema gear, and crew add-ons.
        </p>
      </div>

      <StudioBookingFlow />
    </div>
  );
}
