"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Truck } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonTable } from "@/components/ui/SkeletonTable";
import { Pagination } from "@/components/ui/Pagination";
import { WasteRequestTable } from "@/features/waste-requests/WasteRequestTable";
import { RequestFilterBar } from "@/features/waste-requests/RequestFilterBar";
import { useWasteRequests } from "@/hooks/useWasteRequests";
import { useAuth } from "@/lib/auth/AuthContext";
import type { WasteRequestStatus } from "@/types/wasteRequest.types";

/**
 * ONE route serving all three roles — see the design doc for why this
 * isn't three near-duplicate pages. useWasteRequests picks the right
 * backend endpoint (me / assigned / all) internally; this component
 * only decides page-level chrome (title, filter visibility, the "New
 * Request" button) based on the same viewerRole it gets back.
 */
export default function WasteRequestsPage() {
  const { user } = useAuth();
  const [page, setPage] = useState(0);
  const [status, setStatus] = useState<WasteRequestStatus | "">("");

  const { data, isLoading, error, refetch, viewerRole } = useWasteRequests(
    page,
    status || undefined
  );

  const isCitizen = user?.roles.includes("CITIZEN") ?? false;
  const isEmpty = !isLoading && !error && data?.content.length === 0;

  const title =
    viewerRole === "CITIZEN"
      ? "My Pickup Requests"
      : viewerRole === "COLLECTOR"
        ? "Assigned Pickups"
        : "Manage Pickup Requests";

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-zinc-900">{title}</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {viewerRole === "CITIZEN"
              ? "Track your waste pickup requests from submission to verification."
              : viewerRole === "COLLECTOR"
                ? "Pickups assigned to you, awaiting collection."
                : "Every pickup request across the platform."}
          </p>
        </div>
        {isCitizen && (
          <Link href="/requests/new">
            <Button className="gap-1.5 w-full sm:w-auto">
              <Plus className="h-4 w-4" aria-hidden="true" />
              New Request
            </Button>
          </Link>
        )}
      </div>

      {viewerRole !== "CITIZEN" && (
        <div className="mt-4">
          <RequestFilterBar
            value={status}
            onChange={(value) => {
              setStatus(value);
              setPage(0);
            }}
          />
        </div>
      )}

      <Card className="mt-4 overflow-hidden">
        {isLoading && <SkeletonTable rows={6} columns={5} />}

        {error && !isLoading && (
          <EmptyState
            icon={Truck}
            title="Couldn't load pickup requests"
            description={error}
            action={<Button onClick={refetch}>Try again</Button>}
          />
        )}

        {isEmpty && (
          <EmptyState
            icon={Truck}
            title={viewerRole === "CITIZEN" ? "No pickup requests yet" : "Nothing here yet"}
            description={
              viewerRole === "CITIZEN"
                ? "Submit your first pickup request and track its progress here."
                : viewerRole === "COLLECTOR"
                  ? "You don't have any assigned pickups right now."
                  : "No pickup requests match this filter."
            }
            action={
              isCitizen && (
                <Link href="/requests/new">
                  <Button className="gap-1.5">
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    New Request
                  </Button>
                </Link>
              )
            }
          />
        )}

        {!isLoading && !error && data && data.content.length > 0 && (
          <>
            <WasteRequestTable requests={data.content} viewerRole={viewerRole} />
            <Pagination
              page={data.page}
              totalPages={data.totalPages}
              totalElements={data.totalElements}
              pageSize={data.size}
              onPageChange={setPage}
            />
          </>
        )}
      </Card>
    </div>
  );
}
