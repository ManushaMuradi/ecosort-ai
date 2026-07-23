import Image from "next/image";
import { Logo } from "@/components/ui/Logo";

/**
 * Split-screen shell for Login/Register: a full-bleed illustration
 * panel with the brand story on desktop, collapsing to just the form
 * (with a small logo lockup) on mobile — the illustration is a nice-
 * to-have on a wide screen, not something worth the vertical space it
 * would cost on a phone.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-white">
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-accent-700 p-10 lg:flex xl:w-[45%]">
        <Image
          src="/images/illustrations/auth-hero.svg"
          alt=""
          fill
          priority
          className="object-cover opacity-90"
        />
        <div className="relative z-10 flex items-center gap-2">
          <Logo size={32} />
          <span className="text-lg font-semibold text-white">EcoSort</span>
        </div>
        <div className="relative z-10 max-w-sm">
          <h2 className="text-2xl font-semibold text-white">Sort smarter. Waste less.</h2>
          <p className="mt-2 text-sm text-accent-50/90">
            Look up disposal and recycling guidance for any item, and help your community sort
            waste the right way.
          </p>
        </div>
      </div>

      <div className="flex w-full flex-col items-center justify-center bg-zinc-50 px-4 py-12 lg:w-1/2 xl:w-[55%]">
        <div className="mb-8 flex items-center gap-2 lg:hidden">
          <Logo size={32} />
          <span className="text-base font-semibold text-zinc-900">EcoSort</span>
        </div>
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
