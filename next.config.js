/** @type {import('next').NextConfig} */

// In local development the FastAPI backend runs as a separate process
// (uvicorn on port 8000), so we proxy /api/* to it. In production on Vercel,
// the FastAPI app is deployed as a serverless function under /api on the SAME
// origin (see vercel.json), so no rewrite is needed — the relative /api/chat
// call the client makes is routed straight to the Python function.
const DEV_BACKEND = process.env.API_PROXY_TARGET || "http://localhost:8000";

const nextConfig = {
  async rewrites() {
    if (process.env.VERCEL) return [];
    return [
      {
        source: "/api/:path*",
        destination: `${DEV_BACKEND}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
