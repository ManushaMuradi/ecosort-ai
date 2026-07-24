"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FolderTree, Package, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";

export const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/categories", label: "Categories", icon: FolderTree },
  { href: "/waste-items", label: "Waste Items", icon: Package },
  { href: "/requests", label: "Pickup Requests", icon: Truck },
];

/**
 * Fixed-width left navigation, shared by every page under (dashboard).
 * Active state is derived from the current pathname, not manually
 * tracked — one source of truth (the URL) instead of duplicated state.
 */
export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-zinc-200 bg-white md:flex">
      <div className="flex h-14 items-center gap-2 border-b border-zinc-200 px-5">
        <Logo size={28} />
        <span className="text-sm font-semibold text-zinc-900">EcoSort</span>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 p-3" aria-label="Main navigation">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
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
    </aside>
  );
}
