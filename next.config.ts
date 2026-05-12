import type { NextConfig } from "next";

// When deploying to GitHub Pages the app lives at:
//   https://<user>.github.io/Fotografia/
// Change REPO_NAME if you ever rename the repository.
const REPO_NAME = "Fotografia";

// In development (next dev) we don't need a basePath so the dev server
// keeps working at http://localhost:3000 without any path prefix.
const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  // ── Static Export ────────────────────────────────────────────────────────
  // Tells Next.js to produce a fully-static site in the `out/` directory.
  // Required for GitHub Pages (no Node.js server available).
  output: "export",

  // ── Path Prefix ──────────────────────────────────────────────────────────
  // GitHub Pages serves the site under /Fotografia/ — these two settings
  // keep all internal links and asset URLs correct in production.
  basePath: isProd ? `/${REPO_NAME}` : "",
  assetPrefix: isProd ? `/${REPO_NAME}/` : "",

  // ── Images ───────────────────────────────────────────────────────────────
  // next/image's built-in optimization requires a running server.
  // With `output: 'export'` we disable it so <Image> still works statically.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
