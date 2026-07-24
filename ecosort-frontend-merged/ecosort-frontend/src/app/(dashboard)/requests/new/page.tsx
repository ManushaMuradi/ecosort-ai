"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { PickupRequestForm } from "@/features/waste-requests/PickupRequestForm";
import { useAuth } from "@/lib/auth/AuthContext";

export default function NewWasteRequestPage() {
  const { user } = useAuth();
  const isCitizen = user?.roles.includes("CITIZEN") ?? false;

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/requests"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to requests
      </Link>

      <Card className="mt-4 p-6">
        <h1 className="text-lg font-semibold text-zinc-900">Request a pickup</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Add one or more waste items and we&apos;ll arrange a collector.
        </p>

        {isCitizen ? (
          <div className="mt-6">
            <PickupRequestForm />
          </div>
        ) : (
          <p className="mt-6 text-sm text-zinc-500">
            Only citizens can submit pickup requests.
          </p>
        )}
      </Card>
    </div>
  );
}
