import { Recycle } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 py-12">
      <div className="mb-8 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent-600">
          <Recycle className="h-5 w-5 text-white" aria-hidden="true" />
        </div>
        <span className="text-base font-semibold text-zinc-900">EcoSort</span>
      </div>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
