"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { navItems } from "@/components/layout/Sidebar";
import { Logo } from "@/components/ui/Logo";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Slide-over drawer shown only below the md breakpoint (Sidebar is
 * hidden there). A backdrop click or Escape-equivalent close button
 * dismisses it; focus stays simple/native (no focus-trap library) since
 * the drawer only contains a short, fully keyboard-reachable nav list.
 */
export function MobileNav({ open, onClose }: MobileNavProps) {
  const pathname = usePathname();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 md:hidden">
      <button
        aria-label="Close navigation menu"
        className="absolute inset-0 bg-zinc-900/30 animate-fade-in"
        onClick={onClose}
      />
      <div className="absolute left-0 top-0 flex h-full w-64 flex-col bg-white shadow-popover animate-slide-up">
        <div className="flex h-14 items-center justify-between border-b border-zinc-200 px-4">
          <div className="flex items-center gap-2">
            <Logo size={28} />
            <span className="text-sm font-semibold text-zinc-900">EcoSort</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-md p-1.5 text-zinc-500 hover:bg-zinc-100"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 p-3" aria-label="Main navigation">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-accent-50 text-accent-700"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                )}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
