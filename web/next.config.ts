import type { NextConfig } from "next";

// Static export served by Firebase Hosting. Redirects/rewrites live in ../firebase.json
// because `output: "export"` ignores next.config redirects.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true, // matches the inherited WordPress URLs exactly
  images: { unoptimized: true },
};

export default nextConfig;
