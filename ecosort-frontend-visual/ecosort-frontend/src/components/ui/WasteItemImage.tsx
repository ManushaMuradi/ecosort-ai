"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface WasteItemImageProps {
  src: string |null;
  alt: string;
  size?: "sm" | "lg";
}

const sizeStyles = {
  sm: "h-10 w-10",
  lg: "max-h-80 w-auto max-w-full",
};

export function WasteItemImage({
  src,
  alt,
  size = "sm",
}: WasteItemImageProps) {
  const [failed, setFailed] = useState(false);

  const showPlaceholder = !src || failed;

  return (
    <div
      className={cn(
        "flex items-center justify-center py-6",
        size === "sm" && "h-10 w-10"
      )}
    >
      {showPlaceholder ? (
        size === "lg" ? (
          <Image
            src="/images/illustrations/item-placeholder.svg"
            alt="No image"
            width={300}
            height={300}
            className="max-h-80 w-auto"
          />
        ) : (
          <ImageOff className="h-4 w-4 text-zinc-300" />
        )
      ) : (
        <img
          src={src}
          alt={alt}
          className={cn(
            size === "lg"
              ? "max-h-80 w-auto rounded-lg shadow-sm"
              : "h-10 w-10 rounded object-cover"
          )}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}