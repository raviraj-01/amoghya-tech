"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { mediaUrl } from "@/lib/media-url";

export default function MediaImage({ src, onError, ...props }: ImageProps) {
  const [failedSource, setFailedSource] = useState<ImageProps["src"] | null>(null);
  const resolved = typeof src === "string" && failedSource !== src ? mediaUrl(src) : src;
  return <Image {...props} src={resolved} onError={event => {
    if (resolved !== src) setFailedSource(src);
    else onError?.(event);
  }} />;
}
