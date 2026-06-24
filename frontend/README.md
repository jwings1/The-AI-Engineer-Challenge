# 🧘 MindfulChat — Frontend

A calm, friendly chat UI for the AI Engineer Challenge backend. It talks to the
FastAPI `/api/chat` endpoint and renders a supportive-coach conversation with
typing indicators, graceful error handling, and a clean, high-contrast design.

Built with **Next.js (App Router) + React + TypeScript**, ready to run locally
and to ship on **Vercel**.

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
- The **backend running** — see the
  [backend setup guide](../api/README.md). By default it listens on
  `http://localhost:8000`.

---

## 🚀 Run it locally (the 30-second version)

From this `frontend/` folder:

```bash
# 1. Install dependencies (first time only)
npm install

# 2. Start the dev server
npm run dev
```

Then open **http://localhost:3000** and start chatting. 🎉

> Make sure the backend is also running (in a second terminal) and that it has an
> `OPENAI_API_KEY` set — otherwise you'll see a friendly
> "OPENAI_API_KEY not configured" message instead of a reply.

---

## 🔌 How the frontend talks to the backend

The UI always calls the **relative** path `/api/chat`. We never hardcode the
backend host into the client code. Instead, [`next.config.js`](./next.config.js)
**proxies** every `/api/*` request to the backend:

```
browser  ──►  /api/chat  ──►  (Next.js rewrite)  ──►  http://localhost:8000/api/chat
```

This keeps the client identical across every environment. To point the proxy at
a different backend (for example a separately deployed one), set an env var:

```bash
# frontend/.env.local
API_PROXY_TARGET=https://your-backend-url.example.com
```

(See [`.env.local.example`](./.env.local.example).)

---

## 🏗️ Production build

```bash
npm run build   # compile + type-check + optimize
npm run start   # serve the production build on http://localhost:3000
```

---

## ☁️ Deploying to Vercel

This app deploys like any Next.js project. The recommended setup for this
challenge is **two Vercel projects**:

1. **Backend** — deploy the repo's `/api` FastAPI function (the repo's root
   `vercel.json` already routes everything to `api/index.py`). Set the
   `OPENAI_API_KEY` environment variable in the Vercel dashboard.
2. **Frontend** — deploy this `frontend/` folder as its own project, and set
   `API_PROXY_TARGET` to your backend's public URL so the proxy points at it.

> Tip: From the `frontend/` folder run `vercel` and follow the prompts. Don't
> forget to add the `API_PROXY_TARGET` environment variable in the Vercel UI.

---

## 🗂️ Project structure

```
frontend/
├── app/
│   ├── layout.tsx     # root layout + metadata
│   ├── page.tsx       # the chat UI (client component)
│   └── globals.css    # the calming theme
├── next.config.js     # /api/* proxy to the backend
├── tsconfig.json
└── package.json
```

Be kind to yourself. 💜
