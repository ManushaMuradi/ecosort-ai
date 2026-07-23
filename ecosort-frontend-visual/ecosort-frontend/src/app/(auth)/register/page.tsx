import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { RegisterForm } from "@/features/auth/RegisterForm";

export const metadata: Metadata = { title: "Create account — EcoSort" };

export default function RegisterPage() {
  return (
    <Card className="px-6 py-8 sm:px-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-zinc-900">Create your account</h1>
        <p className="mt-1 text-sm text-zinc-500">Join EcoSort to start managing waste smarter.</p>
      </div>

      <RegisterForm />

      <p className="mt-6 text-center text-sm text-zinc-500">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-accent-600 hover:text-accent-700">
          Sign in
        </Link>
      </p>
    </Card>
  );
}
