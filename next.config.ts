import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow images from the WordPress backend (khabarxp.in) and common CDNs.
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "khabarxp.in" },
      { protocol: "https", hostname: "i0.wp.com" },
      { protocol: "https", hostname: "i1.wp.com" },
      { protocol: "https", hostname: "i2.wp.com" },
      { protocol: "https", hostname: "secure.gravatar.com" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  // Tell Next.js this site is a news site with predictable revalidation needs.
  experimental: {
    // Allow streaming responses for the homepage.
    largePageDataBytes: 128 * 1024,
  },
  // Pass through WordPress REST API responses with reasonable headers.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
