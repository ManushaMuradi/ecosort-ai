"use client";

import Link from "next/link";
import { ChevronRight, Package, User as UserIcon, Truck } from "lucide-react";
import { RequestStatusBadge } from "@/features/waste-requests/RequestStatusBadge";
import type { WasteRequestSummary } from "@/types/wasteRequest.types";

interface WasteRequestTableProps {
  requests: WasteRequestSummary[];
  /** Which identity column to show — a citizen's own list doesn't need "citizen", a collector's assigned list doesn't need "collector" repeated, admin sees both. */
  viewerRole: "CITIZEN" | "COLLECTOR" | "ADMIN";
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, { dateStyle: "medium" });
}

/**
 * Two complete, independent layouts — a real <table> hidden below
 * `sm`, and a stacked-card list hidden at `sm` and above — rather than
 * one markup structure trying to serve both via CSS tricks. A pickup
 * request row carries five-plus meaningful fields (citizen, collector,
 * status, items, weight, date); trying to squeeze that into a
 * horizontally-scrolled table on a 320px screen would be unreadable,
 * so this table gets a genuine card layout instead of the
 * overflow-x-auto pattern used by the simpler Category/WasteItem
 * tables.
 */
export function WasteRequestTable({ requests, viewerRole }: WasteRequestTableProps) {
  const showCitizen = viewerRole !== "CITIZEN";
  const showCollector = viewerRole !== "COLLECTOR";

  return (
    <>
      {/* Desktop / tablet: real table */}
      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-100 text-xs uppercase tracking-wide text-zinc-500">
              {showCitizen && <th className="px-4 py-3 font-medium">Citizen</th>}
              {showCollector && <th className="px-4 py-3 font-medium">Collector</th>}
              <th className="px-4 py-3 font-medium">Items</th>
              <th className="px-4 py-3 font-medium">Weight</th>
              <th className="px-4 py-3 font-medium">Preferred date</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {requests.map((req) => (
              <tr key={req.id} className="group transition-colors hover:bg-zinc-50">
                {showCitizen && (
                  <td className="px-4 py-3 text-zinc-700">{req.citizen.fullName}</td>
                )}
                {showCollector && (
                  <td className="px-4 py-3 text-zinc-700">
                    {req.collector?.fullName ?? (
                      <span className="text-zinc-400">Unassigned</span>
                    )}
                  </td>
                )}
                <td className="px-4 py-3 text-zinc-700">{req.itemCount}</td>
                <td className="px-4 py-3 text-zinc-700">
                  0.0 kg
                </td>
                <td className="px-4 py-3 text-zinc-700">{formatDate(req.preferredPickupDate)}</td>
                <td className="px-4 py-3">
                  <RequestStatusBadge status={req.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/requests/${req.id}`}
                    aria-label="View details"
                    className="inline-flex items-center gap-0.5 text-sm font-medium text-accent-600 hover:text-accent-700"
                  >
                    View
                    <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: stacked cards */}
      <div className="divide-y divide-zinc-100 sm:hidden">
        {requests.map((req) => (
          <Link
            key={req.id}
            href={`/requests/${req.id}`}
            className="flex flex-col gap-2 px-4 py-3.5 active:bg-zinc-50"
          >
            <div className="flex items-center justify-between gap-2">
              <RequestStatusBadge status={req.status} />
              <span className="text-xs text-zinc-400">{formatDate(req.preferredPickupDate)}</span>
            </div>
            {showCitizen && (
              <div className="flex items-center gap-1.5 text-sm text-zinc-700">
                <UserIcon className="h-3.5 w-3.5 shrink-0 text-zinc-400" aria-hidden="true" />
                {req.citizen.fullName}
              </div>
            )}
            {showCollector && (
              <div className="flex items-center gap-1.5 text-sm text-zinc-700">
                <Truck className="h-3.5 w-3.5 shrink-0 text-zinc-400" aria-hidden="true" />
                {req.collector?.fullName ?? <span className="text-zinc-400">Unassigned</span>}
              </div>
            )}
            <div className="flex items-center gap-1.5 text-sm text-zinc-500">
              <Package className="h-3.5 w-3.5 shrink-0 text-zinc-400" aria-hidden="true" />
              {req.itemCount} item{req.itemCount !== 1 ? "s" : ""} · 0.0 kg
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
