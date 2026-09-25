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
          src="/image/AMO-8.png"
          alt="Discuss Your Project"
          fill
          sizes="(min-width: 640px) 224px, 192px"
          className="object-contain drop-shadow-xl"
        />
      </div>

      {sceneCopy.dialogue && (
        <p className="text-base sm:text-lg font-semibold text-content-primary max-w-lg mx-auto italic">
          &ldquo;{sceneCopy.dialogue}&rdquo;
        </p>
      )}
      <p className="text-sm text-content-secondary max-w-md mx-auto">
        Scope brand, website, product engineering, automation, and studio services into a custom unified plan.
      </p>

      <div className="pt-2">
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-primary text-surface-base text-xs font-semibold hover:bg-brand-primary/90 transition-all"
        >
          <span>Discuss your project</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
