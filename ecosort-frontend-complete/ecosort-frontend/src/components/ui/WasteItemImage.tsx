"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface WasteItemImageProps {
  src: string | null;
  alt: string;
  size?: "sm" | "lg";
}

const sizeStyles = { sm: "h-10 w-10", lg: "h-48 w-full sm:h-64" };

/**
 * Renders imageUrl when present; falls back to a clean placeholder
 * illustration (not a broken-image icon) both when imageUrl is empty
 * AND when a provided URL fails to load — a plain <img> is used
 * instead of next/image specifically because imageUrl is arbitrary,
 * admin-entered external content whose domain can't be whitelisted in
 * next.config.ts ahead of time.
 */
export function WasteItemImage({ src, alt, size = "sm" }: WasteItemImageProps) {
  const [failed, setFailed] = useState(false);
  const showPlaceholder = !src || failed;

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-md border border-zinc-200 bg-zinc-50",
        sizeStyles[size]
      )}
    >
      {showPlaceholder ? (
        <div className="flex flex-col items-center gap-1.5 text-zinc-300">
          <ImageOff className={size === "lg" ? "h-8 w-8" : "h-4 w-4"} aria-hidden="true" />
          {size === "lg" && <span className="text-xs text-zinc-400">No image available</span>}
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
