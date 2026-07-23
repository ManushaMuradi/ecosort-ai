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

const sizeStyles = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-2xl" };

/**
 * The single modal implementation reused by every dialog in the app
 * (confirmations, forms-in-a-dialog if ever needed). Handles Escape-to-
 * close and backdrop click, and locks body scroll while open — details
 * that are easy to forget if every feature rolled its own dialog.
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <button
        aria-label="Close dialog"
        className="absolute inset-0 bg-zinc-900/40 animate-fade-in"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative w-full animate-slide-up rounded-lg border border-zinc-200 bg-white shadow-popover",
          sizeStyles[size]
        )}
      >
        <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
          <h2 id="modal-title" className="text-base font-semibold text-zinc-900">
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
      </div>
    </div>
  );
}
