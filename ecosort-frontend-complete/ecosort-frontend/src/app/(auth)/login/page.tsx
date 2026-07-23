import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { LoginForm } from "@/features/auth/LoginForm";

export const metadata: Metadata = { title: "Sign in — EcoSort" };

export default function LoginPage() {
  return (
    <Card className="px-6 py-8 sm:px-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-zinc-900">Sign in</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Enter your credentials to access your account.
        </p>
      </div>

      <LoginForm />

      <p className="mt-6 text-center text-sm text-zinc-500">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-accent-600 hover:text-accent-700">
          Create one
        </Link>
      </p>
    </Card>
  );
}
