import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Always revalidate the HTML document so device browsers never serve a stale page.
  // Hashed static chunks under /_next/static keep their long-lived immutable caching.
  async headers() {
    return [
      {
        source: '/',
        headers: [
          { key: 'Cache-Control', value: 'no-store, must-revalidate' },
        ],
      },
    ];
  },
};

export default nextConfig;
