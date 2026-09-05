"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Camera,
  Download,
  Info,
  ShieldCheck,
} from "lucide-react";

const BOOKING_TYPES = [
  { id: "studio-rental", name: "Studio Rental", basePrice: 2500, unit: "hr" },
  { id: "photo-shoot", name: "Photo Shoot", basePrice: 4000, unit: "hr" },
  { id: "video-production", name: "Video Production", basePrice: 6500, unit: "hr" },
  { id: "podcast-recording", name: "Podcast Recording", basePrice: 3500, unit: "hr" },
  { id: "product-shoot", name: "Product Shoot", basePrice: 5000, unit: "hr" },
  { id: "content-production", name: "Content Production", basePrice: 5500, unit: "hr" },
  { id: "consultation", name: "Studio Consultation", basePrice: 2000, unit: "hr" },
  { id: "custom", name: "Custom Production", basePrice: 7500, unit: "hr" },
];

const ADD_ONS = [
  { id: "operator", name: "Studio Operator", price: 1500 },
  { id: "photographer", name: "Lead Photographer/Videographer", price: 3000 },
  { id: "lighting", name: "Specialized Cinema Lighting Package", price: 2000 },
  { id: "audio-engineer", name: "Sound / Audio Engineer", price: 2000 },
  { id: "styling", name: "Set Styling & Props", price: 2500 },
  { id: "equipment", name: "Extra Cinema Cameras & Lenses", price: 3500 },
  { id: "editing", name: "Post-Production / Rough Cut Editing", price: 4000 },
  { id: "set-design", name: "Custom Backdrop & Set Design", price: 3500 },
  { id: "crew", name: "Assistant Crew Member", price: 1200 },
];

