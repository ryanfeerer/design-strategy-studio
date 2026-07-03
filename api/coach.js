// A Vercel Serverless Function. Any file in /api becomes a live endpoint
// automatically — Vercel detects this at deploy time, no separate server,
// no extra config. This runs in both `vercel dev` (locally) and production
// with the exact same code path, which is the point: no dev/prod split.
//
// The frontend calls this at POST /api/coach. This function holds the
// Anthropic API key (from Vercel's environment variables) and forwards the
// request — the key never reaches the browser.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("ANTHROPIC_API_KEY is not set in this environment.");
    return res.status(500).json({ error: "Server is missing ANTHROPIC_API_KEY." });
  }

  try {
    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(req.body),
    });
    const data = await upstream.json();
    res.status(upstream.status).json(data);
  } catch (err) {
    console.error("Error forwarding request to Anthropic:", err);
    res.status(502).json({ error: "Could not reach Anthropic's API." });
  }
}
