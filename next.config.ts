import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  serverExternalPackages: ["mongoose"],
  images: {
    // Blog covers are pasted as URLs; allow any https host and let Next optimise them.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  async redirects() {
    // Earlier URLs for the exam pages now live inside the department pages.
    return [
      { source: "/programs/nclex", destination: "/programs/nursing#nclex", permanent: true },
      { source: "/programs/celpip", destination: "/programs/english#celpip", permanent: true },
    ];
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