export function StudioBookingFlow() {
  const [step, setStep] = useState(1);
  const [bookingType, setBookingType] = useState(BOOKING_TYPES[0].id);
  const [date, setDate] = useState("2026-09-01");
  const [startTime, setStartTime] = useState("10:00");
  const [durationHours, setDurationHours] = useState(4);
  const [partySize, setPartySize] = useState(3);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [projectDetails, setProjectDetails] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    purpose: "",
    deliverables: "",
    specialRequirements: "",
  });
  const [bookingReference, setBookingReference] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentType = BOOKING_TYPES.find((b) => b.id === bookingType) || BOOKING_TYPES[0];
  const baseTotal = currentType.basePrice * durationHours;
  const addonsTotal = selectedAddons.reduce((acc, id) => {
    const item = ADD_ONS.find((a) => a.id === id);
    return acc + (item ? item.price : 0);
  }, 0);
  const estimatedTotal = baseTotal + addonsTotal;
  const depositAmount = Math.round(estimatedTotal * 0.3); // 30% deposit rule

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      const refCode = "VAT-" + Math.floor(100000 + Math.random() * 900000);
      setBookingReference(refCode);
      setIsSubmitting(false);
      setStep(6);
    }, 600);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 sm:p-10 rounded-3xl bg-surface-elevated border border-border-subtle shadow-card">
      {/* Progress Indicators */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-mono text-content-muted mb-2">
          <span>Step {step} of 6</span>
          <span>
            {step === 1 && "Booking Format"}
            {step === 2 && "Date & Time"}
            {step === 3 && "Add-ons"}
            {step === 4 && "Project Details"}
            {step === 5 && "Review & Policy"}
            {step === 6 && "Confirmed"}
          </span>
        </div>
        <div className="w-full bg-surface-muted h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-brand-primary h-full transition-all duration-default"
            style={{ width: `${(step / 6) * 100}%` }}
          />
        </div>
      </div>

      {/* Step 1: Select Booking Type */}
      {step === 1 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-content-primary">
            1. Select Studio Booking Format
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {BOOKING_TYPES.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setBookingType(type.id)}
                className={`p-4 rounded-xl text-left border transition-all ${
                  bookingType === type.id
                    ? "border-brand-primary bg-surface-muted ring-1 ring-brand-primary"
                    : "border-border-subtle hover:border-brand-primary/40 bg-surface-base"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-content-primary">
                    {type.name}
                  </span>
                  <span className="text-xs font-mono text-brand-secondary font-bold">
                    ₹{type.basePrice.toLocaleString()}/{type.unit}
                  </span>
                </div>
              </button>
            ))}
          </div>
          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-brand-primary text-surface-base text-sm font-medium hover:bg-brand-primary/90"
            >
              <span>Next: Date & Duration</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Date, Time & Duration */}
      {step === 2 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-content-primary">
            2. Choose Date, Start Time & Duration
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-content-primary uppercase tracking-wider mb-2">
                Session Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-surface-muted border border-border-subtle text-sm text-content-primary focus:outline-none focus:border-brand-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-content-primary uppercase tracking-wider mb-2">
                Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-surface-muted border border-border-subtle text-sm text-content-primary focus:outline-none focus:border-brand-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-content-primary uppercase tracking-wider mb-2">
                Duration (Hours)
              </label>
              <select
                value={durationHours}
                onChange={(e) => setDurationHours(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-lg bg-surface-muted border border-border-subtle text-sm text-content-primary focus:outline-none focus:border-brand-primary"
              >
                <option value={2}>2 Hours (Half Mini)</option>
                <option value={4}>4 Hours (Half Day)</option>
                <option value={8}>8 Hours (Full Day)</option>
                <option value={12}>12 Hours (Extended)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-content-primary uppercase tracking-wider mb-2">
                Expected Party / Crew Size
              </label>
              <input
                type="number"
                min={1}
                max={25}
                value={partySize}
                onChange={(e) => setPartySize(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-lg bg-surface-muted border border-border-subtle text-sm text-content-primary focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>
          <div className="pt-4 flex justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-surface-muted text-content-primary text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-brand-primary text-surface-base text-sm font-medium hover:bg-brand-primary/90"
            >
              <span>Next: Equipment & Add-ons</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Choose Add-ons */}
      {step === 3 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-content-primary">
            3. Select Production Add-ons
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ADD_ONS.map((addon) => {
              const active = selectedAddons.includes(addon.id);
              return (
                <button
                  key={addon.id}
                  type="button"
                  onClick={() => toggleAddon(addon.id)}
                  className={`p-3.5 rounded-xl text-left border flex items-center justify-between transition-all ${
                    active
                      ? "border-brand-secondary bg-surface-muted ring-1 ring-brand-secondary"
                      : "border-border-subtle hover:border-brand-primary/40 bg-surface-base"
                  }`}
                >
                  <span className="text-xs font-medium text-content-primary">
                    {addon.name}
                  </span>
                  <span className="text-xs font-mono text-content-secondary">
                    +₹{addon.price.toLocaleString()}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="pt-4 flex justify-between">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-surface-muted text-content-primary text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => setStep(4)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-brand-primary text-surface-base text-sm font-medium hover:bg-brand-primary/90"
            >
              <span>Next: Project Brief</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Provide Purpose, Deliverables, Contact */}
      {step === 4 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-content-primary">
            4. Project Details & Deliverables
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-content-primary uppercase mb-1">
                Your Name *
              </label>
              <input
                type="text"
                required
                value={projectDetails.name}
                onChange={(e) =>
                  setProjectDetails({ ...projectDetails, name: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg bg-surface-muted border border-border-subtle text-xs text-content-primary"
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-content-primary uppercase mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={projectDetails.email}
                onChange={(e) =>
                  setProjectDetails({ ...projectDetails, email: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg bg-surface-muted border border-border-subtle text-xs text-content-primary"
                placeholder="jane@company.com"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-content-primary uppercase mb-1">
                Company / Channel
              </label>
              <input
                type="text"
                value={projectDetails.company}
                onChange={(e) =>
                  setProjectDetails({ ...projectDetails, company: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg bg-surface-muted border border-border-subtle text-xs text-content-primary"
                placeholder="Brand / Studio Name"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-content-primary uppercase mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={projectDetails.phone}
                onChange={(e) =>
                  setProjectDetails({ ...projectDetails, phone: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg bg-surface-muted border border-border-subtle text-xs text-content-primary"
                placeholder="+91 98765 43210"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-content-primary uppercase mb-1">
              Shoot Purpose & Deliverables
            </label>
            <textarea
              rows={3}
              value={projectDetails.deliverables}
              onChange={(e) =>
                setProjectDetails({
                  ...projectDetails,
                  deliverables: e.target.value,
                })
              }
              placeholder="e.g. 5 podcast video episodes, product stills for launch campaign..."
              className="w-full px-3 py-2 rounded-lg bg-surface-muted border border-border-subtle text-xs text-content-primary"
            />
          </div>
          <div className="pt-4 flex justify-between">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-surface-muted text-content-primary text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => setStep(5)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-brand-primary text-surface-base text-sm font-medium hover:bg-brand-primary/90"
            >
              <span>Next: Review & Policies</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Review Estimate, Policies, Deposit Terms */}
      {step === 5 && (
        <form onSubmit={handleComplete} className="space-y-6">
          <h2 className="text-xl font-bold text-content-primary">
            5. Review Estimate & Terms
          </h2>

          <div className="p-6 rounded-2xl bg-surface-muted border border-border-subtle space-y-4">
            <div className="flex justify-between text-sm pb-2 border-b border-border-subtle">
              <span>{currentType.name} ({durationHours} hours)</span>
              <span className="font-mono font-bold">₹{baseTotal.toLocaleString()}</span>
            </div>
            {selectedAddons.length > 0 && (
              <div className="space-y-1 text-xs text-content-secondary pb-2 border-b border-border-subtle">
                <span className="font-semibold text-content-primary block">Add-ons:</span>
                {selectedAddons.map((id) => {
                  const item = ADD_ONS.find((a) => a.id === id);
                  return (
                    <div key={id} className="flex justify-between">
                      <span>• {item?.name}</span>
                      <span>+₹{item?.price.toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="flex justify-between text-base font-bold text-content-primary pt-1">
              <span>Estimated Total</span>
              <span className="font-mono text-brand-primary">₹{estimatedTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs text-content-secondary">
              <span>30% Deposit Amount (if applicable)</span>
              <span className="font-mono font-semibold">₹{depositAmount.toLocaleString()}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface-base border border-border-subtle text-xs text-content-secondary space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-content-primary">
              <Info className="w-4 h-4 text-brand-secondary" />
              <span>Studio Policies & Cancellation Rules</span>
            </div>
            <p>• Minimum 48 hours notice required for free rescheduling.</p>
            <p>• Non-refundable deposit if cancelled within 24 hours of session start.</p>
          </div>

          <div className="pt-4 flex justify-between">
            <button
              type="button"
              onClick={() => setStep(4)}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-surface-muted text-content-primary text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-brand-primary text-surface-base text-sm font-semibold hover:bg-brand-primary/90 shadow-card"
            >
              <span>{isSubmitting ? "Processing..." : "Submit Booking Request"}</span>
              <CheckCircle2 className="w-4 h-4 text-status-success" />
            </button>
          </div>
        </form>
      )}

      {/* Step 6: Confirmation & .ICS Calendar Invite */}
      {step === 6 && (
        <div className="py-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-status-success/10 text-status-success flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold text-brand-secondary uppercase">
              Booking Confirmed & Logged
            </span>
            <h2 className="text-2xl font-bold text-content-primary mt-1">
              Studio Session Reserved
            </h2>
            <p className="text-xs font-mono text-content-muted mt-2">
              Reference Code: <span className="text-content-primary font-bold">{bookingReference}</span>
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-surface-muted border border-border-subtle max-w-md mx-auto text-left text-xs space-y-2">
            <p><strong className="text-content-primary">Format:</strong> {currentType.name}</p>
            <p><strong className="text-content-primary">Date & Time:</strong> {date} at {startTime} ({durationHours} hours)</p>
            <p><strong className="text-content-primary">Estimated Total:</strong> ₹{estimatedTotal.toLocaleString()}</p>
            <p className="pt-2 text-content-secondary border-t border-border-subtle">
              A confirmation email has been dispatched with invoice and calendar sync attachment.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              type="button"
              onClick={() => alert("Downloading calendar invite: " + bookingReference + ".ics")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-surface-muted text-content-primary text-xs font-semibold border border-border-subtle hover:bg-surface-muted/80"
            >
              <Download className="w-4 h-4" />
              <span>Download .ICS Calendar Invite</span>
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-primary text-surface-base text-xs font-semibold hover:bg-brand-primary/90"
            >
              <span>Return to Home</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
