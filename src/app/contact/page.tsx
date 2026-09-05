import { Mail, Phone, MessageSquare, ShieldCheck } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata = {
  title: "Contact & Start a Project | Vyara Amogya Technologies",
  description: "Get in touch with our team to start a new project, book studio time, or request a custom proposal.",
};

export default function ContactPage() {
  return (
    <div className="py-16 sm:py-24 max-w-container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-muted border border-border-subtle text-xs font-mono text-content-secondary mb-4">
          <MessageSquare className="w-3.5 h-3.5 text-brand-secondary" />
          <span>Project Inquiry & Lead Capture (PRD §11)</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-content-primary">
          Start a Project
        </h1>
        <p className="mt-4 text-lg text-content-secondary leading-relaxed">
          Tell us about your objectives, timeline, and vision. We will review your brief and schedule a discovery call.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Form Container (PRD §11 fields) */}
        <div className="lg:col-span-2 p-8 rounded-2xl bg-surface-elevated border border-border-subtle shadow-subtle">
          <ContactForm />
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-surface-elevated border border-border-subtle shadow-subtle space-y-4">
            <h3 className="text-sm font-bold text-content-primary">Direct Inquiries</h3>
            <div className="space-y-2 text-xs text-content-secondary">
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-secondary" />
                <span>hello@amoghya.tech</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-secondary" />
                <span>Studio & Sales Direct Line</span>
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-surface-muted border border-border-subtle space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-content-primary">
              <ShieldCheck className="w-4 h-4 text-status-success" />
              <span>Lead Routing & CRM</span>
            </div>
            <p className="text-xs text-content-secondary leading-relaxed">
              Every inquiry is validated, bot-protected, attributed to its acquisition source, and routed directly to our team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
