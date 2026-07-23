import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-4 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100">
        <FileQuestion className="h-6 w-6 text-zinc-500" aria-hidden="true" />
      </div>
      <div>
        <h1 className="text-lg font-semibold text-zinc-900">Page not found</h1>
        <p className="mt-1 text-sm text-zinc-500">
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
        </p>
      </div>
      <Link
        href="/dashboard"
        className="text-sm font-medium text-accent-600 hover:text-accent-700"
      >
        Back to dashboard →
      </Link>
    </div>
  );
}
