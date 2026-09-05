"use client";

import Image from "next/image";
import { Fallback } from "./Fallback";

export function Scene() {
  return (
    <div className="relative w-full max-w-md mx-auto aspect-square flex items-center justify-center p-4">
      <div className="relative w-full h-full transform transition-transform duration-700 hover:scale-105">
        <Image
          src="/image/AMO-4.png"
          alt="AMO in the Studio"
          fill
          sizes="(min-width: 640px) 448px, calc(100vw - 32px)"
          className="object-contain drop-shadow-2xl"
        />
      </div>
    </div>
  );
}

