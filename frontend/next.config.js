/** @type {import('next').NextConfig} */

// Production backend (the FastAPI app deployed as its own Vercel project).
const PROD_BACKEND_URL = "https://ai-engineer-challenge-backend-three.vercel.app";

// Where the FastAPI backend lives. Resolution order:
//   1. An explicit API_PROXY_TARGET env var (use a *plain*, non-sensitive var —
//      Vercel "Sensitive" vars are not injected into the build).
//   2. On Vercel (process.env.VERCEL is set) -> the deployed backend URL.
//   3. Locally -> the uvicorn dev server on port 8000.
let API_TARGET =
  process.env.API_PROXY_TARGET ||
  (process.env.VERCEL ? PROD_BACKEND_URL : "http://localhost:8000");

// Defensive: rewrites require an absolute URL with a scheme.
if (!/^https?:\/\//i.test(API_TARGET)) {
  API_TARGET = `https://${API_TARGET}`;
}

const nextConfig = {
  // Proxy every /api/* request from the frontend to the FastAPI backend.
  // This lets the UI call the relative path "/api/chat" in all environments,
  // which keeps the client code identical between local dev and production.
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_TARGET}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
