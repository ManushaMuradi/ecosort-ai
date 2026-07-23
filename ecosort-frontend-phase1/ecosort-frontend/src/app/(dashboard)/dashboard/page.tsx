"use client";

import { useAuth } from "@/lib/auth/AuthContext";

export default function DashboardOverviewPage() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-lg font-semibold text-zinc-900">
        Welcome back{user ? `, ${user.fullName.split(" ")[0]}` : ""}
      </h1>
      <p className="mt-1 text-sm text-zinc-500">
        Here&apos;s an overview of your waste management platform.
      </p>

      {/*
        Stat cards (total categories, total waste items, recent items,
        quick actions) are wired here once the Categories and Waste
        Items API hooks are built in the next phase — this page is
        intentionally minimal for now so the dashboard shell is
        demoable end-to-end before that data layer exists.
      */}
    </div>
  );
}
