import path from "node:path";
import type { NextConfig } from "next";

/**
 * Base path is injected at build time so the same source can be deployed to:
 *  - a user/organisation site  -> https://<user>.github.io/            (BASE_PATH="")
 *  - a project site            -> https://<user>.github.io/<repo>/     (BASE_PATH="/<repo>")
 *  - a custom domain           -> https://sinakafi.com                 (BASE_PATH="")
 */
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/+$/, "");

const nextConfig: NextConfig = {
  // Fully static output — the `out/` directory is what GitHub Pages serves.
  output: "export",

  // Emits `about/index.html` instead of `about.html`, which GitHub Pages
  // resolves without any extra rewrite rules.
  trailingSlash: true,

  basePath,
  assetPrefix: basePath || undefined,

  // The Next.js image optimiser needs a server; static export cannot use it.
  images: { unoptimized: true },

  reactStrictMode: true,

  // Pin the Turbopack root to this project so a lockfile in a parent
  // directory (e.g. the developer's home folder) is never picked up.
  turbopack: { root: path.resolve(process.cwd()) },
};

export default nextConfig;
