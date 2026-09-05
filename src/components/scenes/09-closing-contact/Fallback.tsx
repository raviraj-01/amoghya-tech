"use client";

import Image from "next/image";
import Link from "next/link";
import { sceneCopy } from "./copy";

export function Fallback() {
  return (
    <div className="w-full py-8 px-6 rounded-2xl bg-surface-elevated border border-border-subtle text-center space-y-6">
      <div className="relative w-48 h-48 sm:w-56 sm:h-56 mx-auto">
        <Image
          src="/image/AMO-9.png"
          alt="Closing / Contact"
          fill
          sizes="(min-width: 640px) 224px, 192px"
          className="object-contain drop-shadow-xl"
        />
      </div>

      <h3 className="text-2xl font-bold text-content-primary">&ldquo;{sceneCopy.dialogue}&rdquo;</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto pt-2">
        <Link
          href="/contact?source=closing-start"
          className="p-3 rounded-lg bg-brand-primary text-surface-base text-xs font-semibold hover:bg-brand-primary/90 transition-all"
        >
          Start a Project
        </Link>
        <Link
          href="/studio/book"
          className="p-3 rounded-lg bg-surface-muted text-content-primary text-xs font-semibold hover:bg-surface-muted/80 transition-all"
        >
          Book Studio
        </Link>
        <Link
          href="/package-builder"
          className="p-3 rounded-lg bg-surface-muted text-content-primary text-xs font-semibold hover:bg-surface-muted/80 transition-all"
        >
          Build Package
        </Link>
        <Link
          href="/contact?source=closing-discovery"
          className="p-3 rounded-lg bg-surface-muted text-content-primary text-xs font-semibold hover:bg-surface-muted/80 transition-all"
        >
          Schedule Call
        </Link>
      </div>
    </div>
  );
}
