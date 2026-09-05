"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { sceneCopy } from "./copy";

export function Fallback() {
  return (
    <div className="w-full py-8 px-6 rounded-2xl bg-surface-elevated border border-border-subtle text-center space-y-6">
      <div className="relative w-48 h-48 sm:w-56 sm:h-56 mx-auto">
        <Image
          src="/image/AMO-3.png"
          alt="The Vyara Amogya World"
          fill
          sizes="(min-width: 640px) 224px, 192px"
          className="object-contain drop-shadow-xl"
        />
      </div>

      <h3 className="text-2xl font-bold text-content-primary max-w-lg mx-auto">
        &ldquo;{sceneCopy.dialogue}&rdquo;
      </h3>
      <div className="flex flex-wrap justify-center gap-6 text-xs font-semibold text-content-secondary">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-brand-primary" /> Think clearly
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-brand-secondary" /> Build beautifully
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-brand-accent" /> Grow intelligently
        </span>
      </div>
      <div className="pt-2">
        <Link
          href="/about"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-surface-muted text-content-primary text-xs font-semibold hover:bg-surface-muted/80 border border-border-subtle transition-all"
        >
          <span>Learn About Our Culture & World</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

