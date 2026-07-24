"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
}

const sizeStyles = { sm: "sm:max-w-sm", md: "sm:max-w-md", lg: "sm:max-w-2xl" };

/**
 * The single modal implementation reused by every dialog in the app.
 * Handles Escape-to-close, backdrop click, and body-scroll lock.
 * Responsive behavior: a full-screen sheet below the `sm` breakpoint
 * (no wasted backdrop margin on a 320px screen, and room for long
 * forms to scroll internally), a centered max-width dialog at `sm+`.
 */
export function Modal({ open, onClose, title, children, size = "md" }: ModalProps) {
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex sm:items-center sm:justify-center sm:p-4"
    >
      <button
        aria-label="Close dialog"
        className="absolute inset-0 bg-zinc-900/40 animate-fade-in"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative flex h-full w-full flex-col bg-white animate-slide-up",
          "sm:h-auto sm:max-h-[85vh] sm:rounded-lg sm:border sm:border-zinc-200 sm:shadow-popover",
          sizeStyles[size]
        )}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-zinc-100 px-5 py-4">
          <h2 id="modal-title" className="text-base font-semibold text-zinc-900">
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-2 -mr-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
      </div>
    </div>
  );
}
