import type { NextConfig } from "next";

/**
 * Security headers applied to every route.
 * A strict Content-Security-Policy is intentionally left out for now:
 * Next.js injects inline scripts, so a real CSP needs a nonce set in middleware.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Self-contained server bundle, used by the production Docker image.
  output: "standalone",
  poweredByHeader: false,
  experimental: {
    // Only ship the Drei helpers we actually import.
    optimizePackageImports: ["@react-three/drei"],
  },
  headers: async () => [{ source: "/:path*", headers: securityHeaders }],
};

export default nextConfig;
