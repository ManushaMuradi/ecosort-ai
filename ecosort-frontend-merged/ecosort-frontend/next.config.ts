import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Every SVG under /public/images is hand-authored and committed to
    // the repo, never user-uploaded — safe to let next/image optimize
    // them. (This flag defaults to false because *untrusted* SVGs can
    // carry embedded scripts; that risk doesn't apply to static assets
    // we wrote ourselves.)
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
