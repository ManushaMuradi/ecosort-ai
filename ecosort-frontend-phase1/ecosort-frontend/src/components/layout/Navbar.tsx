"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, ChevronDown, LogOut, User as UserIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/lib/auth/AuthContext";
import { cn } from "@/lib/utils";

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the profile menu on outside click — standard dropdown behavior.
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    setMenuOpen(false);
    await logout();
    toast.success("Signed out");
    router.push("/login");
  }

  const initials = user?.fullName
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-zinc-200 bg-white/80 px-4 backdrop-blur sm:px-6">
      <button
        onClick={onMenuClick}
        aria-label="Open navigation menu"
        className="rounded-md p-1.5 text-zinc-600 hover:bg-zinc-100 md:hidden"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>

      <div className="hidden md:block" />

      <div ref={menuRef} className="relative">
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          className="flex items-center gap-2 rounded-md py-1.5 pl-1.5 pr-2 text-sm hover:bg-zinc-100"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-100 text-xs font-semibold text-accent-700">
            {initials}
          </span>
          <span className="hidden text-zinc-700 sm:inline">{user?.fullName}</span>
          <ChevronDown className="h-4 w-4 text-zinc-400" aria-hidden="true" />
        </button>

        {menuOpen && (
          <div
            role="menu"
            className="absolute right-0 mt-1.5 w-56 origin-top-right animate-slide-up rounded-md border border-zinc-200 bg-white py-1 shadow-popover"
          >
            <div className="border-b border-zinc-100 px-3 py-2">
              <p className="truncate text-sm font-medium text-zinc-900">{user?.fullName}</p>
              <p className="truncate text-xs text-zinc-500">{user?.email}</p>
            </div>
            <button
              role="menuitem"
              onClick={() => {
                setMenuOpen(false);
                router.push("/profile");
              }}
              className={cn(
                "flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50"
              )}
            >
              <UserIcon className="h-4 w-4 text-zinc-400" aria-hidden="true" />
              Profile
            </button>
            <button
              role="menuitem"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
