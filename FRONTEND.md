# 🧘 MindfulChat — Frontend

A calm, friendly chat UI for the AI Engineer Challenge backend. It talks to the
FastAPI `/api/chat` endpoint and renders a supportive-coach conversation with
typing indicators, graceful error handling, and a clean, high-contrast design.

Built with **Next.js (App Router) + React + TypeScript**. The frontend lives at
the **repo root** and the FastAPI backend lives in [`api/`](./api), so the whole
thing deploys as a **single Vercel project**.

---

## ✨ What you get

- 💬 A real chat experience — user/assistant bubbles, auto-growing input box,
  `Enter` to send (`Shift+Enter` for a newline).
- ⏳ A "typing…" indicator while the assistant thinks.
- ⚠️ Friendly error messages (it surfaces the backend's actual error detail).
- 🎨 A soothing, accessible palette — no white-text-on-white nonsense here.
- 🔌 Zero API-key handling in the browser. The key stays safely on the backend.

---

## 🧰 Prerequisites

- [Node.js](https://nodejs.org/) 18.18+ (tested on Node 20)
- The backend dependencies installed and a running FastAPI server — see the
  [backend setup guide](./api/README.md). By default it listens on
  `http://localhost:8000`.

---

## 🚀 Run it locally

You need **two terminals** (frontend + backend), both from the repo root.

**Terminal 1 — backend** (FastAPI on port 8000):

```bash
uv run uvicorn api.index:app --reload
# (ensure OPENAI_API_KEY is set, e.g. in a .env file at the repo root)
```

**Terminal 2 — frontend** (Next.js on port 3000):

```bash
npm install      # first time only
npm run dev
```

Then open **http://localhost:3000** and start chatting. 🎉

> If the backend has no valid `OPENAI_API_KEY`, you'll see a friendly error
> bubble instead of a reply — that's the UI surfacing the backend's error.

---

## 🔌 How the frontend talks to the backend

The UI always calls the **relative** path `/api/chat` — the client code is
identical in every environment:

- **Local dev:** [`next.config.js`](./next.config.js) proxies `/api/*` to the
  uvicorn backend at `http://localhost:8000` (override with `API_PROXY_TARGET`).
- **Production (Vercel):** `/api/*` is served by the FastAPI function on the
  **same origin** (see [`vercel.json`](./vercel.json)), so no proxy is needed —
  the rewrite is automatically skipped when `VERCEL` is set.

```
dev:   browser ─► /api/chat ─► (Next rewrite) ─► http://localhost:8000/api/chat
prod:  browser ─► /api/chat ─► (vercel.json)  ─► api/index.py  (same domain)
```

---

## 🏗️ Production build

```bash
npm run build   # compile + type-check + optimize
npm run start   # serve the production build on http://localhost:3000
```

---

## ☁️ Deploying to Vercel (single project)

Everything deploys together from the repo root:

1. Connect this repo to a Vercel project (framework preset: **Next.js**).
2. Add the `OPENAI_API_KEY` environment variable in the Vercel dashboard
   (used by the Python function at runtime).
3. Push to your default branch — Vercel builds the Next.js app **and** the
   `api/index.py` serverless function, and [`vercel.json`](./vercel.json) routes
   `/api/*` to it. Done.

---

## 🗂️ Project structure

```
.
├── app/                # Next.js App Router (the chat UI)
│   ├── layout.tsx      # root layout + metadata
│   ├── page.tsx        # the chat UI (client component)
│   └── globals.css     # the calming theme
├── api/
│   └── index.py        # FastAPI backend (/api/chat, /api/health)
├── next.config.js      # dev-only /api proxy to the backend
├── vercel.json         # prod routing of /api/* to the Python function
├── package.json
└── pyproject.toml      # backend (Python) dependencies
```

Be kind to yourself. 💜
