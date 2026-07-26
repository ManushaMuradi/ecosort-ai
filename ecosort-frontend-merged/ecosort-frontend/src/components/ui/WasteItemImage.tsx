"use client";

import { useState } from "react";
import Image from "next/image";
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
 * AND when a provided URL fails to load — a plain <img> is used for
 * the real photo specifically because imageUrl is arbitrary,
 * admin-entered external content whose domain can't be whitelisted in
 * next.config.ts ahead of time; next/image IS used for the local
 * placeholder illustration itself, since that asset ships with the app.
 * The large placeholder uses a proper illustration; the small (40px)
 * table-thumbnail size keeps a plain icon — a detailed illustration
 * would just be noise at that scale.
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
        size === "lg" ? (
          <Image
            src="/images/illustrations/item-placeholder.svg"
            alt="No image available"
            width={200}
            height={200}
            className="h-full w-full object-contain p-6"
          />
        ) : (
          <ImageOff className="h-4 w-4 text-zinc-300" aria-hidden="true" />
        )
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
        src={src.startsWith("/") ? src : `/images/waste/${src}`}
        alt={alt}
        className="h-full w-full object-contain"
        onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
