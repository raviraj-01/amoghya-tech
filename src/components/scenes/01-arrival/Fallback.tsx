"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { sceneCopy } from "./copy";

export function Fallback() {
  return (
    <div className="w-full py-8 px-6 rounded-2xl bg-surface-elevated border border-border-subtle text-center space-y-6">
      <div className="relative w-48 h-48 sm:w-64 sm:h-64 mx-auto">
        <Image
          src="/image/AMO-1.png"
          alt="AMO Character Arrival"
          fill
          sizes="(min-width: 640px) 256px, 192px"
          className="object-contain drop-shadow-xl"
          priority
        />
      </div>

      <p className="text-lg sm:text-xl font-medium text-content-primary max-w-lg mx-auto italic">
        &ldquo;{sceneCopy.dialogue}&rdquo;
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
        <Link
          href="/services"
          className="px-5 py-2.5 rounded-lg bg-surface-muted text-content-primary text-xs font-semibold hover:bg-surface-muted/80"
        >
          See what AMO can do
        </Link>
        <Link
          href="/contact?source=scene-01"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-brand-primary text-surface-base text-xs font-semibold hover:bg-brand-primary/90"
        >
          <span>Start a project</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
