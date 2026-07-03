# Design Strategy Studio

A standalone Vite + React project, deployed as a static site with one small Vercel Serverless Function for AI coaching.

## Why there's a `/api` folder at all

Anthropic's API can't be called directly from a browser (no CORS support for browser origins), and an API key should never live in client-side code anyway. Something has to sit between the browser and Anthropic, holding the key. `api/coach.js` is that thing — a single Vercel Serverless Function. Vercel automatically turns any file in `/api` into a live endpoint at deploy time; there's no server to run or manage yourself.

## Local development

```bash
npm install
cp .env.example .env
```

Add your Anthropic API key to `.env` (get one at https://console.anthropic.com/settings/keys):

```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

Then run:

```bash
npm run dev
```

This runs `vercel dev`, not `vite dev` directly — that matters. `vercel dev` runs your Vite frontend **and** the `/api/coach.js` function together, locally, exactly matching how they'll run in production. (First run may ask you to log in / link the project to Vercel — that's normal and only needed once.)

## Deploying

```bash
vercel deploy
```

or connect the repo in the Vercel dashboard for automatic deploys on push — either way, Vercel builds the static frontend and deploys `api/coach.js` as a function automatically, no extra configuration needed.

**Before your first deploy, set the API key in Vercel itself** — `.env` is git-ignored and never gets deployed:

```bash
vercel env add ANTHROPIC_API_KEY
```

or add it in the dashboard under Project Settings → Environment Variables. Do this for both Production and Preview environments if you want coaching to work on preview deploys too.

## If coaching ever stops working again

- **Check the function's logs** in the Vercel dashboard (Deployments → your deployment → Functions → `api/coach`). `coach.js` logs a clear error if `ANTHROPIC_API_KEY` is missing, rather than failing silently.
- **Rate limits:** the app automatically retries once on a 429 or 5xx response before giving up, so one busy moment shouldn't dead-end a student — but sustained 429s under real classroom load mean your Anthropic account needs a higher rate limit, not a code fix.
- If you ever see the old "coaching is temporarily unavailable" message coming back after a deploy, the first thing to check is whether `api/coach.js` is still present and whether the environment variable is still set on that specific Vercel environment (Production vs. Preview vars are separate).

## Project structure

```
├── index.html
├── api/
│   └── coach.js         the only server-side code — proxies coaching requests to Anthropic
├── vite.config.js        plain Vite config, no proxy (see "why" above)
├── tailwind.config.js
├── postcss.config.js
├── .env.example           copy to .env for local dev; set the real value in Vercel for production
└── src/
    ├── main.jsx           React entry point
    ├── index.css          Tailwind directives
    └── App.jsx             the entire application
```

## Local save/load and exports

These don't touch the server at all — project save/load is a JSON file download/upload, and exports are Markdown downloads and browser print-to-PDF. Only live AI coaching needs `api/coach.js` and the API key.
