# Brand Strategy Builder

A standalone, fully static Vite + React app. No AI, no API keys, no backend, no ongoing costs — the value is entirely in the structure, the questions, and the sequence.

## Run it locally

```bash
npm install
npm run dev
```

## Deploy it

```bash
npm run build
```

Deploy the `dist/` folder anywhere that serves static files — Vercel, Netlify, GitHub Pages, an S3 bucket, a plain file server. There is nothing else to configure. No environment variables, no server process, no API key.

## What's in it

Students walk in with a client brief and walk out with a complete Brand Strategy document: Executive Summary, The Challenge, Key Insight, Audience, Opportunity, Positioning, Differentiators, Attributes, Pillars, Philosophy, Voice & Tone, Persona, and Creative Direction. Research and Patterns are supporting work along the way — they inform the strategy but aren't part of the final document.

Critique Prep gives students pre-written questions from seven professional perspectives (Creative Director, Client, Professor, and others) to rehearse defending their strategy before a real classroom critique.

## Project structure

```
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx
    ├── index.css
    └── App.jsx        the entire application
```

## Save/load and export

Project save/load is a JSON file download/upload. The finished Brand Strategy exports as Markdown or as a PDF (via the browser's print dialog). All local, no server involved.
