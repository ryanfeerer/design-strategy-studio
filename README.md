# Design Strategy Studio

A standalone Vite + React project for running the app locally, outside of Claude.ai.

## Setup

```bash
npm install
cp .env.example .env
```

Open `.env` and add your own Anthropic API key (get one at https://console.anthropic.com/settings/keys):

```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

Then run it:

```bash
npm run dev
```

Open the URL it prints (usually `http://localhost:5173`).

## About the AI coaching calls — read this before you're confused why it doesn't work

Inside Claude.ai, this app's coaching calls (`askClaude` in `App.jsx`) went straight to `https://api.anthropic.com` with no API key visible in the code — that's because Claude.ai's artifact sandbox authenticates and proxies those calls for you invisibly. Outside that sandbox, none of that exists, and two real problems show up:

1. **Anthropic's API doesn't allow direct browser calls.** There's no CORS support for calling it straight from client-side JavaScript, regardless of whether you have a key.
2. **You should never put an API key in client-side code anyway** — anyone who opens dev tools could read it out of the bundle and run up charges on your account.

So this project includes a small **dev-only proxy**, configured in `vite.config.js`. The app calls a relative path (`/api/anthropic/v1/messages`); Vite's dev server catches that, forwards it to Anthropic, and injects your API key from `.env` along the way. Your key lives only in `.env` (which is git-ignored) and in the Vite process — it's never sent to the browser.

**This proxy only exists while `npm run dev` is running.** If you run `npm run build` to create a production build, there's no server behind that build to do this forwarding — the coaching calls will fail with the same CORS problem, because there's nothing listening at `/api/anthropic` anymore. To actually deploy this somewhere, you'd need a real backend (a small Express/Node server, a serverless function, a Cloudflare Worker, etc.) that does the same job the dev proxy is doing now — hold the API key server-side, accept a request from the frontend, forward it to Anthropic, return the response. That's genuinely a separate, small piece of infrastructure work, not something `npm run build` gives you for free.

## Project structure

```
├── index.html            entry HTML
├── vite.config.js        dev server + the Anthropic proxy described above
├── tailwind.config.js
├── postcss.config.js
├── .env.example          copy to .env and add your key
└── src/
    ├── main.jsx           React entry point
    ├── index.css          Tailwind directives
    └── App.jsx            the entire application (this is what you've been editing in Claude.ai)
```

Everything the app does — all the screens, the strategy wall, the handbook, exports, save/load — lives in the single `src/App.jsx` file, same as it did as a Claude.ai artifact. Nothing about the app's structure changed; this is just the scaffolding needed to run that same file outside Claude.ai.

## Local save/load and exports

These work exactly as they did in Claude.ai — project save/load is a JSON file download/upload, and exports are Markdown downloads and browser print-to-PDF. None of that depends on the API proxy, so it'll work even if you skip the API key setup entirely — only the live AI coaching responses require it.
