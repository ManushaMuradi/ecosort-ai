import Image from "next/image";

interface LogoProps {
  variant?: "icon" | "full";
  size?: number;
  className?: string;
}

/**
 * The one place the EcoSort brand mark is rendered from — Sidebar,
 * MobileNav, and the auth layout all use this instead of each
 * duplicating an <Image> call, so updating the logo asset later means
 * changing one file, not four.
 */
export function Logo({ variant = "icon", size = 28, className }: LogoProps) {
  if (variant === "full") {
    return (
      <Image
        src="/images/logo.svg"
        alt="EcoSort"
        width={140}
        height={33}
        priority
        className={className}
      />
    );
  }

  return (
    <Image
      src="/images/logo-icon.svg"
      alt="EcoSort"
      width={size}
      height={size}
      priority
      className={className}
    />
  );
}
