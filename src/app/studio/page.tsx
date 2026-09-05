import Link from "next/link";
import { Camera, Calendar, ArrowRight, Video, Mic, Sparkles } from "lucide-react";

export const metadata = {
  title: "Studio & Production | Vyara Amogya Technologies",
  description: "State-of-the-art production studio for photo, video, podcasting, product shoots, and creative direction.",
};

const FORMATS = [
  { name: "Photo Shoot", icon: Camera, desc: "High-resolution editorial, fashion, or corporate headshots." },
  { name: "Video Production", icon: Video, desc: "4K commercial filming, brand stories, and interviews." },
  { name: "Podcast Recording", icon: Mic, desc: "Broadcast-grade multi-mic audio and video capture." },
  { name: "Product Sessions", icon: Sparkles, desc: "Dedicated lighting tables and macro staging for products." },
];

export default function StudioPage() {
  return (
    <div className="py-16 sm:py-24 max-w-container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-muted border border-border-subtle text-xs font-mono text-content-secondary mb-4">
          <Camera className="w-3.5 h-3.5 text-brand-secondary" />
          <span>Production Studio (PRD §8)</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-content-primary">
          AMO in the Studio
        </h1>
        <p className="mt-4 text-lg text-content-secondary leading-relaxed">
          &quot;This is where ideas become real.&quot; Dedicated creator facilities, pro cinema equipment, and full-service production operators.
        </p>
        <div className="mt-8">
          <Link
            href="/studio/book"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-brand-primary text-surface-base font-medium hover:bg-brand-primary/90 shadow-card transition-all"
          >
            <span>Book the Studio</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {FORMATS.map((f) => {
          const Icon = f.icon;
          return (
            <div
              key={f.name}
              className="p-6 rounded-xl bg-surface-elevated border border-border-subtle shadow-subtle space-y-3"
            >
              <div className="w-10 h-10 rounded-lg bg-surface-muted flex items-center justify-center text-brand-primary">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-content-primary">{f.name}</h3>
              <p className="text-xs text-content-secondary leading-relaxed">{f.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
