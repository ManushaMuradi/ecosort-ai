"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Phone, Calendar, StickyNote, Truck } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { RequestStatusBadge } from "@/features/waste-requests/RequestStatusBadge";
import { RequestStatusTimeline } from "@/features/waste-requests/RequestStatusTimeline";
import { AssignCollectorModal } from "@/features/waste-requests/AssignCollectorModal";
import { CancelRequestModal } from "@/features/waste-requests/CancelRequestModal";
import { UpdateStatusButton } from "@/features/waste-requests/UpdateStatusButton";
import { VerifyCollectionButton } from "@/features/waste-requests/VerifyCollectionButton";
import { useWasteRequest } from "@/hooks/useWasteRequest";
import { useRequestHistory } from "@/hooks/useRequestHistory";
import { useAuth } from "@/lib/auth/AuthContext";

/**
 * ONE detail page for all three roles. The timeline is identical for
 * everyone; the single action area below it is conditional on
 * (role, ownership/assignment, current status) — see the design
 * doc's action matrix. Most viewers of most requests will see no
 * action at all (e.g. an admin viewing a REQUESTED request they
 * haven't assigned yet still sees the Assign action, but a citizen
 * viewing their own VERIFIED request sees nothing further to do —
 * that's correct, not a bug).
 */
export default function WasteRequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const { data: request, isLoading, error, refetch } = useWasteRequest(id);
  const { data: history, isLoading: historyLoading, error: historyError, refetch: refetchHistory } =
    useRequestHistory(id);

  const [assignOpen, setAssignOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);

  function refetchAll() {
    refetch();
    refetchHistory();
  }

  const roles = user?.roles ?? [];
  const isAdmin = roles.includes("MUNICIPAL_ADMIN") || roles.includes("SUPER_ADMIN");
  const isOwningCitizen = !!request && request.citizen.id === user?.id;
  const isAssignedCollector = !!request && request.collector?.id === user?.id;

  const canCancel = isOwningCitizen && request?.status === "REQUESTED";
  const canAssign = isAdmin && request?.status === "REQUESTED";
  const canMarkCollected = isAssignedCollector && request?.status === "SCHEDULED";
  const canVerify = isAdmin && request?.status === "COLLECTED";

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/requests"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to requests
      </Link>

      <div className="mt-4">
        {isLoading && (
          <Card className="p-6">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="mt-3 h-4 w-full max-w-md" />
            <Skeleton className="mt-2 h-4 w-24" />
          </Card>
        )}

        {error && !isLoading && (
          <Card className="p-6">
            <EmptyState icon={Truck} title="Request not found" description={error} />
          </Card>
        )}

        {request && !isLoading && (
          <Card className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-xl font-semibold text-zinc-900">Pickup Request</h1>
                <p className="mt-0.5 text-sm text-zinc-500">
                  Submitted by {request.citizen.fullName}
                  {request.collector && ` · Collector: ${request.collector.fullName}`}
                </p>
              </div>
              <RequestStatusBadge status={request.status} />
            </div>

            {/* Single column on mobile, two columns from sm up */}
            <div className="mt-5 grid grid-cols-1 gap-4 border-t border-zinc-100 pt-5 sm:grid-cols-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
                <div className="text-sm text-zinc-700">
                  {request.address.line1}
                  {request.address.line2 && `, ${request.address.line2}`}
                  <br />
                  {request.address.city}
                  {request.address.state && `, ${request.address.state}`} {request.address.postalCode}
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
                <span className="text-sm text-zinc-700">{request.contactPhone}</span>
              </div>
              {request.preferredPickupDate && (
                <div className="flex items-center gap-2.5">
                  <Calendar className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
                  <span className="text-sm text-zinc-700">
                    Preferred: {new Date(request.preferredPickupDate).toLocaleDateString()}
                  </span>
                </div>
              )}
              {request.pickupNotes && (
                <div className="flex items-start gap-2.5 sm:col-span-2">
                  <StickyNote className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
                  <span className="text-sm text-zinc-700">{request.pickupNotes}</span>
                </div>
              )}
            </div>

            <div className="mt-5 border-t border-zinc-100 pt-5">
              <h2 className="text-sm font-semibold text-zinc-900">Items</h2>
              <ul className="mt-2 divide-y divide-zinc-100">
                {request.items.map((item) => (
                  <li key={item.id} className="flex items-center justify-between py-2 text-sm">
                    <div>
                      <span className="font-medium text-zinc-900">{item.wasteItem.name}</span>
                      <span className="ml-2 text-xs text-zinc-500">{item.wasteItem.categoryName}</span>
                    </div>
                    <span className="text-zinc-600">
                      {item.quantity} × {item.estimatedWeightKg.toFixed(1)} kg
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {(canCancel || canAssign || canMarkCollected || canVerify) && (
              <div className="mt-5 flex flex-wrap gap-2 border-t border-zinc-100 pt-5">
                {canAssign && (
                  <Button onClick={() => setAssignOpen(true)}>Assign Collector</Button>
                )}
                {canMarkCollected && <UpdateStatusButton requestId={id} onUpdated={refetchAll} />}
                {canVerify && <VerifyCollectionButton requestId={id} onVerified={refetchAll} />}
                {canCancel && (
                  <Button variant="danger" onClick={() => setCancelOpen(true)}>
                    Cancel Request
                  </Button>
                )}
              </div>
            )}
          </Card>
        )}
      </div>

      {request && (
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-zinc-900">Status history</h2>
          <Card className="mt-3 p-5">
            <RequestStatusTimeline entries={history} isLoading={historyLoading} error={historyError} />
          </Card>
        </div>
      )}

      {request && (
        <>
          <AssignCollectorModal
            open={assignOpen}
            requestId={id}
            onClose={() => setAssignOpen(false)}
            onAssigned={refetchAll}
          />
          <CancelRequestModal
            open={cancelOpen}
            requestId={id}
            onClose={() => setCancelOpen(false)}
            onCancelled={refetchAll}
          />
        </>
      )}
    </div>
  );
}
