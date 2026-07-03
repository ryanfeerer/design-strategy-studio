import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

dotenv.config();

// This proxy exists so the browser never holds the Anthropic API key directly.
// The client calls the relative path "/api/anthropic/v1/messages"; Vite's dev
// server forwards that to https://api.anthropic.com/v1/messages and injects
// the x-api-key header itself, reading the key from the local .env file.
//
// This ONLY runs in `npm run dev`. A production build (`npm run build`) has
// no server behind it, so this proxy will not exist — see README.md for
// what a real deployment needs instead.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/anthropic": {
        target: "https://api.anthropic.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/anthropic/, ""),
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq) => {
            const apiKey = process.env.ANTHROPIC_API_KEY;
            if (apiKey) {
              proxyReq.setHeader("x-api-key", apiKey);
              proxyReq.setHeader("anthropic-version", "2023-06-01");
            }
          });
        },
      },
    },
  },
});
