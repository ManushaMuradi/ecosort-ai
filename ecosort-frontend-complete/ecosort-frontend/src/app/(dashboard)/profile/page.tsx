"use client";

import { Mail, Phone, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/lib/auth/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null; // ProtectedRoute guarantees this won't render unauthenticated

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-lg font-semibold text-zinc-900">Profile</h1>
      <p className="mt-1 text-sm text-zinc-500">Your account details.</p>

      <Card className="mt-6 p-6">
        <div className="flex items-center gap-4 border-b border-zinc-100 pb-6">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-100 text-lg font-semibold text-accent-700">
            {user.fullName
              .split(" ")
              .map((p) => p[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()}
          </span>
          <div>
            <p className="text-base font-medium text-zinc-900">{user.fullName}</p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {user.roles.map((role) => (
                <span
                  key={role}
                  className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600"
                >
                  {role.replaceAll("_", " ")}
                </span>
              ))}
            </div>
          </div>
        </div>

        <dl className="mt-6 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
            <div>
              <dt className="text-xs text-zinc-500">Email</dt>
              <dd className="text-sm text-zinc-900">{user.email}</dd>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
            <div>
              <dt className="text-xs text-zinc-500">Phone</dt>
              <dd className="text-sm text-zinc-900">{user.phone ?? "Not provided"}</dd>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
            <div>
              <dt className="text-xs text-zinc-500">Account status</dt>
              <dd className="text-sm text-zinc-900">{user.status}</dd>
            </div>
          </div>
        </dl>
      </Card>
    </div>
  );
}
