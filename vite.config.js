import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// No dev proxy here on purpose. Use `vercel dev` for local development
// instead of `vite dev` directly — it runs the Vite frontend AND the
// /api serverless functions together, matching production exactly.
// See README.md.
export default defineConfig({
  plugins: [react()],
});
