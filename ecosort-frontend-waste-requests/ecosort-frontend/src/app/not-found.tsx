import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-2 bg-white px-4 text-center">
      <Image
        src="/images/illustrations/not-found-404.svg"
        alt=""
        width={280}
        height={200}
        priority
        className="h-auto w-64 sm:w-72"
      />
      <div className="mt-2">
        <h1 className="text-lg font-semibold text-zinc-900">Page not found</h1>
        <p className="mt-1 text-sm text-zinc-500">
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
        </p>
      </div>
      <Link
        href="/dashboard"
        className="mt-2 text-sm font-medium text-accent-600 hover:text-accent-700"
      >
        Back to dashboard →
      </Link>
    </div>
  );
}
