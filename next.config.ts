import type { NextConfig } from "next";

/** Hosts that serve CMS media: the Django API (Render) and, if configured, Cloudinary. */
function mediaPatterns() {
  const urls = [process.env.API_URL, process.env.NEXT_PUBLIC_API_URL].filter(Boolean) as string[];
  const patterns = urls.map((u) => {
    const { protocol, hostname, port } = new URL(u);
    return { protocol: protocol.replace(":", "") as "http" | "https", hostname, port, pathname: "/media/**" };
  });
  return [...patterns, { protocol: "https" as const, hostname: "res.cloudinary.com", pathname: "/**" }];
}

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    remotePatterns: mediaPatterns(),
    qualities: [70, 80],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
